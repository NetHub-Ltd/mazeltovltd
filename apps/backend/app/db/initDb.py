from sqlalchemy.orm import Session
from app.crud.crudUsers import user
from app.models.models import User
from app.core.config import settings
from sqlalchemy import exc
from ..schemas.user import UserCreate
from .session import SessionLocal

def create_super_user(session: Session):
    try:
        superuser = session.query(User).filter(User.email == settings.admin_email).one()
        if superuser is not None:
            return superuser
    except exc.NoResultFound as error:
        # log the error
        obj_in = UserCreate(
            name=settings.admin_name,
            email=settings.admin_email,
            password=settings.admin_password
        )
        new_superuser = user.create_user(db=session, obj_in=obj_in)
        return new_superuser


def main():
    db = SessionLocal()
    init_db()
    create_super_user(session=db)