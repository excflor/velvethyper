# VelvetHyper CPU Masking Engine
# Handles CPUID leaf spoofing for anti-cheat evasion

class CPUMasker:
    """
    CPUMasker generates the necessary VMX flags to mask hypervisor presence 
    and spoof CPU identity.
    """
    
    @staticmethod
    def get_stealth_flags():
        """
        Returns a dictionary of CPUID masking flags for high stealth.
        Focuses on Leaf 1 (ECX bit 31) and higher-tier leaf hiding.
        """
        flags = {
            # Leaf 1: ECX bit 31 must be 0 (Hypervisor present bit)
            # Binary mask: ----:----:----:----:----:----:----:---0
            "cpuid.1.ecx": "----:----:----:----:----:----:----:---0",
            
            # Hide the hypervisor signature at Leaf 0x40000000
            "cpuid.40000000.eax": "----:----:----:----:----:----:----:----",
            "cpuid.40000000.ebx": "----:----:----:----:----:----:----:----",
            "cpuid.40000000.ecx": "----:----:----:----:----:----:----:----",
            "cpuid.40000000.edx": "----:----:----:----:----:----:----:----",
            
            # Miscellaneous VMX Hiding
            "monitor_control.restrict_backdoor": "TRUE",
            "monitor_control.vt32": "TRUE",
            "monitor_control.enable_extended_hv": "TRUE"
        }
        return flags

    @staticmethod
    def get_vendor_spoof(vendor_id: str):
        """
        Spoofs CPU Vendor ID (e.g., GenuineIntel or AuthenticAMD)
        """
        # Note: This requires complex hex mapping for EBX, EDX, ECX of Leaf 0.
        # For now, we'll keep it simple and just provide a placeholder function.
        if "Intel" in vendor_id:
            return {
                "cpuid.0.ebx": "0111:0101:0110:1110:0110:0111:0100:1001", # Genu
                "cpuid.0.edx": "0100:1001:0110:1110:0110:0101:0110:1100", # neIn
                "cpuid.0.ecx": "0110:1100:0110:0101:0111:0100:0110:1001"  # tel
            }
        return {}
