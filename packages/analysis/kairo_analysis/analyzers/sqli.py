"""Analyzer for V08: SQL Injection via String Concatenation and Unsafe Interpolation."""

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

# SQL statements combined with string formatting / interpolation
SQL_KEYWORDS = r"(?:SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM|DROP\s+TABLE|ALTER\s+TABLE)"

SQL_INJECTION_PATTERNS = [
    # Python f-strings in execute / query
    (
        rf"(?:cursor|db|session|conn|connection)\.(?:execute|query)\s*\(\s*f['\"].*{SQL_KEYWORDS}.*\{{.*\}}.*['\"]",
        "Python f-string formatted into database execution call",
    ),
    # Python string % formatting or .format() in execute / query
    (
        rf"(?:cursor|db|session|conn|connection)\.(?:execute|query)\s*\(\s*['\"].*{SQL_KEYWORDS}.*['\"]\s*%",
        "Python % string formatting in database execution call",
    ),
    (
        rf"(?:cursor|db|session|conn|connection)\.(?:execute|query)\s*\(\s*['\"].*{SQL_KEYWORDS}.*['\"]\s*\.format\(",
        "Python str.format() in database execution call",
    ),
    # Python raw text() with f-string (SQLAlchemy)
    (
        rf"text\s*\(\s*f['\"].*{SQL_KEYWORDS}.*\{{.*\}}.*['\"]\s*\)",
        "SQLAlchemy text() construct with f-string interpolation",
    ),
    # JS/TS template literal interpolation in db.query or execute
    (
        rf"(?:db|client|pool|connection|conn|prisma)\.(?:\$queryRawUnsafe|query|execute)\s*\(\s*`.*{SQL_KEYWORDS}.*\${{.*}}.*`",
        "JavaScript/TypeScript template literal interpolated into database execution call",
    ),
    # JS/TS string concatenation in db.query / execute
    (
        rf"(?:db|client|pool|connection|conn)\.(?:query|execute)\s*\(\s*['\"].*{SQL_KEYWORDS}.*['\"]\s*\+",
        "JavaScript/TypeScript string concatenation in database query call",
    ),
]


class SqliAnalyzer:
    """Detects raw SQL queries constructed using unparameterized string formatting (V08)."""

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

                for pat, desc in SQL_INJECTION_PATTERNS:
                    if re.search(pat, line, re.IGNORECASE):
                        fp = compute_finding_fingerprint(
                            vulnerability_class="V08",
                            target_path=rel_path,
                            rule_id="KR-V08-sql-string-interpolation",
                        )
                        findings.append(
                            FindingBase(
                                vulnerability_class=VulnerabilityClass.V08,
                                title="SQL Injection via String Concatenation or Interpolation",
                                severity=Severity.CRITICAL,
                                confidence=Confidence.LIKELY,
                                plain_language_explanation=(
                                    f"SQL query is constructed using dynamic string formatting or interpolation at {rel_path}:{idx}. "
                                    f"Concatenating user input into raw SQL statements allows attackers to alter query logic, "
                                    f"extract sensitive records, or execute arbitrary database commands."
                                ),
                                remediation_advice=(
                                    "Use parameterized queries, prepared statements, or ORM query builders. "
                                    "Pass user-supplied values separately as parameters rather than interpolating into SQL strings."
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
