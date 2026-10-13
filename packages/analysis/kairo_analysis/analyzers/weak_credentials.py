"""Analyzer for V07: Weak Credential Storage, Insecure Hashing, and Insecure Cookies."""

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

# Weak hashing signatures
WEAK_HASH_PATTERNS = [
    (r"hashlib\.(?:md5|sha1)\s*\(", "Python hashlib MD5/SHA1 usage for hashing"),
    (r"crypto\.createHash\s*\(\s*['\"](?:md5|sha1)['\"]\s*\)", "Node.js crypto MD5/SHA1 usage"),
    (r"(?:^|[^\w])md5\s*\(\s*(?:password|passwd|pwd|cred|token|secret)", "Unsalted MD5 call on sensitive credential"),
    (r"(?:^|[^\w])sha1\s*\(\s*(?:password|passwd|pwd|cred|token|secret)", "Unsalted SHA1 call on sensitive credential"),
]

# Insecure cookie patterns
INSECURE_COOKIE_PATTERNS = [
    (r"httpOnly\s*:\s*false", "Explicitly disabled httpOnly cookie flag in JS/TS"),
    (r"httponly\s*=\s*False", "Explicitly disabled httponly cookie flag in Python"),
    (r"SESSION_COOKIE_HTTPONLY\s*=\s*False", "Flask session cookie HTTPONLY disabled"),
    (r"SESSION_COOKIE_SECURE\s*=\s*False", "Flask session cookie SECURE disabled"),
]


class WeakCredentialsAnalyzer:
    """Detects weak cryptographic hashing algorithms and insecure cookie configurations (V07)."""

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

            # 1. Weak cryptographic hash detection (MD5 / SHA1)
            for idx, line in enumerate(lines, start=1):
                stripped = line.strip()
                if stripped.startswith("//") or stripped.startswith("#"):
                    continue

                for pat, desc in WEAK_HASH_PATTERNS:
                    if re.search(pat, line, re.IGNORECASE):
                        # Verify context mentions credentials, passwords, or authentication
                        # or direct usage of hashlib.md5/sha1 in auth files or general code
                        fp = compute_finding_fingerprint(
                            vulnerability_class="V07",
                            target_path=rel_path,
                            rule_id="KR-V07-weak-hash-algorithm",
                        )
                        findings.append(
                            FindingBase(
                                vulnerability_class=VulnerabilityClass.V07,
                                title="Weak Cryptographic Hash Algorithm (MD5/SHA1)",
                                severity=Severity.HIGH,
                                confidence=Confidence.LIKELY,
                                plain_language_explanation=(
                                    f"Detected deprecated or collision-prone hashing algorithm at {rel_path}:{idx}. "
                                    f"MD5 and SHA-1 are cryptographically broken and vulnerable to collision and rainbow table attacks. "
                                    f"Never use them for password storage or integrity-sensitive authentication."
                                ),
                                remediation_advice=(
                                    "Upgrade to a modern password hashing algorithm like Argon2id or bcrypt (or SHA-256 / SHA-3 for non-password integrity hashes)."
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

            # 2. Insecure cookie flag detection
            for idx, line in enumerate(lines, start=1):
                stripped = line.strip()
                if stripped.startswith("//") or stripped.startswith("#"):
                    continue

                for pat, desc in INSECURE_COOKIE_PATTERNS:
                    if re.search(pat, line):
                        fp = compute_finding_fingerprint(
                            vulnerability_class="V07",
                            target_path=rel_path,
                            rule_id="KR-V07-insecure-cookie-flags",
                        )
                        findings.append(
                            FindingBase(
                                vulnerability_class=VulnerabilityClass.V07,
                                title="Insecure Cookie Attributes (Missing HttpOnly / Secure)",
                                severity=Severity.MEDIUM,
                                confidence=Confidence.LIKELY,
                                plain_language_explanation=(
                                    f"Sensitive cookie configuration at {rel_path}:{idx} has security flags disabled ({stripped}). "
                                    f"Cookies without HttpOnly can be accessed by malicious client scripts (XSS session hijacking), "
                                    f"and cookies without Secure can be intercepted over unencrypted channels."
                                ),
                                remediation_advice=(
                                    "Set 'httpOnly: true' (or 'httponly=True') and 'secure: true' (or 'secure=True') on all session and authentication cookies."
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
