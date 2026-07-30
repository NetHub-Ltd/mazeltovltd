import logging

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

from app.db.base_class import Base
from app.db.session import engine
from alembic import command
from alembic.config import Config
from app.db.initDb import create_super_user

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

max_tries = 60 * 5  # 5 minutes
wait_seconds = 1

# Use sessionmaker to create a new session class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
def upgrade_database():
    logger.info("Running Alembic migrations to upgrade database schema")
    alembic_cfg = Config("alembic.ini")  # Specify the path to your alembic configuration file
    command.upgrade(alembic_cfg, "head")


def init(db_engine) -> None:
    try:
        with SessionLocal() as session:
            # Try to create a session to check if DB is awake
            if session.execute(text("SELECT 1")):
                # create tables
                # Base.metadata.create_all(bind=engine)  #TODO: this should be replaced with alembic
                create_super_user(session=session)
    except Exception as e:
        logger.error(e)
        raise e


def main() -> None:
    logger.info("Initializing service")
    init(engine)
    logger.info("Service finished initializing")


if __name__ == "__main__":
    main()
