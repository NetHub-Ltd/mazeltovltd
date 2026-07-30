from typing import Type, Any

from fastapi import HTTPException
from pydantic import EmailStr
from sqlalchemy import exc
from sqlalchemy.orm import Session
from ..core.config import settings

from .base import CRUDBase
from ..core import security
from app.models.models import User
from ..schemas.user import UserCreate, UserUpdate, UserResponse


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def create_user(self, db: Session, obj_in: UserCreate) -> User:
        hashed_password = security.get_password_hash(obj_in.password)

        # Prepare user data and ensure the hashed password is set correctly
        user_data = obj_in.model_dump()
        user_data['hashed_password'] = hashed_password

        if user_data['email'] == settings.admin_email:
            user_data['super_user'] = True
        else:
            user_data['super_user'] = False

        # Remove plain password from user data
        if 'password' in user_data:
            del user_data['password']

        # Create a new user instance
        db_obj = self.model(**user_data)

        try:
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        except exc.IntegrityError as error:
            db.rollback()
            raise HTTPException(status_code=409, detail='user already exist')

    # def create_superuser(self, db, obj_in: CreateSuperUser):
    #     obj_in.hashed_password = get_password_hash(obj_in.hashed_password)
    #     superuser_data = obj_in.model_dump()
    #     db_obj = self.model(**superuser_data)
    #     return self.create(db, obj_in=db_obj)

    def get_by_email(self, db: Session, email: EmailStr):
        try:
            user_by_email = db.query(self.model).filter(self.model.email == email).one()
        except exc.NoResultFound as error:
            return None
        return user_by_email

    def authenticate(self, db: Session, email: EmailStr, password) -> Type[User] | None:
        db_user = self.get_by_email(db, email)
        if db_user is None:
            raise HTTPException(status_code=401, detail='unauthorized')
        if not security.verify_password(password, db_user.hashed_password):
            return None
        return db_user

    def is_active(self, obj: User):
        if not obj.is_active:
            raise HTTPException(status_code=403, detail="User Not Active")
        return obj

    def is_superuser(self, obj: User):
        return obj.super_user

    def activate_user(self, user_obj: User, db: Session):
        if not user_obj.is_active:
            user_obj.is_active = True
        try:
            db.add(user_obj)
            db.commit()
            db.refresh(user_obj)
            return user_obj
        except exc.IntegrityError as error:
            db.rollback()
            raise HTTPException(status_code=409, detail="Duplicate Data")


user = CRUDUser(User)
