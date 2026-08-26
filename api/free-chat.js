// Vercel serverless function — multi-provider free-tier rotation.
// Server-side keys (Vercel env vars): GROQ_API_KEY, OPENROUTER_API_KEY,
// GEMINI_API_KEY, MISTRAL_API_KEY, NVIDIA_API_KEY. See lib/free-providers.mjs.
import { rotateFreeProviders } from '../lib/free-providers.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, max_tokens, system, role } = req.body || {};
  if (!messages) return res.status(400).json({ error: 'Missing messages' });

  const fullMessages = system ? [{ role: 'system', content: system }, ...messages] : messages;
  const result = await rotateFreeProviders(fullMessages, max_tokens || 1200, role);

  if (!result.ok) {
    console.error('All free providers failed:', JSON.stringify(result.attempts));
    return res.status(502).json({
      error: 'All free providers failed or have no key configured. Set at least one of GROQ_API_KEY, OPENROUTER_API_KEY, GEMINI_API_KEY, MISTRAL_API_KEY, NVIDIA_API_KEY in Vercel env vars.',
      attempts: result.attempts,
    });
  }

  return res.json({
    choices: [{ message: { content: result.text } }],
    model: `${result.provider}/${result.model}`,
    usage: result.usage,
  });
}
