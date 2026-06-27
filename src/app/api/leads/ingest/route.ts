import { NextResponse } from 'next/server';
import { processLead } from '@/services/lead-service';
import { z } from 'zod';

const leadSchema = z.object({
  agent_id: z.string().uuid(),
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  source: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = leadSchema.parse(body);

    const lead = await processLead({
      ...validatedData,
      source: validatedData.source || 'Manual',
      metadata: validatedData.metadata || {},
    } as any);

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (error) {
    console.error('Ingest error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
