from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from pydantic import BaseModel, ValidationError
from sqlalchemy.orm import Session

from app.api.dependancies import get_db
from app.core.config import settings
from app.crud.bingwa_crud import bingwa_mpesa_client as client
from app.crud.contacts import crud_contact
from app.crud.crud_loyalty import loyalty
from app.crud.mpesa_transaction import transaction
from app.models.models import MpesaTransaction, TransactionType, TransactionStatus
from app.schemas.payments import AirtimeTopUpRequest, StkTopUpRequest
from app.schemas.schemas import TransactionCreate, ApiResponse, TransactionUpdate, LoyaltyCreateSchema, STKPushPayload, \
    CreateContactSchema
from app.services.airtime import airtime_mpesa_client
from app.utilities.logger import logger
from app.utilities.utils import log
from app.utilities.utils import reward_points

router = APIRouter()


@router.post("/bingwa-stk-push", status_code=200)
async def initiate_stk_push(background_tasks: BackgroundTasks, payload: AirtimeTopUpRequest,
                            db: Session = Depends(get_db)):
    """
    - Initiate a STK push to a mobile number.

    - Phone Number must be 10 digits, starts with either 07 or 01.

    Returns:
        dict: A dictionary containing the response from the STK push.
        :param background_tasks:
        :param db:
        :param payload:
    """

    
    password, timestamp = client.generate_password()
    callback = settings.BINGWA_MPESA_CALLBACK
    access_token = await client.fetch_token()
    shortcode = client.shortcode

    # log the payload
    #  

    stk_push_payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": payload.amount,
        "PartyA": payload.paying_number,
        "PartyB": shortcode,
        "PhoneNumber": payload.paying_number,
        "CallBackURL": callback,
        "AccountReference": payload.receiving_number,
        "TransactionDesc": "Bingwa Offer",
    }

    validated_payload = STKPushPayload(**stk_push_payload)

    # TODO: save contacts
    receiving = CreateContactSchema(
        phone_number=payload.receiving_number,
        source="Stk Push",
        tag="Bingwa Offers",
        updated_at = datetime.now(timezone.utc)
    )

    paying = CreateContactSchema(
        phone_number=payload.paying_number,
        source="Stk Push",
        tag="Bingwa Offers",
        updated_at= datetime.now(timezone.utc)
    )

    background_tasks.add_task(crud_contact.contact_hook, receiving, db)
    background_tasks.add_task(crud_contact.contact_hook, paying, db)

    try:
        # initiating a STK push
        response = await client.stk_push(access_token, validated_payload.model_dump())
        response_code = int(response.get("ResponseCode", None))
        response_desc = response.get("ResponseDescription", "")

        if response_code != 0 and not None:
            # STK Push failed on Safaricom’s side
            raise HTTPException(
                status_code=400,
                detail=f"STK Push failed: {response_desc}"
            )

        trans = TransactionCreate(
            merchant_request_id=response.get("MerchantRequestID", None),
            checkout_request_id=response.get("CheckoutRequestID", None),
            amount=payload.amount,
            payment_reference_id=payload.offer_id,
            paying_number=payload.paying_number,
            payment_type=TransactionType.BINGWA_OFFER,
            receiving_number=payload.receiving_number,
            result_code=response_code,
            result_desc=response_desc
        )

        # Save the transaction to the database
        db_obj = transaction.create_transaction(db, obj_in=trans)

        response = ApiResponse(
            success=True,
            status_code=response_code,
            client_message=str(response_code),
            data=None
        )
        return response

    except ValidationError as e:
        logger.error(f"validation Error: \n{e}")
        raise HTTPException(status_code=400, detail="An error occurred, try again later")


class CallbackPayloadSchema(BaseModel):
    merchantRequestId: str
    checkoutRequestId: str
    resultCode: str
    resultDesc: str
    status: str
    mpesaReceiptNumber: str


@router.post("/callback", status_code=200, name="stk-push-callback")
async def stk_push_callback(background_tasks: BackgroundTasks,request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()
        callback = data["Body"]["stkCallback"]

        merchant_request_id: str = callback["MerchantRequestID"]
        checkout_request_id: str | None = callback.get("CheckoutRequestID")
        result_code: int = callback["ResultCode"]
        result_desc: str = callback.get("ResultDesc", "No description")

        # Extract receipt number if available
        mpesa_receipt: str | None = None
        if result_code == 0 and "CallbackMetadata" in callback:
            for item in callback["CallbackMetadata"].get("Item", []):
                if item.get("Name") == "MpesaReceiptNumber":
                    mpesa_receipt = item.get("Value")

        # 🔍 Fetch original transaction
        trans = transaction.get_by_checkout_request_id(db, checkout_request_id)
        if not trans:
            log.warning("Transaction not found", extra={"checkout_request_id": checkout_request_id})
            raise HTTPException(status_code=404, detail="Transaction not found")

        # 🔄 Build update data
        trans_data = TransactionUpdate(
            result_code=result_code,
            points_awarded=reward_points(trans.amount) if result_code == 0 else 0,  # default to 0, can be updated later
            result_desc=result_desc,
            mpesa_receipt_number=mpesa_receipt,
            amount=trans.amount,  # keep original
            status=TransactionStatus.SUCCESS if result_code == 0 else TransactionStatus.FAILED,
        )

        # loyalty_data = LoyaltyCreateSchema(phone_number=d)

        # ✅ Update transaction
        updated: MpesaTransaction = transaction.update(db, db_obj=trans, obj_in=trans_data)
        # background_tasks.add_task(t)


        loyalty_data = LoyaltyCreateSchema(
            phone_number=updated.paying_number,
            amount_paid=updated.amount,
        )
        if result_code == 0:
            logger.info(f'awarding points, result_code: {result_code}')
            # loyalty.create_record(db, obj_in=loyalty_data)
            background_tasks.add_task(loyalty.create_record, db, obj_in=loyalty_data)
        else:
            logger.info("No points awarded the transaction was not successful")

        log.info(f"Transaction Updated: {updated.mpesa_receipt_number}")

        return {
            "message": result_desc, 'status_code': result_code
        }

    except ValidationError as e:
        log.error("Validation error", extra={"error": str(e)})
        raise HTTPException(status_code=400, detail="Invalid callback payload")
    except KeyError as e:
        log.error("Missing expected field", extra={"error": str(e)})
        raise HTTPException(status_code=400, detail=f"Missing field: {e.args[0]}")


@router.post("/airtime-stk-push", status_code=200)
async def initiate_stk_push(background_tasks: BackgroundTasks, payload: StkTopUpRequest, db: Session = Depends(get_db)):
    """
    - Initiate a STK push to a mobile number.

    - Phone Number must be 10 digits, starts with either 07 or 01.

    Returns:
        dict: A dictionary containing the response from the STK push.
        :param background_tasks:
        :param db:
        :param payload:
    """
    password, timestamp = airtime_mpesa_client.generate_password()
    callback = settings.airtime_mpesa_callback
    access_token = await airtime_mpesa_client.fetch_token()
    shortcode = airtime_mpesa_client.shortcode

    stk_push_payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": payload.amount,
        "PartyA": payload.paying_number,
        "PartyB": shortcode,
        "PhoneNumber": payload.paying_number,
        "CallBackURL": callback,
        "AccountReference": payload.receiving_number,
        "TransactionDesc": "Airtime",
    }

    # TODO: save contacts
    receiving = CreateContactSchema(
        phone_number=payload.receiving_number,
        source="Stk Push",
        tag="Airtime Purchase",
        updated_at=datetime.now(timezone.utc)
    )

    paying = CreateContactSchema(
        phone_number=payload.paying_number,
        source="Stk Push",
        tag="Airtime Purchase",
        updated_at=datetime.now(timezone.utc)
    )

    background_tasks.add_task(crud_contact.contact_hook, receiving, db)
    background_tasks.add_task(crud_contact.contact_hook, paying, db)

    try:
        # initiating a STK push
        response = await airtime_mpesa_client.stk_push(access_token, stk_push_payload)
        response_code = int(response.get("ResponseCode", None))
        response_desc = response.get("ResponseDescription", "")

        if response_code != 0 and not None:
            # STK Push failed on Safaricom’s side
            raise HTTPException(
                status_code=400,
                detail=f"STK Push failed: {response_desc}"
            )

        trans = TransactionCreate(
            merchant_request_id=response.get("MerchantRequestID", None),
            checkout_request_id=response.get("CheckoutRequestID", None),
            amount=payload.amount,
            payment_reference_id=payload.amount,
            paying_number=payload.paying_number,
            payment_type=TransactionType.AIRTIME,
            receiving_number=payload.receiving_number,
            result_code=response_code,
            result_desc=response_desc
        )

        # Save the transaction to the database
        db_obj = transaction.create_transaction(db, obj_in=trans)

        response = ApiResponse(
            success=True,
            status_code=response_code,
            client_message=str(response_code),
            data=None
        )
        return response

    except ValidationError as e:
        logger.error(f"validation Error: \n{e}")
        raise HTTPException(status_code=400, detail="An error occurred, try again later")
