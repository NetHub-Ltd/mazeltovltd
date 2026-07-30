from enum import Enum
from typing import Optional
from sqlmodel import SQLModel


class OfferCategory(str, Enum):
    data = "data"
    sms = "sms"
    minutes = "minutes"
    minutes_plus_data = "minutesPlusData"
    combo = "combo"

class BingwaTags(str, Enum):
    loyalty = "loyalty"
    popular = "popular"
    offer = "offer"

class BingwaCreate(SQLModel):
    price: int
    validity: str
    label: str
    category : OfferCategory
    description: Optional[str] = None
    tag: Optional[BingwaTags] = None

class BingwaUpdate(BingwaCreate):
    price : Optional[int] = None
    validity: Optional[str] = None
    label: Optional[str] = None
    category: Optional[OfferCategory] = None
    description: Optional[str] = None
    tag: Optional[BingwaTags] = None

class BingwaResponseSchema(SQLModel):
    id: int
    label: str
    price: int
    validity: str
    category: str
    description: str
    tag: Optional[BingwaTags] = None


