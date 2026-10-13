"""Flask route extractor using tree-sitter AST (TRD Section 7)."""

import re
from pathlib import Path
from typing import List, Optional
import tree_sitter
from kairo_analysis.extractors.base import BaseRouteExtractor
from kairo_analysis.models import (
    FrameworkType,
    RouteInventoryRecord,
    ThreeValuedSignal,
)
from kairo_analysis.parser import SyntaxTree


class FlaskRouteExtractor(BaseRouteExtractor):
    """Extracts routes and blueprints from Flask applications."""

    def extract_routes(self, project_root: Path) -> List[RouteInventoryRecord]:
        routes: List[RouteInventoryRecord] = []

        for py_file in project_root.rglob("*.py"):
            if any(p in py_file.parts for p in [".venv", "node_modules", ".git", "__pycache__"]):
                continue

            st = self.parser.parse_file(py_file)
            if not st:
                continue

            rel_path = str(py_file.relative_to(project_root)).replace("\\", "/")
            file_routes = self._extract_from_tree(st, rel_path)
            routes.extend(file_routes)

        return routes

    def _extract_from_tree(self, st: SyntaxTree, rel_path: str) -> List[RouteInventoryRecord]:
        routes = []

        def walk(node: tree_sitter.Node):
            if node.type == "decorated_definition":
                parsed = self._try_parse_flask_route(st, node, rel_path)
                if parsed:
                    routes.extend(parsed)
            for child in node.children:
                walk(child)

        walk(st.root)
        return routes

    def _try_parse_flask_route(
        self, st: SyntaxTree, node: tree_sitter.Node, rel_path: str
    ) -> List[RouteInventoryRecord]:
        func_node = None
        decorators = []
        for child in node.children:
            if child.type == "decorator":
                decorators.append(child)
            elif child.type == "function_definition":
                func_node = child

        if not func_node or not decorators:
            return []

        route_dec = None
        path = None
        methods = ["GET"]

        for dec in decorators:
            dec_text = st.node_text(dec)
            match = re.search(r"@\w+\.route\s*\(\s*['\"]([^'\"]+)['\"]", dec_text)
            if match:
                route_dec = dec
                path = match.group(1)
                # check methods argument
                m_match = re.search(r"methods\s*=\s*\[([^\]]+)\]", dec_text)
                if m_match:
                    methods = [
                        m.strip("'\" ").upper()
                        for m in m_match.group(1).split(",")
                        if m.strip("'\" ")
                    ]
                break

        if not route_dec or not path:
            return []

        norm_path = self._normalize_path(path)
        func_name_node = func_node.child_by_field_name("name")
        func_name = st.node_text(func_name_node) if func_name_node else "handler"
        handler_text = st.node_text(func_node)
        all_text = st.node_text(node)

        # Check for decorators like @login_required
        dec_names = [st.node_text(d) for d in decorators]

        auth_sig, auth_ev = self._analyze_auth(dec_names, handler_text)
        owner_sig, owner_ev = self._analyze_ownership(handler_text)
        role_sig, role_ev = self._analyze_role(dec_names, handler_text)

        param_matches = re.findall(r":([a-zA-Z0-9_]+)", norm_path)
        id_params = [p for p in param_matches if "id" in p.lower() or "key" in p.lower()]

        data_ops = []
        for kw in ["query.filter", "session.add", "session.commit", "session.delete"]:
            if kw in handler_text:
                data_ops.append(kw)

        uploads = "request.files" in handler_text

        results = []
        for m in methods:
            route_id = f"flask:{m}:{norm_path}"
            results.append(
                RouteInventoryRecord(
                    id=route_id,
                    method=m,
                    path=norm_path,
                    framework=FrameworkType.FLASK,
                    handler_file=rel_path,
                    handler_name=func_name,
                    start_line=node.start_point.row + 1,
                    end_line=node.end_point.row + 1,
                    middleware=dec_names,
                    authentication=auth_sig,
                    auth_evidence=auth_ev,
                    ownership_check=owner_sig,
                    ownership_evidence=owner_ev,
                    role_check=role_sig,
                    role_evidence=role_ev,
                    identifier_parameters=id_params,
                    data_access=data_ops,
                    uploads=uploads,
                )
            )

        return results

    def _normalize_path(self, path: str) -> str:
        # Convert <int:id> or <id> to :id
        p = re.sub(r"<(?:\w+:)?([a-zA-Z0-9_]+)>", r":\1", path)
        p = re.sub(r"/+", "/", p)
        if not p.startswith("/"):
            p = "/" + p
        return p

    def _analyze_auth(self, decorators: List[str], body: str) -> tuple[ThreeValuedSignal, str]:
        dec_str = " ".join(decorators).lower()
        if "login_required" in dec_str or "fresh_login_required" in dec_str:
            return ThreeValuedSignal.DETECTED, "@login_required decorator detected on endpoint"

        if "current_user.is_authenticated" in body:
            return ThreeValuedSignal.DETECTED, "Explicit Flask-Login is_authenticated check in handler"

        if "abort(401)" in body:
            return ThreeValuedSignal.DETECTED, "Explicit abort(401) call detected"

        if "session" in body and "user" in body:
            return ThreeValuedSignal.UNKNOWN, "Session access without verified rejection"

        return ThreeValuedSignal.ABSENT, "No login decorator or session check found"

    def _analyze_ownership(self, body: str) -> tuple[ThreeValuedSignal, str]:
        lower = body.lower()
        if any(pat in lower for pat in [
            "user_id == current_user.id", "owner_id == current_user.id",
            "filter_by(user_id=current_user.id", "filter_by(owner_id=current_user.id"
        ]):
            return ThreeValuedSignal.DETECTED, "Filtered by current_user.id or ownership check"
        if "current_user" in lower and ("owner" in lower or "account" in lower):
            return ThreeValuedSignal.UNKNOWN, "Potential ownership check heuristic"
        return ThreeValuedSignal.ABSENT, "No ownership verification found"

    def _analyze_role(self, decorators: List[str], body: str) -> tuple[ThreeValuedSignal, str]:
        dec_str = " ".join(decorators).lower()
        if "admin_required" in dec_str or "roles_required" in dec_str or "roles_accepted" in dec_str:
            return ThreeValuedSignal.DETECTED, "Role-checking decorator detected"
        if "current_user.role ==" in body or "current_user.is_admin" in body:
            return ThreeValuedSignal.DETECTED, "Inline role check detected"
        if "admin" in body or "role" in body:
            return ThreeValuedSignal.UNKNOWN, "Role identifier mentioned"
        return ThreeValuedSignal.ABSENT, "No role check detected"
