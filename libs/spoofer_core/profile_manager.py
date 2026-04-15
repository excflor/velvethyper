"""
VelvetHyper Profile Manager
Manages serialized hardware identity profiles on disk.
"""

import json
import random
import uuid
from pathlib import Path


class ProfileManager:
    """
    Creates and loads hardware identity profiles from a given directory.
    The caller is responsible for providing a valid, absolute profiles path.
    """

    VENDORS: list[dict] = [
        {
            "name": "ASUSTeK COMPUTER INC.",
            "models": ["ROG STRIX B550-F", "PRIME Z590-A", "TUF GAMING X570-PLUS"],
        },
        {
            "name": "Micro-Star International Co., Ltd.",
            "models": ["MPG Z490 GAMING EDGE", "B450 TOMAHAWK MAX", "MEG X570 UNIFY"],
        },
        {
            "name": "Gigabyte Technology Co., Ltd.",
            "models": ["Z490 AORUS ELITE", "B550 AORUS ELITE", "X570 AORUS MASTER"],
        },
    ]

    def __init__(self, profiles_dir: Path) -> None:
        """
        Args:
            profiles_dir: Absolute path to the profiles directory.
                          Caller must ensure this path is correct.
        Raises:
            ValueError: If the provided path is not an absolute path.
        """
        if not profiles_dir.is_absolute():
            raise ValueError(
                f"profiles_dir must be an absolute path, got: {profiles_dir}"
            )
        self.profiles_dir = profiles_dir
        self.profiles_dir.mkdir(parents=True, exist_ok=True)

    def generate_random_mac(self) -> str:
        ouis = ["00:E0:4C", "00:15:5D", "BC:AE:C5", "E8:D8:D1", "30:9C:23"]
        oui = random.choice(ouis)
        suffix = ":".join(f"{random.randint(0, 255):02X}" for _ in range(3))
        return f"{oui}:{suffix}"

    def generate_random_serial(self, length: int = 16) -> str:
        chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        return "".join(random.choice(chars) for _ in range(length))

    def create_profile(self, name: str) -> dict:
        vendor_info = random.choice(self.VENDORS)
        profile_data = {
            "name": name,
            "manufacturer": vendor_info["name"],
            "model": random.choice(vendor_info["models"]),
            "board_id": self.generate_random_serial(12),
            "serial": self.generate_random_serial(16),
            "mac_address": self.generate_random_mac(),
            "hardware_uuid": str(uuid.uuid4()),
            "bios_version": f"{random.randint(1000, 9999)} v{random.randint(1, 9)}",
            "bios_date": (
                f"{random.randint(1, 12):02d}/"
                f"{random.randint(1, 28):02d}/"
                f"202{random.randint(0, 5)}"
            ),
        }

        profile_path = self.profiles_dir / f"{name}.json"
        with open(profile_path, "w") as f:
            json.dump(profile_data, f, indent=4)

        return profile_data

    def load_profile(self, name: str) -> dict | None:
        profile_path = self.profiles_dir / f"{name}.json"
        if profile_path.exists():
            with open(profile_path, "r") as f:
                return json.load(f)
        return None
