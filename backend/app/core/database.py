from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
import os

# Support both SQLite (local) and PostgreSQL (cloud/Vercel)
sqlite_file_name = "pharmaguard.db"

# If on Vercel and no DATABASE_URL, use /tmp for SQLite
if os.getenv("VERCEL") == "1" and not os.getenv("DATABASE_URL"):
    sqlite_path = os.path.join("/tmp", sqlite_file_name)
    database_url = f"sqlite:///{sqlite_path}"
else:
    database_url = os.getenv("DATABASE_URL", f"sqlite:///{sqlite_file_name}")

# Handle SQLite specific configuration
connect_args = {}
if database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(database_url, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
