"""Scan management, stage progress, route inventory, and scan cancellation router (US-06, FR-D11, FR-S2)."""

import datetime
import json
import secrets
from pathlib import Path
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from kairo_api.database import get_db
from kairo_api.dependencies.auth import get_current_user
from kairo_api.dependencies.ownership import require_project_owner, require_scan_owner
from kairo_api.models.finding import FindingRecord
from kairo_api.models.project import Attestation, Project
from kairo_api.models.report import AuditEvent
from kairo_api.models.scan import RouteInventory, Scan, Stage
from kairo_api.models.user import User

router = APIRouter(tags=["Scans"])


class StartScanRequest(BaseModel):
    commit_hash: Optional[str] = None
    layers: Optional[list[str]] = None  # e.g. ["static", "dynamic"]


@router.post("/projects/{project_id}/scans", status_code=status.HTTP_201_CREATED)
async def start_scan(
    req: StartScanRequest,
    project: Annotated[Project, Depends(require_project_owner)],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Start a new audit scan on the project (US-06).

    Enforces LR-1: user must have confirmed authorization attestation.
    """
    # Check attestation
    a_stmt = select(Attestation).where(Attestation.project_id == project.id)
    a_res = await db.execute(a_stmt)
    if not a_res.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authorization attestation required before starting a scan. Please confirm attestation first.",
        )

    scan_id = f"scn_{secrets.token_hex(12)}"
    layers = req.layers or ["static", "dynamic"]

    scan = Scan(
        id=scan_id,
        project_id=project.id,
        user_id=current_user.id,
        status="running",
        commit_hash=req.commit_hash or "head",
        layers_requested_json=json.dumps(layers),
        started_at=datetime.datetime.now(datetime.timezone.utc),
    )
    db.add(scan)

    # Add stages
    stages = ["prepare", "static"]
    if "logic" in layers:
        stages.append("logic")
    if "dynamic" in layers:
        stages.append("dynamic")
    stages.extend(["merge", "report"])

    for s_name in stages:
        stage = Stage(
            id=f"stg_{secrets.token_hex(12)}",
            scan_id=scan_id,
            name=s_name,
            status="pending" if s_name != "prepare" else "running",
            started_at=datetime.datetime.now(datetime.timezone.utc) if s_name == "prepare" else None,
        )
        db.add(stage)

    # Run static engine if extracted source files exist (M1 integration)
    source_dir = Path("uploads") / project.id / "extracted"
    if source_dir.exists():
        try:
            from kairo_analysis import StaticAnalysisEngine
            analysis_res = StaticAnalysisEngine().analyze(source_dir)
            for r in analysis_res.routes:
                db.add(
                    RouteInventory(
                        id=f"rt_{secrets.token_hex(12)}",
                        scan_id=scan_id,
                        method=r.method,
                        path=r.path,
                        handler_name=r.handler_name,
                        file_path=r.handler_file,
                        line_number=r.start_line,
                        auth_signal=r.authentication.value,
                        ownership_signal=r.ownership_check.value,
                        role_signal=r.role_check.value,
                        middleware_stack_json=json.dumps(r.middleware),
                    )
                )
            for f in analysis_res.findings:
                f_id = f"fnd_{secrets.token_hex(12)}"
                db.add(
                    FindingRecord(
                        id=f_id,
                        project_id=project.id,
                        scan_id=scan_id,
                        fingerprint=f.fingerprint,
                        vulnerability_class=f.vulnerability_class.value,
                        title=f.title,
                        severity=f.severity.value,
                        confidence=f.confidence.value,
                        plain_language_explanation=f.plain_language_explanation,
                        remediation_advice=f.remediation_advice,
                        framework=f.framework,
                        file_path=f.location.file_path if f.location else None,
                        start_line=f.location.start_line if f.location else None,
                        end_line=f.location.end_line if f.location else None,
                        snippet=f.location.snippet if f.location else None,
                        route_path=f.route_path,
                        route_method=f.route_method,
                        is_ai_assisted=f.is_ai_assisted,
                    )
                )
        except Exception:
            pass

    # Audit log
    audit = AuditEvent(
        id=f"aud_{secrets.token_hex(12)}",
        user_id=current_user.id,
        action="scan.started",
        resource_type="scan",
        resource_id=scan_id,
    )
    db.add(audit)
    await db.commit()

    return {
        "id": scan.id,
        "project_id": scan.project_id,
        "status": scan.status,
        "created_at": scan.created_at.isoformat(),
        "stages": stages,
    }


@router.get("/projects/{project_id}/scans")
async def list_project_scans(
    project: Annotated[Project, Depends(require_project_owner)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """List all scans for a specific project."""
    stmt = (
        select(Scan)
        .where(Scan.project_id == project.id)
        .order_by(Scan.created_at.desc())
    )
    result = await db.execute(stmt)
    scans = result.scalars().all()
    return [
        {
            "id": s.id,
            "status": s.status,
            "commit_hash": s.commit_hash,
            "created_at": s.created_at.isoformat(),
            "completed_at": s.completed_at.isoformat() if s.completed_at else None,
        }
        for s in scans
    ]


@router.get("/scans/{scan_id}")
async def get_scan_details(
    scan: Annotated[Scan, Depends(require_scan_owner)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Get scan status and stages progress (US-06)."""
    stmt = select(Stage).where(Stage.scan_id == scan.id).order_by(Stage.started_at)
    res = await db.execute(stmt)
    stages = res.scalars().all()

    return {
        "id": scan.id,
        "project_id": scan.project_id,
        "status": scan.status,
        "commit_hash": scan.commit_hash,
        "rule_set_version": scan.rule_set_version,
        "created_at": scan.created_at.isoformat(),
        "started_at": scan.started_at.isoformat() if scan.started_at else None,
        "completed_at": scan.completed_at.isoformat() if scan.completed_at else None,
        "error_message": scan.error_message,
        "stages": [
            {
                "id": stg.id,
                "name": stg.name,
                "status": stg.status,
                "started_at": stg.started_at.isoformat() if stg.started_at else None,
                "completed_at": stg.completed_at.isoformat() if stg.completed_at else None,
                "error_message": stg.error_message,
            }
            for stg in stages
        ],
    }


@router.post("/scans/{scan_id}/cancel")
async def cancel_scan(
    scan: Annotated[Scan, Depends(require_scan_owner)],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Stop an in-progress scan (FR-D11, AS-10)."""
    if scan.status in ("completed", "failed", "cancelled"):
        return {"status": scan.status, "message": "Scan already finished."}

    scan.status = "cancelled"
    scan.completed_at = datetime.datetime.now(datetime.timezone.utc)
    scan.error_message = "Scan stopped by user."

    audit = AuditEvent(
        id=f"aud_{secrets.token_hex(12)}",
        user_id=current_user.id,
        action="scan.cancelled",
        resource_type="scan",
        resource_id=scan.id,
    )
    db.add(audit)
    await db.commit()

    return {"status": "cancelled", "id": scan.id}


@router.get("/scans/{scan_id}/routes")
async def get_scan_routes(
    scan: Annotated[Scan, Depends(require_scan_owner)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Retrieve route inventory discovered for the scan (FR-S2)."""
    stmt = select(RouteInventory).where(RouteInventory.scan_id == scan.id).order_by(RouteInventory.path)
    res = await db.execute(stmt)
    routes = res.scalars().all()
    return [
        {
            "id": r.id,
            "method": r.method,
            "path": r.path,
            "handler_name": r.handler_name,
            "file_path": r.file_path,
            "line_number": r.line_number,
            "auth_signal": r.auth_signal,
            "ownership_signal": r.ownership_signal,
            "role_signal": r.role_signal,
        }
        for r in routes
    ]


@router.get("/scans/{scan_id}/findings")
async def get_scan_findings(
    scan: Annotated[Scan, Depends(require_scan_owner)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """List all findings detected in a specific scan."""
    stmt = (
        select(FindingRecord)
        .where(FindingRecord.scan_id == scan.id)
        .order_by(FindingRecord.created_at)
    )
    res = await db.execute(stmt)
    findings = res.scalars().all()
    return [
        {
            "id": f.id,
            "fingerprint": f.fingerprint,
            "vulnerability_class": f.vulnerability_class,
            "title": f.title,
            "severity": f.severity,
            "confidence": f.confidence,
            "status": f.status,
            "route_path": f.route_path,
            "route_method": f.route_method,
            "file_path": f.file_path,
            "start_line": f.start_line,
            "end_line": f.end_line,
            "snippet": f.snippet,
            "plain_language_explanation": f.plain_language_explanation,
            "remediation_advice": f.remediation_advice,
            "is_ai_assisted": f.is_ai_assisted,
        }
        for f in findings
    ]
