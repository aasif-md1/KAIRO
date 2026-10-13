"""Report, ShareLink, and AuditEvent SQLAlchemy models."""

import datetime
from typing import Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from kairo_api.database import Base


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    scan_id: Mapped[str] = mapped_column(String(36), ForeignKey("scans.id", ondelete="CASCADE"), index=True, nullable=False)
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), index=True, nullable=False)
    format: Mapped[str] = mapped_column(String(20), nullable=False)  # "json", "sarif", "pdf"
    storage_key: Mapped[str] = mapped_column(String(500), nullable=False)
    content_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.datetime.now(datetime.timezone.utc)
    )


class ShareLink(Base):
    """Expiring, revocable unlisted share links (FR-R8). Stores token hash only."""
    __tablename__ = "share_links"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    report_id: Mapped[str] = mapped_column(String(36), ForeignKey("reports.id", ondelete="CASCADE"), index=True, nullable=False)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    expires_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False)
    
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.datetime.now(datetime.timezone.utc)
    )


class AuditEvent(Base):
    """Security-relevant audit log events (FR-A6). Append-only."""
    __tablename__ = "audit_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g., "auth.login", "project.delete", "finding.dismiss"
    resource_type: Mapped[str] = mapped_column(String(50), nullable=False)
    resource_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    metadata_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.datetime.now(datetime.timezone.utc)
    )
