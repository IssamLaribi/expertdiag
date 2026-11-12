import os
import sqlite3
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from postgrest.exceptions import APIError

from app import catalogue, intake
from app.database import initialize_local_database, supabase


@asynccontextmanager
async def lifespan(_: FastAPI):
    if supabase is None:
        initialize_local_database()
    yield


app = FastAPI(title="Expert Diagnostic API", version="1.0.0", lifespan=lifespan)
origins = os.getenv("FRONTEND_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins.split(",") if origin.strip()],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)
app.include_router(catalogue.router)
app.include_router(intake.router)


@app.get("/")
def root():
    return {"message": "Expert Diagnostic API is running!"}


@app.exception_handler(sqlite3.IntegrityError)
async def sqlite_conflict(_: Request, __: sqlite3.IntegrityError):
    return JSONResponse({"detail": "Cette référence existe déjà."}, status_code=409)


@app.exception_handler(APIError)
async def database_error(_: Request, error: APIError):
    if error.code == "23505":
        return JSONResponse({"detail": "Cette référence existe déjà."}, status_code=409)
    return JSONResponse({"detail": "Le service de données est indisponible. Réessayez."}, status_code=502)
