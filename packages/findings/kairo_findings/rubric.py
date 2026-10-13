"""Deterministic severity rubric for findings (FR-F2)."""

from kairo_findings.models import Confidence, Severity, VulnerabilityClass


BASE_SEVERITY: dict[VulnerabilityClass, Severity] = {
    VulnerabilityClass.V01: Severity.HIGH,         # Missing authentication
    VulnerabilityClass.V02: Severity.HIGH,         # Broken object authorization (IDOR)
    VulnerabilityClass.V03: Severity.HIGH,         # Role tampering / privilege escalation
    VulnerabilityClass.V04: Severity.MEDIUM,       # Client-side only check
    VulnerabilityClass.V05: Severity.HIGH,         # Hardcoded secret
    VulnerabilityClass.V06: Severity.MEDIUM,       # Token misuse
    VulnerabilityClass.V07: Severity.HIGH,         # Weak credential handling
    VulnerabilityClass.V08: Severity.CRITICAL,     # Injection query
    VulnerabilityClass.V09: Severity.MEDIUM,       # Missing rate limit
    VulnerabilityClass.V10: Severity.LOW,          # Permissive CORS
    VulnerabilityClass.V11: Severity.HIGH,         # Missing row-level security
    VulnerabilityClass.V12: Severity.MEDIUM,       # Mass assignment
    VulnerabilityClass.V13: Severity.LOW,          # Debug mode
}


def compute_severity(
    vuln_class: VulnerabilityClass,
    confidence: Confidence,
    has_write_impact: bool = False,
    is_admin_route: bool = False,
) -> Severity:
    """Apply the deterministic severity rubric.
    
    Findings with verified write-impact or affecting admin routes
    are promoted to CRITICAL.
    """
    base = BASE_SEVERITY.get(vuln_class, Severity.MEDIUM)

    if confidence == Confidence.CONFIRMED:
        if vuln_class in (VulnerabilityClass.V01, VulnerabilityClass.V02, VulnerabilityClass.V03):
            if has_write_impact or is_admin_route:
                return Severity.CRITICAL
            return Severity.HIGH
        if vuln_class == VulnerabilityClass.V08:
            return Severity.CRITICAL

    if is_admin_route and base == Severity.HIGH:
        return Severity.CRITICAL

    return base
