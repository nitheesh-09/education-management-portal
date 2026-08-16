from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import func, select

from app.auth.authorization import require_roles
from app.db.database import SessionLocal
from app.models.assignment import Assignment
from app.models.attendance import Attendance
from app.models.class_model import Class
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.exam import Exam
from app.models.exam_result import ExamResult
from app.models.student import Student
from app.models.submission import Submission
from app.models.teacher import Teacher
from app.models.user import User


router = APIRouter(prefix="/dashboard", tags=["dashboard"])


class AdminDashboardResponse(BaseModel):
    total_students: int
    total_teachers: int
    total_courses: int
    total_classes: int
    total_enrollments: int
    total_assignments: int
    total_exams: int


class StudentDashboardResponse(BaseModel):
    student_name: str
    total_enrolled_courses: int
    total_assignments: int
    total_submissions: int
    total_exams: int
    total_exam_results: int
    average_exam_marks: Decimal
    average_assignment_marks: Decimal
    attendance_percentage: Decimal


class TeacherDashboardResponse(BaseModel):
    teacher_name: str
    total_courses_managed: int
    total_assignments: int
    total_submissions: int
    total_exams: int
    total_students_in_managed_courses: int
    total_attendance_records: int
    total_exam_results: int


def _get_student(db, current_user: User) -> Student:
    student = db.scalar(select(Student).where(Student.user_id == current_user.id))
    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        )
    return student


def _get_teacher(db, current_user: User) -> Teacher:
    teacher = db.scalar(select(Teacher).where(Teacher.user_id == current_user.id))
    if teacher is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher profile not found",
        )
    return teacher


def _managed_course_ids(teacher: Teacher):
    return (
        select(Assignment.course_id.label("course_id"))
        .where(Assignment.teacher_id == teacher.id)
        .union(
            select(Exam.course_id.label("course_id")).where(
                Exam.teacher_id == teacher.id
            )
        )
        .subquery()
    )


@router.get("/admin", response_model=AdminDashboardResponse)
def get_admin_dashboard(
    _: User = Depends(require_roles("ADMIN")),
) -> AdminDashboardResponse:
    db = SessionLocal()
    try:
        return AdminDashboardResponse(
            total_students=db.scalar(select(func.count(Student.id))) or 0,
            total_teachers=db.scalar(select(func.count(Teacher.id))) or 0,
            total_courses=db.scalar(select(func.count(Course.id))) or 0,
            total_classes=db.scalar(select(func.count(Class.id))) or 0,
            total_enrollments=db.scalar(select(func.count(Enrollment.id))) or 0,
            total_assignments=db.scalar(select(func.count(Assignment.id))) or 0,
            total_exams=db.scalar(select(func.count(Exam.id))) or 0,
        )
    finally:
        db.close()


@router.get("/student", response_model=StudentDashboardResponse)
def get_student_dashboard(
    current_user: User = Depends(require_roles("STUDENT")),
) -> StudentDashboardResponse:
    db = SessionLocal()
    try:
        student = _get_student(db, current_user)
        total_attendance_records = db.scalar(
            select(func.count(Attendance.id)).where(Attendance.student_id == student.id)
        ) or 0
        present_attendance_records = db.scalar(
            select(func.count(Attendance.id)).where(
                Attendance.student_id == student.id,
                func.upper(Attendance.status) == "PRESENT",
            )
        ) or 0
        attendance_percentage = (
            Decimal(present_attendance_records) * Decimal("100")
            / Decimal(total_attendance_records)
            if total_attendance_records
            else Decimal("0")
        )

        average_exam_marks = db.scalar(
            select(func.avg(ExamResult.marks)).where(ExamResult.student_id == student.id)
        )
        average_assignment_marks = db.scalar(
            select(func.avg(Submission.marks)).where(Submission.student_id == student.id)
        )

        return StudentDashboardResponse(
            student_name=student.full_name,
            total_enrolled_courses=db.scalar(
                select(func.count(Enrollment.id)).where(Enrollment.student_id == student.id)
            ) or 0,
            total_assignments=db.scalar(
                select(func.count(Assignment.id))
                .join(Enrollment, Enrollment.course_id == Assignment.course_id)
                .where(Enrollment.student_id == student.id)
            ) or 0,
            total_submissions=db.scalar(
                select(func.count(Submission.id)).where(Submission.student_id == student.id)
            ) or 0,
            total_exams=db.scalar(
                select(func.count(Exam.id))
                .join(Enrollment, Enrollment.course_id == Exam.course_id)
                .where(Enrollment.student_id == student.id)
            ) or 0,
            total_exam_results=db.scalar(
                select(func.count(ExamResult.id)).where(ExamResult.student_id == student.id)
            ) or 0,
            average_exam_marks=(
                Decimal(str(average_exam_marks))
                if average_exam_marks is not None
                else Decimal("0")
            ),
            average_assignment_marks=(
                Decimal(str(average_assignment_marks))
                if average_assignment_marks is not None
                else Decimal("0")
            ),
            attendance_percentage=attendance_percentage,
        )
    finally:
        db.close()


@router.get("/teacher", response_model=TeacherDashboardResponse)
def get_teacher_dashboard(
    current_user: User = Depends(require_roles("TEACHER")),
) -> TeacherDashboardResponse:
    db = SessionLocal()
    try:
        teacher = _get_teacher(db, current_user)
        managed_course_ids = _managed_course_ids(teacher)
        managed_course_id_query = select(managed_course_ids.c.course_id)

        return TeacherDashboardResponse(
            teacher_name=teacher.full_name,
            total_courses_managed=db.scalar(
                select(func.count()).select_from(managed_course_ids)
            ) or 0,
            total_assignments=db.scalar(
                select(func.count(Assignment.id)).where(Assignment.teacher_id == teacher.id)
            ) or 0,
            total_submissions=db.scalar(
                select(func.count(Submission.id))
                .join(Assignment, Submission.assignment_id == Assignment.id)
                .where(Assignment.teacher_id == teacher.id)
            ) or 0,
            total_exams=db.scalar(
                select(func.count(Exam.id)).where(Exam.teacher_id == teacher.id)
            ) or 0,
            total_students_in_managed_courses=db.scalar(
                select(func.count(func.distinct(Enrollment.student_id))).where(
                    Enrollment.course_id.in_(managed_course_id_query)
                )
            ) or 0,
            total_attendance_records=db.scalar(
                select(func.count(Attendance.id)).where(
                    Attendance.course_id.in_(managed_course_id_query)
                )
            ) or 0,
            total_exam_results=db.scalar(
                select(func.count(ExamResult.id))
                .join(Exam, ExamResult.exam_id == Exam.id)
                .where(Exam.teacher_id == teacher.id)
            ) or 0,
        )
    finally:
        db.close()
