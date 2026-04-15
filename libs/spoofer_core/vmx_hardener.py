import os
import re
from libs.spoofer_core.cpu_masker import CPUMasker

class VMXHardener:
    def __init__(self, vmx_path):
        self.vmx_path = vmx_path
        self.config = {}

    def read_config(self):
        if not os.path.exists(self.vmx_path):
            raise FileNotFoundError(f"VMX file not found: {self.vmx_path}")
        
        with open(self.vmx_path, "r", encoding="utf-8") as f:
            for line in f:
                if "=" in line:
                    key, value = line.strip().split("=", 1)
                    self.config[key.strip()] = value.strip().replace('"', '')

    def write_config(self):
        with open(self.vmx_path, "w", encoding="utf-8") as f:
            # We use double quotes for values as per VMX standard
            for key, value in self.config.items():
                f.write(f'{key} = "{value}"\n')

    def apply_stealth_profile(self, profile):
        """
        Applies a comprehensive stealth profile to the VMX configuration.
        Includes Phase 2: Firmware & Identity (SMBIOS, ACPI, CPUID).
        """
        # 1. Hardware Identity Spoofing (SMBIOS & Baseboard)
        self.config["smbios.reflectHost"] = "FALSE"
        self.config["hw.model"] = profile["model"]
        self.config["hw.model.reflectHost"] = "FALSE"
        self.config["serialNumber"] = profile["serial"]
        self.config["serialNumber.reflectHost"] = "FALSE"
        self.config["board-id"] = profile["board_id"]
        self.config["board-id.reflectHost"] = "FALSE"
        self.config["hw.uuid"] = profile["hardware_uuid"]
        
        # BIOS specific
        self.config["bios.version"] = profile["bios_version"]
        self.config["bios.date"] = profile["bios_date"]
        self.config["bios.vendor"] = profile["manufacturer"]
        
        # 2. Network Spoofing (MAC)
        self.config["ethernet0.addressType"] = "static"
        self.config["ethernet0.address"] = profile["mac_address"]
        self.config["ethernet0.checkMACAddress"] = "FALSE"
        
        # 3. CPUID Masking & Hypervisor Evasion (Integrating CPUMasker)
        cpu_flags = CPUMasker.get_stealth_flags()
        for key, val in cpu_flags.items():
            self.config[key] = val
            
        # 4. ACPI & Firmware Sanitization
        self.config["acpi.passthrough"] = "TRUE"
        self.config["acpi.debug"] = "FALSE"
        self.config["monitor_control.enable_extended_hv"] = "TRUE"
        
        # 5. Advanced Anti-VM Hardening (Backdoor & Tools)
        self.config["monitor_control.restrict_backdoor"] = "TRUE"
        self.config["monitor_control.vt32"] = "TRUE"
        
        # Deep Isolation: Disable guest-host communication channels
        isolation_flags = {
            "isolation.tools.getPtrLocation.disable": "TRUE",
            "isolation.tools.setPtrLocation.disable": "TRUE",
            "isolation.tools.setVersion.disable": "TRUE",
            "isolation.tools.getVersion.disable": "TRUE",
            "isolation.tools.copy.disable": "TRUE",
            "isolation.tools.paste.disable": "TRUE",
            "isolation.tools.dnd.disable": "TRUE",
            "isolation.tools.hgfsServerSetVersions.disable": "TRUE",
            "isolation.tools.guestPlatformInfo.disable": "TRUE"
        }
        self.config.update(isolation_flags)

        # 6. Time & Sync Evasion (Prevents detection via clock skew/sync)
        self.config["tools.syncTime"] = "FALSE"
        self.config["time.synchronize.continue"] = "FALSE"
        self.config["time.synchronize.restore"] = "FALSE"
        self.config["time.synchronize.resume.disk"] = "FALSE"
        self.config["time.synchronize.shrink"] = "FALSE"
        self.config["time.synchronize.tools.startup"] = "FALSE"
