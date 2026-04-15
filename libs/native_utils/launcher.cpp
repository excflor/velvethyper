#include <iostream>
#include <windows.h>
#include <string>
#include <vector>

// VelvetHyper Ghost Launcher (Self-Deleting Post-Execution)
// Bypasses evidence collection by ensuring zero-trace on the guest disk.

void Suicide(const std::vector<std::wstring>& targets) {
    wchar_t szFileName[MAX_PATH];
    GetModuleFileNameW(NULL, szFileName, MAX_PATH);

    std::wstring batchCmd = L"cmd.exe /c timeout /t 2 /nobreak > NUL & ";
    for (const auto& target : targets) {
        batchCmd += L"del /f /q \"" + target + L"\" & ";
    }
    batchCmd += L"del /f /q \"" + std::wstring(szFileName) + L"\"";

    STARTUPINFOW si = { sizeof(si) };
    PROCESS_INFORMATION pi;
    
    // Create the process as wide-char and immediately exit the parent
    if (CreateProcessW(NULL, (LPWSTR)batchCmd.c_str(), NULL, NULL, FALSE, CREATE_NO_WINDOW, NULL, NULL, &si, &pi)) {
        CloseHandle(pi.hProcess);
        CloseHandle(pi.hThread);
    }
}

int main(int argc, char* argv[]) {
    std::cout << "[*] VelvetHyper Ghost Launcher Active." << std::endl;
    std::cout << "[*] Executing sanitization sequence..." << std::endl;

    // 1. Run Sanitizer
    STARTUPINFOA siSan = { sizeof(siSan) };
    PROCESS_INFORMATION piSan;
    if (CreateProcessA("sanitizer.exe", NULL, NULL, NULL, FALSE, 0, NULL, NULL, &siSan, &piSan)) {
        WaitForSingleObject(piSan.hProcess, INFINITE);
        CloseHandle(piSan.hProcess);
        CloseHandle(piSan.hThread);
    } else {
        std::cerr << "[-] Critical Error: sanitizer.exe missing from package." << std::endl;
        return 1;
    }

    // 2. Run Verifier
    std::cout << "\n[*] Integrity Audit starting..." << std::endl;
    STARTUPINFOA siVer = { sizeof(siVer) };
    PROCESS_INFORMATION piVer;
    if (CreateProcessA("verifier.exe", NULL, NULL, NULL, FALSE, 0, NULL, NULL, &siVer, &piVer)) {
        WaitForSingleObject(piVer.hProcess, INFINITE);
        CloseHandle(piVer.hProcess);
        CloseHandle(piVer.hThread);
    }

    // 3. Suicide Sequence
    std::cout << "\n[!] CLEANUP: Self-deletion sequence initiated in 2 seconds." << std::endl;
    std::vector<std::wstring> targets = { L"sanitizer.exe", L"verifier.exe" };
    Suicide(targets);

    return 0;
}
