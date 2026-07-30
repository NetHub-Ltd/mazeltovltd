import enum
from datetime import datetime, timezone
from typing import Generic, Optional, TypeVar
import phonenumbers
from pydantic import BaseModel
from pydantic import EmailStr  # <--- CHANGE THIS LINE
from pydantic import GetCoreSchemaHandler
from pydantic.json_schema import GetJsonSchemaHandler, JsonSchemaValue
from pydantic_core import core_schema
from sqlmodel import SQLModel, Field

T = TypeVar("T")


import re
from pydantic import GetCoreSchemaHandler
from pydantic_core import core_schema
from pydantic.json_schema import GetJsonSchemaHandler, JsonSchemaValue


class PhoneNumber(str):
    """
    Custom validated Kenyan phone number type.

    ✅ Accepts flexible input formats:
       - 07XXXXXXXX
       - 01XXXXXXXX
       - 7XXXXXXXX
       - 1XXXXXXXX
       - 2547XXXXXXXX / 2541XXXXXXXX
       - +2547XXXXXXXX / +2541XXXXXXXX
       - With spaces, dashes, or brackets.

    ✅ Always normalizes to E.164 without '+':
       → 2547XXXXXXXX or 2541XXXXXXXX

    ❌ Rejects anything that doesn’t match Kenyan number rules.
    """

    # Regex to match digits (ignores spaces, dashes, brackets, etc.)
    _clean_pattern = re.compile(r"\D+")

    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type, _handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.no_info_after_validator_function(
            cls.validate,
            core_schema.str_schema(),
        )

    @classmethod
    def __get_pydantic_json_schema__(
        cls, _schema: core_schema.CoreSchema, _handler: GetJsonSchemaHandler
    ) -> JsonSchemaValue:
        return {
            "type": "string",
            "format": "phone",
            "example": "254712345678",
            "description": (
                "Kenyan phone number in international format (E.164 without '+'). "
                "Example: 254712345678"
            ),
        }

    @classmethod
    def validate(cls, v: str) -> str:
        if not v:
            raise ValueError("Phone number cannot be empty")

        # Remove non-digits (spaces, dashes, etc.)
        digits = cls._clean_pattern.sub("", v)

        # Normalize based on prefix
        if digits.startswith("254") and len(digits) == 12:
            normalized = digits
        elif digits.startswith("0") and len(digits) == 10:
            normalized = "254" + digits[1:]
        elif (digits.startswith("7") or digits.startswith("1")) and len(digits) == 9:
            normalized = "254" + digits
        elif digits.startswith("254") and len(digits) == 13 and digits.startswith("2540"):
            # Handle edge case like "25407XXXXXXXX"
            normalized = "254" + digits[3:]
        else:
            raise ValueError(
                f"Invalid Kenyan phone number format: {v!r}. "
                "Expected formats: 07XXXXXXXX, 01XXXXXXXX, 7XXXXXXXX, 1XXXXXXXX, 2547XXXXXXXX, +2547XXXXXXXX."
            )

        # Validate prefix and length
        if not (normalized.startswith("2547") or normalized.startswith("2541")):
            raise ValueError("Must start with '2547' or '2541'")

        if len(normalized) != 12:
            raise ValueError("Phone number must be exactly 12 digits in normalized format")

        return normalized


class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"

class TransactionType(str, enum.Enum):
    BINGWA_OFFER = "bingwa_offer"
    AIRTIME = "airtime"


class ApiResponse(BaseModel, Generic[T]):  # <--- CHANGE THIS LINE
    success: bool
    status_code: int
    client_message: str
    data: Optional[T]


# _____________________Contacts________________

class CreateContactSchema(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    phone_number: PhoneNumber
    source: Optional[str] = None
    tag: Optional[str] = None
    updated_at: Optional[datetime] = None


class UpdateContactSchema(CreateContactSchema):
    phone_number: PhoneNumber


class ContactsResponseSchema(CreateContactSchema):
    id: int
    created_at: datetime
    updated_at: datetime


class SmsContactsResponseSchema(BaseModel):
    phone_number: PhoneNumber


class IntrusionLogCreate(BaseModel):
    ip: str = Field(..., max_length=64)
    method: str = Field(..., max_length=16)
    path: Optional[str] = Field(None, max_length=2048)
    origin: Optional[str] = Field(None, max_length=512)
    referer: Optional[str] = Field(None, max_length=2048)
    user_agent: Optional[str] = Field(None, max_length=1024)
    headers_json: Optional[str] = None


class STKPushPayload(BaseModel):
    BusinessShortCode: str
    Password: str
    Timestamp: str
    TransactionType: str = "CustomerPayBillOnline"
    Amount: int
    PartyA: str
    PartyB: str
    PhoneNumber: str
    CallBackURL: str
    AccountReference: str
    TransactionDesc: str

    class Config:
        populate_by_name = True  # so you can init with field names or aliases

# Mpesa Transactions


# 1️⃣ Create schema — minimum at init
class TransactionCreate(BaseModel):
    merchant_request_id: str
    checkout_request_id: str
    payment_reference_id: Optional[int] = None  # optional, can be set later
    amount: int
    paying_number: PhoneNumber
    payment_type: TransactionType
    receiving_number: PhoneNumber

    # auto-filled
    status: TransactionStatus = TransactionStatus.PENDING
    transaction_date: datetime = datetime.now(timezone.utc)
    result_code: int = 0
    result_desc: str = "Pending"


# 2️⃣ Update schema — what callback brings
class TransactionUpdate(BaseModel):
    result_code: int
    result_desc: str
    mpesa_receipt_number: Optional[str] = None
    amount: Optional[int] = None
    points_awarded: Optional[float] = None
    transaction_date: Optional[datetime] = None
    status: Optional[TransactionStatus] = None

# ____________Loyalty Program_________________

class LoyaltyCreateSchema(SQLModel):
    phone_number: PhoneNumber
    amount_paid: float

class LoyaltyUpdateSchema(LoyaltyCreateSchema):
    redeemed_points: float
    last_redeemed_at: datetime
    total_points: float

class LoyaltyRedeemSchema(BaseModel):
    id: int
    points: float


class LoyaltyResponse(SQLModel):
    id: int
    phone_number: str
    total_points: float
    redeemed_points: Optional[float] = None
    last_redeemed_at: Optional[datetime] = None



class SearchAnalyticsSchema(BaseModel):
    query: str
    page_url: str = Field(..., alias="page")
    country: str
    clicks: int
    impressions: int
    ctr: float
    position: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

class InspectionResultSchema(BaseModel):
    page_url: str
    verdict: str = "UNKNOWN"
    coverage_state: str
    robots_txt_state: str
    indexing_state: str
    last_crawl_time: datetime
    page_fetch_state: str
    indexing_result: str
    mobile_verdict: str
    rich_results_verdict: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SitemapSchema(BaseModel):
    path: str
    type: str
    isPending: bool
    isSitemapsIndex: bool
    lastSubmitted: datetime
    lastDownloaded: datetime
    warnings: int
    errors: int

    # Flattened contents
    content_type: str
    content_submitted: int
    content_indexed: int

    class Config:
        from_attributes = True



# Example SQLModel using it

