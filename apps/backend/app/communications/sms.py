from typing import List, Optional, Literal
from pydantic import BaseModel, Field
import httpx
from app.utilities.logger import logger

from app.core.config import settings


class MessageParam(BaseModel):
    Number: str
    Text: str


class BulkSMSRequest(BaseModel):
    MessageParameters: List[MessageParam]
    IsUnicode: bool = False
    IsFlash: bool = False
    ScheduleDateTime: Optional[str] = None  # ISO format string

class BulkSmsRequestPayload(BaseModel):
    contacts: list
    message: str
    tag: Optional[str] = None

class SMSResponseItem(BaseModel):
    MobileNumber: str
    MessageId: str


class BulkSMSResponse(BaseModel):
    ErrorCode: int
    ErrorDescription: str
    Data: Optional[List[SMSResponseItem]] = None


class SenderIDItem(BaseModel):
    SenderID: str
    Status: Literal["Approved", "Pending", "Rejected"]


class SenderIDResponse(BaseModel):
    ErrorCode: int
    ErrorDescription: str
    Data: Optional[List[SenderIDItem]]


class BalanceResponse(BaseModel):
    ErrorCode: int
    ErrorDescription: str
    Balance: Optional[float] = None


class SMSService:
    BASE_URL = settings.sms_base_url

    def __init__(self, api_key: str, client_id: str, access_key: str, sender_id: str):
        self.api_key = api_key
        self.client_id = client_id
        self.access_key = access_key
        self.sender_id = sender_id
        self.headers = {
            "Content-Type": "application/json",
            "AccessKey": self.access_key,
        }

    async def send_bulk_sms(self, payload: BulkSMSRequest) -> BulkSMSResponse:
        data = {
            "ApiKey": self.api_key,
            "ClientId": self.client_id,
            "SenderId": self.sender_id,
            "MessageParameters": [param.model_dump() for param in payload.MessageParameters],
            "IsUnicode": payload.IsUnicode,
            "IsFlash": payload.IsFlash,
        }

        # logger.info(f"Sms Data: {data}")

        if payload.ScheduleDateTime:
            data["ScheduleDateTime"] = payload.ScheduleDateTime

        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{self.BASE_URL}/SendBulkSMS",
                headers=self.headers,
                json=data,
                timeout=10,
            )
            res.raise_for_status()
            return BulkSMSResponse(**res.json())

    async def get_balance(self) -> BalanceResponse:
        params = {
            "ApiKey": self.api_key,
            "ClientId": self.client_id,
        }
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{self.BASE_URL}/Balance",
                headers=self.headers,
                params=params,
                timeout=10,
            )
            res.raise_for_status()

            data = res.json().get("Data", None)
            balance = data[0].get("Credits", None)
            logger.info(f"Sms balance: {balance}")
            return data

    async def get_sender_ids(self) -> SenderIDResponse:
        params = {
            "ApiKey": self.api_key,
            "ClientId": self.client_id,
        }
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{self.BASE_URL}/GetSenderIDs",
                headers=self.headers,
                params=params,
                timeout=10,
            )
            res.raise_for_status()
            return SenderIDResponse(**res.json())



sms_client = SMSService(
    api_key=settings.sms_apikey,
    client_id=settings.sms_client_id,
    access_key=settings.sms_access_key,
    sender_id=settings.sms_sender_id
                        )
