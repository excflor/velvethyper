# 🔮 VelvetHyper: Pro-Grade Stealth Virtualization Suite

`VelvetHyper` is a mission-control suite for VMware hypervisor hardening and anti-cheat evasion. It transforms standard virtual machines into environments indistinguishable from physical hardware by spoofing SMBIOS, CPUID, ACPI, MAC, and firmware identity layers.

---

## 🏗️ Project Structure

```
velvethyper/
├── apps/
│   ├── desktop_ui/          # Electron + React "Command Center" dashboard
│   └── cli_engine/
│       ├── harden.py        # CLI hardening entry point
│       └── main.py          # Interactive profile-based CLI
├── libs/
│   ├── spoofer_core/        # Python hardening engine (VMX, CPUID, profiles)
│   └── native_utils/        # C++ guest-side tools (Sanitizer, Verifier, Ghost Launcher)
├── profiles/                # Saved hardware identity profiles (JSON)
├── docs/                    # Project documentation & known issues
├── scripts/
│   └── clean.py             # Cross-platform build cleaner
└── Makefile                 # Master orchestration
```

---

## ✅ Implementation Status

- [x] **Phase 1: Core Engine** — Deep VMX hardening (SMBIOS, ACPI, MAC spoofing)
- [x] **Phase 2: Firmware & Identity** — CPUID masking, RDTSC evasion, hypervisor hide
- [x] **Phase 3: Guest & Verifier** — C++ forensic registry scrubbing, self-deleting launcher
- [x] **Phase 4: Command Center** — Integrated Electron orchestrator with bento-grid UI
- [x] **Phase 5: Production Polish** — Profile/harden sync, portable exe, cross-platform Makefile

---

## 🛠️ Quick Start

### Prerequisites
- Python 3.8+ (`python` or `python3` on `PATH`)
- Node.js 18+
- MinGW (for native utils compilation, optional)

### Install & Run
```bash
make install   # Install Python deps + UI npm packages
make dev       # Launch Command Center (dev mode with HMR)
make run       # Alias for 'make dev'
```

### Usage
1. **Select VMX** — Click the target path to open a `.vmx` file picker
2. **Generate Identity** — Click "Generate New Identity" to create a random hardware profile
3. **Harden** — Click "Initiate Deep Harden" — applies the exact profile shown in Session Identity to your VMX
4. **Package Guest Tools** — Compile and bundle the C++ guest-side sanitizer

---

## 📦 Makefile Reference

| Command | Description |
|---------|-------------|
| `make install` | Install all host & UI dependencies |
| `make dev` / `make run` | Launch Command Center in dev mode |
| `make build-ui` | Package portable Windows `.exe` |
| `make build-native` | Compile C++ guest payloads (MinGW) |
| `make harden VMX="path/to/vm.vmx"` | Harden a VMX from the command line |
| `make lint` | Lint TypeScript + Python sources |
| `make typecheck` | TypeScript type-check (no emit) |
| `make format` | Auto-format all sources |
| `make clean` | Deep-clean all build and cache files |
| `make release` | Bump version, tag, and push to GitHub |

---

## 🐍 CLI Usage

```bash
# Apply random stealth profile (standalone)
python apps/cli_engine/harden.py path/to/vm.vmx

# Check hardening status only (no modifications)
python apps/cli_engine/harden.py --check path/to/vm.vmx

# Interactive CLI with named profile
python apps/cli_engine/main.py --profile gaming_rig
```

---

## 🎭 Stealth Layers Applied

| Layer | Flags | Description |
|-------|-------|-------------|
| SMBIOS | 8 | Board ID, serial, UUID, manufacturer |
| BIOS | 3 | Vendor, version, date |
| Network | 3 | Static MAC from OUI database |
| CPUID | 5 | Hypervisor bit cleared, leaf 0x40000000 hidden |
| Anti-VM | 4 | Backdoor restriction, VT32, RDTSC, extended HV |
| Isolation | 9 | All guest-host communication channels disabled |
| Time Sync | 8 | All VMware clock sync mechanisms disabled |
| **Total** | **40** | **Flags applied per hardening run** |

---

## 📦 Production Build

```bash
make build-ui          # Produces apps/desktop_ui/dist/VelvetHyper-Portable-x.x.x.exe
```

The portable `.exe` bundles all Python scripts into `resources/` — no separate Python installation required on the host. The exe is self-contained and can be run from any directory.

### Guest Sanitization
1. Run `VelvetHyper.exe` → select VMX → harden  
2. Click **Package Guest Tools** to compile the C++ sanitizer  
3. Copy `build/launcher.exe` into the guest VM  
4. Run `launcher.exe` as **Administrator** in the guest — it will scrub hypervisor traces, verify integrity, and self-delete  
5. **Reboot** the guest VM  

---

## 🔧 Development

```bash
make lint        # ESLint (TS) + ruff (Python)
make typecheck   # tsc --noEmit
make format      # Prettier (TS) + ruff format (Python)
make clean       # Remove __pycache__, dist/, out/, build/
```

---

*VelvetHyper — Advanced Hypervisor Stealth & Orchestration Suite*
