from typing import Optional, List

from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import Session

from app.api.dependancies import get_db, get_current_superuser
from app.models.models import User
from app.schemas.bingwa import BingwaCreate, BingwaUpdate, OfferCategory, BingwaResponseSchema
from app.crud.bingwa_crud import bingwa
from app.utilities.logger import logger
from app.schemas.schemas import ApiResponse

router = APIRouter()


@router.get("/get-all", status_code=200, response_model=ApiResponse[List[BingwaResponseSchema]])
def get_all_bingwa(db: Session = Depends(get_db)):
    """
    Endpoint to get all Bingwa data.
    """
    try:
        offers = bingwa.get_multi(db)
        return ApiResponse(
            success=True,
            status_code=200,
            client_message='succesful',
            data=offers
        )
        # return offers
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@router.get('/popular-offers', status_code=200, response_model=ApiResponse[List[BingwaResponseSchema]])
def get_popular_offers(db: Session = Depends(get_db), limit: int = Query(10, ge=1, le=100)):
    """
    Endpoint to get popular Bingwa offers.
    """
    try:
        offers = bingwa.get_popular_offers(db, limit=limit)
        if not offers:
            raise HTTPException(status_code=404, detail="No popular offers found")
        return ApiResponse(
            success=True,
            status_code=200,
            client_message='Popular offers fetched successfully',
            data=offers
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.get('/loyalty-offers', status_code=200, response_model=ApiResponse[List[BingwaResponseSchema]])
def get_loyalty_offers(db: Session = Depends(get_db), limit: int = Query(10, ge=1, le=100)):
    """
    Endpoint to get loyalty Bingwa offers.
    """
    try:
        offers = bingwa.get_loyalty_offers(db, limit)
        if not offers:
            raise HTTPException(status_code=404, detail="No loyalty offers found")
        return ApiResponse(
            success=True,
            status_code=200,
            client_message='Loyalty offers fetched successfully',
            data=offers
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@router.get("/offers-by-category/{category}", status_code=200, response_model=ApiResponse[List[BingwaResponseSchema]])
def get_offers_by_category(
        category: OfferCategory, db: Session = Depends(get_db)
):
    """
    Endpoint to get offers by category.
    """
    try:
        offers = bingwa.get_offers_by_category(db, category=category)
        if not offers:
            raise HTTPException(status_code=404, detail="No offers found in this category")
        return ApiResponse(
            success=True,
            status_code=200,
            client_message='Loyalty offers fetched successfully',
            data=offers
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.post("/create", status_code=201)
def create_bingwa_offer(
        bingwa_create: BingwaCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_superuser)
):
    """
    Endpoint to create a new Bingwa offer.
    """
    try:
        offer = bingwa.create(db, obj_in=bingwa_create)
        logger.debug(f"Created new Bingwa offer with ID: {offer.id}")
        return offer
    except Exception as e:
        logger.error(f"Error creating Bingwa offer: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.put("/update/{offer_id}", status_code=200, response_model=ApiResponse)
def update_bingwa_offer(
        offer_id: int, bingwa_update: BingwaUpdate, db: Session = Depends(get_db), admin: User = Depends(get_current_superuser)
):
    """
    Endpoint to update an existing Bingwa offer.
    """
    try:
        bingwa_offer = bingwa.get(db, id=offer_id)
        logger.debug(f"Updating Bingwa offer with ID: {offer_id}")
        if not bingwa_offer:
            logger.error(f"Offer with ID {offer_id} not found")
            raise HTTPException(status_code=404, detail="Offer not found")

        updated_offer = bingwa.update(db, db_obj=bingwa_offer, obj_in=bingwa_update)
        logger.debug(f"Updated Bingwa offer with ID: {updated_offer.id}")
        return ApiResponse(
            success=True,
            status_code=200,
            client_message="Updated Succesfully",
            data=[
                {
                    'updatedoffer': updated_offer
                }
            ]
        )
    except Exception as e:
        logger.error(f"Error updating Bingwa offer: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.delete("/delete/{offer_id}", status_code=204)
def delete_bingwa_offer(
        offer_id: int, db: Session = Depends(get_db), admin: User = Depends(get_current_superuser)
):
    """
    Endpoint to delete a Bingwa offer.
    """
    try:
        bingwa_offer = bingwa.get(db, id=offer_id)
        if not bingwa_offer:
            raise HTTPException(status_code=404, detail="Offer not found")

        bingwa.remove(db, id=offer_id)
        return {"detail": "Offer deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.get("/sales-summary", status_code=200)
def get_sales_summary(db: Session = Depends(get_db), admin: User = Depends(get_current_superuser)):
    """
    Endpoint to get sales summary.
    """
    try:
        summary = bingwa.get_sales_summary(db)
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.get("/top-selling-offers", status_code=200)
def get_top_selling_offers(db: Session = Depends(get_db), admin: User = Depends(get_current_superuser)):
    """
    Endpoint to get top selling offers.
    """
    try:
        top_offers = bingwa.get_top_selling_offers(db)
        return top_offers
    except Exception as e:
        logger.error(f"Error fetching top selling offers: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.get("/daily-sales-summary", status_code=200)
def get_daily_sales_summary(db: Session = Depends(get_db), admin: User = Depends(get_current_superuser)):
    """
    Endpoint to get daily sales summary.
    """
    try:
        daily_summary = bingwa.get_daily_sales_summary(db)
        return daily_summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
