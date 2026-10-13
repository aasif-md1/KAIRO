"""Report generation, download, and unlisted share links router (US-10, FR-R1, FR-R8)."""

import datetime
import hashlib
import json
import secrets
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from kairo_api.database import get_db
from kairo_api.dependencies.auth import get_current_user
from kairo_api.dependencies.ownership import require_scan_owner
from kairo_api.models.finding import FindingRecord
from kairo_api.models.project import Project
from kairo_api.models.report import AuditEvent, Report, ShareLink
from kairo_api.models.scan import Scan
from kairo_api.models.user import User

router = APIRouter(tags=["Reports"])


class GenerateReportRequest(BaseModel):
    format: str = Field(default="json", pattern="^(json|sarif|pdf)$")


class CreateShareLinkRequest(BaseModel):
    expiry_days: int = Field(default=14, ge=1, le=30)  # AS-09


@router.post("/scans/{scan_id}/reports", status_code=status.HTTP_201_CREATED)
async def generate_report(
    req: GenerateReportRequest,
    scan: Annotated[Scan, Depends(require_scan_owner)],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Generate and store a report artifact (US-10)."""
    report_id = f"rep_{secrets.token_hex(12)}"
    storage_key = f"reports/{scan.project_id}/{scan.id}/{report_id}.{req.format}"
    content_hash = hashlib.sha256(storage_key.encode("utf-8")).hexdigest()

    report = Report(
        id=report_id,
        scan_id=scan.id,
        project_id=scan.project_id,
        format=req.format,
        storage_key=storage_key,
        content_hash=content_hash,
    )
    db.add(report)

    audit = AuditEvent(
        id=f"aud_{secrets.token_hex(12)}",
        user_id=current_user.id,
        action="report.generated",
        resource_type="report",
        resource_id=report_id,
    )
    db.add(audit)
    await db.commit()

    return {
        "id": report.id,
        "scan_id": report.scan_id,
        "format": report.format,
        "created_at": report.created_at.isoformat(),
    }


@router.get("/reports/{report_id}")
async def get_report_metadata(
    report_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Get report metadata."""
    stmt = (
        select(Report)
        .join(Project, Report.project_id == Project.id)
        .where(Report.id == report_id, Project.user_id == current_user.id)
    )
    res = await db.execute(stmt)
    report = res.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found.")

    return {
        "id": report.id,
        "scan_id": report.scan_id,
        "format": report.format,
        "storage_key": report.storage_key,
        "content_hash": report.content_hash,
        "created_at": report.created_at.isoformat(),
    }


@router.post("/reports/{report_id}/share")
async def create_share_link(
    report_id: str,
    req: CreateShareLinkRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Create an unlisted, expiring share link (FR-R8). Stores token hash only."""
    stmt = (
        select(Report)
        .join(Project, Report.project_id == Project.id)
        .where(Report.id == report_id, Project.user_id == current_user.id)
    )
    res = await db.execute(stmt)
    report = res.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found.")

    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=req.expiry_days)

    share = ShareLink(
        id=f"shr_{secrets.token_hex(12)}",
        report_id=report.id,
        token_hash=token_hash,
        expires_at=expires_at,
    )
    db.add(share)

    audit = AuditEvent(
        id=f"aud_{secrets.token_hex(12)}",
        user_id=current_user.id,
        action="report.share_created",
        resource_type="report",
        resource_id=report.id,
    )
    db.add(audit)
    await db.commit()

    return {
        "share_id": share.id,
        "share_token": token,
        "share_url": f"/s/{token}",
        "expires_at": expires_at.isoformat(),
    }


@router.delete("/shares/{share_id}")
async def revoke_share_link(
    share_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Revoke an active share link immediately."""
    stmt = (
        select(ShareLink)
        .join(Report, ShareLink.report_id == Report.id)
        .join(Project, Report.project_id == Project.id)
        .where(ShareLink.id == share_id, Project.user_id == current_user.id)
    )
    res = await db.execute(stmt)
    share = res.scalar_one_or_none()
    if not share:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Share link not found.")

    share.is_revoked = True
    await db.commit()
    return {"status": "revoked", "share_id": share.id}


@router.get("/s/{token}")
async def view_shared_report(token: str, db: Annotated[AsyncSession, Depends(get_db)]):
    """Public unlisted access to shared report via valid token."""
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    now = datetime.datetime.now(datetime.timezone.utc)

    stmt = select(ShareLink).where(
        ShareLink.token_hash == token_hash,
        ShareLink.is_revoked == False,
        ShareLink.expires_at > now,
    )
    res = await db.execute(stmt)
    share = res.scalar_one_or_none()
    if not share:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shared report link not found, expired, or revoked.",
        )

    r_stmt = select(Report).where(Report.id == share.report_id)
    r_res = await db.execute(r_stmt)
    report = r_res.scalar_one_or_none()

    # Load findings for report view
    f_stmt = select(FindingRecord).where(FindingRecord.scan_id == report.scan_id)
    f_res = await db.execute(f_stmt)
    findings = f_res.scalars().all()

    return {
        "report_id": report.id,
        "format": report.format,
        "findings_count": len(findings),
        "findings": [
            {
                "title": f.title,
                "severity": f.severity,
                "confidence": f.confidence,
                "explanation": f.plain_language_explanation,
            }
            for f in findings
        ],
    }
