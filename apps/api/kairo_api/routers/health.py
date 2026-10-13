"""Health and Readiness endpoints (NFR-O1)."""

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from kairo_api.database import get_db

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    """Liveness probe: verifies process is responsive."""
    return {"status": "ok", "service": "kairo-api", "version": "0.1.0"}


@router.get("/ready")
async def ready_check(db: AsyncSession = Depends(get_db)):
    """Readiness probe: verifies database connectivity."""
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "ready", "database": "connected"}
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "not_ready", "database": str(e)},
        )
