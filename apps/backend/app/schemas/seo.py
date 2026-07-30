from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class SEOPageBase(BaseModel):
    slug: str
    title: str
    description: str
    keywords: str
    og_image: Optional[str] = None

class SEOPageCreate(SEOPageBase):
    pass

class SEOPageUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    keywords: Optional[str] = None
    og_image: Optional[str] = None

class SEOPageRead(SEOPageBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True  # replaces orm_mode
    }
