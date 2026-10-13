"""Authentication and account lifecycle router (FR-A1 through FR-A6, US-01, US-11)."""

import datetime
import secrets
from typing import Annotated, Optional
import httpx
from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from kairo_api.config import settings
from kairo_api.database import get_db
from kairo_api.dependencies.auth import get_current_user
from kairo_api.models.report import AuditEvent
from kairo_api.models.user import Session as DbSession, User

router = APIRouter(prefix="/auth", tags=["Auth"])


class UserProfileResponse(BaseModel):
    id: str
    login: str
    name: Optional[str] = None
    email: Optional[str] = None
    avatar_url: Optional[str] = None
    terms_accepted: bool


@router.get("/github/start")
async def github_auth_start(state: Optional[str] = None):
    """Initiate GitHub OAuth flow."""
    auth_state = state or secrets.token_urlsafe(16)
    redirect_uri = f"{settings.NEXT_PUBLIC_API_URL}/auth/github/callback"
    target = (
        f"{settings.GITHUB_OAUTH_URL}?"
        f"client_id={settings.GITHUB_CLIENT_ID}&"
        f"redirect_uri={redirect_uri}&"
        f"scope=read:user,user:email&"
        f"state={auth_state}"
    )
    return RedirectResponse(url=target)


@router.get("/github/callback")
async def github_auth_callback(
    code: str,
    response: Response,
    db: Annotated[AsyncSession, Depends(get_db)],
    state: Optional[str] = None,
):
    """Handle OAuth callback, authenticate or create user, and issue session."""
    # 1. Exchange code for access token
    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            settings.GITHUB_TOKEN_URL,
            headers={"Accept": "application/json"},
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
            },
        )
        if token_res.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to retrieve access token from GitHub.",
            )
        token_data = token_res.json()
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="GitHub did not return an access token.",
            )

        # 2. Fetch user profile
        user_res = await client.get(
            f"{settings.GITHUB_API_URL}/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json",
            },
        )
        if user_res.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to fetch user profile from GitHub.",
            )
        gh_user = user_res.json()

    github_id = gh_user.get("id")
    login = gh_user.get("login")
    name = gh_user.get("name")
    email = gh_user.get("email")
    avatar_url = gh_user.get("avatar_url")

    # 3. Find or create user
    stmt = select(User).where(User.github_id == github_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            id=f"usr_{secrets.token_hex(12)}",
            github_id=github_id,
            login=login,
            name=name,
            email=email,
            avatar_url=avatar_url,
        )
        db.add(user)
        await db.flush()

        # Audit log creation
        audit = AuditEvent(
            id=f"aud_{secrets.token_hex(12)}",
            user_id=user.id,
            action="user.registered",
            resource_type="user",
            resource_id=user.id,
        )
        db.add(audit)
    else:
        # Update user attributes
        user.login = login
        user.name = name
        user.email = email
        user.avatar_url = avatar_url

    # 4. Create session record
    token_str = secrets.token_urlsafe(48)
    expires = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(
        seconds=settings.SESSION_MAX_AGE_SECONDS
    )
    new_session = DbSession(
        id=f"ses_{secrets.token_hex(12)}",
        session_token=token_str,
        user_id=user.id,
        expires_at=expires,
    )
    db.add(new_session)
    await db.commit()

    # 5. Set session cookie and redirect to web app
    redirect_target = f"{settings.APP_URL}/projects" if user.terms_accepted_at else f"{settings.APP_URL}/welcome"
    resp = RedirectResponse(url=redirect_target, status_code=302)

    cookie_name = settings.SESSION_COOKIE_NAME if settings.COOKIE_SECURE else "kairo_session"
    resp.set_cookie(
        key=cookie_name,
        value=token_str,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        max_age=settings.SESSION_MAX_AGE_SECONDS,
        path="/",
    )
    return resp


@router.post("/logout")
async def logout(
    response: Response,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    """Sign out the current user and destroy active sessions."""
    await db.execute(delete(DbSession).where(DbSession.user_id == current_user.id))
    await db.commit()

    cookie_name = settings.SESSION_COOKIE_NAME if settings.COOKIE_SECURE else "kairo_session"
    response.delete_cookie(key=cookie_name, path="/")
    return {"status": "logged_out"}
