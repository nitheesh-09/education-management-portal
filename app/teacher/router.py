from datetime import datetime
from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import or_, select

from app.auth.authorization import require_roles
from app.db.database import SessionLocal
from app.models.assignment import Assignment
from app.models.attendance import Attendance
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.exam import Exam
from app.models.exam_result import ExamResult
from app.models.student import Student
from app.models.submission import Submission
from app.models.teacher import Teacher
from app.models.user import User
from app.performance.service import update_performance_record


router = APIRouter(prefix="/teacher", tags=["teacher"])


class TeacherProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    employee_id: str
    full_name: str
    phone: str
    department: str
    designation: str


class TeacherCourseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_code: str
    course_name: str
    description: str
    syllabus: str
    duration: str
    rating: Decimal


class AssignmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_id: UUID
    title: str
    description: str
    due_date: datetime
    max_marks: Decimal
    created_at: datetime


class CreateAssignmentRequest(BaseModel):
    course_id: UUID
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    due_date: datetime
    max_marks: Decimal = Field(gt=0)


class SubmissionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    assignment_id: UUID
    student_id: UUID
    submission_text: str
    submitted_at: datetime
    marks: Decimal | None
    feedback: str | None


class GradeSubmissionRequest(BaseModel):
    marks: Decimal = Field(ge=0)
    feedback: str


class ExamResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_id: UUID
    exam_name: str
    exam_date: datetime
    max_marks: Decimal
    created_at: datetime


class CreateExamRequest(BaseModel):
    course_id: UUID
    exam_name: str = Field(min_length=1, max_length=255)
    exam_date: datetime
    max_marks: Decimal = Field(gt=0)


class CreateAttendanceRequest(BaseModel):
    student_id: UUID
    course_id: UUID
    date: datetime
    status: str = Field(min_length=1, max_length=50)


class AttendanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    student_id: UUID
    course_id: UUID
    date: datetime
    status: str


class CreateExamResultRequest(BaseModel):
    student_id: UUID
    exam_id: UUID
    marks: Decimal = Field(ge=0)


class UpdateExamResultRequest(BaseModel):
    marks: Decimal = Field(ge=0)


class ExamResultResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    exam_id: UUID
    student_id: UUID
    marks: Decimal


def _get_teacher(db, current_user: User) -> Teacher:
    teacher = db.scalar(select(Teacher).where(Teacher.user_id == current_user.id))
    if teacher is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher profile not found",
        )
    return teacher


def _teacher_manages_course(db, teacher: Teacher, course_id: UUID) -> bool:
    has_assignment = db.scalar(
        select(Assignment.id).where(
            Assignment.teacher_id == teacher.id,
            Assignment.course_id == course_id,
        )
    )
    if has_assignment is not None:
        return True

    has_exam = db.scalar(
        select(Exam.id).where(
            Exam.teacher_id == teacher.id,
            Exam.course_id == course_id,
        )
    )
    return has_exam is not None


@router.get("/profile", response_model=TeacherProfileResponse)
def get_teacher_profile(
    current_user: User = Depends(require_roles("TEACHER")),
) -> TeacherProfileResponse:
    db = SessionLocal()
    try:
        teacher = _get_teacher(db, current_user)
        return TeacherProfileResponse.model_validate(teacher)
    finally:
        db.close()


@router.get("/courses", response_model=list[TeacherCourseResponse])
def get_teacher_courses(
    current_user: User = Depends(require_roles("TEACHER")),
) -> list[TeacherCourseResponse]:
    db = SessionLocal()
    try:
        teacher = _get_teacher(db, current_user)
        courses = db.scalars(
            select(Course)
            .outerjoin(Assignment, Assignment.course_id == Course.id)
            .outerjoin(Exam, Exam.course_id == Course.id)
            .where(
                or_(
                    Assignment.teacher_id == teacher.id,
                    Exam.teacher_id == teacher.id,
                )
            )
            .distinct()
        ).all()
        return [TeacherCourseResponse.model_validate(course) for course in courses]
    finally:
        db.close()


@router.get("/assignments", response_model=list[AssignmentResponse])
def get_teacher_assignments(
    current_user: User = Depends(require_roles("TEACHER")),
) -> list[AssignmentResponse]:
    db = SessionLocal()
    try:
        teacher = _get_teacher(db, current_user)
        assignments = db.scalars(
            select(Assignment).where(Assignment.teacher_id == teacher.id)
        ).all()
        return [AssignmentResponse.model_validate(assignment) for assignment in assignments]
    finally:
        db.close()


@router.post(
    "/assignments",
    response_model=AssignmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_assignment(
    assignment_data: CreateAssignmentRequest,
    current_user: User = Depends(require_roles("TEACHER")),
) -> AssignmentResponse:
    db = SessionLocal()
    try:
        teacher = _get_teacher(db, current_user)

        course = db.get(Course, assignment_data.course_id)
        if course is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found",
            )

        if not _teacher_manages_course(db, teacher, assignment_data.course_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not manage this course",
            )

        assignment = Assignment(
            course_id=assignment_data.course_id,
            teacher_id=teacher.id,
            title=assignment_data.title,
            description=assignment_data.description,
            due_date=assignment_data.due_date,
            max_marks=assignment_data.max_marks,
        )

        db.add(assignment)
        db.commit()
        db.refresh(assignment)

        return AssignmentResponse.model_validate(assignment)
    finally:
        db.close()


@router.get("/submissions", response_model=list[SubmissionResponse])
def get_teacher_submissions(
    current_user: User = Depends(require_roles("TEACHER")),
) -> list[SubmissionResponse]:
    db = SessionLocal()
    try:
        teacher = _get_teacher(db, current_user)
        submissions = db.scalars(
            select(Submission)
            .join(Assignment, Submission.assignment_id == Assignment.id)
            .where(Assignment.teacher_id == teacher.id)
        ).all()
        return [SubmissionResponse.model_validate(submission) for submission in submissions]
    finally:
        db.close()


@router.put("/submissions/{submission_id}/grade", response_model=SubmissionResponse)
def grade_submission(
    submission_id: UUID,
    grade_data: GradeSubmissionRequest,
    current_user: User = Depends(require_roles("TEACHER")),
) -> SubmissionResponse:
    db = SessionLocal()
    try:
        teacher = _get_teacher(db, current_user)
        submission = db.get(Submission, submission_id)
        if submission is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Submission not found",
            )

        assignment = db.get(Assignment, submission.assignment_id)
        if assignment is None or assignment.teacher_id != teacher.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not manage this submission",
            )
        if grade_data.marks > assignment.max_marks:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Marks cannot exceed the assignment maximum",
            )

        submission.marks = grade_data.marks
        submission.feedback = grade_data.feedback
        update_performance_record(db, submission.student_id, assignment.course_id)
        db.commit()
        db.refresh(submission)
        return SubmissionResponse.model_validate(submission)
    finally:
        db.close()


@router.get("/exams", response_model=list[ExamResponse])
def get_teacher_exams(
    current_user: User = Depends(require_roles("TEACHER")),
) -> list[ExamResponse]:
    db = SessionLocal()
    try:
        teacher = _get_teacher(db, current_user)
        exams = db.scalars(select(Exam).where(Exam.teacher_id == teacher.id)).all()
        return [ExamResponse.model_validate(exam) for exam in exams]
    finally:
        db.close()

@router.post(
    "/exams",
    response_model=ExamResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_exam(
    exam_data: CreateExamRequest,
    current_user: User = Depends(require_roles("TEACHER")),
) -> ExamResponse:
    db = SessionLocal()
    try:
        teacher = _get_teacher(db, current_user)

        course = db.get(Course, exam_data.course_id)
        if course is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found",
            )

        if not _teacher_manages_course(db, teacher, exam_data.course_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not manage this course",
            )

        exam = Exam(
            course_id=exam_data.course_id,
            teacher_id=teacher.id,
            exam_name=exam_data.exam_name,
            exam_date=exam_data.exam_date,
            max_marks=exam_data.max_marks,
        )

        db.add(exam)
        db.commit()
        db.refresh(exam)

        return ExamResponse.model_validate(exam)
    finally:
        db.close()


@router.post(
    "/attendance",
    response_model=AttendanceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_attendance(
    attendance_data: CreateAttendanceRequest,
    current_user: User = Depends(require_roles("TEACHER")),
) -> AttendanceResponse:
    db = SessionLocal()
    try:
        teacher = _get_teacher(db, current_user)
        if db.get(Student, attendance_data.student_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found",
            )
        if db.get(Course, attendance_data.course_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found",
            )
        if not _teacher_manages_course(db, teacher, attendance_data.course_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not manage this course",
            )

        enrollment = db.scalar(
            select(Enrollment).where(
                Enrollment.student_id == attendance_data.student_id,
                Enrollment.course_id == attendance_data.course_id,
            )
        )
        if enrollment is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Student is not enrolled in this course",
            )

        existing_attendance = db.scalar(
            select(Attendance).where(
                Attendance.student_id == attendance_data.student_id,
                Attendance.course_id == attendance_data.course_id,
                Attendance.date == attendance_data.date,
            )
        )
        if existing_attendance is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Attendance record already exists",
            )

        attendance = Attendance(
            student_id=attendance_data.student_id,
            course_id=attendance_data.course_id,
            date=attendance_data.date,
            status=attendance_data.status,
        )
        db.add(attendance)
        update_performance_record(
            db,
            attendance_data.student_id,
            attendance_data.course_id,
        )
        db.commit()
        db.refresh(attendance)
        return AttendanceResponse.model_validate(attendance)
    finally:
        db.close()


@router.get("/attendance", response_model=list[AttendanceResponse])
def get_teacher_attendance(
    current_user: User = Depends(require_roles("TEACHER")),
) -> list[AttendanceResponse]:
    db = SessionLocal()
    try:
        teacher = _get_teacher(db, current_user)
        attendance_records = db.scalars(
            select(Attendance)
            .outerjoin(Assignment, Attendance.course_id == Assignment.course_id)
            .outerjoin(Exam, Attendance.course_id == Exam.course_id)
            .where(
                or_(
                    Assignment.teacher_id == teacher.id,
                    Exam.teacher_id == teacher.id,
                )
            )
            .distinct()
        ).all()
        return [
            AttendanceResponse.model_validate(attendance)
            for attendance in attendance_records
        ]
    finally:
        db.close()


@router.post(
    "/results",
    response_model=ExamResultResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_exam_result(
    result_data: CreateExamResultRequest,
    current_user: User = Depends(require_roles("TEACHER")),
) -> ExamResultResponse:
    db = SessionLocal()
    try:
        teacher = _get_teacher(db, current_user)
        if db.get(Student, result_data.student_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found",
            )

        exam = db.get(Exam, result_data.exam_id)
        if exam is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exam not found",
            )
        if exam.teacher_id != teacher.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not manage this exam",
            )
        if result_data.marks > exam.max_marks:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Marks cannot exceed the exam maximum",
            )

        enrollment = db.scalar(
            select(Enrollment).where(
                Enrollment.student_id == result_data.student_id,
                Enrollment.course_id == exam.course_id,
            )
        )
        if enrollment is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Student is not enrolled in this exam's course",
            )

        existing_result = db.scalar(
            select(ExamResult).where(
                ExamResult.exam_id == exam.id,
                ExamResult.student_id == result_data.student_id,
            )
        )
        if existing_result is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Exam result already exists",
            )

        result = ExamResult(
            exam_id=exam.id,
            student_id=result_data.student_id,
            marks=result_data.marks,
        )
        db.add(result)
        update_performance_record(db, result.student_id, exam.course_id)
        db.commit()
        db.refresh(result)
        return ExamResultResponse.model_validate(result)
    finally:
        db.close()


@router.put("/results/{result_id}", response_model=ExamResultResponse)
def update_exam_result(
    result_id: UUID,
    result_data: UpdateExamResultRequest,
    current_user: User = Depends(require_roles("TEACHER")),
) -> ExamResultResponse:
    db = SessionLocal()
    try:
        teacher = _get_teacher(db, current_user)
        result = db.get(ExamResult, result_id)
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exam result not found",
            )

        exam = db.get(Exam, result.exam_id)
        if exam is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exam not found",
            )
        if exam.teacher_id != teacher.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not manage this exam",
            )
        if result_data.marks > exam.max_marks:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Marks cannot exceed the exam maximum",
            )

        result.marks = result_data.marks
        update_performance_record(db, result.student_id, exam.course_id)
        db.commit()
        db.refresh(result)
        return ExamResultResponse.model_validate(result)
    finally:
        db.close()


@router.get("/results", response_model=list[ExamResultResponse])
def get_teacher_results(
    current_user: User = Depends(require_roles("TEACHER")),
) -> list[ExamResultResponse]:
    db = SessionLocal()
    try:
        teacher = _get_teacher(db, current_user)
        results = db.scalars(
            select(ExamResult)
            .join(Exam, ExamResult.exam_id == Exam.id)
            .where(Exam.teacher_id == teacher.id)
        ).all()
        return [ExamResultResponse.model_validate(result) for result in results]
    finally:
        db.close()
