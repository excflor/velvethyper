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

## Quick Start (Phase 1)
1.  **Configure**: Place your `.vmx` file in the root or provide a path.
2.  **Run**:
    ```bash
    make run-cli
    ```
3.  **Result**: Your `.vmx` is now hardened and ready to launch.

## Requirements
- Python 3.8+
- VMware Workstation/Player
- Make (optional, but recommended)

---
> [!IMPORTANT]
> Always backup your `.vmx` files before applying hardening.
