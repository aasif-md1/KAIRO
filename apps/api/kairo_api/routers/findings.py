"""Finding details, status modification, recheck, and scan comparison router (US-07, US-08, US-09, FR-F4, FR-F5, FR-F6)."""

import secrets
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from kairo_api.database import get_db
from kairo_api.dependencies.auth import get_current_user
from kairo_api.dependencies.ownership import require_finding_owner
from kairo_api.models.finding import EvidenceRecord, FindingRecord, StatusEvent
from kairo_api.models.report import AuditEvent
from kairo_api.models.scan import Scan
from kairo_api.models.user import User

router = APIRouter(tags=["Findings"])


class UpdateFindingStatusRequest(BaseModel):
    status: str = Field(pattern="^(open|dismissed|fixed)$")
    reason: Optional[str] = None


@router.get("/findings/{finding_id}")
async def get_finding(
    finding: Annotated[FindingRecord, Depends(require_finding_owner)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Retrieve full finding details with evidence and history (US-07)."""
    # Fetch evidence
    e_stmt = select(EvidenceRecord).where(EvidenceRecord.finding_id == finding.id)
    e_res = await db.execute(e_stmt)
    evidence = e_res.scalars().all()

    # Fetch status events
    s_stmt = (
        select(StatusEvent)
        .where(StatusEvent.finding_id == finding.id)
        .order_by(StatusEvent.created_at.desc())
    )
    s_res = await db.execute(s_stmt)
    history = s_res.scalars().all()

    return {
        "id": finding.id,
        "project_id": finding.project_id,
        "scan_id": finding.scan_id,
        "fingerprint": finding.fingerprint,
        "vulnerability_class": finding.vulnerability_class,
        "title": finding.title,
        "severity": finding.severity,
        "confidence": finding.confidence,
        "status": finding.status,
        "dismissal_reason": finding.dismissal_reason,
        "plain_language_explanation": finding.plain_language_explanation,
        "remediation_advice": finding.remediation_advice,
        "framework": finding.framework,
        "route_path": finding.route_path,
        "route_method": finding.route_method,
        "is_ai_assisted": finding.is_ai_assisted,
        "location": {
            "file_path": finding.file_path,
            "start_line": finding.start_line,
            "end_line": finding.end_line,
            "snippet": finding.snippet,
        },
        "evidence": [
            {
                "id": ev.id,
                "layer": ev.layer,
                "description": ev.description,
                "request_method": ev.request_method,
                "request_url": ev.request_url,
                "request_body": ev.request_body_masked,
                "response_status": ev.response_status,
                "response_body": ev.response_body_masked,
            }
            for ev in evidence
        ],
        "history": [
            {
                "id": h.id,
                "previous_status": h.previous_status,
                "new_status": h.new_status,
                "reason": h.reason,
                "created_at": h.created_at.isoformat(),
            }
            for h in history
        ],
    }


@router.patch("/findings/{finding_id}")
async def update_finding_status(
    req: UpdateFindingStatusRequest,
    finding: Annotated[FindingRecord, Depends(require_finding_owner)],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Dismiss or reopen a finding with an explicit reason (US-09, FR-F4)."""
    old_status = finding.status
    finding.status = req.status
    if req.status == "dismissed":
        finding.dismissal_reason = req.reason
    elif req.status == "open":
        finding.dismissal_reason = None

    # Record append-only status event
    event = StatusEvent(
        id=f"sev_{secrets.token_hex(12)}",
        finding_id=finding.id,
        user_id=current_user.id,
        previous_status=old_status,
        new_status=req.status,
        reason=req.reason,
    )
    db.add(event)

    audit = AuditEvent(
        id=f"aud_{secrets.token_hex(12)}",
        user_id=current_user.id,
        action="finding.status_changed",
        resource_type="finding",
        resource_id=finding.id,
    )
    db.add(audit)
    await db.commit()

    return {"status": finding.status, "id": finding.id, "reason": req.reason}


@router.post("/findings/{finding_id}/recheck")
async def recheck_finding(
    finding: Annotated[FindingRecord, Depends(require_finding_owner)],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Trigger a fast targeted re-check on a single finding (US-08, FR-F5)."""
    recheck_id = f"rck_{secrets.token_hex(12)}"

    audit = AuditEvent(
        id=f"aud_{secrets.token_hex(12)}",
        user_id=current_user.id,
        action="finding.recheck_requested",
        resource_type="finding",
        resource_id=finding.id,
    )
    db.add(audit)
    await db.commit()

    return {
        "status": "queued",
        "recheck_id": recheck_id,
        "finding_id": finding.id,
        "fingerprint": finding.fingerprint,
    }


@router.get("/scans/{scan_a}/compare/{scan_b}")
async def compare_scans(
    scan_a: str,
    scan_b: str,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Compare findings between two scans: new, fixed, and unchanged (FR-F6)."""
    # Enforce ownership on both scans
    stmt_a = select(Scan).where(Scan.id == scan_a, Scan.user_id == current_user.id)
    res_a = await db.execute(stmt_a)
    s_a = res_a.scalar_one_or_none()

    stmt_b = select(Scan).where(Scan.id == scan_b, Scan.user_id == current_user.id)
    res_b = await db.execute(stmt_b)
    s_b = res_b.scalar_one_or_none()

    if not s_a or not s_b:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One or both scans not found.",
        )

    # Load findings
    f_a_res = await db.execute(select(FindingRecord).where(FindingRecord.scan_id == scan_a))
    findings_a = {f.fingerprint: f for f in f_a_res.scalars().all()}

    f_b_res = await db.execute(select(FindingRecord).where(FindingRecord.scan_id == scan_b))
    findings_b = {f.fingerprint: f for f in f_b_res.scalars().all()}

    new_fps = set(findings_b.keys()) - set(findings_a.keys())
    fixed_fps = set(findings_a.keys()) - set(findings_b.keys())
    unchanged_fps = set(findings_a.keys()) & set(findings_b.keys())

    return {
        "scan_a": scan_a,
        "scan_b": scan_b,
        "new": [findings_b[fp].title for fp in new_fps],
        "fixed": [findings_a[fp].title for fp in fixed_fps],
        "unchanged": [findings_b[fp].title for fp in unchanged_fps],
    }
