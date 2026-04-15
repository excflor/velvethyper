"""
VelvetHyper CPU Masking Engine
Handles CPUID leaf spoofing for anti-cheat evasion.
"""


class CPUMasker:
    """
    Generates VMX flags to mask hypervisor presence and spoof CPU identity.
    """

    @staticmethod
    def get_stealth_flags() -> dict[str, str]:
        """
        Return CPUID masking flags for high stealth.
        Focuses on Leaf 1 (ECX bit 31) and hypervisor leaf hiding.
        """
        return {
            # Leaf 1: ECX bit 31 must be 0 (Hypervisor present bit)
            "cpuid.1.ecx": "----:----:----:----:----:----:----:---0",
            # Hide the hypervisor signature at Leaf 0x40000000
            "cpuid.40000000.eax": "----:----:----:----:----:----:----:----",
            "cpuid.40000000.ebx": "----:----:----:----:----:----:----:----",
            "cpuid.40000000.ecx": "----:----:----:----:----:----:----:----",
            "cpuid.40000000.edx": "----:----:----:----:----:----:----:----",
        }
