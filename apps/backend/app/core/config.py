import json
from datetime import datetime

import pytz
from pydantic import FilePath, field_validator
from pydantic_settings import BaseSettings
from typing import Optional

from app.utilities.logger import logger


class Settings(BaseSettings):
    # model_config = ConfigDict(env_file=".env")  # Correct placement
    model_config = {
        "env_file": "./.env.local",
        "extra": "ignore",
    }

    postgres_user: str
    postgres_password: str
    postgres_db: str
    postgres_port: int = 5432
    postgres_host: str

    # sqlalchemy_url: str = f'postgresql://{postgres_user}:{postgres_password}@localhost/{postgres_db}'
    admin_email: str
    admin_name: str
    admin_password: str
    # frontend_origin: str

    algorithm: str
    api_string: str = '/api/v1'
    ACCESS_TOKEN_EXPIRE_SECONDS: int = 3600
    secret: str = 'secrets.token_urlsafe()'
    bingwa_url: str
    api_version: str
    loyalty_rate: int
    loyalty_minimum: int = 50
    safaricom_ips: str = ''
    # intrusion_detection_enabled: bool = True

    template_path: str = 'app/html_template/'

    # BINGWA PAYBILL INTEGRATION
    # BINGWA_MPESA_SHORTCODE: str
    # BINGWA_MPESA_PASSKEY: str
    # BINGWA_MPESA_CONSUMER_KEY: str
    # BINGWA_MPESA_CONSUMER_SECRET: str

    airtime_mpesa_shortcode: str
    airtime_mpesa_passkey: str
    airtime_mpesa_consumer_key: str
    airtime_mpesa_consumer_secret: str
    airtime_base_url: str
    airtime_mpesa_callback: str

    bingwa_mpesa_shortcode: str
    bingwa_mpesa_passkey: str
    bingwa_mpesa_consumer_key: str
    bingwa_mpesa_consumer_secret: str
    bingwa_url: str
    bingwa_mpesa_callback: str

    SMTP_SERVER: str
    SMTP_PORT: int
    SMTP_EMAIL: str
    SMTP_PASSWORD: str
    IMAP_SERVER: str
    IMAP_PORT: int


    cors_origins: str
    mpesa_base_url: str
    DOMAIN: str
    BINGWA_MPESA_CALLBACK: str
    # sms

    sms_apikey: str
    sms_client_id: str
    sms_base_url: str
    sms_access_key: str
    sms_sender_id: str
    allowed_ips_or_networks: str = ""
    # gsc_service_account_json: FilePath

    gsc_service_account_json: Optional[dict] = {}  # store parsed JSON

    @property
    def database_url(self) -> str:
        return f'postgresql://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}'


    @field_validator("gsc_service_account_json", mode="before")
    def parse_json(cls, v):
        import json
        if isinstance(v, str):
            return json.loads(v)  # always treat as JSON string
        return v

    def parse_origins(self):
        return self.cors_origins.split(',')

    def parse_allowed_ips(self)-> list:
        ips = [ip.strip() for ip in self.allowed_ips_or_networks.split(",") if ip.strip()] + [ip.strip() for ip in self.safaricom_ips.split(",") if ip.strip()]
        return ips

    def get_local_time_with_timezone(self):
        # Define the timezone for Africa/Nairobi
        nairobi_tz = pytz.timezone('Africa/Nairobi')

        # Get the current time in UTC and localize it to Africa/Nairobi timezone
        utc_now = datetime.utcnow()
        local_time = pytz.utc.localize(utc_now).astimezone(nairobi_tz)

        return local_time


settings = Settings()
