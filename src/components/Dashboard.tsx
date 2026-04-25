import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap,
  Cpu,
  Layers,
  Terminal,
  Shield,
  EyeOff
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Dashboard({ privacyMode }: { privacyMode?: boolean }) {
  const [logs, setLogs] = useState<{ input: string, output: string, jid: string, timestamp: number }[]>([]);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setUptime(data.uptime);
      } catch (e) {}
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m active`;
  };
  
  useEffect(() => {
    fetch('/api/wa/logs')
      .then(res => res.json())
      .then(data => setLogs(data.slice(0, 5)))
      .catch(() => {});
  }, []);

  const stats = [
    { label: 'Neural_Latence', value: '14ms', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Node_Uptime', value: '99.9%', icon: Cpu, color: 'text-brand-accent', bg: 'bg-brand-accent/10' },
    { label: 'Data_Stream', value: '4.2GB', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Active_Synapses', value: '1.2k', icon: Layers, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-brand-primary" />
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] font-mono">System_Overview • {formatUptime(uptime)}</span>
        </div>
        <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter font-display leading-tight">
          Control <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-emerald-400">Matrix</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium tracking-tight max-w-xl">
          Autonomous node management and real-time behavioral heuristic monitoring dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-morphism group rounded-[2.5rem] p-8 hover:border-brand-primary/30 transition-all duration-500 relative overflow-hidden glow-card">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
              <stat.icon size={120} />
            </div>
            <div className="space-y-6 relative z-10">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl border border-white/5", stat.bg)}>
                <stat.icon className={cn("transition-transform group-hover:scale-110", stat.color)} size={28} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] font-mono">{stat.label}</p>
                <p className={cn(
                  "text-4xl font-black text-white tracking-tighter italic font-display transition-all duration-500",
                  privacyMode && "blur-md select-none"
                )}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-morphism rounded-[3rem] p-10 relative overflow-hidden shadow-2xl border border-white/5 glow-card">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#10b98108_0%,_transparent_40%)]" />
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div className="space-y-1">
              <h3 className="text-2xl font-black uppercase italic tracking-tight font-display">Heuristic Flux</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Neural activity distribution</p>
            </div>
            <div className="flex gap-2">
              <div className="px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400">Stream_Live</div>
            </div>
          </div>
          
          <div className="h-[300px] flex items-end gap-3 px-4">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="flex-1 group relative">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.random() * 80 + 20}%` }}
                  transition={{ duration: 1.5, delay: i * 0.05, repeat: Infinity, repeatType: 'reverse' }}
                  className="w-full bg-gradient-to-t from-brand-primary/20 to-brand-primary rounded-full group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all"
                />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-zinc-700 uppercase font-mono">{i}h</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-morphism rounded-[3rem] p-10 flex flex-col space-y-10 relative overflow-hidden shadow-2xl border border-white/5 glow-card">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#3b82f608_0%,_transparent_40%)]" />
          <div className="space-y-1 relative z-10">
            <h3 className="text-2xl font-black uppercase italic tracking-tight font-display">Brain Stream</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Real-time AI logic events</p>
          </div>
          <div className="space-y-6 flex-1 relative z-10">
            {logs.length > 0 ? logs.map((log, i) => (
              <div key={i} className="flex gap-5 group items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <div className="space-y-1 flex-1 min-w-0">
                  <p className={cn(
                    "text-[11px] text-zinc-300 font-bold leading-tight group-hover:text-white transition-all tracking-tight italic truncate",
                    privacyMode && "blur-sm select-none"
                  )}>
                    Replied to {log.jid.split('@')[0]}: {log.output}
                  </p>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest font-mono">{new Date(log.timestamp).toLocaleTimeString()} • NEURAL_OUT</p>
                </div>
              </div>
            )) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-zinc-900 rounded-3xl bg-black/40">
                <Terminal size={32} className="text-zinc-800 mb-4" />
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest font-mono italic">Awaiting synapse firing...</p>
              </div>
            )}
          </div>
          <button className="w-full py-5 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all hover:scale-[1.02] active:scale-[0.98] font-display relative z-10">
            Sync_Cognition
          </button>
        </div>

        <div className="lg:col-span-3 glass-morphism rounded-[3rem] p-10 border border-white/5 relative overflow-hidden glow-card">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-transparent pointer-events-none" />
          <div className="flex items-center gap-6 mb-8">
            <div className="p-4 bg-brand-primary/10 rounded-2xl text-brand-primary border border-brand-primary/20">
              <Layers size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase italic tracking-tight font-display">Active Protocol Command Set</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Executable heuristic triggers via chat</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { cmd: '.vv', desc: 'Recovers View-Once media payloads. Reply to a view-once message with this trigger.', status: 'OPERATIONAL' },
              { cmd: 'tagall', desc: 'Mentions every subject node in a group collective. Admin authorization recommended.', status: 'OPERATIONAL' },
              { cmd: 'hi', desc: 'Primary handshake protocol. Verifies system presence and readiness.', status: 'AUTO_RESP' }
            ].map((protocol) => (
              <div key={protocol.cmd} className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl space-y-3 group hover:border-brand-primary/30 transition-all">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black text-white font-mono">{protocol.cmd}</span>
                  <span className="text-[8px] font-black text-brand-primary border border-brand-primary/30 px-2 py-0.5 rounded-full">{protocol.status}</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium leading-relaxed italic">{protocol.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
