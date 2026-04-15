interface Props {
  logs: string[]
}

export function TelemetryConsole({ logs }: Props): React.ReactElement {
  return (
    <div className="col-span-12 row-span-2 bento-card bg-black/40 border-white/5 p-0 overflow-hidden flex flex-col cursor-auto">
      <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
        <h3 className="text-sm font-mono font-bold tracking-widest text-velvet-muted italic">
          SESSION TELEMETRY (LATEST)
        </h3>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
      </div>

      <div className="p-6 font-mono text-sm space-y-1 overflow-y-auto flex-1 custom-scrollbar">
        {logs.map((log, i) => (
          <div
            key={i}
            className={
              log.includes('SUCCESS') || log.includes('SOLIDIFIED')
                ? 'text-velvet-accent'
                : log.includes('ERROR') || log.includes('CRITICAL')
                  ? 'text-red-500'
                  : log.includes('HARDENED')
                    ? 'text-yellow-400'
                    : 'text-velvet-muted'
            }
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  )
}
