import os
import shutil

# Folders to delete
TO_DELETE = [
    'src',
    'libs',
    'apps',
    'main.py' # the old root main.py
]

def cleanup():
    print("Project 'VelvetHyper' - Starting Final Cleanup...")
    for item in TO_DELETE:
        if os.path.exists(item):
            if os.path.isdir(item):
                print(f"[*] Removing redundant directory: {item}")
                shutil.rmtree(item)
            else:
                print(f"[*] Removing redundant file: {item}")
                os.remove(item)
        else:
            print(f"[ ] {item} not found, already clean.")
    
    print("[SUCCESS] VelvetHyper is now following the Feature-based Root Best Practice.")

if __name__ == "__main__":
    cleanup()
