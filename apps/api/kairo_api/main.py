"""FastAPI main application entrypoint for KAIRO."""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from kairo_api.database import Base, engine
from kairo_api.routers import (
    auth_router,
    findings_router,
    health_router,
    installations_router,
    projects_router,
    reports_router,
    scans_router,
    users_router,
)
from kairo_api.services.security_middleware import (
    CSRFProtectionMiddleware,
    RateLimitMiddleware,
    SecurityHeadersMiddleware,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables for development/testing
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="KAIRO API",
    description="Access-control and secret-handling audit platform API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Register middlewares in correct onion order
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(CSRFProtectionMiddleware)
app.add_middleware(RateLimitMiddleware)


# RFC 9457 Problem Details error handlers (TRD Section 11)
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        headers={"Content-Type": "application/problem+json"},
        content={
            "type": f"https://kairo.dev/errors/{exc.status_code}",
            "title": exc.detail if isinstance(exc.detail, str) else "HTTP Error",
            "status": exc.status_code,
            "detail": str(exc.detail),
            "instance": request.url.path,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        headers={"Content-Type": "application/problem+json"},
        content={
            "type": "https://kairo.dev/errors/validation-error",
            "title": "Validation Error",
            "status": 422,
            "detail": "Request body or query parameters failed validation.",
            "errors": exc.errors(),
            "instance": request.url.path,
        },
    )


# Mount routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(projects_router)
app.include_router(scans_router)
app.include_router(findings_router)
app.include_router(reports_router)
app.include_router(installations_router)

# Also mount under /api/v1 for strict path versioning
app.include_router(projects_router, prefix="/api/v1")
app.include_router(scans_router, prefix="/api/v1")
app.include_router(findings_router, prefix="/api/v1")
app.include_router(reports_router, prefix="/api/v1")
app.include_router(installations_router, prefix="/api/v1")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("kairo_api.main:app", host="0.0.0.0", port=8000, reload=True)
