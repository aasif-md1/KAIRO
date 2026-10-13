"""Analyzer for V01: Missing Authentication on Sensitive/State-Changing Routes."""

from typing import List
from kairo_analysis.models import RouteInventoryRecord, ThreeValuedSignal
from kairo_findings.models import (
    Confidence,
    FindingBase,
    Severity,
    VulnerabilityClass,
    CodeLocation,
    Evidence,
)
from kairo_findings.fingerprint import compute_finding_fingerprint

STATE_CHANGING_METHODS = {"POST", "PUT", "PATCH", "DELETE"}


class RouteWithoutAuthAnalyzer:
    """Detects state-changing endpoints without authentication checks (V01)."""

    def analyze(self, routes: List[RouteInventoryRecord]) -> List[FindingBase]:
        findings: List[FindingBase] = []

        for route in routes:
            # Check state-changing routes where auth is absent or unknown
            if route.method in STATE_CHANGING_METHODS:
                if route.authentication != ThreeValuedSignal.DETECTED:
                    confidence = (
                        Confidence.LIKELY
                        if route.authentication == ThreeValuedSignal.ABSENT
                        else Confidence.POSSIBLE
                    )

                    fp = compute_finding_fingerprint(
                        vulnerability_class="V01",
                        target_path=route.path,
                        method=route.method,
                        rule_id="KR-V01-open-write-route",
                    )

                    expl = (
                        f"The route '{route.method} {route.path}' modifies application state or data, "
                        f"but no authentication middleware or session check was detected. "
                        f"Unauthenticated callers could trigger this endpoint."
                    )
                    fix = (
                        f"Attach authentication middleware or dependency to '{route.method} {route.path}'. "
                        f"Ensure unauthenticated requests are rejected with HTTP 401 Unauthorized."
                    )

                    evidence = Evidence(
                        layer="static",
                        description=f"Route extracted with authentication={route.authentication.value}. Evidence: {route.auth_evidence or 'None'}",
                        code_location=CodeLocation(
                            file_path=route.handler_file,
                            start_line=route.start_line,
                            end_line=route.end_line,
                        ),
                    )

                    finding = FindingBase(
                        vulnerability_class=VulnerabilityClass.V01,
                        title=f"State-Changing Route Without Authentication ({route.method} {route.path})",
                        severity=Severity.HIGH,
                        confidence=confidence,
                        plain_language_explanation=expl,
                        remediation_advice=fix,
                        framework=route.framework.value,
                        fingerprint=fp,
                        location=CodeLocation(
                            file_path=route.handler_file,
                            start_line=route.start_line,
                            end_line=route.end_line,
                        ),
                        route_path=route.path,
                        route_method=route.method,
                        evidence=[evidence],
                    )
                    findings.append(finding)

        return findings
