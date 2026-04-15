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

        # 6. Deep Timing & RDTSC Evasion (Phase 5: Production)
        # Bypasses "Timing Attacks" by exposing the host hardware TSC directly
        self.config["monitor_control.virtual_rdtsc"] = "FALSE"
        self.config["monitor_control.restrict_backdoor"] = "TRUE"
        self.config["monitor_control.vt32"] = "TRUE"
        self.config["monitor_control.enable_extended_hv"] = "TRUE"
        
        # 7. Time & Sync Evasion (Prevents detection via clock skew/sync)
        self.config["tools.syncTime"] = "FALSE"
        self.config["time.synchronize.continue"] = "FALSE"
        self.config["time.synchronize.restore"] = "FALSE"
        self.config["time.synchronize.resume.disk"] = "FALSE"
        self.config["time.synchronize.shrink"] = "FALSE"
        self.config["time.synchronize.tools.startup"] = "FALSE"
        self.config["time.synchronize.tools.enable"] = "FALSE"
        self.config["time.synchronize.resume.host"] = "FALSE"

    def verify_stealth(self):
        """
        Verifies if the loaded config matches the VelvetHyper "Stealth" signature.
        Checks for a subset of critical hardening flags.
        """
        critical_flags = {
            "smbios.reflectHost": "FALSE",
            "monitor_control.restrict_backdoor": "TRUE",
            "isolation.tools.copy.disable": "TRUE",
            "acpi.passthrough": "TRUE"
        }
        
        for key, expected in critical_flags.items():
            if self.config.get(key) != expected:
                return False
        
        # Check for CPUID pattern if present
        if "cpuid.1.ecx" in self.config:
            if not self.config["cpuid.1.ecx"].endswith("0"):
                return False
                
        return True

if __name__ == "__main__":
    import sys
    import uuid
    import random
    import json
    from pathlib import Path

    if len(sys.argv) < 2:
        print("Usage: python vmx_hardener.py [--check] <path_to_vmx>")
        sys.exit(1)

    # Handle --check mode
    check_mode = False
    vmx_target = sys.argv[1]
    
    if vmx_target == "--check":
        check_mode = True
        if len(sys.argv) < 3:
            print("Error: Missing VMX path for check")
            sys.exit(1)
        vmx_target = sys.argv[2]
    
    hardener = VMXHardener(vmx_target)
    hardener.read_config()

    if check_mode:
        if hardener.verify_stealth():
            print("STATUS: HARDENED")
        else:
            print("STATUS: UNHARDENED")
        sys.exit(0)

    # 0. Locate Hardware Profiles Database
    script_dir = Path(__file__).parent
    profiles_path = script_dir / "assets" / "hardware_profiles.json"
    
    if not profiles_path.exists():
        print(f"Error: Profile database missing at {profiles_path}")
        sys.exit(1)

    with open(profiles_path, "r") as f:
        db = json.load(f)
        profiles = db.get("profiles", [])

    if not profiles:
        print("Error: No profiles found in database.")
        sys.exit(1)

    # 1. Select a Random Hardware Profile
    p = random.choice(profiles)
    mfr = p["manufacturer"]
    
    # 2. Generate Real-World Style Identifiers
    serial_tag = mfr.split()[0].upper()[:4]
    if "ASUS" in serial_tag: serial_tag = "ASUS"
    elif "GIGA" in serial_tag: serial_tag = "GIGA"
    elif "MICR" in serial_tag: serial_tag = "MSI"

    stealth_profile = {
        "manufacturer": mfr,
        "model": p["model"],
        "bios_version": p["bios_version"],
        "bios_date": p["bios_date"],
        "serial": f"{serial_tag}-{uuid.uuid4().hex[:12].upper()}",
        "board_id": f"MB-{uuid.uuid4().hex[:8].upper()}",
        "hardware_uuid": str(uuid.uuid4()),
        "mac_address": f"{p['mac_oui']}:{random.getrandbits(8):02X}:{random.getrandbits(8):02X}:{random.getrandbits(8):02X}"
    }

    # 3. Apply Hardening
    hardener.apply_stealth_profile(stealth_profile)
    hardener.write_config()
    
    print(f"[*] VelvetHyper Hardening Success: 42 flags applied to {vmx_target}")
    print(f"[*] Profile Applied: {mfr} / {p['model']} ({p['type']})")
