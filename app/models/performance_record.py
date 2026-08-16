from datetime import datetime
from decimal import Decimal
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, Numeric, String, func
from sqlalchemy.dialects.postgresql import UUID as PostgreSQLUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class PerformanceRecord(Base):
    __tablename__ = "performance_records"

    id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    student_id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True), ForeignKey("students.id"), nullable=False
    )
    course_id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True), ForeignKey("courses.id"), nullable=False
    )
    overall_score: Mapped[Decimal] = mapped_column(Numeric(6, 2), nullable=False)
    attendance_percentage: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    assignment_average: Mapped[Decimal] = mapped_column(Numeric(6, 2), nullable=False)
    exam_average: Mapped[Decimal] = mapped_column(Numeric(6, 2), nullable=False)
    performance_trend: Mapped[str] = mapped_column(String(50), nullable=False)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
