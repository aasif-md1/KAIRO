"""Tests for Milestone 1 (Static Engine) - Gate 1 Validation.

Exit Criteria (PRD Section 18 / TRD Section 16):
- Each Release 1 static rule has a passing vulnerable and safe test.
- Route inventory produces correct output for Express, Next.js, FastAPI, and Flask.
- Fingerprints are deterministic and stable across scans.
- Parser tolerates syntax errors without crashing.
"""

import shutil
import tempfile
from pathlib import Path
import pytest

from kairo_analysis import (
    StaticAnalysisEngine,
    FrameworkType,
    ThreeValuedSignal,
)
from kairo_analysis.parser import MultiLanguageParser
from kairo_rules import load_all_rules, load_rule_from_file


def test_all_rules_load_and_validate():
    """Verify that all YAML rules load and comply with RuleDefinition schema."""
    rules = load_all_rules()
    assert len(rules) >= 7

    expected_ids = {
        "KR-V01-open-write-route",
        "KR-V05-hardcoded-secret",
        "KR-V06-token-misuse",
        "KR-V07-weak-credentials",
        "KR-V08-sql-injection",
        "KR-V10-permissive-cors",
        "KR-V13-debug-mode",
    }
    loaded_ids = {r.id for r in rules}
    assert expected_ids.issubset(loaded_ids), f"Missing rules: {expected_ids - loaded_ids}"

    for rule in rules:
        assert rule.rule_class.startswith("V")
        assert len(rule.languages) > 0
        assert len(rule.frameworks) > 0
        assert rule.tests is not None
        assert "vulnerable" in rule.tests and len(rule.tests["vulnerable"]) > 0
        assert "safe" in rule.tests and len(rule.tests["safe"]) > 0


@pytest.mark.parametrize(
    "rule_id,expected_class",
    [
        ("KR-V01-open-write-route", "V01"),
        ("KR-V05-hardcoded-secret", "V05"),
        ("KR-V06-token-misuse", "V06"),
        ("KR-V07-weak-credentials", "V07"),
        ("KR-V08-sql-injection", "V08"),
        ("KR-V10-permissive-cors", "V10"),
        ("KR-V13-debug-mode", "V13"),
    ],
)
def test_rule_fixtures_vulnerable_and_safe(rule_id: str, expected_class: str):
    """Gate 1: Each Release 1 static rule has a passing vulnerable and safe test."""
    rules_dir = Path("packages/rules/rules")
    rule = load_rule_from_file(rules_dir / f"{rule_id}.yaml")
    engine = StaticAnalysisEngine()

    # 1. Test vulnerable fixture: MUST trigger rule
    for vuln_rel in rule.tests["vulnerable"]:
        vuln_src = Path("packages/rules") / vuln_rel
        assert vuln_src.exists(), f"Vulnerable fixture missing: {vuln_src}"

        with tempfile.TemporaryDirectory() as tmpdir:
            dest = Path(tmpdir) / vuln_src.name
            shutil.copy(vuln_src, dest)
            result = engine.analyze(Path(tmpdir))

            matching = [
                f for f in result.findings if f.vulnerability_class.value == expected_class
            ]
            assert len(matching) > 0, (
                f"Rule {rule_id} did not detect flaw in vulnerable fixture {vuln_rel}. "
                f"Findings returned: {[f.title for f in result.findings]}"
            )

    # 2. Test safe fixture: MUST NOT trigger rule (no false positive)
    for safe_rel in rule.tests["safe"]:
        safe_src = Path("packages/rules") / safe_rel
        assert safe_src.exists(), f"Safe fixture missing: {safe_src}"

        with tempfile.TemporaryDirectory() as tmpdir:
            dest = Path(tmpdir) / safe_src.name
            shutil.copy(safe_src, dest)
            result = engine.analyze(Path(tmpdir))

            matching = [
                f for f in result.findings if f.vulnerability_class.value == expected_class
            ]
            assert len(matching) == 0, (
                f"Rule {rule_id} falsely triggered on safe fixture {safe_rel}: "
                f"{[f.title for f in matching]}"
            )


def test_express_route_inventory():
    """Verify Express route inventory extraction with auth and parameters."""
    engine = StaticAnalysisEngine()
    with tempfile.TemporaryDirectory() as tmpdir:
        express_code = """
        const express = require('express');
        const router = express.Router();

        function authenticate(req, res, next) { next(); }

        router.get('/users/:userId', authenticate, (req, res) => {
            const user = findUser(req.params.userId);
            res.json(user);
        });

        router.post('/orders', (req, res) => {
            res.json({ ok: true });
        });
        """
        code_file = Path(tmpdir) / "routes.js"
        code_file.write_text(express_code, encoding="utf-8")

        result = engine.analyze(Path(tmpdir), forced_framework=FrameworkType.EXPRESS)
        assert len(result.routes) == 2

        get_route = next(r for r in result.routes if r.method == "GET")
        assert get_route.path == "/users/:userId"
        assert get_route.authentication == ThreeValuedSignal.DETECTED
        assert "userId" in get_route.identifier_parameters

        post_route = next(r for r in result.routes if r.method == "POST")
        assert post_route.path == "/orders"
        assert post_route.authentication == ThreeValuedSignal.ABSENT


def test_fastapi_route_inventory():
    """Verify FastAPI route inventory extraction with Depends and path params."""
    engine = StaticAnalysisEngine()
    with tempfile.TemporaryDirectory() as tmpdir:
        fastapi_code = """
        from fastapi import FastAPI, Depends, HTTPException

        app = FastAPI()

        async def get_current_user():
            return {"user_id": 1}

        @app.get("/items/{item_id}")
        async def read_item(item_id: int, current_user=Depends(get_current_user)):
            return {"item_id": item_id}

        @app.delete("/items/{item_id}")
        async def delete_item(item_id: int):
            return {"deleted": True}
        """
        code_file = Path(tmpdir) / "main.py"
        code_file.write_text(fastapi_code, encoding="utf-8")

        result = engine.analyze(Path(tmpdir), forced_framework=FrameworkType.FASTAPI)
        assert len(result.routes) == 2

        get_route = next(r for r in result.routes if r.method == "GET")
        assert get_route.path == "/items/:item_id"
        assert get_route.authentication == ThreeValuedSignal.DETECTED

        del_route = next(r for r in result.routes if r.method == "DELETE")
        assert del_route.path == "/items/:item_id"
        assert del_route.authentication == ThreeValuedSignal.ABSENT


def test_flask_route_inventory():
    """Verify Flask route inventory extraction with decorators."""
    engine = StaticAnalysisEngine()
    with tempfile.TemporaryDirectory() as tmpdir:
        flask_code = """
        from flask import Flask

        app = Flask(__name__)

        @app.route("/projects/<project_id>", methods=["GET"])
        def get_project(project_id):
            return {"project_id": project_id}

        @app.route("/projects", methods=["POST"])
        def create_project():
            return {"created": True}
        """
        code_file = Path(tmpdir) / "app.py"
        code_file.write_text(flask_code, encoding="utf-8")

        result = engine.analyze(Path(tmpdir), forced_framework=FrameworkType.FLASK)
        assert len(result.routes) == 2
        paths = {r.path for r in result.routes}
        assert "/projects/:project_id" in paths
        assert "/projects" in paths


def test_nextjs_route_inventory():
    """Verify Next.js route inventory extraction from App Router convention."""
    engine = StaticAnalysisEngine()
    with tempfile.TemporaryDirectory() as tmpdir:
        route_dir = Path(tmpdir) / "app" / "api" / "items" / "[itemId]"
        route_dir.mkdir(parents=True)
        route_file = route_dir / "route.ts"
        route_code = """
        import { NextResponse } from 'next/server';

        export async function GET(request: Request) {
            return NextResponse.json({ item: 1 });
        }

        export async function POST(request: Request) {
            return NextResponse.json({ created: true });
        }
        """
        route_file.write_text(route_code, encoding="utf-8")

        result = engine.analyze(Path(tmpdir), forced_framework=FrameworkType.NEXTJS)
        assert len(result.routes) == 2
        methods = {r.method for r in result.routes}
        assert methods == {"GET", "POST"}
        for r in result.routes:
            assert r.path == "/api/items/:itemId"


def test_parser_syntax_error_resilience():
    """Verify parser does not crash on broken/corrupted syntax."""
    parser = MultiLanguageParser()
    broken_py = parser.parse_code("def broken_syntax( { :::", "python")
    assert broken_py is not None
    assert broken_py.root.has_error

    broken_js = parser.parse_code("const x = )-( ; function {", "javascript")
    assert broken_js is not None
    assert broken_js.root.has_error


def test_deterministic_sorting_and_fingerprints():
    """Verify that multiple analysis runs produce identical ordering and fingerprints."""
    engine = StaticAnalysisEngine()
    with tempfile.TemporaryDirectory() as tmpdir:
        (Path(tmpdir) / "b.py").write_text("import hashlib\nhashlib.md5(b'x')", encoding="utf-8")
        (Path(tmpdir) / "a.py").write_text("DEBUG = True", encoding="utf-8")

        res1 = engine.analyze(Path(tmpdir))
        res2 = engine.analyze(Path(tmpdir))

        fps1 = [f.fingerprint for f in res1.findings]
        fps2 = [f.fingerprint for f in res2.findings]
        assert fps1 == fps2
        assert len(fps1) == 2
