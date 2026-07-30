from app.core.config import settings
from app.services.mpesa_client import MpesaClient


airtime_mpesa_client = MpesaClient(
    mpesa_base_url=settings.airtime_base_url,
    consumer_key=settings.airtime_mpesa_consumer_key,
    consumer_secret=settings.airtime_mpesa_consumer_secret,
    shortcode=settings.airtime_mpesa_shortcode,
    passkey=settings.airtime_mpesa_passkey,
)