import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { 
  Zap, 
  Users, 
  MessageSquare, 
  Megaphone, 
  Settings as SettingsIcon,
  LayoutDashboard,
  Brain,
  Power,
  Activity,
  Trash2
} from 'lucide-react';
import DashboardView from './components/Dashboard';
import DeviceView from './components/Device';
import ContactsView from './components/Contacts';
import AutomationsView from './components/Automations';
import CampaignsView from './components/Campaigns';
import SimulatorView from './components/Simulator';
import AntiDeleteView from './components/AntiDelete';
import AnalyticsView from './components/Analytics';
import SchedulerView from './components/Scheduler';
import { cn } from './lib/utils';
import { View } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'qr'>('disconnected');
  const [privacyMode, setPrivacyMode] = useState(false);

  useEffect(() => {
    const socket = io();
    socket.on('wa.status', (newStatus) => setStatus(newStatus));
    
    socket.on('wa.ai_request', async (data: any) => {
      const { requestId, text, settings, training, kb } = data;
      console.log(`[AI Request] ID: ${requestId}, Text: ${text}`);

      try {
        let contextStr = "";
        if (training && training.length > 0) {
          contextStr += "\nNeural Pre-Training Data:\n" + 
            training.map((t: any) => `User: ${t.user}\nAssistant: ${t.assistant}`).join("\n---\n") + "\n";
        }

        if (kb && kb.length > 0) {
          contextStr += "\nReference for linguistic style (recent history):\n" + 
            kb.map((k: any) => k.user ? `Example Context: ${k.user}\nStyle Target: ${k.assistant}` : `Style Sample: ${k.text}`).join("\n---\n") + "\n";
        }

        const mimicInstruction = settings.mimicMe ? 
          `MANDATORY STYLE INSTRUCTION: You are mimicking the account owner. Analyze the provided Style Samples and Style Targets. Adopt their slang, emoji usage, and level of formality EXACTLY. Do not use AI clichés like "How can I help you?". Reply as if you are the owner having a natural conversation.` : 
          `Tone/Style Requirement: ${settings.tone}`;

        const translationInstruction = settings.translate ? 
          `TRANSLATION INSTRUCTION: Detect the language of the User Message. Regardless of the language detected, you MUST reply in that SAME language. If the language is not English, first translate the intent to your core logic, then translate your reply BACK to the user's language smoothly.` : "";

        const finalSystemPrompt = settings.systemPrompt || 'You are "Aura Glitch", an AI WhatsApp assistant.';
        const prompt = `${finalSystemPrompt}
${mimicInstruction}
${translationInstruction}
${contextStr}
User Message: "${text}"
Provide a natural, concise reply. Do not use generic AI-sounding intros. Just the reply.`;

        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const reply = result.response.text().trim();
        
        socket.emit(`wa.ai_response.${requestId}`, {
          reply,
          log: {
            input: text,
            output: reply,
            timestamp: Date.now()
          }
        });
      } catch (err) {
        console.error("AI Generation Error in Frontend:", err);
        socket.emit(`wa.ai_response.${requestId}`, null);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Control Hub' },
    { id: 'analytics', icon: Activity, label: 'Analytics' },
    { id: 'device', icon: Zap, label: 'Link Device' },
    { id: 'contacts', icon: Users, label: 'Contacts' },
    { id: 'scheduler', icon: Megaphone, label: 'Scheduler' },
    { id: 'automations', icon: Zap, label: 'Automations' },
    { id: 'anti-delete', icon: Trash2, label: 'Anti-Delete' },
    { id: 'campaigns', icon: Megaphone, label: 'Campaigns' },
    { id: 'simulator', icon: MessageSquare, label: 'Simulator' },
  ];

  return (
    <div className={cn(
      "flex h-screen bg-[#050505] overflow-hidden font-sans selection:bg-brand-primary/30 transition-all duration-700",
      privacyMode && "grayscale-[0.5] contrast-[1.1]"
    )}>
      {/* Sidebar */}
      <aside className="w-72 bg-[#020202] border-r border-zinc-800/50 flex flex-col relative z-20 shadow-[10px_0_40px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#10b98110_0%,_transparent_50%)] pointer-events-none" />
        
        <div className="p-8 relative">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl relative group overflow-hidden">
              <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Zap size={24} className="text-brand-primary relative z-10 animate-pulse-soft" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white italic uppercase leading-tight font-display">AURA GLITCH</h1>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-[0.3em] font-mono">NEURAL_IO</span>
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as View)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative border border-transparent",
                  currentView === item.id 
                    ? "bg-zinc-900/80 border-zinc-700/50 text-white shadow-[0_10px_20px_rgba(0,0,0,0.4)] backdrop-blur-md" 
                    : "text-zinc-500 hover:text-white hover:bg-zinc-900/30 hover:border-zinc-800/50"
                )}
              >
                {currentView === item.id && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-brand-primary/[0.03] to-transparent rounded-2xl -z-10" 
                  />
                )}
                <item.icon size={18} className={cn(
                  "transition-all duration-300",
                  currentView === item.id ? "text-brand-primary scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "group-hover:text-zinc-300"
                )} />
                <span className="text-[11px] font-bold tracking-[0.15em] uppercase italic font-display">{item.label}</span>
              </button>
            ))}
          </nav>
          
          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-zinc-900/50">
            <p className="px-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4 font-mono">Quick_Ops</p>
            <button 
              onClick={() => setPrivacyMode(!privacyMode)}
              className={cn(
                "w-full flex items-center justify-between px-5 py-3 rounded-xl transition-all border",
                privacyMode 
                  ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary" 
                  : "bg-zinc-900/20 border-zinc-800/50 text-zinc-500 hover:border-zinc-700/50"
              )}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={14} className={privacyMode ? "animate-pulse" : ""} />
                <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Privacy Shield</span>
              </div>
              <div className={cn(
                "w-8 h-4 rounded-full relative transition-colors duration-300",
                privacyMode ? "bg-brand-primary" : "bg-zinc-800"
              )}>
                <motion.div 
                  animate={{ x: privacyMode ? 18 : 2 }}
                  className="absolute top-1 w-2 h-2 bg-white rounded-full"
                />
              </div>
            </button>
          </div>
        </div>

        <div className="mt-auto p-8 border-t border-zinc-900 bg-[#030303]/80 backdrop-blur-md">
          <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 relative overflow-hidden group shadow-inner">
            <div className="absolute top-0 right-0 p-2 opacity-[0.05] group-hover:scale-125 transition-transform">
              <Activity size={40} className="text-white" />
            </div>
            <div className="flex items-center gap-3 relative">
              <div className={cn(
                "w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px]",
                status === 'connected' ? "bg-emerald-500 shadow-emerald-500/50" : "bg-red-500 shadow-red-500/50"
              )} />
              <div>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1 font-mono">Connection_State</p>
                <p className="text-[10px] font-bold text-white uppercase italic tracking-wider font-display">
                  {status.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden bg-[#030303]">
        {/* Immersive Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#10b98108_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_#3b82f605_0%,_transparent_40%)]" />
          <div className="absolute inset-0 opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
            <div className="grid grid-cols-[repeat(40,minmax(0,1fr))] h-full w-full">
              {Array.from({ length: 1600 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-zinc-700/30" />
              ))}
            </div>
          </div>
        </div>

        <div className="h-full overflow-y-auto custom-scrollbar relative z-10 scroll-smooth">
          <div className="p-12 pb-32 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {currentView === 'dashboard' && <DashboardView privacyMode={privacyMode} />}
                {currentView === 'device' && <DeviceView />}
                {currentView === 'contacts' && <ContactsView privacyMode={privacyMode} />}
                {currentView === 'automations' && <AutomationsView />}
                {currentView === 'campaigns' && <CampaignsView />}
                {currentView === 'anti-delete' && <AntiDeleteView privacyMode={privacyMode} />}
                {currentView === 'simulator' && <SimulatorView privacyMode={privacyMode} />}
                {currentView === 'analytics' && <AnalyticsView />}
                {currentView === 'scheduler' && <SchedulerView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
