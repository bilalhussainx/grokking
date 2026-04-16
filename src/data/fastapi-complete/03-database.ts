import { Module } from "../types";

export const module3: Module = {
  id: "database-sqlalchemy",
  title: "Database with SQLAlchemy & Alembic",
  description: "Connect to PostgreSQL/SQLite using SQLAlchemy ORM, write async queries, and manage migrations with Alembic",
  lessons: [
    {
      id: "sqlalchemy-setup",
      slug: "sqlalchemy-setup",
      title: "SQLAlchemy ORM: Models, Sessions & Async",
      content: `
# SQLAlchemy with FastAPI

FastAPI apps typically use SQLAlchemy for database access. The modern pattern uses **async SQLAlchemy** with an async PostgreSQL driver.

\`\`\`bash
pip install sqlalchemy asyncpg alembic
# asyncpg: fast async PostgreSQL driver
# alembic: database migration tool
\`\`\`

## Project Structure

\`\`\`concept
{
  "title": "Typical FastAPI + DB Layout",
  "description": "Separate concerns: database config, models, schemas (Pydantic), and CRUD operations in distinct files",
  "points": [
    "database.py: engine, session factory, Base class",
    "models.py: SQLAlchemy ORM models (table definitions)",
    "schemas.py: Pydantic models for request/response validation",
    "crud.py: database query functions",
    "routers/: FastAPI route handlers (thin — delegate to crud)",
    "alembic/: migration scripts auto-generated from model changes"
  ]
}
\`\`\`

## Database Setup

\`\`\`python
# database.py
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

DATABASE_URL = "postgresql+asyncpg://user:password@localhost/mydb"
# SQLite for dev: "sqlite+aiosqlite:///./app.db"

engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,          # connection pool
    max_overflow=10,
    echo=False,            # set True to log SQL
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession,
)

class Base(DeclarativeBase):
    pass

# Dependency — FastAPI injects this into route handlers:
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
        # session.close() called automatically (context manager)
\`\`\`

## SQLAlchemy Models

\`\`\`python
# models.py
from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    hashed_password: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # One-to-many: User has many Posts
    posts: Mapped[list["Post"]] = relationship(back_populates="author", lazy="selectin")

class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    content: Mapped[str]
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    is_published: Mapped[bool] = mapped_column(default=False)

    author: Mapped["User"] = relationship(back_populates="posts")
\`\`\`

## CRUD Operations (Async)

\`\`\`python
# crud.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload
from models import User, Post
from schemas import UserCreate

async def get_user(db: AsyncSession, user_id: int) -> User | None:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()

async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def list_users(db: AsyncSession, skip: int = 0, limit: int = 100) -> list[User]:
    result = await db.execute(
        select(User)
        .offset(skip)
        .limit(limit)
        .order_by(User.created_at.desc())
    )
    return list(result.scalars().all())

async def create_user(db: AsyncSession, user_data: UserCreate, hashed_password: str) -> User:
    db_user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)  # reload from DB (gets auto-generated id, created_at)
    return db_user

async def delete_user(db: AsyncSession, user_id: int) -> bool:
    result = await db.execute(delete(User).where(User.id == user_id))
    await db.commit()
    return result.rowcount > 0

# Complex query with join:
async def get_user_with_posts(db: AsyncSession, user_id: int) -> User | None:
    result = await db.execute(
        select(User)
        .where(User.id == user_id)
        .options(selectinload(User.posts))  # eager load posts
    )
    return result.scalar_one_or_none()
\`\`\`

## Route Handler with DB Dependency

\`\`\`python
# routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
import crud, schemas

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}", response_model=schemas.UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),  # dependency injection
):
    user = await crud.get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {user_id} not found",
        )
    return user

@router.post("/", response_model=schemas.UserResponse, status_code=201)
async def create_user(
    user_in: schemas.UserCreate,
    db: AsyncSession = Depends(get_db),
):
    existing = await crud.get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    hashed = hash_password(user_in.password)  # from auth module
    return await crud.create_user(db, user_in, hashed)
\`\`\`

## Alembic Migrations

\`\`\`bash
# Initialize Alembic:
alembic init alembic

# alembic.ini: set sqlalchemy.url = postgresql://...

# alembic/env.py: import Base and point to your models:
# from database import Base
# from models import User, Post  # import so Alembic sees them
# target_metadata = Base.metadata

# Auto-generate migration from model changes:
alembic revision --autogenerate -m "add users and posts tables"

# Apply migration:
alembic upgrade head

# Rollback one step:
alembic downgrade -1

# Check current version:
alembic current
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Why is 'await db.refresh(db_user)' called after commit?",
      "options": [
        "To re-validate the data",
        "To reload the instance from the database — gets auto-generated values like id and server_default timestamps",
        "To clear the session cache",
        "Required for async sessions"
      ],
      "answer": 1,
      "explanation": "After commit(), SQLAlchemy may expire the object's attributes. refresh() reloads it from the database, ensuring you get the actual stored values including auto-generated id, created_at (server_default), etc."
    },
    {
      "q": "What does 'Depends(get_db)' do in a route handler?",
      "options": [
        "Creates a new database connection for every request permanently",
        "FastAPI dependency injection: calls get_db(), passes the yielded session to the handler, then runs cleanup after the response",
        "Imports the database module",
        "Makes the route async"
      ],
      "answer": 1,
      "explanation": "Depends() is FastAPI's dependency injection. For a generator dependency (yield), FastAPI: calls get_db(), yields the session to the route, executes the route, then resumes after yield for cleanup (closing the session)."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
