"""Scan, Stage, and RouteInventory SQLAlchemy models."""

import datetime
from typing import Optional
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from kairo_api.database import Base


class Scan(Base):
    __tablename__ = "scans"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    
    status: Mapped[str] = mapped_column(String(20), default="queued", index=True)  # queued, running, completed, failed, cancelled
    commit_hash: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)
    layers_requested_json: Mapped[str] = mapped_column(Text, default='["static", "dynamic"]')
    rule_set_version: Mapped[str] = mapped_column(String(50), default="2026.10.0")
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.datetime.now(datetime.timezone.utc)
    )
    started_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    project: Mapped["Project"] = relationship("Project", back_populates="scans")
    stages: Mapped[list["Stage"]] = relationship("Stage", back_populates="scan", cascade="all, delete-orphan")
    routes: Mapped[list["RouteInventory"]] = relationship("RouteInventory", back_populates="scan", cascade="all, delete-orphan")
    findings: Mapped[list["FindingRecord"]] = relationship("FindingRecord", back_populates="scan", cascade="all, delete-orphan")


class Stage(Base):
    __tablename__ = "stages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    scan_id: Mapped[str] = mapped_column(String(36), ForeignKey("scans.id", ondelete="CASCADE"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(50), nullable=False)  # prepare, static, logic, dynamic, merge, report
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending, running, completed, failed, skipped
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    started_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    scan: Mapped["Scan"] = relationship("Scan", back_populates="stages")


class RouteInventory(Base):
    __tablename__ = "route_inventories"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    scan_id: Mapped[str] = mapped_column(String(36), ForeignKey("scans.id", ondelete="CASCADE"), index=True, nullable=False)
    
    method: Mapped[str] = mapped_column(String(10), nullable=False)
    path: Mapped[str] = mapped_column(String(255), nullable=False)
    handler_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    file_path: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    line_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Three-valued signals: "detected", "absent", "unknown" (TRD M1-08)
    auth_signal: Mapped[str] = mapped_column(String(20), default="unknown")
    ownership_signal: Mapped[str] = mapped_column(String(20), default="unknown")
    role_signal: Mapped[str] = mapped_column(String(20), default="unknown")
    middleware_stack_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    scan: Mapped["Scan"] = relationship("Scan", back_populates="routes")
