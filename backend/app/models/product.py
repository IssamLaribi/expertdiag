from pydantic import BaseModel, Field
from typing import Literal
from datetime import date


class ProductCreate(BaseModel):
    name: str
    reference: str
    type: Literal["equipment", "reagent", "consumable"]

    brand: str
    domain: str

    description: str
    features: list[str] = Field(default_factory=list)
    image: str

    status: Literal["available", "unavailable"] = "available"

    expectedReturnDate: date | None = None
    note: str | None = None
    visible: bool = True
    priceEstimate: str = "Sur devis"