"""Routers export for KAIRO API."""

from kairo_api.routers.auth import router as auth_router
from kairo_api.routers.findings import router as findings_router
from kairo_api.routers.health import router as health_router
from kairo_api.routers.installations import router as installations_router
from kairo_api.routers.projects import router as projects_router
from kairo_api.routers.reports import router as reports_router
from kairo_api.routers.scans import router as scans_router
from kairo_api.routers.users import router as users_router

__all__ = [
    "auth_router",
    "findings_router",
    "health_router",
    "installations_router",
    "projects_router",
    "reports_router",
    "scans_router",
    "users_router",
]
