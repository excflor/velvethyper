# 🚀 VelvetHyper: Pro-Grade Stealth Virtualization

![Dashboard Preview](docs/assets/dashboard_preview.png)

`VelvetHyper` is a high-performance mission-control suite for hypervisor hardening and anti-cheat evasion. It transforms standard VMware virtual machines into stealthy environments that are indistinguishable from physical hardware.

---

## 🏗️ Project Structure
- **`apps/desktop_ui`**: The "Command Center" — A premium Electron/React dashboard for orchestration.
- **`libs/spoofer_core`**: The Python hardening engine for deep VMX manipulation.
- **`libs/native_utils`**: C++ Guest-side tools (Sanitizer, Verifier, and Ghost Launcher).
- **`profiles`**: Store for your randomized hardware identities (**JSON**).
- **`build`**: Primary directory for production-ready stealth payloads.

---

## ✅ Implementation Status
- [x] **Phase 1: Core Engine** (Deep VMX Hardening)
- [x] **Phase 2: Firmware & Identity** (CPUID, SMBIOS, ACPI Masking)
- [x] **Phase 3: Guest & Verifier** (C++ Forensic Registry Scrubbing)
- [x] **Phase 4: Command Center** (Integrated Electron Orchestrator)
- [x] **Phase 5: Production Stealth** (Ghost Launcher & RDTSC Timing Evasion)

---

## 🛠️ Quick Start (Development)
1.  **Install**: `npm install` in `apps/desktop_ui`
2.  **Run**: `npm run dev` inside `apps/desktop_ui`
3.  **Target**: Select your `.vmx`, Rotate Profile, and click **Initiate Deep Harden**.

---

## 📦 Production Usage
If you have built the application using `npm run build:win`, you will find a **Portable Executable** in `dist/`.

### 1. Host Hardening
Run `VelvetHyper.exe` on your Host PC. Select your target VM, apply the hardening flags, and click **Package Guest Tools**.

### 2. Guest Sanitization
Copy the generated files from the `build/` folder into your Guest VM. Run `launcher.exe` as **Administrator**.
- **Ghost Launcher**: This tool will silently uninstall hypervisor-aware drivers, scrub the registry, verify integrity, and then **self-delete** all traces from the Guest disk.

### 3. Final Step
**Reboot** your guest VM once the Ghost Launcher has finished its cleanup.

---
*VelvetHyper: Advanced Hypervisor Stealth & Orchestration Suite*
