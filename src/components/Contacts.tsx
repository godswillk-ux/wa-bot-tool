import React from 'react';
import { Users, Search, MoreVertical, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Contacts({ privacyMode }: { privacyMode?: boolean }) {
  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-brand-primary" />
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] font-mono">Entity_Matrix</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter font-display leading-tight">
              Identities <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-emerald-400">&</span> Nodes
            </h1>
            <p className="text-zinc-500 text-sm font-medium tracking-tight max-w-xl">
              Centralized identity management and real-time behavioral tracking for all linked subject nodes.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 p-3 rounded-2xl shadow-inner backdrop-blur-md">
            <Search size={18} className="text-zinc-600 ml-2" />
            <input 
              type="text" 
              placeholder="SEARCH_DATABASE..." 
              className="bg-transparent border-none focus:ring-0 text-[10px] font-black text-white placeholder:text-zinc-700 italic tracking-widest font-display"
            />
          </div>
        </div>
      </div>

      <div className="glass-morphism rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 glow-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-zinc-800/50">
              <th className="px-10 py-6 text-[9px] uppercase font-black tracking-[0.3em] text-zinc-500 font-mono">Subject_Identifier</th>
              <th className="px-10 py-6 text-[9px] uppercase font-black tracking-[0.3em] text-zinc-500 font-mono">Channel_ID</th>
              <th className="px-10 py-6 text-[9px] uppercase font-black tracking-[0.3em] text-zinc-500 font-mono">Pulse_Activity</th>
              <th className="px-10 py-6 text-[9px] uppercase font-black tracking-[0.3em] text-zinc-500 font-mono">Classification</th>
              <th className="px-10 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/50">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <tr key={i} className="group hover:bg-white/[0.02] transition-colors relative">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black italic text-zinc-500 shadow-lg group-hover:border-brand-primary/30 transition-colors">
                      ID
                    </div>
                    <div>
                      <p className={cn(
                        "text-sm font-black text-white italic tracking-tight font-display uppercase transition-all duration-500",
                        privacyMode && "blur-md select-none"
                      )}>Subject_{i}42</p>
                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-1 font-mono">Verified Node_Alpha</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className={cn(
                    "text-[11px] font-bold text-zinc-400 font-mono tracking-tighter transition-all duration-500",
                    privacyMode && "blur-md select-none"
                  )}>+234 810 000 00{i}</span>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase italic tracking-widest font-mono">Stream_Live</span>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className="text-[8px] font-black uppercase bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full border border-brand-primary/20 shadow-sm font-display tracking-widest">
                    Reliability_High
                  </span>
                </td>
                <td className="px-10 py-8 text-right">
                  <button className="p-3 text-zinc-700 hover:text-white transition-all hover:bg-zinc-800 rounded-xl">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
