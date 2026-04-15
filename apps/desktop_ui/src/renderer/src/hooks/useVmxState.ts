import { useState, useEffect, useCallback } from 'react'

// ------------------------------------------------------------------ types

export interface HardwareProfile {
  manufacturer: string
  model: string
  bios_version: string
  bios_date: string
  serial: string
  board_id: string
  hardware_uuid: string
  mac: string
  type: string
}

export interface VmxState {
  isHardened: boolean
  isWatchdogActive: boolean
  vmxPath: string | null
  currentProfile: HardwareProfile | null
  logs: string[]
  appVersion: string
}

export interface VmxHandlers {
  toggleHardening: () => Promise<void>
  handleRotateProfile: () => Promise<void>
  handleToggleWatchdog: () => Promise<void>
  handleSelectVMX: () => Promise<void>
  handleBuildProduction: () => Promise<void>
}

// ------------------------------------------------------------------ helpers

const timestamp = (): string => new Date().toLocaleTimeString()

const profileFromResult = (result: any): HardwareProfile => ({
  manufacturer: result.manufacturer,
  model: result.model,
  bios_version: result.bios_version,
  bios_date: result.bios_date,
  serial: result.serial,
  board_id: result.board_id,
  hardware_uuid: result.hardware_uuid,
  mac: result.mac,
  type: result.type
})

// ------------------------------------------------------------------ hook

export function useVmxState(): VmxState & VmxHandlers {
  const [isHardened, setIsHardened] = useState(false)
  const [isWatchdogActive, setIsWatchdogActive] = useState(false)
  const [vmxPath, setVmxPath] = useState<string | null>(null)
  const [currentProfile, setCurrentProfile] = useState<HardwareProfile | null>(null)
  const [logs, setLogs] = useState<string[]>([
    '[*] System Initialized.',
    '[*] Ready for hardening.'
  ])
  const [appVersion, setAppVersion] = useState<string>('…')

  useEffect(() => {
    window.api.getAppVersion().then(setAppVersion)
  }, [])

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev.slice(-100), `[${timestamp()}] ${msg}`])
  }, [])

  // Generates and returns a fresh profile, updating state as a side-effect
  const generateProfile = useCallback(async (): Promise<HardwareProfile | null> => {
    const result = await window.api.rotateProfile()
    if (result.success) {
      const profile = profileFromResult(result)
      setCurrentProfile(profile)
      addLog(`Profile Generated: ${result.manufacturer} / ${result.model}`)
      return profile
    }
    addLog('ERROR: Failed to generate identity.')
    return null
  }, [addLog])

  const toggleHardening = useCallback(async () => {
    if (!vmxPath) {
      addLog('ERROR: No VMX Target Selected.')
      return
    }

    // Auto-generate a profile if none has been loaded yet
    let profile = currentProfile
    if (!profile) {
      addLog('No identity loaded — auto-generating...')
      profile = await generateProfile()
      if (!profile) return
    }

    addLog('STEALTH MODULE: Initializing Deep Hardening...')
    try {
      const res = await window.api.hardenVM(vmxPath, profile)
      if (res.success) {
        setIsHardened(true)
        res.message.split('\n').forEach((line) => {
          if (line.trim()) addLog(line.trim())
        })
        addLog('STEALTH MODULE: Protection Layer Solidified.')
      } else {
        addLog(`CRITICAL: ${res.message}`)
      }
    } catch (err) {
      addLog(`ERROR: ${err}`)
    }
  }, [vmxPath, currentProfile, generateProfile, addLog])

  const handleRotateProfile = useCallback(async () => {
    try {
      await generateProfile()
    } catch (err) {
      addLog(`ERROR: ${err}`)
    }
  }, [generateProfile, addLog])

  const handleToggleWatchdog = useCallback(async () => {
    const nextState = !isWatchdogActive
    try {
      await window.api.toggleWatchdog(nextState)
      setIsWatchdogActive(nextState)
      addLog(`Watchdog Mode: ${nextState ? 'ENABLED' : 'DISABLED'}`)
    } catch (err) {
      addLog(`ERROR: ${err}`)
    }
  }, [isWatchdogActive, addLog])

  const handleSelectVMX = useCallback(async () => {
    try {
      const path = await window.api.selectVMX()
      if (path) {
        setVmxPath(path)
        addLog(`[TARGET] Selected VMX: ${path.split('\\').pop()}`)
        const status = await window.api.checkVMXStatus(path)
        setIsHardened(status.isHardened)
        addLog(`Status: ${status.isHardened ? 'HARDENED' : 'UNHARDENED'}`)
      }
    } catch (err) {
      addLog(`ERROR: ${err}`)
    }
  }, [addLog])

  const handleBuildProduction = useCallback(async () => {
    try {
      addLog('[PRODUCTION] Compiling Ghost Launcher...')
      const res = await window.api.buildProduction()
      if (res.success) {
        addLog(`[PRODUCTION] Build Success: ${res.path}`)
      } else {
        addLog('[PRODUCTION] Build Failed.')
      }
    } catch (err) {
      addLog(`ERROR: ${err}`)
    }
  }, [addLog])

  return {
    // state
    isHardened,
    isWatchdogActive,
    vmxPath,
    currentProfile,
    logs,
    appVersion,
    // handlers
    toggleHardening,
    handleRotateProfile,
    handleToggleWatchdog,
    handleSelectVMX,
    handleBuildProduction
  }
}
