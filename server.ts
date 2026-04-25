import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason, WAMessageStubType, downloadMediaMessage } from '@whiskeysockets/baileys';
import NodeCache from 'node-cache';
import pino from 'pino';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authFolder = path.join(__dirname, 'wa_auth');
const logger = pino({ level: 'silent' });
const PORT = 3000;

// Settings Management
const SETTINGS_FILE = path.join(__dirname, 'settings.json');
const defaultSettings = {
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
  alwaysOnline: true,
  alwaysTyping: false,
  privacyMode: false,
  safeMode: true,
  aiThinkingDelay: true,
  aiTranslation: false
};

const KNOWLEDGE_PATH = path.join(process.cwd(), 'knowledge_base.json');
const TRAINING_PATH = path.join(process.cwd(), 'training_data.json');
const AI_LOGS_PATH = path.join(process.cwd(), 'ai_logs.json');
const SCHEDULES_PATH = path.join(process.cwd(), 'schedules.json');

function getSchedules() {
  if (fs.existsSync(SCHEDULES_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(SCHEDULES_PATH, 'utf-8'));
    } catch (e) { return []; }
  }
  return [];
}

function saveSchedules(schedules: any[]) {
  fs.writeFileSync(SCHEDULES_PATH, JSON.stringify(schedules, null, 2));
}

function getAiLogs() {
  if (fs.existsSync(AI_LOGS_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(AI_LOGS_PATH, 'utf-8'));
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveAiLog(log: { input: string, output: string, jid: string, timestamp: number }) {
  const current = getAiLogs();
  current.unshift(log);
  // Keep last 50 logs
  fs.writeFileSync(AI_LOGS_PATH, JSON.stringify(current.slice(0, 50), null, 2));
}

function getKnowledgeBase() {
  if (fs.existsSync(KNOWLEDGE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(KNOWLEDGE_PATH, 'utf-8'));
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveToKnowledgeBase(data: { user?: string, assistant?: string, text?: string }) {
  const current = getKnowledgeBase();
  current.push({ ...data, timestamp: Date.now() });
  // Keep only last 100 entries for better style modeling
  const trimmed = current.slice(-100);
  fs.writeFileSync(KNOWLEDGE_PATH, JSON.stringify(trimmed, null, 2));
}

function getTrainingData() {
  if (fs.existsSync(TRAINING_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(TRAINING_PATH, 'utf-8'));
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveTrainingData(data: { user: string; assistant: string }[]) {
  fs.writeFileSync(TRAINING_PATH, JSON.stringify(data, null, 2));
}

function getSettings() {
  if (fs.existsSync(SETTINGS_FILE)) {
    try {
      return { ...defaultSettings, ...JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8')) };
    } catch (e) {
      return defaultSettings;
    }
  }
  return defaultSettings;
}

function saveSettings(settings: any) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

let sock: any;
const messageStore = new Map<string, any>();

async function startServer() {
  const app = express();
  app.use(express.json());

  const getAI = () => {
    return null;
  };

  const getSmartReplyRelay = (incomingText: string, jid: string) => {
    return new Promise((resolve) => {
      const requestId = Math.random().toString(36).substring(7);
      
      const timeout = setTimeout(() => {
        io.off(`wa.ai_response.${requestId}`, handler);
        resolve(null);
      }, 15000); // 15s timeout for AI response

      const handler = (data: any) => {
        clearTimeout(timeout);
        resolve(data);
      };

      io.once(`wa.ai_response.${requestId}`, handler);
      
      const settings = getSettings();
      const training = getTrainingData();
      const kb = getKnowledgeBase();

      io.emit('wa.ai_request', {
        requestId,
        text: incomingText,
        jid,
        settings: {
          tone: settings.aiReplyTone,
          systemPrompt: settings.aiSystemPrompt,
          useLearning: settings.autoLearningEnabled,
          mimicMe: settings.aiLikeMeEnabled,
          translate: settings.aiTranslation
        },
        training,
        kb: kb.slice(-8)
      });
    });
  };

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);
    const { version } = await fetchLatestBaileysVersion();
    const settings = getSettings();
    const msgRetryCounterCache = new NodeCache();

    sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: true,
      logger,
      msgRetryCounterCache,
      browser: ["WhatsApp Bot", "Chrome", "1.0.0"],
      generateHighQualityLinkPreview: true,
      syncFullHistory: false,
      retryRequestDelayMs: 250,
      defaultQueryTimeoutMs: 60000,
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 30000,
      patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(
          message.buttonsMessage ||
          message.templateMessage ||
          message.listMessage
        );
        if (requiresPatch) {
          return {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadataVersion: 2,
                  deviceListMetadata: {},
                },
                ...message,
              },
            },
          };
        }
        return message;
      },
      // Helps with "Bad MAC" and "Failed to decrypt" by allowing retries
      getMessage: async (key) => {
        if (messageStore) {
          const msg = messageStore.get(key.id!);
          return msg?.message || undefined;
        }
        return undefined;
      }
    });

    sock.ev.on('messages.update', async (updates: any) => {
      for (const update of updates) {
        if (update.update.messageStubType === WAMessageStubType.REVOKE || update.update.protocolMessage?.type === 0) {
          const key = update.key;
          const originalMsg = messageStore.get(key.id);
          
          if (originalMsg) {
            const jid = key.remoteJid;
            const text = originalMsg.message?.conversation || 
                         originalMsg.message?.extendedTextMessage?.text || 
                         originalMsg.message?.imageMessage?.caption ||
                         originalMsg.message?.videoMessage?.caption ||
                         "[Media/Non-text Message]";

            console.log(`[Anti-Delete] Message deleted by ${jid}: ${text}`);
            
            io.emit('wa.deleted_message', {
              jid,
              text,
              pushName: originalMsg.pushName,
              timestamp: Date.now() / 1000,
              originalTimestamp: originalMsg.messageTimestamp,
              key: key
            });
          }
        }
      }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update: any) => {
      const { connection, lastDisconnect, qr } = update;
      if (qr) {
        io.emit('wa.qr', qr);
        io.emit('wa.status', 'qr');
      }
      
      if (connection === 'close') {
        const error = (lastDisconnect?.error as any)?.output?.payload?.message || lastDisconnect?.error?.message || '';
        console.log('Connection closed:', error);
        
        if (error.includes('Bad MAC') || error.includes('Decryption failed')) {
          io.emit('wa.error', 'SESSION_CORRUPTED');
        }

        const isTimeout = error.includes('QR refs attempts ended') || error.includes('Timed out');
        const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut || isTimeout;
        
        console.log('Connection closed. Reason:', lastDisconnect?.error, ' | Reconnecting:', shouldReconnect);
        
        if (shouldReconnect) {
          if (isTimeout) {
            console.log('QR/Connection timed out. Forcing protocol reset...');
            // Optional: purge auth folder if needed, but usually just reconnecting is enough to generate new QR
          }
          connectToWhatsApp();
        } else {
          io.emit('wa.status', 'disconnected');
        }
      } else if (connection === 'open') {
        io.emit('wa.status', 'connected');
        console.log('WhatsApp connection opened');
        
        const settings = getSettings();
        if (settings.ghostMode) {
          sock.sendPresenceUpdate('unavailable');
        } else if (settings.alwaysOnline) {
          sock.sendPresenceUpdate('available');
        }
      }
    });

    sock.ev.on('messages.upsert', async (m: any) => {
      console.log(`[Message Upsert] Type: ${m.type}, Count: ${m.messages.length}`);
      if (m.type === 'notify') {
        const settings = getSettings();
        for (const msg of m.messages) {
          // Cache message for anti-delete
          if (msg.key?.id) {
            messageStore.set(msg.key.id, msg);
            // Limit store size
            if (messageStore.size > 2000) {
              const firstKey = messageStore.keys().next().value;
              messageStore.delete(firstKey);
            }
          }

          if (!msg.message) continue;
          
          const jid = msg.key.remoteJid;
          const isFromMe = msg.key.fromMe;
          const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

          io.emit('wa.message', {
            jid,
            text,
            isFromMe,
            pushName: msg.pushName,
            timestamp: msg.messageTimestamp,
            key: msg.key
          });

          // Always Online & Always Typing logic
          if (jid && !isFromMe) {
            if (settings.alwaysOnline) {
              await sock.sendPresenceUpdate('available', jid);
            }
            if (settings.alwaysTyping) {
              await sock.sendPresenceUpdate('composing', jid);
            }
          }

          // AI Auto-Learning: Capture user's own sent messages to learn style
          if (isFromMe && text && settings.autoLearningEnabled) {
            saveToKnowledgeBase({ text });
          }

          if (!isFromMe) {
            // Auto View Status
            if (jid === 'status@broadcast' && settings.autoViewStatus) {
              await sock.readMessages([msg.key]);
              
              // Optional: Auto React to Status
              if (settings.autoReaction) {
                try {
                  const participant = msg.key.participant || msg.participant || msg.key.remoteJid;
                  await sock.sendMessage(jid, {
                    react: { text: '❤️', key: msg.key }
                  }, { statusJidList: [participant!] });
                } catch (e) {}
              }
              continue;
            }

            // Auto Read Messages (Blue Ticks) - Strictly follow ghostMode setting
            if (settings.autoViewMessages && !settings.ghostMode) {
              await sock.readMessages([msg.key]);
            }
            
            // Auto Reaction (Regular Messages)
            if (settings.autoReaction && jid !== 'status@broadcast') {
              try {
                await sock.sendMessage(jid!, {
                  react: { text: '❤️', key: msg.key }
                });
              } catch (e) {}
            }
          }

          // Anti-ViewOnce (Automatic Recovery if enabled)
          const directViewOnce = msg.message?.viewOnceMessageV2 || 
                                 msg.message?.viewOnceMessage || 
                                 msg.message?.viewOnceMessageV2Extension ||
                                 (msg.message?.imageMessage?.viewOnce ? { message: { imageMessage: msg.message.imageMessage } } : null) ||
                                 (msg.message?.videoMessage?.viewOnce ? { message: { videoMessage: msg.message.videoMessage } } : null);

          if (directViewOnce && settings.autoRecoverViewOnce && !isFromMe) {
            try {
              const messageContent = directViewOnce.message || directViewOnce;
              const messageType = Object.keys(messageContent!)[0];
              const buffer = await downloadMediaMessage(
                { message: messageContent },
                'buffer',
                {},
                { logger, rekey: false }
              );

              const caption = `[AURA_GLITCH_AUTO_RECOVER] ${messageContent?.imageMessage?.caption || messageContent?.videoMessage?.caption || ''}`;
              if (messageType === 'imageMessage') {
                await sock.sendMessage(jid!, { image: buffer, caption }, { quoted: msg });
              } else if (messageType === 'videoMessage') {
                await sock.sendMessage(jid!, { video: buffer, caption }, { quoted: msg });
              }
            } catch (e) {
              console.error('Auto-recover failed:', e);
            }
          }

          if (text || msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption) {
            const messageBody = text || msg.message?.imageMessage?.caption || msg.message?.videoMessage?.caption || '';
            const lowerText = messageBody.toLowerCase().trim();

            // View-Once Downloader (.vv command)
            if (lowerText === '.vv' && settings.antiViewOnce) {
              const context = msg.message?.extendedTextMessage?.contextInfo;
              const quotedMsg = context?.quotedMessage;
              
              if (quotedMsg) {
                // Support multiple view-once variants
                const viewOnce = quotedMsg.viewOnceMessageV2 || 
                                 quotedMsg.viewOnceMessage || 
                                 quotedMsg.viewOnceMessageV2Extension ||
                                 (quotedMsg.imageMessage?.viewOnce ? { message: { imageMessage: quotedMsg.imageMessage } } : null) ||
                                 (quotedMsg.videoMessage?.viewOnce ? { message: { videoMessage: quotedMsg.videoMessage } } : null);

                if (viewOnce) {
                  try {
                    const messageContent = viewOnce.message || viewOnce;
                    const messageType = Object.keys(messageContent!)[0];
                    
                    const buffer = await downloadMediaMessage(
                      { message: messageContent },
                      'buffer',
                      {},
                      { logger, rekey: false }
                    );

                    const caption = `[AURA_GLITCH_RECOVERED] ${messageContent?.imageMessage?.caption || messageContent?.videoMessage?.caption || ''}`;

                    if (messageType === 'imageMessage') {
                      await sock.sendMessage(jid!, { image: buffer, caption }, { quoted: msg });
                    } else if (messageType === 'videoMessage') {
                      await sock.sendMessage(jid!, { video: buffer, caption }, { quoted: msg });
                    }
                  } catch (e) {
                    console.error('Error recovering view-once:', e);
                    await sock.sendMessage(jid!, { text: '❌ Failed to recover media. It might have expired or is unavailable.' }, { quoted: msg });
                  }
                } else {
                  await sock.sendMessage(jid!, { text: 'ℹ️ Please quote a View-Once media message with .vv' }, { quoted: msg });
                }
              }
            }

            if (jid?.endsWith('@g.us') && settings.tagAllEnabled) {
              const lowerText = text.toLowerCase().trim();
              if (lowerText === 'tagall' || lowerText === '!tagall') {
                try {
                  const groupMetadata = await sock.groupMetadata(jid);
                  const participants = groupMetadata.participants;
                  const responseText = "📢 *Aura Glitch: Attention Everyone!* 📢";
                  const mentions = participants.map(p => p.id);
                  await sock.sendMessage(jid, { text: responseText, mentions });
                } catch (e) {}
              }
            }

            if (!isFromMe && text.toLowerCase() === 'hi' && settings.autoReplyHi) {
              await sock.sendMessage(jid!, { text: 'Hello! I am Aura Glitch, your assistant. 🚀' });
            }

            if (!isFromMe && text && settings.aiReplyEnabled) {
              // Now replies to ALL chats including groups as requested
              const aiResult: any = await getSmartReplyRelay(text, jid || "Unknown");
              
              if (aiResult?.reply) {
                // Human-like thinking delay
                if (settings.aiThinkingDelay) {
                  const typingDelay = Math.min(Math.max(aiResult.reply.length * 50, 3000), 10000); // 50ms per char, min 3s, max 10s
                  await sock.sendPresenceUpdate('composing', jid);
                  await new Promise(resolve => setTimeout(resolve, typingDelay));
                  await sock.sendPresenceUpdate('paused', jid);
                }
                
                saveAiLog({ ...aiResult.log, jid: jid || "Unknown" });
                
                if (settings.autoLearningEnabled && aiResult.reply) {
                   saveToKnowledgeBase({ user: text, assistant: aiResult.reply });
                }

                await sock.sendMessage(jid!, { text: aiResult.reply });
              }
            }
          }
        }
      }
    });
  }

  setInterval(async () => {
    const settings = getSettings();
    if (sock?.user) {
      try {
        if (settings.ghostMode) {
          await sock.sendPresenceUpdate('unavailable');
        } else {
          if (settings.alwaysOnline) {
            await sock.sendPresenceUpdate('available');
          }
          if (settings.alwaysTyping) {
            await sock.sendPresenceUpdate('composing');
          }
        }
      } catch (e) {
        console.error('Failed to sync presence:', e);
      }
    }
  }, 1000 * 25); // Sync every 25 seconds for persistence

  const shutdown = async () => {
    console.log('Shutting down gracefully...');
    if (sock) {
      try {
        await sock.end();
      } catch (e) {}
    }
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  connectToWhatsApp().catch(err => console.error(err));

  io.on('connection', (socket) => {
    if (sock?.user) socket.emit('wa.status', 'connected');
    else socket.emit('wa.status', 'disconnected');
  });

  app.get('/api/wa/settings', (req, res) => res.json(getSettings()));
  app.post('/api/wa/settings', (req, res) => {
    saveSettings(req.body);
    res.json({ success: true });
  });

  app.get('/api/wa/training', (req, res) => {
    res.json(getTrainingData());
  });

  app.post('/api/wa/training', (req, res) => {
    saveTrainingData(req.body);
    res.json({ status: 'ok' });
  });

  app.get('/api/wa/logs', (req, res) => {
    res.json(getAiLogs());
  });

const START_TIME = Date.now();

  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'online', 
      uptime: Math.floor((Date.now() - START_TIME) / 1000),
      version: '1.4.2-glitch'
    });
  });

  app.get('/api/wa/schedules', (req, res) => {
    res.json(getSchedules());
  });

  app.post('/api/wa/schedules', (req, res) => {
    saveSchedules(req.body);
    res.json({ status: 'ok' });
  });

  // Background processor for schedules
  setInterval(async () => {
    const schedules = getSchedules();
    const now = Date.now();
    let changed = false;

    for (const schedule of schedules) {
      if (schedule.status === 'pending' && new Date(schedule.time).getTime() <= now && sock) {
        try {
          console.log(`[Scheduler] Deploying signal to ${schedule.target}`);
          await sock.sendMessage(schedule.target + '@s.whatsapp.net', { text: schedule.message });
          schedule.status = 'completed';
          changed = true;
        } catch (err) {
          console.error(`[Scheduler] Failed to deploy signal:`, err);
          schedule.status = 'failed';
          changed = true;
        }
      }
    }

    if (changed) {
      saveSchedules(schedules);
      io.emit('wa.schedules_update', schedules);
    }
  }, 30000); // Check every 30s

  app.post('/api/wa/send', async (req, res) => {
    const { jid, text } = req.body;
    if (!sock?.user) return res.status(400).json({ error: 'Not connected' });
    try {
      await sock.sendMessage(jid, { text });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/wa/logout', (req, res) => {
    try {
      console.log('Initiating forced protocol reset...');
      if (sock) {
        try {
          sock.logout();
          sock.end();
        } catch (e) {}
      }
      
      if (fs.existsSync(authFolder)) {
        // Try multiple times if locked
        let attempts = 0;
        const deleteFolder = () => {
          try {
            fs.rmSync(authFolder, { recursive: true, force: true });
            return true;
          } catch (e) {
            attempts++;
            if (attempts < 5) return false;
            throw e;
          }
        };
        
        while (!deleteFolder() && attempts < 5) {
          // busy wait or small delay
        }
      }
      
      res.json({ success: true });
      setTimeout(() => {
        console.log('System rebooting for clean session state...');
        process.exit(0);
      }, 1000);
    } catch (e: any) {
      console.error('Failed to purge session:', e);
      res.status(500).json({ error: 'Failed to purge session: ' + e.message });
    }
  });

  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: false },
    appType: "spa",
  });
  app.use(vite.middlewares);
 
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
