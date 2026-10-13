"""Analyzer for V05: Hardcoded Secrets and Exposed Credential Files (TRD Section 7)."""

import hashlib
import math
import re
from pathlib import Path
from typing import List, Optional
from kairo_findings.models import (
    Confidence,
    FindingBase,
    Severity,
    VulnerabilityClass,
    CodeLocation,
    Evidence,
)
from kairo_findings.fingerprint import compute_finding_fingerprint

# Common secret regex patterns
SECRET_PATTERNS = [
    (r"AKIA[0-9A-Z]{16}", "AWS Access Key ID"),
    (r"-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----", "Private Key Header"),
    (r"(?:postgres|mysql|mongodb(?:\+srv)?):\/\/[^\s:]+:([^\s@]+)@", "Database URL with embedded password"),
    (r"(?:api[_-]?key|secret[_-]?key|auth[_-]?token|jwt[_-]?secret)\s*[:=]\s*['\"]([a-zA-Z0-9_\-\.]{16,})['\"]", "High-entropy API/Secret Key"),
    (r"ghp_[a-zA-Z0-9]{36}", "GitHub Personal Access Token"),
    (r"xox[baprs]-[0-9a-zA-Z]{10,48}", "Slack API Token"),
    (r"stripe_secret_[0-9a-zA-Z]{24,}", "Stripe Secret Key"),
]


def shannon_entropy(data: str) -> float:
    """Calculate the Shannon entropy of a string."""
    if not data:
        return 0.0
    entropy = 0.0
    length = len(data)
    for c in set(data):
        prob = data.count(c) / length
        entropy -= prob * math.log2(prob)
    return entropy


def mask_secret(secret: str) -> str:
    """Obfuscate secret per TRD Section 7: first 2 and last 2 characters + salted hash."""
    if len(secret) <= 4:
        return "****"
    first_two = secret[:2]
    last_two = secret[-2:]
    salt = "kairo_salt"
    token_hash = hashlib.sha256(f"{secret}:{salt}".encode("utf-8")).hexdigest()[:8]
    return f"{first_two}...{last_two} (hash:{token_hash})"


class SecretsAnalyzer:
    """Detects hardcoded secrets, committed .env files, and client-exposed tokens (V05)."""

    def analyze(self, project_root: Path) -> List[FindingBase]:
        findings: List[FindingBase] = []

        # 1. Check for committed .env files (committed credentials)
        for env_file in project_root.rglob(".env*"):
            if ".env.example" in env_file.name or ".env.sample" in env_file.name:
                continue
            if any(p in env_file.parts for p in ["node_modules", ".git", ".venv"]):
                continue

            rel_file = str(env_file.relative_to(project_root)).replace("\\", "/")
            fp = compute_finding_fingerprint(
                vulnerability_class="V05",
                target_path=rel_file,
                rule_id="KR-V05-committed-env",
            )
            findings.append(
                FindingBase(
                    vulnerability_class=VulnerabilityClass.V05,
                    title=f"Committed Environment File ({rel_file})",
                    severity=Severity.HIGH,
                    confidence=Confidence.LIKELY,
                    plain_language_explanation=(
                        f"An environment configuration file '{rel_file}' is present in the repository. "
                        f"Committing active environment files risks exposing sensitive database passwords and API keys."
                    ),
                    remediation_advice=(
                        f"Add '{rel_file}' to .gitignore and rotate any credentials stored within it. "
                        f"Provide a placeholder '.env.example' instead."
                    ),
                    fingerprint=fp,
                    location=CodeLocation(file_path=rel_file, start_line=1, end_line=1),
                    evidence=[
                        Evidence(
                            layer="static",
                            description=f"Environment file {rel_file} detected in project root",
                            code_location=CodeLocation(file_path=rel_file, start_line=1, end_line=1),
                        )
                    ],
                )
            )

        # 2. Check source files for hardcoded secrets
        scannable_exts = {".py", ".js", ".ts", ".tsx", ".jsx", ".json", ".yaml", ".yml", ".env"}
        for file_path in project_root.rglob("*"):
            if not file_path.is_file() or file_path.suffix.lower() not in scannable_exts:
                continue
            if any(p in file_path.parts for p in ["node_modules", ".git", ".venv", "dist", "build", ".next"]):
                continue
            if file_path.stat().st_size > 1_000_000:
                continue

            rel_path = str(file_path.relative_to(project_root)).replace("\\", "/")
            try:
                lines = file_path.read_text(encoding="utf-8", errors="replace").splitlines()
            except Exception:
                continue

            for idx, line in enumerate(lines, start=1):
                # Ignore comment lines that state examples
                if line.strip().startswith(("#", "//", "/*", "*")) and "example" in line.lower():
                    continue

                for pat, label in SECRET_PATTERNS:
                    match = re.search(pat, line, re.IGNORECASE)
                    if match:
                        matched_str = match.group(1) if match.groups() else match.group(0)
                        # Check entropy or key length
                        if len(matched_str) >= 16 and shannon_entropy(matched_str) > 3.0:
                            masked = mask_secret(matched_str)
                            fp = compute_finding_fingerprint(
                                vulnerability_class="V05",
                                target_path=rel_path,
                                rule_id="KR-V05-hardcoded-secret",
                                symbol_name=label,
                            )
                            findings.append(
                                FindingBase(
                                    vulnerability_class=VulnerabilityClass.V05,
                                    title=f"Hardcoded {label} in Source Code",
                                    severity=Severity.CRITICAL,
                                    confidence=Confidence.LIKELY,
                                    plain_language_explanation=(
                                        f"A potential hardcoded credential matching pattern '{label}' "
                                        f"was found in {rel_path}:{idx}. Value: {masked}."
                                    ),
                                    remediation_advice=(
                                        "Extract the secret into an environment variable and load it at runtime. "
                                        "Immediately rotate the exposed credential."
                                    ),
                                    fingerprint=fp,
                                    location=CodeLocation(
                                        file_path=rel_path,
                                        start_line=idx,
                                        end_line=idx,
                                        snippet=line.strip(),
                                    ),
                                    evidence=[
                                        Evidence(
                                            layer="static",
                                            description=f"Pattern '{label}' matched on line {idx}: {masked}",
                                            code_location=CodeLocation(
                                                file_path=rel_path, start_line=idx, end_line=idx, snippet=line.strip()
                                            ),
                                        )
                                    ],
                                )
                            )
                            break  # one secret per line

        return findings
