"""Project, ProjectConfig, and Attestation SQLAlchemy models."""

import datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from kairo_api.models.scan import Scan
    from kairo_api.models.user import User

from kairo_api.database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    repo_full_name: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    default_branch: Mapped[str] = mapped_column(String(100), default="main")
    source_type: Mapped[str] = mapped_column(String(20), default="github")  # "github" or "archive"
    encrypted_data_key: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.datetime.now(datetime.timezone.utc)
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        onupdate=lambda: datetime.datetime.now(datetime.timezone.utc),
    )

    owner: Mapped["User"] = relationship("User", back_populates="projects")
    config: Mapped[Optional["ProjectConfig"]] = relationship("ProjectConfig", back_populates="project", uselist=False, cascade="all, delete-orphan")
    attestations: Mapped[list["Attestation"]] = relationship("Attestation", back_populates="project", cascade="all, delete-orphan")
    scans: Mapped[list["Scan"]] = relationship("Scan", back_populates="project", cascade="all, delete-orphan")


class ProjectConfig(Base):
    __tablename__ = "project_configs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), unique=True, nullable=False)

    start_command: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    test_port: Mapped[int] = mapped_column(Integer, default=3000)
    env_vars_encrypted: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    test_accounts_encrypted: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sidecar_services_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    ignore_patterns_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    ai_review_enabled: Mapped[bool] = mapped_column(Boolean, default=False)  # User setting

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.datetime.now(datetime.timezone.utc)
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        onupdate=lambda: datetime.datetime.now(datetime.timezone.utc),
    )

    project: Mapped["Project"] = relationship("Project", back_populates="config")


class Attestation(Base):
    """Authorization confirmation before first scan (LR-1, FR-I7). Immutable."""
    __tablename__ = "attestations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    terms_text: Mapped[str] = mapped_column(Text, nullable=False)
    content_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    confirmed_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.datetime.now(datetime.timezone.utc)
    )

    project: Mapped["Project"] = relationship("Project", back_populates="attestations")
