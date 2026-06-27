import { NextResponse } from 'next/server';
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { Receiver } from "@upstash/qstash";
import { aiService } from '@/services/ai-service';

async function handler(req: Request) {
  try {
    const { leadId } = await req.json();

    if (!leadId) {
      return NextResponse.json({ error: "Missing leadId" }, { status: 400 });
    }

    console.log(`[Outreach Job] Processing lead ${leadId}...`);

    // 1. Generate AI response mirrored to agent voice
    const response = await aiService.generateResponse(leadId, 'sms');
    
    // 2. TODO: Send via Twilio/Resend
    console.log(`[Outreach Job] AI Response: ${response}`);

    // 3. TODO: Log conversation in database

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Outreach Job] Error:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Wrap the handler with Upstash signature verification
export const POST = process.env.QSTASH_CURRENT_SIGNING_KEY 
  ? verifySignatureAppRouter(handler)
  : handler;
