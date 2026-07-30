from datetime import datetime, timedelta
from typing import Any, Union

from fastapi import HTTPException
from jose import JWTError, jwt
from passlib.context import CryptContext
from starlette import status

from ..core.config import settings
from ..schemas.token import Token, TokenPayLoad

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

algorithm = settings.algorithm


def verify_password(plain_password: str, hashed_password: str) -> bool:
    result = pwd_context.verify(plain_password, hashed_password)
    return result


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(
        subject: Union[str, Any], expires_delta: timedelta = None
) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            seconds=settings.ACCESS_TOKEN_EXPIRE_SECONDS
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    validation = Token(**to_encode)
    data = validation.model_dump()
    encoded_jwt = jwt.encode(data, settings.secret, algorithm=algorithm)
    return encoded_jwt


def validate_access_token(token: str) -> TokenPayLoad:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret, algorithms=[settings.algorithm])
        token_data = TokenPayLoad(**payload)
        if token_data.sub is None:
            raise credentials_exception
        now = settings.get_local_time_with_timezone()
        if now > token_data.exp:
            raise credentials_exception
    except JWTError as error:
        raise credentials_exception
    return token_data
