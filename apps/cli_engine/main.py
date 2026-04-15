"""
VelvetHyper CLI Main Entry Point
Interactive profile-based hardening workflow.

Usage:
    python apps/cli_engine/main.py [--profile <name>]
    velvethyper [--profile <name>]
"""

import argparse
import os
import sys
from pathlib import Path

# Ensure project root is on sys.path when run directly
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

from libs.spoofer_core.profile_manager import ProfileManager
from libs.spoofer_core.vmx_hardener import VMXHardener

_DEFAULT_PROFILE = "default"


def _resolve_vmx() -> str:
    """Find a .vmx file in CWD or prompt the user for a path."""
    vmx_files = [f for f in os.listdir(".") if f.endswith(".vmx")]
    if vmx_files:
        print(f"[*] Found VM: {vmx_files[0]}")
        return vmx_files[0]

    print("[!] No .vmx files found in current directory.")
    return input("[?] Enter the full path to your .vmx file: ").strip().replace('"', "")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="VelvetHyper — Interactive Stealth Hardening Engine",
    )
    parser.add_argument(
        "--profile",
        default=_DEFAULT_PROFILE,
        help=f"Hardware profile name to use (default: {_DEFAULT_PROFILE!r})",
    )
    args = parser.parse_args()

    print("========================================")
    print("   VelvetHyper — Stealth Engine         ")
    print("========================================")

    profiles_dir = _PROJECT_ROOT / "profiles"
    pm = ProfileManager(profiles_dir=profiles_dir)

    profile = pm.load_profile(args.profile)
    if not profile:
        print(f"[*] Generating new stealth profile: {args.profile!r}...")
        profile = pm.create_profile(args.profile)
    else:
        print(f"[*] Loaded existing profile: {args.profile!r}")

    target_vmx = _resolve_vmx()

    if not os.path.exists(target_vmx):
        print(f"[ERROR] Specified file not found: {target_vmx}")
        sys.exit(1)

    try:
        hardener = VMXHardener(target_vmx)
        hardener.read_config()
        flags_applied = hardener.apply_stealth_profile(profile)
        hardener.write_config()
        print(
            f"[SUCCESS] VM is now hardened "
            f"({flags_applied} flags applied). You can launch VMware."
        )
    except Exception as e:
        print(f"[ERROR] Failed to harden VM: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
