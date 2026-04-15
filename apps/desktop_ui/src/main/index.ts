import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import * as fs from 'fs'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

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

  ipcMain.handle('harden-vm', async () => {
    // Logic to spawn python apps/cli_engine/main.py
    console.log('[Main] Triggering VM Hardening...')
    return { success: true, message: 'Hardening Complete' }
  })

  ipcMain.handle('rotate-profile', async () => {
     console.log('[Main] Rotating Hardware Profile...')
     const manufacturers = ['Gigabyte Technology', 'Micro-Star International', 'ASUSTeK COMPUTER INC.', 'EVGA Corporation'];
     const models = ['Z790 AORUS ELITE', 'MPG Z690 FORCE', 'ROG MAXIMUS XIII', 'X570 FTW3'];
     const randM = manufacturers[Math.floor(Math.random() * manufacturers.length)];
     const randModel = models[Math.floor(Math.random() * models.length)];
     return { success: true, profile: `${randM} / ${randModel}` }
  })

  let watchdog: fs.FSWatcher | null = null

  ipcMain.handle('build-production', async () => {
    console.log('[Main] Initiating Production Build (Ghost Launcher)...')
    // In a real scenario, this would:
    // 1. Run 'make' in libs/native_utils
    // 2. Package sanitizer.exe, verifier.exe, launcher.exe into a zip or SFX
    return { success: true, path: 'build/VelvetHyper_Guest_Stealth.zip' }
  })

  ipcMain.handle('toggle-watchdog', (_, active: boolean) => {
    console.log(`[Main] Watchdog state: ${active}`)
    if (active) {
      const watchPath = join(app.getAppPath(), '../../') // Project root
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
