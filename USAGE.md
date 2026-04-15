# 🦾 VelvetHyper Operational Guide

Follow these steps to successfully harden your VMware environment and ensure maximum stealth against kernel-level anti-cheats.

---

## 🛠️ Phase 1: Host-Side Preparation (The Dashboard)

### 1. Launch the Dashboard
Open your terminal in the project root and start the Electron interface:
```bash
cd apps/desktop_ui
npm run dev
```

### 2. Configure Your Identity
- **Rotate Profile**: Click the **"Rotate Profile"** button until you find a hardware configuration (Manufacturer, Model, MAC) that feels natural.
- **Select VM**: Point the dashboard to your target `.vmx` file (Watchdog mode will handle this automatically if enabled).

### 3. Initiate Hardening
Click **"Initiate Deep Harden"**. 
> [!IMPORTANT]
> This process injects the Phase 5 **RDTSC Timing Evasion** and **Hypervisor Backdoor Restrictions** into your VM configuration. The VM must be **POWERED OFF** during this step.

### 4. Package Guest Payload
Click **"Package Guest Tools (Ghost Launcher)"**. This will generate a production-ready package in your `build/` folder containing:
- `launcher.exe` (The Ghost Launcher)
- `sanitizer.exe` (The Hardware Scrubber)
- `verifier.exe` (The Auditor)

---

## 👻 Phase 2: Guest-Side Sanitization (Inside the VM)

### 1. Transfer the Payload
Move the generated `launcher.exe`, `sanitizer.exe`, and `verifier.exe` into your Guest VM (e.g., via a USB drive or temporary network share).

### 2. Run the Ghost Launcher
Right-click `launcher.exe` and select **Run as Administrator**.

> [!CAUTION]
> **What Happens Next:**
> 1. **Automated Uninstall**: The tool will silently uninstall **VMware Tools**.
> 2. **Hardware Scrubbing**: It will purge all VMware registry keys and drivers.
> 3. **Verification**: It will run a final audit of your current hardware strings.
> 4. **Self-Deletion**: 2 seconds after completion, the launcher will **permanently delete** all three files from your guest disk to leave zero traces.

### 3. Final Reboot
Once the files have disappeared, **REBOOT** your Guest VM.

---

## 🛡️ Best Practices (OPSEC)

- **Always Uninstall VMware Tools**: Modern anti-cheats (like Vanguard/EAC) will flag the presence of VMware drivers (`.sys` files) even if the services are stopped. Use our automated uninstaller.
- **Re-Harden After VMX Changes**: If you change any VM settings (RAM, CPU cores), re-run the **Hardening Control** on the host.
- **Watchdog Mode**: Keep the **Auto-Watchdog** enabled in the dashboard to ensure your `.vmx` is always clean before the VM starts.

---
*VelvetHyper: Advanced Virtualization Stealth Suite*
