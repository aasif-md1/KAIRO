"""Project management, configuration, archive upload, and attestation router (FR-I1 through FR-I8)."""

import hashlib
import json
from pathlib import Path
import secrets
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from kairo_api.database import get_db
from kairo_api.dependencies.auth import get_current_user
from kairo_api.dependencies.ownership import require_project_owner
from kairo_api.models.project import Attestation, Project, ProjectConfig
from kairo_api.models.report import AuditEvent
from kairo_api.models.user import User
from kairo_api.services.archive_service import MAX_ARCHIVE_SIZE_BYTES, validate_and_extract_zip

router = APIRouter(prefix="/projects", tags=["Projects"])


class CreateProjectRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    repo_full_name: Optional[str] = None
    default_branch: str = "main"
    source_type: str = "github"  # "github" or "archive"


class UpdateProjectRequest(BaseModel):
    name: Optional[str] = None
    default_branch: Optional[str] = None


class ProjectConfigUpdateRequest(BaseModel):
    start_command: Optional[str] = None
    test_port: int = 3000
    env_vars: Optional[dict[str, str]] = None
    test_accounts: Optional[list[dict]] = None
    sidecar_services: Optional[list[str]] = None
    ignore_patterns: Optional[list[str]] = None
    ai_review_enabled: bool = False


class ProjectAttestationRequest(BaseModel):
    terms_text: str = Field(min_length=10)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_project(
    req: CreateProjectRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Create a new project (US-02, FR-I1)."""
    project_id = f"prj_{secrets.token_hex(12)}"
    # Generate project-specific wrapped data key for encryption (NFR-S4)
    data_key = secrets.token_hex(32)

    project = Project(
        id=project_id,
        user_id=current_user.id,
        name=req.name,
        repo_full_name=req.repo_full_name,
        default_branch=req.default_branch,
        source_type=req.source_type,
        encrypted_data_key=data_key,
    )
    db.add(project)

    # Initialize empty config
    config = ProjectConfig(
        id=f"cfg_{secrets.token_hex(12)}",
        project_id=project_id,
        start_command=None,
        test_port=3000,
        ai_review_enabled=False,
    )
    db.add(config)

    # Log audit
    audit = AuditEvent(
        id=f"aud_{secrets.token_hex(12)}",
        user_id=current_user.id,
        action="project.created",
        resource_type="project",
        resource_id=project_id,
    )
    db.add(audit)
    await db.commit()

    return {
        "id": project.id,
        "name": project.name,
        "repo_full_name": project.repo_full_name,
        "default_branch": project.default_branch,
        "source_type": project.source_type,
        "created_at": project.created_at.isoformat(),
    }


@router.get("")
async def list_projects(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """List all projects owned by the authenticated user."""
    stmt = (
        select(Project)
        .where(Project.user_id == current_user.id)
        .order_by(Project.created_at.desc())
    )
    result = await db.execute(stmt)
    projects = result.scalars().all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "repo_full_name": p.repo_full_name,
            "default_branch": p.default_branch,
            "source_type": p.source_type,
            "created_at": p.created_at.isoformat(),
        }
        for p in projects
    ]


@router.get("/{project_id}")
async def get_project(
    project: Annotated[Project, Depends(require_project_owner)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Get project details, config, and attestation status."""
    c_stmt = select(ProjectConfig).where(ProjectConfig.project_id == project.id)
    c_res = await db.execute(c_stmt)
    config = c_res.scalar_one_or_none()

    a_stmt = select(Attestation).where(Attestation.project_id == project.id)
    a_res = await db.execute(a_stmt)
    attestation = a_res.scalar_one_or_none()

    return {
        "id": project.id,
        "name": project.name,
        "repo_full_name": project.repo_full_name,
        "default_branch": project.default_branch,
        "source_type": project.source_type,
        "created_at": project.created_at.isoformat(),
        "is_attested": bool(attestation),
        "config": {
            "start_command": config.start_command if config else None,
            "test_port": config.test_port if config else 3000,
            "ai_review_enabled": config.ai_review_enabled if config else False,
        },
    }


@router.patch("/{project_id}")
async def update_project(
    req: UpdateProjectRequest,
    project: Annotated[Project, Depends(require_project_owner)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Update project metadata."""
    if req.name is not None:
        project.name = req.name
    if req.default_branch is not None:
        project.default_branch = req.default_branch
    await db.commit()
    return {"id": project.id, "name": project.name, "default_branch": project.default_branch}


@router.delete("/{project_id}")
async def delete_project(
    project: Annotated[Project, Depends(require_project_owner)],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Delete project and associated scans/findings (US-11)."""
    audit = AuditEvent(
        id=f"aud_{secrets.token_hex(12)}",
        user_id=current_user.id,
        action="project.deleted",
        resource_type="project",
        resource_id=project.id,
    )
    db.add(audit)
    await db.delete(project)
    await db.commit()
    return {"status": "deleted", "id": project.id}


@router.put("/{project_id}/config")
async def update_project_config(
    req: ProjectConfigUpdateRequest,
    project: Annotated[Project, Depends(require_project_owner)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Update project configuration: test accounts, env vars, port, sidecars (US-04)."""
    stmt = select(ProjectConfig).where(ProjectConfig.project_id == project.id)
    res = await db.execute(stmt)
    config = res.scalar_one_or_none()
    if not config:
        config = ProjectConfig(
            id=f"cfg_{secrets.token_hex(12)}",
            project_id=project.id,
        )
        db.add(config)

    config.start_command = req.start_command
    config.test_port = req.test_port
    config.ai_review_enabled = req.ai_review_enabled
    if req.env_vars is not None:
        config.env_vars_encrypted = json.dumps(req.env_vars)
    if req.test_accounts is not None:
        config.test_accounts_encrypted = json.dumps(req.test_accounts)
    if req.sidecar_services is not None:
        config.sidecar_services_json = json.dumps(req.sidecar_services)
    if req.ignore_patterns is not None:
        config.ignore_patterns_json = json.dumps(req.ignore_patterns)

    await db.commit()
    return {"status": "updated", "project_id": project.id}


@router.post("/{project_id}/attestation")
async def record_attestation(
    req: ProjectAttestationRequest,
    project: Annotated[Project, Depends(require_project_owner)],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Record user authorization confirmation before scan (LR-1, FR-I7, US-05)."""
    content_hash = hashlib.sha256(req.terms_text.encode("utf-8")).hexdigest()

    attestation = Attestation(
        id=f"att_{secrets.token_hex(12)}",
        project_id=project.id,
        user_id=current_user.id,
        terms_text=req.terms_text,
        content_hash=content_hash,
    )
    db.add(attestation)

    audit = AuditEvent(
        id=f"aud_{secrets.token_hex(12)}",
        user_id=current_user.id,
        action="project.attestation_confirmed",
        resource_type="project",
        resource_id=project.id,
        metadata_json=json.dumps({"hash": content_hash}),
    )
    db.add(audit)
    await db.commit()

    return {
        "status": "attested",
        "id": attestation.id,
        "confirmed_at": attestation.confirmed_at.isoformat(),
    }


@router.post("/{project_id}/archive")
async def upload_archive(
    project: Annotated[Project, Depends(require_project_owner)],
    file: UploadFile = File(...),
):
    """Upload and safely extract a ZIP archive (FR-I2, US-03)."""
    if not file.filename or not file.filename.endswith(".zip"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a .zip archive.",
        )

    # Save to temp location
    upload_dir = Path("uploads") / project.id
    upload_dir.mkdir(parents=True, exist_ok=True)
    zip_path = upload_dir / "source.zip"

    contents = await file.read()
    if len(contents) > MAX_ARCHIVE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded ZIP exceeds the 50 MB limit.",
        )

    with open(zip_path, "wb") as f:
        f.write(contents)

    # Safe extraction
    extract_target = upload_dir / "extracted"
    extracted_files = validate_and_extract_zip(zip_path, extract_target)

    return {
        "status": "extracted",
        "project_id": project.id,
        "file_count": len(extracted_files),
        "files_sample": extracted_files[:10],
    }
