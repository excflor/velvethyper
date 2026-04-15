import * as fs from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { app, IpcMain } from 'electron'

const getLibsPath = (): string =>
  app.isPackaged ? join(process.resourcesPath, 'libs') : join(__dirname, '../../../../libs')

export function registerProfileHandlers(ipcMain: IpcMain): void {
  ipcMain.handle('rotate-profile', async () => {
    console.log('[Main] Rotating Hardware Profile...')

    const libsPath = getLibsPath()
    const profilesPath = join(libsPath, 'spoofer_core', 'assets', 'hardware_profiles.json')

    try {
      const rawData = fs.readFileSync(profilesPath, 'utf-8')
      const db = JSON.parse(rawData)
      const profiles: any[] = db.profiles ?? []

      if (profiles.length === 0) throw new Error('No profiles available')

      const p = profiles[Math.floor(Math.random() * profiles.length)]

      // Generate all hardware identifiers on the backend — these WILL be applied to the VMX
      const hexSegment = () =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .toUpperCase()
          .padStart(2, '0')
      const serialPrefix = p.serial_prefix ?? 'HW'
      const randomHex12 = Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      )
        .join('')
        .toUpperCase()
      const macSuffix = `${hexSegment()}:${hexSegment()}:${hexSegment()}`
      const boardId = `MB-${randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase()}`

      return {
        success: true,
        manufacturer: p.manufacturer,
        model: p.model,
        bios_version: p.bios_version,
        bios_date: p.bios_date,
        type: p.type,
        serial: `${serialPrefix}-${randomHex12}`,
        board_id: boardId,
        hardware_uuid: randomUUID(),
        mac: `${p.mac_oui}:${macSuffix}`
      }
    } catch (error: any) {
      console.error(`[Main] Profile Rotation Failed: ${error.message}`)
      return { success: false, manufacturer: '', model: '', type: '', serial: '', mac: '' }
    }
  })
}
