import { Module } from "../types";

export const module1: Module = {
  id: "fastapi-fundamentals",
  title: "FastAPI Fundamentals",
  description: "Path params, query params, request bodies, response models — the core of every FastAPI application",
  lessons: [
    {
      id: "first-api",
      slug: "first-api",
      title: "Your First FastAPI App: Routes & Parameters",
      content: `
# FastAPI: Modern Python APIs

FastAPI is a high-performance web framework for building APIs with Python 3.9+. It's built on **Starlette** (ASGI) and **Pydantic** (data validation) and auto-generates OpenAPI/Swagger docs.

\`\`\`concept
{
  "title": "Why FastAPI?",
  "description": "FastAPI combines the speed of Node.js/Go with Python's elegance. It's the dominant Python framework for API development alongside Django REST Framework.",
  "points": [
    "Async-first: built on ASGI (Starlette) — handles thousands of concurrent requests",
    "Automatic validation: Pydantic validates request data from type hints",
    "Auto-generated docs: Swagger UI at /docs, ReDoc at /redoc — zero configuration",
    "Type hints drive everything: path params, query params, request body, response model",
    "Python 3.9+ type hints are not optional — they ARE the API contract",
    "Performance: comparable to NodeJS and Go, much faster than Flask/Django for I/O"
  ]
}
\`\`\`

## Installation & First App

\`\`\`bash
pip install fastapi uvicorn[standard] pydantic
# uvicorn: ASGI server — runs your FastAPI app
# pydantic: data validation (included with FastAPI but good to know explicitly)
\`\`\`

\`\`\`python
# main.py — minimal FastAPI app
from fastapi import FastAPI

app = FastAPI(title="My API", version="1.0.0")

@app.get("/")
def root():
    return {"message": "Hello, FastAPI!"}

@app.get("/health")
def health():
    return {"status": "ok"}

# Run: uvicorn main:app --reload
# Docs: http://127.0.0.1:8000/docs
\`\`\`

## Path Parameters

\`\`\`tabs
[
  {
    "label": "Basic Path Params",
    "content": "from fastapi import FastAPI\\n\\napp = FastAPI()\\n\\n# Path parameter: {item_id} in URL\\n@app.get('/items/{item_id}')\\ndef get_item(item_id: int):  # int type → automatic conversion + validation\\n    return {'item_id': item_id}\\n\\n# GET /items/42   → {'item_id': 42}\\n# GET /items/abc  → 422 Unprocessable Entity (not an int!)"
  },
  {
    "label": "Enum Path Params",
    "content": "from enum import Enum\\nfrom fastapi import FastAPI\\n\\nclass Category(str, Enum):\\n    electronics = 'electronics'\\n    clothing = 'clothing'\\n    food = 'food'\\n\\napp = FastAPI()\\n\\n@app.get('/categories/{category}')\\ndef get_category(category: Category):\\n    if category == Category.electronics:\\n        return {'category': category, 'tax_rate': 0.1}\\n    return {'category': category, 'tax_rate': 0.05}\\n\\n# GET /categories/electronics → valid\\n# GET /categories/invalid   → 422 (not in enum)"
  },
  {
    "label": "Path Param Validation",
    "content": "from fastapi import FastAPI, Path\\n\\napp = FastAPI()\\n\\n@app.get('/users/{user_id}')\\ndef get_user(\\n    user_id: int = Path(\\n        gt=0,        # greater than 0\\n        le=1_000_000, # less than or equal to 1M\\n        description='The user ID'\\n    )\\n):\\n    return {'user_id': user_id}\\n\\n# GET /users/0  → 422 (not > 0)\\n# GET /users/-1 → 422 (not > 0)"
  }
]
\`\`\`

## Query Parameters

\`\`\`python
from fastapi import FastAPI, Query
from typing import Optional

app = FastAPI()

# Query params: everything NOT in the path template
@app.get("/items/")
def list_items(
    skip: int = 0,                          # default = 0
    limit: int = Query(default=10, le=100), # max 100
    search: Optional[str] = None,           # optional
    active: bool = True,                    # type coerced: ?active=false
):
    # GET /items/?skip=20&limit=5&search=laptop&active=true
    return {
        "skip": skip,
        "limit": limit,
        "search": search,
        "active": active,
    }

# Bool query params accept: true/false, 1/0, on/off, yes/no (case-insensitive)
\`\`\`

## Response Models

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

class UserCreate(BaseModel):
    name: str
    email: str
    password: str       # internal — don't return this!

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    # No password field → never returned in response

# response_model filters the output — even if function returns more:
@app.post("/users/", response_model=UserResponse, status_code=201)
def create_user(user: UserCreate):
    # Simulate DB creation:
    db_user = {"id": 1, "name": user.name, "email": user.email, "password": user.password}
    return db_user  # password is in here, but response_model strips it!
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does FastAPI automatically do when you declare a path parameter as 'int'?",
      "options": ["Nothing extra", "Converts the string from the URL to int AND validates it is a valid integer, returning 422 if not", "Only converts, no validation", "Only validates, no conversion"],
      "answer": 1,
      "explanation": "FastAPI uses Pydantic under the hood. Declaring int means: parse the URL string to int, validate it's a valid integer. If not, returns HTTP 422 Unprocessable Entity automatically."
    },
    {
      "q": "What does the 'response_model' parameter do?",
      "options": ["Defines what the request body must look like", "Filters and validates the response — any extra fields not in the model are excluded", "Sets the HTTP response status code", "Enables caching"],
      "answer": 1,
      "explanation": "response_model tells FastAPI to serialize the return value using that Pydantic model, filtering out any extra fields. It also generates the correct OpenAPI schema for the response."
    }
  ]
}
\`\`\`
`,
      starterCode: `# Build a products API with:
# GET /products/ — list with optional ?category=electronics&min_price=10&max_price=500
# GET /products/{product_id} — get one (validate id > 0)
# POST /products/ — create (return without internal fields like cost_price)
#
# Use these Pydantic models and route them correctly

from fastapi import FastAPI, Path, Query
from pydantic import BaseModel, Field
from typing import Optional

app = FastAPI(title="Products API")

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    cost_price: float  # internal — don't expose in response

class ProductResponse(BaseModel):
    id: int
    name: str
    category: str
    price: float

PRODUCTS = []  # in-memory store

# TODO: implement the three routes here
`,
      solutionCode: `from fastapi import FastAPI, Path, Query
from pydantic import BaseModel, Field
from typing import Optional

app = FastAPI(title="Products API")

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float = Field(gt=0)
    cost_price: float = Field(gt=0)

class ProductResponse(BaseModel):
    id: int
    name: str
    category: str
    price: float

PRODUCTS = []
next_id = 1

@app.get("/products/", response_model=list[ProductResponse])
def list_products(
    category: Optional[str] = None,
    min_price: float = Query(default=0, ge=0),
    max_price: float = Query(default=999_999, gt=0),
):
    results = PRODUCTS
    if category:
        results = [p for p in results if p["category"] == category]
    results = [p for p in results if min_price <= p["price"] <= max_price]
    return results

@app.get("/products/{product_id}", response_model=ProductResponse)
def get_product(product_id: int = Path(gt=0)):
    for p in PRODUCTS:
        if p["id"] == product_id:
            return p
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Product not found")

@app.post("/products/", response_model=ProductResponse, status_code=201)
def create_product(product: ProductCreate):
    global next_id
    db_product = {"id": next_id, **product.model_dump()}
    PRODUCTS.append(db_product)
    next_id += 1
    return db_product  # response_model strips cost_price
`,
    },
  ],
};
