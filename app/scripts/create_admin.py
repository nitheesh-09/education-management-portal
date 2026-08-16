from sqlalchemy import select

from app.auth.security import hash_password
from app.db.database import SessionLocal
from app.models.user import User


ADMIN_EMAIL = "admin@educationportal.com"
ADMIN_PASSWORD = "Admin@123"


def create_admin() -> None:
    db = SessionLocal()
    try:
        existing_admin = db.scalar(select(User).where(User.email == ADMIN_EMAIL))
        if existing_admin is not None:
            print(f"Admin user already exists: {ADMIN_EMAIL}")
            return

        admin = User(
            email=ADMIN_EMAIL,
            password_hash=hash_password(ADMIN_PASSWORD),
            role="ADMIN",
            is_active=True,
        )
        db.add(admin)
        db.commit()
        print(f"Admin user created: {ADMIN_EMAIL}")
    finally:
        db.close()


if __name__ == "__main__":
    create_admin()
