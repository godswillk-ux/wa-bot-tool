import React from 'react';
import { Megaphone, Plus, Calendar, Target, Activity, ShieldCheck } from 'lucide-react';

export default function Campaigns() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-brand-primary" />
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] font-mono">Signal_Broadcast</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter font-display leading-tight">
              Transmission <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-emerald-400">Waves</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium tracking-tight max-w-xl">
              Deploy high-throughput information broadcasts and automated behavioral lead sequences across the matrix.
            </p>
          </div>
          <button className="px-8 py-5 bg-brand-primary text-black font-black uppercase italic tracking-[0.2em] rounded-[2rem] shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center gap-4 font-display text-[10px]">
            <Plus size={18} />
            <span>Initialize_Broadwave</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-morphism rounded-[2.5rem] p-10 space-y-8 border border-white/5 relative overflow-hidden h-fit">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#10b98108_0%,_transparent_40%)]" />
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <h3 className="text-xl font-black uppercase italic tracking-tight font-display text-white">Create Protocol</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Initialize New Broadcast Sequence</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest font-mono">Anti-Ban Active</span>
            </div>
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 font-black uppercase tracking-widest font-mono ml-2">Sequence Name</label>
              <input 
                type="text" 
                placeholder="e.g. ALPHA_DISTRIBUTION"
                className="w-full bg-black/40 border border-zinc-800 rounded-2xl p-5 text-white text-xs focus:border-brand-primary outline-none transition-all font-mono italic"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 font-black uppercase tracking-widest font-mono ml-2">Safety Delay (Seconds)</label>
              <div className="relative">
                <input 
                  type="number" 
                  defaultValue={15}
                  min={5}
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl p-5 text-brand-primary text-xs focus:border-brand-primary outline-none transition-all font-mono font-bold"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-600 font-black uppercase font-mono">Interval_Gap</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-400 font-black uppercase tracking-widest font-mono ml-2">Message Payload</label>
              <textarea 
                placeholder="Enter your broadcast transmission..."
                className="w-full bg-black/40 border border-zinc-800 rounded-3xl p-6 text-white text-sm focus:border-brand-primary outline-none transition-all min-h-[120px] resize-none"
              />
            </div>

            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
                <Activity size={16} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-yellow-500 font-black uppercase tracking-wider">Safety Recommended</p>
                <p className="text-[9px] text-zinc-500 font-medium leading-relaxed font-mono">
                  WE RECOMMEND A DELAY OF AT LEAST 15s TO SIMULATE HUMAN PATTERNS.
                </p>
              </div>
            </div>

            <button className="w-full py-6 bg-brand-primary hover:bg-brand-primary/90 text-black font-black uppercase tracking-[0.3em] rounded-3xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.98] font-display">
              Execute_Sequence
            </button>
          </div>
        </div>

        <div className="glass-morphism rounded-[3rem] p-12 space-y-12 border border-white/5 glow-card">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 shadow-xl">
              <Activity size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tight font-display">Wave Statistics</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1 font-mono">Cumulative System Metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-8 bg-black/40 border border-zinc-900 rounded-[2.5rem] space-y-2 group hover:border-brand-primary/30 transition-colors shadow-inner">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest font-mono">Total_Transmissions</p>
              <p className="text-5xl font-black text-white italic tracking-tighter font-display group-hover:text-brand-primary transition-colors">0</p>
            </div>
            <div className="p-8 bg-black/40 border border-zinc-900 rounded-[2.5rem] space-y-2 group hover:border-brand-primary/30 transition-colors shadow-inner">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest font-mono">Interaction_Ratio</p>
              <p className="text-5xl font-black text-white italic tracking-tighter font-display group-hover:text-emerald-500 transition-colors">0%</p>
            </div>
          </div>
          
          <div className="p-6 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 flex items-center justify-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest font-mono">Awaiting primary signal propagation...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
