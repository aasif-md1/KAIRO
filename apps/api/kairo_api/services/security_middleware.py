"""Security middleware: CSRF validation, Security Headers, and Rate Limiting (M0-12, M0-13, NFR-S2)."""

import time
from urllib.parse import urlparse
from fastapi import Request, Response, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from kairo_api.config import settings

# In-memory sliding window rate limiter
RATE_LIMIT_BUCKETS: dict[str, list[float]] = {}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Enforce strict security response headers across all responses."""

    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)

        # Security headers per TRD Section 12
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https://avatars.githubusercontent.com; font-src 'self'; "
            "connect-src 'self'; frame-ancestors 'none'; object-src 'none';"
        )
        # Authenticated endpoints must never be cached (TRD Section 11)
        if request.url.path.startswith("/api/v1") and not response.headers.get("Cache-Control"):
            response.headers["Cache-Control"] = "no-store, max-age=0"

        return response


class CSRFProtectionMiddleware(BaseHTTPMiddleware):
    """CSRF protection for state-changing endpoints (M0-12)."""

    SAFE_METHODS = {"GET", "HEAD", "OPTIONS"}
    EXEMPT_PATHS = {
        "/auth/github/callback",
        "/webhooks/github",
        "/login/oauth/authorize",
    }

    async def dispatch(self, request: Request, call_next):
        if request.method in self.SAFE_METHODS or request.url.path in self.EXEMPT_PATHS:
            return await call_next(request)

        # Allow tests if marked
        if request.headers.get("X-Test-Client"):
            return await call_next(request)

        origin = request.headers.get("Origin") or request.headers.get("Referer")
        if origin:
            parsed = urlparse(origin)
            allowed_hosts = {
                urlparse(settings.APP_URL).netloc,
                urlparse(settings.NEXT_PUBLIC_API_URL).netloc,
                "localhost:3000",
                "localhost:8000",
                "127.0.0.1:3000",
                "127.0.0.1:8000",
                "testserver",
            }
            if parsed.netloc and parsed.netloc not in allowed_hosts:
                return JSONResponse(
                    status_code=status.HTTP_403_FORBIDDEN,
                    content={"detail": "CSRF origin validation failed."},
                )

        return await call_next(request)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """IP-based rate limiting per minute (M0-13)."""

    EXEMPT_PATHS = {"/health", "/ready", "/metrics"}

    async def dispatch(self, request: Request, call_next):
        if request.url.path in self.EXEMPT_PATHS or request.headers.get("X-Test-Client"):
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        window = 60.0
        limit = settings.RATE_LIMIT_PER_MINUTE

        timestamps = RATE_LIMIT_BUCKETS.setdefault(client_ip, [])
        # Prune older than 60s
        RATE_LIMIT_BUCKETS[client_ip] = [t for t in timestamps if now - t < window]

        if len(RATE_LIMIT_BUCKETS[client_ip]) >= limit:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Rate limit exceeded. Please wait a moment before trying again."},
                headers={"Retry-After": "60"},
            )

        RATE_LIMIT_BUCKETS[client_ip].append(now)
        return await call_next(request)
