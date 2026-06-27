import { NextResponse } from 'next/server';
import { anthropic } from '@/lib/anthropic';

export async function POST(req: Request) {
  try {
    const { samples, targetVoice } = await req.json();

    if (!samples || samples.length < 10) {
      return NextResponse.json({ error: 'Insufficient samples' }, { status: 400 });
    }

    const systemPrompt = `
      You are a persona calibration engine for a real estate AI assistant.
      Your goal is to analyze the provided communication samples from a real estate agent and extract their unique voice, tone, and communication patterns.
      
      The agent wants to achieve a "${targetVoice}" identity while maintaining their natural style.
      
      Output a concise set of instructions (a "voice prompt") that will be used to guide another AI model to mimic this agent's voice perfectly.
      Focus on:
      - Sentence structure (short/punchy vs long/detailed)
      - Greeting and sign-off style
      - Level of formality
      - Use of emojis or specific industry jargon
      - How they handle common real estate questions
    `;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyze these samples and create the voice prompt:\n\n${samples}`
        }
      ],
    });

    const voicePrompt = response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({ voicePrompt });
  } catch (error) {
    console.error('Persona calibration error:', error);
    return NextResponse.json({ error: 'Calibration failed' }, { status: 500 });
  }
}
