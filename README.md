# VelvetHyper: Pro-Grade Stealth Virtualization

`VelvetHyper` is a hybrid monorepo for hardware spoofing and anti-cheat evasion. It aims to make VMware virtual machines indistinguishable from physical hardware.

## Project Structure
- `/apps`
    - `cli_engine`: The primary command-line tool for Phase 1 (Python).
    - `desktop_ui`: Future Electron-based dashboard.
- `/libs`
    - `spoofer_core`: Shared Python logic for VMX and Profiling.
    - `native_utils`: Future C++ components for guest sanitization.
    - `firmware_patcher`: Future UEFI/EDK2 components.
- `/profiles`: Storage for your hardware identities (JSON).
- `/docs`: Detailed architecture and roadmap.

## Implementation Status
- [x] **Phase 1: Core Engine** (Python logic & VMX hardening)
- [x] **Phase 2: Firmware & Identity** (CPUID, SMBIOS, ACPI)
- [x] **Phase 3: Guest & Verifier** (C++ Sanitizer and Stealth Audit)
- [ ] **Phase 4: One-Click UI** (Electron Dashboard) [IN PROGRESS]

## Quick Start
1.  **Configure**: Place your `.vmx` file in the root.
2.  **Harden**: `make run-cli`
3.  **Module C: The Sanitizer (C++) [DONE]**
    - One-time execution inside the guest to scrub registry markers and driver traces.
    - Includes `VelvetVerifier` for in-guest stealth auditing.
4.  **Module D: The Dashboard (Electron/React) [NEXT]**
    - Professional "One-Click" interface to manage profiles, automate VMware lifecycle, and verify stealth status.
- Python 3.8+
- VMware Workstation/Player
- Make (optional, but recommended)

---
> [!IMPORTANT]
> Always backup your `.vmx` files before applying hardening.
