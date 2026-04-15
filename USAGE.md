# 🚀 VelvetHyper: 3-Step Stealth Guide

Follow this simplified sequence for maximum anti-cheat evasion.

---

## 💻 Step 1: Host Preparation (Your Main PC)

1.  **Target your VM**: Open the Dashboard (`npm run dev`), click **"Target: NONE SELECTED"** in the Hardening card, and select your `.vmx` file.
2.  **Apply Hardening**: Ensure the VM is **OFF**, then click **"Initiate Deep Harden"**.
3.  **Get Guest Payload**: Click **"Package Guest Tools"**. Copy the 3 files generated in the `build/` folder to your Guest VM.

---

## 👻 Step 2: Guest Scrubbing (Inside the VM)

1.  **Run Launcher**: Right-click `launcher.exe` and select **Run as Administrator**.
2.  **Wait for Cleanup**: The tool will automatically uninstall VMware tools, scrub the registry, and then **self-delete** all 3 files.
3.  **Reboot**: Once the files disappear, **REBOOT** the Guest VM immediately.

---

## ⚠️ Mission-Critical Tips (OPSEC)

-   **Never skip the Reboot**: The stealth state is only fully active after the guest OS re-initializes its drivers without VMware artifacts.
-   **Active Watchdog**: Keep **Auto-Watchdog** ON in the dashboard. It will auto-harden your VM if you accidentally change any settings in the VMware GUI.
-   **Firmware Rotation**: Rotate your profile frequently to avoid "static identity" flagging across different game accounts.

---
*VelvetHyper: Advanced Virtualization Stealth Suite*
