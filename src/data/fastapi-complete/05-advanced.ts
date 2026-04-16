import { Module } from "../types";

export const module5: Module = {
  id: "advanced-features",
  title: "Advanced FastAPI: Dependencies, Middleware & Background Tasks",
  description: "Dependency injection patterns, middleware, background tasks, WebSockets, file uploads, and CORS",
  lessons: [
    {
      id: "dependencies-middleware",
      slug: "dependencies-middleware",
      title: "Dependency Injection, Middleware & Background Tasks",
      content: `
# Advanced FastAPI Features

## Dependency Injection Deep Dive

\`\`\`concept
{
  "title": "FastAPI's Dependency System",
  "description": "Depends() is FastAPI's IoC container. Dependencies can depend on other dependencies (nested). They run before the route handler and can inject anything: DB sessions, current user, config, rate limiters.",
  "points": [
    "Dependencies run once per request (or can be cached with use_cache=True)",
    "Generator dependencies (yield) support cleanup code",
    "Dependencies can depend on other dependencies — composable",
    "class-based dependencies: instantiate with __call__",
    "HTTPException in a dependency propagates to the client",
    "Dependencies declared at router level apply to all routes in that router"
  ]
}
\`\`\`

\`\`\`python
from fastapi import FastAPI, Depends, HTTPException, Query
from typing import Annotated

app = FastAPI()

# Simple dependency:
def common_params(skip: int = 0, limit: int = Query(default=10, le=100)):
    return {"skip": skip, "limit": limit}

CommonParams = Annotated[dict, Depends(common_params)]

@app.get("/items/")
def list_items(params: CommonParams):  # cleaner with Annotated
    return params

# Class-based dependency (useful for config/state):
class Paginator:
    def __init__(self, page: int = 1, page_size: int = Query(default=20, le=100)):
        self.page = page
        self.page_size = page_size
        self.offset = (page - 1) * page_size

@app.get("/products/")
def list_products(pager: Annotated[Paginator, Depends(Paginator)]):
    return {"page": pager.page, "offset": pager.offset}

# Nested dependencies:
async def verify_api_key(x_api_key: str = Header()):
    if x_api_key != settings.API_KEY:
        raise HTTPException(403, "Invalid API key")
    return x_api_key

async def get_current_admin(
    api_key: Annotated[str, Depends(verify_api_key)],
    db: AsyncSession = Depends(get_db),
) -> User:
    # api_key verified above — now get admin user
    ...

# Apply dependency to all routes in a router:
admin_router = APIRouter(
    prefix="/admin",
    dependencies=[Depends(verify_api_key)],  # all routes require API key
)
\`\`\`

## Middleware

\`\`\`python
import time
from fastapi import Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

app = FastAPI()

# CORS — required for browser clients:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://myapp.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip responses:
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Custom middleware (timing + request ID):
import uuid

@app.middleware("http")
async def add_request_id_and_timing(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id

    start = time.perf_counter()
    response: Response = await call_next(request)
    duration = time.perf_counter() - start

    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = f"{duration:.4f}s"
    return response
\`\`\`

## Background Tasks

\`\`\`python
from fastapi import BackgroundTasks
import asyncio

async def send_welcome_email(email: str, name: str):
    # Runs AFTER the response is sent — doesn't block the client
    await asyncio.sleep(0)  # simulate async email send
    print(f"Sending welcome email to {name} <{email}>")

async def log_signup(user_id: int, ip: str):
    await db_log(f"New signup: user_id={user_id} ip={ip}")

@app.post("/users/", status_code=201)
async def register(
    user_in: UserCreate,
    background_tasks: BackgroundTasks,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    user = await crud.create_user(db, user_in)

    # Schedule tasks to run after response:
    background_tasks.add_task(send_welcome_email, user.email, user.name)
    background_tasks.add_task(log_signup, user.id, request.client.host)

    return user  # response sent immediately — tasks run after
\`\`\`

## File Uploads

\`\`\`python
from fastapi import UploadFile, File, Form
import aiofiles
import os

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@app.post("/upload/avatar")
async def upload_avatar(
    file: UploadFile = File(..., description="Profile picture"),
    user_id: int = Form(...),
):
    # Validate file type:
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(400, "Only JPEG, PNG, and WebP images allowed")

    # Validate size (stream to avoid loading whole file in memory):
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(413, "File too large (max 5MB)")

    # Save to disk (or upload to S3):
    filename = f"avatars/{user_id}_{file.filename}"
    async with aiofiles.open(filename, "wb") as f:
        await f.write(contents)

    return {"filename": filename, "size": len(contents)}

# Multiple files:
@app.post("/upload/photos")
async def upload_photos(files: list[UploadFile] = File(...)):
    return [{"name": f.filename, "type": f.content_type} for f in files]
\`\`\`

## Lifespan Events (Startup/Shutdown)

\`\`\`python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: runs before first request
    print("Starting up...")
    await create_db_tables()          # create tables if not exist
    app.state.redis = await connect_redis()  # shared connection pool

    yield  # app runs here

    # Shutdown: runs after last request
    print("Shutting down...")
    await app.state.redis.close()

app = FastAPI(lifespan=lifespan)
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Background tasks run:",
      "options": [
        "In parallel with the request handler",
        "Before the response is sent",
        "After the response is sent to the client",
        "In a separate process"
      ],
      "answer": 2,
      "explanation": "BackgroundTasks run AFTER the response is sent. The client receives the response immediately, then FastAPI runs the background tasks. Good for: sending emails, logging, cache invalidation — anything that doesn't need to block the response."
    },
    {
      "q": "What is the correct way to apply a dependency to ALL routes in a router?",
      "options": [
        "Add Depends() to every route",
        "Use 'dependencies' parameter in APIRouter()",
        "Use app.add_middleware()",
        "Use @app.on_event"
      ],
      "answer": 1,
      "explanation": "APIRouter(dependencies=[Depends(verify)]) applies the dependency to every route in that router. More maintainable than adding it to each route individually."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
