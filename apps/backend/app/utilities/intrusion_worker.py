# from __future__ import annotations
# import asyncio
# from typing import Dict, Any, List
# from contextlib import asynccontextmanager
# from sqlalchemy.ext.asyncio import AsyncSession
# from app.utilities.logger import logger
#
# from app.db.session import AsyncSessionLocal
# from app.models.models import IntrusionLog
#
# QUEUE_MAXSIZE = 1000
# BATCH_SIZE = 50
# FLUSH_INTERVAL_SECONDS = 1.0
#
# intrusion_queue: asyncio.Queue[Dict[str, Any]] = asyncio.Queue(maxsize=QUEUE_MAXSIZE)
# _worker_task: asyncio.Task | None = None
# _stop_event = asyncio.Event()
#
# async def _flush(session: AsyncSession, batch: List[Dict[str, Any]]) -> None:
#     logger.info(f"flushing a batch to the db: {len(batch)}")
#     try:
#         session.add_all([IntrusionLog(**item) for item in batch])
#         await session.commit()
#     except Exception:
#         await session.rollback()
#
# async def _worker() -> None:
#     async with AsyncSessionLocal() as session:
#         batch: List[Dict[str, Any]] = []
#         while not _stop_event.is_set():
#             try:
#                 item = await asyncio.wait_for(intrusion_queue.get(), timeout=FLUSH_INTERVAL_SECONDS)
#                 batch.append(item)
#                 if len(batch) >= BATCH_SIZE:
#                     await _flush(session, batch)
#                     batch.clear()
#             except asyncio.TimeoutError:
#                 if batch:
#                     await _flush(session, batch)
#                     batch.clear()
#             except Exception:
#                 batch.clear()
#
#         if batch:
#             try:
#                 await _flush(session, batch)
#             except Exception:
#                 pass
#
# @asynccontextmanager
# async def intrusion_worker_lifespan():
#     global _worker_task
#     _stop_event.clear()
#     _worker_task = asyncio.create_task(_worker())
#     try:
#         yield
#     finally:
#         _stop_event.set()
#         if _worker_task:
#             await _worker_task


# app/workers/intrusion_worker.py

import asyncio
from contextlib import asynccontextmanager
from typing import Any, Dict, List

from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.models.models import IntrusionLog
from app.utilities.logger import logger

QUEUE_MAXSIZE = 1000
BATCH_SIZE = 50
FLUSH_INTERVAL_SECONDS = 1.0

intrusion_queue: asyncio.Queue[Dict[str, Any]] = asyncio.Queue(maxsize=QUEUE_MAXSIZE)
_stop_event = asyncio.Event()

async def _flush(session: AsyncSession, batch: List[Dict[str, Any]]) -> None:
    try:
        logger.info(f"Flushing {len(batch)} intrusion logs to DB")
        session.add_all([IntrusionLog(**item) for item in batch])
        await session.commit()
    except Exception as e:
        logger.error(f"Error flushing intrusion logs: {e}")
        await session.rollback()

async def _worker() -> None:
    async with AsyncSessionLocal() as session:
        batch: List[Dict[str, Any]] = []
        while not _stop_event.is_set():
            try:
                item = await asyncio.wait_for(intrusion_queue.get(), timeout=FLUSH_INTERVAL_SECONDS)
                batch.append(item)
                if len(batch) >= BATCH_SIZE:
                    await _flush(session, batch)
                    batch.clear()
            except asyncio.TimeoutError:
                if batch:
                    await _flush(session, batch)
                    batch.clear()
            except Exception as e:
                logger.error(f"Intrusion worker error: {e}")
                batch.clear()

        # final flush when stopping
        if batch:
            await _flush(session, batch)

@asynccontextmanager
async def intrusion_worker_lifespan():
    logger.info("Starting intrusion worker...")
    _stop_event.clear()
    worker_task = asyncio.create_task(_worker())

    try:
        yield
    finally:
        logger.info("Stopping intrusion worker...")
        _stop_event.set()
        await worker_task
