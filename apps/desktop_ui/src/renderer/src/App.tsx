import React, { useState } from 'react';
import { Box, Shield, Zap, Cpu, Activity, Settings, List, CheckCircle } from 'lucide-react';

function App(): React.ReactElement {
  const [activeTab, setActiveTab] = useState('dashboard');
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

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-100), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const toggleHardening = async () => {
    try {
      const result = await window.api.hardenVM();
      if (result.success) {
        setIsHardened(true);
        addLog(result.message || "VM Hardening SUCCESS: 42 flags applied.");
      }
    } catch (err) {
      addLog(`ERROR: ${err}`);
    }
  };

  const handleRotateProfile = async () => {
    try {
      const result = await window.api.rotateProfile();
      if (result.success) {
        // Mocking the parse for demonstration, in real it would return the full object
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

      {/* Sidebar */}
      <aside className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-8 bg-velvet-card/20 backdrop-blur-xl z-20 pt-10">
        <div className="p-3 bg-velvet-accent/20 rounded-2xl text-velvet-accent mb-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveTab('dashboard')}>
          <Shield size={28} />
        </div>
        <nav className="flex flex-col gap-6">
          <SidebarIcon icon={<Activity size={24} />} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarIcon icon={<Box size={24} />} active={activeTab === 'profiles'} onClick={() => setActiveTab('profiles')} />
          <SidebarIcon icon={<Zap size={24} />} active={activeTab === 'actions'} onClick={() => setActiveTab('actions')} />
          <SidebarIcon icon={<List size={24} />} active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
        </nav>
        <div className="mt-auto">
          <SidebarIcon icon={<Settings size={24} />} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Sticky Header Background (Masks window controls when scrolling) */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-velvet-bg/80 backdrop-blur-xl z-30 border-b border-white/5 pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-10 z-20">
          <header className="flex justify-between items-end mb-10 relative z-40">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <p className="text-velvet-muted">Pro-Grade Stealth Virtualization & Anti-Cheat Evasion</p>
            </div>
            <div className="flex flex-col items-end gap-3 translate-y-2">
              <div className={`status-badge ${isHardened ? 'status-online' : 'status-offline'}`}>
                 <div className={`w-2 h-2 rounded-full ${isHardened ? 'bg-velvet-accent' : 'bg-red-500'} animate-pulse`} />
                 {isHardened ? 'SYSTEM STEALTH: ACTIVE' : 'SYSTEM STEALTH: INACTIVE'}
              </div>
            </div>
          </header>

          {activeTab === 'dashboard' && (
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
                     className={`btn-primary w-full max-w-sm flex items-center justify-center gap-3 text-lg ${isHardened ? 'opacity-50 ring-2 ring-velvet-accent' : ''}`}
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

              {/* System Profile Card */}
              <div className="col-span-4 row-span-2 bento-card border-l-4 border-velvet-accent flex flex-col">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                     <Cpu className="text-velvet-accent" /> Current Profile
                  </h2>
                  <div className="space-y-4">
                     <ProfileItem label="Manufacturer" value={currentProfile.manufacturer} />
                     <ProfileItem label="Model" value={currentProfile.model} />
                     <ProfileItem label="Serial" value={currentProfile.serial} />
                     <ProfileItem label="MAC" value={currentProfile.mac} />
                  </div>
                </div>
                <div className="mt-auto pt-6">
                  <button 
                    onClick={handleRotateProfile}
                    className="w-full py-3 bg-white/5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all active:scale-95 border border-white/5 shadow-inner"
                  >
                    Rotate Profile
                  </button>
                </div>
              </div>

              {/* Console / Logs (Bento large footer) */}
              <div className="col-span-12 row-span-2 bento-card bg-black/40 border-white/5 p-0 overflow-hidden flex flex-col cursor-auto">
                 <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <h3 className="text-sm font-mono font-bold tracking-widest text-velvet-muted italic">REAL-TIME ENGINE TELEMETRY</h3>
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
          )}

          {activeTab === 'profiles' && (
             <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bento-card border border-white/5 hover:border-velvet-accent/50 transition-colors group cursor-pointer">
                    <div className="text-xs text-velvet-muted mb-2">Saved Configuration #{i}</div>
                    <div className="font-bold text-lg group-hover:text-velvet-accent transition-colors">ROG STRIX Gen{i}</div>
                    <div className="mt-4 text-[10px] text-velvet-muted mono">LAST_SYNC: 2026-04-1{i}</div>
                  </div>
                ))}
             </div>
          )}

          {activeTab === 'logs' && (
             <div className="bento-card bg-black flex-1 font-mono text-sm p-8 leading-relaxed text-velvet-muted">
                {logs.map((log, i) => <div key={i}>{log}</div>)}
             </div>
          )}

          {activeTab === 'actions' && (
             <div className="grid grid-cols-2 gap-8">
                <div className="bento-card border-t-2 border-velvet-accent">
                   <h3 className="font-bold mb-4">Batch Hardening</h3>
                   <p className="text-sm text-velvet-muted">Apply standard stealth profile to a directory of VMX files simultaneously.</p>
                </div>
                <div className="bento-card border-t-2 border-velvet-accent">
                   <h3 className="font-bold mb-4">Integrity Audit</h3>
                   <p className="text-sm text-velvet-muted">Perform a deep-memory scan of the Host to ensure no VM services are leaking identifiers.</p>
                </div>
             </div>
          )}

          {(activeTab === 'settings' || activeTab === 'development') && (
            <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-40">
               <Shield size={64} className="mb-4 animate-pulse-slow" />
               <p className="text-xl font-bold italic tracking-widest uppercase">SECTION IN DEVELOPMENT</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function SidebarIcon({ icon, active = false, onClick }: { icon: React.ReactNode, active?: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`p-3 rounded-xl cursor-pointer transition-all duration-300 ${active ? 'bg-velvet-accent/10 text-velvet-accent shadow-lg shadow-velvet-accent/10 scale-110' : 'text-velvet-muted hover:text-white hover:bg-white/5'}`}
    >
      {icon}
    </div>
  )
}

function ProfileItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="group">
       <div className="text-[10px] uppercase font-bold tracking-widest text-velvet-muted mb-1">{label}</div>
       <div className="text-sm font-mono text-white truncate group-hover:text-velvet-accent transition-colors">{value}</div>
    </div>
  )
}

export default App
