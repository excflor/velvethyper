/// <reference types="vite/client" />

interface HardwareProfileData {
  manufacturer: string
  model: string
  bios_version: string
  bios_date: string
  type: string
  serial: string
  board_id: string
  hardware_uuid: string
  mac: string
}

interface Window {
  electron: {
    process: {
      versions: {
        electron: string
        chrome: string
        node: string
      }
    }
    ipcRenderer: {
      send: (channel: string, data?: any) => void
      on: (channel: string, func: (...args: any[]) => void) => void
      invoke: (channel: string, ...args: any[]) => Promise<any>
    }
  }
  api: {
    hardenVM: (
      vmxPath: string,
      profile: HardwareProfileData
    ) => Promise<{ success: boolean; message: string }>
    checkVMXStatus: (vmxPath: string) => Promise<{ isHardened: boolean }>
    rotateProfile: () => Promise<{ success: boolean } & HardwareProfileData>
    toggleWatchdog: (active: boolean) => Promise<{ status: string }>
    buildProduction: () => Promise<{ success: boolean; path: string }>
    selectVMX: () => Promise<string | null>
    getAppVersion: () => Promise<string>
  }
}
