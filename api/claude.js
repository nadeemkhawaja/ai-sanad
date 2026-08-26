// Vercel serverless function — mirrors server/app.js POST /api/claude
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const parsed = req.body;
  if (!parsed || !parsed.messages) {
    return res.status(400).json({ error: 'Invalid JSON or missing messages' });
  }

  const userKey = req.headers['x-user-api-key'] || '';
  const API_KEY = userKey || process.env.ANTHROPIC_API_KEY || '';

  const overrideBaseUrl = process.env.LOCAL_LLM_BASE_URL;
  const overrideModel = process.env.LOCAL_LLM_MODEL;

  if (!API_KEY && !overrideBaseUrl) {
    return res.status(500).json({ error: 'No API key. Set ANTHROPIC_API_KEY in Vercel env vars or add your key in ⚙ Settings.' });
  }

  const model = overrideModel || parsed.model || 'claude-opus-4-8';
  const isOpenRouter = model.includes('/') && !model.startsWith('claude-');

  try {
    if (isOpenRouter) {
      const baseUrl = overrideBaseUrl ? overrideBaseUrl.replace(/\/$/, '') : 'https://openrouter.ai/api/v1';

      let messages = [...parsed.messages];
      if (parsed.system) {
        messages = [{ role: 'system', content: parsed.system }, ...messages];
      }

      const upstream = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY || 'local'}`,
          'HTTP-Referer': process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
          'X-Title': 'AI-Sanad'
        },
        body: JSON.stringify({
          model,
          max_tokens: parsed.max_tokens || 1200,
          messages
        })
      });
      const text = await upstream.text();
      res.status(upstream.status).setHeader('Content-Type', 'application/json');
      return res.send(text);
    }

    const baseUrl = overrideBaseUrl ? overrideBaseUrl.replace(/\/$/, '') : 'https://api.anthropic.com/v1';

    const upstream = await fetch(`${baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY || 'local',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: parsed.max_tokens || 1200,
        messages: parsed.messages,
        ...(parsed.system ? { system: parsed.system } : {}),
        ...(parsed.thinking ? { thinking: parsed.thinking } : {})
      })
    });
    const text = await upstream.text();
    res.status(upstream.status).setHeader('Content-Type', 'application/json');
    return res.send(text);

  } catch (err) {
    console.error('Proxy error:', err.message);
    return res.status(502).json({ error: 'Proxy error: ' + err.message });
  }
}
