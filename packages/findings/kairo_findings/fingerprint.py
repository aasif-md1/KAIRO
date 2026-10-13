"""Stable finding fingerprinting algorithm (FR-F1, FR-F3).

Fingerprints survive re-scans and line number shifts by using:
1. Vulnerability class (e.g. V01, V02)
2. Normalized route path or relative file path
3. HTTP method (if route-scoped) or AST symbol / rule ID
"""

import hashlib
from typing import Optional


def compute_finding_fingerprint(
    vulnerability_class: str,
    target_path: str,
    method: Optional[str] = None,
    rule_id: Optional[str] = None,
    symbol_name: Optional[str] = None,
) -> str:
    """Compute a deterministic, stable fingerprint hash for a finding.
    
    Line numbers are intentionally excluded so edits that shift lines
    do not create duplicate findings.
    """
    normalized_path = target_path.strip().replace("\\", "/").lower()
    norm_method = (method or "").strip().upper()
    norm_rule = (rule_id or "").strip().lower()
    norm_symbol = (symbol_name or "").strip()

    raw = f"{vulnerability_class}:{norm_method}:{normalized_path}:{norm_rule}:{norm_symbol}"
    digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    return f"fp_{digest[:16]}"
