from fastapi import FastAPI, HTTPException
from app.database import supabase

app = FastAPI(
    title="Expert Diagnostic API",
    version="1.0.0"
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