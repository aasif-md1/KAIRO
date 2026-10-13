"""Finding merging and deduplication logic across static, logic, and dynamic layers (FR-F1)."""

from typing import Iterable
from kairo_findings.models import Confidence, Evidence, FindingBase, Severity
from kairo_findings.rubric import compute_severity


def merge_layer_findings(findings: Iterable[FindingBase]) -> list[FindingBase]:
    """Merge findings by fingerprint across static, logic review, and dynamic testing layers.

    Rules:
    1. Dynamic testing corroboration upgrades confidence to CONFIRMED.
    2. Logic review findings without dynamic corroboration are capped at LIKELY.
    3. Evidence from all layers is aggregated.
    4. Deterministic severity rubric is applied to merged findings.
    """
    by_fingerprint: dict[str, list[FindingBase]] = {}
    for f in findings:
        by_fingerprint.setdefault(f.fingerprint, []).append(f)

    merged: list[FindingBase] = []

    for fp, group in by_fingerprint.items():
        # Order group: prefer dynamic if available, then logic, then static
        primary = group[0]
        has_dynamic = any(any(e.layer == "dynamic" for e in f.evidence) for f in group)
        has_logic = any(f.is_ai_assisted or any(e.layer == "logic" for e in f.evidence) for f in group)

        # Aggregate evidence
        all_evidence: list[Evidence] = []
        for f in group:
            for ev in f.evidence:
                if ev not in all_evidence:
                    all_evidence.append(ev)

        # Determine final confidence
        if has_dynamic:
            confidence = Confidence.CONFIRMED
        elif has_logic:
            confidence = Confidence.LIKELY
        else:
            confidence = primary.confidence

        # Recompute severity with rubric
        has_write = any(
            ev.request_method in ("POST", "PUT", "PATCH", "DELETE")
            for ev in all_evidence
        )
        is_admin = bool(
            (primary.route_path and "admin" in primary.route_path.lower())
            or (primary.location and primary.location.snippet and "admin" in primary.location.snippet.lower())
        )

        final_severity = compute_severity(
            vuln_class=primary.vulnerability_class,
            confidence=confidence,
            has_write_impact=has_write,
            is_admin_route=is_admin,
        )

        merged_finding = FindingBase(
            vulnerability_class=primary.vulnerability_class,
            title=primary.title,
            severity=final_severity,
            confidence=confidence,
            plain_language_explanation=primary.plain_language_explanation,
            remediation_advice=primary.remediation_advice,
            framework=primary.framework,
            fingerprint=fp,
            location=primary.location,
            route_path=primary.route_path,
            route_method=primary.route_method,
            is_ai_assisted=has_logic,
            evidence=all_evidence,
        )
        merged.append(merged_finding)

    # Sort deterministically: Critical -> High -> Medium -> Low -> Informational, then route path
    severity_order = {
        Severity.CRITICAL: 0,
        Severity.HIGH: 1,
        Severity.MEDIUM: 2,
        Severity.LOW: 3,
        Severity.INFORMATIONAL: 4,
    }
    merged.sort(key=lambda x: (severity_order[x.severity], x.route_path or "", x.fingerprint))
    return merged
