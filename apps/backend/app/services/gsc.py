import copy
import json
from typing import Any, Dict, List, Optional
from datetime import date, datetime, timedelta
import asyncio

from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine
from google.oauth2 import service_account
from googleapiclient.discovery import build

from app.schemas.schemas import SitemapSchema
from app.utilities.logger import logger
from app.db.session import DATABASE_URL_ASYNC
from app.models.models import SearchAnalytics, InspectionResult, Sitemap
from app.core.config import settings


class AnalyticsPeriod(str):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"

def parse_iso8601(dt_str: str | None) -> datetime | None:
    """Parse ISO8601 strings with Z into naive UTC datetime (no tzinfo)."""
    if not dt_str:
        return None
    return datetime.fromisoformat(dt_str.replace("Z", "+00:00")).replace(tzinfo=None)




class SEOService:
    def __init__(self, async_url: str):
        self.engine = create_async_engine(async_url, echo=False, future=True)
        self.scopes = ["https://www.googleapis.com/auth/webmasters.readonly"]

        # make a deep copy so we don't mutate settings
        service_account_info = copy.deepcopy(settings.gsc_service_account_json)

        # replace literal "\n" with actual newlines
        service_account_info["private_key"] = service_account_info["private_key"].replace("\\n", "\n")

        self.credentials = service_account.Credentials.from_service_account_info(
            service_account_info,
            scopes=self.scopes
        )

        self._service = None

    async def init_service(self):
        if self._service is None:
            # googleapiclient.build is blocking → run in thread
            self._service = await asyncio.to_thread(
                build, "searchconsole", "v1", credentials=self.credentials
            )
        return self._service

    # ------------------------
    # Fetching
    # ------------------------
    async def fetch_search_analytics(
        self,
        site_url: str,
        period: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        row_limit: int = 100,
    ) -> List[Dict[str, Any]]:
        today = date.today()
        if period:
            period = period.lower()
            start_date = today
            if period == AnalyticsPeriod.WEEKLY:
                start_date -= timedelta(days=7)
            elif period == AnalyticsPeriod.MONTHLY:
                start_date -= timedelta(days=30)
        elif start_date is None or end_date is None:
            start_date = end_date = today

        service = await self.init_service()
        request = {
            "startDate": start_date.isoformat(),
            "endDate": (end_date or today).isoformat(),
            "dimensions": ["query", "page", "country"],
            "rowLimit": row_limit,
        }

        try:
            response = await asyncio.to_thread(
                lambda: service.searchanalytics().query(siteUrl=site_url, body=request).execute()
            )
            return response.get("rows", [])
        except Exception as e:
            logger.error(f"Error fetching search analytics: {e}")
            return []

    async def fetch_sitemaps(self, site_url: str) -> List[Dict[str, Any]]:
        service = await self.init_service()
        try:
            response = await asyncio.to_thread(service.sitemaps().list(siteUrl=site_url).execute)
            return response.get("sitemap", [])
        except Exception as e:
            logger.error(f"Error fetching sitemaps: {e}")
            return []

    # ------------------------
    # Processing
    # ------------------------
    async def process_and_save(
        self, raw_analytics: List[Dict[str, Any]], raw_inspections: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, int]:
        """Process analytics & inspections and save them to DB."""
        raw_inspections = raw_inspections or []

        async def build_analytics(row):
            keys = row.get("keys", ["", "", ""])
            return SearchAnalytics(
                query=keys[0] if len(keys) > 0 else "",
                page_url=keys[1] if len(keys) > 1 else "",
                country=keys[2] if len(keys) > 2 else "",
                clicks=row.get("clicks", 0),
                impressions=row.get("impressions", 0),
                ctr=row.get("ctr", 0.0),
                position=row.get("position", 0.0),
                created_at=datetime.utcnow()
            )

        async def build_inspection(row):
            return InspectionResult(
                page_url=row.get("page_url", ""),
                verdict=row.get("verdict", "UNKNOWN"),
                coverage_state=row.get("coverage_state", ""),
                robots_txt_state=row.get("robots_txt_state", ""),
                indexing_state=row.get("indexing_state", ""),
                last_crawl_time=row.get("last_crawl_time", datetime.utcnow()),
                page_fetch_state=row.get("page_fetch_state", ""),
                indexing_result=row.get("indexing_result", ""),
                mobile_verdict=row.get("mobile_verdict", ""),
                rich_results_verdict=row.get("rich_results_verdict", ""),
                created_at=datetime.utcnow()
            )

        analytics_objects, inspections_objects = await asyncio.gather(
            asyncio.gather(*(build_analytics(r) for r in raw_analytics)),
            asyncio.gather(*(build_inspection(r) for r in raw_inspections))
        )

        async with AsyncSession(self.engine) as session:
            async with session.begin():
                if analytics_objects:
                    session.add_all(analytics_objects)
                if inspections_objects:
                    session.add_all(inspections_objects)

        return {
            "analytics": len(analytics_objects),
            "inspections": len(inspections_objects),
        }

    # ------------------------
    # Public orchestration
    # ------------------------
    async def fetch_and_save_analytics(self, site_url: str, period: Optional[str] = None) -> Dict[str, int]:
        raw_analytics = await self.fetch_search_analytics(site_url, period)
        return await self.process_and_save(raw_analytics)

    async def fetch_and_save_sitemaps(self, site_url: str) -> int:
        # 1. Fetch from remote source
        raw_sitemaps = await self.fetch_sitemaps(site_url)
        logger.info(f"Raw Sitemap: {raw_sitemaps}")

        # 2. Validate raw data with Pydantic schemas
        schema_objects = [
            SitemapSchema(
                path=row.get("path", ""),
                type=row.get("type", ""),
                isPending=row.get("isPending", False),
                isSitemapsIndex=row.get("isSitemapsIndex", False),
                lastSubmitted=parse_iso8601(row.get("lastSubmitted")),
                lastDownloaded=parse_iso8601(row.get("lastDownloaded")),
                warnings=int(row.get("warnings", 0) or 0),
                errors=int(row.get("errors", 0) or 0),

                # Flattened contents
                content_type=row.get("contents", [{}])[0].get("type", "unknown"),
                content_submitted=int(row.get("contents", [{}])[0].get("submitted", 0)),
                content_indexed=int(row.get("contents", [{}])[0].get("indexed", 0)),
            )
            for row in raw_sitemaps
        ]

        # 3. Convert schema → DB models
        db_objects = [Sitemap(**schema.model_dump()) for schema in schema_objects]

        # 4. Save to DB
        async with AsyncSession(self.engine) as session:
            async with session.begin():
                if db_objects:
                    session.add_all(db_objects)

        return len(db_objects)


# Initialize service
seo_service = SEOService(
    async_url=DATABASE_URL_ASYNC
)
