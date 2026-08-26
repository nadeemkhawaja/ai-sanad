// Vercel serverless function — mirrors server/app.js GET /api/library/search
import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'data', 'library');
const STOP_WORDS = new Set(['the','a','an','of','in','on','and','or','is','are','was','were','to','for','vs','with','do','does','did','be','not','it','at','by','from','that','this','should','would','can','could','who','what','when','how','why','all','any','his','her','their','has','have','had','which','into','about','than','then','them','they','there','its','only','also','but','if','as','he','she','we','you','your']);

let LIBRARY = null;
function loadLibrary() {
  if (LIBRARY) return LIBRARY;
  LIBRARY = [];
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
  return LIBRARY;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

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
}
