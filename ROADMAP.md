# VelvetHyper Roadmap

### Phase 1: The Core Engine (Foundation) [DONE]
- [x] Profile Engine: Random hardware identities (`libs/spoofer_core`).
- [x] VMX Hardener: Automated .vmx patching for stealth (`libs/spoofer_core`).
- [x] CLI Wrapper: One-Click generate & patch (`apps/cli_engine`).
- [x] Monorepo Restructuring: Best practice architecture (apps/libs).

### Phase 2: Firmware & Identity (The Core) [DONE]
- [x] CPU Masking (CPUID spoofing fine-tuning).
- [x] SMBIOS Patcher (Custom BIOS strings in firmware).
- [x] ACPI Sanitization (Scrub "VMWARE" from memory tables).

### Phase 3: Guest & Verifier (The Stealth) [DONE]
- [x] Guest Sanitizer (C++ registry & driver cleaning in `libs/native_utils`).
- [x] VelvetVerifier (Built-in stealth status scanner).
- [x] MinGW-w64 build system for native tools.

### Phase 4: One-Click UI (The Dashboard) [DONE]
- [x] Electron App: Professional Bento-Grid Dashboard in `apps/desktop_ui`.
- [x] IPC Bridge: Connected to Spoofer Core (Python/C++).
- [x] Real-time Telemetry: Live logs and status indicators.
- [x] Watchdog Mode: Auto-hardening toggle.
- [x] Portable EXE: Stealth-first packaging.

### Phase 5: Production & Expansion [DONE]
- [x] Timing Evasion (RDTSC bypass via hardware-passthrough).
- [x] Ghost Launcher (Self-deleting guest-side orchestration).
- [x] Automated VMware Tools Uninstallation.
- [x] One-Click Production Build in Dashboard.
