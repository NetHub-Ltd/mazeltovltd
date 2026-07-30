from starlette.responses import Response
import asyncio
import json

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from app.core.config import settings
from app.schemas.schemas import IntrusionLogCreate
from app.utilities.logger import logger

# Load allowed IPs from env: e.g. ALLOWED_IPS="123.45.67.89,98.76.54.32"
ALLOWED_IPS = set(settings.parse_allowed_ips())
# Expected Origin (optional, leave empty to skip Origin check)
EXPECTED_ORIGIN = settings.parse_origins()

# LOG_FILE = "intruders.log"
from app.utilities.intrusion_worker import intrusion_queue

class IntrusionMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, allowed_ips: set[str]):
        super().__init__(app)
        self.allowed_ips = allowed_ips

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        origin = request.headers.get("origin")
        user_agent = request.headers.get("user-agent")
        referer = request.headers.get("referer")


        logger.info(f"Incoming {request.method}:{request.url.path} Request from {client_ip}: {origin}")

        # Skip allowlist for health check
        if request.url.path.startswith("/health"):
            return await call_next(request)

        if client_ip not in self.allowed_ips:
            logger.warning(f"{request.method} Request Rejected {client_ip}: {origin}")
            # Build schema-compatible object
            log_data = IntrusionLogCreate(
                ip=client_ip,
                method=request.method,
                path=request.url.path,
                origin=origin,
                referer=referer,
                user_agent=user_agent,
                headers_json=json.dumps(dict(request.headers))
            )

            try:
                logger.info(f"Logging intrusion attempt from: {log_data.ip}")
                # TODO: pass an instance instead of python objects, this would enhance the process
                intrusion_queue.put_nowait(log_data.model_dump())
            except asyncio.QueueFull:
                logger.warning(f"System overwhelmed by requests: {log_data.ip}: {log_data.origin}")
                pass  # drop if overwhelmed

            # return Response("Not found", status_code=404)
            return await call_next(request)
        logger.info(f"{request.method} Request allowed {client_ip}: {origin}")
        return await call_next(request)
