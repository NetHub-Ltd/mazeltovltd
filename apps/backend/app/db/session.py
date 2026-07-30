# import os
# from sqlalchemy import create_engine
# from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
# from sqlalchemy.orm import sessionmaker
# from dotenv import load_dotenv
#
# from app.core.config import settings
#
# # Read the base DB URL from env
# DATABASE_URL_SYNC = settings.database_url
#
# if not DATABASE_URL_SYNC:
#     raise ValueError("SQLALCHEMY_DATABASE_URL is not set in environment variables.")
#
# # Function to generate async URL based on the sync one
# def make_async_url(sync_url: str) -> str:
#     if sync_url.startswith("postgresql://"):
#         return sync_url.replace("postgresql://", "postgresql+asyncpg://", 1)
#     elif sync_url.startswith("mysql://"):
#         return sync_url.replace("mysql://", "mysql+aiomysql://", 1)
#     elif sync_url.startswith("sqlite:///"):
#         return sync_url.replace("sqlite:///", "sqlite+aiosqlite:///", 1)
#     else:
#         raise ValueError(f"Unsupported database dialect in URL: {sync_url}")
#
# DATABASE_URL_ASYNC = make_async_url(DATABASE_URL_SYNC)
#
# # --- Sync Engine & Session (for normal app use) ---
# engine = create_engine(DATABASE_URL_SYNC, future=True, echo=False)
# SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
#
# # --- Async Engine & Session (for background workers) ---
# async_engine = create_async_engine(DATABASE_URL_ASYNC, future=True, echo=False)
# AsyncSessionLocal = sessionmaker(
#     bind=async_engine,
#     class_=AsyncSession,
#     expire_on_commit=False,
#     autoflush=False,
# )
#
#
# # Dependency for async workers
# async def get_async_db():
#     async with AsyncSessionLocal() as session:
#         yield session



from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings


# --------------------
#  Build URLs
# --------------------
DATABASE_URL_SYNC = settings.database_url

def make_async_url(sync_url: str) -> str:
    if sync_url.startswith("postgresql://"):
        return sync_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif sync_url.startswith("mysql://"):
        return sync_url.replace("mysql://", "mysql+aiomysql://", 1)
    elif sync_url.startswith("sqlite:///"):
        return sync_url.replace("sqlite:///", "sqlite+aiosqlite:///", 1)
    else:
        raise ValueError(f"Unsupported database dialect in URL: {sync_url}")

DATABASE_URL_ASYNC = make_async_url(DATABASE_URL_SYNC)


# --------------------
#  Sync Engine (SAFE)
# --------------------
engine = create_engine(
    DATABASE_URL_SYNC,
    future=True,
    echo=False,
    pool_size=5,          # limits max active connections
    max_overflow=0,       # prevents uncontrolled connection spikes
    pool_pre_ping=True,   # prevents dead connections
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_db():
    """
    Safe sync DB session dependency.
    Ensures connection is always closed and returned to pool.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --------------------
#  Async Engine (SAFE)
# --------------------
async_engine = create_async_engine(
    DATABASE_URL_ASYNC,
    future=True,
    echo=False,
    pool_size=5,          # async pool limits
    max_overflow=0,       # prevents unlimited async connections
    pool_pre_ping=True,
)

AsyncSessionLocal = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_async_db():
    async with AsyncSessionLocal() as session:
        yield session
