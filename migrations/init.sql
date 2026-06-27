-- Supabase Schema Initialization for FirstContact AI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Agents Table: Stores real estate agent profiles
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    bio TEXT,
    voice_prompt TEXT, -- Instructions for AI to mimic agent's voice
    market_area TEXT, -- Description of the agent's local market
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads Table: Inbound leads from various sources
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    source TEXT, -- e.g., 'Zillow', 'Facebook', 'Web'
    status TEXT DEFAULT 'new', -- 'new', 'qualified', 'disqualified', 'archived'
    metadata JSONB, -- Additional data from the lead source
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations Table: Interaction history
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    channel TEXT NOT NULL, -- 'sms', 'email', 'voice'
    direction TEXT NOT NULL, -- 'inbound', 'outbound'
    content TEXT NOT NULL,
    metadata JSONB, -- e.g., Twilio message SID, email headers
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead Scores Table: Qualification and scoring
CREATE TABLE IF NOT EXISTS lead_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    summary TEXT, -- AI-generated summary of qualification
    criteria JSONB, -- Breakdown of score based on specific factors
    is_appointment_ready BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market Intel Table: Specific local expertise data
CREATE TABLE IF NOT EXISTS market_intel (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    area TEXT NOT NULL, -- Neighborhood or city name
    intel_type TEXT, -- e.g., 'price_trends', 'schools', 'amenities'
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Follow Up Jobs Table: Scheduled follow-up tasks
CREATE TABLE IF NOT EXISTS follow_up_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    job_type TEXT NOT NULL, -- 'sms', 'email', 'voice'
    payload JSONB, -- Data needed for the job
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_market_intel_updated_at BEFORE UPDATE ON market_intel FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_follow_up_jobs_updated_at BEFORE UPDATE ON follow_up_jobs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
