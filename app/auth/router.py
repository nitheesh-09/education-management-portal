from sqlalchemy import select
from fastapi import APIRouter, HTTPException, status

from app.auth.jwt import create_access_token
from app.auth.schemas import LoginRequest, TokenResponse
from app.auth.security import verify_password
from app.db.database import SessionLocal
from app.models.user import User


router = APIRouter(prefix="/auth", tags=["auth"])
invalid_credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid email or password",
    headers={"WWW-Authenticate": "Bearer"},
)


@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest) -> TokenResponse:
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.email == credentials.email))
        if user is None or not verify_password(credentials.password, user.password_hash):
            raise invalid_credentials_exception

        access_token = create_access_token(
            {"sub": str(user.id), "role": user.role}
        )
        return TokenResponse(access_token=access_token)
    finally:
        db.close()
