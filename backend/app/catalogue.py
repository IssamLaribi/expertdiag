import json
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from app.database import local_db, supabase
from app.models.product import ProductCreate

router = APIRouter()


def product_values(product: ProductCreate):
    values = product.model_dump(mode="json", exclude={"expectedReturnDate", "priceEstimate"})
    for name in ("name", "reference", "brand", "domain", "description", "image"):
        values[name] = values[name].strip()
        if not values[name]:
            raise HTTPException(422, "Renseignez tous les champs du produit.")
    values["reference"] = values["reference"].lower()
    values["expected_return_date"] = product.expectedReturnDate.isoformat() if product.expectedReturnDate else None
    values["price_estimate"] = product.priceEstimate.strip() or "Sur devis"
    return values


@router.get("/products")
def get_products():
    if supabase is not None:
        products = supabase.table("products").select("*").execute().data
    else:
        with local_db() as db:
            products = [json.loads(row["payload"]) for row in db.execute("SELECT payload FROM products ORDER BY rowid")]
    return {"success": True, "data": products}


def products_for_quote(ids: list[str]):
    if supabase is not None:
        rows = supabase.table("products").select("id,name,reference,visible,status").in_("id", ids).execute().data
    else:
        placeholders = ", ".join("?" for _ in ids)
        with local_db() as db:
            rows = [json.loads(row["payload"]) for row in db.execute(
                f"SELECT payload FROM products WHERE id IN ({placeholders})", ids
            )]
    return {str(row["id"]): row for row in rows}


@router.post("/products", status_code=201)
def create_product(product: ProductCreate):
    values = product_values(product)
    if supabase is not None:
        created = supabase.table("products").insert(values).execute().data[0]
    else:
        created = {**values, "id": str(uuid4())}
        with local_db() as db:
            db.execute(
                "INSERT INTO products (id, reference, payload) VALUES (?, ?, ?)",
                (created["id"], created["reference"], json.dumps(created)),
            )
    return {"success": True, "data": created}


@router.put("/products/{product_id}")
def update_product(product_id: str, product: ProductCreate):
    values = product_values(product)
    if supabase is not None:
        rows = supabase.table("products").update(values).eq("id", product_id).execute().data
        if not rows:
            raise HTTPException(404, "Produit introuvable.")
        updated = rows[0]
    else:
        updated = {**values, "id": product_id}
        with local_db() as db:
            result = db.execute(
                "UPDATE products SET reference = ?, payload = ? WHERE id = ?",
                (updated["reference"], json.dumps(updated), product_id),
            )
            if result.rowcount == 0:
                raise HTTPException(404, "Produit introuvable.")
    return {"success": True, "data": updated}


@router.delete("/products/{product_id}")
def delete_product(product_id: str):
    if supabase is not None:
        deleted = bool(supabase.table("products").delete().eq("id", product_id).execute().data)
    else:
        with local_db() as db:
            deleted = db.execute("DELETE FROM products WHERE id = ?", (product_id,)).rowcount > 0
    if not deleted:
        raise HTTPException(404, "Produit introuvable.")
    return {"success": True}
