// Netlify Edge Function — API proxy
// Supports: Anthropic (Claude), OpenRouter
// User can supply their own key via request body userKey field
// Falls back to ANTHROPIC_API_KEY env var for Anthropic requests

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body || !body.messages) {
    return new Response(JSON.stringify({ error: 'Missing messages' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // User-supplied key from request header (stored in browser localStorage, never in code)
  const userKey = req.headers.get('x-user-api-key') || '';

  // Use user key if provided, otherwise fall back to server env key
  const API_KEY = userKey || process.env.ANTHROPIC_API_KEY || '';
  
  const overrideBaseUrl = process.env.LOCAL_LLM_BASE_URL;
  const overrideModel = process.env.LOCAL_LLM_MODEL;

  if (!API_KEY && !overrideBaseUrl) {
    return new Response(
      JSON.stringify({
        error: 'No API key available. Set ANTHROPIC_API_KEY in Netlify env, or add your key in the ⚙ Settings panel.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const model = overrideModel || body.model || 'claude-opus-4-8';
  const isOpenRouter = model.includes('/') && !model.startsWith('claude-');

  // Route to OpenRouter or Local if model looks like an OpenRouter model
  if (isOpenRouter) {
    const baseUrl = overrideBaseUrl ? overrideBaseUrl.replace(/\/$/, '') : 'https://openrouter.ai/api/v1';
    
    let messages = [...body.messages];
    if (body.system) {
      messages = [{ role: 'system', content: body.system }, ...messages];
    }
    
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY || 'local'}`,
        'HTTP-Referer': req.headers.get('origin') || 'https://ai-minaret.netlify.app',
        'X-Title': 'AI-Minaret',
      },
      body: JSON.stringify({
        model,
        max_tokens: body.max_tokens || 1200,
        messages,
      }),
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Default: Anthropic API
  const baseUrl = overrideBaseUrl ? overrideBaseUrl.replace(/\/$/, '') : 'https://api.anthropic.com/v1';

  const upstream = await fetch(`${baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY || 'local',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: body.max_tokens || 1200,
      messages: body.messages,
      ...(body.system ? { system: body.system } : {}),
      ...(body.thinking ? { thinking: body.thinking } : {}),
    }),
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json' },
  });
};
