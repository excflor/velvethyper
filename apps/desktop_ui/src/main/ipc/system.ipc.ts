import { exec } from 'child_process'
import * as fs from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import { app, IpcMain } from 'electron'

const execAsync = promisify(exec)

let watchdog: fs.FSWatcher | null = null

export function registerSystemHandlers(ipcMain: IpcMain): void {
  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })

  ipcMain.handle('toggle-watchdog', (_, active: boolean) => {
    console.log(`[Main] Watchdog state: ${active}`)

    if (active) {
      const watchPath = app.getPath('userData')
      watchdog = fs.watch(watchPath, (_eventType, filename) => {
        if (filename && filename.endsWith('.vmx')) {
          console.log(`[Watchdog] Detected change in ${filename}. Re-applying hardening...`)
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

  ipcMain.handle('build-production', async () => {
    const libsPath = app.isPackaged
      ? join(process.resourcesPath, 'libs')
      : join(__dirname, '../../../../libs')
    const nativeUtilsDir = join(libsPath, 'native_utils')
    const buildDir = join(app.getPath('userData'), 'build')

    console.log(`[Main] Compiling Ghost Launcher in: ${nativeUtilsDir}`)

    try {
      if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true })

      await execAsync('make', { cwd: nativeUtilsDir })

      const filesToCopy = ['launcher.exe', 'sanitizer.exe', 'verifier.exe']
      for (const file of filesToCopy) {
        fs.copyFileSync(join(nativeUtilsDir, file), join(buildDir, file))
      }

      console.log(`[Main] Build SUCCESS. Files available in: ${buildDir}`)
      return { success: true, path: buildDir }
    } catch (error: any) {
      console.error(`[Main] Build FAILED: ${error.message}`)
      return { success: false, path: '' }
    }
  })
}
