import json
import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY")
BACKEND_DIR = Path(__file__).resolve().parents[1]
DB_PATH = Path(os.getenv("EXPERTDIAG_DB_PATH", str(BACKEND_DIR / ".expertdiag.sqlite3")))

if bool(SUPABASE_URL) != bool(SUPABASE_KEY):
    raise ValueError("Set both SUPABASE_URL and SUPABASE_SECRET_KEY.")

supabase: Client | None = (
    create_client(SUPABASE_URL, SUPABASE_KEY)
    if SUPABASE_URL and SUPABASE_KEY
    else None
)


@contextmanager
def local_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH, timeout=10)
    connection.row_factory = sqlite3.Row
    try:
        with connection:
            yield connection
    finally:
        connection.close()


def initialize_local_database():
    with local_db() as db:
        db.execute("BEGIN IMMEDIATE")
        existing = db.execute(
            "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'products'"
        ).fetchone()
        db.execute("""
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                reference TEXT COLLATE NOCASE NOT NULL UNIQUE,
                payload TEXT NOT NULL
            )
        """)
        db.execute("""
            CREATE TABLE IF NOT EXISTS intake_requests (
                submission_id TEXT PRIMARY KEY,
                kind TEXT NOT NULL,
                request_hash TEXT NOT NULL,
                reference TEXT NOT NULL UNIQUE,
                payload TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)
        if not existing:
            seed_path = BACKEND_DIR.parent / "data" / "products.json"
            products = json.loads(seed_path.read_text(encoding="utf-8"))
            db.executemany(
                "INSERT INTO products (id, reference, payload) VALUES (?, ?, ?)",
                [(product["id"], product["reference"], json.dumps(product)) for product in products],
            )
