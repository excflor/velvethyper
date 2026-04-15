import React, { useState } from 'react';
import { Shield, Zap, Cpu, CheckCircle } from 'lucide-react';

function App(): React.ReactElement {
  const [isHardened, setIsHardened] = useState(false);
  const [isWatchdogActive, setIsWatchdogActive] = useState(false);
  const [vmxPath, setVmxPath] = useState<string | null>(null);
  const [currentProfile, setCurrentProfile] = useState({
    manufacturer: "ASUSTeK COMPUTER INC.",
    model: "ROG STRIX B550-F",
    serial: "40D25UY46128SJD2",
    mac: "BC:AE:C5:B6:1F:7C"
  });
  const [logs, setLogs] = useState<string[]>(["[*] System Initialized.", "[*] Ready for hardening."]);
  const [appVersion, setAppVersion] = useState<string>("1.0.0");

  React.useEffect(() => {
    window.api.getAppVersion().then(v => setAppVersion(v));
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-100), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const toggleHardening = async () => {
    try {
      if (!vmxPath) {
        addLog("ERROR: No VMX Target Selected.");
        return;
      }
      const result = await window.api.hardenVM(vmxPath);
      if (result.success) {
        setIsHardened(true);
        addLog(result.message || "VM Hardening SUCCESS: 42 flags applied.");
      } else {
        addLog(`ERROR: ${result.message}`);
      }
    } catch (err) {
      addLog(`ERROR: ${err}`);
    }
  };

  const handleRotateProfile = async () => {
    try {
      const result = await window.api.rotateProfile();
      if (result.success) {
        const parts = result.profile.split(' / ');
        setCurrentProfile({
          manufacturer: parts[0] || "Unknown",
          model: parts[1] || "Unknown",
          serial: Math.random().toString(36).substring(2, 15).toUpperCase(),
          mac: Array.from({length: 6}, () => Math.floor(Math.random()*256).toString(16).toUpperCase().padStart(2, '0')).join(':')
        });
        addLog(`Profile Rotated: ${result.profile}`);
      }
    } catch (err) {
      addLog(`ERROR: ${err}`);
    }
  };

  const handleToggleWatchdog = async () => {
    const nextState = !isWatchdogActive;
    try {
      await window.api.toggleWatchdog(nextState);
      setIsWatchdogActive(nextState);
      addLog(`Watchdog Mode: ${nextState ? 'ENABLED' : 'DISABLED'}`);
    } catch (err) {
      addLog(`ERROR: ${err}`);
    }
  };

  const handleSelectVMX = async () => {
    try {
      const path = await window.api.selectVMX();
      if (path) {
        setVmxPath(path);
        addLog(`[TARGET] Selected VMX: ${path.split('\\').pop()}`);
      }
    } catch (err) {
      addLog(`ERROR: ${err}`);
    }
  };

  return (
    <div className="flex h-screen bg-velvet-bg text-velvet-text overflow-hidden font-sans">
      {/* Seamless Titlebar (Draggable) */}
      <div className="fixed top-0 left-0 right-0 h-9 z-50 flex items-center px-4 pointer-events-none select-none">
        <div className="w-full h-full pointer-events-auto" style={{ WebkitAppRegion: 'drag' } as any} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Sticky Header (Includes Title & Status Mask) */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-velvet-bg/80 backdrop-blur-xl z-30 border-b border-white/5 px-8 pt-10 flex justify-between items-end pb-4">
           <div>
              <h1 className="text-4xl font-bold tracking-tight mb-1">
                Command Center <span className="text-sm font-mono opacity-20 align-top ml-2">v{appVersion}</span>
              </h1>
              <p className="text-velvet-muted text-xs uppercase tracking-widest font-bold opacity-60">
                VelvetHyper Stealth Orchestrator
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`status-badge ${isHardened ? 'status-online' : 'status-offline'}`}>
                 <div className={`w-2 h-2 rounded-full ${isHardened ? 'bg-velvet-accent' : 'bg-red-500'} animate-pulse`} />
                 {isHardened ? 'SYSTEM STEALTH: ACTIVE' : 'SYSTEM STEALTH: INACTIVE'}
              </div>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-40 z-20">
          <div className="grid grid-cols-12 gap-6 auto-rows-[180px]">
            {/* Main Action Card */}
            <div className="col-span-8 row-span-2 bento-card flex flex-col">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Zap className="text-velvet-accent" /> Hardening Control
                    </h2>
                    <button 
                      onClick={handleSelectVMX}
                      className="text-[10px] uppercase tracking-widest text-velvet-muted hover:text-velvet-accent transition-colors flex items-center gap-1 group"
                    >
                      Target: <span className="text-white group-hover:text-velvet-accent transition-colors">{vmxPath ? vmxPath.split('\\').pop() : "NONE SELECTED"}</span>
                    </button>
                 </div>
                 <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
                    <span className="text-xs px-2 text-velvet-muted">Auto-Watchdog</span>
                    <button 
                      onClick={handleToggleWatchdog}
                      className={`w-10 h-5 rounded-full transition-all duration-300 relative ${isWatchdogActive ? 'bg-velvet-accent' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${isWatchdogActive ? 'left-6' : 'left-1'}`} />
                    </button>
                 </div>
              </div>
              <div className="flex-1 flex flex-col justify-center items-center gap-6">
                 <button 
                   onClick={toggleHardening}
                   className={`btn-primary w-full max-sm flex items-center justify-center gap-3 text-lg ${isHardened ? 'opacity-50 ring-2 ring-velvet-accent' : ''}`}
                 >
                   {isHardened ? <><CheckCircle /> Hardened</> : <><Shield /> Initiate Deep Harden</>}
                 </button>
                 <button 
                   onClick={async () => {
                     const res = await window.api.buildProduction();
                     if (res.success) addLog(`[PRODUCTION] Build Success: ${res.path}`);
                   }}
                   className="text-xs text-velvet-muted hover:text-velvet-accent transition-colors underline decoration-dotted underline-offset-4"
                 >
                   Package Guest Tools (Ghost Launcher)
                 </button>
                 <p className="text-xs text-velvet-muted text-center max-w-xs">
                   Processes current .vmx configuration, clears SMBIOS, masks CPUID, and sanitizes ACPI tables.
                 </p>
              </div>
            </div>

            {/* System Profile Card (Dashboard version - Current Session Focus) */}
            <div className="col-span-4 row-span-2 bento-card border-l-4 border-velvet-accent flex flex-col">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                   <Cpu className="text-velvet-accent" /> Session Identity
                </h2>
                <div className="space-y-4">
                   <ProfileItem label="Current Manufacturer" value={currentProfile.manufacturer} />
                   <ProfileItem label="Target Model" value={currentProfile.model} />
                   <ProfileItem label="HWID Serial" value={currentProfile.serial} />
                   <ProfileItem label="Spoofed MAC" value={currentProfile.mac} />
                </div>
              </div>
              <div className="mt-auto pt-6">
                <button 
                  onClick={handleRotateProfile}
                  className="w-full py-3 bg-white/5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all active:scale-95 border border-white/5 shadow-inner"
                >
                  Generate New Identity
                </button>
              </div>
            </div>

            {/* Console / Logs (Dashboard version - Recent Activity Focus) */}
            <div className="col-span-12 row-span-2 bento-card bg-black/40 border-white/5 p-0 overflow-hidden flex flex-col cursor-auto">
               <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <h3 className="text-sm font-mono font-bold tracking-widest text-velvet-muted italic">SESSION TELEMETRY (LATEST)</h3>
                  <div className="flex gap-2">
                     <div className="w-2 h-2 rounded-full bg-red-500/50" />
                     <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                     <div className="w-2 h-2 rounded-full bg-green-500/50" />
                  </div>
               </div>
               <div className="p-6 font-mono text-sm space-y-1 overflow-y-auto flex-1 custom-scrollbar">
                  {logs.map((log, i) => (
                    <div key={i} className={log.includes('SUCCESS') ? 'text-velvet-accent' : log.includes('ERROR') ? 'text-red-500' : 'text-velvet-muted'}>
                      {log}
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="group">
       <div className="text-[10px] uppercase font-bold tracking-widest text-velvet-muted mb-1">{label}</div>
       <div className="text-sm font-mono text-white truncate group-hover:text-velvet-accent transition-colors">{value}</div>
    </div>
  );
}

export default App;
