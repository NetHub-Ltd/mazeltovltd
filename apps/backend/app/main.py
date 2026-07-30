

import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from .api.api import api_router
from .core.config import settings
from .utilities.intrusion_worker import intrusion_worker_lifespan
from .utilities.logger import logger
from app.utilities.utils import ping_self
from app.core.middlewares import IntrusionMiddleware, ALLOWED_IPS

# -------------------------
# Lifespan (background tasks)
# -------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 🔹 STARTUP
    ping_task = asyncio.create_task(ping_self())
    logger.info("ping_self task started")

    try:
        yield  # 👈 THIS IS REQUIRED
    finally:
        # 🔻 SHUTDOWN
        ping_task.cancel()
        try:
            await ping_task
        except asyncio.CancelledError:
            logger.info("ping_self task cancelled")

# -------------------------
# Create app
# -------------------------
app = FastAPI(
    lifespan=lifespan,
    title="Mazeltov Backend",
    version=settings.api_version,
)

# -------------------------
# 1️⃣ CORS middleware (must be first)
# -------------------------
origins = [
    "https://mazeltov.co.ke",  # frontend domain
]

logger.info(f"Configuring CORS for origins: {settings.parse_origins()}") # Log the configured origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # cannot use "*"
    allow_credentials=True,     # needed for cookies / auth
    allow_methods=["*"],        # GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],        # all headers
)

# -------------------------
# 2️⃣ Custom middleware (Intrusion)
# -------------------------
# allow the middleware to block requests from disallowed IPs
# if settings.open_access:
# app.add_middleware(IntrusionMiddleware, allowed_ips=ALLOWED_IPS)

# -------------------------
# 3️⃣ Prometheus instrumentation
# -------------------------
# Instrumentator().instrument(app).expose(app, include_in_schema=False, should_gzip=True)

# -------------------------
# 4️⃣ Routers
# -------------------------
app.include_router(api_router, prefix=settings.api_string)

# -------------------------
# 5️⃣ Simple endpoints
# -------------------------
@app.get("/", status_code=200)
def home():
    return {"message": "Welcome to the FastAPI application!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

