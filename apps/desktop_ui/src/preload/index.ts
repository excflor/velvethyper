import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  hardenVM: (vmxPath: string) => ipcRenderer.invoke('harden-vm', vmxPath),
  rotateProfile: () => ipcRenderer.invoke('rotate-profile'),
  toggleWatchdog: (active: boolean) => ipcRenderer.invoke('toggle-watchdog', active),
  buildProduction: () => ipcRenderer.invoke('build-production'),
  selectVMX: () => ipcRenderer.invoke('select-vmx'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
