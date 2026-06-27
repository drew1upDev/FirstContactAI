import Anthropic from '@anthropic-ai/sdk';

const anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';

if (!anthropicApiKey) {
  console.warn('Anthropic API key is missing. Make sure to set ANTHROPIC_API_KEY in your .env.local file.');
}

export const anthropic = new Anthropic({
  apiKey: anthropicApiKey,
});
