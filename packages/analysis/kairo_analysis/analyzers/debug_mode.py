"""Analyzer for V13: Debug Mode or Verbose Error Output Enabled."""

import re
from pathlib import Path
from typing import List
from kairo_findings.models import (
    Confidence,
    FindingBase,
    Severity,
    VulnerabilityClass,
    CodeLocation,
    Evidence,
)
from kairo_findings.fingerprint import compute_finding_fingerprint

DEBUG_PATTERNS = [
    # Flask / Python debug=True
    (r"app\.run\s*\([^\)]*debug\s*=\s*True", "Flask application started with debug=True"),
    (r"app\.debug\s*=\s*True", "Flask debug property set to True"),
    (r"FastAPI\s*\([^\)]*debug\s*=\s*True", "FastAPI instance initialized with debug=True"),
    (r"DEBUG\s*=\s*True", "Application DEBUG setting enabled"),
    # Express / Node stack trace leakage
    (r"res\.(?:status\(\d+\)\.)?json\s*\([^\)]*err\.stack", "Express endpoint leaking err.stack in response"),
    (r"res\.(?:send|write)\s*\(\s*err\.stack\s*\)", "Express endpoint sending raw err.stack"),
    # Python traceback leakage in response
    (r"traceback\.format_exc\(\)", "Raw traceback formatted in application code"),
]


class DebugModeAnalyzer:
    """Detects debug mode enabled and verbose stack trace exposure in application code (V13)."""

    def analyze(self, project_root: Path) -> List[FindingBase]:
        findings: List[FindingBase] = []

        scannable_exts = {".py", ".js", ".ts", ".tsx"}
        for file_path in project_root.rglob("*"):
            if not file_path.is_file() or file_path.suffix.lower() not in scannable_exts:
                continue
            if any(p in file_path.parts for p in ["node_modules", ".git", ".venv", "dist", ".next"]):
                continue

            rel_path = str(file_path.relative_to(project_root)).replace("\\", "/")
            try:
                content = file_path.read_text(encoding="utf-8", errors="replace")
                lines = content.splitlines()
            except Exception:
                continue

            for idx, line in enumerate(lines, start=1):
                stripped = line.strip()
                if stripped.startswith("//") or stripped.startswith("#"):
                    continue

                for pat, desc in DEBUG_PATTERNS:
                    if re.search(pat, line):
                        fp = compute_finding_fingerprint(
                            vulnerability_class="V13",
                            target_path=rel_path,
                            rule_id="KR-V13-debug-mode-enabled",
                        )
                        findings.append(
                            FindingBase(
                                vulnerability_class=VulnerabilityClass.V13,
                                title="Debug Mode or Verbose Error Output Enabled",
                                severity=Severity.MEDIUM,
                                confidence=Confidence.LIKELY,
                                plain_language_explanation=(
                                    f"Application has debug mode or verbose error reporting enabled at {rel_path}:{idx} ({stripped}). "
                                    f"Debug mode exposes internal application structure, environment variables, "
                                    f"framework versions, and sensitive stack traces to unauthenticated users upon error."
                                ),
                                remediation_advice=(
                                    "Disable debug mode in production environments (e.g. set DEBUG=False or use environment variable flags). "
                                    "Return generic error responses to clients and log internal stack traces to a secure monitoring sink."
                                ),
                                fingerprint=fp,
                                location=CodeLocation(
                                    file_path=rel_path,
                                    start_line=idx,
                                    end_line=idx,
                                    snippet=stripped,
                                ),
                                evidence=[
                                    Evidence(
                                        layer="static",
                                        description=f"{desc} detected at line {idx}",
                                        code_location=CodeLocation(
                                            file_path=rel_path,
                                            start_line=idx,
                                            end_line=idx,
                                            snippet=stripped,
                                        ),
                                    )
                                ],
                            )
                        )
                        break

        return findings
