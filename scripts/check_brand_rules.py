"""Brand and content rules validator (BR-1, BR-3, BR-9).

Checks user-facing code and content:
1. No em dashes (Unicode U+2014) in codebase or text (BR-3).
2. No 'Made with AI' or 'Powered by AI' badges (BR-9).
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

CHECKED_DIRS = ["apps", "packages", "messages"]
EXCLUDED_EXTS = {".png", ".ico", ".jpg", ".zip", ".pyc", ".db", ".docx"}


def check_brand_guardrails() -> int:
    errors = 0
    em_dash = "\u2014"

    for dirname in CHECKED_DIRS:
        target_dir = ROOT / dirname
        if not target_dir.exists():
            continue
        for path in target_dir.rglob("*"):
            if "node_modules" in path.parts or ".next" in path.parts or "__pycache__" in path.parts or path.name == "AGENTS.md":
                continue
            if path.suffix in EXCLUDED_EXTS or path.is_dir():
                continue

            try:
                content = path.read_text(encoding="utf-8")
            except Exception:
                continue

            # 1. Em dash check (BR-3)
            if em_dash in content:
                print(f"ERROR: Em dash found in {path.relative_to(ROOT)}")
                errors += 1

            # 2. Banned badge check (BR-9)
            lower_content = content.lower()
            if "made with ai" in lower_content or "powered by ai" in lower_content:
                print(f"ERROR: Forbidden AI badge phrasing in {path.relative_to(ROOT)}")
                errors += 1

    if errors == 0:
        print("Brand and content rules validation: PASS (Zero em dashes, zero forbidden badges)")
    return errors


if __name__ == "__main__":
    sys.exit(1 if check_brand_guardrails() > 0 else 0)
