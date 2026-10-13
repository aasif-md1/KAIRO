"""User profile, data erasure, terms acceptance, and export router (FR-A3, FR-A5, FR-A6, US-11, LR-4)."""

import datetime
import hashlib
import json
import secrets
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from kairo_api.config import settings
from kairo_api.database import get_db
from kairo_api.dependencies.auth import get_current_user
from kairo_api.models.finding import FindingRecord
from kairo_api.models.project import Attestation, Project, ProjectConfig
from kairo_api.models.report import AuditEvent
from kairo_api.models.scan import Scan
from kairo_api.models.user import Session as DbSession, User

router = APIRouter(tags=["User Account"])


class AcceptTermsRequest(BaseModel):
    terms_version: str
    terms_text: str


class AuditEventResponse(BaseModel):
    id: str
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    created_at: str


@router.get("/me")
async def get_me(current_user: Annotated[User, Depends(get_current_user)]):
    """Retrieve currently authenticated user profile."""
    return {
        "id": current_user.id,
        "login": current_user.login,
        "name": current_user.name,
        "email": current_user.email,
        "avatar_url": current_user.avatar_url,
        "terms_accepted": bool(current_user.terms_accepted_at),
        "terms_version": current_user.terms_version,
    }


@router.post("/me/terms")
async def accept_terms(
    req: AcceptTermsRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Record terms and privacy policy acceptance with content hash (LR-4)."""
    content_hash = hashlib.sha256(req.terms_text.encode("utf-8")).hexdigest()
    current_user.terms_accepted_at = datetime.datetime.now(datetime.timezone.utc)
    current_user.terms_version = req.terms_version
    current_user.terms_content_hash = content_hash

    audit = AuditEvent(
        id=f"aud_{secrets.token_hex(12)}",
        user_id=current_user.id,
        action="terms.accepted",
        resource_type="user",
        resource_id=current_user.id,
        metadata_json=json.dumps({"version": req.terms_version, "content_hash": content_hash}),
    )
    db.add(audit)
    await db.commit()

    return {"status": "accepted", "terms_version": req.terms_version}


@router.delete("/me")
async def delete_me(
    response: Response,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Erase account and all associated projects, findings, and data immediately (US-11, LR-9)."""
    user_id = current_user.id

    # Log erasure audit event before deletion
    audit = AuditEvent(
        id=f"aud_{secrets.token_hex(12)}",
        user_id=user_id,
        action="user.account_deleted",
        resource_type="user",
        resource_id=user_id,
    )
    db.add(audit)
    await db.flush()

    # Cascade deletes all projects, scans, findings, sessions
    await db.execute(delete(User).where(User.id == user_id))
    await db.commit()

    cookie_name = settings.SESSION_COOKIE_NAME if settings.COOKIE_SECURE else "kairo_session"
    response.delete_cookie(key=cookie_name, path="/")
    return {"status": "deleted", "message": "Account and all data erased."}


@router.get("/me/export")
async def export_my_data(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Export all user data in JSON format for data portability (LR-9, FR-A5)."""
    # Fetch projects
    p_stmt = select(Project).where(Project.user_id == current_user.id)
    p_res = await db.execute(p_stmt)
    projects = p_res.scalars().all()

    # Fetch scans
    s_stmt = select(Scan).where(Scan.user_id == current_user.id)
    s_res = await db.execute(s_stmt)
    scans = s_res.scalars().all()

    # Fetch findings
    f_stmt = (
        select(FindingRecord)
        .join(Project, FindingRecord.project_id == Project.id)
        .where(Project.user_id == current_user.id)
    )
    f_res = await db.execute(f_stmt)
    findings = f_res.scalars().all()

    return {
        "user": {
            "id": current_user.id,
            "login": current_user.login,
            "email": current_user.email,
            "created_at": current_user.created_at.isoformat(),
        },
        "projects": [
            {
                "id": p.id,
                "name": p.name,
                "repo_full_name": p.repo_full_name,
                "created_at": p.created_at.isoformat(),
            }
            for p in projects
        ],
        "scans": [
            {
                "id": s.id,
                "project_id": s.project_id,
                "status": s.status,
                "created_at": s.created_at.isoformat(),
            }
            for s in scans
        ],
        "findings": [
            {
                "id": f.id,
                "project_id": f.project_id,
                "vulnerability_class": f.vulnerability_class,
                "title": f.title,
                "severity": f.severity,
                "confidence": f.confidence,
                "status": f.status,
            }
            for f in findings
        ],
    }


@router.get("/audit")
async def list_audit_events(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Retrieve security audit events for current user (FR-A6)."""
    stmt = (
        select(AuditEvent)
        .where(AuditEvent.user_id == current_user.id)
        .order_by(AuditEvent.created_at.desc())
        .limit(100)
    )
    result = await db.execute(stmt)
    events = result.scalars().all()
    return [
        {
            "id": e.id,
            "action": e.action,
            "resource_type": e.resource_type,
            "resource_id": e.resource_id,
            "created_at": e.created_at.isoformat(),
        }
        for e in events
    ]
