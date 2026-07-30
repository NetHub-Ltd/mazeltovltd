from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.api.dependancies import get_db, get_current_superuser
from app.communications.sms import sms_client, BulkSMSRequest, BulkSmsRequestPayload
from app.crud.contacts import crud_contact
from app.models.models import User
from app.schemas.schemas import ApiResponse, SmsContactsResponseSchema
from app.utilities.logger import logger

router = APIRouter()


@router.get('/balance', status_code=200, response_model=ApiResponse)
async def get_balance(admin: User = Depends(get_current_superuser)):
    try:
        res = await sms_client.get_balance()
        return ApiResponse(
            status_code=200,
            success=True,
            client_message="balance fetched successfully",
            data=res
        )
    except Exception as e:
        logger.info("Sending sms failed", e)
        raise HTTPException(status_code=500, detail="An error occurred, please try again")


@router.get('/fetch-contacts', status_code=200, response_model=ApiResponse[List[SmsContactsResponseSchema]])
def fetch_contacts(tag: str = None, address: str = None, db: Session = Depends(get_db), admin: User = Depends(get_current_superuser)):
    if tag is not None:
        contacts = crud_contact.filter_by_tags(db, tag, limit=100)
        logger.info(f"Fetched Contacts: {contacts}")
        return ApiResponse(
            success=True,
            status_code=200,
            client_message=f"filtered by {tag}",
            data=contacts
        )

    if address is not None:
        contacts = crud_contact.filter_by_address(db, address, limit=100)
        logger.info(f"Fetched Contacts: {contacts}")
        return ApiResponse(
            success=True,
            status_code=200,
            client_message=f"filtered by {address}",
            data=contacts
        )

    contact = crud_contact.get_multi(db, limit=100)
    return ApiResponse(
        success=True,
        status_code=200,
        client_message="unfiltered contacts",
        data=contact
    )


@router.post("/send-bulk-sms", status_code=200, response_model=ApiResponse)
async def send_bulk_sms(payload: BulkSmsRequestPayload, db: Session = Depends(get_db), admin: User = Depends(get_current_superuser)):
    logger.info(f"payload: {payload.contacts}")
    try:
        contacts = []

        if payload.tag:
            contacts = crud_contact.filtered_numbers(db, payload.tag)

        merged = contacts + payload.contacts

        if not merged:
            raise HTTPException(status_code=400, detail="Contacts list is empty")

        normalized = crud_contact.build_message_parameters(merged, payload.message)

        validate = BulkSMSRequest(MessageParameters=normalized)
        logger.info(f"Sending to {len(validate.MessageParameters)} contact(s)")
        res = await sms_client.send_bulk_sms(validate)

        return ApiResponse(
            success=True,
            status_code=res.ErrorCode,
            client_message=res.ErrorDescription,
            data=res.Data
        )

    except ValidationError as e:
        logger.error(f"Validation failed: {e}")
        raise HTTPException(status_code=422, detail="Invalid SMS payload")

    except Exception as e:
        logger.exception("Unexpected error occurred while sending bulk SMS", e)
        raise HTTPException(status_code=500, detail="Internal server error")
