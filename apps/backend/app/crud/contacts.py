from typing import Optional, List, Tuple
import re
from sqlalchemy.dialects.postgresql import insert

from fastapi.params import Depends
from sqlalchemy import select, func
from sqlalchemy.exc import NoResultFound
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.models import Contact
from app.schemas.schemas import CreateContactSchema, ContactsResponseSchema, UpdateContactSchema
from app.utilities.logger import logger


class ContactCRUD(CRUDBase[Contact, CreateContactSchema, UpdateContactSchema]):
    """
    CRUD operations for Contact Management
    Inherits from CRUDBase to provide basic CRUD functionality.
    """

    def filter_by_tags(self, db: Session, tag: str, limit: int = 0):
        try:
            filtered = db.query(self.model).filter(self.model.tag == tag).limit(limit).all()
            return filtered
        except NoResultFound as e:
            logger.error("NoResultFoundError", e)
            return None


    def filter_by_address(self, db: Session, address: str, limit: int = 0):
        """
        Fetches contacts where the address matches a pattern case-insensitively.

        Args:
            address_pattern (str): The pattern to search for (e.g., "kambiti").
            db (Session): The SQLAlchemy database session.

        Returns:
            list[Contact]: A list of matching Contact objects.
            :param db:
            :param limit:
            :param address:
        """
        # Construct the pattern with wildcards for 'contains' search
        search_pattern = f"%{address}%"

        # Build the SQLAlchemy query using .ilike()
        stmt = select(self.model).where(self.model.address.ilike(search_pattern))
        stmt = stmt.limit(limit)

        # Execute the query and fetch all results
        result = db.execute(stmt).scalars().all()

        return result

    def filtered_numbers(self, db: Session, tag: Optional[str] = None) -> list[str]:
        query = db.query(Contact.phone_number)
        if tag:
            query = query.filter(Contact.tag == tag)
        results = query.all()  # returns list of tuples, like: [('0712...'), ('0791...')]
        return [phone for (phone,) in results]  # unpack tuple to flat list


    def build_message_parameters(self, numbers: list[str], text: str) -> list[dict[str, str]]:
        """
        Builds a list of message parameters for Onfon API by normalizing and validating phone numbers.

        :param numbers: List of raw phone numbers (e.g., ['0712345678', '+254712345678'])
        :param text: Message content to send
        :return: List of dicts in the format [{"Number": "2547XXXXXXXX", "Text": "..."}, ...]
        """
        seen = set()
        result = []

        for raw in numbers:
            try:
                # Remove all non-digit characters
                number = re.sub(r'\D', '', raw)

                if number.startswith('07') or number.startswith('01'):
                    formatted = '254' + number[1:]
                elif number.startswith('2547') or number.startswith('2541'):
                    formatted = number
                else:
                    logger.warning(f"Skipping unrecognized format: {raw}")
                    continue  # Invalid pattern

                # Final validation
                if len(formatted) == 12 and formatted.startswith('254'):
                    if formatted not in seen:
                        seen.add(formatted)
                        result.append({
                            "Number": formatted,
                            "Text": text
                        })
                    else:
                        logger.warning(f"Duplicate number skipped: {formatted}")
                else:
                    logger.warning(f"Skipping invalid formatted number: {formatted} from input {raw}")

            except Exception as e:
                logger.warning(f"Unexpected error processing number '{raw}': {e}")
                continue

        return result

    def get_tags_with_counts(self,db: Session) -> List[Tuple[str, int]]:
        """
        Returns a list of tuples (tag, count) for all non-null tags.
        """
        statement = (
            select(Contact.tag, func.count())
            .where(Contact.tag.is_not(None))
            .group_by(Contact.tag)
        )
        results = db.execute(statement).all()
        return dict(results)



    def contact_hook(self, contact: CreateContactSchema, db: Session):
        stmt = insert(Contact).values(**contact.model_dump(exclude_unset=True))
        # Do nothing if phone_number already exists
        stmt = stmt.on_conflict_do_nothing(index_elements=["phone_number"])

        db.execute(stmt)
        db.commit()


crud_contact = ContactCRUD(Contact)
