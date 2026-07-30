from json import JSONDecodeError
from pathlib import Path
from app.api.dependancies import get_current_superuser

import requests
from alembic import command
from alembic.config import Config
from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.encoders import jsonable_encoder
from requests.exceptions import RequestException, HTTPError
from sqlalchemy.orm import Session
from app.api.dependancies import get_db
from app.models.models import User
from app.utilities import logger
from app.utilities.seed_offers import seed_offers
from app.utilities.logger import logger



async def migrate_and_startup(base_dir: Path = None ):
    # 1) locate your alembic.ini (adjust if yours live elsewhere)
    if base_dir is None:
        logger.info("Migration is being done from the admin panel")
        base_dir = Path(__file__).parent.parent.parent.parent
    alembic_cfg_path = base_dir / "alembic.ini"
    logger.info(f"alembic ini baseurl: {alembic_cfg_path}")
    # backEnd / alembic.ini

    if not alembic_cfg_path.exists():
        raise RuntimeError(f"Cannot find alembic.ini at {alembic_cfg_path}")

    # 2) create a Config object and optionally override the DB URL
    alembic_cfg = Config(str(alembic_cfg_path))

    # ‣ If you want to override the url in code, you can do:
    # db_url = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost/dbname")
    # alembic_cfg.set_main_option("sqlalchemy.url", db_url)

    # 3) run the upgrade
    command.upgrade(alembic_cfg, "head")


router = APIRouter()

@router.get('/run migrations', status_code=200)
async def alembic_migrations(current_superuser: User = Depends(get_current_superuser)):
    logger.info("Running Alembic Migrations")
    await migrate_and_startup()

@router.post("/seed-offers", status_code=201)
def seeding_offers(db: Session = Depends(get_db), admin: User = Depends(get_current_superuser)):
    """
    Endpoint to seed offers into the database.
    """
    try:
        results = seed_offers(db)
        return {"message": "Offers seeded successfully"}
    except (RequestException, HTTPError, JSONDecodeError) as e:
        logger.error(f"Error seeding offers: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")