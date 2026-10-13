"""GitHub App installations and repository discovery router (FR-I1)."""

from typing import Annotated
import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from kairo_api.config import settings
from kairo_api.database import get_db
from kairo_api.dependencies.auth import get_current_user
from kairo_api.models.user import Installation, User

router = APIRouter(prefix="/installations", tags=["Installations"])


@router.get("")
async def list_installations(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """List GitHub App installations for current user."""
    stmt = select(Installation).where(Installation.user_id == current_user.id)
    res = await db.execute(stmt)
    installs = res.scalars().all()
    return [
        {
            "id": i.id,
            "github_installation_id": i.github_installation_id,
            "account_login": i.account_login,
        }
        for i in installs
    ]


@router.get("/{installation_id}/repositories")
async def list_installation_repos(
    installation_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """List repositories accessible via installation (calls GitHub API)."""
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{settings.GITHUB_API_URL}/user/repos")
        if res.status_code == 200:
            repos = res.json()
            return [
                {
                    "id": r["id"],
                    "name": r["name"],
                    "full_name": r["full_name"],
                    "private": r["private"],
                    "default_branch": r.get("default_branch", "main"),
                }
                for r in repos
            ]
        return []
