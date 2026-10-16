import os
import sys
import re

FORBIDDEN_PRODUCTION_PATTERNS = [
    (r"\bTBD\b", "Unresolved TBD marker"),
    (r"\.example\b", "Example domain address (.example) found"),
    (r"\bDraft in development\b", "Draft status marker found"),
    (r"\[DRAFT\]", "Draft tag found"),
]

SOURCE_DIRS = [
    os.path.join("apps", "web", "src", "app"),
    os.path.join("apps", "web", "src", "components"),
]

def check_readiness(is_production_flag: bool = False):
    violations = []
    
    for sdir in SOURCE_DIRS:
        for root, _, files in os.walk(sdir):
            # Skip internal assets fixture pages from production content checks
            if "internal-assets" in root:
                continue
            for file in files:
                if not (file.endswith(".tsx") or file.endswith(".ts")):
                    continue
                # Skip DraftBanner and ContactCard which intentionally handle non-production states
                if file in ["DraftBanner.tsx", "ContactCard.tsx"]:
                    continue
                fpath = os.path.join(root, file)
                with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    for pattern, desc in FORBIDDEN_PRODUCTION_PATTERNS:
                        matches = re.findall(pattern, content)
                        if matches:
                            violations.append(f"{fpath}: {desc} ({len(matches)} occurrences)")
                            
    if violations:
        print(f"Production readiness check: {len(violations)} non-production markers detected:")
        for v in violations:
            print(f"  - {v}")
        if is_production_flag:
            print("ERROR: Production build blocked due to unresolved draft or example markers (PRD LR-11, TRD section 15).")
            sys.exit(1)
        else:
            print("Notice: Non-production build allowed. Markers are permitted in development.")
            sys.exit(0)
    else:
        print("Production readiness check: PASS (Zero draft markers, TBD values, or example addresses in production code).")
        sys.exit(0)

if __name__ == "__main__":
    is_prod = "--production" in sys.argv or os.environ.get("NODE_ENV") == "production"
    check_readiness(is_prod)
