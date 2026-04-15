import json
import random
import uuid
from pathlib import Path

class ProfileManager:
    def __init__(self, profiles_dir="profiles"):
        # Look for the profiles directory in the project root
        # This allows us to run main.py from the /engine subdirectory or from the root Makefile
        self.profiles_dir = Path(profiles_dir)
        if not self.profiles_dir.exists():
             # Try parent directory (if run from /engine)
             self.profiles_dir = Path("..") / profiles_dir
             if not self.profiles_dir.exists():
                 # Default back to root if nothing found
                 self.profiles_dir = Path("profiles")
        
        self.profiles_dir.mkdir(exist_ok=True)
        
        self.vendors = [
            {"name": "ASUSTeK COMPUTER INC.", "models": ["ROG STRIX B550-F", "PRIME Z590-A", "TUF GAMING X570-PLUS"]},
            {"name": "Micro-Star International Co., Ltd.", "models": ["MPG Z490 GAMING EDGE", "B450 TOMAHAWK MAX", "MEG X570 UNIFY"]},
            {"name": "Gigabyte Technology Co., Ltd.", "models": ["Z490 AORUS ELITE", "B550 AORUS ELITE", "X570 AORUS MASTER"]}
        ]

    def generate_random_mac(self):
        ouis = ["00:E0:4C", "00:15:5D", "BC:AE:C5", "E8:D8:D1", "30:9C:23"]
        oui = random.choice(ouis)
        suffix = ":".join(f"{random.randint(0, 255):02X}" for _ in range(3))
        return f"{oui}:{suffix}"

    def generate_random_serial(self, length=16):
        chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        return "".join(random.choice(chars) for _ in range(length))

    def create_profile(self, name):
        vendor_info = random.choice(self.vendors)
        profile_data = {
            "name": name,
            "manufacturer": vendor_info["name"],
            "model": random.choice(vendor_info["models"]),
            "board_id": self.generate_random_serial(12),
            "serial": self.generate_random_serial(16),
            "mac_address": self.generate_random_mac(),
            "hardware_uuid": str(uuid.uuid4()),
            "bios_version": f"{random.randint(1000, 9999)} v{random.randint(1, 9)}",
            "bios_date": f"{random.randint(1, 12):02d}/{random.randint(1, 28):02d}/202{random.randint(0, 5)}"
        }
        
        profile_path = self.profiles_dir / f"{name}.json"
        with open(profile_path, "w") as f:
            json.dump(profile_data, f, indent=4)
        
        return profile_data

    def load_profile(self, name):
        profile_path = self.profiles_dir / f"{name}.json"
        if profile_path.exists():
            with open(profile_path, "r") as f:
                return json.load(f)
        return None
