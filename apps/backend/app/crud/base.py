from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union, Tuple

from fastapi.encoders import jsonable_encoder
from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import exc, inspect

from app.db.base_class import Base
from app.utilities.logger import logger

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).

        **Parameters**

        * `model`: A SQLAlchemy model class
        * `schema`: A Pydantic model (schema) class
        """
        self.model = model

    def get(self, db: Session, id: Any) -> Optional[ModelType]:
        try:
            item = db.query(self.model).filter(self.model.id == id).one()
            return item
        except exc.NoResultFound:
            raise HTTPException(status_code=404, detail='Not Found')

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    )-> list[tuple[Any]]:
        try:
            items = db.query(self.model).offset(skip).limit(limit).all()
            if items is None:
                raise HTTPException(status_code=404, detail='Not Found!')
            return items
        except exc.NoResultFound as error:
            # db.rollback()
            logger.error("NoResultFoundError: %s", error)
            raise HTTPException(404, detail="Not Found!")

    def create(self, db: Session, *, obj_in: CreateSchemaType) -> ModelType:
        try:
            obj_in_data = jsonable_encoder(obj_in)
            db_obj = self.model(**obj_in_data)  # type: ignore
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            logger.info(f"Created new {self.model.__name__} with ID: {db_obj.id}")
            return db_obj
        except exc.IntegrityError as e:
            # user already exist, no need to recreate
            db.rollback()
            logger.error('Integrity error: %s', e)
            raise HTTPException(status_code=409, detail=f'An error occurred, check the data your submitting')

    def update(
        self,
        db: Session,
        *,
        db_obj: ModelType,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        try:
            obj_data = jsonable_encoder(db_obj)
            if isinstance(obj_in, dict):
                update_data = obj_in
            else:
                update_data = obj_in.model_dump(exclude_unset=True)
            for field in obj_data:
                if field in update_data:
                    setattr(db_obj, field, update_data[field])
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        except exc.IntegrityError as e:
            db.rollback()
            # logger.error('Integrity error: %s', e, exc_info=True)
            HTTPException(status_code=409, detail='that data already exist')

    def remove(self, db: Session, *, id: int) -> ModelType:
        try:
            obj = self.get(db, id)
            db.delete(obj)
            db.commit()
            return obj
        except exc.NoResultFound as e:
            db.rollback()
            raise HTTPException(status_code=404,  detail='Not Found!')



    def filter_by_column(
        self,
        db: Session,
        column: str,
        value: Any,
        skip: int = 0,
        limit: int = 50
    ) -> List[Any]:
        """
        Filters the model by the given column and value with optional pagination.

        :param db: SQLAlchemy Session
        :param column: Column name to filter by
        :param value: Value to filter with
        :param skip: Number of records to skip (offset)
        :param limit: Max number of records to return
        :return: List of matching model instances
        """
        model_inspector = inspect(self.model)
        model_columns = {col.key for col in model_inspector.mapper.columns}

        if column not in model_columns:
            raise ValueError(f"Invalid column '{column}' for model '{self.model.__name__}'")

        column_attr = getattr(self.model, column)
        query = db.query(self.model).filter(column_attr == value)

        return query.offset(skip).limit(limit).all()
