import asyncio
import random
from datetime import datetime, timedelta

import httpx

import random
from datetime import datetime, timedelta

import requests
from fastapi import HTTPException, UploadFile
from jinja2 import Environment, FileSystemLoader
from pydantic import EmailStr
from sqlalchemy import exc
from sqlalchemy.orm import Session

from app.core.config import settings
from .logger import log
from ..communications.email_client import send_email_internal
from app.models.models import SecurityCode


def security_code(db: Session):
    # should generate and save the code in db
    """
    :param request:
    :param db:
    :return:
    """
    code = random.randrange(100000, 1000000)
    db_obj = SecurityCode(code=code,
                                    expires=datetime.utcnow() + timedelta(seconds=3600)
                                    )
    # Add the ORM model instance to the session
    try:
        db.add(db_obj)

        # Commit the transaction to save the data
        db.commit()

        # Refresh to get any additional info from the database (e.g., auto-generated id)
        db.refresh(db_obj)
        return db_obj.code
    except exc.IntegrityError as e:
        log.error("duplicate Data: {e}")
        db.rollback()
        return db_obj.code


def send_password_reset_mail(email: EmailStr, username, reset_link, db):
    try:
        # Load the Jinja2 template
        env = Environment(loader=FileSystemLoader(settings.template_path))
        template = env.get_template('password_reset_email.html')
        # Render the template
        link = f'{reset_link}?code={security_code(db)}'
        log.info(link)
        html_content = template.render(username=username, reset_link=link)
        send_email_internal(email, 'Password Reset', html_content, html=True)
        log.info(f'Email Sent Successfully to {email}')
    except Exception as e:
        log.error(e)
        raise HTTPException(status_code=500, detail=str(e))


def upload_image_to_imgur(image_file: UploadFile) -> str:
    headers = {'Authorization': f'Client-ID {settings.imgur_client_id}'}
    files = {'image': (image_file.filename, image_file.file, image_file.content_type)}

    response = requests.post("https://api.imgur.com/3/upload", headers=headers, files=files)

    if response.status_code == 200:
        return response.json()['data']['link']  # Get the Imgur link
    else:
        print("Error:", response.json())
        raise HTTPException(status_code=500, detail="Failed to upload image to Imgur")

from app.utilities.logger import log


BASE_URL = settings.DOMAIN  # Set this statically

async def ping_self():
    await asyncio.sleep(5)  # Wait for the server to start
    full_url = f"{BASE_URL}/health"

    async with httpx.AsyncClient() as client:
        while True:
            try:
                response = await client.get(full_url)
                log.info(f"Ping response: {response.status_code}")
            except Exception as e:
                log.error(f"Ping failed: {e}")

            sleep_minutes = random.randint(5, 14)
            await asyncio.sleep(sleep_minutes * 60)


def reward_points(amount_paid: float, rate = settings.loyalty_rate) -> float:
    """
    Calculate loyalty points based on the amount paid.
    For every 20 units of currency, 1 point is earned.
    """
    return amount_paid / rate  # or simply return amount_paid / 20 for non-integer points