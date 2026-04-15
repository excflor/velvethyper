import { exec } from 'child_process'
import * as fs from 'fs'
import * as os from 'os'
import { join } from 'path'
import { promisify } from 'util'
import { app, dialog, IpcMain } from 'electron'

const execAsync = promisify(exec)

const getBaseDir = (): string =>
  app.isPackaged ? process.resourcesPath : join(__dirname, '../../../../')

export function registerVmxHandlers(ipcMain: IpcMain): void {
  ipcMain.handle('select-vmx', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Select VMware Configuration (.vmx)',
      properties: ['openFile'],
      filters: [{ name: 'VMware Config', extensions: ['vmx'] }]
    })
    return canceled ? null : filePaths[0]
  })

  ipcMain.handle('harden-vm', async (_, vmxPath: string, profile: any) => {
    if (!vmxPath) return { success: false, message: 'No VMX file selected' }
    if (!profile) return { success: false, message: 'No identity profile selected. Generate an identity first.' }

    const baseDir = getBaseDir()
    const hardenScript = join(baseDir, 'apps', 'cli_engine', 'harden.py')

    // Map frontend profile fields → VMXHardener expected keys
    const profileForPython = {
      manufacturer: profile.manufacturer,
      model: profile.model,
      bios_version: profile.bios_version,
      bios_date: profile.bios_date,
      serial: profile.serial,
      board_id: profile.board_id,
      hardware_uuid: profile.hardware_uuid,
      mac_address: profile.mac   // frontend uses 'mac', Python uses 'mac_address'
    }

    // Write to a temp file to avoid shell-escaping issues with JSON args
    const tmpFile = join(os.tmpdir(), `vh_profile_${Date.now()}.json`)
    fs.writeFileSync(tmpFile, JSON.stringify(profileForPython), 'utf-8')

    console.log(`[Main] Hardening VM: ${vmxPath} — Profile: ${profile.manufacturer} / ${profile.model}`)

    try {
      const { stdout, stderr } = await execAsync(
        `python "${hardenScript}" --profile-file "${tmpFile}" "${vmxPath}"`,
        { env: { ...process.env, PYTHONPATH: baseDir }, cwd: baseDir }
      )

      if (stderr && !stdout) throw new Error(stderr)

      console.log(`[Main] Hardening SUCCESS: ${stdout.trim()}`)
      return { success: true, message: stdout.trim() }
    } catch (error: any) {
      console.error(`[Main] Hardening FAILED: ${error.message}`)
      return { success: false, message: error.message }
    } finally {
      // Always clean up the temp profile file
      try { fs.unlinkSync(tmpFile) } catch { /* already gone */ }
    }
  })

  ipcMain.handle('check-vmx-status', async (_, vmxPath: string) => {
    if (!vmxPath) return { isHardened: false }

    const baseDir = getBaseDir()
    const hardenScript = join(baseDir, 'apps', 'cli_engine', 'harden.py')

    try {
      const { stdout } = await execAsync(
        `python "${hardenScript}" --check "${vmxPath}"`,
        { env: { ...process.env, PYTHONPATH: baseDir }, cwd: baseDir }
      )

      const isHardened = stdout.includes('STATUS: HARDENED')
      console.log(
        `[Main] VMX Status check for ${vmxPath}: ${isHardened ? 'HARDENED' : 'CLEAN'}`
      )
      return { isHardened }
    } catch (error: any) {
      console.error(`[Main] Status Check FAILED: ${error.message}`)
      return { isHardened: false }
    }
  })
}
