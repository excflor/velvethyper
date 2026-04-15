interface Props {
  isHardened: boolean
  appVersion: string
}

export function StatusBar({ isHardened, appVersion }: Props): React.ReactElement {
  return (
    <div className="absolute top-0 left-0 right-0 h-32 bg-velvet-bg/80 backdrop-blur-xl z-30 border-b border-white/5 px-8 pt-10 flex justify-between items-end pb-4">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-1">
          Command Center{' '}
          <span className="text-sm font-mono opacity-20 align-top ml-2">v{appVersion}</span>
        </h1>
        <p className="text-velvet-muted text-xs uppercase tracking-widest font-bold opacity-60">
          VelvetHyper Stealth Orchestrator
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div
          id="status-badge"
          className={`status-badge ${isHardened ? 'status-online' : 'status-offline'}`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isHardened ? 'bg-velvet-accent' : 'bg-red-500'
            } animate-pulse`}
          />
          {isHardened ? 'SYSTEM STEALTH: ACTIVE' : 'SYSTEM STEALTH: INACTIVE'}
        </div>
      </div>
    </div>
  )
}
