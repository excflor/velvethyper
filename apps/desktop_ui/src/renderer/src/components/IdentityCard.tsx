import { Cpu } from 'lucide-react'
import type { HardwareProfile } from '../hooks/useVmxState'

interface ProfileItemProps {
  label: string
  value: string
}

function ProfileItem({ label, value }: ProfileItemProps): React.ReactElement {
  return (
    <div className="group">
      <div className="text-[10px] uppercase font-bold tracking-widest text-velvet-muted mb-1">
        {label}
      </div>
      <div className="text-sm font-mono text-white truncate group-hover:text-velvet-accent transition-colors">
        {value}
      </div>
    </div>
  )
}

interface Props {
  profile: HardwareProfile | null
  onRotate: () => void
}

export function IdentityCard({ profile, onRotate }: Props): React.ReactElement {
  return (
    <div className="col-span-4 row-span-2 bento-card border-l-4 border-velvet-accent flex flex-col">
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Cpu className="text-velvet-accent" /> Session Identity
        </h2>

        {profile ? (
          <div className="space-y-4">
            <ProfileItem label="Current Manufacturer" value={profile.manufacturer} />
            <ProfileItem label="Target Model" value={profile.model} />
            <ProfileItem label="HWID Serial" value={profile.serial} />
            <ProfileItem label="Spoofed MAC" value={profile.mac} />
          </div>
        ) : (
          <p className="text-xs text-velvet-muted italic">
            No profile loaded. Click &ldquo;Generate New Identity&rdquo; to begin.
          </p>
        )}
      </div>

      <div className="mt-auto pt-6">
        <button
          id="btn-rotate-profile"
          onClick={onRotate}
          className="w-full py-3 bg-white/5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all active:scale-95 border border-white/5 shadow-inner"
        >
          Generate New Identity
        </button>
      </div>
    </div>
  )
}
