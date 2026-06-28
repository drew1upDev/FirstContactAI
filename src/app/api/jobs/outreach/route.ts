import { NextResponse } from 'next/server';
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { aiService } from '@/services/ai-service';
import { sendSMS, makeCall } from '@/lib/twilio';
import { sendEmail } from '@/lib/resend';
import { supabaseServer } from '@/lib/supabase';
import { Lead, Agent } from '@/types';

async function handler(req: Request) {
  try {
    const body = await req.json();
    const { leadId, jobType = 'initial' } = body;

    if (!leadId) {
      return NextResponse.json({ error: "Missing leadId" }, { status: 400 });
    }

    console.log(`[Outreach Job] Processing lead ${leadId}, type: ${jobType}...`);

    // 1. Fetch lead and agent details
    const { data: lead, error: leadError } = await supabaseServer
      .from('leads')
      .select('*, agents(*)')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      console.error(`[Outreach Job] Lead ${leadId} not found`);
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const agent = lead.agents as unknown as Agent;

    // 2. Decide channel
    let channel: 'sms' | 'email' | 'voice' = 'sms';
    if (jobType === 'escalation') {
      channel = 'voice';
    } else if (!lead.phone && lead.email) {
      channel = 'email';
    } else if (!lead.phone && !lead.email) {
      console.warn(`[Outreach Job] No contact info for lead ${leadId}`);
      return NextResponse.json({ success: false, reason: "No contact info" });
    }

    // 3. Generate AI response
    const response = await aiService.generateResponse(leadId, channel);
    
    // 4. Send via chosen channel
    let messageId = '';
    if (channel === 'sms' && lead.phone) {
      const res = await sendSMS(lead.phone, response);
      messageId = res.sid;
    } else if (channel === 'email' && lead.email) {
      const res = await sendEmail(lead.email, `Message from ${agent.name}`, response);
      messageId = res.data?.id || '';
    } else if (channel === 'voice' && lead.phone) {
      const res = await makeCall(lead.phone, leadId);
      messageId = res.sid;
      return NextResponse.json({ success: true, channel: 'voice', sid: messageId });
    }

    // 5. Log outbound conversation (except for voice which logs via webhook)
    if (channel !== 'voice') {
      await supabaseServer.from('conversations').insert({
        lead_id: leadId,
        agent_id: agent.id,
        channel,
        direction: 'outbound',
        content: response,
        metadata: { provider_id: messageId }
      });
    }

    // 6. Trigger qualification
    await aiService.qualifyLead(leadId);

    return NextResponse.json({ success: true, channel, messageId });
  } catch (error) {
    console.error('[Outreach Job] Error:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const POST = process.env.QSTASH_CURRENT_SIGNING_KEY 
  ? verifySignatureAppRouter(handler)
  : handler;
