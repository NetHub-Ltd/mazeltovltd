from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.api.dependancies import get_db

router = APIRouter()

@router.get('/messages', status_code=200)
def get_messages(limit: int = 50, db: Session = Depends(get_db)):
    pass