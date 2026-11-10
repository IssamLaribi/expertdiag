from fastapi import FastAPI, HTTPException
from app.database import supabase
from app.models.product import ProductCreate
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Expert Diagnostic API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Expert Diagnostic API is running!"}


@app.get("/test-supabase")
def test_supabase():
    try:
        response = supabase.table("brands") \
            .select("id") \
            .limit(1) \
            .execute()

        return {
            "success": True,
            "message": "Supabase connection successful!",
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.get("/brands")
def get_brands():
    try:
        response = supabase.table("brands") \
            .select("id, name") \
            .execute()

        return {
            "success": True,
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/domains")
def get_domains():
    try:
        response = supabase.table("domains") \
            .select("id, name") \
            .execute()

        return {
            "success": True,
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/products", status_code=201)
def create_product(product: ProductCreate):
    try:
        product_data = {
            "name": product.name.strip(),
            "reference": product.reference.strip().lower(),
            "type": product.type,
            "brand_id": product.brand_id,
            "domain_id": product.domain_id,
            "description": product.description.strip(),
            "features": product.features,
            "image": product.image,
            "status": product.status,
            "expected_return_date": (
                product.expectedReturnDate.isoformat()
                if product.expectedReturnDate else None
            ),
            "note": product.note,
            "visible": product.visible,
            "price_estimate": product.priceEstimate,
        }

        response = supabase.table("products") \
            .insert(product_data) \
            .execute()

        return {
            "success": True,
            "message": "Product created successfully!",
            "data": response.data[0]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))