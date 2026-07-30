from typing import List

from pydantic import EmailStr
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from app.api import dependancies
from app.api.dependancies import get_current_superuser
from app.crud import crudUsers
from app.schemas.user import UserResponse, UserUpdate, UserCreate
from typing import List
from fastapi.encoders import jsonable_encoder
from app.models.models import User
from app.utilities.utils import send_password_reset_mail

router = APIRouter()


@router.get('/get-users', status_code=200, response_model=List[UserResponse])
def get_users_multi(db: Session = Depends(dependancies.get_db), admin: User = Depends(get_current_superuser)):
    """
        Retrieve a list of all users.

        Args:
            db (Session): The database session dependency.
            user (User): The current user making the request.

        Returns:
            List[UserResponse]: A list of user details.

        Raises:
            HTTPException: If no users are found or if the current user does not have permission.
            :param db:
            :param admin:
        """
    users = crudUsers.user.get_multi(db)
    # if users is None:
    #     raise HTTPException(status_code=404, detail='Users not Found')
    # if not crudUsers.user.is_superuser(user):
    #     raise HTTPException(status_code=403, detail="You dont have permission to access users")
    return users


@router.get('/get-user/{user_id}', status_code=200, response_model=UserResponse)
def get_user_by_id(user_id: int, db: Session = Depends(dependancies.get_db),
                   admin: User = Depends(get_current_superuser)):
    """
        Retrieve a user by their ID.

        Args:
            user_id (int): The ID of the user to retrieve.
            db (Session): The database session dependency.
            current_user (User): The current user making the request.

        Returns:
            UserResponse: Details of the user with the specified ID.

        Raises:
            HTTPException: If the user is not found or if the current user does not have permission.
            :param db:
            :param user_id:
            :param admin:
        """
    user_by_id = crudUsers.user.get(db, id=user_id)
    if not crudUsers.user.is_active(admin):
        raise HTTPException(status_code=403, detail="You dont have enough permission")
    return user_by_id


@router.post('/create-user', status_code=201, response_model=UserResponse)
def create_user(db: Session = Depends(dependancies.get_db), *, obj_in: UserCreate):
    """
        Create a new user.

        Args:
            db (Session): The database session dependency.
            obj_in (UserCreate): The user creation data.

        Returns:
            UserResponse: Details of the newly created user.
            :param db:
            :param obj_in:
            :param admin:
        """
    new_user = crudUsers.user.create_user(db, obj_in=obj_in)
    return jsonable_encoder(new_user)


@router.put('/update-user/{user_id}', status_code=201, response_model=UserResponse)
def update_user(db: Session = Depends(dependancies.get_db), *, obj_in: UserUpdate, user_id: int,
                user: User = Depends(dependancies.get_current_user), admin: User = Depends(get_current_superuser)):
    """
        Update an existing user by their ID.

        Args:
            db (Session): The database session dependency.
            obj_in (UserUpdate): The updated user data.
            user_id (int): The ID of the user to update.
            user (User): The current user making the request.

        Returns:
            UserResponse: Details of the updated user.

        Raises:
            HTTPException: If the user is not found, or if the current user does not have permission to update the user.
            :param user_id:
            :param obj_in:
            :param db:
            :param user:
            :param admin:
        """
    db_obj = crudUsers.user.get(db, id=user_id)
    if db_obj is None:
        raise HTTPException(status_code=404, detail='User not Found')

    if crudUsers.user.is_superuser(user) or db_obj.id == user.id:
        updated_user = crudUsers.user.update(db, db_obj=db_obj, obj_in=obj_in)
        return updated_user
    else:
        raise HTTPException(status_code=403, detail='You dont have the permision to update this user')


@router.delete('/remove_user/{user_id}', status_code=204)
def remove_user(db: Session = Depends(dependancies.get_db), *,
                user_id: int,
                user: User = Depends(dependancies.get_current_user)):
    """
       Remove a user by their ID.

       Args:
           db (Session): The database session dependency.
           user_id (int): The ID of the user to remove.
           user (User): The current user making the request.

       Returns:
           None

       Raises:
           HTTPException: If the current user does not have permission to remove the user.
       """
    if crudUsers.user.is_superuser(user):
        remove = crudUsers.user.remove(db, id=user_id)

    else:
        raise HTTPException(status_code=403, detail="You dont have the permissions to remove this user")

