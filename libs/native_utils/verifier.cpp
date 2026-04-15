#include "common.h"
#include <iostream>
#include <intrin.h>
#include <windows.h>
#include <iphlpapi.h>

#pragma comment(lib, "iphlpapi.lib")

void PrintAuditHeader(const std::string& title) {
    std::cout << "\n" << COLOR_CYAN << COLOR_BOLD << "--- Audit: " << title << " ---" << COLOR_RESET << std::endl;
}

void AuditCPUID() {
    PrintAuditHeader("CPUID & Hypervisor Hardware");
    int cpuInfo[4];
    
    // Leaf 1: Features
    __cpuid(cpuInfo, 1);
    bool hypervisorBit = (cpuInfo[2] >> 31) & 1;
    
    if (hypervisorBit) {
        std::cout << COLOR_RED << "[!] Hypervisor Bit (Leaf 1, ECX Bit 31): DETECTED" << COLOR_RESET << std::endl;
    } else {
        std::cout << COLOR_GREEN << "[+] Hypervisor Bit (Leaf 1, ECX Bit 31): HIDDEN" << COLOR_RESET << std::endl;
    }

    // Leaf 0x40000000: Hypervisor Signature
    __cpuid(cpuInfo, 0x40000000);
    char vendor[13];
    memcpy(vendor, &cpuInfo[1], 4);
    memcpy(vendor + 4, &cpuInfo[2], 4);
    memcpy(vendor + 8, &cpuInfo[3], 4);
    vendor[12] = '\0';

    std::cout << "[*] CPUID 0x40000000 Signature: " << vendor << std::endl;
    if (strstr(vendor, "VMware") || strstr(vendor, "Xen") || strstr(vendor, "KVM")) {
        std::cout << COLOR_RED << "[!] Hypervisor Signature Found: " << vendor << COLOR_RESET << std::endl;
    } else {
        std::cout << COLOR_GREEN << "[+] No known Hypervisor Signature found." << COLOR_RESET << std::endl;
    }
}

void AuditSMBIOS() {
    PrintAuditHeader("SMBIOS & Firmware Strings");
    
    // Get SMBIOS data size
    DWORD smbiosSize = GetSystemFirmwareTable('RSMB', 0, NULL, 0);
    if (smbiosSize == 0) {
        std::cout << COLOR_RED << "[-] Failed to retrieve SMBIOS table size." << COLOR_RESET << std::endl;
        return;
    }

    PBYTE smbiosData = (PBYTE)malloc(smbiosSize);
    GetSystemFirmwareTable('RSMB', 0, smbiosData, smbiosSize);

    // Naive search for "VMware" in the table
    bool found = false;
    for (DWORD i = 0; i < smbiosSize - 6; i++) {
        if (memcmp(smbiosData + i, "VMware", 6) == 0 || memcmp(smbiosData + i, "VMW", 3) == 0) {
            std::cout << COLOR_RED << "[!] VMware indicator found in SMBIOS at offset: " << i << COLOR_RESET << std::endl;
            found = true;
            break;
        }
    }

    if (!found) {
        std::cout << COLOR_GREEN << "[+] No VMware indicators found in SMBIOS strings." << COLOR_RESET << std::endl;
    }

    free(smbiosData);
}

void AuditMAC() {
    PrintAuditHeader("MAC Address OUI Analysis");
    IP_ADAPTER_INFO AdapterInfo[16];
    DWORD dwBufLen = sizeof(AdapterInfo);

    if (GetAdaptersInfo(AdapterInfo, &dwBufLen) == NO_ERROR) {
        PIP_ADAPTER_INFO pAdapterInfo = AdapterInfo;
        while (pAdapterInfo) {
            char macStr[18];
            sprintf(macStr, "%02X:%02X:%02X:%02X:%02X:%02X",
                    pAdapterInfo->Address[0], pAdapterInfo->Address[1], pAdapterInfo->Address[2],
                    pAdapterInfo->Address[3], pAdapterInfo->Address[4], pAdapterInfo->Address[5]);

            std::cout << "[*] Adapter: " << pAdapterInfo->Description << " (" << macStr << ")" << std::endl;
            
            for (const auto& oui : VM_MAC_OUIS) {
                if (strncmp(macStr, oui.c_str(), 8) == 0) {
                    std::cout << COLOR_RED << "[!] Virtual MAC OUI Matches: " << oui << COLOR_RESET << std::endl;
                }
            }
            pAdapterInfo = pAdapterInfo->Next;
        }
    }
}

int main() {
    std::cout << COLOR_CYAN << COLOR_BOLD << "========================================" << std::endl;
    std::cout << "       VelvetHyper Stealth Verifier     " << std::endl;
    std::cout << "========================================" << COLOR_RESET << std::endl;

    AuditCPUID();
    AuditSMBIOS();
    AuditMAC();

    std::cout << "\n" << COLOR_CYAN << "[*] Audit Complete." << COLOR_RESET << std::endl;
    return 0;
}
