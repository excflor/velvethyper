import { Shield, Zap, CheckCircle } from 'lucide-react'

interface Props {
  isHardened: boolean
  isWatchdogActive: boolean
  vmxPath: string | null
  onHarden: () => void
  onToggleWatchdog: () => void
  onSelectVMX: () => void
  onBuildProduction: () => void
}

export function HardeningCard({
  isHardened,
  isWatchdogActive,
  vmxPath,
  onHarden,
  onToggleWatchdog,
  onSelectVMX,
  onBuildProduction
}: Props): React.ReactElement {
  return (
    <div className="col-span-8 row-span-2 bento-card flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Zap className="text-velvet-accent" /> Hardening Control
          </h2>
          <button
            id="btn-select-vmx"
            onClick={onSelectVMX}
            className="text-[10px] uppercase tracking-widest text-velvet-muted hover:text-velvet-accent transition-colors flex items-center gap-1 group"
          >
            Target:{' '}
            <span className="text-white group-hover:text-velvet-accent transition-colors">
              {vmxPath ? vmxPath.split('\\').pop() : 'NONE SELECTED'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
          <span className="text-xs px-2 text-velvet-muted">Auto-Watchdog</span>
          <button
            id="btn-toggle-watchdog"
            onClick={onToggleWatchdog}
            aria-label="Toggle watchdog"
            className={`w-10 h-5 rounded-full transition-all duration-300 relative ${
              isWatchdogActive ? 'bg-velvet-accent' : 'bg-white/10'
            }`}
          >
            <div
              className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${
                isWatchdogActive ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center gap-6">
        <button
          id="btn-harden"
          onClick={onHarden}
          className={`btn-primary w-full max-sm flex items-center justify-center gap-3 text-lg ${
            isHardened ? 'opacity-50 ring-2 ring-velvet-accent' : ''
          }`}
        >
          {isHardened ? (
            <>
              <CheckCircle /> Hardened
            </>
          ) : (
            <>
              <Shield /> Initiate Deep Harden
            </>
          )}
        </button>

        <button
          id="btn-build-production"
          onClick={onBuildProduction}
          className="text-xs text-velvet-muted hover:text-velvet-accent transition-colors underline decoration-dotted underline-offset-4"
        >
          Package Guest Tools (Ghost Launcher)
        </button>

        <p className="text-xs text-velvet-muted text-center max-w-xs">
          Processes current .vmx configuration, clears SMBIOS, masks CPUID, and sanitizes ACPI
          tables.
        </p>
      </div>
    </div>
  )
}
