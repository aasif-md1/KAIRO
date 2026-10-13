"""Application configuration and environment settings."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    APP_URL: str = "http://localhost:3000"
    NEXT_PUBLIC_API_URL: str = "http://localhost:8000"

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./kairo_dev.db"
    DATABASE_URL_SYNC: str = "sqlite:///./kairo_dev.db"

    # S3 / MinIO
    S3_ENDPOINT: str = "http://localhost:9000"
    S3_ACCESS_KEY: str = "kairo_minio_admin"
    S3_SECRET_KEY: str = "kairo_minio_password"
    S3_BUCKET_SNAPSHOTS: str = "kairo-snapshots"
    S3_BUCKET_REPORTS: str = "kairo-reports"
    S3_USE_SSL: bool = False

    # GitHub OAuth
    GITHUB_CLIENT_ID: str = "kairo_dev_client_id"
    GITHUB_CLIENT_SECRET: str = "kairo_dev_client_secret"
    GITHUB_OAUTH_URL: str = "http://localhost:8080/login/oauth/authorize"
    GITHUB_TOKEN_URL: str = "http://localhost:8080/login/oauth/access_token"
    GITHUB_API_URL: str = "http://localhost:8080/api/v3"

    # Sessions & Cookies
    SESSION_SECRET: str = "kairo_dev_session_secret_32_characters_minimum!"
    SESSION_COOKIE_NAME: str = "__Host-kairo_session"
    COOKIE_SECURE: bool = False  # Set True in production
    SESSION_MAX_AGE_SECONDS: int = 604800  # 7 days

    # Rate limiting & Security
    RATE_LIMIT_PER_MINUTE: int = 60
    ENCRYPTION_KEY_SECRET: str = "kairo_dev_snapshot_encryption_key_32chars!"

    # AI Logic Review gate
    AI_REVIEW_ENABLED: bool = False
    MODEL_PROVIDER: str = "mock"
    MODEL_API_KEY: str = ""
    MODEL_BASE_URL: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
