"""Express.js route extractor using tree-sitter AST (TRD Section 7)."""

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

HTTP_METHODS = {"get", "post", "put", "delete", "patch", "options", "head"}


class ExpressRouteExtractor(BaseRouteExtractor):
    """Extracts routes from Express.js applications."""

    def extract_routes(self, project_root: Path) -> List[RouteInventoryRecord]:
        routes: List[RouteInventoryRecord] = []

        for ext in [".js", ".mjs", ".ts"]:
            for file_path in project_root.rglob(f"*{ext}"):
                if any(p in file_path.parts for p in ["node_modules", ".git", "dist", "build"]):
                    continue

                st = self.parser.parse_file(file_path)
                if not st:
                    continue

                rel_path = str(file_path.relative_to(project_root)).replace("\\", "/")
                file_routes = self._extract_from_tree(st, rel_path)
                routes.extend(file_routes)

        return routes

    def _extract_from_tree(self, st: SyntaxTree, rel_path: str) -> List[RouteInventoryRecord]:
        routes = []

        def walk(node: tree_sitter.Node):
            if node.type == "call_expression":
                route = self._try_parse_route_call(st, node, rel_path)
                if route:
                    routes.append(route)
            for child in node.children:
                walk(child)

        walk(st.root)
        return routes

    def _try_parse_route_call(
        self, st: SyntaxTree, call_node: tree_sitter.Node, rel_path: str
    ) -> Optional[RouteInventoryRecord]:
        func_node = call_node.child_by_field_name("function")
        if not func_node or func_node.type != "member_expression":
            return None

        property_node = func_node.child_by_field_name("property")
        if not property_node:
            return None

        method_name = st.node_text(property_node).lower()
        if method_name not in HTTP_METHODS:
            return None

        args_node = call_node.child_by_field_name("arguments")
        if not args_node or len(args_node.children) < 3:
            return None

        # Filter out punctuation ()
        args = [c for c in args_node.children if c.type not in ["(", ")", ","]]
        if not args:
            return None

        # First argument should be path
        path_node = args[0]
        if path_node.type not in ["string", "string_fragment", "template_string"]:
            return None

        raw_path = st.node_text(path_node).strip("'\"`")
        if not raw_path.startswith("/") and not raw_path.startswith("*"):
            return None

        norm_path = self._normalize_path(raw_path)
        handler_node = args[-1]
        middleware_nodes = args[1:-1]

        middleware_names = [st.node_text(m) for m in middleware_nodes]
        handler_text = st.node_text(handler_node)
        all_text = st.node_text(call_node)

        # Inspect authentication signals
        auth_sig, auth_ev = self._analyze_auth(middleware_names, handler_text)
        owner_sig, owner_ev = self._analyze_ownership(handler_text)
        role_sig, role_ev = self._analyze_role(middleware_names, handler_text)

        # Identifier parameters (e.g. :id, :userId, :order_id)
        param_matches = re.findall(r":([a-zA-Z0-9_]+)", norm_path)
        id_params = [p for p in param_matches if "id" in p.lower() or "key" in p.lower()]

        # Data access heuristics
        data_ops = []
        for kw in ["find", "create", "update", "delete", "save", "query", "select", "insert"]:
            if f".{kw}" in handler_text or f"{kw}(" in handler_text:
                data_ops.append(kw)

        uploads = "multer" in all_text or "upload" in all_text or "formData" in all_text

        route_id = f"express:{method_name.upper()}:{norm_path}"
        return RouteInventoryRecord(
            id=route_id,
            method=method_name.upper(),
            path=norm_path,
            framework=FrameworkType.EXPRESS,
            handler_file=rel_path,
            handler_name="anonymous" if handler_node.type in ["arrow_function", "function_expression"] else st.node_text(handler_node),
            start_line=call_node.start_point.row + 1,
            end_line=call_node.end_point.row + 1,
            middleware=middleware_names,
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
        # Standardize /users/:id
        p = re.sub(r"/+", "/", path)
        if not p.startswith("/"):
            p = "/" + p
        return p

    def _analyze_auth(self, middlewares: List[str], body: str) -> tuple[ThreeValuedSignal, str]:
        combined = " ".join(middlewares).lower() + " " + body.lower()
        # High confidence detected patterns
        if any(kw in combined for kw in [
            "requireauth", "authenticate", "isauthenticated", "verifytoken",
            "passport.authenticate", "jwt.verify", "clerk", "supertokens", "auth0"
        ]):
            return ThreeValuedSignal.DETECTED, "Authentication middleware or verification call found"

        # Check for req.user check in body
        if "req.user" in body or "req.session.user" in body or "req.session.account" in body:
            if "if (!req.user" in body or "if (!req.session" in body or "status(401)" in body:
                return ThreeValuedSignal.DETECTED, "Explicit session/user verification inside handler"

        # Ambiguous named middleware
        if any(kw in combined for kw in ["auth", "login", "guard", "protect"]):
            return ThreeValuedSignal.UNKNOWN, "Potential auth name without proven fail-closed behavior"

        return ThreeValuedSignal.ABSENT, "No authentication middleware or credential check identified"

    def _analyze_ownership(self, body: str) -> tuple[ThreeValuedSignal, str]:
        lower = body.lower()
        if any(pat in lower for pat in [
            "owner_id", "user_id: req.user", "userid: req.user", "owner: req.user",
            "createdby: req.user", "req.user.id ===", "req.user._id ===", "req.user.id =="
        ]):
            return ThreeValuedSignal.DETECTED, "Ownership comparison or user-scoped query filter detected"
        if "user.id" in lower and ("owner" in lower or "account" in lower):
            return ThreeValuedSignal.UNKNOWN, "Potential ownership check heuristic"
        return ThreeValuedSignal.ABSENT, "No user ownership comparison found"

    def _analyze_role(self, middlewares: List[str], body: str) -> tuple[ThreeValuedSignal, str]:
        combined = " ".join(middlewares).lower() + " " + body.lower()
        if any(kw in combined for kw in ["requireadmin", "requirerole", "isadmin", "hasrole", "checkrole"]):
            return ThreeValuedSignal.DETECTED, "Role verification middleware or function detected"
        if "role ===" in combined or "role ==" in combined or "roles.includes" in combined:
            return ThreeValuedSignal.DETECTED, "Inline role check comparison found"
        if "admin" in combined or "role" in combined:
            return ThreeValuedSignal.UNKNOWN, "Role identifier mentioned without verified enforcement"
        return ThreeValuedSignal.ABSENT, "No role check detected"
