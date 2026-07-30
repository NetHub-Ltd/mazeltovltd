import base64
import httpx
from datetime import datetime, timezone
from typing import Any, Dict, Optional, Tuple
from fastapi import HTTPException
from loguru import logger

from app.core.config import settings


class MpesaClient:
    def __init__(
        self,
        mpesa_base_url: str,
        consumer_key: str,
        consumer_secret: str,
        shortcode: str,
        passkey: str,
        timeout: int = 20
    ):
        # Clean trailing slashes, whitespace, AND surrounding quotes from .env
        self.base_url = (mpesa_base_url or "").strip().strip('"').strip("'").rstrip('/')
        self.consumer_key = (consumer_key or "").strip().strip('"').strip("'")
        self.consumer_secret = (consumer_secret or "").strip().strip('"').strip("'")
        self.shortcode = (shortcode or "").strip().strip('"').strip("'")
        self.passkey = (passkey or "").strip().strip('"').strip("'")
        self.timeout = timeout

        logger.info(
            "MpesaClient Initialized | Base URL: {} | Shortcode: {} | Key Length: {} | Secret Length: {} | Passkey Length: {}",
            self.base_url,
            self.shortcode,
            len(self.consumer_key),
            len(self.consumer_secret),
            len(self.passkey)
        )

    async def fetch_token(self) -> str:
        url = f"{self.base_url}/oauth/v1/generate"
        

        creds = f"{self.consumer_key}:{self.consumer_secret}"
        auth = base64.b64encode(creds.encode("utf-8")).decode("utf-8")

        # Explicit headers required to bypass Akamai/Kong Edge Gateway filtering
        headers = {
            "Authorization": f"Basic {auth}",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        }


        logger.info(f"Fetching mpesa token with creds: {creds}: url | {url}")

        data = await self._request(
            method="GET",
            url=url,
            headers=headers,
            params={"grant_type": "client_credentials"}
        )

        access_token = data.get("access_token")
        if not access_token:
            logger.error(f"OAuth response missing 'access_token'. Payload: {data}")
            raise HTTPException(
                status_code=500,
                detail={"message": "M-Pesa authorization succeeded but returned no access token.", "payload": data}
            )

        return access_token

    async def register_urls(
        self,
        confirmation_url: str,
        validation_url: str,
        access_token: str,
        v: str = "v2"
    ) -> Dict[str, Any]:
        logger.info(f"Registering C2B URLs for shortcode: {self.shortcode}")
        payload = {
            "ShortCode": self.shortcode,
            "ResponseType": "Completed",
            "ConfirmationURL": confirmation_url,
            "ValidationURL": validation_url,
        }
        url = f"{self.base_url}/mpesa/c2b/{v}/registerurl"
        return await self._request(
            method="POST",
            url=url,
            headers=self._bearer_headers(access_token),
            json=payload
        )

    async def stk_push(self, access_token: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        logger.info(f"Initiating STK Push for shortcode: {self.shortcode}")
        url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
        return await self._request(
            method="POST",
            url=url,
            headers=self._bearer_headers(access_token),
            json=payload
        )

    def generate_password(self, timestamp: Optional[str] = None) -> Tuple[str, str]:
        if not timestamp:
            timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
        raw = f"{self.shortcode}{self.passkey}{timestamp}"
        password = base64.b64encode(raw.encode("utf-8")).decode("utf-8")
        return password, timestamp

    # ——— Internal Helpers ——— #

    def _bearer_headers(self, token: str) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {token.strip()}",
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        }

    async def _request(
        self,
        method: str,
        url: str,
        headers: Optional[Dict[str, str]] = None,
        json: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.request(
                    method=method,
                    url=url,
                    headers=headers,
                    json=json,
                    params=params
                )
                await resp.aread()

            try:
                body_payload = resp.json()
            except Exception:
                body_payload = resp.text

            if resp.is_success:
                logger.info(f"M-Pesa API Success [{resp.status_code}] -> {method} {url}")
                return body_payload if isinstance(body_payload, dict) else {"response": body_payload}

            # Failure Diagnostic Output
            logger.error(
                f"M-Pesa API Error [{resp.status_code}] -> {method} {url}\n"
                f"Headers: {dict(resp.headers)}\n"
                f"Response Body: {body_payload or '<EMPTY BODY>'}"
            )

            raise HTTPException(
                status_code=resp.status_code,
                detail={
                    "error": "M-Pesa API Request Failed",
                    "status_code": resp.status_code,
                    "daraja_error": body_payload or "Empty response from Daraja Edge Gateway. Verify key/secret production status."
                }
            )

        except httpx.ConnectTimeout:
            logger.error(f"M-Pesa Connection Timeout -> {method} {url}")
            raise HTTPException(status_code=504, detail="M-Pesa API server connection timed out.")
        except httpx.RequestError as exc:
            logger.error(f"M-Pesa Transport Error -> {method} {url} | Detail: {exc}")
            raise HTTPException(status_code=503, detail=f"M-Pesa connection error: {str(exc)}")


client = MpesaClient(
    mpesa_base_url=settings.mpesa_base_url,
    consumer_key=settings.bingwa_mpesa_consumer_key,
    consumer_secret=settings.bingwa_mpesa_consumer_secret,
    shortcode=settings.bingwa_mpesa_shortcode,
    passkey=settings.bingwa_mpesa_passkey,
)