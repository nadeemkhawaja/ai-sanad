import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import dotenv from 'dotenv';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });

function isPrivateHost(hostname) {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h === '::1') return true;
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const [a, b] = m.slice(1).map(Number);
  return a === 127 || a === 10 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31);
}

const app = express();
// No CORS middleware: the UI is served same-origin (Vite proxies /api in dev),
// so cross-origin pages on the LAN can't spend the server's API key.
app.use(express.json());

// ── API Routes ─────────────────────────────────────────────
app.post('/api/claude', async (req, res) => {
  const parsed = req.body;
  if (!parsed || !parsed.messages) {
    return res.status(400).json({ error: 'Invalid JSON or missing messages' });
  }

  // Accept user-supplied key from header (stored in browser, never in source code)
  const userKey = req.headers['x-user-api-key'] || '';
  const API_KEY = userKey || process.env.ANTHROPIC_API_KEY || '';
  
  const overrideBaseUrl = process.env.LOCAL_LLM_BASE_URL;
  const overrideModel = process.env.LOCAL_LLM_MODEL;

  if (!API_KEY && !overrideBaseUrl) {
    return res.status(500).json({ error: 'No API key. Set ANTHROPIC_API_KEY in .env or add your key in ⚙ Settings.' });
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
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'AI-Minaret'
        },
        body: JSON.stringify({
          model,
          max_tokens: parsed.max_tokens || 1200,
          messages
        })
      });
      const text = await upstream.text();
      return res.status(upstream.status).type('application/json').send(text);
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
    return res.status(upstream.status).type('application/json').send(text);

  } catch (err) {
    console.error('Proxy error:', err.message);
    return res.status(502).json({ error: 'Proxy error: ' + err.message });
  }
});

// ── Local model proxy (Ollama / LM Studio) ─────────────────
// OpenAI-compatible chat endpoint on this machine. Proxied server-side
// so the browser needs no CORS setup. Restricted to localhost targets.
app.post('/api/local', async (req, res) => {
  const { baseUrl, model, max_tokens, messages } = req.body || {};
  if (!messages) return res.status(400).json({ error: 'Missing messages' });

  let rawBaseUrl = baseUrl || process.env.LOCAL_LLM_BASE_URL || 'http://localhost:11434';
  if (rawBaseUrl.includes('=')) rawBaseUrl = rawBaseUrl.replace(/^.*?=/, '').trim();
  
  let urlStr = rawBaseUrl;
  if (!urlStr.startsWith('http')) urlStr = 'http://' + urlStr;

  let url;
  try { url = new URL(urlStr); }
  catch { return res.status(400).json({ error: 'Invalid local endpoint URL' }); }

  if (!isPrivateHost(url.hostname)) {
    return res.status(400).json({ error: 'Local model endpoint must be a localhost or private-network address.' });
  }

  const targetModel = model || process.env.LOCAL_LLM_MODEL || 'llama3.2';
  // If baseUrl already includes /v1, just append /chat/completions
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
    res.status(upstream.status).type('application/json').send(text);
  } catch (err) {
    res.status(502).json({
      error: `Cannot reach local model at ${url.origin} (${err.message})`,
    });
  }
});

// ── Local Quran/Hadith library search ──────────────────────
// Reads data/library/*.json (built by scripts/fetch-library.mjs) into
// memory once, then serves keyword matches to ground the AI's citations.
let LIBRARY = null;
function loadLibrary() {
  if (LIBRARY) return LIBRARY;
  LIBRARY = [];
  const dir = path.join(rootDir, 'data', 'library');
  if (!fs.existsSync(dir)) return LIBRARY;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    try {
      const items = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      for (const it of items) {
        if (it && it.ref && it.text) LIBRARY.push({ ...it, lc: it.text.toLowerCase() });
      }
    } catch (err) {
      console.error(`Library: skipping ${f} — ${err.message}`);
    }
  }
  console.log(`  📚  Library loaded: ${LIBRARY.length} verses/hadith`);
  return LIBRARY;
}

const STOP_WORDS = new Set(['the','a','an','of','in','on','and','or','is','are','was','were','to','for','vs','with','do','does','did','be','not','it','at','by','from','that','this','should','would','can','could','who','what','when','how','why','all','any','his','her','their','has','have','had','which','into','about','than','then','them','they','there','its','only','also','but','if','as','he','she','we','you','your']);

app.get('/api/library/search', (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  const limit = Math.min(Number(req.query.limit) || 6, 20);
  const terms = [...new Set(q.split(/[^a-z']+/).filter(w => w.length > 2 && !STOP_WORDS.has(w)))];
  if (!terms.length) return res.json({ results: [] });

  const lib = loadLibrary();
  const minScore = Math.min(2, terms.length);
  const scored = [];
  for (const item of lib) {
    let score = 0;
    for (const t of terms) if (item.lc.includes(t)) score++;
    if (score >= minScore) scored.push({ score, item });
  }
  scored.sort((a, b) => b.score - a.score || a.item.text.length - b.item.text.length);
  res.json({
    count: lib.length,
    results: scored.slice(0, limit).map(({ item }) => ({
      ref: item.ref,
      grade: item.grade || undefined,
      text: item.text.length > 400 ? item.text.slice(0, 400) + '…' : item.text,
    })),
  });
});

// ── Document Upload Endpoint ───────────────────────────────
const uploadDir = path.join(rootDir, 'data', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_'))
  }
})

const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

const UPLOAD_MAX_AGE_MS = 24 * 60 * 60 * 1000;
function cleanupOldUploads() {
  const now = Date.now();
  for (const f of fs.readdirSync(uploadDir)) {
    const fp = path.join(uploadDir, f);
    try {
      if (now - fs.statSync(fp).mtimeMs > UPLOAD_MAX_AGE_MS) fs.unlinkSync(fp);
    } catch {}
  }
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  cleanupOldUploads();
  const file = req.file;
  try {
    let text = '';
    const fileBuffer = fs.readFileSync(file.path);
    if (file.originalname.endsWith('.pdf')) {
      const data = await pdfParse(fileBuffer);
      text = data.text;
    } else if (file.originalname.endsWith('.md') || file.originalname.endsWith('.txt')) {
      text = fileBuffer.toString('utf8');
    } else if (file.originalname.endsWith('.doc') || file.originalname.endsWith('.docx')) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: '.doc/.docx are not supported. Please convert to .pdf, .md, or .txt.' });
    } else {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: 'Unsupported file type. Only .pdf, .md, and .txt are allowed.' });
    }
    return res.json({ text });
  } catch (err) {
    console.error('File parsing error:', err);
    return res.status(500).json({ error: 'Failed to parse file: ' + err.message });
  }
});

app.get('/api/uploads', async (req, res) => {
  try {
    const uploadDir = path.join(rootDir, 'data', 'uploads');
    if (!fs.existsSync(uploadDir)) return res.json({ text: '' });
    
    let allText = '';
    const fileNames = [];
    const files = fs.readdirSync(uploadDir);
    for (const file of files) {
      if (file.endsWith('.md') || file.endsWith('.txt')) {
        fileNames.push(file);
        const content = fs.readFileSync(path.join(uploadDir, file), 'utf8');
        allText += `\n\n--- Source: ${file} ---\n\n${content}`;
      }
    }
    return res.json({ text: allText, files: fileNames });
  } catch (err) {
    console.error('Error reading uploads folder:', err);
    return res.status(500).json({ error: 'Failed to read uploads' });
  }
});

const TOPICS_DB_PATH = path.join(rootDir, 'data', 'topics.json');

app.get('/api/dynamic-topics', (req, res) => {
  try {
    if (!fs.existsSync(TOPICS_DB_PATH)) return res.json({});
    const data = fs.readFileSync(TOPICS_DB_PATH, 'utf8');
    return res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading topics DB:', err);
    return res.json({});
  }
});

app.post('/api/dynamic-topics', express.json(), (req, res) => {
  try {
    const { subId, topic } = req.body;
    if (!subId || !topic) return res.status(400).json({ error: 'Missing subId or topic' });
    
    let db = {};
    if (fs.existsSync(TOPICS_DB_PATH)) {
      db = JSON.parse(fs.readFileSync(TOPICS_DB_PATH, 'utf8'));
    }
    
    if (!db[subId]) db[subId] = [];
    db[subId].push(topic);
    
    if (!fs.existsSync(path.join(rootDir, 'data'))) {
      fs.mkdirSync(path.join(rootDir, 'data'), { recursive: true });
    }
    fs.writeFileSync(TOPICS_DB_PATH, JSON.stringify(db, null, 2));
    
    return res.json({ success: true, db });
  } catch (err) {
    console.error('Error writing topics DB:', err);
    return res.status(500).json({ error: 'Failed to save topic' });
  }
});

app.use(express.static(path.join(rootDir, 'dist')));

export default app;
