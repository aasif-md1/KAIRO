"""Framework and technology stack detector (TRD Section 7)."""

import json
from pathlib import Path
from typing import Tuple
from kairo_analysis.models import FrameworkType


def detect_stack(root_dir: Path) -> Tuple[FrameworkType, str]:
    """Detect the target framework and primary programming language."""
    # 1. Check Node.js / JavaScript / TypeScript manifests
    pkg_json = root_dir / "package.json"
    if pkg_json.exists():
        try:
            data = json.loads(pkg_json.read_text(encoding="utf-8"))
            deps = {
                **data.get("dependencies", {}),
                **data.get("devDependencies", {}),
            }
            if "next" in deps:
                return FrameworkType.NEXTJS, "typescript"
            if "express" in deps:
                return FrameworkType.EXPRESS, "javascript"
        except Exception:
            pass

    # Next.js directory convention fallback
    if (root_dir / "app").exists() or (root_dir / "pages").exists():
        if list((root_dir / "app").glob("**/route.ts")) or list((root_dir / "pages").glob("api/**/*.ts")):
            return FrameworkType.NEXTJS, "typescript"

    # 2. Check Python manifests
    req_txt = root_dir / "requirements.txt"
    pyproj = root_dir / "pyproject.toml"

    manifest_content = ""
    if req_txt.exists():
        try:
            manifest_content += req_txt.read_text(encoding="utf-8").lower()
        except Exception:
            pass

    if pyproj.exists():
        try:
            manifest_content += pyproj.read_text(encoding="utf-8").lower()
        except Exception:
            pass

    if "fastapi" in manifest_content:
        return FrameworkType.FASTAPI, "python"
    if "flask" in manifest_content:
        return FrameworkType.FLASK, "python"

    # 3. Code inspection fallback
    for py_file in root_dir.rglob("*.py"):
        if any(p in py_file.parts for p in ["node_modules", ".venv", "__pycache__", ".git"]):
            continue
        try:
            text = py_file.read_text(encoding="utf-8")
            if "FastAPI(" in text or "APIRouter(" in text:
                return FrameworkType.FASTAPI, "python"
            if "Flask(" in text or "Blueprint(" in text:
                return FrameworkType.FLASK, "python"
        except Exception:
            continue

    # Default to unknown
    return FrameworkType.UNKNOWN, "unknown"
