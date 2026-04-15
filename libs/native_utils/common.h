#ifndef VELVET_COMMON_H
#define VELVET_COMMON_H

#include <windows.h>
#include <iostream>
#include <vector>
#include <string>

// Anti-VM Stealth Colors (Console)
#define COLOR_RESET   "\033[0m"
#define COLOR_RED     "\033[31m"
#define COLOR_GREEN   "\033[32m"
#define COLOR_YELLOW  "\033[33m"
#define COLOR_CYAN    "\033[36m"
#define COLOR_BOLD    "\033[1m"

// Common VMware Identification strings
const std::vector<std::string> VM_DETECTION_STRINGS = {
    "VMware",
    "VMW",
    "Virtual Machine",
    "VMW0001",
    "Virtual Svga",
    "vmmouse.sys",
    "vmmemctl.sys",
    "vmtoolsd",
    "vmhgfs.sys"
};

// Common VMware Registry Paths to Scrub
const std::vector<std::wstring> VM_REGISTRY_PATHS = {
    L"SOFTWARE\\VMware, Inc.",
    L"SYSTEM\\CurrentControlSet\\Services\\VMTools",
    L"SYSTEM\\CurrentControlSet\\Services\\vmware-authd",
    L"SYSTEM\\CurrentControlSet\\Services\\vmvss",
    L"SYSTEM\\CurrentControlSet\\Services\\VGAuthService",
    L"HARDWARE\\ACPI\\DSDT\\VMWARE",
    L"HARDWARE\\ACPI\\FADT\\VMWARE"
};

// Common VMware MAC Address OUIs
const std::vector<std::string> VM_MAC_OUIS = {
    "00:05:69",
    "00:0C:29",
    "00:50:56"
};

#endif // VELVET_COMMON_H
