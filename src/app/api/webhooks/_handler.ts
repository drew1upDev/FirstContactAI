import { NextResponse } from 'next/server';
import { normalizePayload, processLead } from '@/services/lead-service';
import { z } from 'zod';

const webhookSchema = z.object({
  agent_id: z.string().uuid(),
});

export async function handleWebhook(req: Request, source: string) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');

    if (!agentId) {
      return NextResponse.json({ error: 'Missing agentId parameter' }, { status: 400 });
    }

    // Validate agentId format
    const validatedParams = webhookSchema.safeParse({ agent_id: agentId });
    if (!validatedParams.success) {
      return NextResponse.json({ error: 'Invalid agentId format' }, { status: 400 });
    }

    const payload = await req.json();
    const normalizedData = normalizePayload(source, payload);

    const lead = await processLead({
      ...normalizedData,
      agent_id: agentId,
    } as any);

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (error) {
    console.error(`Error in ${source} webhook:`, error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
