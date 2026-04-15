# VelvetHyper Design Specification

### Project Overview
`VelvetHyper` is a high-stealth virtualization suite designed to bypass kernel-level anti-cheats (like XIGNCODE3) by masking the presence of VMware.

### Architecture
1.  **Module A: The Engine (Python)**
    -   `profile_manager.py`: Responsible for generating and persisting unique hardware identifiers.
    -   `vmx_hardener.py`: Patches the `.vmx` configuration file to insert stealth flags and disable hypervisor-guest communication.
2.  **Module B: The Identity (C++/EDK2)**
    -   Handles deeper SMBIOS/ACPI structures and CPUID masking (EAX/ECX Leaf 1 Bit 31).
3.  **Module C: The Sanitizer (C++)**
    -   One-time execution inside the guest to scrub registry markers and driver traces.
4.  **Module D: The Dashboard (Electron/React)**
    -   Professional "One-Click" interface to manage profiles, automate VMware lifecycle, and verify stealth status.

### Hardware Profiling
Profiles are stored in `/profiles/*.json`. Each profile contains:
- `Manufacturer`: e.g., "ASUSTeK COMPUTER INC."
- `Model`: e.g., "ROG STRIX B550-F"
- `Serial`: Randomly generated 16-character string.
- `MAC`: Multi-vendor randomized (e.g., Intel, Realtek).
- `UUID`: Hardware-unique GUID.
- `BIOS_Version`: Randomized valid versions.
