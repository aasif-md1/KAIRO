"""FastAPI route extractor using tree-sitter AST (TRD Section 7)."""

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

FASTAPI_METHODS = {"get", "post", "put", "delete", "patch", "options", "head"}


class FastapiRouteExtractor(BaseRouteExtractor):
    """Extracts routes and dependency chains from FastAPI applications."""

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
            # In Python tree-sitter: decorated_definition has decorator child and function_definition child
            if node.type == "decorated_definition":
                route = self._try_parse_decorated_func(st, node, rel_path)
                if route:
                    routes.append(route)
            for child in node.children:
                walk(child)

        walk(st.root)
        return routes

    def _try_parse_decorated_func(
        self, st: SyntaxTree, node: tree_sitter.Node, rel_path: str
    ) -> Optional[RouteInventoryRecord]:
        # Find function definition child
        func_node = None
        decorators = []
        for child in node.children:
            if child.type == "decorator":
                decorators.append(child)
            elif child.type == "function_definition":
                func_node = child

        if not func_node or not decorators:
            return None

        # Look for @app.get, @router.post, etc.
        route_dec = None
        method = None
        path = None

        for dec in decorators:
            dec_text = st.node_text(dec)
            match = re.search(r"@\w+\.(get|post|put|delete|patch|options|head)\s*\(\s*['\"]([^'\"]+)['\"]", dec_text, re.IGNORECASE)
            if match:
                route_dec = dec
                method = match.group(1).upper()
                path = match.group(2)
                break

        if not route_dec or not method or not path:
            return None

        norm_path = self._normalize_path(path)
        func_name_node = func_node.child_by_field_name("name")
        func_name = st.node_text(func_name_node) if func_name_node else "handler"
        handler_text = st.node_text(func_node)
        dec_full_text = st.node_text(node)

        # Inspect dependencies
        dep_matches = re.findall(r"Depends\(\s*([a-zA-Z0-9_]+)\s*\)", dec_full_text)
        middleware = list(dict.fromkeys(dep_matches))

        auth_sig, auth_ev = self._analyze_auth(middleware, handler_text)
        owner_sig, owner_ev = self._analyze_ownership(handler_text)
        role_sig, role_ev = self._analyze_role(middleware, handler_text)

        param_matches = re.findall(r":([a-zA-Z0-9_]+)", norm_path)
        id_params = [p for p in param_matches if "id" in p.lower() or "key" in p.lower()]

        data_ops = []
        for kw in ["select", "execute", "commit", "query", "filter", "add", "delete"]:
            if f".{kw}" in handler_text or f"{kw}(" in handler_text:
                data_ops.append(kw)

        uploads = "UploadFile" in handler_text or "File(" in handler_text

        route_id = f"fastapi:{method}:{norm_path}"
        return RouteInventoryRecord(
            id=route_id,
            method=method,
            path=norm_path,
            framework=FrameworkType.FASTAPI,
            handler_file=rel_path,
            handler_name=func_name,
            start_line=node.start_point.row + 1,
            end_line=node.end_point.row + 1,
            middleware=middleware,
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

    def _normalize_path(self, path: str) -> str:
        # Convert {item_id} -> :item_id
        p = re.sub(r"\{([a-zA-Z0-9_]+)\}", r":\1", path)
        p = re.sub(r"/+", "/", p)
        if not p.startswith("/"):
            p = "/" + p
        return p

    def _analyze_auth(self, deps: List[str], body: str) -> tuple[ThreeValuedSignal, str]:
        combined = " ".join(deps).lower() + " " + body.lower()
        if any(kw in combined for kw in [
            "get_current_user", "require_auth", "authenticated_user",
            "verify_token", "current_active_user", "httpbearer", "oauth2"
        ]):
            return ThreeValuedSignal.DETECTED, "Dependency returning authenticated user detected"

        if "raise httpexception(status_code=401" in body.lower() or "raise httpexception(401" in body:
            return ThreeValuedSignal.DETECTED, "Explicit 401 Unauthorized exception raised"

        if any(kw in combined for kw in ["auth", "user", "token", "session"]):
            return ThreeValuedSignal.UNKNOWN, "Potential auth dependency without verified credential check"

        return ThreeValuedSignal.ABSENT, "No authentication dependency or check identified"

    def _analyze_ownership(self, body: str) -> tuple[ThreeValuedSignal, str]:
        lower = body.lower()
        if any(pat in lower for pat in [
            "owner_id == user.id", "user_id == current_user.id", "created_by == current_user.id",
            "user_id == user.id", "filter_by(user_id=", "filter(model.owner_id =="
        ]):
            return ThreeValuedSignal.DETECTED, "Record owner compared with current user ID"
        if "current_user.id" in lower and ("owner" in lower or "account" in lower):
            return ThreeValuedSignal.UNKNOWN, "Potential ownership check heuristic"
        return ThreeValuedSignal.ABSENT, "No ownership verification detected"

    def _analyze_role(self, deps: List[str], body: str) -> tuple[ThreeValuedSignal, str]:
        combined = " ".join(deps).lower() + " " + body.lower()
        if any(kw in combined for kw in ["require_admin", "require_role", "is_admin", "check_role"]):
            return ThreeValuedSignal.DETECTED, "Role checking dependency or decorator detected"
        if "role == 'admin'" in combined or 'role == "admin"' in combined or "current_user.is_superuser" in combined:
            return ThreeValuedSignal.DETECTED, "Inline role or superuser comparison detected"
        if "admin" in combined or "role" in combined:
            return ThreeValuedSignal.UNKNOWN, "Role keyword found"
        return ThreeValuedSignal.ABSENT, "No role check detected"
