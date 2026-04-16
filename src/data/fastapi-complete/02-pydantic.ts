import { Module } from "../types";

export const module2: Module = {
  id: "pydantic-validation",
  title: "Pydantic: Data Validation & Serialization",
  description: "Master Pydantic v2 models — validators, nested models, field constraints, and custom serializers",
  lessons: [
    {
      id: "pydantic-models",
      slug: "pydantic-models",
      title: "Pydantic Models, Fields & Validators",
      content: `
# Pydantic: The Heart of FastAPI

Pydantic v2 (used by FastAPI 0.100+) is a data validation library using Python type hints. It's the engine behind FastAPI's automatic request validation.

\`\`\`concept
{
  "title": "Pydantic Core Concepts",
  "description": "Pydantic validates, coerces, and serializes data. It's not just for FastAPI — it's used everywhere Python needs structured data with type safety.",
  "points": [
    "Models inherit from BaseModel — fields are class attributes with type annotations",
    "Validation happens on assignment (model_config validation_mode)",
    "Field() provides constraints: min_length, max_length, gt, ge, lt, le, pattern",
    "Validators: @field_validator for custom per-field validation",
    "@model_validator for cross-field validation",
    "model_dump() → dict, model_dump_json() → JSON string",
    "model_validate() / model_validate_json() → Model from dict/JSON"
  ]
}
\`\`\`

## Field Constraints

\`\`\`python
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
import re

class UserCreate(BaseModel):
    username: str = Field(
        min_length=3,
        max_length=30,
        pattern=r'^[a-zA-Z0-9_]+$',  # alphanumeric + underscore
        description="Unique username, alphanumeric",
    )
    email: EmailStr  # validates email format (pip install pydantic[email])
    age: int = Field(ge=18, le=120, description="Must be 18+")
    bio: Optional[str] = Field(default=None, max_length=500)
    score: float = Field(default=0.0, ge=0.0, le=100.0)

# Pydantic v2 coerces compatible types:
user = UserCreate(
    username="alice_99",
    email="alice@example.com",
    age="25",    # string "25" → int 25 (coercion)
)
print(user.age)  # 25 (int, not string)

# Validation error gives structured, clear messages:
try:
    bad = UserCreate(username="ab", email="not-an-email", age=15)
except ValueError as e:
    print(e)
# ValidationError: 3 validation errors for UserCreate
#   username: String should have at least 3 characters
#   email: value is not a valid email address
#   age: Input should be greater than or equal to 18
\`\`\`

## Field Validators

\`\`\`tabs
[
  {
    "label": "@field_validator",
    "content": "from pydantic import BaseModel, field_validator\\n\\nclass Product(BaseModel):\\n    name: str\\n    price: float\\n    category: str\\n\\n    @field_validator('name')\\n    @classmethod\\n    def name_must_not_be_empty(cls, v: str) -> str:\\n        if not v.strip():\\n            raise ValueError('Name cannot be empty or whitespace')\\n        return v.strip()  # can also transform the value!\\n\\n    @field_validator('price')\\n    @classmethod\\n    def price_must_be_positive(cls, v: float) -> float:\\n        if v <= 0:\\n            raise ValueError('Price must be positive')\\n        return round(v, 2)  # round to 2 decimal places\\n\\n    @field_validator('category')\\n    @classmethod\\n    def category_lowercase(cls, v: str) -> str:\\n        return v.lower()  # normalize to lowercase"
  },
  {
    "label": "@model_validator (cross-field)",
    "content": "from pydantic import BaseModel, model_validator\\nfrom datetime import date\\n\\nclass DateRange(BaseModel):\\n    start_date: date\\n    end_date: date\\n    max_days: int = 30\\n\\n    @model_validator(mode='after')\\n    def check_date_range(self) -> 'DateRange':\\n        if self.end_date <= self.start_date:\\n            raise ValueError('end_date must be after start_date')\\n        days = (self.end_date - self.start_date).days\\n        if days > self.max_days:\\n            raise ValueError(f'Range cannot exceed {self.max_days} days')\\n        return self"
  }
]
\`\`\`

## Nested Models

\`\`\`python
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Address(BaseModel):
    street: str
    city: str
    country: str = "US"
    postal_code: str

class UserProfile(BaseModel):
    id: int
    name: str
    address: Address              # nested model
    tags: list[str] = []          # list of strings
    metadata: dict[str, str] = {} # flexible key-value

# Nested model validation is recursive:
profile = UserProfile(
    id=1,
    name="Alice",
    address={                     # dict is automatically coerced to Address
        "street": "123 Main St",
        "city": "New York",
        "postal_code": "10001",
    },
    tags=["admin", "premium"],
)

# Serialization:
profile.model_dump()             # → full dict (nested)
profile.model_dump_json()        # → JSON string
profile.model_dump(exclude={"id"})  # exclude id field
profile.model_dump(include={"name", "address"})  # only these fields

# Update a model (returns new instance):
updated = profile.model_copy(update={"name": "Alice Smith"})
\`\`\`

## Model Config

\`\`\`python
from pydantic import BaseModel, ConfigDict

class StrictUser(BaseModel):
    model_config = ConfigDict(
        strict=True,           # no coercion (str "25" won't become int 25)
        extra="forbid",        # reject extra fields (not just ignore them)
        frozen=True,           # make instances immutable (hashable!)
        str_strip_whitespace=True,  # auto-strip string whitespace
        populate_by_name=True, # allow both alias and field name
    )

    name: str
    age: int

# extra="forbid" example:
try:
    user = StrictUser(name="Alice", age=25, unknown="oops")
except ValueError as e:
    print(e)  # "Extra inputs are not permitted"

# frozen=True:
user = StrictUser(name="Alice", age=25)
user.name = "Bob"  # ValidationError! Model is frozen.
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does model_dump() return?",
      "options": ["JSON string", "Python dictionary", "The model itself", "A string representation"],
      "answer": 1,
      "explanation": "model_dump() returns a Python dict. Use model_dump_json() for a JSON string. This replaced the old .dict() method in Pydantic v2."
    },
    {
      "q": "When should you use @model_validator instead of @field_validator?",
      "options": ["Never — field_validator is always sufficient", "When validation logic requires checking multiple fields together (cross-field validation)", "For performance-critical validation", "Only for nested models"],
      "answer": 1,
      "explanation": "@model_validator runs after all field validators and has access to all fields. Use it when validation depends on the relationship between fields (e.g., end_date must be after start_date)."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
