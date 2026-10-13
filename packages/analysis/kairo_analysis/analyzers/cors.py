"""Analyzer for V10: Permissive Cross-Origin Resource Sharing (CORS)."""

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


class CorsAnalyzer:
    """Detects overly permissive CORS policies, such as wildcard origin with credentials (V10)."""

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

            # 1. Express / JS CORS: wildcard or true origin with credentials: true
            # e.g., cors({ origin: '*', credentials: true }) or cors({ origin: true, credentials: true })
            if ("cors(" in content or "cors({" in content) and ("credentials" in content):
                # Search multi-line or single line
                cors_block_match = re.search(
                    r"cors\s*\(\s*\{[^\}]*(?:origin\s*:\s*(?:['\"]\*['\"]|true))[^\}]*credentials\s*:\s*true[^\}]*\}",
                    content,
                    re.DOTALL | re.IGNORECASE,
                ) or re.search(
                    r"cors\s*\(\s*\{[^\}]*credentials\s*:\s*true[^\}]*(?:origin\s*:\s*(?:['\"]\*['\"]|true))[^\}]*\}",
                    content,
                    re.DOTALL | re.IGNORECASE,
                )
                if cors_block_match:
                    start_char = cors_block_match.start()
                    line_no = content[:start_char].count("\n") + 1
                    fp = compute_finding_fingerprint(
                        vulnerability_class="V10",
                        target_path=rel_path,
                        rule_id="KR-V10-cors-wildcard-credentials",
                    )
                    findings.append(
                        FindingBase(
                            vulnerability_class=VulnerabilityClass.V10,
                            title="Wildcard or Reflective CORS Origin with Credentials Enabled",
                            severity=Severity.HIGH,
                            confidence=Confidence.LIKELY,
                            plain_language_explanation=(
                                f"CORS middleware at {rel_path}:{line_no} allows wildcard or reflective origin "
                                f"while enabling credentials. This permits any malicious third-party site to "
                                f"send authenticated cross-origin requests and read sensitive responses."
                            ),
                            remediation_advice=(
                                "Explicitly specify trusted origin domain(s) instead of '*' or 'true' when credentials are enabled. "
                                "Never reflect arbitrary Origin request headers when Allow-Credentials is true."
                            ),
                            fingerprint=fp,
                            location=CodeLocation(
                                file_path=rel_path,
                                start_line=line_no,
                                end_line=line_no,
                                snippet=lines[line_no - 1].strip() if line_no <= len(lines) else "",
                            ),
                            evidence=[
                                Evidence(
                                    layer="static",
                                    description="CORS configured with wildcard/reflective origin and credentials: true",
                                    code_location=CodeLocation(
                                        file_path=rel_path,
                                        start_line=line_no,
                                        end_line=line_no,
                                    ),
                                )
                            ],
                        )
                    )

            # 2. FastAPI CORSMiddleware with allow_origins=["*"] and allow_credentials=True
            if "CORSMiddleware" in content:
                fastapi_cors_match = re.search(
                    r"add_middleware\s*\(\s*CORSMiddleware[^\)]*(?:allow_origins\s*=\s*\[\s*['\"]\*['\"]\s*\][^\)]*allow_credentials\s*=\s*True|allow_credentials\s*=\s*True[^\)]*allow_origins\s*=\s*\[\s*['\"]\*['\"]\s*\])",
                    content,
                    re.DOTALL,
                )
                if fastapi_cors_match:
                    start_char = fastapi_cors_match.start()
                    line_no = content[:start_char].count("\n") + 1
                    fp = compute_finding_fingerprint(
                        vulnerability_class="V10",
                        target_path=rel_path,
                        rule_id="KR-V10-cors-wildcard-credentials",
                    )
                    findings.append(
                        FindingBase(
                            vulnerability_class=VulnerabilityClass.V10,
                            title="FastAPI CORS Allows Wildcard Origin with Credentials",
                            severity=Severity.HIGH,
                            confidence=Confidence.LIKELY,
                            plain_language_explanation=(
                                f"FastAPI CORSMiddleware at {rel_path}:{line_no} combines allow_origins=['*'] "
                                f"with allow_credentials=True. Browsers reject wildcard with credentials, "
                                f"and any dynamic origin reflection exposes authenticated user data to arbitrary domains."
                            ),
                            remediation_advice=(
                                "Replace allow_origins=['*'] with an explicit allowlist of trusted origin URLs."
                            ),
                            fingerprint=fp,
                            location=CodeLocation(
                                file_path=rel_path,
                                start_line=line_no,
                                end_line=line_no,
                                snippet=lines[line_no - 1].strip() if line_no <= len(lines) else "",
                            ),
                            evidence=[
                                Evidence(
                                    layer="static",
                                    description="FastAPI CORSMiddleware configured with allow_origins=['*'] and allow_credentials=True",
                                    code_location=CodeLocation(
                                        file_path=rel_path,
                                        start_line=line_no,
                                        end_line=line_no,
                                    ),
                                )
                            ],
                        )
                    )

            # 3. Flask-CORS with wildcard origin and supports_credentials=True
            if "CORS(" in content and "supports_credentials=True" in content:
                flask_cors_match = re.search(
                    r"CORS\s*\([^\)]*(?:origins\s*=\s*['\"]\*['\"][^\)]*supports_credentials\s*=\s*True|supports_credentials\s*=\s*True[^\)]*origins\s*=\s*['\"]\*['\"])",
                    content,
                    re.DOTALL,
                )
                if flask_cors_match:
                    start_char = flask_cors_match.start()
                    line_no = content[:start_char].count("\n") + 1
                    fp = compute_finding_fingerprint(
                        vulnerability_class="V10",
                        target_path=rel_path,
                        rule_id="KR-V10-cors-wildcard-credentials",
                    )
                    findings.append(
                        FindingBase(
                            vulnerability_class=VulnerabilityClass.V10,
                            title="Flask-CORS Allows Wildcard Origin with Credentials",
                            severity=Severity.HIGH,
                            confidence=Confidence.LIKELY,
                            plain_language_explanation=(
                                f"Flask-CORS setup at {rel_path}:{line_no} specifies wildcard origins with supports_credentials=True."
                            ),
                            remediation_advice=(
                                "Specify explicit trusted origins instead of '*' when credentials are supported."
                            ),
                            fingerprint=fp,
                            location=CodeLocation(
                                file_path=rel_path,
                                start_line=line_no,
                                end_line=line_no,
                                snippet=lines[line_no - 1].strip() if line_no <= len(lines) else "",
                            ),
                            evidence=[
                                Evidence(
                                    layer="static",
                                    description="Flask-CORS with origins='*' and supports_credentials=True",
                                    code_location=CodeLocation(
                                        file_path=rel_path,
                                        start_line=line_no,
                                        end_line=line_no,
                                    ),
                                )
                            ],
                        )
                    )

        return findings
