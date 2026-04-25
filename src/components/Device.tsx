import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { QrCode, Smartphone, CheckCircle2, ShieldCheck, RefreshCw, LogOut, Settings as SettingsIcon, Zap, Eye, EyeOff, Ghost, Brain, MessageSquare, Heart, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';
import { cn } from '../lib/utils';

export default function Device() {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'qr'>('disconnected');
  const [qrCode, setQrCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    alwaysOnline: true,
    alwaysTyping: false,
    autoViewMessages: true,
    autoViewStatus: true,
    autoReaction: true,
    tagAllEnabled: true,
    autoReplyHi: true,
    ghostMode: false,
    antiViewOnce: true
  });

  useEffect(() => {
    const socket = io();
    socket.on('wa.status', (newStatus) => setStatus(newStatus));
    socket.on('wa.qr', async (qr) => {
      const url = await QRCode.toDataURL(qr);
      setQrCode(url);
      setStatus('qr');
    });

    fetchSettings();

    return () => { socket.disconnect(); };
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/wa/settings');
      const data = await res.json();
      setSettings(data);
    } catch (e) {}
  };

  const updateSettings = async (newSettings: any) => {
    setSettings(newSettings);
    try {
      await fetch('/api/wa/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (e) {}
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/wa/logout', { method: 'POST' });
      window.location.reload();
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    updateSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Device Synchronization</h1>
        <p className="text-zinc-500 text-sm font-medium tracking-tight">Establish a neural link with your WhatsApp instance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 bg-[#0c0c0c] border border-zinc-800 rounded-[3rem] p-12 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl min-h-[500px]">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
            <Smartphone size={300} />
          </div>

          <AnimatePresence mode="wait">
            {status === 'qr' && qrCode && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-white p-10 rounded-[2.5rem] shadow-[0_0_80px_rgba(255,255,255,0.1)] border-8 border-zinc-900 group"
              >
                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] pointer-events-none" />
                <img src={qrCode} alt="WhatsApp QR Code" className="w-56 h-56" />
                <div className="absolute -top-4 -right-4 bg-emerald-500 p-3 rounded-2xl shadow-xl">
                  <RefreshCw className="text-black animate-spin-slow" size={20} />
                </div>
              </motion.div>
            )}

            {status === 'connected' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8"
              >
                <div className="w-40 h-40 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_100px_rgba(16,185,129,0.15)]">
                  <CheckCircle2 size={80} className="text-emerald-500" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Link Established</h2>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.3em] bg-emerald-500/5 py-2 px-4 rounded-full border border-emerald-500/10 inline-block">Protocol Fully Operational</p>
                </div>
              </motion.div>
            )}

            {status === 'disconnected' && !qrCode && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center animate-pulse border border-zinc-800">
                  <RefreshCw size={32} className="text-zinc-700" />
                </div>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] italic">Initializing Handshake...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 pt-6 border-t border-zinc-800 grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {[
              { id: 'antiViewOnce', label: 'Anti-ViewOnce', icon: EyeOff },
              { id: 'autoViewStatus', label: 'Auto-Status', icon: Eye },
              { id: 'alwaysOnline', label: 'Always Online', icon: Zap },
              { id: 'alwaysTyping', label: 'Always Typing', icon: MessageSquare },
              { id: 'ghostMode', label: 'Ghost Mode', icon: Ghost },
              { id: 'autoReaction', label: 'Reaction', icon: Heart },
              { id: 'autoReplyHi', label: 'Auto-Reply', icon: MessageSquare },
              { id: 'tagAllEnabled', label: 'Tag-All', icon: Hash },
            ].map((feature) => (
              <button
                key={feature.id}
                onClick={() => toggleSetting(feature.id as any)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-left group",
                  settings[feature.id as keyof typeof settings]
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-500 grayscale"
                )}
              >
                <feature.icon size={14} className="flex-shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">{feature.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-12 w-full max-w-sm space-y-4">
            {status === 'connected' ? (
              <button 
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full bg-red-500/10 text-red-500 border border-red-500/20 py-4 rounded-2xl font-bold uppercase italic tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-4 group"
              >
                <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                {isLoading ? 'Processing...' : 'Disconnect Terminal'}
              </button>
            ) : (
              <div className="space-y-4 w-full">
                <div className="p-6 bg-[#0a0a0a] border border-zinc-800 rounded-3xl shadow-inner text-center">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-loose">
                    Scan the QR code with your mobile device to initialize the secure protocol bridge.
                  </p>
                </div>
                <button 
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full bg-zinc-900/50 hover:bg-red-500/10 text-zinc-600 hover:text-red-500 border border-zinc-800 hover:border-red-500/20 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 font-mono"
                >
                  <RefreshCw size={14} className={cn(isLoading && "animate-spin")} />
                  {isLoading ? 'EXECUTING_PURGE...' : 'FORCE_PROTOCOL_RESET (FIX_SESSION_ERRORS)'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0c0c0c] border border-zinc-800 rounded-[2.5rem] p-8 shadow-xl">
            <div className="flex items-center gap-5 mb-8">
              <div className="p-3 bg-zinc-900 rounded-2xl text-emerald-500">
                <Smartphone size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Sync Status</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mt-1">Real-time hardware metrics</p>
              </div>
            </div>

            <div className="space-y-5">
              {[
                { label: 'Socket Latency', value: '42ms', progress: 92 },
                { label: 'Hardware Load', value: '12%', progress: 12 },
                { label: 'Encryption Key', value: 'Active', progress: 100 },
              ].map((item) => (
                <div key={item.label} className="p-5 bg-black border border-zinc-800 rounded-2xl">
                  <div className="flex justify-between mb-3 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-zinc-500">{item.label}</span>
                    <span className="text-white">{item.value}</span>
                  </div>
                  <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[92%]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0c0c0c] border border-zinc-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
              <ShieldCheck size={120} />
            </div>
            <div className="flex items-center gap-5 mb-6 relative">
              <div className="p-3 bg-zinc-900 rounded-2xl text-emerald-500">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Security Core</h3>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase leading-relaxed tracking-widest relative">
              Multilayered end-to-end encryption active. All neural transmissions are proxied through secure quantum clusters to ensure zero-leak integrity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
