from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import func, select

from app.auth.authorization import require_roles
from app.db.database import SessionLocal
from app.models.assignment import Assignment
from app.models.attendance import Attendance
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.exam import Exam
from app.models.exam_result import ExamResult
from app.models.performance_record import PerformanceRecord
from app.models.student import Student
from app.models.submission import Submission
from app.models.teacher import Teacher
from app.models.user import User


router = APIRouter(prefix="/reports", tags=["reports"])


class StudentDetailsResponse(BaseModel):
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


class CourseDetailsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_code: str
    course_name: str
    description: str
    syllabus: str
    duration: str
    rating: Decimal


class OverallPerformanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_id: UUID
    overall_score: Decimal
    attendance_percentage: Decimal
    assignment_average: Decimal
    exam_average: Decimal
    performance_trend: str


class StudentReportResponse(BaseModel):
    student: StudentDetailsResponse
    enrolled_course_count: int
    attendance_percentage: Decimal
    assignment_count: int
    submission_count: int
    average_assignment_marks: Decimal
    exam_count: int
    exam_result_count: int
    average_exam_marks: Decimal
    overall_performance: OverallPerformanceResponse | None


class AttendanceStatisticsResponse(BaseModel):
    total_records: int
    present_count: int
    absent_count: int
    attendance_percentage: Decimal


class CourseReportResponse(BaseModel):
    course: CourseDetailsResponse
    enrolled_student_count: int
    assignment_count: int
    submission_count: int
    exam_count: int
    exam_result_count: int
    average_exam_marks: Decimal
    attendance_statistics: AttendanceStatisticsResponse


class StudentAttendanceSummaryResponse(BaseModel):
    student_id: UUID
    student_name: str
    total_records: int
    present_count: int
    absent_count: int
    attendance_percentage: Decimal


class CourseAttendanceReportResponse(BaseModel):
    course_id: UUID
    course_name: str
    students: list[StudentAttendanceSummaryResponse]


class StudentCoursePerformanceResponse(BaseModel):
    student_id: UUID
    student_name: str
    assignment_performance: Decimal
    exam_performance: Decimal
    attendance_percentage: Decimal
    overall_score: Decimal | None


class CoursePerformanceReportResponse(BaseModel):
    course_id: UUID
    course_name: str
    students: list[StudentCoursePerformanceResponse]


class OverviewReportResponse(BaseModel):
    total_students: int
    total_teachers: int
    total_courses: int
    total_enrollments: int
    total_assignments: int
    total_exams: int
    average_attendance: Decimal
    average_exam_performance: Decimal


def _decimal_or_zero(value: Decimal | None) -> Decimal:
    return Decimal(str(value)) if value is not None else Decimal("0")


def _get_student(db, user: User) -> Student:
    student = db.scalar(select(Student).where(Student.user_id == user.id))
    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found",
        )
    return student


def _get_teacher(db, user: User) -> Teacher:
    teacher = db.scalar(select(Teacher).where(Teacher.user_id == user.id))
    if teacher is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher profile not found",
        )
    return teacher


def _teacher_manages_course(db, teacher: Teacher, course_id: UUID) -> bool:
    assignment = db.scalar(
        select(Assignment.id).where(
            Assignment.teacher_id == teacher.id,
            Assignment.course_id == course_id,
        )
    )
    if assignment is not None:
        return True
    exam = db.scalar(
        select(Exam.id).where(
            Exam.teacher_id == teacher.id,
            Exam.course_id == course_id,
        )
    )
    return exam is not None


def _get_authorized_course(db, current_user: User, course_id: UUID) -> Course:
    course = db.get(Course, course_id)
    if course is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )
    if current_user.role == "TEACHER":
        teacher = _get_teacher(db, current_user)
        if not _teacher_manages_course(db, teacher, course_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not manage this course",
            )
    return course


def _attendance_statistics(
    db,
    *,
    student_id: UUID | None = None,
    course_id: UUID | None = None,
) -> AttendanceStatisticsResponse:
    filters = []
    if student_id is not None:
        filters.append(Attendance.student_id == student_id)
    if course_id is not None:
        filters.append(Attendance.course_id == course_id)

    total_records = db.scalar(select(func.count(Attendance.id)).where(*filters)) or 0
    present_count = db.scalar(
        select(func.count(Attendance.id)).where(
            *filters,
            func.upper(Attendance.status) == "PRESENT",
        )
    ) or 0
    absent_count = db.scalar(
        select(func.count(Attendance.id)).where(
            *filters,
            func.upper(Attendance.status) == "ABSENT",
        )
    ) or 0
    attendance_percentage = (
        Decimal(present_count) * Decimal("100") / Decimal(total_records)
        if total_records
        else Decimal("0")
    )
    return AttendanceStatisticsResponse(
        total_records=total_records,
        present_count=present_count,
        absent_count=absent_count,
        attendance_percentage=attendance_percentage,
    )


@router.get("/student/{student_id}", response_model=StudentReportResponse)
def get_student_report(
    student_id: UUID,
    current_user: User = Depends(require_roles("ADMIN", "STUDENT")),
) -> StudentReportResponse:
    db = SessionLocal()
    try:
        student = db.get(Student, student_id)
        if student is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found",
            )
        if current_user.role == "STUDENT" and _get_student(db, current_user).id != student.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You may only access your own report",
            )

        latest_performance = db.scalar(
            select(PerformanceRecord)
            .where(PerformanceRecord.student_id == student.id)
            .order_by(PerformanceRecord.recorded_at.desc())
        )
        attendance = _attendance_statistics(db, student_id=student.id)
        average_assignment_marks = db.scalar(
            select(func.avg(Submission.marks)).where(Submission.student_id == student.id)
        )
        average_exam_marks = db.scalar(
            select(func.avg(ExamResult.marks)).where(ExamResult.student_id == student.id)
        )

        return StudentReportResponse(
            student=StudentDetailsResponse.model_validate(student),
            enrolled_course_count=db.scalar(
                select(func.count(Enrollment.id)).where(Enrollment.student_id == student.id)
            ) or 0,
            attendance_percentage=attendance.attendance_percentage,
            assignment_count=db.scalar(
                select(func.count(Assignment.id))
                .join(Enrollment, Enrollment.course_id == Assignment.course_id)
                .where(Enrollment.student_id == student.id)
            ) or 0,
            submission_count=db.scalar(
                select(func.count(Submission.id)).where(Submission.student_id == student.id)
            ) or 0,
            average_assignment_marks=_decimal_or_zero(average_assignment_marks),
            exam_count=db.scalar(
                select(func.count(Exam.id))
                .join(Enrollment, Enrollment.course_id == Exam.course_id)
                .where(Enrollment.student_id == student.id)
            ) or 0,
            exam_result_count=db.scalar(
                select(func.count(ExamResult.id)).where(ExamResult.student_id == student.id)
            ) or 0,
            average_exam_marks=_decimal_or_zero(average_exam_marks),
            overall_performance=(
                OverallPerformanceResponse.model_validate(latest_performance)
                if latest_performance is not None
                else None
            ),
        )
    finally:
        db.close()


@router.get("/course/{course_id}", response_model=CourseReportResponse)
def get_course_report(
    course_id: UUID,
    current_user: User = Depends(require_roles("ADMIN", "TEACHER")),
) -> CourseReportResponse:
    db = SessionLocal()
    try:
        course = _get_authorized_course(db, current_user, course_id)
        average_exam_marks = db.scalar(
            select(func.avg(ExamResult.marks))
            .join(Exam, ExamResult.exam_id == Exam.id)
            .where(Exam.course_id == course_id)
        )
        return CourseReportResponse(
            course=CourseDetailsResponse.model_validate(course),
            enrolled_student_count=db.scalar(
                select(func.count(Enrollment.id)).where(Enrollment.course_id == course_id)
            ) or 0,
            assignment_count=db.scalar(
                select(func.count(Assignment.id)).where(Assignment.course_id == course_id)
            ) or 0,
            submission_count=db.scalar(
                select(func.count(Submission.id))
                .join(Assignment, Submission.assignment_id == Assignment.id)
                .where(Assignment.course_id == course_id)
            ) or 0,
            exam_count=db.scalar(
                select(func.count(Exam.id)).where(Exam.course_id == course_id)
            ) or 0,
            exam_result_count=db.scalar(
                select(func.count(ExamResult.id))
                .join(Exam, ExamResult.exam_id == Exam.id)
                .where(Exam.course_id == course_id)
            ) or 0,
            average_exam_marks=_decimal_or_zero(average_exam_marks),
            attendance_statistics=_attendance_statistics(db, course_id=course_id),
        )
    finally:
        db.close()


@router.get("/attendance/{course_id}", response_model=CourseAttendanceReportResponse)
def get_course_attendance_report(
    course_id: UUID,
    current_user: User = Depends(require_roles("ADMIN", "TEACHER")),
) -> CourseAttendanceReportResponse:
    db = SessionLocal()
    try:
        course = _get_authorized_course(db, current_user, course_id)
        students = db.scalars(
            select(Student)
            .join(Enrollment, Enrollment.student_id == Student.id)
            .where(Enrollment.course_id == course_id)
        ).all()
        return CourseAttendanceReportResponse(
            course_id=course.id,
            course_name=course.course_name,
            students=[
                StudentAttendanceSummaryResponse(
                    student_id=student.id,
                    student_name=student.full_name,
                    **_attendance_statistics(
                        db,
                        student_id=student.id,
                        course_id=course_id,
                    ).model_dump(),
                )
                for student in students
            ],
        )
    finally:
        db.close()


@router.get("/performance/{course_id}", response_model=CoursePerformanceReportResponse)
def get_course_performance_report(
    course_id: UUID,
    current_user: User = Depends(require_roles("ADMIN", "TEACHER")),
) -> CoursePerformanceReportResponse:
    db = SessionLocal()
    try:
        course = _get_authorized_course(db, current_user, course_id)
        students = db.scalars(
            select(Student)
            .join(Enrollment, Enrollment.student_id == Student.id)
            .where(Enrollment.course_id == course_id)
        ).all()

        performance_rows = []
        for student in students:
            assignment_average = db.scalar(
                select(func.avg(Submission.marks))
                .join(Assignment, Submission.assignment_id == Assignment.id)
                .where(
                    Submission.student_id == student.id,
                    Assignment.course_id == course_id,
                )
            )
            exam_average = db.scalar(
                select(func.avg(ExamResult.marks))
                .join(Exam, ExamResult.exam_id == Exam.id)
                .where(
                    ExamResult.student_id == student.id,
                    Exam.course_id == course_id,
                )
            )
            performance = db.scalar(
                select(PerformanceRecord)
                .where(
                    PerformanceRecord.student_id == student.id,
                    PerformanceRecord.course_id == course_id,
                )
                .order_by(PerformanceRecord.recorded_at.desc())
            )
            attendance = _attendance_statistics(
                db,
                student_id=student.id,
                course_id=course_id,
            )
            performance_rows.append(
                StudentCoursePerformanceResponse(
                    student_id=student.id,
                    student_name=student.full_name,
                    assignment_performance=_decimal_or_zero(assignment_average),
                    exam_performance=_decimal_or_zero(exam_average),
                    attendance_percentage=attendance.attendance_percentage,
                    overall_score=(
                        performance.overall_score if performance is not None else None
                    ),
                )
            )

        return CoursePerformanceReportResponse(
            course_id=course.id,
            course_name=course.course_name,
            students=performance_rows,
        )
    finally:
        db.close()


@router.get("/overview", response_model=OverviewReportResponse)
def get_overview_report(
    _: User = Depends(require_roles("ADMIN")),
) -> OverviewReportResponse:
    db = SessionLocal()
    try:
        attendance = _attendance_statistics(db)
        average_exam_performance = db.scalar(select(func.avg(ExamResult.marks)))
        return OverviewReportResponse(
            total_students=db.scalar(select(func.count(Student.id))) or 0,
            total_teachers=db.scalar(select(func.count(Teacher.id))) or 0,
            total_courses=db.scalar(select(func.count(Course.id))) or 0,
            total_enrollments=db.scalar(select(func.count(Enrollment.id))) or 0,
            total_assignments=db.scalar(select(func.count(Assignment.id))) or 0,
            total_exams=db.scalar(select(func.count(Exam.id))) or 0,
            average_attendance=attendance.attendance_percentage,
            average_exam_performance=_decimal_or_zero(average_exam_performance),
        )
    finally:
        db.close()
