from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.ai_prediction import AIPrediction
from app.models.assignment import Assignment
from app.models.attendance import Attendance
from app.models.exam import Exam
from app.models.exam_result import ExamResult
from app.models.performance_record import PerformanceRecord
from app.models.recommendation import Recommendation
from app.models.student import Student
from app.models.submission import Submission


ZERO = Decimal("0")
ONE_HUNDRED = Decimal("100")


@dataclass(frozen=True)
class StudentMetrics:
    attendance_percentage: Decimal | None
    assignment_average: Decimal | None
    exam_average: Decimal | None
    latest_performance: PerformanceRecord | None


def _clamp_percentage(value: Decimal) -> Decimal:
    return max(ZERO, min(ONE_HUNDRED, value))


def _average_normalized_marks(rows: list[tuple[Decimal | None, Decimal]]) -> Decimal | None:
    percentages = [
        _clamp_percentage(Decimal(str(mark)) * ONE_HUNDRED / Decimal(str(max_marks)))
        for mark, max_marks in rows
        if mark is not None and max_marks > ZERO
    ]
    if not percentages:
        return None
    return sum(percentages, ZERO) / Decimal(len(percentages))


def _get_student(db: Session, student_id: UUID) -> Student:
    student = db.get(Student, student_id)
    if student is None:
        raise ValueError("Student not found")
    return student


def _collect_metrics(db: Session, student_id: UUID) -> StudentMetrics:
    _get_student(db, student_id)

    attendance_count = db.scalar(
        select(func.count(Attendance.id)).where(Attendance.student_id == student_id)
    ) or 0
    present_count = db.scalar(
        select(func.count(Attendance.id)).where(
            Attendance.student_id == student_id,
            func.upper(Attendance.status) == "PRESENT",
        )
    ) or 0
    attendance_percentage = (
        Decimal(present_count) * ONE_HUNDRED / Decimal(attendance_count)
        if attendance_count
        else None
    )

    assignment_rows = db.execute(
        select(Submission.marks, Assignment.max_marks)
        .join(Assignment, Submission.assignment_id == Assignment.id)
        .where(Submission.student_id == student_id)
    ).all()
    exam_rows = db.execute(
        select(ExamResult.marks, Exam.max_marks)
        .join(Exam, ExamResult.exam_id == Exam.id)
        .where(ExamResult.student_id == student_id)
    ).all()
    latest_performance = db.scalar(
        select(PerformanceRecord)
        .where(PerformanceRecord.student_id == student_id)
        .order_by(PerformanceRecord.recorded_at.desc())
    )

    return StudentMetrics(
        attendance_percentage=attendance_percentage,
        assignment_average=_average_normalized_marks(assignment_rows),
        exam_average=_average_normalized_marks(exam_rows),
        latest_performance=latest_performance,
    )


def calculate_student_risk(db: Session, student_id: UUID) -> AIPrediction:
    """Create a rule-based risk prediction for a student in the current session."""
    metrics = _collect_metrics(db, student_id)
    weighted_risk = ZERO
    total_weight = ZERO

    for score, weight in (
        (metrics.attendance_percentage, Decimal("0.35")),
        (metrics.assignment_average, Decimal("0.25")),
        (metrics.exam_average, Decimal("0.30")),
        (
            metrics.latest_performance.overall_score
            if metrics.latest_performance is not None
            else None,
            Decimal("0.10"),
        ),
    ):
        if score is not None:
            weighted_risk += (ONE_HUNDRED - _clamp_percentage(score)) * weight
            total_weight += weight

    risk_score = (
        (weighted_risk / total_weight).quantize(Decimal("0.01"), ROUND_HALF_UP)
        if total_weight
        else ZERO
    )
    confidence = (total_weight / Decimal("1.00")).quantize(
        Decimal("0.01"), ROUND_HALF_UP
    )

    if risk_score >= Decimal("70"):
        risk_level = "HIGH"
    elif risk_score >= Decimal("40"):
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    if metrics.latest_performance is not None:
        performance_trend = metrics.latest_performance.performance_trend
    elif risk_score >= Decimal("60"):
        performance_trend = "DECLINING"
    elif risk_score <= Decimal("30"):
        performance_trend = "IMPROVING"
    else:
        performance_trend = "STABLE"

    prediction = AIPrediction(
        student_id=student_id,
        risk_level=risk_level,
        risk_score=risk_score,
        confidence=confidence,
        performance_trend=performance_trend,
    )
    db.add(prediction)
    db.flush()
    return prediction


def generate_recommendations(db: Session, student_id: UUID) -> list[Recommendation]:
    """Generate and persist rule-based recommendations in the current session."""
    metrics = _collect_metrics(db, student_id)
    recommendations: list[Recommendation] = []

    if (
        metrics.attendance_percentage is not None
        and metrics.attendance_percentage < Decimal("75")
    ):
        priority = "HIGH" if metrics.attendance_percentage < Decimal("60") else "MEDIUM"
        recommendations.append(
            Recommendation(
                student_id=student_id,
                subject="Attendance",
                recommendation=(
                    "Improve class attendance by attending every scheduled session."
                ),
                priority=priority,
                estimated_time="2 weeks",
            )
        )

    if (
        metrics.assignment_average is not None
        and metrics.assignment_average < Decimal("60")
    ):
        recommendations.append(
            Recommendation(
                student_id=student_id,
                subject="Assignments",
                recommendation=(
                    "Review assignment feedback and schedule regular practice sessions."
                ),
                priority=(
                    "HIGH"
                    if metrics.assignment_average < Decimal("40")
                    else "MEDIUM"
                ),
                estimated_time="2 weeks",
            )
        )

    if metrics.exam_average is not None and metrics.exam_average < Decimal("60"):
        recommendations.append(
            Recommendation(
                student_id=student_id,
                subject="Exams",
                recommendation=(
                    "Revise weak topics and complete timed practice before the next exam."
                ),
                priority="HIGH" if metrics.exam_average < Decimal("40") else "MEDIUM",
                estimated_time="3 weeks",
            )
        )

    db.add_all(recommendations)
    db.flush()
    return recommendations
