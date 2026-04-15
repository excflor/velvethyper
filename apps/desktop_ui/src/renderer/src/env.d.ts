/// <reference types="vite/client" />

interface Window {
  electron: {
    ipcRenderer: {
      send: (channel: string, data?: any) => void;
      on: (channel: string, func: (...args: any[]) => void) => void;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    }
  };
  api: {
    hardenVM: () => Promise<{ success: boolean; message: string }>;
    rotateProfile: () => Promise<{ success: boolean; profile: string }>;
    toggleWatchdog: (active: boolean) => Promise<{ status: string }>;
  };
}
