// Vercel serverless function — mirrors server/app.js /api/dynamic-topics
//
// KNOWN LIMITATION: Vercel functions are stateless and don't share a
// filesystem across invocations/regions, so writes to /tmp here are
// best-effort and may reset at any time (cold start, redeploy, different
// region). This is fine for the current feature (a soft per-session topic
// cache) but is NOT durable storage. If persistence matters, swap this for
// Vercel KV, Postgres, or another external store — do not rely on /tmp.
import fs from 'fs';
import path from 'path';

const TOPICS_DB_PATH = path.join('/tmp', 'topics.json');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      if (!fs.existsSync(TOPICS_DB_PATH)) return res.json({});
      return res.json(JSON.parse(fs.readFileSync(TOPICS_DB_PATH, 'utf8')));
    } catch (err) {
      console.error('Error reading topics DB:', err);
      return res.json({});
    }
  }

  if (req.method === 'POST') {
    try {
      const { subId, topic } = req.body || {};
      if (!subId || !topic) return res.status(400).json({ error: 'Missing subId or topic' });

      let db = {};
      if (fs.existsSync(TOPICS_DB_PATH)) {
        db = JSON.parse(fs.readFileSync(TOPICS_DB_PATH, 'utf8'));
      }
      if (!db[subId]) db[subId] = [];
      db[subId].push(topic);
      // Cap per-subcategory history — fetched in full on every page load,
      // appended to every ~3s of app usage, so uncapped it grows unbounded.
      const DYNAMIC_TOPICS_CAP = 20;
      if (db[subId].length > DYNAMIC_TOPICS_CAP) db[subId] = db[subId].slice(-DYNAMIC_TOPICS_CAP);
      fs.writeFileSync(TOPICS_DB_PATH, JSON.stringify(db, null, 2));

      return res.json({ success: true, db });
    } catch (err) {
      console.error('Error writing topics DB:', err);
      return res.status(500).json({ error: 'Failed to save topic' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
