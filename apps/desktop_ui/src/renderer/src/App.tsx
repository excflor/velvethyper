import React from 'react'
import { useVmxState } from './hooks/useVmxState'
import { StatusBar } from './components/StatusBar'
import { HardeningCard } from './components/HardeningCard'
import { IdentityCard } from './components/IdentityCard'
import { TelemetryConsole } from './components/TelemetryConsole'

function App(): React.ReactElement {
  const {
    isHardened,
    isWatchdogActive,
    vmxPath,
    currentProfile,
    logs,
    appVersion,
    toggleHardening,
    handleRotateProfile,
    handleToggleWatchdog,
    handleSelectVMX,
    handleBuildProduction
  } = useVmxState()

  return (
    <div className="flex h-screen bg-velvet-bg text-velvet-text overflow-hidden font-sans">
      {/* Seamless Titlebar (Draggable) */}
      <div className="fixed top-0 left-0 right-0 h-9 z-50 flex items-center px-4 pointer-events-none select-none">
        <div
          className="w-full h-full pointer-events-auto"
          style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
        />
      </div>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <StatusBar isHardened={isHardened} appVersion={appVersion} />

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-40 z-20">
          <div className="grid grid-cols-12 gap-6 auto-rows-[180px]">
            <HardeningCard
              isHardened={isHardened}
              isWatchdogActive={isWatchdogActive}
              vmxPath={vmxPath}
              onHarden={toggleHardening}
              onToggleWatchdog={handleToggleWatchdog}
              onSelectVMX={handleSelectVMX}
              onBuildProduction={handleBuildProduction}
            />
            <IdentityCard profile={currentProfile} onRotate={handleRotateProfile} />
            <TelemetryConsole logs={logs} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
