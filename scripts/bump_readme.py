"""
VelvetHyper — Version Bumper utility
Invoked by `standard-version` via package.json to bump README.md version badges.
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def main():
    pkg_path = ROOT / "apps" / "desktop_ui" / "package.json"
    with open(pkg_path, "r", encoding="utf-8") as f:
        pkg = json.load(f)
        version = pkg["version"]

    readme_path = ROOT / "README.md"
    if readme_path.exists():
        content = readme_path.read_text(encoding="utf-8")
        
        # Replace the version badge
        # e.g. ![Version](https://img.shields.io/badge/version-1.0.0-8B5CF6)
        content = re.sub(r"badge/version-\d+\.\d+\.\d+", f"badge/version-{version}", content)
        
        readme_path.write_text(content, encoding="utf-8")
        print(f"Updated README.md to version {version}")
    else:
        print("README.md not found, skipping badge update.")

if __name__ == "__main__":
    main()
