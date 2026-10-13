"""Analyzer for V06: Token and Session Misuse (JWT none, unverified signatures, weak secrets)."""

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

WEAK_JWT_SECRETS = {"secret", "123456", "jwtsecret", "password", "mysecret", "test", "admin"}


class TokenMisuseAnalyzer:
    """Detects insecure JWT handling and token validation bypasses (V06)."""

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

            # 1. JWT 'none' algorithm accepted
            if re.search(r"algorithms\s*=\s*\[.*['\"]none['\"].*\]", content, re.IGNORECASE) or \
               re.search(r"algorithm\s*=\s*['\"]none['\"]", content, re.IGNORECASE):
                for idx, line in enumerate(lines, start=1):
                    if re.search(r"['\"]none['\"]", line, re.IGNORECASE) and "jwt" in line.lower():
                        fp = compute_finding_fingerprint(
                            vulnerability_class="V06",
                            target_path=rel_path,
                            rule_id="KR-V06-jwt-none-algorithm",
                        )
                        findings.append(
                            FindingBase(
                                vulnerability_class=VulnerabilityClass.V06,
                                title="Insecure JWT 'none' Algorithm Allowed",
                                severity=Severity.HIGH,
                                confidence=Confidence.LIKELY,
                                plain_language_explanation=(
                                    f"The application explicitly permits the 'none' algorithm in JWT decoding ({rel_path}:{idx}). "
                                    f"Attackers can forge arbitrary valid tokens by omitting the signature."
                                ),
                                remediation_advice=(
                                    "Disallow the 'none' algorithm. Explicitly whitelist only secure algorithms like HS256 or RS256."
                                ),
                                fingerprint=fp,
                                location=CodeLocation(file_path=rel_path, start_line=idx, end_line=idx, snippet=line.strip()),
                                evidence=[
                                    Evidence(
                                        layer="static",
                                        description=f"JWT decoder allows 'none' algorithm at line {idx}",
                                        code_location=CodeLocation(file_path=rel_path, start_line=idx, end_line=idx, snippet=line.strip()),
                                    )
                                ],
                            )
                        )
                        break

            # 2. JWT unverified decoding (e.g. verify=False or verify_signature=False)
            unverified_match = re.search(r"(?:verify\s*=\s*False|verify_signature\s*:\s*False|options\s*=\s*\{['\"]verify_signature['\"]\s*:\s*False\})", content)
            if unverified_match:
                for idx, line in enumerate(lines, start=1):
                    if "verify" in line and ("False" in line or "false" in line):
                        fp = compute_finding_fingerprint(
                            vulnerability_class="V06",
                            target_path=rel_path,
                            rule_id="KR-V06-jwt-unverified",
                        )
                        findings.append(
                            FindingBase(
                                vulnerability_class=VulnerabilityClass.V06,
                                title="Unverified JWT Token Signature",
                                severity=Severity.CRITICAL,
                                confidence=Confidence.LIKELY,
                                plain_language_explanation=(
                                    f"JWT token is decoded with signature verification disabled in {rel_path}:{idx}. "
                                    f"Any unsigned or tampered token will be accepted as authentic."
                                ),
                                remediation_advice="Enable cryptographic signature verification when decoding tokens.",
                                fingerprint=fp,
                                location=CodeLocation(file_path=rel_path, start_line=idx, end_line=idx, snippet=line.strip()),
                                evidence=[
                                    Evidence(
                                        layer="static",
                                        description=f"Signature verification disabled at line {idx}",
                                        code_location=CodeLocation(file_path=rel_path, start_line=idx, end_line=idx, snippet=line.strip()),
                                    )
                                ],
                            )
                        )
                        break

            # 3. Weak hardcoded JWT secret
            for idx, line in enumerate(lines, start=1):
                secret_match = re.search(r"(?:jwt\.sign|jwt\.decode|jwt\.encode)\s*\(.*?['\"]([^'\"]+)['\"]", line, re.IGNORECASE)
                if secret_match:
                    sec = secret_match.group(1).lower()
                    if sec in WEAK_JWT_SECRETS:
                        fp = compute_finding_fingerprint(
                            vulnerability_class="V06",
                            target_path=rel_path,
                            rule_id="KR-V06-weak-jwt-secret",
                            symbol_name=sec,
                        )
                        findings.append(
                            FindingBase(
                                vulnerability_class=VulnerabilityClass.V06,
                                title=f"Trivially Guessable JWT Secret ('{sec}')",
                                severity=Severity.HIGH,
                                confidence=Confidence.LIKELY,
                                plain_language_explanation=(
                                    f"A hardcoded, weak JWT signing secret '{sec}' is used in {rel_path}:{idx}. "
                                    f"Attackers can easily brute-force the secret and sign arbitrary tokens."
                                ),
                                remediation_advice="Use an unpredictable 256-bit secret loaded from an environment variable.",
                                fingerprint=fp,
                                location=CodeLocation(file_path=rel_path, start_line=idx, end_line=idx, snippet=line.strip()),
                                evidence=[
                                    Evidence(
                                        layer="static",
                                        description=f"Weak secret detected at line {idx}",
                                        code_location=CodeLocation(file_path=rel_path, start_line=idx, end_line=idx, snippet=line.strip()),
                                    )
                                ],
                            )
                        )

        return findings
