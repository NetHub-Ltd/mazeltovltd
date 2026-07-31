import subprocess
import uvicorn
import sys
import os
from sqlalchemy import text
from app.crud import crudUsers
from app.models.models import BingwaOffer
from app.utilities import seed_offers

from app.core.config import settings
from app.db.session import engine
from app.utilities.logger import log
from app.schemas.user import UserCreate
from sqlmodel import Session, select

from app.utilities.seed_offers import offer_seed_list


def save_offers():
    with Session(engine) as session:
        """
        Seed offers into the database if they don't already exist.
        Returns the number of inserted records.
        """
        # Fetch existing IDs once

        # Filter out already-present
        new_offers = [
            BingwaOffer(**data)
            for data in offer_seed_list
        ]

        session.add_all(new_offers)
        session.commit()
        log.info(f"Seeded {len(new_offers)} Bingwa Offers")
        return len(new_offers)

def run_migrations():
    try:
        print("🔄 Running Alembic migrations...")
        subprocess.run(["alembic", "upgrade", "head"], check=True)
        log.info("✅ Migrations applied successfully.")
    except subprocess.CalledProcessError as e:
        log.error("❌ Migration failed:{e}")
        sys.exit(1)

def seed_superuser():
    from app.models.models import User  # adjust to your project structure
    log.info("🌱 Checking for default superuser...")
    with Session(engine) as session:
        user = crudUsers.user.get_by_email(session, settings.admin_email)
        if not user:
            user_obj = UserCreate(
                name=settings.admin_name,
                email=settings.admin_email,
                password=settings.admin_password
            )
            user = crudUsers.user.create_user(session, user_obj)
            # superuser = User(email=settings.admin_email, password=settings.admin_email, is_admin=True)
            session.add(user)
            session.commit()
            log.info("✅ Superuser created.")
        else:
            log.info("ℹ️ Superuser already exists.")

def start_server():
    log.info("🚀 Starting FastAPI server...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000)

def main():
    # run_migrations()
    seed_superuser()  # optional
    # save_offers()
    start_server()

if __name__ == "__main__":
    main()
