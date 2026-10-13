"""Tree-sitter parser adapter for Python, JavaScript and TypeScript (TRD Section 7)."""

from __future__ import annotations

from pathlib import Path
from typing import Optional
import tree_sitter
import tree_sitter_python
import tree_sitter_javascript
import tree_sitter_typescript


class SyntaxTree:
    def __init__(self, tree: tree_sitter.Tree, source_bytes: bytes, file_path: Path):
        self.tree = tree
        self.source_bytes = source_bytes
        self.file_path = file_path

    @property
    def root(self) -> tree_sitter.Node:
        return self.tree.root_node

    def node_text(self, node: tree_sitter.Node) -> str:
        return self.source_bytes[node.start_byte : node.end_byte].decode("utf-8", errors="replace")


class MultiLanguageParser:
    """Multi-language tree-sitter parser supporting Python, JS, TS, TSX."""

    def __init__(self):
        self._py_lang = tree_sitter.Language(tree_sitter_python.language())
        self._js_lang = tree_sitter.Language(tree_sitter_javascript.language())
        self._ts_lang = tree_sitter.Language(tree_sitter_typescript.language_typescript())
        self._tsx_lang = tree_sitter.Language(tree_sitter_typescript.language_tsx())

        self._py_parser = tree_sitter.Parser(self._py_lang)
        self._js_parser = tree_sitter.Parser(self._js_lang)
        self._ts_parser = tree_sitter.Parser(self._ts_lang)
        self._tsx_parser = tree_sitter.Parser(self._tsx_lang)

    def parse_file(self, file_path: Path) -> Optional[SyntaxTree]:
        """Parse a source file based on extension with error tolerance."""
        if not file_path.exists() or file_path.stat().st_size > 1_000_000:  # 1MB limit per TRD
            return None

        try:
            content = file_path.read_bytes()
        except Exception:
            return None

        ext = file_path.suffix.lower()
        if ext == ".py":
            parser = self._py_parser
        elif ext in [".js", ".mjs", ".cjs"]:
            parser = self._js_parser
        elif ext in [".ts", ".mts", ".cts"]:
            parser = self._ts_parser
        elif ext in [".tsx", ".jsx"]:
            parser = self._tsx_parser
        else:
            return None

        try:
            tree = parser.parse(content)
            return SyntaxTree(tree=tree, source_bytes=content, file_path=file_path)
        except Exception:
            # Tolerant parser: skip unparseable corrupted files
            return None

    def parse_code(self, code: str, language: str) -> Optional[SyntaxTree]:
        """Parse in-memory code string."""
        raw = code.encode("utf-8")
        lang = language.lower()
        if lang == "python":
            parser = self._py_parser
        elif lang in ["javascript", "js"]:
            parser = self._js_parser
        elif lang in ["typescript", "ts"]:
            parser = self._ts_parser
        elif lang in ["tsx", "jsx"]:
            parser = self._tsx_parser
        else:
            return None

        try:
            tree = parser.parse(raw)
            return SyntaxTree(tree=tree, source_bytes=raw, file_path=Path("<memory>"))
        except Exception:
            return None
