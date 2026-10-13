"""Next.js route extractor for App Router and Pages API (TRD Section 7)."""

import re
from pathlib import Path
from typing import List
import tree_sitter
from kairo_analysis.extractors.base import BaseRouteExtractor
from kairo_analysis.models import (
    FrameworkType,
    RouteInventoryRecord,
    ThreeValuedSignal,
)
from kairo_analysis.parser import SyntaxTree

NEXT_HTTP_METHODS = {"GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"}


class NextjsRouteExtractor(BaseRouteExtractor):
    """Extracts routes from Next.js App Router and Pages Router."""

    def extract_routes(self, project_root: Path) -> List[RouteInventoryRecord]:
        routes: List[RouteInventoryRecord] = []

        # 1. App Router: app/**/route.(ts|js|tsx|jsx)
        for route_file in project_root.rglob("route.*"):
            if any(p in route_file.parts for p in ["node_modules", ".git", ".next", "dist"]):
                continue
            if route_file.suffix.lower() in [".ts", ".js", ".tsx", ".jsx"]:
                st = self.parser.parse_file(route_file)
                if st:
                    routes.extend(self._extract_app_router(st, route_file, project_root))

        # 2. Pages Router: pages/api/**/*.(ts|js)
        for pages_dir in [project_root / "pages" / "api", project_root / "src" / "pages" / "api"]:
            if pages_dir.exists():
                for api_file in pages_dir.rglob("*.*"):
                    if any(p in api_file.parts for p in ["node_modules", ".git", ".next", "dist"]):
                        continue
                    if api_file.suffix.lower() in [".ts", ".js"]:
                        st = self.parser.parse_file(api_file)
                        if st:
                            routes.extend(self._extract_pages_router(st, api_file, project_root))

        return routes

    def _extract_app_router(
        self, st: SyntaxTree, route_file: Path, root: Path
    ) -> List[RouteInventoryRecord]:
        routes = []
        rel_path = str(route_file.relative_to(root)).replace("\\", "/")

        # Compute normalized route path from directory
        # e.g., src/app/api/invoices/[id]/route.ts -> /api/invoices/:id
        parent_parts = route_file.parent.parts
        # find index of 'app'
        try:
            app_idx = parent_parts.index("app")
            route_parts = parent_parts[app_idx + 1 :]
        except ValueError:
            route_parts = route_file.parent.relative_to(root).parts

        normalized_segments = []
        for part in route_parts:
            # Next.js route groups (group) are omitted
            if part.startswith("(") and part.endswith(")"):
                continue
            # Dynamic segments [id] -> :id
            if part.startswith("[...") and part.endswith("]"):
                param = part[4:-1]
                normalized_segments.append(f":{param}")
            elif part.startswith("[") and part.endswith("]"):
                param = part[1:-1]
                normalized_segments.append(f":{param}")
            else:
                normalized_segments.append(part)

        norm_path = "/" + "/".join(normalized_segments) if normalized_segments else "/"

        # Find exported functions named GET, POST, etc.
        for child in st.root.children:
            if child.type == "export_statement":
                decl = child.child_by_field_name("declaration")
                if decl and decl.type == "function_declaration":
                    name_node = decl.child_by_field_name("name")
                    if name_node:
                        method = st.node_text(name_node)
                        if method in NEXT_HTTP_METHODS:
                            routes.append(
                                self._build_record(st, decl, method, norm_path, rel_path)
                            )
                elif decl and decl.type == "lexical_declaration":
                    for declarator in decl.children:
                        if declarator.type == "variable_declarator":
                            name_node = declarator.child_by_field_name("name")
                            if name_node and st.node_text(name_node) in NEXT_HTTP_METHODS:
                                method = st.node_text(name_node)
                                routes.append(
                                    self._build_record(st, declarator, method, norm_path, rel_path)
                                )

        return routes

    def _extract_pages_router(
        self, st: SyntaxTree, api_file: Path, root: Path
    ) -> List[RouteInventoryRecord]:
        rel_path = str(api_file.relative_to(root)).replace("\\", "/")
        # pages/api/auth/[...nextauth].ts -> /api/auth/:nextauth
        parts = list(api_file.relative_to(root).parts)
        if "pages" in parts:
            idx = parts.index("pages")
            parts = parts[idx + 1 :]

        # strip file extension from last part
        last = parts[-1]
        last_stem = re.sub(r"\.(ts|js|tsx|jsx)$", "", last)
        if last_stem == "index":
            parts = parts[:-1]
        else:
            parts[-1] = last_stem

        norm_segments = []
        for p in parts:
            if p.startswith("[...") and p.endswith("]"):
                norm_segments.append(f":{p[4:-1]}")
            elif p.startswith("[") and p.endswith("]"):
                norm_segments.append(f":{p[1:-1]}")
            else:
                norm_segments.append(p)

        norm_path = "/" + "/".join(norm_segments)

        # In pages router, a single handler can handle multiple methods
        # Default to GET/POST if not differentiated
        handler_text = st.node_text(st.root)
        methods = set()
        for m in ["GET", "POST", "PUT", "DELETE", "PATCH"]:
            if f"req.method === '{m}'" in handler_text or f'req.method === "{m}"' in handler_text:
                methods.add(m)
        if not methods:
            methods = {"GET", "POST"}

        routes = []
        for m in sorted(methods):
            routes.append(self._build_record(st, st.root, m, norm_path, rel_path))
        return routes

    def _build_record(
        self, st: SyntaxTree, node: tree_sitter.Node, method: str, norm_path: str, rel_path: str
    ) -> RouteInventoryRecord:
        body_text = st.node_text(node)
        all_text = st.node_text(st.root)

        auth_sig, auth_ev = self._analyze_auth(body_text, all_text)
        owner_sig, owner_ev = self._analyze_ownership(body_text)
        role_sig, role_ev = self._analyze_role(body_text)

        param_matches = re.findall(r":([a-zA-Z0-9_]+)", norm_path)
        id_params = [p for p in param_matches if "id" in p.lower() or "key" in p.lower()]

        data_ops = []
        for kw in ["prisma", "findUnique", "findMany", "create", "update", "delete", "query"]:
            if kw in body_text:
                data_ops.append(kw)

        uploads = "formData" in body_text or "upload" in body_text or "multipart" in body_text

        route_id = f"nextjs:{method}:{norm_path}"
        return RouteInventoryRecord(
            id=route_id,
            method=method,
            path=norm_path,
            framework=FrameworkType.NEXTJS,
            handler_file=rel_path,
            handler_name=method,
            start_line=node.start_point.row + 1,
            end_line=node.end_point.row + 1,
            middleware=[],
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

    def _analyze_auth(self, body: str, file_text: str) -> tuple[ThreeValuedSignal, str]:
        combined = (body + " " + file_text).lower()
        if any(kw in combined for kw in [
            "getserversession", "auth()", "verifysession", "clerkclient",
            "getcurrentuser", "supabase.auth.getuser"
        ]):
            if "if (!session" in body or "if (!user" in body or "status: 401" in body or "throw new error" in body:
                return ThreeValuedSignal.DETECTED, "Session verification with fail-closed branch found"
            return ThreeValuedSignal.DETECTED, "Next.js session helper call detected"

        if "cookies().get('session')" in body or "cookies().get('token')" in body:
            return ThreeValuedSignal.UNKNOWN, "Session cookie read without verified validation"

        if "auth" in body.lower():
            return ThreeValuedSignal.UNKNOWN, "Auth keyword found without verified enforcement"

        return ThreeValuedSignal.ABSENT, "No Next.js authentication call identified"

    def _analyze_ownership(self, body: str) -> tuple[ThreeValuedSignal, str]:
        lower = body.lower()
        if any(pat in lower for pat in [
            "user_id: session.user.id", "userid: session.user.id", "owner_id: session",
            "session.user.id ===", "session.user.id =="
        ]):
            return ThreeValuedSignal.DETECTED, "Session user ID compared against record owner"
        if "session.user" in lower and ("owner" in lower or "account" in lower):
            return ThreeValuedSignal.UNKNOWN, "Potential ownership check heuristic"
        return ThreeValuedSignal.ABSENT, "No ownership validation found"

    def _analyze_role(self, body: str) -> tuple[ThreeValuedSignal, str]:
        lower = body.lower()
        if "role ===" in lower or "role ==" in lower or "isadmin" in lower:
            return ThreeValuedSignal.DETECTED, "Role check comparison in handler"
        if "admin" in lower or "role" in lower:
            return ThreeValuedSignal.UNKNOWN, "Role identifier mentioned"
        return ThreeValuedSignal.ABSENT, "No role check detected"
