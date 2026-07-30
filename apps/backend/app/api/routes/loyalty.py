from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependancies import get_db, get_current_superuser
from app.crud.crud_loyalty import loyalty
from app.models.models import LoyaltyAccount, User
from app.schemas.schemas import LoyaltyRedeemSchema, ApiResponse, LoyaltyCreateSchema
from app.utilities.logger import logger

router = APIRouter(tags=['Loyalty Points Management'])


@router.get('/points', status_code=200, response_model=ApiResponse)
def fetch_points(id: int = None, phone: str = None,  db: Session = Depends(get_db), limit: int = 100):
    if id is not None:
        """
        Fetch loyalty points by ID.
        :param id: Loyalty account ID
        :param db: Database session
        :return: LoyaltyAccount object
        """
        record = db.query(LoyaltyAccount).filter(LoyaltyAccount.id == id).first()
        logger.info(f"Record fetched: {record}")
        if not record:
            raise HTTPException(status_code=404, detail="Record not found")
        return ApiResponse(success=True, status_code=200, data=[record], client_message="Record fetched successfully")
    if phone is not None:
        """
        Fetch loyalty points by phone number.
        :param phone: Phone number associated with the loyalty account
        :param db: Database session
        :return: LoyaltyAccount object
        """
        record = loyalty.filter_by_phone_number(db, phone_number=phone)
        logger.info(f"Record fetched: {record}")
        if not record:
            raise HTTPException(status_code=404, detail="Record not found")
        return ApiResponse(success=True, status_code=200, data=[record], client_message="Record fetched successfully")

    records = db.query(LoyaltyAccount).limit(limit).all()
    return ApiResponse(success=True, status_code=200, data=[records], client_message="Record fetched successfully")


@router.post("/redeem-points", status_code=200, response_model=ApiResponse[LoyaltyAccount])
def redeem_points(payload: LoyaltyRedeemSchema, db: Session = Depends(get_db)):
    """
    Redeem loyalty points for a user.

    :param current_user:
    :param payload:
    :param db: Database session
    :return: Updated LoyaltyAccount object
    """
    record = loyalty.redeem_points(db, data=payload)
    return ApiResponse(success=True, status_code=200, data=[record], client_message="Points redeemed successfully")


@router.post('/award-points', status_code=200)
def award_points(payload: LoyaltyCreateSchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_superuser)):
    """
    Award loyalty points to a user.

    :param current_user:
    :param payload:
    :param db: Database session
    :return: Updated LoyaltyAccount object
    """
    record = loyalty.create_record(db, obj_in=payload)
    return record

