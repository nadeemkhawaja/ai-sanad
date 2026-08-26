// Vercel serverless function — mirrors server/app.js GET /api/uploads
// Serves the seed Quran/Hadith .md library bundled into the deployment
// (read-only). User-uploaded files from /api/upload are NOT persisted here —
// see that file's comment for why Vercel functions can't share disk state.
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'data', 'uploads');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    if (!fs.existsSync(uploadDir)) return res.json({ text: '', files: [] });

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
}
