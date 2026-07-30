import uuid
from datetime import datetime, timezone
from typing import Optional

from pydantic import EmailStr
from sqlalchemy import DateTime, text
from sqlalchemy import Enum as SAEnum
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlmodel import SQLModel, Field, Column

from app.schemas.bingwa import OfferCategory, BingwaTags
from app.schemas.schemas import TransactionStatus, TransactionType


def uuid_no_dash() -> str:
    """Generate a UUID without dashes."""
    return uuid.uuid4().hex  # hex gives a 32-char string without dashes

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=50)
    email: str = Field(unique=True, max_length=100)
    hashed_password: str = Field(max_length=300)
    is_active: bool = Field(default=True)
    super_user: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )

class SecurityCode(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    code: int = Field(unique=True)
    expires: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# class SEOPage(SQLModel, table=True):
#     id: Optional[int] = Field(default=None, primary_key=True)
#     slug: str = Field(index=True, unique=True)  # e.g. "contact", "product/sokoni"
#     title: str
#     description: str
#     keywords: Optional[str] = ""
#     og_image: Optional[str] = None  # OpenGraph image
#     created_at: datetime = Field(
#         default_factory=lambda: datetime.now(timezone.utc),
#         sa_column=Column(DateTime(timezone=True), nullable=False)
#     )
#     updated_at: datetime = Field(
#         default_factory=lambda: datetime.now(timezone.utc),
#         sa_column=Column(DateTime(timezone=True), nullable=False)
#     )


class Contact(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: Optional[str] = None
    address: Optional[str] = None
    phone_number: str = Field(unique=True, index=True, max_length=20)
    source: Optional[str] = Field(default="web", max_length=30)
    tag: Optional[str] = Field(default=None, max_length=50) # this can be used to separate the contacts, lets say sms promotion segment etc
    opted_in: bool = Field(default=True)
    email: Optional[EmailStr] = None
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )
    created_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), server_default=text("NOW()"), nullable=False)
    )



class Messages(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    # phone: str
    email: str
    message: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )


class BingwaOffer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    label: str
    price: int
    validity: str
    description: str = Field(default="can be bought once per day")
    active: bool = Field(default=True, index=True, nullable=True)
    category: OfferCategory
    # tag: Optional[BingwaTags] = Field(default=None, index=True)
    tag: BingwaTags = Field(
        sa_column=Column(
            SAEnum(BingwaTags, name="bingwatags", create_type=True)  # <-- real DB enum
        )
    )

    times_purchased: int = Field(default=0)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )



# 1️⃣ Define the Enum



# 2️⃣ Model using UUID hex ID + Enum for status
class MpesaTransaction(SQLModel, table=True):
    id: str = Field(
        default_factory=lambda: uuid.uuid4().hex,  # UUIDv4 in hex form
        primary_key=True,
        index=True
    )
    merchant_request_id: str = Field(index=True)
    checkout_request_id: str = Field(index=True)
    # Enforce allowed values in Python and DB
    status: TransactionStatus = Field(
        sa_column=SQLAlchemyEnum(TransactionStatus, name="transaction_status")
    )
    mpesa_receipt_number: Optional[str] = Field(default=None, index=True, unique=True)
    receiving_number: Optional[str] = Field(default=None, index=True)
    paying_number: Optional[str] = Field(default=None, index=True)
    points_awarded: Optional[float] = Field(default=0.0, index=True)
    payment_reference_id: Optional[int] = Field(default=None, index=True)
    # Product reference (generic)
    payment_type: TransactionType = Field(
            sa_column=Column(SQLAlchemyEnum(TransactionType), nullable=False)
        )

    amount: int
    transaction_date: datetime
    result_code: int = Field(index=True)
    result_desc: str

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )




class Clients(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    api_key: str = Field(index=True, unique=True)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )




class LoyaltyAccount(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    phone_number: str = Field(index=True, unique=True)
    total_points: float = Field(default=0.0)
    points_earned: float = Field(index=True)
    total_amount_spent: float = Field(default=0.0)
    redeemed_points: Optional[float] = None
    last_redeemed_at: Optional[datetime] = None
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )


class IntrusionLog(SQLModel, table=True):
    id: str = Field(default_factory=uuid_no_dash, primary_key=True, index=True)
    ip: str = Field(index=True, max_length=64)
    method: str = Field(max_length=16, index=True)
    path: Optional[str] = Field(default=None, index=True, max_length=2048)
    origin: Optional[str] = Field(default=None, max_length=512, index=True)
    referer: Optional[str] = Field(default=None, max_length=2048)
    user_agent: Optional[str] = Field(default=None, max_length=1024)
    headers_json: Optional[str] = Field(default=None, sa_column_kwargs={"nullable": True})
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )


# 1. Search Analytics
class SearchAnalytics(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    query: str = Field(index=True)
    page_url: str = Field(index=True)
    country: str = Field(index=True)
    clicks: int
    impressions: int
    ctr: float
    position: float
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )


# 2. Inspection Result
class InspectionResult(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    page_url: str = Field(index=True)
    verdict: str  # overall verdict from inspection API
    coverage_state: str
    robots_txt_state: str
    indexing_state: str
    last_crawl_time: datetime
    page_fetch_state: str
    indexing_result: str
    mobile_verdict: str  # from mobileUsabilityResult.verdict
    rich_results_verdict: str  # from richResultsResult.verdict
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )



class Sitemap(SQLModel, table=True):
    id: str = Field(default_factory=uuid_no_dash, primary_key=True, index=True)
    path: str = Field(nullable=False, index=True)
    type: str = Field(nullable=False)
    is_pending: bool = Field(nullable=False, default=False)
    is_sitemaps_index: bool = Field(nullable=False, default=False)
    last_submitted: Optional[datetime] = Field(default=None)
    last_downloaded: Optional[datetime] = Field(default=None)
    warnings: int = Field(default=0)
    errors: int = Field(default=0)
    content_type: str = Field(nullable=False)
    content_submitted: int = Field(default=0)
    content_indexed: int = Field(default=0)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )
