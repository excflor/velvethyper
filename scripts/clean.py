"""
VelvetHyper — Cross-Platform Build Cleaner
Invoked by `make clean`. Works on Windows, Linux, and macOS.
"""

import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Directories to remove entirely
DIRS_TO_REMOVE = [
    ROOT / "build",
    ROOT / "dist",
    ROOT / "apps" / "desktop_ui" / "dist",
    ROOT / "apps" / "desktop_ui" / "out",
    ROOT / "apps" / "desktop_ui" / ".vite",
]

# Patterns to recursively find and remove
FILE_PATTERNS = ["*.pyc", "*.pyo"]
DIR_PATTERNS = ["__pycache__", ".pytest_cache", ".mypy_cache", ".ruff_cache"]


def remove_dir(path: Path) -> None:
    if path.exists():
        shutil.rmtree(path)
        print(f"  [rm] {path.relative_to(ROOT)}")


def remove_by_pattern() -> None:
    for pattern in FILE_PATTERNS:
        for match in ROOT.rglob(pattern):
            if ".git" not in match.parts and "node_modules" not in match.parts:
                match.unlink()
                print(f"  [rm] {match.relative_to(ROOT)}")

    for pattern in DIR_PATTERNS:
        for match in ROOT.rglob(pattern):
            if ".git" not in match.parts and "node_modules" not in match.parts:
                shutil.rmtree(match)
                print(f"  [rm] {match.relative_to(ROOT)}")


def main() -> None:
    print("[*] VelvetHyper — Forensic Cleanup")

    for d in DIRS_TO_REMOVE:
        remove_dir(d)

    remove_by_pattern()

    print("[*] Cleanup complete.")


if __name__ == "__main__":
    sys.exit(main())
