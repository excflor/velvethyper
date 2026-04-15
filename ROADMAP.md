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

### Phase 3: Guest & Verifier (The Stealth)
- [ ] Guest Sanitizer (C++ registry & driver cleaning in `libs/native_utils`).
- [ ] VelvetVerifier (Built-in stealth status scanner).

### Phase 4: One-Click UI (The Dashboard)
- [ ] Electron App: Professional Dashboard in `apps/desktop_ui`.
- [ ] Integration with Spoofer Core.

### Phase 5: Production & Expansion
- [ ] Timing Evasion (RDTSC bypass).
- [ ] Stealth Service (Self-deleting Guest-side launcher).
