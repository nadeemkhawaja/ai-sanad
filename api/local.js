// Vercel serverless function — mirrors server/app.js POST /api/local
// Proxies to a user-reachable Ollama/LM Studio instance. On Vercel this only
// works if that endpoint is publicly reachable (not literal localhost), since
// the function runs in Vercel's cloud, not on the user's machine.
function isPrivateHost(hostname) {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h === '::1') return true;
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const [a, b] = m.slice(1).map(Number);
  return a === 127 || a === 10 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { baseUrl, model, max_tokens, messages } = req.body || {};
  if (!messages) return res.status(400).json({ error: 'Missing messages' });

  let rawBaseUrl = baseUrl || process.env.LOCAL_LLM_BASE_URL || '';
  if (!rawBaseUrl) {
    return res.status(400).json({ error: 'Local model endpoint not set. On a Vercel deployment, "Local" only works with a publicly reachable endpoint (not localhost).' });
  }
  if (rawBaseUrl.includes('=')) rawBaseUrl = rawBaseUrl.replace(/^.*?=/, '').trim();

  let urlStr = rawBaseUrl;
  if (!urlStr.startsWith('http')) urlStr = 'http://' + urlStr;

  let url;
  try { url = new URL(urlStr); }
  catch { return res.status(400).json({ error: 'Invalid local endpoint URL' }); }

  if (isPrivateHost(url.hostname)) {
    return res.status(400).json({ error: 'This deployment runs in the cloud and cannot reach localhost/private addresses. Point "Local" at a publicly reachable endpoint, or run AI-Minaret locally for Ollama/LM Studio support.' });
  }

  const targetModel = model || process.env.LOCAL_LLM_MODEL || 'llama3.2';
  const fetchUrl = urlStr.replace(/\/$/, '').endsWith('/v1')
    ? `${urlStr.replace(/\/$/, '')}/chat/completions`
    : `${url.origin}/v1/chat/completions`;

  try {
    const upstream = await fetch(fetchUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: targetModel, max_tokens: max_tokens || 1200, messages }),
    });
    const text = await upstream.text();
    res.status(upstream.status).setHeader('Content-Type', 'application/json');
    return res.send(text);
  } catch (err) {
    return res.status(502).json({
      error: `Cannot reach local model at ${url.origin} (${err.message})`,
    });
  }
}
