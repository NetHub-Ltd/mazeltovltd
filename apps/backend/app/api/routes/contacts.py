import csv
from io import StringIO
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.orm import Session

from app.api.dependancies import get_db, get_current_superuser
from app.crud.contacts import crud_contact
from app.models.models import Contact, User
from app.schemas.schemas import CreateContactSchema, ContactsResponseSchema, UpdateContactSchema, ApiResponse
from app.utilities.logger import logger

router = APIRouter()


@router.get("/get-multi", status_code=200, response_model=ApiResponse[List[ContactsResponseSchema]])
def get_all_contacts(tag: str = None, db: Session = Depends(get_db), admin: User = Depends(get_current_superuser), limit: int = 50, address: str = None):
    """
    should fetch all the contacts from the database
    :param admin:
    :param address: filters by address
    :param tag: filters by tag
    :param limit: limits the number or rows to return
    :param db: this is a database session, passed by fastapi dependency injection
    :return:
    """

    if tag is not None:
        cons = crud_contact.filter_by_tags(db, tag, limit=limit)
        return ApiResponse(
            success=True,
            status_code=200,
            client_message=f"returned contacts filtered by {tag}",
            data=cons
        )


    if address is not None:
        cons = crud_contact.filter_by_address(db, address, limit)
        return ApiResponse(
            success=True,
            status_code=200,
            client_message=f"Successfully filtered by {address}",
            data=cons
        )


    all_cons = crud_contact.get_multi(db, limit=limit)

    return ApiResponse(
        success=True,
        status_code=200,
        client_message="Successful",
        data=all_cons
    )





@router.get('/filtered-contacts/{tag}', status_code=200)
def filtered_contacts(text: str, db: Session = Depends(get_db), tag: str = None, admin: User = Depends(get_current_superuser)):
    contacts = crud_contact.filtered_numbers(db, tag)
    # payload = crud_contact.build_message_parameters(contacts, text)
    logger.info(f"filtered: {len(contacts)}")
    return contacts

@router.get('/tags', status_code=200, response_model=ApiResponse)
def get_tags(db: Session = Depends(get_db), admin: User = Depends(get_current_superuser)):
    tags = crud_contact.get_tags_with_counts(db)
    logger.info(f"Tags: {tags}")
    return ApiResponse(
        status_code=200,
        success=True,
        client_message="tags fetched successfully",
        data=tags
    )


@router.post('/create-contact', status_code=201, response_model=ContactsResponseSchema)
def create_new_contact(data: CreateContactSchema, db: Session = Depends(get_db), admin: User = Depends(get_current_superuser)):
    return crud_contact.create(db, obj_in=data)


@router.post("/bulk-contacts")
def upload_contacts_csv(
        file: UploadFile = File(...),
        db: Session = Depends(get_db), admin: User = Depends(get_current_superuser)
):
    content = file.file.read().decode("utf-8")
    reader = csv.DictReader(StringIO(content))

    rows = list(reader)[:100]  # Limit to first 100
    valid_contacts: List[CreateContactSchema] = []
    invalid_rows = []

    # Step 1: Validate with Pydantic
    for i, row in enumerate(rows):
        try:
            # Convert empty strings from CSV to None for optional fields
            cleaned_row = {k: (v if v else None) for k, v in row.items()}
            contact = CreateContactSchema(**cleaned_row)
            valid_contacts.append(contact)
        except Exception as e:
            invalid_rows.append({"row": i + 1, "error": str(e)})

    if not valid_contacts:
        raise HTTPException(status_code=400, detail="No valid rows in CSV.")

    # Step 2: Prepare for INSERT
    contact_dicts = []
    for c in valid_contacts:
        contact_dict = c.model_dump(exclude_unset=True)
        contact_dicts.append(contact_dict)

    # Use pg_insert with on_conflict_do_nothing targeting phone_number
    # This will skip rows where phone_number already exists
    stmt = pg_insert(Contact).values(contact_dicts)
    stmt = stmt.on_conflict_do_nothing(
        index_elements=["phone_number"]  # Only phone_number is unique now
    )

    inserted = 0
    try:
        result = db.execute(stmt)
        db.commit()
        inserted = result.rowcount or 0  # Number of rows actually inserted
    except Exception as e:
        db.rollback()
        logger.error(f"DB insert failed: {e}", exc_info=True)  # Log full traceback
        raise HTTPException(status_code=500, detail=f"DB insert failed: {str(e)}")

    # Skipped rows are those that were valid but not inserted due to conflict
    skipped = len(valid_contacts) - inserted

    return {
        "success": True,
        "inserted": inserted,
        "skipped_existing": skipped,
        "invalid_rows": invalid_rows,
        "message": f"Processed {len(rows)} rows. Successfully inserted {inserted} contacts. Skipped {skipped} existing contacts (by phone number). {len(invalid_rows)} rows were invalid."
    }


@router.put('/update-contact/{contact_id}', status_code=200)
def update_contact(contact_id: int, obj_data: UpdateContactSchema, db: Session = Depends(get_db), admin: User = Depends(get_current_superuser)):
    con = crud_contact.get(db, contact_id)
    if con is None:
        raise HTTPException(status_code=404, detail=f"contact with id{contact_id} does not exist")

    updated = crud_contact.update(db, db_obj=con, obj_in=obj_data)
    return updated


@router.delete('/remove/{contact_id}', status_code=204)
def remove_contact(contact_id: int, db: Session = Depends(get_db), admin: User = Depends(get_current_superuser)):
    con = crud_contact.get(db, contact_id)
    if con is None:
        raise HTTPException(status_code=404, detail="Contact not found")

    crud_contact.remove(db, contact_id)
