from typing import Optional

from pydantic import BaseModel
from sqlalchemy import select

from app.models.models import MpesaTransaction
from .base import CRUDBase
from app.schemas.transaction import (
    MpesaTransactionCreate,
    MpesaTransactionRead,
)

from sqlalchemy.orm import Session

class CRUDTransaction(CRUDBase[MpesaTransaction, MpesaTransactionCreate, MpesaTransactionRead]):
    """
    CRUD operations for M-Pesa transactions.
    """

    def create_transaction(self, db: Session, *, obj_in: BaseModel) -> MpesaTransaction:
        """
        Create a new M-Pesa transaction record.
        """
        db_obj = self.model(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_merchant_request_id(
        self,
        db: Session,
        merchant_request_id: str
    ) -> Optional[MpesaTransaction]:
        stmt = select(self.model).where(
            self.model.merchant_request_id == merchant_request_id
        )
        result = db.execute(stmt)
        return result.scalars().first()

    def get_by_checkout_request_id(
        self,
        db: Session,
        checkout_request_id: str
    ) -> Optional[MpesaTransaction]:
        stmt = select(self.model).where(
            self.model.checkout_request_id == checkout_request_id
        )
        result = db.execute(stmt)
        return result.scalars().first()


    def get_by_mpesa_receipt_number(
        self,
        db: Session,
        mpesa_receipt_number: str
    ) -> Optional[MpesaTransaction]:
        stmt = select(self.model).where(
            self.model.mpesa_receipt_number == mpesa_receipt_number
        )
        result = db.execute(stmt)
        return result.scalars().first()

    def get_by_status(self, db: Session, status: str) -> Optional[MpesaTransaction]:
        stmt = select(self.model).where(
            self.model.status == status
        )
        result = db.execute(stmt)
        return result.scalars().all()





transaction = CRUDTransaction(MpesaTransaction)