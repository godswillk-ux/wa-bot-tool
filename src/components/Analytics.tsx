import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Zap,
  Brain,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const data = [
  { name: '00:00', messages: 45, ai: 12 },
  { name: '04:00', messages: 12, ai: 4 },
  { name: '08:00', messages: 89, ai: 34 },
  { name: '12:00', messages: 156, ai: 98 },
  { name: '16:00', messages: 120, ai: 76 },
  { name: '20:00', messages: 210, ai: 145 },
  { name: '23:59', messages: 134, ai: 89 },
];

const contactData = [
  { name: 'Subject_42', messages: 412, color: '#10b981' },
  { name: 'Subject_09', messages: 284, color: '#3b82f6' },
  { name: 'Node_Alpha', messages: 195, color: '#f59e0b' },
  { name: 'Nexus_Root', messages: 142, color: '#ef4444' },
];

export default function Analytics() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase font-display">Neural_Analytics</h2>
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-brand-primary" />
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] font-mono">Real-time throughput metrics</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Signal Throughput', value: '14,293', change: '+12.5%', up: true, icon: Activity },
          { label: 'AI Cognition Rate', value: '94.2%', change: '+4.3%', up: true, icon: Brain },
          { label: 'Active Neural Nodes', value: '842', change: '-2.1%', up: false, icon: Users },
          { label: 'Response Latency', value: '1.2s', change: '-14%', up: true, icon: Zap },
        ].map((stat, i) => (
          <div key={i} className="glass-morphism rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
              <stat.icon size={40} />
            </div>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest font-mono mb-4">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h4 className="text-3xl font-black text-white font-display italic leading-none">{stat.value}</h4>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black font-mono ${
                stat.up ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'
              }`}>
                {stat.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-morphism rounded-[3rem] p-10 border border-white/5 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-brand-primary">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white italic tracking-tight uppercase font-display">Traffic_Density</h3>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest font-mono">24h Signal Distribution</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-brand-primary" />
                <span className="text-[9px] text-zinc-400 font-bold uppercase font-mono">Input</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[9px] text-zinc-400 font-bold uppercase font-mono">AI_Reply</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f1f" />
                <XAxis 
                  dataKey="name" 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  fontFamily="JetBrains Mono"
                />
                <YAxis 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  fontFamily="JetBrains Mono"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#09090b', 
                    border: '1px solid #27272a', 
                    borderRadius: '16px',
                    fontSize: '10px',
                    fontFamily: 'JetBrains Mono',
                    color: '#fff'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="messages" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorMessages)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="ai" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAI)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-morphism rounded-[3rem] p-10 border border-white/5 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-brand-primary">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white italic tracking-tight uppercase font-display">Target_Engagement</h3>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest font-mono">High Affinity Nodes</p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contactData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#52525b" 
                  fontSize={8} 
                  tickLine={false} 
                  axisLine={false}
                  fontFamily="JetBrains Mono"
                />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ 
                    backgroundColor: '#09090b', 
                    border: '1px solid #27272a', 
                    borderRadius: '12px',
                    fontSize: '9px',
                    fontFamily: 'JetBrains Mono'
                  }}
                />
                <Bar dataKey="messages" radius={[10, 10, 10, 10]} barSize={40}>
                  {contactData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {contactData.map((contact, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/40 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: contact.color }} />
                  <span className="text-[10px] text-zinc-300 font-bold uppercase font-mono tracking-wider">{contact.name}</span>
                </div>
                <span className="text-[11px] font-black text-white italic font-display">{contact.messages} SIGS</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
