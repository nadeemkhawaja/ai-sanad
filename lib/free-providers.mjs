// Multi-provider free-tier rotation: tries each configured provider in order,
// falling through to the next on missing key / error / rate limit. Mirrors
// the pattern from the financial-advisor app's "Ask Lufi" — server-side keys
// (Vercel/`.env` env vars), OpenAI-compatible providers called directly,
// Gemini normalized separately since its request/response shape differs.
//
// Env vars (all optional — a provider is skipped if its key isn't set):
//   GROQ_API_KEY, OPENROUTER_API_KEY, GEMINI_API_KEY, MISTRAL_API_KEY, NVIDIA_API_KEY
// Optional per-provider model overrides:
//   GROQ_MODEL, OPENROUTER_MODEL, GEMINI_MODEL, MISTRAL_MODEL, NVIDIA_MODEL

const OPENAI_COMPAT = [
  {
    id: 'groq',
    envKey: 'GROQ_API_KEY',
    envModel: 'GROQ_MODEL',
    // llama-3.3-70b-versatile was retired from Groq's catalog; gpt-oss-120b
    // is their current large general-purpose free-tier model (verified live
    // against GET https://api.groq.com/openai/v1/models).
    defaultModel: 'openai/gpt-oss-120b',
    url: 'https://api.groq.com/openai/v1/chat/completions',
  },
  {
    id: 'openrouter',
    envKey: 'OPENROUTER_API_KEY',
    envModel: 'OPENROUTER_MODEL',
    defaultModel: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    extraHeaders: { 'HTTP-Referer': 'https://ai-sanad.vercel.app', 'X-Title': 'AI-Sanad' },
  },
  {
    id: 'nvidia',
    envKey: 'NVIDIA_API_KEY',
    envModel: 'NVIDIA_MODEL',
    // meta/llama-3.3-70b-instruct hit end-of-life on NVIDIA NIM; confirmed
    // current via live GET https://integrate.api.nvidia.com/v1/models.
    defaultModel: 'nvidia/nemotron-3-super-120b-a12b',
    url: 'https://integrate.api.nvidia.com/v1/chat/completions',
  },
  {
    id: 'mistral',
    envKey: 'MISTRAL_API_KEY',
    envModel: 'MISTRAL_MODEL',
    defaultModel: 'mistral-small-latest',
    url: 'https://api.mistral.ai/v1/chat/completions',
  },
];

const GEMINI = {
  id: 'gemini',
  envKey: 'GEMINI_API_KEY',
  envModel: 'GEMINI_MODEL',
  defaultModel: 'gemini-2.5-flash',
};

// Three rotation orders, not one — so "primary", "secondary", and "tertiary"
// roles each land on a different provider/model by default when all 5 keys
// are set (mirrors the local setup, where primary = your local Gemma and the
// others are different models entirely, for genuinely independent reasoning
// across layers). Each still falls through on missing key or error; PRIMARY
// favors the fastest free tiers first.
const ORDER_PRIMARY = ['groq', 'openrouter', 'nvidia', 'mistral', 'gemini'];
const ORDER_SECONDARY = ['gemini', 'mistral', 'nvidia', 'openrouter', 'groq'];
const ORDER_TERTIARY = ['nvidia', 'gemini', 'groq', 'mistral', 'openrouter'];

function messagesToGeminiContents(messages) {
  // Gemini has no "system" role in v1beta generateContent; fold it into the
  // first user turn instead of dropping it.
  const sys = messages.find(m => m.role === 'system')?.content;
  const rest = messages.filter(m => m.role !== 'system');
  return rest.map((m, i) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: i === 0 && sys ? `${sys}\n\n${m.content}` : m.content }],
  }));
}

async function callOpenAICompat(cfg, key, messages, maxTokens) {
  const model = process.env[cfg.envModel] || cfg.defaultModel;
  const r = await fetch(cfg.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      ...(cfg.extraHeaders || {}),
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages }),
  });
  if (!r.ok) return { ok: false, status: r.status, body: await r.text().catch(() => '') };
  const json = await r.json();
  const text = json.choices?.[0]?.message?.content || '';
  if (!text) return { ok: false, status: 502, body: 'Empty response' };
  return { ok: true, text, model, provider: cfg.id, usage: json.usage };
}

async function callGemini(key, messages, maxTokens) {
  const model = process.env[GEMINI.envModel] || GEMINI.defaultModel;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: messagesToGeminiContents(messages),
      generationConfig: { maxOutputTokens: maxTokens },
    }),
  });
  if (!r.ok) return { ok: false, status: r.status, body: await r.text().catch(() => '') };
  const json = await r.json();
  const text = json.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
  if (!text) return { ok: false, status: 502, body: 'Empty response' };
  return { ok: true, text, model, provider: 'gemini', usage: undefined };
}

const ROLE_ORDERS = { primary: ORDER_PRIMARY, secondary: ORDER_SECONDARY, tertiary: ORDER_TERTIARY };

/**
 * Try each configured free provider in order until one succeeds.
 * @param {string} role - 'primary', 'secondary', or 'tertiary'; each uses a
 *   different rotation order so the three roles land on different models
 *   when possible.
 * @returns {Promise<{ok:true,text:string,model:string,provider:string}|{ok:false,attempts:Array}>}
 */
export async function rotateFreeProviders(messages, maxTokens = 1200, role = 'primary') {
  const attempts = [];
  const order = ROLE_ORDERS[role] || ORDER_PRIMARY;

  for (const id of order) {
    if (id === 'gemini') {
      const key = process.env[GEMINI.envKey];
      if (!key) { attempts.push({ provider: 'gemini', skipped: 'no key' }); continue; }
      const result = await callGemini(key, messages, maxTokens).catch(e => ({ ok: false, status: 0, body: e.message }));
      if (result.ok) return result;
      attempts.push({ provider: 'gemini', status: result.status, body: result.body });
      continue;
    }
    const cfg = OPENAI_COMPAT.find(p => p.id === id);
    const key = process.env[cfg.envKey];
    if (!key) { attempts.push({ provider: cfg.id, skipped: 'no key' }); continue; }
    const result = await callOpenAICompat(cfg, key, messages, maxTokens).catch(e => ({ ok: false, status: 0, body: e.message }));
    if (result.ok) return result;
    attempts.push({ provider: cfg.id, status: result.status, body: result.body });
  }

  return { ok: false, attempts };
}

/**
 * "provider/model" for display, without doubling up when the model id
 * already carries its own vendor prefix (e.g. NVIDIA's catalog ids are
 * themselves "nvidia/nemotron-...", not just "nemotron-...").
 */
export function formatModelLabel(provider, model) {
  return model.startsWith(`${provider}/`) ? model : `${provider}/${model}`;
}
