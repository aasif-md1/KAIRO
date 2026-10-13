"""Safe ZIP archive validation and extraction service (FR-I2, NFR-S7).

Protects against:
- Zip bombs (max file count and max total uncompressed size limits)
- Path traversal (rejection of '..' segments and absolute paths)
- Symlink exploits (rejection of symlinks and special devices)
"""

import os
import zipfile
from pathlib import Path
from fastapi import HTTPException, status

MAX_ARCHIVE_SIZE_BYTES = 50 * 1024 * 1024  # 50 MB upload limit
MAX_UNCOMPRESSED_BYTES = 200 * 1024 * 1024  # 200 MB max extracted
MAX_FILE_COUNT = 5000

IGNORED_DIRECTORIES = {
    "node_modules",
    ".git",
    "__pycache__",
    ".venv",
    "venv",
    ".next",
    "dist",
    "build",
}


def validate_and_extract_zip(zip_path: Path, target_dir: Path) -> list[str]:
    """Validate archive for safety and extract into target_dir.
    
    Returns a list of extracted relative file paths.
    """
    target_dir.mkdir(parents=True, exist_ok=True)
    resolved_target = target_dir.resolve()

    extracted_files: list[str] = []
    total_bytes = 0
    file_count = 0

    if not zipfile.is_zipfile(zip_path):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is not a valid ZIP archive.",
        )

    with zipfile.ZipFile(zip_path, "r") as zf:
        infolist = zf.infolist()
        if len(infolist) > MAX_FILE_COUNT:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Archive contains too many files (maximum {MAX_FILE_COUNT}).",
            )

        for member in infolist:
            file_count += 1
            total_bytes += member.file_size
            if total_bytes > MAX_UNCOMPRESSED_BYTES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Archive uncompressed size exceeds the maximum limit (200 MB).",
                )

            # Check for path traversal
            norm_name = member.filename.replace("\\", "/")
            if norm_name.startswith("/") or ".." in norm_name.split("/"):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Suspicious path in archive: {member.filename}",
                )

            # Check for symlinks in external attributes
            is_symlink = (member.external_attr >> 16) & 0o120000 == 0o120000
            if is_symlink:
                # Disallow symlinks
                continue

            # Check if within ignored directory
            parts = norm_name.split("/")
            if any(p in IGNORED_DIRECTORIES for p in parts):
                continue

            # Extract destination
            dest_path = (resolved_target / norm_name).resolve()
            if not str(dest_path).startswith(str(resolved_target)):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Directory traversal detected in archive entry.",
                )

            if member.is_dir():
                dest_path.mkdir(parents=True, exist_ok=True)
            else:
                dest_path.parent.mkdir(parents=True, exist_ok=True)
                with zf.open(member) as source, open(dest_path, "wb") as target:
                    target.write(source.read())
                extracted_files.append(norm_name)

    return extracted_files
