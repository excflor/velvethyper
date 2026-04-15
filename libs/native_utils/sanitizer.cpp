#include "common.h"
#include <iostream>
#include <windows.h>
#include <winreg.h>
#include <shlwapi.h>

#pragma comment(lib, "Shlwapi.lib")
#pragma comment(lib, "advapi32.lib")

void PrintBanner() {
    std::cout << COLOR_CYAN << COLOR_BOLD << "========================================" << std::endl;
    std::cout << "       VelvetHyper Ghost Sanitizer      " << std::endl;
    std::cout << "========================================" << COLOR_RESET << std::endl;
}

void ShowWarning() {
    std::cout << COLOR_RED << COLOR_BOLD << "[!] WARNING: CRITICAL SYSTEM MODIFICATION" << COLOR_RESET << std::endl;
    std::cout << COLOR_YELLOW << "This tool will PERMANENTLY DELETE VMware services and drivers " << std::endl;
    std::cout << "from the Windows registry. This action is IRREVERSIBLE." << std::endl;
    std::cout << "It may Cause BSOD if run on a non-hardened VM." << std::endl;
    std::cout << "Are you absolutely sure you want to proceed? (y/n): " << COLOR_RESET;
}

bool ScrubRegistry(const std::wstring& subkey) {
    HKEY hRoot = HKEY_LOCAL_MACHINE;
    LSTATUS status = RegDeleteTreeW(hRoot, subkey.c_str());
    if (status == ERROR_SUCCESS) {
        std::wcout << COLOR_GREEN << L"[+] Successfully scrubbed: " << subkey << COLOR_RESET << std::endl;
        return true;
    } else if (status != ERROR_FILE_NOT_FOUND) {
        std::wcout << COLOR_RED << L"[-] Failed to scrub: " << subkey << L" (Code: " << status << L")" << COLOR_RESET << std::endl;
    }
    return false;
}

void ScrubServices() {
    SC_HANDLE hSCM = OpenSCManager(NULL, NULL, SC_MANAGER_ALL_ACCESS);
    if (!hSCM) return;

    std::vector<std::wstring> services = { L"VMTools", L"vmware-authd", L"vmmouse", L"vmusb", L"vmvss", L"VGAuthService" };

    for (const auto& svcName : services) {
        SC_HANDLE hService = OpenServiceW(hSCM, svcName.c_str(), DELETE | SERVICE_STOP | SERVICE_QUERY_STATUS);
        if (hService) {
            SERVICE_STATUS status;
            ControlService(hService, SERVICE_CONTROL_STOP, &status);
            if (DeleteService(hService)) {
                 std::wcout << COLOR_GREEN << L"[+] Permanently DELETED service: " << svcName << COLOR_RESET << std::endl;
            } else {
                 std::wcout << COLOR_RED << L"[-] Failed to delete service: " << svcName << COLOR_RESET << std::endl;
            }
            CloseServiceHandle(hService);
        }
    }
    CloseServiceHandle(hSCM);
}

void UninstallVMwareTools() {
    std::cout << "[*] Attempting silent uninstallation of VMware Tools..." << std::endl;
    // Robust method: Use WMIC to find and uninstall by name
    // command: wmic product where "name like 'VMware Tools%%'" call uninstall /nointeractive
    STARTUPINFOA si = { sizeof(si) };
    PROCESS_INFORMATION pi;
    char cmd[] = "cmd.exe /c wmic product where \"name like 'VMware Tools%%'\" call uninstall /nointeractive";
    
    if (CreateProcessA(NULL, cmd, NULL, NULL, FALSE, CREATE_NO_WINDOW, NULL, NULL, &si, &pi)) {
        std::cout << COLOR_YELLOW << "[!] Uninstallation triggered. Please wait (this may take 2 minutes)..." << COLOR_RESET << std::endl;
        WaitForSingleObject(pi.hProcess, 120000); // Wait up to 2 minutes
        CloseHandle(pi.hProcess);
        CloseHandle(pi.hThread);
        std::cout << COLOR_GREEN << "[+] Uninstallation process completed." << COLOR_RESET << std::endl;
    } else {
        std::cout << COLOR_RED << "[-] Failed to trigger uninstallation." << COLOR_RESET << std::endl;
    }
}

int main() {
    PrintBanner();
    ShowWarning();

    char choice;
    std::cin >> choice;
    if (choice != 'y' && choice != 'Y') {
        std::cout << "[*] Sanitization aborted by user." << std::endl;
        return 0;
    }

    std::cout << "[*] Starting deep sanitization..." << std::endl;

    // 0. Uninstall VMware Tools (MSI)
    UninstallVMwareTools();

    // 1. Scrub Services (SCM)
    ScrubServices();

    // 2. Scrub Registry Keys
    for (const auto& path : VM_REGISTRY_PATHS) {
        ScrubRegistry(path);
    }

    // 3. Scrub System Identifiers
    // Spoofing HKLM\HARDWARE\Description\System\SystemBiosVersion
    HKEY hKey;
    if (RegOpenKeyExW(HKEY_LOCAL_MACHINE, L"HARDWARE\\Description\\System", 0, KEY_SET_VALUE, &hKey) == ERROR_SUCCESS) {
        const wchar_t* stealthBios = L"ALASKA - 1072009"; // Generic AMI BIOS string
        RegSetValueExW(hKey, L"SystemBiosVersion", 0, REG_SZ, (BYTE*)stealthBios, (wcslen(stealthBios) + 1) * sizeof(wchar_t));
        std::cout << COLOR_GREEN << "[+] Spoofed SystemBiosVersion" << COLOR_RESET << std::endl;
        RegCloseKey(hKey);
    }

    std::cout << COLOR_CYAN << "\n[*] Sanitization Complete. Reboot Recommended." << COLOR_RESET << std::endl;
    return 0;
}
