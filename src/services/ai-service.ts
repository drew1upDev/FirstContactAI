import { anthropic } from '@/lib/anthropic';
import { supabaseServer } from '@/lib/supabase';
import { Agent } from '@/types';

export const aiService = {
  /**
   * Qualify a lead based on initial information and conversation history
   */
  async qualifyLead(leadId: string) {
    // 1. Fetch lead and agent details
    const { data: lead, error: leadError } = await supabaseServer
      .from('leads')
      .select('*, agents(*)')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) throw new Error('Lead not found');

    // 2. Fetch conversation history
    const { data: conversations, error: convError } = await supabaseServer
      .from('conversations')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: true });

    if (convError) throw new Error('Error fetching conversations');

    // 3. Construct prompt for Claude
    const prompt = `
      System: You are an expert real estate assistant qualification engine. 
      Your goal is to analyze the lead and the conversation history to determine the lead's quality.

      Lead Info:
      ${JSON.stringify(lead, null, 2)}

      Conversation History:
      ${JSON.stringify(conversations, null, 2)}

      Task:
      Analyze the lead's intent, budget (if mentioned), timeline, and overall engagement.
      Produce a qualification score (0-100) and a brief summary.
      Determine if the lead is "appointment ready" (meaning they've expressed a clear interest in meeting or seeing a property).

      Output JSON only with keys:
      - score: number (0-100)
      - summary: string
      - is_appointment_ready: boolean
      - criteria: { intent: string, budget: string, timeline: string }
    `;

    // 4. Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1000,
      system: "You are an expert real estate assistant qualification engine. You must output valid JSON only.",
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    const result = JSON.parse(content);

    // 5. Persist the score
    await supabaseServer.from('lead_scores').upsert({
      lead_id: leadId,
      score: result.score,
      summary: result.summary,
      is_appointment_ready: result.is_appointment_ready,
      criteria: result.criteria,
    });

    // 6. Update lead status if qualified
    if (result.score > 70) {
      await supabaseServer.from('leads').update({ status: 'qualified' }).eq('id', leadId);
    }

    return result;
  },

  /**
   * Generate a response for a lead mirrored to the agent's voice
   */
  async generateResponse(leadId: string, channel: 'sms' | 'email' | 'voice') {
    // 1. Fetch context
    const { data: lead, error: leadError } = await supabaseServer
      .from('leads')
      .select('*, agents(*)')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) throw new Error('Lead not found');

    const agent = lead.agents as unknown as Agent;

    // 2. Fetch conversation history (last 10)
    const { data: conversations } = await supabaseServer
      .from('conversations')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(10);

    // 3. Fetch local market intel
    const { data: marketIntel } = await supabaseServer
      .from('market_intel')
      .select('*')
      .eq('agent_id', agent.id)
      .limit(3);

    // 4. Construct prompt
    const history = conversations?.reverse() || [];
    const intel = marketIntel?.map(i => i.content).join('\n') || '';

    const systemPrompt = `
      You are ${agent.name}'s highly professional AI real estate assistant. 
      Your goal is to communicate with leads via ${channel} in a way that sounds exactly like ${agent.name}.

      Agent Persona:
      ${agent.voice_prompt || 'Professional, friendly, and helpful.'}

      Market Expertise Area: ${agent.market_area || 'Local market'}
      Market Intel:
      ${intel}

      Rules:
      - Be concise for SMS and Voice.
      - Be warm and professional.
      - Mirror the agent's voice.
      - For Voice: Keep sentences short and natural for speech. Avoid complex punctuation.
      - If this is the first contact, introduce yourself as ${agent.name}'s assistant.
      - Aim to qualify the lead's interest and schedule an appointment.
    `;

    const userPrompt = `
      Lead Info: ${JSON.stringify({ name: lead.name, source: lead.source, metadata: lead.metadata })}
      Conversation History: ${JSON.stringify(history)}
      
      Task: Generate the next ${channel} response.
    `;

    // 5. Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: channel === 'email' ? 1000 : 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    return content.trim();
  }
};
