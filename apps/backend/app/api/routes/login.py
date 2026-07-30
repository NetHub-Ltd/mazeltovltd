from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Response, Cookie, BackgroundTasks, Request
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import EmailStr, BaseModel
from sqlalchemy.orm import Session

from app.api import dependancies as deps
from app.core.security import create_access_token, validate_access_token
from app.crud import crudUsers
from app.models.models import User
from app.schemas.user import UserResponse
from app.schemas.token import TokenResponse
from app.core.config import settings
from app.utilities.utils import send_password_reset_mail
from app.utilities.logger import logger

router = APIRouter()


@router.post("/access-token", status_code=200, response_model=TokenResponse)
def login(
        response: Response,
        db: Session = Depends(deps.get_db),
        form_data: OAuth2PasswordRequestForm = Depends()
):
    user = crudUsers.user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if user is None:
        raise HTTPException(status_code=401, detail="wrong email or password")

    # Create a new access token
    access_token = create_access_token(user.id)
    # Clear any existing cookies
    response.delete_cookie(key='token')

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_SECONDS
    )


@router.get('/me', status_code=200, response_model=UserResponse)
def get_current_user(current_user: User = Depends(deps.get_current_user)):
    return current_user


@router.post('/account-recovery', status_code=200)
def account_recovery(email: EmailStr, request: Request, db: Session = Depends(deps.get_db)):
    url = request.url_for('reset_password')
    db_user = crudUsers.user.get_by_email(db, email)
    send_password_reset_mail(email=email, username=db_user.name, reset_link=url,  db=db)
    return {'detail': 'if an account with email is found reset instructions will be sent'}


@router.post("/reset-password", name="reset_password")
async def reset_password_handler(token: str,  db: Session = Depends(deps.get_db)):
    """ Endpoint to reset password using a token.
    """
    # Validate the token and reset the password
    try:
        token_data = validate_access_token(token)
        user = crudUsers.user.get(db, id=int(token_data.sub))
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        # Here you would typically reset the password, but for this example, we just return the user
        return user
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)



class UserData(BaseModel):
    name: Optional[str] = None
    picture: Optional[str] = None
    email: EmailStr


@router.post("/google",status_code=200)
async def google_login(user: UserData, db: Session = Depends(deps.get_db)):
    # payload = await request.json()
    logger.info(f"authentication hit: {user.email}")

    user = crudUsers.user.get_by_email(db, user.email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

        # Create a new access token
    access_token = create_access_token(user.id)
    # Clear any existing cookies
    # response.delete_cookie(key='token')

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_SECONDS
    )

