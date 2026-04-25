import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Clock, 
  Calendar, 
  User, 
  Plus, 
  MoreVertical,
  Trash2,
  Play,
  Pause,
  AlertCircle,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Scheduler() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSignal, setNewSignal] = useState({ target: '', time: '', message: '' });

  useEffect(() => {
    fetch('/api/wa/schedules')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(() => {});
  }, []);

  const addSignal = async () => {
    if (!newSignal.target || !newSignal.time || !newSignal.message) return;
    const newTask = { 
      id: Date.now(), 
      ...newSignal, 
      status: 'pending' 
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setIsModalOpen(false);
    setNewSignal({ target: '', time: '', message: '' });
    
    try {
      await fetch('/api/wa/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTasks)
      });
    } catch {}
  };

  const removeSignal = async (id: number) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    try {
      await fetch('/api/wa/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTasks)
      });
    } catch {}
  };

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase font-display">Signal_Scheduler</h2>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-brand-primary" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] font-mono">Timed Signal Deployment Hub</span>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-brand-primary text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
        >
          <Plus size={16} />
          New_Signal
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-morphism rounded-[3rem] p-10 border border-white/10 space-y-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white">
              <X size={20} />
            </button>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white italic uppercase font-display">New_Signal_Sequence</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Configure Neural Target</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-400 font-black uppercase font-mono ml-2">Target Node (Number without @s.whatsapp.net)</label>
                <input 
                  type="text" 
                  value={newSignal.target}
                  onChange={e => setNewSignal({...newSignal, target: e.target.value})}
                  placeholder="e.g. 2348100000000"
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl p-5 text-white font-mono text-sm focus:border-brand-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-400 font-black uppercase font-mono ml-2">Deployment Timestamp</label>
                <input 
                  type="datetime-local" 
                  value={newSignal.time}
                  onChange={e => setNewSignal({...newSignal, time: e.target.value})}
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl p-5 text-white font-mono text-sm focus:border-brand-primary outline-none color-scheme-dark"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-400 font-black uppercase font-mono ml-2">Signal Payload</label>
                <textarea 
                  value={newSignal.message}
                  onChange={e => setNewSignal({...newSignal, message: e.target.value})}
                  placeholder="Enter message..."
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl p-5 text-white text-sm focus:border-brand-primary outline-none min-h-[120px] resize-none"
                />
              </div>
              <button 
                onClick={addSignal}
                className="w-full py-6 bg-brand-primary text-black font-black uppercase tracking-[0.2em] rounded-3xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] font-display"
              >
                Initalize_Sequence
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-8 text-[10px] text-zinc-600 font-black uppercase tracking-widest font-mono">
            <span>Pending_Sequences</span>
            <span>Count: {tasks.length}</span>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="glass-morphism rounded-[2.5rem] p-8 border border-white/5 group hover:border-brand-primary/30 transition-all relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700 shadow-inner group-hover:text-brand-primary transition-colors">
                      <Clock size={28} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-black text-white italic tracking-tight font-display uppercase">{task.target}</h4>
                        <div className={cn(
                          "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                          task.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"
                        )}>
                          {task.status}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-bold font-mono">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {task.time}</span>
                        <span className="flex items-center gap-1 italic">" {task.message.substring(0, 30)}... "</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => removeSignal(task.id)}
                      className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 border-2 border-dashed border-zinc-800 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4 group cursor-pointer hover:border-zinc-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900/50 flex items-center justify-center text-zinc-600 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest font-mono">Add_Incremental_Signal</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-morphism rounded-[2.5rem] p-10 border border-white/5 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <AlertCircle size={40} className="text-zinc-600" />
            </div>
            <div className="space-y-1 relative z-10">
              <h3 className="text-xl font-black text-white italic tracking-tight font-display uppercase">Protocol_Guide</h3>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Optimum Signal Deployment</p>
            </div>
            
            <div className="space-y-6 relative z-10">
              {[
                { title: "Avoid Burst Overlap", desc: "Keep at least 5 minutes between scheduled messages to the same subject." },
                { title: "Variable Payload", desc: "AI will automatically vary some words to bypass spam pattern matching." },
                { title: "Stealth Hours", desc: "Signals between 01:00 and 06:00 have higher risk flags." }
              ].map((guide, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-1 h-1 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">{guide.title}</p>
                    <p className="text-[9px] text-zinc-500 font-medium leading-relaxed font-mono">{guide.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-5 bg-zinc-900 border border-zinc-800 text-zinc-300 font-black text-[9px] uppercase tracking-widest rounded-2xl hover:bg-zinc-800 transition-all">
              Initialize_Safety_Audit
            </button>
          </div>

          <div className="glass-morphism rounded-[2.5rem] p-10 border border-brand-primary/10 bg-brand-primary/[0.02] space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Megaphone size={18} />
              </div>
              <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] font-mono">Neural_Broadcaster</p>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium italic">
              "System is ready to relay all signals via verified encrypted nodes. Ensure target JIDs are valid before execution."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
