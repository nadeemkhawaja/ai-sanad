# AI-Sanad — Islamic Reasoning Strategist

> **Hosted by AI Scholar** — a 5-layer AI reasoning pipeline for structured Islamic discourse.

AI-Sanad takes a question from classical or contemporary Islamic discourse, and reasons
through it in five layers: it maps the landscape, builds the strongest case, steel-mans the
opposing view, audits its own weaknesses, and delivers a verdict — citing Quran (Surah:Ayah)
and Hadith (collection, number, grading) along the way.

> ⚠️ **Disclaimer:** AI-Sanad is a reasoning exercise for study and reflection. It is not a
> mufti and its output is not a fatwa. AI models can misquote sources — verify every citation
> with qualified scholars.

---

## How to Run

```bash
./start.sh          # builds the frontend and starts on http://localhost:3210
./stop.sh           # stops the server
PORT=4000 ./start.sh   # use a different port
```

Put your Anthropic API key in a `.env` file at the project root:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Get one at [console.anthropic.com](https://console.anthropic.com) → API Keys. The key stays
on the server — the browser talks to a local `/api/claude` proxy, never to Anthropic directly.
Alternatively, enter a key in the ⚙ Settings panel in the app (sent per-request via header,
stored only in your browser).

**Development mode** (hot reload):

```bash
npm run dev         # Express (random port) + Vite dev server with /api proxy
```

---

## Models

| Role | Default | Used for |
|---|---|---|
| Primary | `claude-opus-4-8` | Layers 2, 3, 5 — arguments, counter-arguments, verdict |
| Secondary | `claude-haiku-4-5` | Layers 1, 4 — independent context mapping and critique |

Override either model in ⚙ Settings. Providers supported: **Anthropic** (via local proxy),
**OpenRouter** (100+ models, key required), and **Free** (OpenRouter free-tier models).

---

## Features

- 🧠 **5-Layer SCIPAB Pipeline** — L0 Fallacy → L1 Context → L2 Args → L3 Counter → L4 Critique → L5 Verdict
- 🕌 **Islamic topic catalog** — Quran (sciences, theology, ethics), Hadith (methodology, jurisprudence), Islam QA (fatwa methodology, contemporary issues), each mapped to classical sources
- 📖 **Citation discipline** — every layer is instructed to cite Surah:Ayah and Hadith collection/number/grading, and to say so when uncertain rather than invent references
- 📊 **AI Telemetry** — tokens, latency, efficiency ratio at every layer
- ⚔️ **AI vs AI Arena** — AI Scholar debates an opponent persona; an impartial judge rules
- 🎤 **Live Debate** — argue against AI Scholar in real time
- 📂 **Reference upload** — attach your own text documents as context

---

## Project Structure

```
AIISLAM/
├── index.html            ← App shell (Vite entry)
├── src/main.js           ← All app logic: topics, pipeline, prompts, telemetry
├── src/style.css
├── server/
│   ├── index.js          ← Server entry (port 3210 default, LAN IP detection)
│   └── app.js            ← Express app: /api/claude proxy + static dist/
├── scripts/dev.js        ← Dev launcher (Express + Vite)
├── netlify/functions/    ← Optional Netlify deployment proxy
├── start.sh / stop.sh    ← Build + run on a fixed port / stop
├── PROMPTS.md            ← Prompt design document (SCIPAB mapping)
└── tests/                ← Vitest + Supertest API tests (npm test)
```

---

MIT License · Built by Nadeem Khawaja
