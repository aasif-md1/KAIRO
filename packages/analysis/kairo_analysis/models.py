"""Data models for KAIRO static engine and route inventory (TRD Section 7)."""

from __future__ import annotations

from enum import Enum
from typing import Any, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ThreeValuedSignal(str, Enum):
    DETECTED = "detected"
    ABSENT = "absent"
    UNKNOWN = "unknown"


class FrameworkType(str, Enum):
    EXPRESS = "express"
    NEXTJS = "nextjs"
    FASTAPI = "fastapi"
    FLASK = "flask"
    UNKNOWN = "unknown"


class RouteInventoryRecord(BaseModel):
    """Normalized route inventory record as specified in TRD Section 7."""

    id: str = Field(description="Stable key: framework:METHOD:/normalized/path")
    method: str = Field(description="HTTP method in uppercase, e.g. GET, POST")
    path: str = Field(description="Normalized path with parameters, e.g. /invoices/:id")
    framework: FrameworkType = Field(description="Detected framework type")
    handler_file: str = Field(description="Relative path to file defining handler")
    handler_name: str = Field(description="Name of the handler function or method")
    start_line: int = Field(description="Start line number in source file")
    end_line: int = Field(description="End line number in source file")
    middleware: List[str] = Field(default_factory=list, description="Ordered middleware chain or dependencies")
    authentication: ThreeValuedSignal = Field(
        default=ThreeValuedSignal.ABSENT,
        description="detected, absent, or unknown",
    )
    auth_evidence: str = Field(default="", description="Reasoning or code slice establishing auth signal")
    ownership_check: ThreeValuedSignal = Field(
        default=ThreeValuedSignal.ABSENT,
        description="detected, absent, or unknown",
    )
    ownership_evidence: str = Field(default="", description="Reasoning establishing ownership check")
    role_check: ThreeValuedSignal = Field(
        default=ThreeValuedSignal.ABSENT,
        description="detected, absent, or unknown",
    )
    role_evidence: str = Field(default="", description="Reasoning establishing role check")
    identifier_parameters: List[str] = Field(
        default_factory=list,
        description="Parameters looking like record identifiers, e.g. id, userId",
    )
    data_access: List[str] = Field(
        default_factory=list,
        description="Models, tables or operations read/written in handler",
    )
    uploads: bool = Field(default=False, description="Whether handler accepts file uploads")


class RuleDefinition(BaseModel):
    """YAML rule specification format (TRD Section 7)."""

    id: str
    rule_class: str = Field(alias="class")
    title: str
    severity: str
    languages: List[str]
    frameworks: List[str]
    analyzer: str
    applies_to: Optional[dict[str, Any]] = None
    message: str
    remediation: str
    cwe: List[str] = Field(default_factory=list)
    tests: Optional[dict[str, List[str]]] = None

    model_config = ConfigDict(populate_by_name=True)


class StaticAnalysisResult(BaseModel):
    """Composite output of static engine."""

    framework: FrameworkType
    scanned_files_count: int
    routes: List[RouteInventoryRecord] = Field(default_factory=list)
    findings: List[Any] = Field(default_factory=list)
