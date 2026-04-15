"""
VelvetHyper VMX Hardening Engine
Pure library module — no entry-point logic here.
See apps/cli_engine/harden.py for the CLI entry point.
"""

import os
from pathlib import Path
from libs.spoofer_core.cpu_masker import CPUMasker


class VMXHardener:
    """
    Reads, mutates, and writes VMware .vmx configuration files
    to apply a comprehensive stealth/hardening profile.
    """

    def __init__(self, vmx_path: str) -> None:
        self.vmx_path = vmx_path
        self.config: dict[str, str] = {}

    # ------------------------------------------------------------------
    # I/O
    # ------------------------------------------------------------------

    def read_config(self) -> None:
        """Parse the .vmx file into self.config."""
        if not os.path.exists(self.vmx_path):
            raise FileNotFoundError(f"VMX file not found: {self.vmx_path}")

        with open(self.vmx_path, "r", encoding="utf-8") as f:
            for line in f:
                if "=" in line:
                    key, value = line.strip().split("=", 1)
                    self.config[key.strip()] = value.strip().replace('"', "")

    def write_config(self) -> None:
        """Write self.config back to the .vmx file in standard VMX format."""
        with open(self.vmx_path, "w", encoding="utf-8") as f:
            for key, value in self.config.items():
                f.write(f'{key} = "{value}"\n')

    # ------------------------------------------------------------------
    # Hardening
    # ------------------------------------------------------------------

    def apply_stealth_profile(self, profile: dict) -> int:
        """
        Apply a comprehensive stealth profile to the VMX configuration.
        Returns the number of flags written (new + updated).
        """
        flags: dict[str, str] = {}

        # 1. Hardware Identity Spoofing (SMBIOS & Baseboard)
        flags["smbios.reflectHost"] = "FALSE"
        flags["hw.model"] = profile["model"]
        flags["hw.model.reflectHost"] = "FALSE"
        flags["serialNumber"] = profile["serial"]
        flags["serialNumber.reflectHost"] = "FALSE"
        flags["board-id"] = profile["board_id"]
        flags["board-id.reflectHost"] = "FALSE"
        flags["hw.uuid"] = profile["hardware_uuid"]

        # 2. BIOS Identity
        flags["bios.version"] = profile["bios_version"]
        flags["bios.date"] = profile["bios_date"]
        flags["bios.vendor"] = profile["manufacturer"]

        # 3. Network Spoofing (MAC)
        flags["ethernet0.addressType"] = "static"
        flags["ethernet0.address"] = profile["mac_address"]
        flags["ethernet0.checkMACAddress"] = "FALSE"

        # 4. CPUID Masking & Hypervisor Evasion
        flags.update(CPUMasker.get_stealth_flags())

        # 5. ACPI & Firmware Sanitization + Anti-VM (single authoritative block)
        flags["acpi.passthrough"] = "TRUE"
        flags["acpi.debug"] = "FALSE"
        flags["monitor_control.enable_extended_hv"] = "TRUE"
        flags["monitor_control.restrict_backdoor"] = "TRUE"
        flags["monitor_control.vt32"] = "TRUE"
        flags["monitor_control.virtual_rdtsc"] = "FALSE"

        # 6. Deep Isolation: Disable guest-host communication channels
        flags.update({
            "isolation.tools.getPtrLocation.disable": "TRUE",
            "isolation.tools.setPtrLocation.disable": "TRUE",
            "isolation.tools.setVersion.disable": "TRUE",
            "isolation.tools.getVersion.disable": "TRUE",
            "isolation.tools.copy.disable": "TRUE",
            "isolation.tools.paste.disable": "TRUE",
            "isolation.tools.dnd.disable": "TRUE",
            "isolation.tools.hgfsServerSetVersions.disable": "TRUE",
            "isolation.tools.guestPlatformInfo.disable": "TRUE",
        })

        # 7. Time & Sync Evasion (Prevents detection via clock skew/sync)
        flags["tools.syncTime"] = "FALSE"
        flags["time.synchronize.continue"] = "FALSE"
        flags["time.synchronize.restore"] = "FALSE"
        flags["time.synchronize.resume.disk"] = "FALSE"
        flags["time.synchronize.shrink"] = "FALSE"
        flags["time.synchronize.tools.startup"] = "FALSE"
        flags["time.synchronize.tools.enable"] = "FALSE"
        flags["time.synchronize.resume.host"] = "FALSE"

        self.config.update(flags)
        return len(flags)

    # ------------------------------------------------------------------
    # Verification
    # ------------------------------------------------------------------

    def verify_stealth(self) -> bool:
        """
        Check if the loaded config contains the VelvetHyper stealth signature.
        Validates a subset of critical hardening flags.
        """
        critical_flags = {
            "smbios.reflectHost": "FALSE",
            "monitor_control.restrict_backdoor": "TRUE",
            "isolation.tools.copy.disable": "TRUE",
            "acpi.passthrough": "TRUE",
        }

        for key, expected in critical_flags.items():
            if self.config.get(key) != expected:
                return False

        # CPUID hypervisor bit must be cleared
        if "cpuid.1.ecx" in self.config:
            if not self.config["cpuid.1.ecx"].endswith("0"):
                return False

        return True
