# from __future__ import annotations
# import asyncio
# from typing import Dict, Any, List
# from contextlib import asynccontextmanager
# from sqlmodel import SQLModel
# from sqlalchemy.ext.asyncio import AsyncSession
#
# from app.db.session import engine
# from app.models.models import IntrusionLog
#
# # Tunables
# QUEUE_MAXSIZE = 1000  # backpressure; drop if overwhelmed
# BATCH_SIZE = 50  # bulk insert size
# FLUSH_INTERVAL_SECONDS = 1.0  # time-based flush for low traffic
#
# intrusion_queue: asyncio.Queue[Dict[str, Any]] = asyncio.Queue(maxsize=QUEUE_MAXSIZE)
# _worker_task: asyncio.Task | None = None
# _stop_event = asyncio.Event()
#
#
# async def _flush(session: AsyncSession, batch: List[Dict[str, Any]]) -> None:
#     # Convert dicts to model instances and bulk-add
#     objs = [IntrusionLog(**item) for item in batch]
#     session.add_all(objs)
#     await session.commit()
#
#
# async def _worker() -> None:
#     """
#     Drain the intrusion_queue in batches. Uses time-based and size-based flushing.
#     """
#     async with AsyncSessionLocal() as session:
#         batch: List[Dict[str, Any]] = []
#         while not _stop_event.is_set():
#             try:
#                 # Wait for next item or timeout
#                 item = await asyncio.wait_for(intrusion_queue.get(), timeout=FLUSH_INTERVAL_SECONDS)
#                 batch.append(item)
#                 # Flush if batch threshold reached
#                 if len(batch) >= BATCH_SIZE:
#                     await _flush(session, batch)
#                     batch.clear()
#             except asyncio.TimeoutError:
#                 # Periodic flush
#                 if batch:
#                     await _flush(session, batch)
#                     batch.clear()
#             except Exception as e:
#                 # Don't crash worker on unexpected error
#                 # (Optionally: log to stderr or fallback file)
#                 batch.clear()
#
#         # Final drain on shutdown
#         if batch:
#             try:
#                 await _flush(session, batch)
#             except Exception:
#                 pass
#
#
# @asynccontextmanager
# async def intrusion_worker_lifespan():
#     global _worker_task
#     # Ensure tables exist (simple path; for prod use Alembic migrations)
#     async with engine.begin() as conn:
#         await conn.run_sync(SQLModel.metadata.create_all)
#
#     # Start worker
#     _stop_event.clear()
#     _worker_task = asyncio.create_task(_worker())
#     try:
#         yield
#     finally:
#         # Signal and await worker shutdown
#         _stop_event.set()
#         if _worker_task:
#             await _worker_task
