export type View = 'dashboard' | 'device' | 'contacts' | 'automations' | 'campaigns' | 'simulator' | 'anti-delete' | 'analytics' | 'scheduler';

export interface Contact {
  id: string;
  name: string;
  number: string;
  status: 'online' | 'offline';
  lastSeen: string;
  avatar: string;
  tags: string[];
}

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  response: string;
  status: 'active' | 'inactive';
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'sending' | 'completed';
  sent: number;
  total: number;
  createdAt: string;
}
