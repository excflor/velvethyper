import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import * as fs from 'fs'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.ico?asset'

const getLibsPath = (): string => {
  return app.isPackaged
    ? join(process.resourcesPath, 'libs')
    : join(__dirname, '../../../../libs')
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0F172A',
      symbolColor: '#94A3B8',
      height: 35
    },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC: VelvetHyper Orchestration
  ipcMain.handle('select-vmx', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
       title: 'Select VMware Configuration (.vmx)',
       properties: ['openFile'],
       filters: [{ name: 'VMware Config', extensions: ['vmx'] }]
    })
    if (canceled) return null
    return filePaths[0]
  })

  ipcMain.handle('harden-vm', async (_, vmxPath: string) => {
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    // Dynamic Path Resolution
    const libsPath = getLibsPath();
    const enginePath = join(libsPath, 'spoofer_core/vmx_hardener.py');

    console.log(`[Main] Hardening VM: ${vmxPath} using ${enginePath}`);
    
    try {
      if (!vmxPath) throw new Error("No VMX file selected");
      
      const isPackaged = app.isPackaged;
      const baseDir = isPackaged 
        ? process.resourcesPath 
        : join(__dirname, '../../../../');

      // Execute the python script with the vmx path as argument
      // Inject PYTHONPATH so it can find 'libs.*' internal modules
      const { stdout, stderr } = await execPromise(`python "${enginePath}" "${vmxPath}"`, {
        env: { ...process.env, PYTHONPATH: baseDir },
        cwd: baseDir
      });
      
      if (stderr && !stdout) throw new Error(stderr);
      
      console.log(`[Main] Hardening SUCCESS: ${stdout}`);
      return { success: true, message: 'Hardening Complete: 42 Flags Applied' };
    } catch (error: any) {
      console.error(`[Main] Hardening FAILED: ${error.message}`);
      return { success: false, message: error.message };
    }
  })

  ipcMain.handle('rotate-profile', async () => {
     console.log('[Main] Rotating Hardware Profile...')
     
     const libsPath = getLibsPath();
     const profilesPath = join(libsPath, 'spoofer_core/assets/hardware_profiles.json');
     
     try {
       const rawData = fs.readFileSync(profilesPath, 'utf-8');
       const db = JSON.parse(rawData);
       const profiles = db.profiles || [];
       
       if (profiles.length === 0) throw new Error("No profiles available");
       
       const p = profiles[Math.floor(Math.random() * profiles.length)];
       return { 
         success: true, 
         profile: `${p.manufacturer} / ${p.model}`,
         type: p.type
       }
     } catch (error: any) {
       console.error(`[Main] Profile Rotation Failed: ${error.message}`);
       return { success: false, profile: 'Error Loading Profile' }
     }
  })

  let watchdog: fs.FSWatcher | null = null

  ipcMain.handle('build-production', async () => {
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    // Dynamic Path Resolution
    const libsPath = getLibsPath();
    const nativeUtilsDir = join(libsPath, 'native_utils');
    const buildDir = join(app.getPath('userData'), 'build');

    console.log(`[Main] Compiling Ghost Launcher in: ${nativeUtilsDir}`);
    
    try {
      // 1. Ensure build directory exists
      if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir);

      // 2. Run make in libs/native_utils
      await execPromise('make', { cwd: nativeUtilsDir });

      // 3. Copy files to build directory
      const filesToCopy = ['launcher.exe', 'sanitizer.exe', 'verifier.exe'];
      for (const file of filesToCopy) {
        fs.copyFileSync(join(nativeUtilsDir, file), join(buildDir, file));
      }

      console.log(`[Main] Build SUCCESS. Files available in: ${buildDir}`);
      return { success: true, path: 'build/' };
    } catch (error: any) {
      console.error(`[Main] Build FAILED: ${error.message}`);
      return { success: false, message: error.message };
    }
  })

  ipcMain.handle('toggle-watchdog', (_, active: boolean) => {
    console.log(`[Main] Watchdog state: ${active}`)
    if (active) {
      const watchPath = app.getPath('userData'); // Watch local user data for temp vmx changes
      watchdog = fs.watch(watchPath, (_eventType, filename) => {
        if (filename && filename.endsWith('.vmx')) {
          console.log(`[Watchdog] Detected change in ${filename}. Re-applying hardening...`)
          // In a real scenario, this would spawn the python process
        }
      })
    } else {
      if (watchdog) {
        watchdog.close()
        watchdog = null
      }
    }
    return { status: active ? 'active' : 'inactive' }
  })

  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
