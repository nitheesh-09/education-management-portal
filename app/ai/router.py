from datetime import datetime
from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select

from app.ai.engine import calculate_student_risk, generate_recommendations
from app.auth.authorization import require_roles
from app.db.database import SessionLocal
from app.models.ai_prediction import AIPrediction
from app.models.assignment import Assignment
from app.models.enrollment import Enrollment
from app.models.exam import Exam
from app.models.recommendation import Recommendation
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.user import User


router = APIRouter(prefix="/ai", tags=["ai"])


class AIPredictionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    student_id: UUID
    risk_level: str
    risk_score: Decimal
    confidence: Decimal
    performance_trend: str
    analysis_date: datetime


class RecommendationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    student_id: UUID
    subject: str
    recommendation: str
    priority: str
    estimated_time: str
    created_at: datetime


class StudentAnalysisResponse(BaseModel):
    prediction: AIPredictionResponse
    recommendations: list[RecommendationResponse]


def _get_student(db, student_id: UUID) -> Student:
    student = db.get(Student, student_id)
    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found",
        )
    return student


def _teacher_can_access_student(db, current_user: User, student_id: UUID) -> bool:
    teacher = db.scalar(select(Teacher).where(Teacher.user_id == current_user.id))
    if teacher is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher profile not found",
        )

    assignment_enrollment = db.scalar(
        select(Enrollment.id)
        .join(Assignment, Assignment.course_id == Enrollment.course_id)
        .where(
            Enrollment.student_id == student_id,
            Assignment.teacher_id == teacher.id,
        )
    )
    if assignment_enrollment is not None:
        return True

    exam_enrollment = db.scalar(
        select(Enrollment.id)
        .join(Exam, Exam.course_id == Enrollment.course_id)
        .where(
            Enrollment.student_id == student_id,
            Exam.teacher_id == teacher.id,
        )
    )
    return exam_enrollment is not None


def _authorize_student_access(db, current_user: User, student: Student) -> None:
    if current_user.role == "ADMIN":
        return
    if current_user.role == "TEACHER":
        if not _teacher_can_access_student(db, current_user, student.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not manage a course for this student",
            )
        return
    if current_user.role == "STUDENT" and student.user_id == current_user.id:
        return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You may only access your own AI data",
    )


@router.post(
    "/students/{student_id}/analyze",
    response_model=StudentAnalysisResponse,
    status_code=status.HTTP_201_CREATED,
)
def analyze_student(
    student_id: UUID,
    current_user: User = Depends(require_roles("ADMIN", "TEACHER")),
) -> StudentAnalysisResponse:
    db = SessionLocal()
    try:
        student = _get_student(db, student_id)
        _authorize_student_access(db, current_user, student)

        prediction = calculate_student_risk(db, student.id)
        recommendations = generate_recommendations(db, student.id)
        db.commit()
        db.refresh(prediction)
        for recommendation in recommendations:
            db.refresh(recommendation)

        return StudentAnalysisResponse(
            prediction=AIPredictionResponse.model_validate(prediction),
            recommendations=[
                RecommendationResponse.model_validate(recommendation)
                for recommendation in recommendations
            ],
        )
    finally:
        db.close()


@router.get(
    "/students/{student_id}/prediction",
    response_model=AIPredictionResponse,
)
def get_student_prediction(
    student_id: UUID,
    current_user: User = Depends(require_roles("ADMIN", "TEACHER", "STUDENT")),
) -> AIPredictionResponse:
    db = SessionLocal()
    try:
        student = _get_student(db, student_id)
        _authorize_student_access(db, current_user, student)

        prediction = db.scalar(
            select(AIPrediction)
            .where(AIPrediction.student_id == student.id)
            .order_by(AIPrediction.analysis_date.desc())
        )
        if prediction is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="AI prediction not found",
            )
        return AIPredictionResponse.model_validate(prediction)
    finally:
        db.close()


@router.get(
    "/students/{student_id}/recommendations",
    response_model=list[RecommendationResponse],
)
def get_student_recommendations(
    student_id: UUID,
    current_user: User = Depends(require_roles("ADMIN", "TEACHER", "STUDENT")),
) -> list[RecommendationResponse]:
    db = SessionLocal()
    try:
        student = _get_student(db, student_id)
        _authorize_student_access(db, current_user, student)

        recommendations = db.scalars(
            select(Recommendation)
            .where(Recommendation.student_id == student.id)
            .order_by(Recommendation.created_at.desc())
        ).all()
        return [
            RecommendationResponse.model_validate(recommendation)
            for recommendation in recommendations
        ]
    finally:
        db.close()
