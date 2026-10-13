"""Finding, Evidence, and StatusEvent SQLAlchemy models."""

import datetime
from typing import Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from kairo_api.database import Base


class FindingRecord(Base):
    __tablename__ = "findings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), index=True, nullable=False)
    scan_id: Mapped[str] = mapped_column(String(36), ForeignKey("scans.id", ondelete="CASCADE"), index=True, nullable=False)
    
    fingerprint: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    vulnerability_class: Mapped[str] = mapped_column(String(10), nullable=False)  # V01-V13
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    severity: Mapped[str] = mapped_column(String(20), nullable=False)  # Critical, High, Medium, Low, Informational
    confidence: Mapped[str] = mapped_column(String(20), nullable=False)  # Confirmed, Likely, Possible
    
    status: Mapped[str] = mapped_column(String(20), default="open", index=True)  # open, fixed, dismissed
    dismissal_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    plain_language_explanation: Mapped[str] = mapped_column(Text, nullable=False)
    remediation_advice: Mapped[str] = mapped_column(Text, nullable=False)
    framework: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # Code location
    file_path: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    start_line: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    end_line: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    snippet: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    route_path: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    route_method: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    is_ai_assisted: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.datetime.now(datetime.timezone.utc)
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        onupdate=lambda: datetime.datetime.now(datetime.timezone.utc),
    )

    scan: Mapped["Scan"] = relationship("Scan", back_populates="findings")
    evidence: Mapped[list["EvidenceRecord"]] = relationship("EvidenceRecord", back_populates="finding", cascade="all, delete-orphan")
    status_events: Mapped[list["StatusEvent"]] = relationship("StatusEvent", back_populates="finding", cascade="all, delete-orphan")


class EvidenceRecord(Base):
    __tablename__ = "finding_evidences"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    finding_id: Mapped[str] = mapped_column(String(36), ForeignKey("findings.id", ondelete="CASCADE"), index=True, nullable=False)
    layer: Mapped[str] = mapped_column(String(20), nullable=False)  # static, logic, dynamic
    description: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Redacted HTTP details
    request_method: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    request_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    request_headers_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    request_body_masked: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    response_status: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    response_body_masked: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.datetime.now(datetime.timezone.utc)
    )

    finding: Mapped["FindingRecord"] = relationship("FindingRecord", back_populates="evidence")


class StatusEvent(Base):
    """Append-only audit trail for finding status changes (FR-F4)."""
    __tablename__ = "finding_status_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    finding_id: Mapped[str] = mapped_column(String(36), ForeignKey("findings.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    previous_status: Mapped[str] = mapped_column(String(20), nullable=False)
    new_status: Mapped[str] = mapped_column(String(20), nullable=False)
    reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.datetime.now(datetime.timezone.utc)
    )

    finding: Mapped["FindingRecord"] = relationship("FindingRecord", back_populates="status_events")
