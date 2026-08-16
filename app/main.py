from fastapi import FastAPI

from app.auth.router import router as auth_router
from app.auth.test_router import router as test_auth_router
from app.admin.router import router as admin_router
from app.student.router import router as student_router
from app.teacher.router import router as teacher_router
from app.dashboard.router import router as dashboard_router
from app.reports.router import router as reports_router
from app.ai.router import router as ai_router

from app.db.database import init_db


app = FastAPI(title="Education Management Portal")


# Authentication
app.include_router(auth_router)
app.include_router(test_auth_router)

# Admin APIs
app.include_router(admin_router)

# Student APIs
app.include_router(student_router)

# Teacher APIs
app.include_router(teacher_router)

# Dashboard APIs
app.include_router(dashboard_router)

# Reports & Analytics APIs
app.include_router(reports_router)

# AI APIs
app.include_router(ai_router)


@app.on_event("startup")
def startup_event() -> None:
    init_db()


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}