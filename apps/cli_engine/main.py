import os
import sys
from pathlib import Path

# Production-grade relative-package imports
current_dir = Path(__file__).resolve().parent
project_root = current_dir.parent.parent
sys.path.append(str(project_root))

from libs.spoofer_core.profile_manager import ProfileManager
from libs.spoofer_core.vmx_hardener import VMXHardener

def main():
    print("========================================")
    print("   VelvetHyper v1.0 - Stealth Engine    ")
    print("========================================")
    
    # Initialize engines
    current_dir = Path(__file__).resolve().parent
    project_root = current_dir.parent
    profiles_dir = project_root / "profiles"
    
    pm = ProfileManager(profiles_dir=profiles_dir)
    
    profile_name = "Default_Gaming_PC"
    profile = pm.load_profile(profile_name)
    
    if not profile:
        print(f"[*] Generating new stealth profile: {profile_name}...")
        profile = pm.create_profile(profile_name)
    else:
        print(f"[*] Loaded existing profile: {profile_name}")

    # Search for .vmx in current working directory (where the user runs the command)
    vmx_files = [f for f in os.listdir('.') if f.endswith('.vmx')]
    
    if not vmx_files:
        print("[!] No .vmx files found in current directory.")
        target_vmx = input("[?] Enter the full path to your .vmx file: ").strip().replace('"', '')
    else:
        print(f"[*] Found VM: {vmx_files[0]}")
        target_vmx = vmx_files[0]

    if not os.path.exists(target_vmx):
        print(f"[ERROR] Specified file not found: {target_vmx}")
        sys.exit(1)

    try:
        hardener = VMXHardener(target_vmx)
        hardener.read_config()
        hardener.apply_stealth_profile(profile)
        hardener.write_config()
        print("[SUCCESS] VM is now hardened. You can launch VMware.")
    except Exception as e:
        print(f"[ERROR] Failed to harden VM: {str(e)}")

if __name__ == "__main__":
    main()
