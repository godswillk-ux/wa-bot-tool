import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Trash2, Shield, Clock, User, MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface DeletedMessage {
  jid: string;
  text: string;
  pushName: string;
  timestamp: number;
  originalTimestamp: number;
  key: any;
}

export default function AntiDelete({ privacyMode }: { privacyMode?: boolean }) {
  const [deletedMessages, setDeletedMessages] = useState<DeletedMessage[]>([]);

  useEffect(() => {
    const socket = io();
    socket.on('wa.deleted_message', (msg: DeletedMessage) => {
      setDeletedMessages(prev => [msg, ...prev].slice(0, 50));
    });

    return () => {
      socket.off('wa.deleted_message');
    };
  }, []);

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-red-500" />
          <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] font-mono">Security_Protocol</span>
        </div>
        <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter font-display leading-tight">
          Anti-Delete <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Logger</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium tracking-tight max-w-xl">
          Real-time interception and recovery of revoked messages across all monitored nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="glass-morphism rounded-[3rem] p-10 space-y-10 border border-red-500/10 glow-card min-h-[600px] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-xl">
                <Trash2 size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase italic tracking-tight font-display text-white">Revocation Stream</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Intercepted Payload Distribution</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="px-5 py-2 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">ACTIVE_MONITOR</span>
              </div>
              <button 
                onClick={() => setDeletedMessages([])}
                className="px-5 py-2 hover:bg-zinc-800 border border-zinc-800 rounded-2xl text-[10px] font-black text-zinc-500 uppercase tracking-widest transition-all"
              >
                CLEAR_LOGS
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-4">
            <AnimatePresence initial={false}>
              {deletedMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                  <Shield size={64} className="text-zinc-500 mb-6" />
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Awaiting revocation trigger events...</p>
                </div>
              ) : (
                deletedMessages.map((msg, i) => (
                  <motion.div
                    key={msg.key.id + i}
                    initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-8 bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] group hover:border-red-500/30 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                      <Trash2 size={120} />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                            <User size={18} />
                          </div>
                          <div>
                            <p className={cn(
                              "text-xs font-black text-white italic tracking-tight font-display uppercase transition-all duration-500",
                              privacyMode && "blur-md select-none"
                            )}>{msg.pushName || 'Unknown Subject'}</p>
                            <p className={cn(
                              "text-[9px] text-zinc-600 font-bold uppercase tracking-widest font-mono transition-all duration-500",
                              privacyMode && "blur-sm select-none"
                            )}>LINK_NODE: {msg.jid}</p>
                          </div>
                        </div>

                        <div className="p-6 bg-black/40 border border-white/5 rounded-2xl relative shadow-inner">
                          <div className="absolute -top-3 left-4 px-3 py-1 bg-red-500 text-black text-[8px] font-black uppercase tracking-widest rounded-full">
                            RECOVERED_CONTENT
                          </div>
                          <p className={cn(
                            "text-sm font-medium text-zinc-200 leading-relaxed italic transition-all duration-500",
                            privacyMode && "blur-md select-none"
                          )}>
                            "{msg.text}"
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 min-w-[200px]">
                        <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
                          <Clock size={12} className="text-zinc-500" />
                          <div className="text-[9px] font-bold text-zinc-400 font-mono">
                            REVOKED: {new Date(msg.timestamp * 1000).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[8px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
                          <AlertCircle size={10} />
                          Integrity Breach Detected
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
