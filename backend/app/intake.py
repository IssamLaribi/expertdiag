import hashlib
import json
from datetime import datetime, timezone
from secrets import token_hex
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field

from app.catalogue import products_for_quote
from app.database import local_db, supabase

router = APIRouter()


class IntakeSubmission(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    submissionId: UUID
    contactPerson: str = Field(min_length=2, max_length=120)
    laboratoryName: str = Field(min_length=2, max_length=160)
    email: str = Field(max_length=254, pattern=r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
    phone: str = Field(min_length=6, max_length=40)


class QuoteItem(BaseModel):
    productId: str = Field(min_length=1, max_length=100)
    quantity: int = Field(ge=1, le=999, strict=True)


class QuoteSubmission(IntakeSubmission):
    wilaya: str = Field(min_length=2, max_length=100)
    commune: str = Field(min_length=2, max_length=100)
    address: str = Field(min_length=2, max_length=240)
    deliveryOptionId: Literal["del-1", "del-2", "del-3"]
    comment: str = Field(default="", max_length=1500)
    items: list[QuoteItem] = Field(min_length=1, max_length=100)


def find_submission(submission_id: str):
    if supabase is not None:
        result = supabase.table("intake_requests").select(
            "kind,request_hash,reference,created_at"
        ).eq("submission_id", submission_id).limit(1).execute()
        return result.data[0] if result.data else None
    with local_db() as db:
        return db.execute(
            "SELECT kind, request_hash, reference, created_at FROM intake_requests WHERE submission_id = ?",
            (submission_id,),
        ).fetchone()


def write_submission(record: dict):
    if supabase is not None:
        supabase.table("intake_requests").upsert(
            record, on_conflict="submission_id", ignore_duplicates=True
        ).execute()
    else:
        with local_db() as db:
            db.execute("""
                INSERT INTO intake_requests (submission_id, kind, request_hash, reference, payload, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(submission_id) DO NOTHING
            """, (record["submission_id"], record["kind"], record["request_hash"], record["reference"],
                  json.dumps(record["payload"]), record["created_at"]))


def quote_payload(payload: dict):
    ids = [item["productId"] for item in payload["items"]]
    if len(set(ids)) != len(ids):
        raise HTTPException(422, "Regroupez les quantités de chaque référence.")
    products = products_for_quote(ids)
    items = []
    for item in payload["items"]:
        product = products.get(item["productId"])
        if not product or not product["visible"] or product["status"] != "available":
            raise HTTPException(409, "Un article n’est plus disponible. Vérifiez votre demande.")
        items.append({**item, "productName": product["name"], "reference": product["reference"]})
    return {**payload, "items": items}


def store_submission(kind: str, submission: IntakeSubmission):
    submission_id = str(submission.submissionId)
    payload = submission.model_dump(mode="json", exclude={"submissionId"})
    fingerprint = hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()
    stored = find_submission(submission_id)
    if stored is None:
        now = datetime.now(timezone.utc)
        prefix = "DEV" if kind == "quote" else "MSG"
        write_submission({
            "submission_id": submission_id,
            "kind": kind,
            "request_hash": fingerprint,
            "reference": f"{prefix}-{now.year}-{token_hex(5).upper()}",
            "payload": quote_payload(payload) if kind == "quote" else payload,
            "created_at": now.isoformat(),
        })
        stored = find_submission(submission_id)
    if stored is None:
        raise HTTPException(503, "La demande n’a pas pu être enregistrée. Réessayez.")
    if stored["kind"] != kind or stored["request_hash"] != fingerprint:
        raise HTTPException(409, "Cette référence correspond à une autre demande.")
    return {"reference": stored["reference"], "createdAt": stored["created_at"]}


@router.post("/quote-requests", status_code=201)
def create_quote(submission: QuoteSubmission):
    return store_submission("quote", submission)


class ContactSubmission(IntakeSubmission):
    subject: Literal["quote", "product", "availability", "sav", "partnership", "other"]
    message: str = Field(min_length=10, max_length=3000)
    productName: str = Field(default="", max_length=180)
    productReference: str = Field(default="", max_length=100)


@router.post("/contact-messages", status_code=201)
def create_contact_message(submission: ContactSubmission):
    return store_submission("contact", submission)
