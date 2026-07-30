from datetime import datetime, timezone
from math import floor

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.crud.base import CRUDBase
from app.schemas.schemas import LoyaltyCreateSchema, LoyaltyUpdateSchema, LoyaltyRedeemSchema
from app.models.models import LoyaltyAccount
from app.utilities.logger import logger
from app.utilities.utils import reward_points


class LoyaltyCRUD(CRUDBase[LoyaltyAccount, LoyaltyCreateSchema, LoyaltyUpdateSchema]):
    def create_record(self, db: Session, *, obj_in: LoyaltyCreateSchema) -> LoyaltyAccount:

        if obj_in.amount_paid <= 0:
            raise HTTPException(status_code=400, detail="Amount spent has to be above 0")

        points_earned = reward_points(obj_in.amount_paid)

        # check if record exists
        record: LoyaltyAccount = self.filter_by_phone_number(db, obj_in.phone_number)
        if record is not None:
            # optionally handle updating existing record
            logger.info(f"Record already exists, updating {points_earned} points")
            record.points_earned = points_earned
            record.total_points += points_earned
            record.total_amount_spent += obj_in.amount_paid
            db.add(record)
            db.commit()
            db.refresh(record)
            return record

        logger.info("Creating a new record")
        new_record = LoyaltyAccount(
            phone_number=obj_in.phone_number,
            points_earned=points_earned,
            total_points=points_earned,
            total_amount_spent=obj_in.amount_paid,
        )

        db.add(new_record)
        db.commit()
        db.refresh(new_record)  # ⬅️ important: get DB-generated id

        return new_record

    def filter_by_phone_number(self, db: Session, phone_number: str) -> LoyaltyAccount:
        return db.query(LoyaltyAccount).filter(LoyaltyAccount.phone_number == phone_number).first()

    def get_by_id(self, db: Session, id: int) -> LoyaltyAccount:
        return db.query(LoyaltyAccount).filter(LoyaltyAccount.id == id).first()

    def get_all(self, db: Session, limit: int = 100) -> list[LoyaltyAccount]:
        return db.query(LoyaltyAccount).limit(limit).all()

    def update_record(self, db: Session, db_obj: LoyaltyAccount, obj_in: LoyaltyUpdateSchema) -> LoyaltyAccount:
        for key, value in obj_in.model_dump(exclude_unset=True).items():
            setattr(db_obj, key, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def redeem_points(self, db: Session, data: LoyaltyRedeemSchema) -> LoyaltyAccount:
        # record = self.filter_by_phone_number(db, phone_number)
        record = self.get_by_id(db, id=data.id)
        if record is None:
            raise HTTPException(status_code=404, detail="Loyalty account not found")

        if data.points > record.total_points:
            raise HTTPException(status_code=400, detail="Insufficient points to redeem")

        if data.points < settings.loyalty_minimum:
            raise HTTPException(status_code=400, detail=f"Minimum redeemable points is {settings.loyalty_minimum}")

        record.redeemed_points = (record.redeemed_points or 0) + data.points
        record.total_points -= data.points
        record.last_redeemed_at = datetime.now(timezone.utc)

        db.add(record)
        db.commit()
        db.refresh(record)

        return record






loyalty = LoyaltyCRUD(LoyaltyAccount)