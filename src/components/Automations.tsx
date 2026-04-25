import React, { useState, useEffect } from 'react';
import { Zap, Settings, Eye, MessageSquare, Heart, Hash, RefreshCcw, ShieldCheck, Brain, EyeOff, User, Plus, Trash2, FileUp } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Automations() {
  const [globalSettings, setGlobalSettings] = useState({
    autoViewMessages: true,
    autoViewStatus: true,
    autoReaction: true,
    tagAllEnabled: true,
    autoReplyHi: true,
    ghostMode: false,
    antiViewOnce: true,
    autoRecoverViewOnce: false,
    aiReplyEnabled: false,
    aiReplyTone: 'Helpful and professional',
    aiSystemPrompt: 'You are "Aura Glitch", a highly advanced and helpful WhatsApp AI. Reply concisely and naturally.',
    autoLearningEnabled: false,
    aiLikeMeEnabled: false,
    alwaysOnline: false,
    alwaysTyping: false,
    aiTranslation: false
  });

  const [trainingData, setTrainingData] = useState<{ user: string; assistant: string }[]>([]);
  const [newTraining, setNewTraining] = useState({ user: '', assistant: '' });
  const [logs, setLogs] = useState<{ input: string, output: string, jid: string, timestamp: number }[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/wa/settings')
      .then(res => res.json())
      .then(data => setGlobalSettings(data))
      .catch(() => {});

    fetch('/api/wa/training')
      .then(res => res.json())
      .then(data => setTrainingData(data))
      .catch(() => {});

    const fetchLogs = () => {
      fetch('/api/wa/logs')
        .then(res => res.json())
        .then(data => setLogs(data))
        .catch(() => {});
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          const validData = json.filter(item => item.user && item.assistant);
          const newData = [...trainingData, ...validData];
          setTrainingData(newData);
          await fetch('/api/wa/training', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newData)
          });
        }
      } catch (err) {
        console.error('Failed to parse training data:', err);
      }
    };
    reader.readAsText(file);
  };

  const addTrainingPair = async () => {
    if (!newTraining.user || !newTraining.assistant) return;
    const newData = [...trainingData, newTraining];
    setTrainingData(newData);
    setNewTraining({ user: '', assistant: '' });
    try {
      await fetch('/api/wa/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
    } catch (err) {}
  };

  const removeTrainingPair = async (index: number) => {
    const newData = trainingData.filter((_, i) => i !== index);
    setTrainingData(newData);
    try {
      await fetch('/api/wa/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
    } catch (err) {}
  };

  const updateGlobalSetting = async (key: string, value: boolean) => {
    const newSettings = { ...globalSettings, [key]: value };
    setGlobalSettings(newSettings);
    try {
      await fetch('/api/wa/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (err) {}
  };

  const settingsItems = [
    { key: 'alwaysOnline', label: 'Always Online', icon: RefreshCcw, desc: 'Maintain persistent 24/7 presence.' },
    { key: 'alwaysTyping', label: 'Always Typing', icon: MessageSquare, desc: 'Show typing status continuously when active.' },
    { key: 'aiLikeMeEnabled', label: 'AI Ghost (Mimic Me)', icon: User, desc: 'Mimic your linguistic style & slang.' },
    { key: 'safeMode', label: 'Safe Anti-Ban', icon: ShieldCheck, desc: 'Enable mandatory safety delays across all ops.' },
    { key: 'aiThinkingDelay', label: 'AI Cognition Delay', icon: Brain, desc: 'Simulate human thinking time for AI replies.' },
    { key: 'aiTranslation', label: 'AI Neural Translate', icon: RefreshCcw, desc: 'Real-time decrypt/encrypt across global nodes.' },
    { key: 'autoViewMessages', label: 'Autoview Chat', icon: MessageSquare, desc: 'Auto-send read receipts instantly.' },
    { key: 'autoViewStatus', label: 'Autoview Status', icon: Eye, desc: 'Auto-view every status update.' },
    { key: 'autoReaction', label: 'Auto-Reaction', icon: Heart, desc: 'Quick-react with ❤️ to all messages.' },
    { key: 'autoReplyHi', label: 'Auto-Reply Hi', icon: MessageSquare, desc: 'Automatically respond to "hi" with a welcome message.' },
    { key: 'tagAllEnabled', label: 'Tag-All Command', icon: Hash, desc: 'Enable !tagall in groups.' },
    { key: 'ghostMode', label: 'Ghost Mode', icon: ShieldCheck, desc: 'Interact invisibly (no online/blue ticks).' },
    { key: 'antiViewOnce', label: 'Anti-ViewOnce', icon: EyeOff, desc: 'Intercept and recover view-once media via .vv' },
    { key: 'autoRecoverViewOnce', label: 'Auto-Save ViewOnce', icon: Zap, desc: 'Automatically resend view-once media as regular.' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-brand-primary" />
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] font-mono">Heuristic_Config</span>
        </div>
        <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter font-display leading-tight">
          Automation <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-emerald-400">Protocols</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium tracking-tight max-w-xl">
          Configure autonomous behavioral heuristics and real-time interaction logic gates.
        </p>
      </div>

      <div className="glass-morphism rounded-[3rem] p-10 space-y-10 shadow-2xl relative overflow-hidden border border-white/5 glow-card">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
          <Settings size={300} />
        </div>
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="p-4 bg-zinc-900/80 rounded-2xl text-emerald-500 border border-zinc-800 shadow-xl">
            <Settings size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic font-display">Core Heuristics</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1 font-mono">Primary Operational Parameters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {settingsItems.map((setting) => (
            <div key={setting.key} className="bg-black/40 border border-zinc-900 p-6 rounded-[2rem] flex items-center gap-5 hover:border-brand-primary/30 transition-all group shadow-inner">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                (globalSettings as any)[setting.key] 
                  ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                  : "bg-zinc-900/50 text-zinc-700 border border-zinc-800"
              )}>
                <setting.icon size={22} className={cn((globalSettings as any)[setting.key] && "animate-pulse-soft")} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black text-white tracking-widest uppercase italic font-display">{setting.label}</p>
                <p className="text-[9px] text-zinc-600 font-bold uppercase leading-none mt-2 font-mono tracking-tight">{setting.desc}</p>
              </div>
              <button 
                onClick={() => updateGlobalSetting(setting.key, !(globalSettings as any)[setting.key])}
                className={cn(
                  "w-14 h-7 rounded-full relative transition-all duration-500 shadow-inner overflow-hidden border",
                  (globalSettings as any)[setting.key] ? "bg-brand-primary border-brand-primary" : "bg-zinc-800 border-zinc-700"
                )}
              >
                {(globalSettings as any)[setting.key] && (
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] animate-[shimmer_2s_infinite]" />
                )}
                <motion.div 
                  animate={{ x: (globalSettings as any)[setting.key] ? 28 : 4 }}
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg z-10"
                />
              </button>
            </div>
          ))}
          
          <div className="bg-black/40 border border-zinc-900 p-6 rounded-[2rem] flex items-center gap-5 hover:border-brand-primary/30 transition-all group shadow-inner">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
              globalSettings.aiReplyEnabled 
                ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                : "bg-zinc-900/50 text-zinc-700 border border-zinc-800"
            )}>
              <Brain size={22} className={cn(globalSettings.aiReplyEnabled && "animate-pulse-soft")} />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-black text-white tracking-widest uppercase italic font-display">AI Smart Replies</p>
              <p className="text-[9px] text-zinc-600 font-bold uppercase leading-none mt-2 font-mono tracking-tight">Autonomous Neural Response Engine (Gemini)</p>
            </div>
            <button 
              onClick={() => updateGlobalSetting('aiReplyEnabled', !globalSettings.aiReplyEnabled)}
              className={cn(
                "w-14 h-7 rounded-full relative transition-all duration-500 shadow-inner overflow-hidden border",
                globalSettings.aiReplyEnabled ? "bg-brand-primary border-brand-primary" : "bg-zinc-800 border-zinc-700"
              )}
            >
              {globalSettings.aiReplyEnabled && (
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] animate-[shimmer_2s_infinite]" />
              )}
              <motion.div 
                animate={{ x: globalSettings.aiReplyEnabled ? 28 : 4 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg z-10"
              />
            </button>
          </div>
        </div>

        {globalSettings.aiReplyEnabled && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 text-brand-primary">
              <Brain size={120} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                  <Settings size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white italic tracking-tight uppercase font-display">Neural Persona Config</h3>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] font-mono">Response Calibration Layer</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-400 font-black uppercase tracking-widest font-mono">Neural Core Protocol (System Prompt)</label>
                <textarea 
                  value={globalSettings.aiSystemPrompt}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, aiSystemPrompt: e.target.value })}
                  onBlur={() => {
                    fetch('/api/wa/settings', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(globalSettings)
                    });
                  }}
                  className="w-full bg-black/60 border border-zinc-800 rounded-2xl p-4 text-brand-primary text-xs focus:border-brand-primary/50 outline-none transition-all placeholder:text-zinc-700 min-h-[80px] resize-none font-mono mb-4"
                  placeholder="The core behavior instructions for the AI..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-400 font-black uppercase tracking-widest font-mono">AI Response Tone & Style</label>
                <textarea 
                  value={globalSettings.aiReplyTone}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, aiReplyTone: e.target.value })}
                  onBlur={() => {
                    fetch('/api/wa/settings', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(globalSettings)
                    });
                  }}
                  className="w-full bg-black/60 border border-zinc-800 rounded-2xl p-4 text-zinc-300 text-sm focus:border-brand-primary/50 outline-none transition-all placeholder:text-zinc-700 min-h-[100px] resize-none font-mono"
                  placeholder="e.g. Helpful, professional, and concise. Always end with a friendly closing."
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-black/40 border border-zinc-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Zap size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white font-bold uppercase tracking-wider">AI Auto-Learning</p>
                    <p className="text-[8px] text-zinc-500 font-medium font-mono">ENHANCE GENERATION VIA INTERACTION HISTORY</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateGlobalSetting('autoLearningEnabled', !globalSettings.autoLearningEnabled)}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-all duration-500 border",
                    globalSettings.autoLearningEnabled ? "bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-zinc-800 border-zinc-700"
                  )}
                >
                  <motion.div 
                    animate={{ x: globalSettings.autoLearningEnabled ? 26 : 4 }}
                    className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/40 border border-zinc-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white font-bold uppercase tracking-wider">AI Ghost (Mimic Me)</p>
                    <p className="text-[8px] text-zinc-500 font-medium font-mono">ADOPT USER LINGUISTIC STYLE & SLANG</p>
                  </div>
                </div>
                <button 
                  onClick={() => updateGlobalSetting('aiLikeMeEnabled', !globalSettings.aiLikeMeEnabled)}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-all duration-500 border",
                    globalSettings.aiLikeMeEnabled ? "bg-brand-primary border-brand-primary shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-zinc-800 border-zinc-700"
                  )}
                >
                  <motion.div 
                    animate={{ x: globalSettings.aiLikeMeEnabled ? 26 : 4 }}
                    className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>

              <div className="pt-4 border-t border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase italic tracking-wider font-display">Training Repository</h4>
                    <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.1em] font-mono">Manual datasets for behavior alignment</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept=".json" 
                      className="hidden" 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
                    >
                      <FileUp size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-[8px] text-zinc-500 font-bold uppercase ml-1">Input Sample</p>
                    <input 
                      value={newTraining.user}
                      onChange={(e) => setNewTraining({ ...newTraining, user: e.target.value })}
                      placeholder="e.g. How are you?"
                      className="w-full bg-black/60 border border-zinc-800 rounded-xl p-2 text-[10px] text-zinc-300 focus:border-brand-primary/50 outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] text-zinc-500 font-bold uppercase ml-1">Desired Response</p>
                    <div className="flex gap-2">
                      <input 
                        value={newTraining.assistant}
                        onChange={(e) => setNewTraining({ ...newTraining, assistant: e.target.value })}
                        placeholder="e.g. I am glitching with energy!"
                        className="flex-1 bg-black/60 border border-zinc-800 rounded-xl p-2 text-[10px] text-zinc-300 focus:border-brand-primary/50 outline-none font-mono"
                      />
                      <button 
                        onClick={addTrainingPair}
                        className="p-2 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 rounded-xl border border-brand-primary/20 transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {trainingData.map((pair, idx) => (
                    <div key={idx} className="group relative bg-black/20 border border-zinc-800/50 rounded-xl p-3 flex flex-col gap-1">
                      <button 
                        onClick={() => removeTrainingPair(idx)}
                        className="absolute top-2 right-2 p-1.5 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all bg-black/50 rounded-lg"
                      >
                        <Trash2 size={12} />
                      </button>
                      <div className="flex items-start gap-2">
                        <span className="text-[8px] font-black text-emerald-500 uppercase font-mono mt-0.5">IN:</span>
                        <p className="text-[10px] text-zinc-400 font-medium italic">"{pair.user}"</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[8px] font-black text-brand-primary uppercase font-mono mt-0.5">OUT:</span>
                        <p className="text-[10px] text-white font-bold tracking-tight">{pair.assistant}</p>
                      </div>
                    </div>
                  ))}
                  {trainingData.length === 0 && (
                    <div className="py-8 text-center border-2 border-dashed border-zinc-800/30 rounded-2xl">
                      <Brain size={24} className="mx-auto text-zinc-800 mb-2" />
                      <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest font-mono">Neural Repository Empty</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-white uppercase italic tracking-wider font-display">Interaction Logs</h4>
                      <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.1em] font-mono">Real-time AI thought process & output</p>
                    </div>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {logs.map((log, idx) => (
                      <div key={idx} className="bg-black/40 border border-zinc-800/80 rounded-xl p-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] text-zinc-600 font-mono font-bold uppercase">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <span className="text-[8px] text-brand-primary/60 font-mono font-bold truncate max-w-[150px] uppercase">TARGET: {log.jid.split('@')[0]}</span>
                        </div>
                        <div className="space-y-1 text-[10px]">
                          <div className="flex gap-2">
                            <span className="text-emerald-500 font-bold uppercase flex-shrink-0">PROMPT:</span>
                            <span className="text-zinc-400 italic">"{log.input}"</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-brand-primary font-bold uppercase flex-shrink-0">REPLY:</span>
                            <span className="text-white font-medium">{log.output}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {logs.length === 0 && (
                      <div className="py-6 text-center border border-zinc-900 rounded-2xl bg-black/20">
                        <p className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest font-mono">No interactions recorded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
