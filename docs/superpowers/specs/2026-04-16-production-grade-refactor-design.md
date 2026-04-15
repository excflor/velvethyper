# VelvetHyper — Production-Grade Refactor Design Spec

> Authored: 2026-04-16 | Status: Approved

## Summary

Surgical cleanup of 19 known issues across Python, TypeScript/Electron, and Makefile layers.
No new features — all changes improve correctness, maintainability, and production safety.

Design decisions:
- Python entry-point: **Option A** — extract `__main__` from `vmx_hardener.py` → `apps/cli_engine/harden.py`
- Electron IPC: **Subfolder split** — `src/main/ipc/` with one file per domain
- React: **Hook + Components** — `hooks/useVmxState.ts` + 4 focused components
- Makefile clean: **Python helper script** — `scripts/clean.py` (cross-platform)

---

## Final Folder Structure

```
velvethyper/
├── Makefile                                ← rewritten: OS detection, all targets
├── scripts/
│   └── clean.py                            ← NEW: cross-platform cleaner
├── docs/
│   ├── KNOWN_ISSUES.md
│   └── superpowers/specs/
│       └── 2026-04-16-production-grade-refactor-design.md
│
├── apps/
│   ├── cli_engine/
│   │   ├── main.py                         ← fix: argparse for --profile
│   │   └── harden.py                       ← NEW: extracted entry-point
│   │
│   └── desktop_ui/src/
│       ├── main/
│       │   ├── index.ts                    ← slim: lifecycle + createWindow only
│       │   └── ipc/
│       │       ├── vmx.ipc.ts              ← NEW
│       │       ├── profile.ipc.ts          ← NEW
│       │       └── system.ipc.ts           ← NEW
│       ├── preload/index.ts                ← unchanged
│       └── renderer/src/
│           ├── App.tsx                     ← slim layout shell
│           ├── env.d.ts                    ← updated: rotateProfile return type
│           ├── hooks/
│           │   └── useVmxState.ts          ← NEW: all state + handlers
│           ├── components/
│           │   ├── HardeningCard.tsx       ← NEW
│           │   ├── IdentityCard.tsx        ← NEW
│           │   ├── TelemetryConsole.tsx    ← NEW
│           │   ├── StatusBar.tsx           ← NEW
│           │   └── Versions.tsx            ← DELETE
│           └── assets/
│               ├── main.css               ← unchanged
│               └── base.css               ← DELETE
│
└── libs/
    └── spoofer_core/
        ├── vmx_hardener.py                 ← fix: no __main__, no dupes, dynamic count
        ├── cpu_masker.py                   ← fix: remove unused get_vendor_spoof()
        ├── profile_manager.py              ← fix: explicit Path, no heuristic
        └── assets/
            └── hardware_profiles.json      ← fix: add serial_prefix per profile
```

---

## Python Changes

### `libs/spoofer_core/vmx_hardener.py`
- Remove entire `__main__` block (P-06)
- Remove duplicate `monitor_control.*` keys in RDTSC section (P-02)
- Replace hardcoded "42 flags applied" with dynamic counter (P-01)

### `libs/spoofer_core/cpu_masker.py`
- Delete `get_vendor_spoof()` static method (P-03)

### `libs/spoofer_core/profile_manager.py`
- Constructor accepts explicit `profiles_dir: Path` — no fallback heuristic (P-04)
- Raise `ValueError` if path doesn't exist instead of silently creating wrong dir

### `apps/cli_engine/harden.py` (NEW)
- Extracted logic from `vmx_hardener.py __main__` block
- Reads `serial_prefix` from profile JSON (P-07)
- Called by `Makefile harden` target and Electron IPC

### `apps/cli_engine/main.py`
- Add `argparse` with `--profile` argument (P-05)
- Default = `"default"`, not hardcoded name

### `libs/spoofer_core/assets/hardware_profiles.json`
- Add `"serial_prefix"` field to each profile entry (P-07)
- e.g., `"serial_prefix": "ASUS"` for ASUSTeK, `"serial_prefix": "MSI"` for Micro-Star

---

## TypeScript / Electron Changes

### `main/index.ts`
- Add top-level ESM imports: `child_process`, `util` (T-01)
- Remove all `ipcMain.handle()` calls — delegate to ipc modules
- Fix `appId` to `com.velvethyper.suite` (T-05)
- Call `registerVmxHandlers`, `registerProfileHandlers`, `registerSystemHandlers`

### `main/ipc/vmx.ipc.ts` (NEW)
- Exports `registerVmxHandlers(ipcMain: IpcMain): void`
- Handles: `harden-vm`, `check-vmx-status`, `select-vmx`
- Uses top-level `execAsync = promisify(exec)`

### `main/ipc/profile.ipc.ts` (NEW)
- Exports `registerProfileHandlers(ipcMain: IpcMain): void`
- Handles: `rotate-profile`
- Returns full profile: `{ success, manufacturer, model, serial, mac, type }` (T-04)

### `main/ipc/system.ipc.ts` (NEW)
- Exports `registerSystemHandlers(ipcMain: IpcMain): void`
- Handles: `toggle-watchdog`, `build-production`, `get-app-version`

### `renderer/src/App.tsx`
- Pure layout shell: imports `useVmxState` + 4 components
- No `useState`, no handlers, no `useEffect`

### `renderer/src/hooks/useVmxState.ts` (NEW)
- All `useState` declarations
- All `useEffect` (version fetch)
- All handler functions: `toggleHardening`, `handleRotateProfile`, `handleToggleWatchdog`, `handleSelectVMX`
- Returns typed object consumed by App

### `renderer/src/components/*.tsx` (NEW)
- `HardeningCard` — props: vmxPath, isHardened, isWatchdog, handlers
- `IdentityCard` — props: profile, onRotate
- `TelemetryConsole` — props: logs
- `StatusBar` — props: isHardened, appVersion, vmxPath, onSelectVMX

### `renderer/src/env.d.ts`
- Update `rotateProfile` return type: `{ success, manufacturer, model, serial, mac, type }`

---

## Makefile Changes

### Root `Makefile` (full rewrite)
- OS detection block for `PYTHON` variable (M-04)
- `run` target aliasing `dev` (M-01)
- `clean` calls `$(PYTHON) scripts/clean.py` (M-02)
- `lint`, `typecheck`, `format`, `test` targets (M-03)
- `harden` target calls `apps/cli_engine/harden.py`

### `scripts/clean.py` (NEW)
- Removes `__pycache__`, `*.pyc`, `*.pyo`
- Removes `build/`, `dist/`, `apps/desktop_ui/dist`, `apps/desktop_ui/out`
- Uses `pathlib` only — no shell dependency

---

## Verification Plan

1. `make dev` — app boots, no console errors
2. Select `.vmx` → status badge reflects real hardening state
3. Harden → flag count in log is dynamic (not "42")
4. Rotate Profile → UI shows backend serial/MAC, not frontend-random values
5. `make clean` — succeeds on Windows without bash errors
6. `make lint` + `make typecheck` — both exit 0
7. `make harden VMX=path/to/test.vmx` — invokes `harden.py`
