"""Ownership dependencies enforcing tenant isolation (NFR-S3).

Per TRD Section 11:
- Every route touching a project, scan, or finding verifies ownership.
- Requests for another user's object return 404 Not Found (never 403),
  preventing ID probing and user enumeration.
"""

from typing import Annotated
from fastapi import Depends, HTTPException, Path, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from kairo_api.database import get_db
from kairo_api.dependencies.auth import get_current_user
from kairo_api.models.finding import FindingRecord
from kairo_api.models.project import Project
from kairo_api.models.scan import Scan
from kairo_api.models.user import User


async def require_project_owner(
    project_id: Annotated[str, Path(description="The unique project ID")],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Project:
    """Load project and verify ownership by current user.
    
    Returns 404 if project does not exist OR belongs to another user.
    """
    stmt = select(Project).where(
        Project.id == project_id,
        Project.user_id == current_user.id,
    )
    result = await db.execute(stmt)
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )
    return project


async def require_scan_owner(
    scan_id: Annotated[str, Path(description="The unique scan ID")],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Scan:
    """Load scan and verify ownership by current user.
    
    Returns 404 if scan does not exist OR belongs to another user.
    """
    stmt = select(Scan).where(
        Scan.id == scan_id,
        Scan.user_id == current_user.id,
    )
    result = await db.execute(stmt)
    scan = result.scalar_one_or_none()
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found.",
        )
    return scan


async def require_finding_owner(
    finding_id: Annotated[str, Path(description="The unique finding ID")],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> FindingRecord:
    """Load finding and verify ownership by current user through project relation.
    
    Returns 404 if finding does not exist OR belongs to another user.
    """
    stmt = (
        select(FindingRecord)
        .join(Project, FindingRecord.project_id == Project.id)
        .where(
            FindingRecord.id == finding_id,
            Project.user_id == current_user.id,
        )
    )
    result = await db.execute(stmt)
    finding = result.scalar_one_or_none()
    if not finding:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Finding not found.",
        )
    return finding
