# VelvetHyper — Known Issues Audit

> Auto-generated during production-grade review · 2026-04-16

---

## Python (`libs/spoofer_core`)

### [P-01] Hardcoded flag count magic string
**File:** `libs/spoofer_core/vmx_hardener.py:192`
**Issue:** `"42 flags applied"` is a hand-written literal that doesn't reflect the actual count of flags set by `apply_stealth_profile()`. If flags are added or removed, this silently lies.
**Fix:** Replace with `len(self.config)` delta or a dedicated counter that increments inside `apply_stealth_profile()`.

---

### [P-02] Duplicate VMX keys set twice
**File:** `libs/spoofer_core/vmx_hardener.py:59-63` and `81-84`
**Issue:** `monitor_control.restrict_backdoor`, `monitor_control.vt32`, and `monitor_control.enable_extended_hv` are written in two separate blocks (ACPI section and RDTSC section). The duplicate assignment is silently overwritten — it's misleading and risks divergence if one copy is edited.
**Fix:** Remove the duplicate block at lines 81-84. Keep a single authoritative write per key.

---

### [P-03] Unused function `get_vendor_spoof()`
**File:** `libs/spoofer_core/cpu_masker.py:35-47`
**Issue:** `CPUMasker.get_vendor_spoof()` is defined but never called anywhere in the codebase. It also contains a comment admitting it's a placeholder.
**Fix:** Either implement and wire it into `apply_stealth_profile()`, or delete it entirely. Unused code is a stealth risk and maintenance burden.

---

### [P-04] Fragile multi-level path heuristic in `ProfileManager`
**File:** `libs/spoofer_core/profile_manager.py:10-16`
**Issue:** The constructor tries 3 different relative path guesses to locate the `profiles/` directory. This is brittle and will silently fall back to a wrong path.
**Fix:** Accept an explicit `Path` object in the constructor and always resolve it to an absolute path. Callers should pass the correct path (e.g., `project_root / "profiles"`). Remove path-guessing logic entirely.

---

### [P-05] Hardcoded profile name in CLI engine
**File:** `apps/cli_engine/main.py:25`
**Issue:** `profile_name = "Default_Gaming_PC"` is a hardcoded constant with no way to override it from the command line.
**Fix:** Accept profile name as a CLI argument (e.g., `argparse`) or fall back to a configurable default constant at the top of the file.

---

### [P-06] Entry-point logic embedded inside a library module
**File:** `libs/spoofer_core/vmx_hardener.py:119-193`
**Issue:** The `if __name__ == "__main__":` block inside a library module turns it into a dual-purpose file — it's both a class library and a runnable script. This breaks the single-responsibility principle and makes the module harder to import and test.
**Fix (chosen: Option A):** Extract the entry-point logic into `apps/cli_engine/harden.py`. Keep `VMXHardener` as a pure class. The Makefile `harden` target and Electron IPC handler will invoke `harden.py` instead.

---

### [P-07] Serial tag string matching with magic prefixes
**File:** `libs/spoofer_core/vmx_hardener.py:172-175`
**Issue:** The serial prefix is derived by slicing `mfr.split()[0][:4]` and then patching with hardcoded `if/elif` strings (`"ASUS"`, `"GIGA"`, `"MICR"`). This is fragile and won't generalize to new manufacturers.
**Fix:** Store the `serial_prefix` field directly in `hardware_profiles.json` alongside each profile. Read it from the data, not from string-matching the manufacturer name.

---

### [P-08] Vestigial `base.css` leftover from Electron Vite template
**File:** `apps/desktop_ui/src/renderer/src/assets/base.css`
**Issue:** `base.css` is never imported anywhere. It contains default Electron Vite template body styles that conflict with the Tailwind setup (dual `body` declarations, old font stack).
**Fix:** Delete `base.css`. All base styles are correctly handled by `main.css` via `@layer base`.

---

## TypeScript / Electron (`apps/desktop_ui`)

### [T-01] `require()` calls inside `ipcMain` handlers (CommonJS in ESM context)
**File:** `apps/desktop_ui/src/main/index.ts:77-79`, `113-115`, `167-169`
**Issue:** `require('child_process')` and `require('util')` are used inside IPC handlers. This is CommonJS syntax in an ESM/TypeScript module—it works via Electron's special loader but is inconsistent and defers module resolution to runtime.
**Fix:** Add `import { exec } from 'child_process'` and `import { promisify } from 'util'` at the top of `index.ts`. Create a single `execAsync = promisify(exec)` binding used across all handlers.

---

### [T-02] Monolithic `main/index.ts` — all IPC in one file
**File:** `apps/desktop_ui/src/main/index.ts` (242 lines)
**Issue:** All IPC handlers (`harden-vm`, `check-vmx-status`, `rotate-profile`, `toggle-watchdog`, `build-production`, `select-vmx`, `get-app-version`) are registered inline in a single file alongside `createWindow()` and app lifecycle. It's unmaintainable.
**Fix:** Extract IPC handlers into `apps/desktop_ui/src/main/ipc/` subdirectory with one file per domain: `vmx.ipc.ts`, `profile.ipc.ts`, `system.ipc.ts`. Each exports a `register(ipcMain)` function called from `index.ts`.

---

### [T-03] Hardcoded hardware profile in React state initial value
**File:** `apps/desktop_ui/src/renderer/src/App.tsx:8-13`
**Issue:** The initial `currentProfile` state contains hardcoded real-looking values (`"ASUSTeK COMPUTER INC."`, `"ROG STRIX B550-F"`, a fake serial, a fake MAC). These appear in the UI on startup before any real profile is loaded.
**Fix:** Initialize state with `null` or a typed empty sentinel. Render a "No profile loaded" placeholder until a real profile is returned from `rotateProfile()` or loaded on startup.

---

### [T-04] Frontend generating fake serial/MAC values
**File:** `apps/desktop_ui/src/renderer/src/App.tsx:57-58`
**Issue:** After `rotateProfile()` succeeds, the renderer generates its own random serial and MAC (`Math.random().toString(36)...`) that are completely disconnected from what the Python engine actually applied. The UI shows fake data that doesn't match the real VMX.
**Fix:** Return the full profile object (`serial`, `mac_address`, `model`, `manufacturer`) from the `rotate-profile` IPC handler. The renderer must only display what it received from the backend.

---

### [T-05] `appId` is a generic placeholder
**File:** `apps/desktop_ui/src/main/index.ts:56`
**Issue:** `electronApp.setAppUserModelId('com.electron')` uses the Electron template default. This affects Windows taskbar grouping and notification behavior.
**Fix:** Set it to match `electron-builder.yml`: `electronApp.setAppUserModelId('com.velvethyper.suite')`.

---

### [T-06] Monolithic `App.tsx` — 227 lines with no component decomposition
**File:** `apps/desktop_ui/src/renderer/src/App.tsx`
**Issue:** The root `App` component contains all state management, all event handlers, and all JSX for every panel. `ProfileItem` is the only extracted component, and it's defined in the same file.
**Fix:** Split into focused components:
- `components/HardeningCard.tsx` — main action card
- `components/IdentityCard.tsx` — session identity panel
- `components/TelemetryConsole.tsx` — log output panel
- `components/StatusBar.tsx` — header with status badge
- `hooks/useVmxState.ts` — extract all state + handlers into a custom hook

---

### [T-07] Unused `Versions.tsx` component
**File:** `apps/desktop_ui/src/renderer/src/components/Versions.tsx`
**Issue:** `Versions.tsx` is a leftover from the Electron Vite template. It displays Node/Chrome/Electron version info and is never imported or used anywhere.
**Fix:** Delete the file.

---

## Makefile (Root)

### [M-01] `run` target does not exist — `make run dev` fails
**File:** `Makefile`
**Issue:** `make run dev` was attempted but only `dev` exists as a target. Make interprets `run` as the target and `dev` as a file dependency, so it errors.
**Fix:** Add a `run` alias target: `run: dev` — or document in `make help` that the correct command is `make dev`.

---

### [M-02] `clean` uses bash glob syntax — broken on Windows
**File:** `Makefile:55-56`
**Issue:** `rm -rf **/(__pycache__|.pytest_cache)` and `rm -f **/*.pyc` use bash extended glob syntax (`**`) which is not supported by Windows `cmd.exe` or MSYS Make without bash explicitly.
**Fix:** Replace with explicit `find`-based commands using `git clean -fdX` for tracked ignores, or use Python's `pathlib` in a helper script (`scripts/clean.py`) invoked from Make.

---

### [M-03] No `lint`, `typecheck`, `format`, or `test` targets
**File:** `Makefile`
**Issue:** The UI's `package.json` already defines `lint`, `typecheck`, `format` scripts, but they're not surfaced in the root Makefile. Python linting (e.g., `ruff`, `mypy`) has no target either.
**Fix:** Add:
- `make lint` → runs `cd apps/desktop_ui && npm run lint` + `ruff check libs/`
- `make typecheck` → runs `cd apps/desktop_ui && npm run typecheck`
- `make format` → runs `cd apps/desktop_ui && npm run format` + `ruff format libs/`
- `make test` → placeholder for future pytest

---

### [M-04] No OS-detection for Python binary
**File:** `Makefile:4`
**Issue:** `PYTHON = python` may resolve to Python 2 on some systems. There's no Windows/Unix detection.
**Fix:** Add detection:
```makefile
ifeq ($(OS),Windows_NT)
  PYTHON := python
else
  PYTHON := python3
endif
```

---

## Summary Table

| ID | Severity | Area | Status |
|----|----------|------|--------|
| P-01 | Medium | Python | ⬜ Open |
| P-02 | Low | Python | ⬜ Open |
| P-03 | Low | Python | ⬜ Open |
| P-04 | High | Python | ⬜ Open |
| P-05 | Medium | Python | ⬜ Open |
| P-06 | High | Python | ⬜ Open |
| P-07 | Medium | Python | ⬜ Open |
| P-08 | Low | Python | ⬜ Open |
| T-01 | Medium | TypeScript | ⬜ Open |
| T-02 | High | TypeScript | ⬜ Open |
| T-03 | Medium | TypeScript | ⬜ Open |
| T-04 | High | TypeScript | ⬜ Open |
| T-05 | Low | TypeScript | ⬜ Open |
| T-06 | High | TypeScript | ⬜ Open |
| T-07 | Low | TypeScript | ⬜ Open |
| M-01 | High | Makefile | ⬜ Open |
| M-02 | High | Makefile | ⬜ Open |
| M-03 | Medium | Makefile | ⬜ Open |
| M-04 | Low | Makefile | ⬜ Open |
