from pydantic import BaseModel, EmailStr
from typing import Optional, Union, List
from datetime import datetime



class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    pass


class UserResponse(UserBase):
    id: int
    is_active: bool
    super_user: bool
    # products: List[ProductInDb]
