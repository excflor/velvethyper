/// <reference types="vite/client" />

interface Window {
  electron: {
    process: {
      versions: {
        electron: string;
        chrome: string;
        node: string;
      }
    };
    ipcRenderer: {
      send: (channel: string, data?: any) => void;
      on: (channel: string, func: (...args: any[]) => void) => void;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    }
  };
  api: {
    hardenVM: (vmxPath: string) => Promise<{ success: boolean; message: string }>;
    rotateProfile: () => Promise<{ success: boolean; profile: string }>;
    toggleWatchdog: (active: boolean) => Promise<{ status: string }>;
    buildProduction: () => Promise<{ success: boolean; path: string }>;
    selectVMX: () => Promise<string | null>;
  };
}
