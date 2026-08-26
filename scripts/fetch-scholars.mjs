// Builds a bibliographic index of the 5 scholars in DESIGN.md's shortlist —
// title, source URL, school, and a SHORT attributed excerpt (~40-60 words)
// pulled from each scholar's own official site. This intentionally does NOT
// mirror full articles/books: their writing is copyrighted (unlike the CC0
// Quran/hadith corpus fetch-library.mjs builds), so the app cites and links
// to the original instead of hosting it. See data/scholars/README.md.
//
// Usage:  node scripts/fetch-scholars.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'data', 'scholars');
mkdirSync(OUT, { recursive: true });

const UA = 'Mozilla/5.0 (compatible; AI-Minaret bibliography builder; +https://github.com/nadeemkhawaja/ai-minaret)';
const EXCERPT_WORDS = 55;

async function getText(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`${r.status} for ${url}`);
  return r.text();
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function excerpt(text, words = EXCERPT_WORDS) {
  const w = text.split(' ').filter(Boolean);
  return w.length <= words ? text : w.slice(0, words).join(' ') + '…';
}

async function fetchExcerpt(url) {
  try {
    const html = await getText(url);
    const text = stripHtml(html);
    // Skip past nav/meta junk heuristically: find first sentence-like run of length > 80.
    const idx = text.search(/[A-Z][a-z]{2,}[^.]{80,}/);
    return excerpt(idx >= 0 ? text.slice(idx) : text);
  } catch (e) {
    console.log(`    (skip ${url}: ${e.message})`);
    return null;
  }
}

const results = {};

async function addEntry(id, scholar, school, title, url) {
  const ex = await fetchExcerpt(url);
  if (!results[id]) results[id] = [];
  results[id].push({ scholar, school, title, url, excerpt: ex });
  console.log(`  ✓ ${title}`);
}

// ── Abdal Hakim Murad (UK, Cambridge, traditionalist) ──────────────
console.log("Fetching Abdal Hakim Murad's official article index (masud.co.uk)…");
{
  const indexUrl = 'https://masud.co.uk/ISLAM/ahm/';
  const html = await getText(indexUrl);
  const links = [...html.matchAll(/<a href="([a-zA-Z0-9_.\-]+\.htm)">([^<]+)<\/a>/g)]
    .map(m => ({ url: new URL(m[1], indexUrl).href, title: m[2].trim() }))
    .filter(l => l.title && !/^contentions\s?\d*$/i.test(l.title))
    .slice(0, 20);
  for (const l of links) {
    await addEntry('abdal-hakim-murad', 'Abdal Hakim Murad (Timothy Winter)', 'Traditionalist Sunni (Ash\'ari-Maturidi) — Cambridge Muslim College', l.title, l.url);
  }
}

// ── Mufti Taqi Usmani (Pakistan, Deobandi/Hanafi) ───────────────────
console.log('Fetching Mufti Taqi Usmani fatawa index (muftitaqiusmani.com)…');
{
  const indexUrl = 'https://muftitaqiusmani.com/en/tag/fatawa/';
  const html = await getText(indexUrl);
  const links = [...new Set([...html.matchAll(/href="(https:\/\/muftitaqiusmani\.com\/en\/[a-z0-9-]+\/)"/g)].map(m => m[1]))]
    .filter(u => !/\/(tag|category|Books|feed|wp-json)\//.test(u) && !u.endsWith('/en/'))
    .slice(0, 20);
  for (const url of links) {
    const html2 = await getText(url);
    const titleMatch = html2.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch ? titleMatch[1].split('|')[0].split('-')[0].trim() : url;
    await addEntry('taqi-usmani', 'Mufti Muhammad Taqi Usmani', 'Deobandi/Hanafi — Darul Uloom Karachi', title, url);
  }
}

// ── Maulana Wahiduddin Khan (India, independent/peace-oriented) ────
console.log("Fetching Maulana Wahiduddin Khan pages (cpsglobal.org)…");
{
  const pages = [
    ['Founder — Maulana Wahiduddin Khan', 'https://www.cpsglobal.org/content/founder'],
    ['Works of Maulana Wahiduddin Khan', 'https://www.cpsglobal.org/content/works'],
    ['Al-Risala Monthly', 'https://www.cpsglobal.org/content/al-risala-monthly'],
    ['CPS International', 'https://www.cpsglobal.org/content/cps-international'],
  ];
  for (const [title, url] of pages) {
    await addEntry('wahiduddin-khan', 'Maulana Wahiduddin Khan', 'Independent / peace-oriented — Centre for Peace and Spirituality', title, url);
  }
}

// ── Yasir Qadhi (USA, Salafi-leaning academic) ──────────────────────
console.log('Fetching Yasir Qadhi blog posts (yasirqadhi.com)…');
{
  const indexUrl = 'https://www.yasirqadhi.com/blog';
  const html = await getText(indexUrl);
  const slugs = [...new Set([...html.matchAll(/href="(\/blog\/[a-z0-9-]+)"/g)].map(m => m[1]))];
  if (!slugs.length) {
    console.log('  (no blog posts found — yasirqadhi.com/blog appears to have little published text)');
  }
  for (const slug of slugs) {
    const url = new URL(slug, indexUrl).href;
    const html2 = await getText(url);
    const titleMatch = html2.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch ? titleMatch[1].split('|')[0].trim() : slug;
    await addEntry('yasir-qadhi', 'Yasir Qadhi', 'Salafi-leaning academic — Islamic Seminary of America', title, url);
  }
}

// ── Dr. Israr Ahmed (Pakistan) ──────────────────────────────────────
// His own organization's site (tanzeem.org) publishes Bayan-ul-Quran as
// audio/video, not English text — so there's no free official-site text to
// excerpt. Recorded as a bibliographic pointer only, no excerpt fabricated.
results['israr-ahmed'] = [{
  scholar: 'Dr. Israr Ahmed',
  school: 'Independent, Quran-focused — Tanzeem-e-Islami',
  title: 'Bayan-ul-Quran (Quran commentary, audio/video lecture series)',
  url: 'https://www.tanzeem.org/bayan-ul-quran-by-dr-israr-ahmad/',
  excerpt: null,
  note: 'Official site (tanzeem.org) publishes this as audio/video lectures, not English text — no excerpt available without transcription.',
}];

// ── Write output ─────────────────────────────────────────────────
let total = 0;
for (const [id, entries] of Object.entries(results)) {
  writeFileSync(path.join(OUT, `${id}.json`), JSON.stringify(entries, null, 2));
  total += entries.length;
}
console.log(`\nDone. ${total} entries across ${Object.keys(results).length} scholars → data/scholars/*.json`);
