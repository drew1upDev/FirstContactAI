export type Agent = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  voice_prompt?: string;
  market_area?: string;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  agent_id: string;
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  status: 'new' | 'qualified' | 'disqualified' | 'archived';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  lead_id: string;
  agent_id: string;
  channel: 'sms' | 'email' | 'voice';
  direction: 'inbound' | 'outbound';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
};

export type LeadScore = {
  id: string;
  lead_id: string;
  score: number;
  summary?: string;
  criteria?: Record<string, any>;
  is_appointment_ready: boolean;
  created_at: string;
};

export type MarketIntel = {
  id: string;
  agent_id: string;
  area: string;
  intel_type?: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type FollowUpJob = {
  id: string;
  lead_id: string;
  agent_id: string;
  scheduled_at: string;
  status: 'pending' | 'completed' | 'failed';
  job_type: 'sms' | 'email' | 'voice';
  payload?: Record<string, any>;
  created_at: string;
  updated_at: string;
};
