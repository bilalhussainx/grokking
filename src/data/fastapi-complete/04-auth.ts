import { Module } from "../types";

export const module4: Module = {
  id: "authentication",
  title: "Authentication: JWT & OAuth2",
  description: "Secure your API with JWT tokens, OAuth2 password flow, bcrypt password hashing, and role-based access control",
  lessons: [
    {
      id: "jwt-oauth2",
      slug: "jwt-oauth2",
      title: "JWT Auth, OAuth2 Password Flow & RBAC",
      content: `
# Authentication in FastAPI

FastAPI has built-in support for OAuth2 and JWT. This is the standard pattern for securing REST APIs.

\`\`\`bash
pip install python-jose[cryptography] passlib[bcrypt]
# python-jose: JWT encoding/decoding
# passlib[bcrypt]: password hashing
\`\`\`

## Password Hashing

\`\`\`python
# security.py
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.environ["SECRET_KEY"]  # 256-bit random key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode["exp"] = expire
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
\`\`\`

## OAuth2 Password Flow

\`\`\`python
# auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from security import verify_password, create_access_token
import crud

router = APIRouter(prefix="/auth", tags=["auth"])

# tokenUrl tells Swagger where to send login requests:
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

@router.post("/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    # OAuth2PasswordRequestForm gives us: form_data.username, form_data.password
    user = await crud.get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}
\`\`\`

## Current User Dependency

\`\`\`python
# deps.py
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from auth import oauth2_scheme
from security import decode_token
import crud
from models import User

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception

    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    user = await crud.get_user(db, int(user_id))
    if user is None or not user.is_active:
        raise credentials_exception
    return user

# Role-Based Access Control (RBAC):
def require_role(*roles: str):
    async def check_role(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Required role: {roles}",
            )
        return current_user
    return check_role

# Usage:
@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    current_user: User = Depends(require_role("admin")),  # admin only
    db: AsyncSession = Depends(get_db),
):
    ...

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
\`\`\`

## Refresh Tokens Pattern

\`\`\`python
# Two-token pattern: short-lived access + long-lived refresh

def create_tokens(user_id: int, role: str) -> dict:
    access_token = create_access_token(
        data={"sub": str(user_id), "role": role, "type": "access"},
        expires_delta=timedelta(minutes=15),  # short-lived
    )
    refresh_token = create_access_token(
        data={"sub": str(user_id), "type": "refresh"},
        expires_delta=timedelta(days=30),     # long-lived
    )
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }

@router.post("/refresh")
async def refresh(
    refresh_token: str,
    db: AsyncSession = Depends(get_db),
):
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(401, "Invalid refresh token")

    user = await crud.get_user(db, int(payload["sub"]))
    if not user:
        raise HTTPException(401, "User not found")

    # Issue new access token only (not refresh — sliding window is a choice)
    new_access = create_access_token(
        data={"sub": str(user.id), "role": user.role, "type": "access"},
        expires_delta=timedelta(minutes=15),
    )
    return {"access_token": new_access, "token_type": "bearer"}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Why should access tokens be short-lived (15-30 minutes)?",
      "options": [
        "Performance reasons",
        "To reduce database load",
        "If a token is stolen, the window for misuse is limited — it expires quickly even without revocation",
        "Required by the OAuth2 spec"
      ],
      "answer": 2,
      "explanation": "JWTs are stateless — you can't invalidate them server-side without a blocklist. Short expiry limits the damage if a token is compromised. Refresh tokens allow getting new access tokens without re-login."
    },
    {
      "q": "What does OAuth2PasswordBearer(tokenUrl='/auth/token') do?",
      "options": [
        "Creates the login endpoint",
        "Tells FastAPI to extract the Bearer token from the Authorization header, and tells Swagger UI where to send login requests",
        "Validates the JWT automatically",
        "Sets the token expiry"
      ],
      "answer": 1,
      "explanation": "OAuth2PasswordBearer extracts the Bearer token from the Authorization: Bearer <token> header. The tokenUrl parameter tells Swagger UI which endpoint to use for the 'Authorize' button — it doesn't create the endpoint."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
