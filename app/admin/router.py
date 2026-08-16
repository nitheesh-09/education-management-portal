from datetime import datetime
from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from sqlalchemy import select

from app.auth.authorization import require_roles
from app.auth.security import hash_password
from app.db.database import SessionLocal
from app.models.assignment import Assignment
from app.models.class_model import Class
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.exam import Exam
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.user import User


router = APIRouter(prefix="/admin", tags=["admin"])


class CreateStudentRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)
    register_number: str = Field(min_length=1, max_length=50)
    full_name: str = Field(min_length=1, max_length=255)
    phone: str = Field(min_length=1, max_length=20)
    department: str = Field(min_length=1, max_length=100)
    year: int = Field(ge=1)
    semester: int = Field(ge=1)
    section: str = Field(min_length=1, max_length=20)
    cgpa: Decimal = Field(ge=0, le=10)
    class_id: UUID


class CreateTeacherRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)
    employee_id: str = Field(min_length=1, max_length=50)
    full_name: str = Field(min_length=1, max_length=255)
    phone: str = Field(min_length=1, max_length=20)
    department: str = Field(min_length=1, max_length=100)
    designation: str = Field(min_length=1, max_length=100)


class StudentResponse(BaseModel):
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


class TeacherResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    employee_id: str
    full_name: str
    phone: str
    department: str
    designation: str


class CreateCourseRequest(BaseModel):
    course_code: str = Field(min_length=1, max_length=50)
    course_name: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    syllabus: str = Field(min_length=1)
    duration: str = Field(min_length=1, max_length=100)
    rating: Decimal = Field(ge=0, le=5)


class CourseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_code: str
    course_name: str
    description: str
    syllabus: str
    duration: str
    rating: Decimal


class CreateClassRequest(BaseModel):
    class_name: str = Field(min_length=1, max_length=100)
    department: str = Field(min_length=1, max_length=100)
    year: int = Field(ge=1)
    semester: int = Field(ge=1)
    section: str = Field(min_length=1, max_length=20)


class ClassResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    class_name: str
    department: str
    year: int
    semester: int
    section: str


class CreateEnrollmentRequest(BaseModel):
    student_id: UUID
    course_id: UUID


class EnrollmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    student_id: UUID
    course_id: UUID
    enrolled_at: datetime


class CreateAssignmentRequest(BaseModel):
    course_id: UUID
    teacher_id: UUID
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    due_date: datetime
    max_marks: Decimal = Field(gt=0)


class AssignmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_id: UUID
    teacher_id: UUID
    title: str
    description: str
    due_date: datetime
    max_marks: Decimal
    created_at: datetime


class CreateExamRequest(BaseModel):
    course_id: UUID
    teacher_id: UUID
    exam_name: str = Field(min_length=1, max_length=255)
    exam_date: datetime
    max_marks: Decimal = Field(gt=0)


class ExamResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_id: UUID
    teacher_id: UUID
    exam_name: str
    exam_date: datetime
    max_marks: Decimal
    created_at: datetime


@router.post("/students", status_code=status.HTTP_201_CREATED)
def create_student(
    student_data: CreateStudentRequest,
    _: User = Depends(require_roles("ADMIN")),
) -> dict[str, str]:
    db = SessionLocal()
    try:
        existing_user = db.scalar(
            select(User).where(User.email == student_data.email)
        )
        if existing_user is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered",
            )

        existing_student = db.scalar(
            select(Student).where(
                Student.register_number == student_data.register_number
            )
        )
        if existing_student is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Register number is already registered",
            )

        user = User(
            email=str(student_data.email),
            password_hash=hash_password(student_data.password),
            role="STUDENT",
            is_active=True,
        )
        db.add(user)
        db.flush()

        student = Student(
            user_id=user.id,
            register_number=student_data.register_number,
            full_name=student_data.full_name,
            phone=student_data.phone,
            department=student_data.department,
            year=student_data.year,
            semester=student_data.semester,
            section=student_data.section,
            cgpa=student_data.cgpa,
            class_id=student_data.class_id,
        )
        db.add(student)
        db.commit()
        db.refresh(student)
        return {"id": str(student.id), "user_id": str(user.id)}
    finally:
        db.close()


@router.post("/teachers", status_code=status.HTTP_201_CREATED)
def create_teacher(
    teacher_data: CreateTeacherRequest,
    _: User = Depends(require_roles("ADMIN")),
) -> dict[str, str]:
    db = SessionLocal()
    try:
        existing_user = db.scalar(
            select(User).where(User.email == teacher_data.email)
        )
        if existing_user is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered",
            )

        existing_teacher = db.scalar(
            select(Teacher).where(Teacher.employee_id == teacher_data.employee_id)
        )
        if existing_teacher is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee ID is already registered",
            )

        user = User(
            email=str(teacher_data.email),
            password_hash=hash_password(teacher_data.password),
            role="TEACHER",
            is_active=True,
        )
        db.add(user)
        db.flush()

        teacher = Teacher(
            user_id=user.id,
            employee_id=teacher_data.employee_id,
            full_name=teacher_data.full_name,
            phone=teacher_data.phone,
            department=teacher_data.department,
            designation=teacher_data.designation,
        )
        db.add(teacher)
        db.commit()
        db.refresh(teacher)
        return {"id": str(teacher.id), "user_id": str(user.id)}
    finally:
        db.close()


@router.get("/students", response_model=list[StudentResponse])
def list_students(
    _: User = Depends(require_roles("ADMIN")),
) -> list[StudentResponse]:
    db = SessionLocal()
    try:
        students = db.scalars(select(Student)).all()
        return [StudentResponse.model_validate(student) for student in students]
    finally:
        db.close()


@router.get("/teachers", response_model=list[TeacherResponse])
def list_teachers(
    _: User = Depends(require_roles("ADMIN")),
) -> list[TeacherResponse]:
    db = SessionLocal()
    try:
        teachers = db.scalars(select(Teacher)).all()
        return [TeacherResponse.model_validate(teacher) for teacher in teachers]
    finally:
        db.close()


@router.post(
    "/courses",
    response_model=CourseResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_course(
    course_data: CreateCourseRequest,
    _: User = Depends(require_roles("ADMIN")),
) -> CourseResponse:
    db = SessionLocal()
    try:
        existing_course = db.scalar(
            select(Course).where(Course.course_code == course_data.course_code)
        )
        if existing_course is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Course code is already registered",
            )

        course = Course(
            course_code=course_data.course_code,
            course_name=course_data.course_name,
            description=course_data.description,
            syllabus=course_data.syllabus,
            duration=course_data.duration,
            rating=course_data.rating,
        )
        db.add(course)
        db.commit()
        db.refresh(course)
        return CourseResponse.model_validate(course)
    finally:
        db.close()


@router.get("/courses", response_model=list[CourseResponse])
def list_courses(
    _: User = Depends(require_roles("ADMIN")),
) -> list[CourseResponse]:
    db = SessionLocal()
    try:
        courses = db.scalars(select(Course)).all()
        return [CourseResponse.model_validate(course) for course in courses]
    finally:
        db.close()


@router.post(
    "/classes",
    response_model=ClassResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_class(
    class_data: CreateClassRequest,
    _: User = Depends(require_roles("ADMIN")),
) -> ClassResponse:
    db = SessionLocal()
    try:
        existing_class = db.scalar(
            select(Class).where(
                Class.class_name == class_data.class_name,
                Class.year == class_data.year,
                Class.semester == class_data.semester,
                Class.section == class_data.section,
            )
        )
        if existing_class is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Class already exists",
            )

        classroom = Class(
            class_name=class_data.class_name,
            department=class_data.department,
            year=class_data.year,
            semester=class_data.semester,
            section=class_data.section,
        )
        db.add(classroom)
        db.commit()
        db.refresh(classroom)
        return ClassResponse.model_validate(classroom)
    finally:
        db.close()


@router.get("/classes", response_model=list[ClassResponse])
def list_classes(
    _: User = Depends(require_roles("ADMIN")),
) -> list[ClassResponse]:
    db = SessionLocal()
    try:
        classes = db.scalars(select(Class)).all()
        return [ClassResponse.model_validate(classroom) for classroom in classes]
    finally:
        db.close()


@router.post(
    "/enrollments",
    response_model=EnrollmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_enrollment(
    enrollment_data: CreateEnrollmentRequest,
    _: User = Depends(require_roles("ADMIN")),
) -> EnrollmentResponse:
    db = SessionLocal()
    try:
        if db.get(Student, enrollment_data.student_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found",
            )
        if db.get(Course, enrollment_data.course_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found",
            )

        existing_enrollment = db.scalar(
            select(Enrollment).where(
                Enrollment.student_id == enrollment_data.student_id,
                Enrollment.course_id == enrollment_data.course_id,
            )
        )
        if existing_enrollment is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Student is already enrolled in this course",
            )

        enrollment = Enrollment(
            student_id=enrollment_data.student_id,
            course_id=enrollment_data.course_id,
        )
        db.add(enrollment)
        db.commit()
        db.refresh(enrollment)
        return EnrollmentResponse.model_validate(enrollment)
    finally:
        db.close()


@router.get("/enrollments", response_model=list[EnrollmentResponse])
def list_enrollments(
    _: User = Depends(require_roles("ADMIN")),
) -> list[EnrollmentResponse]:
    db = SessionLocal()
    try:
        enrollments = db.scalars(select(Enrollment)).all()
        return [
            EnrollmentResponse.model_validate(enrollment)
            for enrollment in enrollments
        ]
    finally:
        db.close()


@router.post(
    "/assignments",
    response_model=AssignmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_assignment(
    assignment_data: CreateAssignmentRequest,
    _: User = Depends(require_roles("ADMIN")),
) -> AssignmentResponse:
    db = SessionLocal()
    try:
        if db.get(Course, assignment_data.course_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found",
            )
        if db.get(Teacher, assignment_data.teacher_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Teacher not found",
            )

        assignment = Assignment(
            course_id=assignment_data.course_id,
            teacher_id=assignment_data.teacher_id,
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


@router.get("/assignments", response_model=list[AssignmentResponse])
def list_assignments(
    _: User = Depends(require_roles("ADMIN")),
) -> list[AssignmentResponse]:
    db = SessionLocal()
    try:
        assignments = db.scalars(select(Assignment)).all()
        return [
            AssignmentResponse.model_validate(assignment)
            for assignment in assignments
        ]
    finally:
        db.close()


@router.post(
    "/exams",
    response_model=ExamResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_exam(
    exam_data: CreateExamRequest,
    _: User = Depends(require_roles("ADMIN")),
) -> ExamResponse:
    db = SessionLocal()
    try:
        if db.get(Course, exam_data.course_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found",
            )
        if db.get(Teacher, exam_data.teacher_id) is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Teacher not found",
            )

        exam = Exam(
            course_id=exam_data.course_id,
            teacher_id=exam_data.teacher_id,
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


@router.get("/exams", response_model=list[ExamResponse])
def list_exams(
    _: User = Depends(require_roles("ADMIN")),
) -> list[ExamResponse]:
    db = SessionLocal()
    try:
        exams = db.scalars(select(Exam)).all()
        return [ExamResponse.model_validate(exam) for exam in exams]
    finally:
        db.close()
