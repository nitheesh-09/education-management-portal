from decimal import Decimal, ROUND_HALF_UP
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.assignment import Assignment
from app.models.attendance import Attendance
from app.models.exam import Exam
from app.models.exam_result import ExamResult
from app.models.performance_record import PerformanceRecord
from app.models.submission import Submission


ZERO = Decimal("0")
ONE_HUNDRED = Decimal("100")


def _average_percentage(rows: list[tuple[Decimal | None, Decimal]]) -> Decimal | None:
    percentages = [
        Decimal(str(marks)) * ONE_HUNDRED / Decimal(str(max_marks))
        for marks, max_marks in rows
        if marks is not None and max_marks > ZERO
    ]
    if not percentages:
        return None
    return sum(percentages, ZERO) / Decimal(len(percentages))


def _rounded(value: Decimal) -> Decimal:
    return max(ZERO, min(ONE_HUNDRED, value)).quantize(
        Decimal("0.01"), ROUND_HALF_UP
    )


def update_performance_record(
    db: Session,
    student_id: UUID,
    course_id: UUID,
) -> PerformanceRecord:
    """Create or refresh the latest performance record for one student and course."""
    total_attendance = db.scalar(
        select(func.count(Attendance.id)).where(
            Attendance.student_id == student_id,
            Attendance.course_id == course_id,
        )
    ) or 0
    present_attendance = db.scalar(
        select(func.count(Attendance.id)).where(
            Attendance.student_id == student_id,
            Attendance.course_id == course_id,
            func.upper(Attendance.status) == "PRESENT",
        )
    ) or 0
    attendance_percentage = (
        Decimal(present_attendance) * ONE_HUNDRED / Decimal(total_attendance)
        if total_attendance
        else ZERO
    )

    assignment_rows = db.execute(
        select(Submission.marks, Assignment.max_marks)
        .join(Assignment, Submission.assignment_id == Assignment.id)
        .where(
            Submission.student_id == student_id,
            Assignment.course_id == course_id,
        )
    ).all()
    exam_rows = db.execute(
        select(ExamResult.marks, Exam.max_marks)
        .join(Exam, ExamResult.exam_id == Exam.id)
        .where(
            ExamResult.student_id == student_id,
            Exam.course_id == course_id,
        )
    ).all()

    assignment_average = _average_percentage(assignment_rows)
    exam_average = _average_percentage(exam_rows)
    scores = [
        score
        for score in (attendance_percentage if total_attendance else None, assignment_average, exam_average)
        if score is not None
    ]
    overall_score = sum(scores, ZERO) / Decimal(len(scores)) if scores else ZERO

    record = db.scalar(
        select(PerformanceRecord)
        .where(
            PerformanceRecord.student_id == student_id,
            PerformanceRecord.course_id == course_id,
        )
        .order_by(PerformanceRecord.recorded_at.desc())
    )
    if record is None:
        record = PerformanceRecord(
            student_id=student_id,
            course_id=course_id,
            overall_score=_rounded(overall_score),
            attendance_percentage=_rounded(attendance_percentage),
            assignment_average=_rounded(assignment_average or ZERO),
            exam_average=_rounded(exam_average or ZERO),
            performance_trend="STABLE",
        )
        db.add(record)
    else:
        previous_score = record.overall_score
        record.overall_score = _rounded(overall_score)
        record.attendance_percentage = _rounded(attendance_percentage)
        record.assignment_average = _rounded(assignment_average or ZERO)
        record.exam_average = _rounded(exam_average or ZERO)
        if record.overall_score > previous_score:
            record.performance_trend = "IMPROVING"
        elif record.overall_score < previous_score:
            record.performance_trend = "DECLINING"
        else:
            record.performance_trend = "STABLE"

    db.flush()
    return record
