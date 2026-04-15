"""
VelvetHyper CLI Harden Entry Point
Applies a stealth hardware profile to a target .vmx file.

Usage:
    python -m apps.cli_engine.harden <path_to_vmx> [--check]
    python apps/cli_engine/harden.py <path_to_vmx> [--check]
"""

import argparse
import json
import random
import sys
import uuid
from pathlib import Path

# Ensure project root is on sys.path when run directly
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

from libs.spoofer_core.vmx_hardener import VMXHardener


def _load_profiles(profiles_path: Path) -> list[dict]:
    """Load and validate the hardware profiles database."""
    if not profiles_path.exists():
        raise FileNotFoundError(f"Profile database not found: {profiles_path}")
    with open(profiles_path, "r", encoding="utf-8") as f:
        db = json.load(f)
    profiles = db.get("profiles", [])
    if not profiles:
        raise ValueError("Profile database is empty.")
    return profiles


def _build_stealth_profile(p: dict) -> dict:
    """Construct a stealth profile dict from a hardware profile entry."""
    serial_prefix = p.get("serial_prefix", "HW")
    return {
        "manufacturer": p["manufacturer"],
        "model": p["model"],
        "bios_version": p["bios_version"],
        "bios_date": p["bios_date"],
        "serial": f"{serial_prefix}-{uuid.uuid4().hex[:12].upper()}",
        "board_id": f"MB-{uuid.uuid4().hex[:8].upper()}",
        "hardware_uuid": str(uuid.uuid4()),
        "mac_address": (
            f"{p['mac_oui']}:"
            f"{random.getrandbits(8):02X}:"
            f"{random.getrandbits(8):02X}:"
            f"{random.getrandbits(8):02X}"
        ),
    }


def _check(vmx_path: str) -> None:
    """Check hardening status of a VMX file and exit."""
    hardener = VMXHardener(vmx_path)
    hardener.read_config()
    status = "HARDENED" if hardener.verify_stealth() else "UNHARDENED"
    print(f"STATUS: {status}")
    sys.exit(0)


def _harden_from_file(vmx_path: str, profile_file: str) -> None:
    """Apply a pre-built profile supplied via a JSON file."""
    profile_path = Path(profile_file)
    if not profile_path.exists():
        raise FileNotFoundError(f"Profile file not found: {profile_file}")
    with open(profile_path, "r", encoding="utf-8") as f:
        profile = json.load(f)

    hardener = VMXHardener(vmx_path)
    hardener.read_config()
    flags_applied = hardener.apply_stealth_profile(profile)
    hardener.write_config()

    print(
        f"[*] VelvetHyper Hardening Success: "
        f"{flags_applied} flags applied to {vmx_path}"
    )
    print(f"[*] Profile Applied: {profile['manufacturer']} / {profile['model']}")


def _harden(vmx_path: str, profiles_path: Path) -> None:
    """Apply a random stealth profile to the target VMX file."""
    profiles = _load_profiles(profiles_path)
    p = random.choice(profiles)
    stealth_profile = _build_stealth_profile(p)

    hardener = VMXHardener(vmx_path)
    hardener.read_config()
    flags_applied = hardener.apply_stealth_profile(stealth_profile)
    hardener.write_config()

    print(
        f"[*] VelvetHyper Hardening Success: "
        f"{flags_applied} flags applied to {vmx_path}"
    )
    print(f"[*] Profile Applied: {p['manufacturer']} / {p['model']} ({p['type']})")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="VelvetHyper VMX Hardening CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("vmx", help="Path to the target .vmx file")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Check hardening status only (no modifications)",
    )
    parser.add_argument(
        "--profile-file",
        metavar="PATH",
        help="Path to a JSON file containing the pre-built stealth profile to apply",
    )
    args = parser.parse_args()

    if args.check:
        _check(args.vmx)
    elif args.profile_file:
        # UI-supplied profile — apply exactly as-is
        _harden_from_file(args.vmx, args.profile_file)
    else:
        # CLI/standalone — pick a random profile from the database
        profiles_path = (
            _PROJECT_ROOT / "libs" / "spoofer_core" / "assets" / "hardware_profiles.json"
        )
        _harden(args.vmx, profiles_path)


if __name__ == "__main__":
    main()
