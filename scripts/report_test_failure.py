"""Extract error lines from pytest log and emit as a GitHub Actions error annotation."""

from pathlib import Path
import sys

log_file = Path("/tmp/pytest.log")
if not log_file.exists():
    log_file = Path("pytest.log")

if not log_file.exists():
    sys.exit(0)

lines = [line.strip() for line in log_file.read_text(encoding="utf-8", errors="replace").splitlines() if line.strip()]
if lines:
    tail = " >>> ".join(lines[-35:])
    print(f"::error title=PytestFailure::{tail}")
