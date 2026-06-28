import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { supabaseServer } from '@/lib/supabase';
import { aiService } from '@/services/ai-service';

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      const twiml = new VoiceResponse();
      twiml.say('Sorry, we could not identify this call. Goodbye.');
      return new NextResponse(twiml.toString(), {
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    const formData = await req.formData();
    const speechResult = formData.get('SpeechResult') as string;
    const callSid = formData.get('CallSid') as string;

    console.log(`[Voice Webhook] Lead ${leadId}, SpeechResult: ${speechResult}`);

    // Fetch lead and agent details
    const { data: lead, error: leadError } = await supabaseServer
      .from('leads')
      .select('*, agents(*)')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      console.error('[Voice Webhook] Lead not found:', leadError);
      const twiml = new VoiceResponse();
      twiml.say('Sorry, an error occurred. Goodbye.');
      return new NextResponse(twiml.toString(), {
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    const twiml = new VoiceResponse();

    if (!speechResult) {
      // First time calling or no speech detected
      const initialGreeting = await aiService.generateResponse(leadId, 'voice');
      twiml.say({ voice: 'Polly.Joanna', language: 'en-US' }, initialGreeting);
      twiml.gather({
        input: ['speech'],
        action: `/api/webhooks/voice?leadId=${leadId}`,
        timeout: 3,
      });
    } else {
      // Lead said something, log it and get AI response
      await supabaseServer.from('conversations').insert({
        lead_id: leadId,
        channel: 'voice',
        direction: 'inbound',
        content: speechResult,
        metadata: { call_sid: callSid },
      });

      const aiResponse = await aiService.generateResponse(leadId, 'voice');

      await supabaseServer.from('conversations').insert({
        lead_id: leadId,
        channel: 'voice',
        direction: 'outbound',
        content: aiResponse,
        metadata: { call_sid: callSid },
      });

      twiml.say({ voice: 'Polly.Joanna', language: 'en-US' }, aiResponse);
      
      // Check if we should continue gathering or hang up
      // For now, always gather more unless the AI says goodbye (heuristic)
      if (aiResponse.toLowerCase().includes('goodbye') || aiResponse.toLowerCase().includes('talk soon')) {
        twiml.hangup();
        // Trigger qualification after call ends
        await aiService.qualifyLead(leadId);
      } else {
        twiml.gather({
          input: ['speech'],
          action: `/api/webhooks/voice?leadId=${leadId}`,
          timeout: 3,
        });
      }
    }

    return new NextResponse(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    console.error('[Voice Webhook] Error:', error);
    const twiml = new VoiceResponse();
    twiml.say('Sorry, a system error occurred. Goodbye.');
    return new NextResponse(twiml.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    });
  }
}
