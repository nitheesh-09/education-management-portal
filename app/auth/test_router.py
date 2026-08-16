from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.models.user import User


router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me")
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
) -> dict[str, str]:
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "role": current_user.role,
    }
