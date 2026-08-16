from datetime import datetime
from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select

from app.auth.authorization import require_roles
from app.db.database import SessionLocal
from app.models.ai_prediction import AIPrediction
from app.models.assignment import Assignment
from app.models.attendance import Attendance
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.exam import Exam
from app.models.exam_result import ExamResult
from app.models.performance_record import PerformanceRecord
from app.models.recommendation import Recommendation
from app.models.student import Student
from app.models.submission import Submission
from app.models.user import User


router = APIRouter(prefix="/student", tags=["student"])


class StudentProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    register_number: str
    full_name: str
    phone: str
    department: str
    year: int
    semester: int
    section: str
    cgpa: Decimal
    class_id: UUID


class EnrolledCourseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_code: str
    course_name: str
    description: str
    syllabus: str
    duration: str
    rating: Decimal


class StudentAssignmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_id: UUID
    title: str
    description: str
    due_date: datetime
    max_marks: Decimal
    created_at: datetime


class StudentExamResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_id: UUID
    exam_name: str
    exam_date: datetime
    max_marks: Decimal
    created_at: datetime


class StudentAttendanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_id: UUID
    date: datetime
    status: str


class SubmissionCreateRequest(BaseModel):
    submission_text: str = Field(min_length=1)


class SubmissionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    assignment_id: UUID
    submission_text: str
    submitted_at: datetime
    marks: Decimal | None
    feedback: str | None


class StudentExamResultResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    exam_id: UUID
    marks: Decimal


class StudentPerformanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_id: UUID
    overall_score: Decimal
    attendance_percentage: Decimal
    assignment_average: Decimal
    exam_average: Decimal
    performance_trend: str
    recorded_at: datetime


class StudentRecommendationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    subject: str
    recommendation: str
    priority: str
    estimated_time: str
    created_at: datetime


class StudentAIPredictionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    risk_level: str
    risk_score: Decimal
    confidence: Decimal
    performance_trend: str
    analysis_date: datetime


@router.get("/profile", response_model=StudentProfileResponse)
def get_student_profile(
    current_user: User = Depends(require_roles("STUDENT")),
) -> StudentProfileResponse:
    db = SessionLocal()
    try:
        student = db.scalar(select(Student).where(Student.user_id == current_user.id))
        if student is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )
        return StudentProfileResponse.model_validate(student)
    finally:
        db.close()


@router.get("/courses", response_model=list[EnrolledCourseResponse])
def get_student_courses(
    current_user: User = Depends(require_roles("STUDENT")),
) -> list[EnrolledCourseResponse]:
    db = SessionLocal()
    try:
        student = db.scalar(select(Student).where(Student.user_id == current_user.id))
        if student is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )

        courses = db.scalars(
            select(Course)
            .join(Enrollment, Enrollment.course_id == Course.id)
            .where(Enrollment.student_id == student.id)
        ).all()
        return [EnrolledCourseResponse.model_validate(course) for course in courses]
    finally:
        db.close()


@router.get("/assignments", response_model=list[StudentAssignmentResponse])
def get_student_assignments(
    current_user: User = Depends(require_roles("STUDENT")),
) -> list[StudentAssignmentResponse]:
    db = SessionLocal()
    try:
        student = db.scalar(select(Student).where(Student.user_id == current_user.id))
        if student is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )

        assignments = db.scalars(
            select(Assignment)
            .join(Enrollment, Enrollment.course_id == Assignment.course_id)
            .where(Enrollment.student_id == student.id)
        ).all()
        return [
            StudentAssignmentResponse.model_validate(assignment)
            for assignment in assignments
        ]
    finally:
        db.close()


@router.get("/exams", response_model=list[StudentExamResponse])
def get_student_exams(
    current_user: User = Depends(require_roles("STUDENT")),
) -> list[StudentExamResponse]:
    db = SessionLocal()
    try:
        student = db.scalar(select(Student).where(Student.user_id == current_user.id))
        if student is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )

        exams = db.scalars(
            select(Exam)
            .join(Enrollment, Enrollment.course_id == Exam.course_id)
            .where(Enrollment.student_id == student.id)
        ).all()
        return [StudentExamResponse.model_validate(exam) for exam in exams]
    finally:
        db.close()


@router.get("/attendance", response_model=list[StudentAttendanceResponse])
def get_student_attendance(
    current_user: User = Depends(require_roles("STUDENT")),
) -> list[StudentAttendanceResponse]:
    db = SessionLocal()
    try:
        student = db.scalar(select(Student).where(Student.user_id == current_user.id))
        if student is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )

        attendance_records = db.scalars(
            select(Attendance).where(Attendance.student_id == student.id)
        ).all()
        return [
            StudentAttendanceResponse.model_validate(attendance)
            for attendance in attendance_records
        ]
    finally:
        db.close()


@router.post(
    "/assignments/{assignment_id}/submit",
    response_model=SubmissionResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_assignment(
    assignment_id: UUID,
    submission_data: SubmissionCreateRequest,
    current_user: User = Depends(require_roles("STUDENT")),
) -> SubmissionResponse:
    db = SessionLocal()
    try:
        student = db.scalar(select(Student).where(Student.user_id == current_user.id))
        if student is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )

        assignment = db.get(Assignment, assignment_id)
        if assignment is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assignment not found",
            )

        enrollment = db.scalar(
            select(Enrollment).where(
                Enrollment.student_id == student.id,
                Enrollment.course_id == assignment.course_id,
            )
        )
        if enrollment is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not enrolled in this assignment's course",
            )

        existing_submission = db.scalar(
            select(Submission).where(
                Submission.assignment_id == assignment.id,
                Submission.student_id == student.id,
            )
        )
        if existing_submission is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Assignment has already been submitted",
            )

        submission = Submission(
            assignment_id=assignment.id,
            student_id=student.id,
            submission_text=submission_data.submission_text,
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)
        return SubmissionResponse.model_validate(submission)
    finally:
        db.close()


@router.get("/submissions", response_model=list[SubmissionResponse])
def get_student_submissions(
    current_user: User = Depends(require_roles("STUDENT")),
) -> list[SubmissionResponse]:
    db = SessionLocal()
    try:
        student = db.scalar(select(Student).where(Student.user_id == current_user.id))
        if student is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )

        submissions = db.scalars(
            select(Submission).where(Submission.student_id == student.id)
        ).all()
        return [
            SubmissionResponse.model_validate(submission)
            for submission in submissions
        ]
    finally:
        db.close()


@router.get("/results", response_model=list[StudentExamResultResponse])
def get_student_results(
    current_user: User = Depends(require_roles("STUDENT")),
) -> list[StudentExamResultResponse]:
    db = SessionLocal()
    try:
        student = db.scalar(select(Student).where(Student.user_id == current_user.id))
        if student is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )

        results = db.scalars(
            select(ExamResult).where(ExamResult.student_id == student.id)
        ).all()
        return [
            StudentExamResultResponse.model_validate(result) for result in results
        ]
    finally:
        db.close()


@router.get("/performance", response_model=list[StudentPerformanceResponse])
def get_student_performance(
    current_user: User = Depends(require_roles("STUDENT")),
) -> list[StudentPerformanceResponse]:
    db = SessionLocal()
    try:
        student = db.scalar(select(Student).where(Student.user_id == current_user.id))
        if student is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )

        records = db.scalars(
            select(PerformanceRecord).where(PerformanceRecord.student_id == student.id)
        ).all()
        return [
            StudentPerformanceResponse.model_validate(record) for record in records
        ]
    finally:
        db.close()


@router.get("/recommendations", response_model=list[StudentRecommendationResponse])
def get_student_recommendations(
    current_user: User = Depends(require_roles("STUDENT")),
) -> list[StudentRecommendationResponse]:
    db = SessionLocal()
    try:
        student = db.scalar(select(Student).where(Student.user_id == current_user.id))
        if student is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )

        recommendations = db.scalars(
            select(Recommendation).where(Recommendation.student_id == student.id)
        ).all()
        return [
            StudentRecommendationResponse.model_validate(recommendation)
            for recommendation in recommendations
        ]
    finally:
        db.close()


@router.get("/ai-prediction", response_model=StudentAIPredictionResponse)
def get_student_ai_prediction(
    current_user: User = Depends(require_roles("STUDENT")),
) -> StudentAIPredictionResponse:
    db = SessionLocal()
    try:
        student = db.scalar(select(Student).where(Student.user_id == current_user.id))
        if student is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student profile not found",
            )

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
        return StudentAIPredictionResponse.model_validate(prediction)
    finally:
        db.close()
