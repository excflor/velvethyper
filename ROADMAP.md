# 🚀 VelvetHyper: The Stealth Evolution Roadmap

### ✅ Phase 1: Core Engine (Foundation) [DONE]
- [x] Profile Engine: Random hardware identities (`libs/spoofer_core`).
- [x] VMX Hardener: Automated .vmx patching for stealth.
- [x] CLI Wrapper: One-Click generate & patch.
- [x] Monorepo Restructuring: Best practice architecture (apps/libs).

### ✅ Phase 2: Firmware & Identity (The Core) [DONE]
- [x] CPU Masking: CPUID leaf-1 and leaf-40000000 hiding.
- [x] SMBIOS Patcher: Custom BIOS/Baseboard strings.
- [x] ACPI Sanitization: Removal of "VMWARE" from memory tables.

### ✅ Phase 3: Guest & Verifier (The Stealth) [DONE]
- [x] Guest Sanitizer: C++ registry & driver cleaning.
- [x] VelvetVerifier: Built-in stealth status scanner.
- [x] MinGW-w64 build system for native tools.

### ✅ Phase 4: One-Click UI (Command Center) [DONE]
- [x] Electron App: Professional "Command Center" Dashboard.
- [x] IPC Bridge: Live connection to Python & C++ engines.
- [x] Real-time Telemetry: Live logs and status indicators.
- [x] Portable EXE: One-Click production packaging.

### ✅ Phase 5: Production Stealth [DONE]
- [x] Timing Evasion: RDTSC bypass via hardware-passthrough.
- [x] Ghost Launcher: Self-deleting guest-side orchestration.
- [x] Automatic VMware Tools uninstallation & cleanup.

---

### 📡 Phase 6: Network-Level Stealth (Next Improvement)
- [ ] **OUI Sync**: Dynamic MAC generation that matches the spoofed Motherboard's Manufacturer.
- [ ] **Jitter Masking**: `scapy`-driven analysis to smooth network timing jitter caused by hypercalls.
- [ ] **Protocol Masking**: Blocking HGFS/VMCI network beacons at the host firewall level.

### 🛡️ Phase 7: Kernel-Mode & Firmware Hide
- [ ] **VGA BIOS/VBT Virtualization**: Spoofing the Video BIOS Table to hide VMware SVGA II signatures.
- [ ] **DSDT/SSDT Dynamic Injection**: Advanced ACPI table rewriting for kernel-level driver hiding.
- [ ] **I/O Port Masking**: Restricting access to 0x5658 (VMWare I/O Port) from the guest.

### 🤖 Phase 8: Adaptive Identity Engine
- [ ] **AI Profile Generator**: Training a model to generate hardware profiles based on real-world telemetry (Valve Hardware Survey data).
- [ ] **Cloud Profile Cloud**: Syncing and downloading fresh, verified stealth profiles from a central repository.

### 🖥️ Phase 9: Multi-Hypervisor Support
- [ ] **KVM/QEMU Integration**: Porting the VMX hardening logic to libvirt XML and QEMU arguments.
- [ ] **Hyper-V Stealth**: Advanced hardening for Windows Subsystem for Linux (WSL2) and nested environments.

---
*VelvetHyper: Redefining Virtualization Stealth.*
