import React, { useState } from 'react';
import { MessageSquare, Send, Smartphone, User, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Simulator({ privacyMode }: { privacyMode?: boolean }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Aura Glitch protocol initialization sequence started.", sender: 'system' },
    { id: 2, text: "Aura Glitch connection stable. Neural bridge active.", sender: 'system' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'user' }]);
    setInput('');
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-brand-primary" />
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] font-mono">Heuristic_Sandbox</span>
        </div>
        <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter font-display leading-tight">
          Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-emerald-400">Terminal</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium tracking-tight max-w-xl">
          Simulate and verify interaction heuristics in a protected, virtualized sandboxed environment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-morphism rounded-[3rem] h-[650px] flex flex-col overflow-hidden shadow-2xl border border-white/5 glow-card">
          <div className="bg-white/[0.02] p-6 border-b border-zinc-800/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] font-mono italic">Channel_Link • Sandbox_Alpha</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={cn(
                "flex flex-col max-w-[85%]",
                msg.sender === 'user' ? "ml-auto items-end" : "items-start"
              )}>
                <div className={cn(
                  "px-6 py-4 rounded-[1.5rem] text-[13px] font-medium tracking-tight shadow-2xl relative transition-all duration-500",
                  msg.sender === 'user' 
                    ? "bg-brand-primary text-black rounded-tr-none font-bold" 
                    : "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-none",
                  privacyMode && "blur-md select-none"
                )}>
                  {msg.text}
                </div>
                {msg.sender === 'system' && (
                  <div className="mt-2 px-6 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-brand-primary/40" />
                    <span className="text-[9px] font-mono text-zinc-500 italic truncate max-w-xs">
                      PREVIEW: {msg.text.substring(0, 30)}{msg.text.length > 30 ? '...' : ''}
                    </span>
                  </div>
                )}
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mt-3 px-2 font-mono">
                  {msg.sender.toUpperCase()} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>

          <div className="p-8 bg-black/40 border-t border-zinc-800/50">
            <div className="flex gap-4 p-3 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 shadow-inner group transition-all focus-within:border-brand-primary/30">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="TYPE_COMMAND_OR_MESSAGE..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-[11px] font-bold text-white placeholder:text-zinc-700 italic px-4 font-display tracking-widest"
              />
              <button 
                onClick={handleSend}
                className="p-4 bg-brand-primary text-black rounded-xl hover:scale-[1.05] active:scale-[0.95] transition-all shadow-[0_10px_20px_rgba(16,185,129,0.3)]"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-morphism rounded-[2.5rem] p-10 shadow-2xl border border-white/5 space-y-8">
            <h3 className="text-sm font-black text-white uppercase italic tracking-[0.2em] font-display border-b border-zinc-800 pb-4">Real-time Debug</h3>
            <div className="space-y-4">
              {[
                { label: 'Neural_Parser', status: 'Optimal' },
                { label: 'Logic_Gates', status: 'Stable' },
                { label: 'Signal_Delay', status: '14ms' },
                { label: 'Entropy_Check', status: 'Normal' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center p-5 bg-black/40 border border-zinc-800/50 rounded-2xl hover:border-brand-primary/20 transition-all group">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono group-hover:text-zinc-400 transition-colors">{item.label}</span>
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest font-display">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-brand-accent/15 to-brand-accent/5 border border-brand-accent/20 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-12 -right-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
              <Zap size={180} className="text-brand-accent" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-accent shadow-xl">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tight font-display">Neural Prototyping</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed tracking-[0.1em] font-mono">
                Safe-mode testing environment for behavioral algorithms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
