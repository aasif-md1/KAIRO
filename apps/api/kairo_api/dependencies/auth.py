"""Authentication dependencies and session cookie extraction (FR-A1, FR-A2)."""

import datetime
from typing import Annotated, Optional
from fastapi import Cookie, Depends, HTTPException, Header, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from kairo_api.config import settings
from kairo_api.database import get_db
from kairo_api.models.user import Session as DbSession, User


async def get_current_user_optional(
    request: Request,
    db: Annotated[AsyncSession, Depends(get_db)],
    host_session: Optional[str] = Cookie(default=None, alias=settings.SESSION_COOKIE_NAME),
    dev_session: Optional[str] = Cookie(default=None, alias="kairo_session"),
    authorization: Optional[str] = Header(default=None),
) -> Optional[User]:
    """Retrieve the currently authenticated user if session exists and is valid."""
    token = host_session or dev_session

    # Also support Bearer token for automated tests or runner
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ", 1)[1].strip()

    if not token:
        return None

    now = datetime.datetime.now(datetime.timezone.utc)
    stmt = (
        select(DbSession)
        .where(DbSession.session_token == token)
        .where(DbSession.expires_at > now)
    )
    result = await db.execute(stmt)
    session_record = result.scalar_one_or_none()
    if not session_record:
        return None

    # Load user
    user_stmt = select(User).where(User.id == session_record.user_id)
    user_res = await db.execute(user_stmt)
    return user_res.scalar_one_or_none()


async def get_current_user(
    user: Annotated[Optional[User], Depends(get_current_user_optional)],
) -> User:
    """Require an authenticated user; raises 401 Unauthorized if not signed in."""
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please sign in with GitHub.",
        )
    return user
