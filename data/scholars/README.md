# Scholar bibliography

Bibliographic index for the 5-scholar shortlist (built by `scripts/fetch-scholars.mjs`):

- `abdal-hakim-murad.json` — Abdal Hakim Murad (Timothy Winter), UK, traditionalist Sunni
- `taqi-usmani.json` — Mufti Muhammad Taqi Usmani, Pakistan, Deobandi/Hanafi
- `wahiduddin-khan.json` — Maulana Wahiduddin Khan, India, independent/peace-oriented
- `yasir-qadhi.json` — Yasir Qadhi, USA, Salafi-leaning academic
- `israr-ahmed.json` — Dr. Israr Ahmed, Pakistan, independent/Quran-focused

Each entry is `{ scholar, school, title, url, excerpt }` — a short (~55-word),
attributed excerpt pulled from the scholar's own official site, plus a link to
the original. This is a citation index, not a mirror: their writing is
copyrighted, unlike the CC0 Quran/hadith corpus in `data/library/` and
`data/hadith/`. The app should always attribute claims by scholar name and
school (never blend into unattributed "scholarly consensus") and link to the
source for full text — never reproduce full articles/books here.

Regenerate with: `node scripts/fetch-scholars.mjs`
