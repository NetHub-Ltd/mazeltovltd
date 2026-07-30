from typing import Generator

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from ..core.security import validate_access_token
from ..crud import crudUsers
from ..db.session import SessionLocal
from ..models.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/access-token")

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    token_data = validate_access_token(token)
    user = crudUsers.user.get(db, id=int(token_data.sub))
    if user is None:
        raise HTTPException(status_code=401, detail='Not Authenticated')
    if not user.is_active:
        raise HTTPException(status_code=403, detail='Inactive User')
    return user

def get_current_superuser(current_user: User = Depends(get_current_user)):
    if not current_user.super_user:
        raise HTTPException(status_code=403, detail="User does not have enough privileges")
    return current_user