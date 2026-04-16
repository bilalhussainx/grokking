import { Module } from "../types";

export const module6: Module = {
  id: "testing-deployment",
  title: "Testing, Performance & Deployment",
  description: "pytest with async support, TestClient, mocking dependencies, performance patterns, Docker, and production checklist",
  lessons: [
    {
      id: "testing",
      slug: "testing",
      title: "Testing FastAPI with pytest & AsyncClient",
      content: `
# Testing FastAPI Applications

FastAPI provides excellent testing support via \`TestClient\` (sync) and \`AsyncClient\` (async).

\`\`\`bash
pip install pytest pytest-asyncio httpx
# httpx: async HTTP client used by FastAPI's AsyncClient
\`\`\`

## Test Setup & Fixtures

\`\`\`python
# conftest.py — shared fixtures
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from database import Base, get_db
from main import app

# Test database — use SQLite (fast, no server needed):
TEST_DB_URL = "sqlite+aiosqlite:///./test.db"

@pytest_asyncio.fixture(scope="session")
async def db_engine():
    engine = create_async_engine(TEST_DB_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()

@pytest_asyncio.fixture
async def db_session(db_engine):
    AsyncTestSession = async_sessionmaker(bind=db_engine, expire_on_commit=False)
    async with AsyncTestSession() as session:
        yield session
        await session.rollback()  # clean up after each test

@pytest_asyncio.fixture
async def client(db_session):
    # Override get_db to use test database:
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac

    app.dependency_overrides.clear()
\`\`\`

## Writing Tests

\`\`\`python
# test_users.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_user(client: AsyncClient):
    response = await client.post("/users/", json={
        "name": "Alice",
        "email": "alice@example.com",
        "password": "SecurePass123!",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "alice@example.com"
    assert "password" not in data  # must never be returned
    assert "id" in data

@pytest.mark.asyncio
async def test_create_duplicate_user(client: AsyncClient):
    # Create first user:
    await client.post("/users/", json={"name": "Bob", "email": "bob@x.com", "password": "Pass123!"})
    # Try again with same email:
    response = await client.post("/users/", json={"name": "Bob2", "email": "bob@x.com", "password": "Pass123!"})
    assert response.status_code == 409

@pytest.mark.asyncio
async def test_get_protected_route_without_token(client: AsyncClient):
    response = await client.get("/users/me")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_authenticated_flow(client: AsyncClient):
    # Register:
    await client.post("/users/", json={"name": "Carol", "email": "carol@x.com", "password": "Pass123!"})

    # Login:
    login = await client.post("/auth/token", data={
        "username": "carol@x.com",
        "password": "Pass123!",
    })
    assert login.status_code == 200
    token = login.json()["access_token"]

    # Use protected endpoint:
    me = await client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == "carol@x.com"

# Mocking external dependencies:
from unittest.mock import AsyncMock, patch

@pytest.mark.asyncio
async def test_email_sent_on_register(client: AsyncClient):
    with patch("routers.users.send_welcome_email", new=AsyncMock()) as mock_email:
        response = await client.post("/users/", json={
            "name": "Dave", "email": "dave@x.com", "password": "Pass123!"
        })
        assert response.status_code == 201
        mock_email.assert_called_once_with("dave@x.com", "Dave")
\`\`\`

## Production Deployment

\`\`\`concept
{
  "title": "Production Checklist",
  "description": "Before deploying a FastAPI app to production",
  "points": [
    "Set DEBUG=False and use environment variables for all secrets",
    "Use uvicorn with multiple workers: uvicorn main:app --workers 4",
    "Or use gunicorn as process manager: gunicorn main:app -k uvicorn.workers.UvicornWorker -w 4",
    "Set up CORS to only allow your actual frontend domain",
    "Add rate limiting (slowapi library or API gateway)",
    "Enable request logging and structured JSON logs",
    "Use Alembic migrations — never modify schema manually in prod",
    "Health check endpoint at /health for load balancer",
    "Disable /docs in production or protect with auth"
  ]
}
\`\`\`

\`\`\`bash
# Dockerfile:
# FROM python:3.12-slim
# WORKDIR /app
# COPY requirements.txt .
# RUN pip install -r requirements.txt
# COPY . .
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]

# docker-compose.yml excerpt:
# services:
#   api:
#     build: .
#     ports: ["8000:8000"]
#     environment:
#       DATABASE_URL: postgresql+asyncpg://user:pass@db/mydb
#       SECRET_KEY: \${SECRET_KEY}
#   db:
#     image: postgres:16
#     environment:
#       POSTGRES_PASSWORD: pass
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does app.dependency_overrides[get_db] = override_get_db do in tests?",
      "options": [
        "Disables database access",
        "Replaces the real get_db dependency with a test version that uses the test database",
        "Mocks all database operations",
        "Creates a second database connection"
      ],
      "answer": 1,
      "explanation": "dependency_overrides allows replacing any dependency with a test version. This is how you point FastAPI to a test database or mock external services in tests without changing application code."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Use AsyncClient (httpx) for async endpoint testing, TestClient for sync", "Override dependencies with app.dependency_overrides for test isolation", "Rollback test database sessions after each test — no leftover data", "Always test: happy path, validation errors, auth failures, and edge cases", "Use uvicorn + gunicorn in production for multi-worker async apps"]
\`\`\`
`,
    },
  ],
};
