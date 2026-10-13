"""Static Analysis Engine orchestrator for KAIRO (TRD Section 7)."""

from pathlib import Path
from typing import List, Optional
from kairo_analysis.models import (
    FrameworkType,
    RouteInventoryRecord,
    StaticAnalysisResult,
)
from kairo_analysis.parser import MultiLanguageParser
from kairo_analysis.stack_detector import detect_stack
from kairo_analysis.extractors.express import ExpressRouteExtractor
from kairo_analysis.extractors.nextjs import NextjsRouteExtractor
from kairo_analysis.extractors.fastapi import FastapiRouteExtractor
from kairo_analysis.extractors.flask import FlaskRouteExtractor
from kairo_analysis.analyzers.route_without_auth import RouteWithoutAuthAnalyzer
from kairo_analysis.analyzers.secrets import SecretsAnalyzer
from kairo_analysis.analyzers.token_misuse import TokenMisuseAnalyzer
from kairo_analysis.analyzers.weak_credentials import WeakCredentialsAnalyzer
from kairo_analysis.analyzers.sqli import SqliAnalyzer
from kairo_analysis.analyzers.cors import CorsAnalyzer
from kairo_analysis.analyzers.debug_mode import DebugModeAnalyzer
from kairo_findings.models import FindingBase

DEFAULT_IGNORE_DIRS = {
    "node_modules",
    ".git",
    ".venv",
    "venv",
    "dist",
    "build",
    ".next",
    "__pycache__",
    ".turbo",
    ".pytest_cache",
}

MAX_FILE_SIZE_BYTES = 1_000_000  # 1 MB limit (TRD Section 7)
MAX_FILES_PER_SCAN = 20_000


class StaticAnalysisEngine:
    """Orchestrates file discovery, stack detection, route extraction, and static analyzers."""

    def __init__(self, parser: Optional[MultiLanguageParser] = None):
        self.parser = parser or MultiLanguageParser()

    def discover_files(
        self,
        project_root: Path,
        user_ignore_patterns: Optional[List[str]] = None,
    ) -> List[Path]:
        """Discover eligible source files honoring default and user ignore patterns and limits."""
        files: List[Path] = []
        user_ignores = set(user_ignore_patterns or [])

        for path in project_root.rglob("*"):
            if len(files) >= MAX_FILES_PER_SCAN:
                break
            if not path.is_file():
                continue

            # Check ignore directories
            if any(part in DEFAULT_IGNORE_DIRS for part in path.parts):
                continue
            if any(ign in str(path) for ign in user_ignores):
                continue

            # Check size limit
            try:
                if path.stat().st_size > MAX_FILE_SIZE_BYTES:
                    continue
            except Exception:
                continue

            files.append(path)

        return sorted(files)

    def extract_inventory(
        self, project_root: Path, framework: FrameworkType
    ) -> List[RouteInventoryRecord]:
        """Extract route inventory based on detected framework."""
        routes: List[RouteInventoryRecord] = []

        if framework == FrameworkType.EXPRESS:
            routes.extend(ExpressRouteExtractor(self.parser).extract_routes(project_root))
        elif framework == FrameworkType.NEXTJS:
            routes.extend(NextjsRouteExtractor(self.parser).extract_routes(project_root))
        elif framework == FrameworkType.FASTAPI:
            routes.extend(FastapiRouteExtractor(self.parser).extract_routes(project_root))
        elif framework == FrameworkType.FLASK:
            routes.extend(FlaskRouteExtractor(self.parser).extract_routes(project_root))
        else:
            # Unknown framework: attempt multi-extractor discovery across candidate files
            routes.extend(FastapiRouteExtractor(self.parser).extract_routes(project_root))
            routes.extend(FlaskRouteExtractor(self.parser).extract_routes(project_root))
            routes.extend(ExpressRouteExtractor(self.parser).extract_routes(project_root))
            routes.extend(NextjsRouteExtractor(self.parser).extract_routes(project_root))

        # Sort routes deterministically by path, method, and handler file
        routes.sort(key=lambda r: (r.path, r.method, r.handler_file))
        return routes

    def analyze(
        self,
        project_root: Path,
        forced_framework: Optional[FrameworkType] = None,
        user_ignore_patterns: Optional[List[str]] = None,
    ) -> StaticAnalysisResult:
        """Run complete static analysis pipeline."""
        files = self.discover_files(project_root, user_ignore_patterns)

        # Framework detection
        if forced_framework and forced_framework != FrameworkType.UNKNOWN:
            framework = forced_framework
        else:
            framework, _ = detect_stack(project_root)

        # Route inventory extraction
        routes = self.extract_inventory(project_root, framework)

        # Static analyzers
        findings: List[FindingBase] = []

        # V01: Missing auth on sensitive / state-changing routes
        findings.extend(RouteWithoutAuthAnalyzer().analyze(routes))

        # V05: Hardcoded secrets and exposed .env files
        findings.extend(SecretsAnalyzer().analyze(project_root))

        # V06: JWT and token misuse
        findings.extend(TokenMisuseAnalyzer().analyze(project_root))

        # V07: Weak credentials (hashes, insecure cookies)
        findings.extend(WeakCredentialsAnalyzer().analyze(project_root))

        # V08: SQL injection via string concatenation / interpolation
        findings.extend(SqliAnalyzer().analyze(project_root))

        # V10: Permissive CORS
        findings.extend(CorsAnalyzer().analyze(project_root))

        # V13: Debug mode in production
        findings.extend(DebugModeAnalyzer().analyze(project_root))

        # Deterministic sorting of findings (FR-F3)
        findings.sort(
            key=lambda f: (
                f.vulnerability_class.value,
                f.fingerprint,
                f.location.file_path if f.location else "",
                f.location.start_line if f.location else 0,
            )
        )

        return StaticAnalysisResult(
            framework=framework,
            scanned_files_count=len(files),
            routes=routes,
            findings=findings,
        )
