import { supabaseServer as supabase } from '@/lib/supabase-server';
import { Client } from '@upstash/qstash';

const qstash = new Client({ token: process.env.QSTASH_TOKEN || '' });

export interface NormalizedLead {
  agent_id: string;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  metadata: Record<string, any>;
}

export function normalizePayload(source: string, payload: any): Omit<NormalizedLead, 'agent_id'> {
  switch (source.toLowerCase()) {
    case 'zillow':
      return {
        name: payload.LeadDetails?.LeadName || 'Unknown',
        email: payload.LeadDetails?.LeadEmail,
        phone: payload.LeadDetails?.LeadPhone,
        source: 'Zillow',
        metadata: payload,
      };
    case 'facebook':
      const fieldData = payload.field_data || [];
      const name = fieldData.find((f: any) => f.name === 'full_name' || f.name === 'name')?.values[0];
      const email = fieldData.find((f: any) => f.name === 'email')?.values[0];
      const phone = fieldData.find((f: any) => f.name === 'phone_number' || f.name === 'phone')?.values[0];
      return {
        name: name || 'Unknown',
        email,
        phone,
        source: 'Facebook',
        metadata: payload,
      };
    case 'website':
      return {
        name: payload.name || 'Unknown',
        email: payload.email,
        phone: payload.phone,
        source: 'Website',
        metadata: payload,
      };
    case 'manual':
      return {
        name: payload.name || 'Unknown',
        email: payload.email,
        phone: payload.phone,
        source: 'Manual',
        metadata: payload,
      };
    default:
      return {
        name: payload.name || payload.LeadName || 'Unknown',
        email: payload.email || payload.LeadEmail,
        phone: payload.phone || payload.LeadPhone,
        source: source,
        metadata: payload,
      };
  }
}

export async function processLead(normalizedLead: NormalizedLead) {
  // 1. Insert into Supabase
  const { data, error } = await supabase
    .from('leads')
    .insert([normalizedLead])
    .select()
    .single();

  if (error) {
    console.error('Error inserting lead:', error);
    throw error;
  }

  // 2. Trigger Realtime Event for Dashboard
  try {
    await supabase.channel('dashboard-alerts').send({
      type: 'broadcast',
      event: 'new-lead',
      payload: { 
        leadId: data.id, 
        name: data.name, 
        source: data.source,
        timestamp: new Date().toISOString()
      },
    });
  } catch (err) {
    console.error('Error triggering realtime event:', err);
  }

  // 3. Queue outreach job via QStash
  // Target: within 30 seconds
  try {
    if (process.env.QSTASH_TOKEN) {
      await qstash.publishJSON({
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://' + process.env.VERCEL_URL}/api/jobs/outreach`,
        body: { leadId: data.id },
        delay: 30, 
      });
    } else {
      console.warn('QSTASH_TOKEN not found, skipping outreach queue');
    }
  } catch (err) {
    console.error('Error queuing job with QStash:', err);
    // We don't throw here to avoid failing the webhook response, 
    // but in production we might want a retry mechanism.
  }

  return data;
}
