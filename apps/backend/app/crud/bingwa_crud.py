from datetime import datetime
from typing import List, Dict

from sqlalchemy import Date
from sqlalchemy.orm import Session
from sqlalchemy.sql import cast
from sqlmodel import func

from app.core.config import settings
from app.crud.base import CRUDBase
from app.models.models import MpesaTransaction, BingwaOffer
from app.schemas.bingwa import BingwaCreate, BingwaUpdate, BingwaTags
from app.schemas.schemas import TransactionType, TransactionStatus
from app.services.mpesa_client import MpesaClient

class BingwaCRUD(CRUDBase[BingwaOffer, BingwaCreate, BingwaUpdate]):
    """
    CRUD operations for Bingwa model.
    Inherits from CRUDBase to provide basic CRUD functionality.
    """

    def get_offers_by_category(self, db: Session, category: str) -> List[BingwaOffer]:
        return db.query(self.model).filter(self.model.category == category).all()

    def get_sales_summary(self, db: Session) -> Dict[str, int]:
        count, total_amount = db.query(
            func.count(MpesaTransaction.id),
            func.sum(MpesaTransaction.amount)
        ).filter(MpesaTransaction.status == "success").one()

        return {
            "total_sales": count,
            "total_amount": total_amount or 0
        }


    def get_top_selling_offers(self, db: Session, limit: int = 5):
        results = (
            db.query(
                BingwaOffer.label.label("label"),
                func.count(MpesaTransaction.id).label("total_sales"),
            )
            .join(
                MpesaTransaction,
                BingwaOffer.id == MpesaTransaction.payment_reference_id,
            )
            .filter(
                MpesaTransaction.payment_type == TransactionType.BINGWA_OFFER,
                MpesaTransaction.status == TransactionStatus.SUCCESS,
            )
            .group_by(BingwaOffer.id)
            .order_by(func.count(MpesaTransaction.id).desc())
            .limit(limit)
            .all()
        )

        # 🔥 Make it JSON safe
        return [
            {"label": row.label, "total_sales": row.total_sales}
            for row in results
        ]

    def get_popular_offers(self, db: Session, limit: int = 10) -> List[BingwaOffer]:
        return db.query(self.model).filter(self.model.tag == BingwaTags.popular).limit(limit).all()

    def get_loyalty_offers(self, db: Session, limit: int = 10) -> List[BingwaOffer]:
        return db.query(self.model).filter(self.model.tag == BingwaTags.loyalty).limit(limit).all()


    def get_daily_sales_summary(self, db: Session) -> List[dict]:
        rows = db.query(
            cast(MpesaTransaction.transaction_date, Date).label("date"),
            func.count(MpesaTransaction.id).label("transactions"),
            func.sum(MpesaTransaction.amount).label("total")
        ).filter(
            MpesaTransaction.status == "success"
        ).group_by(
            cast(MpesaTransaction.transaction_date, Date)
        ).order_by(
            cast(MpesaTransaction.transaction_date, Date).desc()
        ).all()

        return [
            {
                "date": row.date.isoformat(),
                "transactions": row.transactions,
                "total_amount": row.total or 0
            }
            for row in rows
        ]
bingwa = BingwaCRUD(BingwaOffer)  # Create an instance of the CRUD class for BingwaOffer

bingwa_mpesa_client = MpesaClient(
    mpesa_base_url=settings.mpesa_base_url,
    consumer_key=settings.bingwa_mpesa_consumer_key,
    consumer_secret=settings.bingwa_mpesa_consumer_secret,
    shortcode=settings.bingwa_mpesa_shortcode,
    passkey=settings.bingwa_mpesa_passkey,
)

