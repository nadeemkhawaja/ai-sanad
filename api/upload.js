// Vercel serverless function — mirrors server/app.js POST /api/upload
// Uses in-memory storage (not disk): Vercel's filesystem is read-only outside
// /tmp and functions don't share state between invocations, so parsed text
// is returned directly to the client rather than persisted server-side.
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export const config = { api: { bodyParser: false } };

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await runMiddleware(req, res, upload.single('file'));
  } catch (err) {
    return res.status(400).json({ error: 'Upload failed: ' + err.message });
  }

  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const { originalname, buffer } = req.file;

  try {
    let text = '';
    if (originalname.endsWith('.pdf')) {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (originalname.endsWith('.md') || originalname.endsWith('.txt')) {
      text = buffer.toString('utf8');
    } else if (originalname.endsWith('.doc') || originalname.endsWith('.docx')) {
      return res.status(400).json({ error: '.doc/.docx are not supported. Please convert to .pdf, .md, or .txt.' });
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Only .pdf, .md, and .txt are allowed.' });
    }
    return res.json({ text });
  } catch (err) {
    console.error('File parsing error:', err);
    return res.status(500).json({ error: 'Failed to parse file: ' + err.message });
  }
}
