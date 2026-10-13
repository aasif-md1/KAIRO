"""Finding domain models, enums, and schemas for KAIRO."""

from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class Severity(str, Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"
    INFORMATIONAL = "Informational"


class Confidence(str, Enum):
    CONFIRMED = "Confirmed"  # Corroborated by dynamic sandbox test
    LIKELY = "Likely"        # High static confidence or logic review with cited lines
    POSSIBLE = "Possible"    # Static heuristic without dynamic proof


class FindingStatus(str, Enum):
    OPEN = "open"
    FIXED = "fixed"
    DISMISSED = "dismissed"


class VulnerabilityClass(str, Enum):
    V01 = "V01"  # Missing authentication
    V02 = "V02"  # Broken object-level authorization (IDOR)
    V03 = "V03"  # Role tampering and privilege escalation
    V04 = "V04"  # Client-side-only access control
    V05 = "V05"  # Hardcoded secrets
    V06 = "V06"  # Token misuse
    V07 = "V07"  # Weak credential handling
    V08 = "V08"  # Injection through string-built queries
    V09 = "V09"  # Missing rate limiting
    V10 = "V10"  # Permissive CORS
    V11 = "V11"  # Missing row-level security / tenant isolation
    V12 = "V12"  # Mass assignment
    V13 = "V13"  # Debug mode in production


VULNERABILITY_TITLES = {
    VulnerabilityClass.V01: "Missing Authentication on Sensitive Route",
    VulnerabilityClass.V02: "Cross-Account Object Access (IDOR)",
    VulnerabilityClass.V03: "Privilege Escalation via Role Tampering",
    VulnerabilityClass.V04: "Client-Side-Only Access Control",
    VulnerabilityClass.V05: "Hardcoded Secret or Credential",
    VulnerabilityClass.V06: "Insecure Token or Session Handling",
    VulnerabilityClass.V07: "Weak Credential Storage or Hashing",
    VulnerabilityClass.V08: "Query Injection via String Concatenation",
    VulnerabilityClass.V09: "Missing Rate Limiting on Sensitive Endpoint",
    VulnerabilityClass.V10: "Permissive Cross-Origin Resource Sharing (CORS)",
    VulnerabilityClass.V11: "Missing Row-Level Security / Tenant Isolation",
    VulnerabilityClass.V12: "Mass Assignment Vulnerability",
    VulnerabilityClass.V13: "Debug Mode or Verbose Error Output Enabled",
}


class CodeLocation(BaseModel):
    file_path: str
    start_line: int
    end_line: int
    snippet: Optional[str] = None


class Evidence(BaseModel):
    layer: str  # "static", "logic", "dynamic"
    description: str
    request_method: Optional[str] = None
    request_url: Optional[str] = None
    request_headers: Optional[dict[str, str]] = None
    request_body: Optional[str] = None
    response_status: Optional[int] = None
    response_body: Optional[str] = None
    code_location: Optional[CodeLocation] = None
    created_at: Optional[str] = None


class FindingBase(BaseModel):
    vulnerability_class: VulnerabilityClass
    title: str
    severity: Severity
    confidence: Confidence
    plain_language_explanation: str
    remediation_advice: str
    framework: Optional[str] = None
    fingerprint: str
    location: Optional[CodeLocation] = None
    route_path: Optional[str] = None
    route_method: Optional[str] = None
    is_ai_assisted: bool = False
    evidence: list[Evidence] = Field(default_factory=list)


class Finding(FindingBase):
    id: str
    project_id: str
    scan_id: str
    status: FindingStatus = FindingStatus.OPEN
    dismissal_reason: Optional[str] = None
    first_seen_scan_id: str
    last_seen_scan_id: str
