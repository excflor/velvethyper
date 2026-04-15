import os
import re

class VMXHardener:
    def __init__(self, vmx_path):
        self.vmx_path = vmx_path
        self.config = {}

    def read_config(self):
        if not os.path.exists(self.vmx_path):
            raise FileNotFoundError(f"VMX file not found: {self.vmx_path}")
        
        with open(self.vmx_path, "r") as f:
            for line in f:
                if "=" in line:
                    key, value = line.strip().split("=", 1)
                    self.config[key.strip()] = value.strip().replace('"', '')

    def write_config(self):
        with open(self.vmx_path, "w") as f:
            for key, value in self.config.items():
                f.write(f'{key} = "{value}"\n')

    def apply_stealth_profile(self, profile):
        # 1. Hardware Identity Spoofing
        self.config["hw.model"] = profile["model"]
        self.config["hw.model.reflectHost"] = "FALSE"
        self.config["serialNumber"] = profile["serial"]
        self.config["serialNumber.reflectHost"] = "FALSE"
        self.config["board-id"] = profile["board_id"]
        self.config["board-id.reflectHost"] = "FALSE"
        self.config["smbios.reflectHost"] = "FALSE"
        
        # 2. Network Spoofing
        self.config["ethernet0.addressType"] = "static"
        self.config["ethernet0.address"] = profile["mac_address"]
        self.config["ethernet0.checkMACAddress"] = "FALSE"
        
        # 3. CPUID Masking
        self.config["cpuid.1.ecx"] = "0---:----:----:----:----:----:----:----"
        
        # 4. Anti-VM Hardening
        self.config["monitor_control.restrict_backdoor"] = "TRUE"
        self.config["monitor_control.vt32"] = "TRUE"
        
        # 5. Isolation 
        self.config["isolation.tools.getPtrLocation.disable"] = "TRUE"
        self.config["isolation.tools.setPtrLocation.disable"] = "TRUE"
        self.config["isolation.tools.setVersion.disable"] = "TRUE"
        self.config["isolation.tools.getVersion.disable"] = "TRUE"
        self.config["isolation.tools.copy.disable"] = "TRUE"
        self.config["isolation.tools.paste.disable"] = "TRUE"
        self.config["isolation.tools.dnd.disable"] = "TRUE"
