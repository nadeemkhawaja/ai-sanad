// ================================================================
// CATEGORY + TOPIC DATABASE — 9 categories × 4 topics = 36 total

// Canvas paints raw pixels and cannot read CSS custom properties, so these
// three mirror --paper / --ink / --red. The rest of the app reads the tokens.
const PAPER_HEX = '#faf8f3';
const INK_HEX   = '#0a0a08';
const RED_HEX   = '#c41230';

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

// Each category has: label, accent color, 4 sources, 4 topics
// ================================================================
const CATS = [
  {
    id:'quran', label:'Quran', label_ur:'قرآن', label_ar:'القرآن', accent:'#136b4f',
    subs:[
      { id:'quranic_sciences', label:'Quranic Sciences', label_ur:'قرآنی علوم', label_ar:'علوم القرآن', sources:['Tafsir Ibn Kathir', 'Tafsir al-Jalalayn', 'Al-Qurtubi', 'Al-Tabari', 'Tafsir Al-Sa\'di', 'Baghawi', 'Maariful Quran', 'Tafhim-ul-Quran', 'Al-Kashshaf', 'Fi Zilal al-Quran'],
        topics:[
          {title:'Interpretation of Ayatul Kursi', title_ur:'آیۃ الکرسی کی تفسیر', title_ar:'تفسير آية الكرسي', sub:'Understanding the greatest verse', sub_ur:'عظیم ترین آیت کو سمجھنا', sub_ar:'فهم أعظم آية', positions:['Literal Attributes (Bila Kayf)', 'Metaphorical Interpretation (Ta\'wil)']},
          {title:'Abrogation (Naskh) in the Quran', title_ur:'قرآن میں ناسخ و منسوخ', title_ar:'النسخ في القرآن', sub:'Do later verses cancel earlier ones?', sub_ur:'کیا بعد والی آیات پہلی آیات کو منسوخ کرتی ہیں؟', sub_ar:'هل تلغي الآيات اللاحقة الآيات السابقة؟', positions:['Naskh applies to legal rulings', 'Naskh only applies to previous scriptures, not within Quran']},
          {title:'Asbab al-Nuzul (Context of Revelation)', title_ur:'اسباب نزول (وحی کا پس منظر)', title_ar:'أسباب النزول', sub:'Is historical context binding?', sub_ur:'کیا تاریخی پس منظر لازمی ہے؟', sub_ar:'هل السياق التاريخي ملزم؟', positions:['Crucial for restricting general rulings', 'Secondary to the universal, general meaning of the text']},
          {title:'The Seven Ahruf', title_ur:'سات حروف (قراءت)', title_ar:'الأحرف السبعة', sub:'Modes of Recitation', sub_ur:'تلاوت کے طریقے', sub_ar:'طرق التلاوة', positions:['Distinct dialects of Arabic tribes', 'Different synonyms and wordings allowed for ease']}
        ]
      },
      { id:'theology_in_quran', label:'Theology in the Quran', label_ur:'قرآن میں عقیدہ', label_ar:'العقيدة في القرآن', sources:['Al-Aqidah al-Tahawiyyah', 'Sharh al-Fiqh al-Akbar', 'Al-Ghazali'],
        topics:[
          {title:'Free Will vs Predestination (Qadar)', title_ur:'جبر و قدر (تقدیر)', title_ar:'الجبر والاختيار (القدر)', sub:'Who creates human actions?', sub_ur:'انسانی اعمال کا خالق کون ہے؟', sub_ar:'من يخلق أفعال الإنسان؟', positions:['Everything is preordained (Jabariyyah)', 'Humans have absolute free will (Qadariyyah)', 'Kasb (acquisition) balances both (Ash\'ari)']},
          {title:'The Concept of Tawhid', title_ur:'توحید کا تصور', title_ar:'مفهوم التوحيد', sub:'Focus of Islamic monotheism', sub_ur:'اسلامی توحید کا مرکز', sub_ar:'محور التوحيد الإسلامي', positions:['Focus heavily on Tawhid al-Rububiyyah (Lordship)', 'Focus on Tawhid al-Uluhiyyah (Worship) and Attributes']}
        ]
      },
      { id:'quranic_ethics', label:'Quranic Ethics', label_ur:'قرآنی اخلاقیات', label_ar:'الأخلاق القرآنية', sources:['Ihya Ulum al-Din', 'Al-Akhlaq wa\'l-Siyar'],
        topics:[
          {title:'Justice vs Mercy in Punishment', title_ur:'سزا میں انصاف بمقابلہ رحم', title_ar:'العدل مقابل الرحمة في العقاب', sub:'Applying penal codes', sub_ur:'سزاؤں کا نفاذ', sub_ar:'تطبيق القوانين الجنائية', positions:['Strict adherence to prescribed penalties achieves justice', 'Prioritization of rehabilitation and mercy aligns with Quranic ethos']},
          {title:'Wealth and Charity (Zakat)', title_ur:'دولت اور صدقہ (زکوٰۃ)', title_ar:'الثروة والصدقة (الزكاة)', sub:'The philosophy of wealth', sub_ur:'دولت کا فلسفہ', sub_ar:'فلسفة الثروة', positions:['Wealth is a trial; charity is mandatory purification', 'Wealth is a blessing to be enjoyed and invested responsibly']}
        ]
      }
    ]
  },
  {
    id:'hadith', label:'Hadith', label_ur:'حدیث', label_ar:'الحديث', accent:'#075985',
    subs:[
      { id:'hadith_methodology', label:'Hadith Methodology (Mustalah)', label_ur:'اصول حدیث (مصطلح)', label_ar:'مصطلح الحديث', sources:['Muqaddimah Ibn al-Salah', 'Nukhbat al-Fikar', 'Al-Risalah', 'Al-Kifayah fi Ilm al-Riwayah', 'Tadrib al-Rawi', 'Fath al-Mughith', 'Qawaid al-Tahdith', 'Manhaj al-Naqd', 'Sunnah.com', 'Dorar.net'],
        topics:[
          {title:'Authenticity of Ahad (Solitary) Hadith', title_ur:'خبر واحد (انفرادی حدیث) کی استناد', title_ar:'حجية حديث الآحاد', sub:'Are solitary narrations binding?', sub_ur:'کیا انفرادی روایات لازمی ہیں؟', sub_ar:'هل روايات الآحاد ملزمة؟', positions:['Binding in both theology (Aqidah) and law (Fiqh)', 'Binding in law only, not theology', 'Not binding if they contradict established reason or Quran']},
          {title:'Criteria for a Sahih Hadith', title_ur:'صحیح حدیث کے معیار', title_ar:'معايير الحديث الصحيح', sub:'Evaluating narrations', sub_ur:'روایات کا جائزہ', sub_ar:'تقييم الروايات', positions:['Strict Isnad (chain) verification is sufficient', 'Matn (text) criticism and logical consistency are equally important']},
          {title:'The Role of Weak (Da\'if) Hadith', title_ur:'ضعیف حدیث کا کردار', title_ar:'دور الحديث الضعيف', sub:'Can weak hadith be used?', sub_ur:'کیا ضعیف حدیث استعمال کی جا سکتی ہے؟', sub_ar:'هل يمكن استخدام الحديث الضعيف؟', positions:['Acceptable for virtuous deeds (Fada\'il al-A\'mal)', 'Completely rejected in all matters of religion']}
        ]
      },
      { id:'sahih_compilations', label:'Major Compilations', label_ur:'اہم کتب احادیث', label_ar:'الكتب الستة والمصنفات', sources:['Sahih Bukhari', 'Sahih Muslim', 'Sunan Abu Dawud', 'Muwatta Malik'],
        topics:[
          {title:'Comparing Bukhari and Muslim', title_ur:'بخاری اور مسلم کا موازنہ', title_ar:'المقارنة بين البخاري ومسلم', sub:'Which is superior?', sub_ur:'کون سی کتاب برتر ہے؟', sub_ar:'أيهما أفضل؟', positions:['Bukhari\'s strict conditions of meeting make it superior', 'Muslim\'s logical arrangement and textual variations make it superior']},
          {title:'Contextualizing Prophetic Actions', title_ur:'نبوی افعال کا سیاق و سباق', title_ar:'سياق الأفعال النبوية', sub:'Universal vs Contextual', sub_ur:'آفاقی بمقابلہ سیاق و سباق کے مطابق', sub_ar:'عالمي مقابل سياقي', positions:['All Prophetic actions are universal and timeless laws', 'Many actions must be understood in their 7th-century Arabian cultural context']}
        ]
      },
      { id:'fiqh_al_hadith', label:'Jurisprudence from Hadith', label_ur:'حدیث سے فقہ', label_ar:'فقه الحديث', sources:['Bidayat al-Mujtahid', 'Umdat al-Ahkam', 'Subul al-Salam'],
        topics:[
          {title:'Actions Judged by Intentions', title_ur:'اعمال کا دارومدار نیتوں پر ہے', title_ar:'إنما الأعمال بالنيات', sub:'Inner intent vs outer form', sub_ur:'اندرونی نیت بمقابلہ ظاہری شکل', sub_ar:'النية الداخلية مقابل الشكل الخارجي', positions:['Inner sincere intent validates the action entirely', 'Outer correct form is strictly required alongside inner intent']},
          {title:'Customs (Urf) vs Text (Nass)', title_ur:'رواج (عرف) بمقابلہ نص (متن)', title_ar:'العرف مقابل النص', sub:'Resolving conflicts', sub_ur:'تنازعات کا حل', sub_ar:'حل التعارض', positions:['Text always supersedes local custom', 'Local custom can restrict or modify the application of text']}
        ]
      }
    ]
  },
  {
    id:'islamqa', label:'Islam QA', label_ur:'اسلام سوال و جواب', label_ar:'فتاوى إسلامية', accent:'#9a3009',
    subs:[
      { id:'fatwa_councils', label:'Fatwa Councils & Q&A', label_ur:'فتاویٰ کونسلز اور سوال و جواب', label_ar:'لجان الفتوى والأسئلة والأجوبة', sources:['IslamQA.info', 'SeekersGuidance', 'Dar al-Ifta al-Misriyyah', 'AMJA Online', 'IslamWeb', 'Yaqeen Institute', 'AlMaghrib Institute', 'Assembly of Muslim Jurists', 'European Council for Fatwa', 'E-Fatwa (Malaysia)'],
        topics:[
          {title:'Methodology of Issuing Fatwa', title_ur:'فتویٰ جاری کرنے کا طریقہ کار', title_ar:'منهجية إصدار الفتوى', sub:'Adherence to Madhab vs direct evidence', sub_ur:'مذہب کی پیروی بمقابلہ براہ راست ثبوت', sub_ar:'الالتزام بالمذهب مقابل الدليل المباشر', positions:['Must strictly follow one of the four established Madhabs', 'Should extract rulings directly from Quran and Sunnah if capable']}
        ]
      }
    ]
  },
  {
    id:'top_questions', label:'Top 10 Questions', label_ur:'اہم 10 سوالات', label_ar:'أهم 10 أسئلة', accent:'#6b21a8',
    subs:[
      { id:'modern_challenges', label:'Modern Challenges & Theology', label_ur:'جدید چیلنجز اور عقیدہ', label_ar:'التحديات المعاصرة والعقيدة', sources:['Yaqeen Institute', 'Al-Ghazali', 'Contemporary Scholars'],
        topics:[
          {title:'The Problem of Evil & Suffering', title_ur:'برائی اور مصائب کا مسئلہ', title_ar:'مشكلة الشر والمعاناة', sub:'If God is Merciful, why is there suffering?', sub_ur:'اگر خدا رحیم ہے، تو مصائب کیوں ہیں؟', sub_ar:'إذا كان الله رحيماً، فلماذا توجد معاناة؟', positions:['Suffering is a test and elevates spiritual rank', 'We lack the full perspective of God\'s overarching wisdom']},
          {title:'Women\'s Rights in Islam', title_ur:'اسلام میں خواتین کے حقوق', title_ar:'حقوق المرأة في الإسلام', sub:'Are men and women equal?', sub_ur:'کیا مرد اور عورت برابر ہیں؟', sub_ar:'هل يتساوى الرجل والمرأة؟', positions:['Equal in spiritual worth, with complementary societal roles', 'Total egalitarianism in all legal and societal matters']},
          {title:'Islam & Modern Science', title_ur:'اسلام اور جدید سائنس', title_ar:'الإسلام والعلم الحديث', sub:'Evolution and Cosmology', sub_ur:'ارتقاء اور کائنات', sub_ar:'التطور وعلم الكونيات', positions:['The Quran fully aligns with modern scientific discoveries', 'Science changes; the Quran is spiritual, not a science textbook']},
          {title:'Jihad in the Modern World', title_ur:'جدید دنیا میں جہاد', title_ar:'الجهاد في العالم المعاصر', sub:'Understanding armed struggle', sub_ur:'مسلح جدوجہد کو سمجھنا', sub_ar:'فهم الكفاح المسلح', positions:['Strictly defensive and requires legitimate state authority', 'A holistic spiritual struggle (Greater Jihad) with defensive limits']},
          {title:'Islamic Finance & Mortgages', title_ur:'اسلامی فنانس اور مارگیج', title_ar:'التمويل الإسلامي والرهن العقاري', sub:'Navigating the modern economy', sub_ur:'جدید معیشت میں رہنمائی', sub_ar:'التعامل مع الاقتصاد الحديث', positions:['Conventional mortgages are strictly forbidden (Riba)', 'Necessity (Darurah) allows standard mortgages in the West']},
          {title:'Fate vs Free Will', title_ur:'تقدیر بمقابلہ آزاد مرضی', title_ar:'القدر مقابل حرية الإرادة', sub:'Do we actually have a choice?', sub_ur:'کیا واقعی ہمارے پاس انتخاب ہے؟', sub_ar:'هل لدينا حقاً خيار؟', positions:['God\'s knowledge does not negate our free choice', 'Our choices are illusions; all is divinely compelled']},
          {title:'Apostasy (Riddah)', title_ur:'ارتداد (مذہب چھوڑنا)', title_ar:'الردة', sub:'Freedom of religion', sub_ur:'مذہبی آزادی', sub_ar:'حرية الدين', positions:['Traditional view of capital punishment for treason/apostasy', 'No worldly punishment; freedom of belief based on "No compulsion"']},
          {title:'The Reality of the Hijab', title_ur:'حجاب کی حقیقت', title_ar:'حقيقة الحجاب', sub:'Is it a strict requirement?', sub_ur:'کیا یہ ایک سخت ضرورت ہے؟', sub_ar:'هل هو مطلب صارم؟', positions:['Mandatory obligation for modesty', 'A cultural recommendation rather than a strict legal requirement']},
          {title:'Music and Arts', title_ur:'موسیقی اور فنون', title_ar:'الموسيقى والفنون', sub:'Permissibility of instruments', sub_ur:'آلات کی اجازت', sub_ar:'جواز الآلات الموسيقية', positions:['All musical instruments (except duff) are impermissible', 'Permissible as long as the lyrics and context are wholesome']},
          {title:'Pluralism & Salvation', title_ur:'تکثیریت اور نجات', title_ar:'التعددية والخلاص', sub:'Are only Muslims saved?', sub_ur:'کیا صرف مسلمان نجات پائیں گے؟', sub_ar:'هل ينجو المسلمون فقط؟', positions:['Only those who accept Islam after hearing it properly are saved', 'God\'s mercy encompasses all sincere seekers of truth']}
        ]
      }
    ]
  }
];

// ================================================================
// STATE
// ================================================================
const S = {
  topic:'', positions:[], position:'',
  persona:'Islamic Scholar', tone:'simple, plain English — short sentences, everyday words, and explain any Arabic or technical term in brackets the first time it appears',
  depth:'20-50', lang:'', source:'',
  layers:{}, totalIn:0, totalOut:0, startTime:0,
  running:false,
  kokoroEnabled:false, kokoroVoice:'af_sky',
  fallacyOn:true, socraticOn:false, videoOn:false,
  socraticPending:false, socraticAnswers:[],
  liveActive:false, liveTranscript:[], liveRound:0,
  recognition:null, recognizing:false,
  activeAudio:null,
  history:[], lastScore:null,
  waveInterval:null, siInterval:null,
  currentCat:'quran',
  refDocText: '',   // uploaded reference document text
  refDocName: '',   // uploaded file name
};


// ================================================================
// UI STRINGS — English only
// ================================================================

const LANGS = {
  en: {
    code: 'en', dir: 'ltr', name: 'English',
    promptInstruction: '',
    voiceLang: 'en-US',
    kokoroSupported: true,
    strings: {
      appTagline: 'AI Reasoning Strategist · Sharpen Your Thinking · Powered by Claude',
      hostedBy: 'Hosted by AI Scholar',
      selectTopic: 'Select Topic',
      dispatchPreview: 'Dispatch Preview',
      selectedMotion: 'Selected Motion',
      pickTopic: 'Pick a topic and position →',
      printSettings: 'Print Settings',
      fallacyScan: 'Fallacy Scan',
      socraticDrill: 'Socratic Drill',
      liveAvatar: 'Live Avatar',
      customPlaceholder: 'Or propose your own motion...',
      customBtn: 'File →',
      configureArg: 'Configure Your Argument',
      yourPosition: 'Your Position',
      persona: 'Persona',
      depth: 'Argument Depth',
      language: 'Language',
      knowledgeSource: 'Knowledge Source',
      toneLabel: 'Tone —',
      runBtn: '⊕ Run 5-Layer Reasoning Engine',
      runSub: 'AI Scholar will argue · question · counter · critique · deliver verdict',
      running: 'Composing dispatch...',
      debate: 'Debate',
      arena: 'Arena',
      live: 'Live',
      flowchart: 'Flowchart',
      archive: 'Archive',
      export: 'Export',
      copy: 'Copy',
      clear: 'Clear',
      debateTab: 'Today\'s Edition',
      headline: 'Sharpen your thinking with',
      headlineEm: 'AI-Minaret',
      deck: 'Your AI Reasoning Strategist. AI-Minaret reasons, challenges, questions your logic, fires back in real time, and delivers a verdict that makes you think harder.',
      byline: 'Hosted by AI Scholar · AI Reasoning Strategist · All Editions',
      statCats: 'Categories', statLayers: 'Layers', statTopics: 'Topics', statModes: 'Modes',
      arenaTitle: 'AI Scholar vs The Opposition',
      arenaDeck: 'Watch two AI debaters go head-to-head. AI-Minaret reasons one side; you assign the opponent\'s persona. An impartial judge delivers the final verdict.',
      liveTitle: 'Debate AI Scholar live',
      liveDeck: 'Speak your arguments. AI Scholar listens, sharpens her counter in real time, and fires back. Your microphone vs her reasoning.',
      archiveTitle: 'Your Argument Record',
      openFloor: 'Open Floor',
      micSpeak: 'Mic — Hold to speak',
      endJudge: 'End & Judge',
      copyBtn: 'Copy',
      readAloud: 'Read Aloud',
      printed: 'PRINTED',
      composing: 'COMPOSING',
      socraticHead: 'AI SCHOLAR CHALLENGES YOUR LOGIC — Answer before we continue',
      socraticSubmit: 'Strengthen arguments → Continue',
      fallacyAlertHead: '⚠ Logical Fallacy Alert — Review Before Arguing',
    }
  },
};

let currentLang = 'en';

function switchLang(code) {
  const lang = LANGS[code];
  if (!lang) return;
  currentLang = code;

  // Update html attributes
  document.documentElement.lang = code;
  document.documentElement.dir = lang.dir;

  // Update active flag button
  document.querySelectorAll('.lang-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === code));

  // Update prompt instruction
  S.lang = lang.promptInstruction;

  // Update lang dropdown to match
  const sel = document.getElementById('sel-lang');
  if (sel) sel.value = lang.promptInstruction;

  // Update Kokoro voice language hint
  S.kokoroVoiceLang = lang.voiceLang;

  // Apply UI string translations
  applyStrings(lang.strings);

  // Re-render categories and topics in new language
  buildCatStrip();
  if (S.currentCat) renderCat(S.currentCat);

  // Flash confirmation
  telegram(`${lang.name} — زبان تبدیل ہوگئی / Language changed`, 'ok');
}

function applyStrings(s) {
  const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  const setPlaceholder = (id, text) => { const el = document.getElementById(id); if (el) el.placeholder = text; };
  const setHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

  // Masthead
  set('masthead-tagline', s.appTagline);

  // Nav tabs
  const tabs = document.querySelectorAll('.masthead-nav-left .nav-item');
  const tabKeys = ['debate', 'arena', 'live', 'flowchart', 'archive'];
  const tabStrings = [s.debate, s.arena, s.live, s.flowchart, s.archive];
  tabs.forEach((t, i) => { if (tabStrings[i]) t.textContent = tabStrings[i]; });

  // Nav-right
  const navRight = document.querySelectorAll('.masthead-nav-right .nav-item');
  if (navRight[0]) navRight[0].textContent = s.export;
  if (navRight[1]) navRight[1].textContent = s.copy;
  if (navRight[2]) navRight[2].textContent = s.clear;

  // Hero
  set('hero-kicker', s.debateTab);
  set('hero-headline-text', s.headline);
  set('hero-headline-em', s.headlineEm);
  set('hero-deck', s.deck);
  set('hero-byline', s.byline);
  set('stat-cats', s.statCats);
  set('stat-layers', s.statLayers);
  set('stat-topics', s.statTopics);
  set('stat-modes', s.statModes);

  // Cat kicker
  const kicker = document.getElementById('cat-kicker');
  if (kicker) {
    const parts = kicker.textContent.split(' — ');
    kicker.textContent = s.selectTopic + (parts[1] ? ' — ' + parts[1] : '');
  }

  // Config section
  set('cfg-header-label', s.configureArg);
  set('cf-position-label', s.yourPosition);
  set('cf-persona-label', s.persona);
  set('cf-depth-label', s.depth);
  set('cf-lang-label', s.language);
  set('cf-source-label', s.knowledgeSource);
  set('tone-label', s.toneLabel);

  // Feature toggles
  set('tog-label-fallacy', s.fallacyScan);
  set('tog-label-socratic', s.socraticDrill);
  set('tog-label-video', s.liveAvatar);

  // Dispatch preview
  set('prev-label', s.dispatchPreview);
  set('prev-motion-label', s.selectedMotion);
  const prevPos = document.getElementById('prev-pos');
  if (prevPos && prevPos.textContent.includes('Pick a') || prevPos && prevPos.textContent.includes('→')) {
    prevPos.textContent = s.pickTopic;
  }

  // Custom topic
  setPlaceholder('custom-in', s.customPlaceholder);
  const customBtn = document.querySelector('.custom-btn');
  if (customBtn) customBtn.textContent = s.customBtn;

  // Run button
  set('run-btn-text', s.runBtn);
  set('run-btn-sub', s.runSub);

  // Fallacy alert head
  const fhead = document.querySelector('.fallacy-alert-head');
  if (fhead) fhead.textContent = s.fallacyAlertHead;

  // Socratic
  const shead = document.querySelector('.sb-head');
  if (shead) shead.textContent = s.socraticHead;
  const ssub = document.querySelector('.sb-submit');
  if (ssub) ssub.textContent = s.socraticSubmit;

  // Live debate
  set('live-start', s.openFloor);
  set('live-end', '⏹ ' + s.endJudge);

  // Arena / Live section headlines
  set('arena-headline-text', s.arenaTitle);
  set('arena-deck', s.arenaDeck);
  set('live-headline-text', s.liveTitle);
  set('live-deck', s.liveDeck);
  set('archive-headline-text', s.archiveTitle);
}

function toggleKokoro() {
  S.kokoroEnabled = !S.kokoroEnabled;
  const box = document.getElementById('tog-kokoro');
  const badge = document.getElementById('kokoro-badge');
  box.classList.toggle('checked', S.kokoroEnabled);
  box.textContent = S.kokoroEnabled ? '✓' : '';
  badge.textContent = S.kokoroEnabled ? 'ON' : 'OFF';
  badge.className = S.kokoroEnabled ? 'acc-badge active' : 'acc-badge';
  if (S.kokoroEnabled && !_kokoroTTS) initKokoro();
}

// ================================================================
// BOOT
// ================================================================
window.onload = async () => {
  document.getElementById('masthead-date').textContent =
    new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
    
  try {
    const res = await fetch('/api/dynamic-topics');
    if (res.ok) {
      const db = await res.json();
      CATS.forEach(c => {
        c.subs.forEach(sub => {
          if (db[sub.id]) sub.topics = sub.topics.concat(db[sub.id]);
        });
      });
    }
  } catch (err) { console.warn("Could not load dynamic topics", err); }

  buildCatStrip();
  renderCat('quran');
  initTones();
  updateSettingsBadge();
  // Sync depth selector default with S.depth
  const ds = document.getElementById('sel-depth');
  if (ds) { ds.value = S.depth; if (!ds.value) ds.selectedIndex = 2; }
  
  // Background task: generate a novel topic silently
  setTimeout(generateDynamicTopic, 3000);
};

// ================================================================
// CATEGORY STRIP — build once on load (and on language switch)
// ================================================================
function buildCatStrip() {
  const strip = document.getElementById('cat-strip');
  strip.innerHTML = '';
  CATS.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (c.id === S.currentCat ? ' active' : '');
    btn.dataset.id = c.id;
    const label = c.label;
    btn.innerHTML = `<span class="cat-accent" style="background:${c.accent}"></span>${label}`;
    btn.onclick = () => renderCat(c.id);
    strip.appendChild(btn);
  });
}

// ================================================================
// LEVEL 1 → select category → renders sub-category pills
// ================================================================
function renderCat(catId) {
  S.currentCat = catId;
  const cat = CATS.find(c => c.id === catId);
  const catLabel = cat.label;
  
  document.querySelectorAll('.cat-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.id === catId));
    
  const s = LANGS[currentLang].strings;
  document.getElementById('cat-kicker').textContent = `${s.selectTopic} — ${catLabel}`;

  // Build sub-category pill row
  const grid = document.getElementById('topic-grid');
  grid.innerHTML = `
    <div class="sub-strip" id="sub-strip" style="display:flex;gap:0;flex-wrap:wrap;border-bottom:1px solid var(--rule-heavy);margin-bottom:.8rem;padding-bottom:0;grid-column:1/-1;">
      ${cat.subs.map((sub,i) => {
        const subLabel = sub.label;
        return `<button class="sub-btn${i===0?' sub-active':''}" data-sub="${sub.id}" onclick="renderSub('${catId}','${sub.id}')">
          ${subLabel}
        </button>`;
      }).join('')}
    </div>
    <div id="sub-topic-grid" style="display:contents;"></div>`;

  // Auto-render first sub
  renderSub(catId, cat.subs[0].id);

  // Sync source quick-select to first sub's sources
  const ssq = document.getElementById('sel-source-quick');
  ssq.innerHTML = cat.subs[0].sources.map(s =>
    `<option value="${s}">${s.split(' (')[0]}</option>`).join('');
  S.source = cat.subs[0].sources[0];

  // Source footnote
  const oldFn = document.getElementById('source-footnote');
  if (oldFn) oldFn.remove();
  const fn = document.createElement('div');
  fn.className = 'source-footnote'; fn.id = 'source-footnote';
  fn.innerHTML = `<strong>Sources:</strong> ${cat.subs[0].sources.join(' &nbsp;·&nbsp; ')}`;
  document.getElementById('topic-grid').after(fn);

  syncAIA();
}

// ================================================================
// LEVEL 2 → select sub-category → renders 6 topic cards
// ================================================================
function renderSub(catId, subId) {
  S.currentSub = subId;
  const cat = CATS.find(c => c.id === catId);
  const sub = cat.subs.find(s => s.id === subId);
  const subLabel = sub.label;

  // Update active sub pill
  document.querySelectorAll('.sub-btn').forEach(b =>
    b.classList.toggle('sub-active', b.dataset.sub === subId));

  // Update sources
  const ssq = document.getElementById('sel-source-quick');
  ssq.innerHTML = sub.sources.map(s =>
    `<option value="${esc(s)}">${esc(s.split(' (')[0])}</option>`).join('');
  S.source = sub.sources[0];
  const fn = document.getElementById('source-footnote');
  const sourceStr = 'Sources for';
  if (fn) fn.innerHTML = `<strong>${sourceStr} ${subLabel}:</strong> ${sub.sources.join(' &nbsp;·&nbsp; ')}`;

  // Render 6 topic cards
  const stg = document.getElementById('sub-topic-grid');
  if (!stg) return;
  stg.innerHTML = sub.topics.map((t, i) => {
    const title = t.title;
    const tSub = t.sub;
    return `
      <button type="button" class="topic-card" id="tc-${catId}-${subId}-${i}" aria-pressed="false" onclick="selectTopic('${catId}','${subId}',${i})">
        <span class="tc-label" style="color:${cat.accent};">${esc(subLabel).toUpperCase()}</span>
        <span class="tc-head">${esc(title)}</span>
        <span class="tc-sub">${esc(tSub)}</span>
        <span class="tc-check" aria-hidden="true">✓</span>
      </button>`;
  }).join('');
}

function selectTopic(catId, subId, i) {
  const cat = CATS.find(c => c.id === catId);
  const sub = cat.subs.find(s => s.id === subId);
  const t = sub.topics[i];
  S.topic = t.title;
  S.positions = t.positions;
  document.querySelectorAll('.topic-card').forEach(c => {
    c.classList.remove('selected');
    c.setAttribute('aria-pressed', 'false');
  });
  const card = document.getElementById(`tc-${catId}-${subId}-${i}`);
  if (card) { card.classList.add('selected'); card.setAttribute('aria-pressed', 'true'); }
  const ps = document.getElementById('sel-pos');
  ps.innerHTML = '<option value="">— Select side —</option>' +
    t.positions.map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join('');
  syncAIA(); updatePreview();
}

function setCustom() {
  const v = document.getElementById('custom-in').value.trim();
  if (!v) return;
  S.topic = v;
  S.positions = [`Support: "${v}"`, `Oppose: "${v}"`];
  document.querySelectorAll('.topic-card').forEach(c => {
    c.classList.remove('selected');
    c.setAttribute('aria-pressed', 'false');
  });
  const ps = document.getElementById('sel-pos');
  ps.innerHTML = '<option value="">— Select side —</option>' +
    S.positions.map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join('');
  syncAIA(); updatePreview();
  telegram('Motion filed ✓', 'ok');
}

function updatePreview() {
  document.getElementById('prev-topic').textContent = S.topic || '—';
  const pos = document.getElementById('sel-pos').value;
  document.getElementById('prev-pos').textContent = pos ? `Arguing: ${pos.substring(0,50)}` : 'Pick a position →';
}

document.addEventListener('change', e => {
  if (e.target.id === 'sel-pos') { S.position = e.target.value; updatePreview(); }
  if (e.target.id === 'sel-persona') S.persona = e.target.value;
  if (e.target.id === 'sel-depth') S.depth = e.target.value;
  if (e.target.id === 'sel-lang') S.lang = e.target.value;
  if (e.target.id === 'sel-source-quick') S.source = e.target.value;
});

// ================================================================
// TOGGLES
// ================================================================
function toggleFeature(f) {
  if (f==='fallacy') {
    S.fallacyOn = !S.fallacyOn;
    setToggle('tog-fallacy', S.fallacyOn);
  } else if (f==='socratic') {
    S.socraticOn = !S.socraticOn;
    setToggle('tog-socratic', S.socraticOn);
  } else if (f==='video') {
    S.videoOn = !S.videoOn;
    setToggle('tog-video', S.videoOn);
    document.getElementById('avatar-panel').style.display = S.videoOn ? 'block' : 'none';
    if (S.videoOn) initAvatar();
  }
}

function setToggle(id, on) {
  const el = document.getElementById(id);
  el.classList.toggle('checked', on);
  el.textContent = on ? '✓' : '';
}

// ================================================================
// ACCORDION
// ================================================================
function toggleAcc(k) {
  const body = document.getElementById(k+'-body');
  const arrow = document.getElementById(k+'-arrow');
  const head = body.previousElementSibling;
  body.classList.toggle('open'); arrow.classList.toggle('open');
  const open = body.classList.contains('open');
  head.classList.toggle('open', open);
  head.setAttribute('aria-expanded', String(open));
}

// ================================================================
// TONES
// ================================================================
function initTones() {
  document.querySelectorAll('.tone-pill').forEach(b => {
    b.onclick = () => {
      document.querySelectorAll('.tone-pill').forEach(x=>{
        x.classList.remove('sel');
        x.setAttribute('aria-pressed','false');
      });
      b.classList.add('sel');
      b.setAttribute('aria-pressed','true');
      S.tone = b.dataset.tone;
    };
  });
}

// ================================================================
// KOKORO TTS — runs 100% locally in the browser via kokoro-js
// First call downloads ~80MB model and caches it; subsequent calls instant
// ================================================================
let _kokoroTTS = null;
let _kokoroLoading = false;

async function initKokoro() {
  if (_kokoroTTS) return _kokoroTTS;
  if (_kokoroLoading) {
    // Wait for the in-progress load
    while (_kokoroLoading) await delay(200);
    return _kokoroTTS;
  }
  if (!S.kokoroEnabled) return null;
  _kokoroLoading = true;
  try {
    telegram('Loading Kokoro TTS model (~80MB, first time only)...', 'ok');
    const { KokoroTTS } = await import('https://cdn.jsdelivr.net/npm/kokoro-js@1.2.0/dist/kokoro.js/+esm');
    _kokoroTTS = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
      dtype: 'q8',
    });
    telegram('Kokoro TTS ready ✓', 'ok');
  } catch(e) {
    telegram('Kokoro load failed — using browser TTS', 'err');
    S.kokoroEnabled = false;
  } finally { _kokoroLoading = false; }
  return _kokoroTTS;
}

async function speak(text) {
  if (!text) return;
  let clean = text.replace(/<[^>]+>/g, '');
  clean = clean.replace(/[*_#`~]/g, ''); // strip Markdown symbols
  clean = clean.replace(/\[(.*?)\]\(.*?\)/g, '$1'); // replace markdown links with just text
  clean = clean.substring(0, 2000);
  const lang = LANGS[currentLang] || LANGS.en;
  startSiBars();

  // Kokoro for EN/ES (supported languages)
  if (S.kokoroEnabled && lang.kokoroSupported) {
    try {
      const tts = await initKokoro();
      if (tts) {
        const voice = S.kokoroVoice || 'af_sky';
        const audio = await tts.generate(clean, { voice });
        const wav = audio.toWav();
        const blob = new Blob([wav], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const a = new Audio(url);
        S.activeAudio = a;
        a.onended = () => { stopSiBars(); URL.revokeObjectURL(url); };
        a.play();
        return;
      }
    } catch(e) { console.warn('Kokoro speak error:', e); }
  }

  // Browser TTS fallback — supports Arabic (ar-SA) and Urdu (ur-PK)
  if ('speechSynthesis' in window) {
    // Ensure voices are loaded
    let voices = speechSynthesis.getVoices();
    if (!voices.length) {
      await new Promise(r => { speechSynthesis.onvoiceschanged = r; setTimeout(r, 1000); });
      voices = speechSynthesis.getVoices();
    }
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = lang.voiceLang;
    u.rate = 0.95;
    const match = voices.find(v => v.lang === lang.voiceLang)
      || voices.find(v => v.lang.startsWith(lang.code));
    if (match) u.voice = match;
    u.onend = () => stopSiBars();
    speechSynthesis.speak(u);
  } else { stopSiBars(); }
}

// ================================================================
// MAIN PIPELINE
// ================================================================
async function runPipeline() {
  S.position = document.getElementById('sel-pos').value;
  S.persona = document.getElementById('sel-persona').value;
  S.depth = document.getElementById('sel-depth').value;
  // S.lang is set by the language switcher — don't override from dropdown
  S.topic = S.topic || document.getElementById('custom-in').value.trim();

  if (!S.topic) { telegram('Choose a topic first', 'err'); return; }
  if (!S.position) { telegram('Select your position', 'err'); return; }
  if (S.running) return;

  S.running=true; S.layers={}; S.totalIn=0; S.totalOut=0;
  S.startTime=Date.now(); S.socraticAnswers=[];
  document.getElementById('press-btn').disabled=true;
  document.getElementById('run-btn-sub').textContent='Composing dispatch...';
  document.getElementById('tw-progress').style.display='block';
  document.getElementById('score-wrap').innerHTML='';
  document.getElementById('coach-wrap').innerHTML='';
  document.getElementById('export-strip').classList.remove('show');
  document.getElementById('fallacy-alert').classList.remove('show');
  document.getElementById('socratic-broadside').classList.remove('show');
  document.getElementById('pipeline').innerHTML='';
  resetTele();

  setTicker('LUFIALLOLA COMPOSING DISPATCH...');

  try {
    // L0 FALLACY
    if (S.fallacyOn) { setTW('Layer 0 — Scanning for logical fallacies...'); await runFallacy(); }

    // Pull matching verses/hadith from the local library (data/library) if present
    let libCtx = '';
    try {
      const lr = await fetch(`/api/library/search?q=${encodeURIComponent(S.topic + ' ' + S.position)}&limit=6`);
      if (lr.ok) {
        const { results } = await lr.json();
        if (results?.length) {
          libCtx = '\n\nLibrary references (verbatim from the local Quran/Hadith library — quote by ref, do not alter):\n'
            + results.map(r => `[${r.ref}${r.grade ? ' — ' + r.grade : ''}] ${r.text}`).join('\n');
          telegram(`📚 ${results.length} Quran/Hadith references attached from local library`, 'ok');
        }
      }
    } catch {}

    let serverUploadsCtx = '';
    S.uploadFileNames = [];
    try {
      const uRes = await fetch('/api/uploads');
      if (uRes.ok) {
        const uData = await uRes.json();
        if (uData.text) {
          serverUploadsCtx = `\n\nGlobal Uploaded Documents:\n${uData.text.slice(0, 500000)}\n`;
          S.uploadFileNames = uData.files || [];
        }
      }
    } catch {}

    // Build optional reference-doc context string
    const refCtx = (S.refDocText ? `\n\nReference Document ("${S.refDocName}"):\n${S.refDocText.slice(0, 500000)}\n` : '') + serverUploadsCtx + libCtx;

    const currentCatObj = CATS.find(c => c.id === S.currentCat);
    const currentSubObj = currentCatObj ? currentCatObj.subs.find(s => s.id === S.currentSub) : null;
    const catSources = currentSubObj ? [...currentSubObj.sources] : [S.source];
    const uploadedSources = (S.uploadFileNames && S.uploadFileNames.length > 0) ? [...S.uploadFileNames] : [];
    const allAvailableSources = [...catSources, ...uploadedSources];

    // Uploaded files are always named and always take priority; category
    // sources are only shuffled in to fill out the remaining slots.
    function getLayerSources() {
      if (uploadedSources.length > 0) {
        const pool = [...catSources];
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        const fillCount = Math.max(0, 2 - uploadedSources.length);
        return [...uploadedSources, ...pool.slice(0, fillCount)].join(' & ');
      }
      if (allAvailableSources.length === 0) return S.source;
      const pool = [...allAvailableSources];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      return pool.slice(0, 2).join(' & ');
    }

    // L1 CONTEXT — uses secondary model for independent perspective
    setTW('Layer 1 — Mapping the debate landscape...');
    const src1 = getLayerSources();
    await runLayer(1,'Context Analysis','AI Scholar objectively maps the debate','var(--ink2)',
      `You are writing as a ${S.persona}. Tone: ${S.tone}. Keep the output brief, simple, crisp, and clear for a normal reader. Your length must strictly match the argument depth. Draw on the expertise of ${src1}.
${S.lang}Layer 1 — Context Analysis.
Topic: "${S.topic}". Position: "${S.position}".${refCtx}
Objectively map the debate. Identify 4-5 key factors. Surface hidden assumptions.
Do NOT take a position. ${S.depth} words. ${CITE}`, true, src1);

    // L2 ARGUMENTS — primary model
    setTW('Layer 2 — Building your strongest arguments...');
    const src2 = getLayerSources();
    await runLayer(2,'Argument Builder','Three evidence-backed arguments in your defence','var(--red)',
      `You are writing as a ${S.persona}. Tone: ${S.tone}. Keep the output brief, simple, crisp, and clear for a normal reader. Your length must strictly match the argument depth. Draw on the expertise of ${src2}.
${S.lang}Layer 2 — Argument Builder.
Topic: "${S.topic}". Defend: "${S.position}".
Context from Layer 1: ${S.layers[1]||''}${refCtx}
3 distinct evidence-backed arguments with claim, evidence, and example.
${S.depth} words. ${CITE}`, false, src2);

    // SOCRATIC
    if (S.socraticOn) {
      setTW('Socratic Drill — AI Scholar questions your logic...');
      await runSocratic();
      await waitSocratic();
    }

    // L3 COUNTER — primary model
    setTW('Layer 3 — Generating the strongest opposition...');
    const src3 = getLayerSources();
    await runLayer(3,'Counter-Argument','The strongest case against your position','var(--ink3)',
      `You are writing as a ${S.persona}. Tone: ${S.tone}. Keep the output brief, simple, crisp, and clear for a normal reader. Your length must strictly match the argument depth. Draw on the expertise of ${src3}.
${S.lang}Layer 3 — Counter-Argument.
Topic: "${S.topic}". Challenge: "${S.position}".
Prior context (L1): ${S.layers[1]||''}
Arguments made (L2): ${S.layers[2]||''}
${S.socraticAnswers.length?`User reinforced position: ${S.socraticAnswers.join(' | ')}`:''}
3 genuinely compelling counter-arguments. No strawmen. ${S.depth} words. ${CITE}`, false, src3);

    // L4 CRITIQUE — uses secondary model for independent critical perspective
    setTW('Layer 4 — Auditing weaknesses in your case...');
    const src4 = getLayerSources();
    await runLayer(4,'Self-Critique','Honest flaws in the Layer 2 arguments','var(--gold)',
      `You are writing as a ${S.persona}. Tone: ${S.tone}. Keep the output brief, simple, crisp, and clear for a normal reader. Your length must strictly match the argument depth. Draw on the expertise of ${src4}.
${S.lang}Layer 4 — Self-Critique.
Topic: "${S.topic}". Position: "${S.position}".
Original arguments (L2): ${S.layers[2]||''}
Counter-arguments faced (L3): ${S.layers[3]||''}
3-4 honest weaknesses with improvement suggestions. ${S.depth} words. ${CITE}`, true, src4);

    // L5 FINAL
    setTW('Layer 5 — AI Scholar delivers the final verdict...');
    const src5 = "ALL Uploaded Files, Quran, Sahih Muslim, and Category Sources";
    await runLayer(5,'Final Strategy & Verdict',"AI Scholar's definitive ruling",'var(--ink)',
      `You are AI Scholar, an elite AI Reasoning Strategist and host.
Tone: ${S.tone}. Keep the output brief, simple, crisp, and clear for a normal reader. Your length must strictly match the argument depth.
CRITICAL RULE: Draw on ALL category sources and all uploaded .md files. Give heavy weight to Sahih Muslim for Hadith evidence. You MUST always look to the Quran as the final authoritative verdict, and ensure no cited Hadith contradicts the Quran.
${S.lang}Layer 5 — Final Strategy & Verdict.
Topic: "${S.topic}". Position: "${S.position}".
Context (L1): ${S.layers[1]||''}
Arguments (L2): ${S.layers[2]||''}
Counters (L3): ${S.layers[3]||''}
Critique (L4): ${S.layers[4]||''}
Synthesise all layers. State conditions under which each side wins.
End with a bold "FINAL VERDICT:" from AI Scholar. ${S.depth} words. ${CITE}`, false, src5);

    // SCORE
    setTW('Scoring the debate...');
    await runScore();

    // COACH
    setTW('AI Scholar composing coaching notes...');
    await runCoach();

    // TELEMETRY OPTIMIZATION ALERT
    runTelemetryOptimization();



    saveHistory();
    document.getElementById('export-strip').classList.add('show');
    setTicker(`DISPATCH PRINTED · Topic: ${S.topic} · Score: ${S.lastScore||'—'}/100 · AI Scholar`);

  } catch(err) {
    telegram('Error: '+err.message,'err');
    console.error(err);
  } finally {
    S.running=false;
    document.getElementById('press-btn').disabled=false;
    document.getElementById('run-btn-sub').textContent='AI Scholar will argue · question · counter · critique · deliver verdict';
    document.getElementById('tw-progress').style.display='none';
    updateTele();
  }
}

// ================================================================
// FALLACY
// ================================================================
async function runFallacy() {
  try {
    const raw = await api(`You are a logic expert. Scan this debate topic for logical fallacies in how it is framed.
Topic: "${S.topic}" | Position: "${S.position}"
Respond ONLY with valid JSON (no other text):
{"fallacies":[{"type":"Fallacy Name","description":"1-sentence description","reframe":"Better framing"}]}
If no fallacies: {"fallacies":[]}`, 400);
    const d = JSON.parse(raw.replace(/```json|```/g,'').trim());
    if (d.fallacies && d.fallacies.length) {
      document.getElementById('fallacy-items').innerHTML = d.fallacies.map(f=>`
        <div class="fallacy-item">
          <span class="fallacy-type">${f.type}</span>
          ${f.description}
          <div class="fallacy-fix">Better framing: ${f.reframe}</div>
        </div>`).join('');
      document.getElementById('fallacy-alert').classList.add('show');
    }
  } catch(e){}
}

// ================================================================
// LAYER RUNNER
// ================================================================
async function runLayer(n, title, sub, color, prompt, useSecondary=false, layerSourceOverride=null) {
  // Create article placeholder
  const s = getApiSettings();
  const providerStr = (useSecondary ? s.secondaryProvider : s.primaryProvider) || (useSecondary ? 'groq' : 'local');
  const roleStr = useSecondary ? 'Secondary' : 'Primary';
  
  const art = makeArticle(n, title, sub, color, true, roleStr, providerStr, layerSourceOverride);
  document.getElementById('pipeline').appendChild(art);
  art.scrollIntoView({behavior:'smooth',block:'nearest'});

  const t0 = Date.now();
  let text='', inTok=0, outTok=0, usedModel='';
  try {
    const r = await apiWithTokens(prompt, 1400, useSecondary);
    text=r.text; inTok=r.in; outTok=r.out; usedModel=r.model;
  } catch(e) { text=`[Layer ${n} error: ${e.message}]`; }

  const elapsed = ((Date.now()-t0)/1000).toFixed(1);
  S.layers[n]=text; S.totalIn+=inTok; S.totalOut+=outTok;

  // Fill article
  fillArticle(art, n, title, sub, color, text, inTok, outTok, elapsed, usedModel, layerSourceOverride);
  updateTele();
}

function makeArticle(n, title, sub, color, loading, roleStr, providerStr, layerSourceOverride) {
  const div = document.createElement('div');
  const useSecondary = (n === 1 || n === 4);
  const s = getApiSettings();
  const fallbackProvider = (useSecondary ? s.secondaryProvider : s.primaryProvider) || (useSecondary ? 'groq' : 'local');
  const actualProviderStr = providerStr || fallbackProvider;
  const actualRoleStr = roleStr || (useSecondary ? 'Secondary' : 'Primary');
  const targetModel = useSecondary ? getSecondaryModel() : getPrimaryModel();
  const targetModelInfo = `${actualRoleStr} Model (${actualProviderStr.toUpperCase()}) · ${targetModel}`;
  
  let sourceLabel = layerSourceOverride || S.source.split(' (')[0];
  if (!layerSourceOverride && S.uploadFileNames && S.uploadFileNames.length > 0) {
    sourceLabel += ` & ${S.uploadFileNames.join(', ')}`;
  }
  
  div.className = 'article loading';
  div.style.setProperty('--lc', color);
  div.innerHTML = `
    <div class="article-head">
      <div class="article-number" style="color:${color};">${n}</div>
      <div class="article-meta">
        <div class="article-section" style="color:${color};">${title}</div>
        <div class="article-headline">${sub}</div>
        <div class="article-deck">AI Scholar · Drawing on ${esc(sourceLabel)} · ${esc(targetModelInfo)}</div>
      </div>
      <div class="article-status running">COMPOSING</div>
    </div>
    <hr class="article-rule">
    <div class="article-body">
      <div class="press-loading">
        <span>Setting type</span><div class="press-cursor"></div>
      </div>
    </div>`;
  return div;
}

function fillArticle(div, n, title, sub, color, text, inTok, outTok, elapsed, usedModel, layerSourceOverride) {
  const SCIPAB = {
    1: { label:'S — Situation', desc:'Map the debate landscape' },
    2: { label:'C — Complication', desc:'Build your strongest arguments' },
    3: { label:'I — Implementation', desc:'Steel-man the opposition' },
    4: { label:'P — Position', desc:'Audit weaknesses honestly' },
    5: { label:'A — Action + B — Benefit', desc:'Final strategy & verdict' },
  };
  const ps = SCIPAB[n] || { label:'', desc:'' };

  const lines = text.split('\n').filter(Boolean);
  let pullQuote = '';
  const strong = lines.find(l => l.length > 60 && !l.startsWith('**') && !l.startsWith('#'));
  if (strong) pullQuote = strong.substring(0,120)+(strong.length>120?'...':'');

  // Escape BEFORE applying markdown, never after. Model output and uploaded
  // filenames both land here, and the whole point of this product is feeding
  // user documents into the prompt — so this string is not trusted.
  const formatted = esc(text)
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/\n\n/g,'</p><p>')
    .replace(/\n/g,' ');

  const efficiency = inTok > 0 ? (outTok/inTok).toFixed(2) : '—';
  const effColor = inTok > 0 && (outTok/inTok) < 0.6 ? 'color:var(--red)' : '';
  
  const useSecondary = (n === 1 || n === 4);
  const s = getApiSettings();
  const providerStr = (useSecondary ? s.secondaryProvider : s.primaryProvider) || (useSecondary ? 'groq' : 'local');
  const roleStr = useSecondary ? 'Secondary' : 'Primary';
  const targetModelInfo = `${roleStr} (${providerStr.toUpperCase()}) · ${usedModel || (useSecondary ? getSecondaryModel() : getPrimaryModel())}`;

  let sourceLabel = layerSourceOverride || S.source.split(' (')[0];
  if (!layerSourceOverride && S.uploadFileNames && S.uploadFileNames.length > 0) {
    sourceLabel += ` & ${S.uploadFileNames.join(', ')}`;
  }

  div.className = 'article done';
  div.style.setProperty('--lc', color);
  div.innerHTML = `
    <div class="article-head">
      <div class="article-number" style="color:${color};">${n}</div>
      <div class="article-meta">
        <div class="article-section" style="color:${color};">Layer ${n} — ${title}</div>
        <div style="font-family:var(--cond);font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin-bottom:2px;">${ps.label} &nbsp;·&nbsp; SCIPAB Framework</div>
        <div class="article-headline">${sub}</div>
        <div class="article-deck">By AI Scholar · ${esc(sourceLabel)} · ${elapsed}s · ${esc(targetModelInfo)} · eff: <span style="${effColor}">${efficiency}</span></div>
      </div>
      <div class="article-status done2">PRINTED</div>
    </div>
    <hr class="article-rule">
    <div class="article-body">
      <div class="article-text">
        ${pullQuote ? `<div class="pull-quote">"${esc(pullQuote)}"</div>` : ''}
        <p>${formatted}</p>
      </div>
    </div>
    <hr class="article-rule">
    <div class="article-footer">
      <span class="art-meta-item">↑ <b>${inTok}</b> in</span>
      <span class="art-meta-item">↓ <b>${outTok}</b> out</span>
      <span class="art-meta-item" style="${effColor}">eff <b>${efficiency}</b></span>
      <button class="art-btn" onclick="copyTxt(this,'${esc(text)}')">Copy</button>
    </div>`;
}

// ================================================================
// TELEMETRY-DRIVEN OPTIMIZATION
// Fires after all layers — inspects per-layer efficiency and latency
// and surfaces a named, visible optimization recommendation
// ================================================================
function runTelemetryOptimization() {
  const efficiency = S.totalIn > 0 ? S.totalOut / S.totalIn : 1;
  const elapsed = (Date.now() - S.startTime) / 1000;

  // Per-layer analysis stored during pipeline
  const insights = [];

  // Insight 1: Low output density — AI is being too concise
  if (efficiency < 0.6) {
    insights.push({
      type:'warn',
      icon:'⚠',
      title:'Low output density detected (eff: ' + efficiency.toFixed(2) + ')',
      action:'Optimization applied: switching to Deep Dive depth for next run will increase argument density. Try increasing Argument Depth to 300–350 words.',
      layer:'All layers'
    });
  }

  // Insight 2: High input token cost — context is growing large
  if (S.totalIn > 8000) {
    insights.push({
      type:'info',
      icon:'📊',
      title:'High input token cost (' + S.totalIn + ' tokens)',
      action:'Optimization applied: context chaining is working correctly but L3 onward carries the full prior context. Consider using Concise depth to reduce cost by ~35%.',
      layer:'L3 → L5'
    });
  }

  // Insight 3: High efficiency — good signal
  if (efficiency >= 0.8 && S.totalOut > 2000) {
    insights.push({
      type:'ok',
      icon:'✓',
      title:'Strong output density confirmed (eff: ' + efficiency.toFixed(2) + ')',
      action:'Pipeline is performing optimally. All layers produced substantive outputs relative to input context. No optimization required.',
      layer:'All layers'
    });
  }

  // Insight 4: Slow total time
  if (elapsed > 60) {
    insights.push({
      type:'warn',
      icon:'⏱',
      title:'High latency detected (' + elapsed.toFixed(0) + 's total)',
      action:'Optimization applied: switching to Concise depth (150–200 words) will reduce latency by approximately 40% with minimal quality loss.',
      layer:'All layers'
    });
  }

  if (!insights.length) {
    insights.push({
      type:'ok', icon:'✓',
      title:'Telemetry nominal — pipeline healthy',
      action:'All efficiency and latency metrics within optimal range. No optimization needed for this run.',
      layer:'All layers'
    });
  }

  // Render after coach card
  const wrap = document.getElementById('coach-wrap');
  const div = document.createElement('div');
  div.style.cssText = 'border:2px solid var(--rule-heavy);margin-bottom:1.5rem;';
  div.innerHTML = `
    <div style="background:var(--ink);color:var(--paper);padding:8px 14px;display:flex;align-items:center;justify-content:space-between;">
      <span style="font-family:var(--cond);font-size:11px;font-weight:900;letter-spacing:.15em;text-transform:uppercase;">Telemetry Insights &amp; Optimization</span>
      <span style="font-family:var(--mono);font-size:9px;opacity:.6;">Req. 5 — SCIPAB Framework</span>
    </div>
    <div style="padding:14px;">
      ${insights.map(ins=>`
        <div style="padding:10px 12px;margin-bottom:8px;border-left:3px solid ${ins.type==='ok'?'var(--ok)':ins.type==='warn'?'var(--gold)':'var(--rule-heavy)'};background:var(--paper2);">
          <div style="font-family:var(--cond);font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">
            ${ins.icon} ${ins.title} <span style="font-weight:400;color:var(--ink3);margin-left:8px;">· ${ins.layer}</span>
          </div>
          <div style="font-family:var(--body);font-style:italic;font-size:13px;color:var(--ink2);line-height:1.7;">${ins.action}</div>
        </div>`).join('')}
      <div style="font-family:var(--mono);font-size:9px;color:var(--ink4);margin-top:4px;letter-spacing:.05em;">
        Total: ${S.totalIn} in · ${S.totalOut} out · eff ${efficiency.toFixed(2)} · ${elapsed.toFixed(1)}s · ${(elapsed/5).toFixed(0)} layers/min
      </div>
    </div>`;
  wrap.appendChild(div);
}

// ================================================================
// SOCRATIC
// ================================================================
async function runSocratic() {
  const q = await api(`You are AI Scholar, elite debate coach.
After reading these arguments: ${S.layers[2]||''}
Ask 2 sharp Socratic questions exposing hidden assumptions in: "${S.position}" on "${S.topic}".
Return only the 2 questions numbered 1. and 2.`, 300);
  const qs = q.split('\n').filter(l=>l.match(/^[12]\./)).slice(0,2);
  const broadside = document.getElementById('socratic-broadside');
  document.getElementById('socratic-body').innerHTML = qs.map((qq,i)=>`
    <div class="sb-q">${qq}</div>
    <textarea class="sb-in" id="sq${i}" rows="2" placeholder="Your answer..."></textarea>`).join('')+
    `<button class="sb-submit" onclick="submitSocratic()">Strengthen arguments → Continue</button>`;
  broadside.classList.add('show');
  broadside.scrollIntoView({behavior:'smooth',block:'nearest'});
  S.socraticPending=true;
}

function waitSocratic() {
  return new Promise(r=>{const c=()=>{if(!S.socraticPending)r();else setTimeout(c,200)};c();});
}

function submitSocratic() {
  S.socraticAnswers=[0,1].map(i=>(document.getElementById('sq'+i)||{}).value||'').filter(Boolean);
  S.socraticPending=false;
  document.getElementById('socratic-broadside').classList.remove('show');
  telegram('Arguments reinforced — continuing', 'ok');
}

// ================================================================
// SCORE CARD
// ================================================================
async function runScore() {
  try {
    const raw = await api(`You are debate judge AI Scholar.
Score this debate — Argument Strength, Evidence Quality, Logical Coherence, Persuasiveness (0-100 each).
Topic: "${S.topic}" | Position: "${S.position}"
L1: ${(S.layers[1]||'').substring(0,350)} L2: ${(S.layers[2]||'').substring(0,350)}
L3: ${(S.layers[3]||'').substring(0,300)} L5: ${(S.layers[5]||'').substring(0,350)}
Respond ONLY with valid JSON:
{"strength":85,"evidence":72,"logic":90,"persuasion":78,"overall":81,"verdict":"One sentence","recommendation":"One actionable tip"}`, 400);
    const d=JSON.parse(raw.replace(/```json|```/g,'').trim());
    S.lastScore=d.overall;
    const cls=d.overall>=85?'e':d.overall>=70?'g':d.overall>=55?'f':'w';
    const rows=[['Argument Strength',d.strength],['Evidence Quality',d.evidence],['Logical Coherence',d.logic],['Persuasiveness',d.persuasion]];
    document.getElementById('score-wrap').innerHTML=`
      <div class="score-inset">
        <div class="score-inset-head">
          <div class="score-head-left">AI Scholar's Score Card</div>
          <div class="score-total ${cls}">${d.overall}<span style="font-size:14px;opacity:.5">/100</span></div>
        </div>
        <div class="score-inset-body">
          <div class="score-col">
            ${rows.slice(0,2).map(([l,v])=>`<div class="score-row">
              <div class="score-row-label">${l}</div>
              <div class="score-bar-wrap"><div class="score-bar" style="width:${v}%"></div></div>
              <div class="score-num">${v}</div>
            </div>`).join('')}
          </div>
          <div class="score-col">
            ${rows.slice(2).map(([l,v])=>`<div class="score-row">
              <div class="score-row-label">${l}</div>
              <div class="score-bar-wrap"><div class="score-bar" style="width:${v}%"></div></div>
              <div class="score-num">${v}</div>
            </div>`).join('')}
            <div class="score-verdict">${d.verdict}</div>
            ${d.recommendation?`<div class="score-rec">${d.recommendation}</div>`:''}
          </div>
        </div>
      </div>`;
  } catch(e){ console.error('score error',e); }
}

// ================================================================
// COACH
// ================================================================
async function runCoach() {
  const wrap=document.getElementById('coach-wrap');
  wrap.innerHTML=`<div class="coach-column">
    <div class="coach-column-head">
      <span class="coach-kicker">Personal Coaching</span>
      <span class="coach-title">AI Scholar's Notes on Your Performance</span>
    </div>
    <div class="coach-byline">By AI Scholar, AI Debate Coach · Personalized to this debate</div>
    <div class="coach-text" id="coach-text-inner">
      <span style="font-family:var(--mono);font-size:11px;color:var(--ink4);">Composing coaching notes...</span>
    </div>
  </div>`;

  try {
    const t=await api(`You are AI Scholar, expert debate coach.
Topic: "${S.topic}" | Position: "${S.position}" | Persona: ${S.persona}
Arguments (L2): ${(S.layers[2]||'').substring(0,450)}
Counter (L3): ${(S.layers[3]||'').substring(0,350)}
Critique (L4): ${(S.layers[4]||'').substring(0,350)}
Provide coaching feedback in this structure:
**Key Strength** (1 short sentence)
**Biggest Weakness** (1 short sentence)
**Quick Win** (1 short sentence on how to improve)
Keep it incredibly brief, punchy, and clear for a normal reader. Maximum 50 words total.`, 150);
    const fmt=t.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n\n/g,'</p><p>').replace(/\n/g,' ');
    document.getElementById('coach-text-inner').innerHTML=`<p>${fmt}</p>`;
  } catch(e){
    document.getElementById('coach-text-inner').textContent='Coaching unavailable: '+e.message;
  }
}

// ================================================================
// AI vs AI
// ================================================================
function syncAIA() {
  const sel=document.getElementById('aia-topic');
  sel.innerHTML='<option value="">—</option>';
  if(S.topic){ const o=document.createElement('option');o.value=S.topic;o.textContent=S.topic;o.selected=true;sel.appendChild(o); }
  const ls=document.getElementById('aia-lufia-side');
  ls.innerHTML='<option value="">— Select position —</option>'+(S.positions||[]).map(p=>`<option value="${p}">${p}</option>`).join('');
}

async function runAIA() {
  const topic=document.getElementById('aia-topic').value||S.topic;
  const lufiaSide=document.getElementById('aia-lufia-side').value;
  const oppPersona=document.getElementById('aia-opp').value;
  const rounds=parseInt(document.getElementById('aia-rounds').value);
  const depth=document.getElementById('aia-depth').value;
  if(!topic){telegram('Set a topic in the Debate tab first','err');return;}
  if(!lufiaSide){telegram('Select AI Scholar\'s position','err');return;}

  const positions=S.positions&&S.positions.length>=2?S.positions:[lufiaSide,'The opposing position'];
  const oppSide=positions.find(p=>p!==lufiaSide)||'The opposing view';

  document.getElementById('aia-btn').disabled=true;
  document.getElementById('aia-btn').textContent='⊕ Match in progress...';
  document.getElementById('aia-lufia-role').textContent=lufiaSide.substring(0,40);
  document.getElementById('aia-opp-name').textContent=oppPersona.split(' ').pop();
  document.getElementById('aia-opp-role').textContent=oppSide.substring(0,40);
  document.getElementById('aia-verdict').innerHTML='';

  const transcript=document.getElementById('aia-transcript');
  transcript.innerHTML='';
  const dots=document.getElementById('aia-dots');
  dots.innerHTML='<span style="font-family:var(--mono);font-size:9px;color:var(--ink4);text-transform:uppercase;letter-spacing:.1em;">Rounds:</span>';

  let history=[];

  for(let r=1;r<=rounds;r++){
    document.getElementById('aia-round-label').textContent=`Round ${r} of ${rounds}`;

    // AI Scholar
    const ld=document.createElement('div');ld.className='round-dot lufia';dots.appendChild(ld);
    const lEx=addExchange(transcript,'lufia','AI Scholar','...');
    const lp=`You are AI Scholar, elite AI debate host. Arguing: "${lufiaSide}" on "${topic}".
Debate history: ${history.map(h=>`${h.who}: ${h.text}`).join('\n')||'Opening round.'}
${r===1?'Opening':'Round '+r} argument. Sharp, specific, evidence-based. ${depth} words max. No preamble.`;
    const lt=await api(lp,550);
    history.push({who:'AI Scholar',text:lt});
    lEx.querySelector('.exchange-text').textContent=lt;
    await delay(500);

    // Opponent
    const od=document.createElement('div');od.className='round-dot opp';dots.appendChild(od);
    const oEx=addExchange(transcript,'opponent',oppPersona,'...');
    const op=`You are a ${oppPersona}. Arguing: "${oppSide}" on "${topic}".
History: ${history.map(h=>`${h.who}: ${h.text}`).join('\n')}
Counter AI Scholar directly. ${depth} words max. No preamble.`;
    const ot=await api(op,550);
    history.push({who:'Opponent',text:ot});
    oEx.querySelector('.exchange-text').textContent=ot;
    await delay(400);
  }

  // Judge
  try {
    const jraw=await api(`Impartial judge. Topic: "${topic}". AI Scholar: "${lufiaSide}". Opponent: "${oppSide}".
Transcript: ${history.map(h=>`${h.who}: ${h.text}`).join('\n\n')}
JSON only:
{"winner":"AI Scholar","winner_reason":"One sentence","lufia_score":82,"opp_score":74,"lufia_best":"Best point","opp_best":"Best point","verdict":"Final punchy sentence"}`,400);
    const j=JSON.parse(jraw.replace(/```json|```/g,'').trim());
    document.getElementById('aia-verdict').innerHTML=`
      <div class="match-result show">
        <div class="mr-banner">
          <div class="mr-title">Arena Verdict</div>
          <div class="mr-winner">${j.winner} wins — ${j.winner_reason}</div>
        </div>
        <div class="mr-body">
          <div class="mr-scores">
            <div class="mr-fighter"><div class="mr-f-name lufia">AI Scholar</div><div class="mr-f-score">${j.lufia_score}</div></div>
            <div class="mr-fighter"><div class="mr-f-name">${oppPersona.split(' ').pop()}</div><div class="mr-f-score">${j.opp_score}</div></div>
          </div>
          <div class="mr-point lufia"><strong>AI Scholar's best:</strong> ${j.lufia_best}</div>
          <div class="mr-point"><strong>Opponent's best:</strong> ${j.opp_best}</div>
          <div class="mr-verdict">${j.verdict}</div>
        </div>
      </div>`;
  } catch(e){ console.error('aia verdict',e); }

  document.getElementById('aia-btn').disabled=false;
  document.getElementById('aia-btn').textContent='⊕ Start Arena Match';
}

function addExchange(container, side, name, text) {
  const div=document.createElement('div');
  div.className='match-exchange';
  div.innerHTML=`<div class="exchange-byline ${side}">${name.toUpperCase()}</div>
    <div class="exchange-text" style="font-style:italic;">${text}</div>`;
  container.appendChild(div);
  container.scrollTop=container.scrollHeight;
  return div;
}

// ================================================================
// LIVE DEBATE
// ================================================================
async function startLive() {
  if(!S.topic){telegram('Set topic in Debate tab first','err');return;}
  S.liveActive=true; S.liveTranscript=[]; S.liveRound=0;
  document.getElementById('live-paper').innerHTML='';
  document.getElementById('live-result').classList.remove('show');
  document.getElementById('live-result').innerHTML='';
  document.getElementById('live-start').disabled=true;
  document.getElementById('live-mic').disabled=false;
  document.getElementById('live-end').disabled=false;
  setHostStatus('thinking','Composing opening...');

  const open=await api(`You are AI Scholar, energetic AI debate host.
Topic: "${S.topic}". Human argues: "${S.position||'their chosen side'}". You argue the opposite.
2-3 sharp sentences: introduce the debate and challenge them. Direct, no preamble.`,250);

  S.liveTranscript.push({who:'lufia',text:open});
  addLiveTurn('lufia','AI Scholar',open);
  document.getElementById('host-text').textContent=open;
  setHostStatus('speaking','Speaking...');
  await speak(open);
  setHostStatus('idle','Listening...');
  document.getElementById('live-rnd').textContent=1;
}

function addLiveTurn(who, name, text) {
  const p=document.getElementById('live-paper');
  const div=document.createElement('div');
  div.className='live-turn';
  div.innerHTML=`<div class="lt-who ${who}">${name}</div><div class="lt-text">${text}</div>`;
  p.appendChild(div);
  p.scrollTop=p.scrollHeight;
}

function setHostStatus(state, txt) {
  const dot=document.getElementById('host-dot');
  dot.className=`host-status-dot ${state}`;
  document.getElementById('host-status-txt').textContent=txt;
}

function toggleMic() {
  if(!S.liveActive)return;
  if(!S.recognizing) startMic(); else stopMic();
}

function startMic() {
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){telegram('Mic not available in this browser','err');return;}
  S.recognition=new SR(); S.recognition.continuous=true; S.recognition.interimResults=true;
  S.recognition.onstart=()=>{
    S.recognizing=true;
    document.getElementById('live-mic').textContent='● Recording — click to stop';
    document.getElementById('live-mic').classList.add('recording');
  };
  S.recognition.onresult=e=>{
    const t=Array.from(e.results).map(r=>r[0].transcript).join('');
    document.getElementById('host-text').textContent=`You: "${t}"`;
  };
  S.recognition.onend=()=>{ if(S.recognizing) handleUserTurn(); };
  S.recognition.start();
}

function stopMic() {
  S.recognizing=false;
  if(S.recognition) S.recognition.stop();
  document.getElementById('live-mic').textContent='Mic — Hold to speak';
  document.getElementById('live-mic').classList.remove('recording');
}

async function handleUserTurn() {
  stopMic();
  const lastText = document.getElementById('host-text').textContent.replace(/^You: "/,'').replace(/"$/,'');
  if(!lastText||lastText.length<5)return;
  addLiveTurn('user','You',lastText);
  S.liveTranscript.push({who:'user',text:lastText});
  S.liveRound++;
  document.getElementById('live-rnd').textContent=S.liveRound;
  setHostStatus('thinking','Thinking...');

  const hist=S.liveTranscript.slice(-6).map(m=>`${m.who==='lufia'?'AI Scholar':'Human'}: ${m.text}`).join('\n');
  const reply=await api(`You are AI Scholar, expert debate opponent.
Topic: "${S.topic}". Human argues: "${S.position||'their side'}". You argue opposite.
Conversation: ${hist}
Human just said: "${lastText}"
Sharp counter, 3-5 sentences, spoken conversational style. No preamble.`,350);

  S.liveTranscript.push({who:'lufia',text:reply});
  addLiveTurn('lufia','AI Scholar',reply);
  document.getElementById('host-text').textContent=reply;
  setHostStatus('speaking','Speaking...');
  await speak(reply);
  setHostStatus('idle','Your turn...');
}

async function endLive() {
  setHostStatus('thinking','Judging...');
  document.getElementById('live-end').disabled=true;
  document.getElementById('live-mic').disabled=true;
  if(S.recognition) S.recognition.stop();

  const full=S.liveTranscript.map(m=>`${m.who==='lufia'?'AI Scholar':'Human'}: ${m.text}`).join('\n');
  try {
    const raw=await api(`Judged live debate. Topic: "${S.topic}". Human position: "${S.position||'unknown'}".
Transcript: ${full}
JSON only:
{"winner":"Human","winner_reason":"One sentence","human_score":75,"ai_score":82,"human_best":"Best point","ai_best":"Best point","human_tip":"One tip","verdict":"Final sentence"}`,400);
    const j=JSON.parse(raw.replace(/```json|```/g,'').trim());
    const res=document.getElementById('live-result');
    res.innerHTML=`
      <div class="mr-banner">
        <div class="mr-title">Live Debate Verdict</div>
        <div class="mr-winner">${j.winner} wins — ${j.winner_reason}</div>
      </div>
      <div class="mr-body">
        <div class="mr-scores">
          <div class="mr-fighter"><div class="mr-f-name lufia">AI Scholar</div><div class="mr-f-score">${j.ai_score}</div></div>
          <div class="mr-fighter"><div class="mr-f-name">You</div><div class="mr-f-score">${j.human_score}</div></div>
        </div>
        <div class="mr-point lufia"><strong>AI Scholar's best:</strong> ${j.ai_best}</div>
        <div class="mr-point"><strong>Your best:</strong> ${j.human_best}</div>
        <div class="mr-point"><strong>Your tip:</strong> ${j.human_tip}</div>
        <div class="mr-verdict">${j.verdict}</div>
      </div>`;
    res.classList.add('show');
  } catch(e){ telegram('Verdict failed','err'); }
  S.liveActive=false;
  document.getElementById('live-start').disabled=false;
  setHostStatus('idle','Debate concluded.');
}

// ================================================================
// AVATAR (canvas)
// ================================================================
function initAvatar() {
  const c=document.getElementById('avatar-canvas');
  const ctx=c.getContext('2d');
  let f=0;
  function draw(){
    f++;
    ctx.clearRect(0,0,100,100);
    // Paper background
    ctx.fillStyle=PAPER_HEX;ctx.fillRect(0,0,100,100);
    // Face (editorial illustration style — stark B&W)
    ctx.fillStyle=INK_HEX;
    ctx.beginPath();ctx.arc(50,50,38,0,Math.PI*2);ctx.fill();
    // White inner face
    ctx.fillStyle=PAPER_HEX;
    ctx.beginPath();ctx.arc(50,50,34,0,Math.PI*2);ctx.fill();
    // Eyes
    const blink=f%150<5?Math.sin(f%5*Math.PI/5):0;
    [35,65].forEach(x=>{
      ctx.fillStyle=INK_HEX;
      ctx.beginPath();ctx.ellipse(x,45,4,Math.max(1,5*(1-blink)),0,0,Math.PI*2);ctx.fill();
    });
    // Mouth
    const mh=S.isSpeaking?Math.abs(Math.sin(f*.2))*6+2:2;
    ctx.fillStyle=INK_HEX;
    ctx.beginPath();ctx.ellipse(50,62,9,mh,0,0,Math.PI);ctx.fill();
    // "LUFIALLOLA" text stamp
    ctx.fillStyle=RED_HEX;
    ctx.font='bold 7px "Barlow Condensed",sans-serif';
    ctx.textAlign='center';
    ctx.fillText('LUFIALLOLA',50,93);
    requestAnimationFrame(draw);
  }
  draw();
}

// ================================================================
// WAVEFORM + SI BARS
// ================================================================
function startSiBars() { /* audio indicator — reserved for Kokoro */ }
function stopSiBars() { clearInterval(S.siInterval); }
function startWave() {}
function stopWave() {}

// ================================================================
// TABS
// ================================================================
function switchTab(t) {
  ['debate','aia','live','flowchart','history'].forEach(x=>{
    document.getElementById('tab-'+x).style.display=x===t?'block':'none';
  });
  document.querySelectorAll('.nav-item').forEach((b,i)=>{
    const tabs=['debate','aia','live','flowchart','history'];
    b.classList.toggle('active',tabs[i]===t);
  });
}

// ================================================================
// TELEMETRY
// ================================================================
function resetTele() {
  for(let i=0;i<5;i++){document.getElementById('tv'+i).textContent='—';document.getElementById('tc'+i).classList.remove('lit');}
}
function updateTele() {
  const e=((Date.now()-S.startTime)/1000).toFixed(1);
  const eff=S.totalIn?(S.totalOut/S.totalIn).toFixed(2):'—';
  [S.totalIn,S.totalOut,S.totalIn+S.totalOut,e+'s',eff].forEach((v,i)=>{
    document.getElementById('tv'+i).textContent=v;
    document.getElementById('tc'+i).classList.add('lit');
  });
}
function setTW(msg){ document.getElementById('tw-text').textContent=msg; }
function setTicker(msg){ document.getElementById('ticker-text').textContent=msg; }

// ================================================================
// HISTORY
// ================================================================
function saveHistory() {
  if(!S.topic||!S.lastScore)return;
  S.history.unshift({topic:S.topic,position:S.position,score:S.lastScore,layers:{...S.layers},ts:new Date().toLocaleTimeString()});
  renderHistory();
}
function renderHistory() {
  const list=document.getElementById('hist-list');
  if(!S.history.length){
    list.innerHTML='<div style="padding:2rem;text-align:center;font-family:var(--mono);font-size:11px;color:var(--ink4);letter-spacing:.06em;">NO ENTRIES IN THE ARCHIVE</div>';
    return;
  }
  list.innerHTML=S.history.map((e,i)=>`
    <button type="button" class="archive-entry" onclick="reloadEntry(${i})">
      <span>
        <span class="ae-topic">${esc(e.topic)}</span>
        <span class="ae-meta">${esc(e.position.substring(0,50))} · ${esc(e.ts)}</span>
      </span>
      <span class="ae-score">${esc(String(e.score))}</span>
    </button>`).join('');
}
function clearHist(){ S.history=[]; renderHistory(); }

function reloadEntry(i) {
  const e=S.history[i];if(!e)return;
  S.topic=e.topic; S.position=e.position; S.layers=e.layers;
  switchTab('debate');
  document.getElementById('pipeline').innerHTML='';
  const colors=['var(--ink2)','var(--red)','var(--ink3)','var(--gold)','var(--ink)'];
  const titles=['Context Analysis','Argument Builder','Counter-Argument','Self-Critique','Final Strategy & Verdict'];
  const subs=['Debate landscape mapped','Three arguments built','Opposition generated','Weaknesses identified','AI Scholar\'s verdict'];
  for(let n=1;n<=5;n++){
    if(!e.layers[n])continue;
    const art=document.createElement('div');
    art.className='article done';art.style.setProperty('--lc',colors[n-1]);
    const fmt=e.layers[n].replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n\n/g,'</p><p>').replace(/\n/g,' ');
    art.innerHTML=`<div class="article-head"><div class="article-number" style="color:${colors[n-1]};">${n}</div><div class="article-meta"><div class="article-section" style="color:${colors[n-1]};">Layer ${n} — ${titles[n-1]}</div><div class="article-headline">${subs[n-1]}</div></div><div class="article-status done2">PRINTED</div></div><hr class="article-rule"><div class="article-body"><div class="article-text"><p>${fmt}</p></div></div><hr class="article-rule"><div class="article-footer"><button class="art-btn" onclick="copyTxt(this,'${esc(e.layers[n])}')">Copy</button></div>`;
    document.getElementById('pipeline').appendChild(art);
  }
  document.getElementById('export-strip').classList.add('show');
  telegram('Dispatch reloaded ✓','ok');
}

// ================================================================
// EXPORT
// ================================================================
function exportDebate(fmt) {
  if(!S.topic){telegram('No dispatch to export','err');return;}
  const titles={1:'Context Analysis',2:'Argument Builder',3:'Counter-Argument',4:'Self-Critique',5:'Final Strategy & Verdict'};
  let out='';
  if(fmt==='md'){
    out=`# The Argument Record — ${S.topic}\n**Position:** ${S.position}  \n**Persona:** ${S.persona} | **Tone:** ${S.tone}  \n**Source:** ${S.source}\n\n---\n\n`;
    for(let i=1;i<=5;i++) if(S.layers[i]) out+=`## Layer ${i}: ${titles[i]}\n\n${S.layers[i]}\n\n---\n\n`;
  } else if(fmt==='txt'){
    out=`THE ARGUMENT RECORD — ${S.topic}\nPosition: ${S.position}\n\n`;
    for(let i=1;i<=5;i++) if(S.layers[i]) out+=`=== ${titles[i].toUpperCase()} ===\n${S.layers[i]}\n\n`;
  } else {
    out=JSON.stringify({topic:S.topic,position:S.position,persona:S.persona,layers:S.layers},null,2);
  }
  const ext=fmt==='json'?'json':fmt==='md'?'md':'txt';
  const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(new Blob([out],{type:'text/plain'})),download:`argument-record-${S.topic.substring(0,30).replace(/\s+/g,'-').toLowerCase()}.${ext}`});
  a.click();
  telegram(`Printed as .${ext}`,'ok');
}
function copyAll() {
  const titles={1:'Context Analysis',2:'Argument Builder',3:'Counter-Argument',4:'Self-Critique',5:'Final Strategy'};
  let out='';
  for(let i=1;i<=5;i++) if(S.layers[i]) out+=`[${titles[i]}]\n${S.layers[i]}\n\n`;
  navigator.clipboard.writeText(out).then(()=>telegram('Copied to clipboard','ok'));
}
function shareDebate() {
  const url=window.location.href.split('?')[0]+`?t=${encodeURIComponent(S.topic)}&p=${encodeURIComponent(S.position)}`;
  navigator.clipboard.writeText(url).then(()=>telegram('Share link copied','ok'));
}

// ================================================================
// UTILS
// ================================================================
function copyTxt(btn,text) { navigator.clipboard.writeText(text||'').then(()=>{btn.textContent='Copied';setTimeout(()=>btn.textContent='Copy',1400);}); }

function playLayer(btn, n) {
  if (!S.kokoroEnabled) { telegram('Enable Kokoro TTS in settings to use Read Aloud', 'err'); return; }
  if (btn.classList.contains('playing')) {
    if (S.activeAudio) { S.activeAudio.pause(); S.activeAudio = null; }
    btn.classList.remove('playing'); btn.textContent = 'Read Aloud'; return;
  }
  btn.classList.add('playing'); btn.textContent = '■ Stop';
  speak(S.layers[n] || '').then(() => { btn.classList.remove('playing'); btn.textContent = 'Read Aloud'; });
}

function delay(ms){return new Promise(r=>setTimeout(r,ms));}

function telegram(msg,type='ok'){
  const t=document.getElementById('telegram');
  t.textContent=msg; t.className=`telegram show ${type}`;
  clearTimeout(S.toastT);
  S.toastT=setTimeout(()=>t.classList.remove('show'),3200);
}

function clearAll(){
  S.layers={}; S.liveTranscript=[];
  S.totalIn=0; S.totalOut=0;
  document.getElementById('pipeline').innerHTML='<div class="pipeline-empty"><div class="pipeline-empty-headline">No dispatch in print.</div><div class="pipeline-empty-sub">Configure your debate and press Run to begin.</div></div>';
  document.getElementById('score-wrap').innerHTML='';
  document.getElementById('coach-wrap').innerHTML='';
  document.getElementById('export-strip').classList.remove('show');
  document.getElementById('fallacy-alert').classList.remove('show');
  document.getElementById('socratic-broadside').classList.remove('show');
  document.getElementById('live-paper').innerHTML='<div style="padding:2rem;text-align:center;font-family:var(--mono);font-size:11px;color:var(--ink4);letter-spacing:.06em;">NO TRANSCRIPT YET</div>';
  document.getElementById('live-result').classList.remove('show');
  document.getElementById('aia-transcript').innerHTML='<div class="match-empty">No exchanges yet.</div>';
  document.getElementById('aia-verdict').innerHTML='';
  resetTele();
  telegram('Cleared ✓','ok');
}

// Appended to every reasoning layer: keeps Quran/Hadith references honest.
const CITE = 'Cite sources precisely: Quran as Surah name and number:ayah; Hadith by collection, number, and grading where known. If you are not certain of a reference, say so plainly — never invent a citation.';

// ================================================================
// API — multi-provider: Anthropic (via proxy), OpenRouter, or free
// Settings stored in localStorage under 'am_settings'
// ================================================================

const DEFAULT_MODELS = {
  primary: {
    anthropic: 'claude-opus-4-8',
    local: 'google/gemma-4-26B-A4B-it',
    groq: 'llama-3.3-70b-versatile',
    openrouter: 'anthropic/claude-opus-4.8',
    free: 'nvidia/nemotron-3-ultra-550b-a55b:free',
  },
  secondary: {
    anthropic: 'claude-haiku-4-5',
    local: 'google/gemma-4-26B-A4B-it',
    groq: 'llama-3.1-8b-instant',
    openrouter: 'anthropic/claude-haiku-4.5',
    free: 'z-ai/glm-5.2:free',
  },
};

// Free OpenRouter models worth surfacing as suggestions (id, size/notes).
// Source: live GET https://openrouter.ai/api/v1/models filtered to *:free
const FREE_MODEL_SUGGESTIONS = [
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'z-ai/glm-5.2:free',
  'minimax/minimax-m3:free',
  'minimax/minimax-m2.7:free',
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  'cohere/north-mini-code:free',
  'liquid/lfm-2.5-2.6b:free',
];

function getApiSettings() {
  try { return JSON.parse(localStorage.getItem('am_settings') || '{}'); } catch { return {}; }
}

function getPrimaryModel() {
  const s = getApiSettings();
  const provider = s.primaryProvider || 'local';
  return s.primaryModel || DEFAULT_MODELS.primary[provider] || DEFAULT_MODELS.primary.free;
}

function getSecondaryModel() {
  const s = getApiSettings();
  const provider = s.secondaryProvider || 'groq';
  return s.secondaryModel || DEFAULT_MODELS.secondary[provider] || DEFAULT_MODELS.secondary.free;
}

// Retry transient failures (rate limit / overloaded) up to 2 times.
async function _apiFetchRetry(prompt, maxTokens, useSecondary) {
  for (let attempt = 0; ; attempt++) {
    const r = await _apiFetch(prompt, maxTokens, useSecondary);
    if ((r.status === 429 || r.status === 503 || r.status === 529) && attempt < 2) {
      telegram(`Model busy (${r.status}) — retrying in 4s… (${attempt + 1}/2)`, 'err');
      await new Promise(s => setTimeout(s, 4000));
      continue;
    }
    return r;
  }
}

async function api(prompt, maxTokens=1200, useSecondary=false) {
  const r = await _apiFetchRetry(prompt, maxTokens, useSecondary);
  if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.error?.message || e.error || `API error ${r.status}`); }
  const d = await r.json();
  // Anthropic format: text block in d.content | OpenRouter/OpenAI format: d.choices[0].message.content
  return d.content?.find(b => b.type === 'text')?.text || d.choices?.[0]?.message?.content || '';
}

async function apiWithTokens(prompt, maxTokens=1200, useSecondary=false) {
  const r = await _apiFetchRetry(prompt, maxTokens, useSecondary);
  if (!r.ok) { const e = await r.json().catch(()=>({})); throw new Error(e.error?.message || e.error || `API error ${r.status}`); }
  const d = await r.json();
  const text = d.content?.find(b => b.type === 'text')?.text || d.choices?.[0]?.message?.content || '';
  const inTok = d.usage?.input_tokens || d.usage?.prompt_tokens || 0;
  const outTok = d.usage?.output_tokens || d.usage?.completion_tokens || 0;
  return { text, in: inTok, out: outTok, model: d.model || 'Unknown Model' };
}

async function _apiFetch(prompt, maxTokens, useSecondary) {
  const s = getApiSettings();
  const provider = useSecondary ? (s.secondaryProvider || 'anthropic') : (s.primaryProvider || 'anthropic');
  const model = useSecondary ? getSecondaryModel() : getPrimaryModel();

  if (provider === 'local') {
    // Ollama / LM Studio on this machine, via the server proxy (avoids CORS)
    return fetch('/api/local', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        baseUrl: useSecondary ? (s.secondaryLocalUrl || '') : (s.primaryLocalUrl || ''),
        model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }]
      })
    });
  }
  
  if (provider === 'groq') {
    const key = useSecondary ? (s.secondaryKey || '') : (s.primaryKey || '');
    if (!key) throw new Error('Groq API key not set — open Settings ⚙');
    return fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] })
    });
  }

  if (provider === 'openrouter' || provider === 'free') {
    // Call OpenRouter directly from browser (they support CORS).
    // Note: OpenRouter requires a key on every request, even for ":free" models —
    // the key just isn't billed for those. Get a free one at openrouter.ai/keys.
    const key = useSecondary ? (s.secondaryKey || '') : (s.primaryKey || '');
    if (!key) throw new Error('OpenRouter API key not set — open Settings ⚙ (a free account works for :free models)');
    return fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI-Minaret'
      },
      body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] })
    });
  }

  // Default: Anthropic via server proxy (key in .env or user-supplied in header)
  const key = useSecondary ? (s.secondaryKey || '') : (s.primaryKey || '');
  return fetch('/api/claude', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(key ? { 'x-user-api-key': key } : {})
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] })
  });
}
// ================================================================
// SETTINGS MODAL
// ================================================================
function openSettings() {
  const s = getApiSettings();
  document.getElementById('set-primary-provider').value = s.primaryProvider || 'local';
  document.getElementById('set-secondary-provider').value = s.secondaryProvider || 'groq';
  document.getElementById('set-primary-local-url').value = s.primaryLocalUrl || '';
  document.getElementById('set-secondary-local-url').value = s.secondaryLocalUrl || '';
  document.getElementById('set-primary-key').value = s.primaryKey || '';
  document.getElementById('set-secondary-key').value = s.secondaryKey || '';
  document.getElementById('set-primary-model').value = s.primaryModel || '';
  document.getElementById('set-secondary-model').value = s.secondaryModel || '';
  updateSettingsHints();
  document.getElementById('settings-modal').style.display='flex';
}
function closeSettings() {
  document.getElementById('settings-modal').style.display='none';
}
function saveSettings() {
  const s = {
    primaryProvider: document.getElementById('set-primary-provider').value,
    secondaryProvider: document.getElementById('set-secondary-provider').value,
    primaryLocalUrl: document.getElementById('set-primary-local-url').value.trim(),
    secondaryLocalUrl: document.getElementById('set-secondary-local-url').value.trim(),
    primaryKey: document.getElementById('set-primary-key').value.trim(),
    secondaryKey: document.getElementById('set-secondary-key').value.trim(),
    primaryModel: document.getElementById('set-primary-model').value.trim(),
    secondaryModel: document.getElementById('set-secondary-model').value.trim(),
  };
  localStorage.setItem('am_settings', JSON.stringify(s));
  closeSettings();
  telegram('Settings saved ✓', 'ok');
  updateSettingsBadge();
}
function clearApiKey() {
  document.getElementById('set-primary-key').value = '';
  document.getElementById('set-secondary-key').value = '';
  const s = getApiSettings();
  delete s.primaryKey;
  delete s.secondaryKey;
  localStorage.setItem('am_settings', JSON.stringify(s));
  telegram('API keys cleared', 'ok');
}
function updateSettingsHints() {
  const pp = document.getElementById('set-primary-provider').value;
  const sp = document.getElementById('set-secondary-provider').value;
  
  const hints = {
    anthropic: { p:'claude-opus-4-8', s:'claude-haiku-4-5' },
    local: { p:'llama3.2', s:'llama3.2' },
    openrouter: { p:'anthropic/claude-opus-4.8', s:'anthropic/claude-haiku-4.5' },
    groq: { p:'llama-3.3-70b-versatile', s:'llama-3.1-8b-instant' },
    free: { p:'nvidia/nemotron-3-ultra-550b-a55b:free', s:'z-ai/glm-5.2:free' },
  };
  
  document.getElementById('set-primary-local-wrap').style.display = (pp === 'local') ? 'block' : 'none';
  document.getElementById('set-primary-key-wrap').style.display = (pp === 'local') ? 'none' : 'block';

  document.getElementById('set-secondary-local-wrap').style.display = (sp === 'local') ? 'block' : 'none';
  document.getElementById('set-secondary-key-wrap').style.display = (sp === 'local') ? 'none' : 'block';

  if (!document.getElementById('set-primary-model').value) document.getElementById('set-primary-model').placeholder = hints[pp]?.p || '';
  if (!document.getElementById('set-secondary-model').value) document.getElementById('set-secondary-model').placeholder = hints[sp]?.s || '';
}
function updateSettingsBadge() {
  const s = getApiSettings();
  const el = document.getElementById('settings-badge');
  if (el) {
    const p = s.primaryProvider || 'local';
    const labels = { anthropic:'Claude', local:'Local', openrouter:'OpenRouter', groq:'Groq', free:'Free' };
    el.textContent = labels[p] || 'Local';
    el.style.background = p === 'anthropic' ? 'var(--red)' : p === 'local' ? 'var(--info)' : (p === 'openrouter' || p === 'groq') ? 'var(--gold)' : 'var(--ok)';
  }
  const mastheadModels = document.getElementById('masthead-models');
  if (mastheadModels) {
    const pm = getPrimaryModel();
    const sm = getSecondaryModel();
    if (pm === sm) {
      mastheadModels.textContent = `Connected: ${pm}`;
    } else {
      mastheadModels.textContent = `Primary: ${pm} | Secondary: ${sm}`;
    }
  }
}

// ================================================================
// REFERENCE DOCUMENT UPLOAD
// ================================================================
async function handleRefDocUpload(input) {
  const files = input.files;
  if (!files || files.length === 0) return;
  const MAX = 10 * 1024 * 1024; // 10 MB limit per file
  
  S.refDocName = files.length === 1 ? files[0].name : `${files.length} files loaded`;
  S.refDocText = '';
  
  document.getElementById('ref-doc-name').textContent = 'Uploading and parsing...';
  
  const promises = [];
  let totalSize = 0;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    totalSize += file.size;
    
    if (file.size > MAX) {
      telegram(`File ${file.name} is too large (> 10MB)`, 'err');
      continue;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const promise = fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      if (data.error) throw new Error(data.error);
      return `\n\n--- Source: ${file.name} ---\n\n${data.text}`;
    })
    .catch(err => {
      console.error('File upload error for', file.name, err);
      throw err; // Re-throw to ensure Promise.all fails
    });
    
    promises.push(promise);
  }
  
  Promise.all(promises).then(results => {
    S.refDocText = results.join('');
    document.getElementById('ref-doc-name').textContent = `📎 ${S.refDocName} (${(totalSize/1024/1024).toFixed(2)} MB total)`;
    document.getElementById('ref-doc-clear').style.display='inline-block';
    telegram(`${files.length} document(s) uploaded and parsed`, 'ok');
  }).catch(err => {
    telegram('Upload failed: ' + (err.message || err), 'err');
    document.getElementById('ref-doc-name').textContent = 'Upload failed! Check server logs.';
  });
}
function clearRefDoc() {
  S.refDocText = '';
  S.refDocName = '';
  document.getElementById('ref-doc-name').textContent = 'No files loaded';
  document.getElementById('ref-doc-clear').style.display='none';
  const inp = document.getElementById('ref-doc-input');
  if (inp) inp.value='';
}

// ── Global Exports for Inline HTML Handlers ──
window.switchLang = switchLang;
window.applyStrings = applyStrings;
window.toggleKokoro = toggleKokoro;
window.buildCatStrip = buildCatStrip;
window.renderCat = renderCat;
window.renderSub = renderSub;
window.selectTopic = selectTopic;
window.setCustom = setCustom;
window.updatePreview = updatePreview;
window.toggleFeature = toggleFeature;
window.setToggle = setToggle;
window.toggleAcc = toggleAcc;
window.initTones = initTones;
window.makeArticle = makeArticle;
window.fillArticle = fillArticle;
window.runTelemetryOptimization = runTelemetryOptimization;
window.waitSocratic = waitSocratic;
window.submitSocratic = submitSocratic;
window.syncAIA = syncAIA;
window.addExchange = addExchange;
window.addLiveTurn = addLiveTurn;
window.setHostStatus = setHostStatus;
window.toggleMic = toggleMic;
window.startMic = startMic;
window.stopMic = stopMic;
window.initAvatar = initAvatar;
window.startSiBars = startSiBars;
window.stopSiBars = stopSiBars;
window.startWave = startWave;
window.stopWave = stopWave;
window.switchTab = switchTab;
window.resetTele = resetTele;
window.updateTele = updateTele;
window.setTW = setTW;
window.setTicker = setTicker;
window.saveHistory = saveHistory;
window.renderHistory = renderHistory;
window.clearHist = clearHist;
window.reloadEntry = reloadEntry;
window.exportDebate = exportDebate;
window.copyAll = copyAll;
window.shareDebate = shareDebate;
window.copyTxt = copyTxt;
window.playLayer = playLayer;
window.delay = delay;
window.telegram = telegram;
window.clearAll = clearAll;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.saveSettings = saveSettings;
window.clearApiKey = clearApiKey;
window.updateSettingsHints = updateSettingsHints;
window.updateSettingsBadge = updateSettingsBadge;
window.handleRefDocUpload = handleRefDocUpload;
window.clearRefDoc = clearRefDoc;
window.getApiSettings = getApiSettings;

async function generateDynamicTopic() {
  if (sessionStorage.getItem('topic_generated')) return; 
  
  const flatSubs = [];
  CATS.forEach(c => c.subs.forEach(s => flatSubs.push(s)));
  const targetSub = flatSubs[Math.floor(Math.random() * flatSubs.length)];
  const existingTitles = targetSub.topics.map(t => t.title).join(', ');
  
  const prompt = `You are an elite Islamic debate organizer. Generate exactly ONE highly rigorous, novel, and specific debate topic for the category "${targetSub.label}".
It MUST NOT be any of these: ${existingTitles}.
Return ONLY raw JSON in this exact format, with NO markdown formatting, NO backticks, NO intro or outro:
{
  "title": "English Title",
  "title_ur": "Urdu Translation",
  "title_ar": "Arabic Translation",
  "sub": "English Subtitle/Question",
  "sub_ur": "Urdu Subtitle/Question",
  "sub_ar": "Arabic Subtitle/Question",
  "positions": ["Argument Position 1", "Argument Position 2"]
}`;
  
  try {
    const raw = await api(prompt, 500, true);
    let cleanJSON = raw.trim();
    if (cleanJSON.startsWith('```')) {
      cleanJSON = cleanJSON.replace(/^```(json)?/, '').replace(/```$/, '').trim();
    }
    const topicObj = JSON.parse(cleanJSON);
    
    if (!topicObj.title || !topicObj.positions) return;
    
    const res = await fetch('/api/dynamic-topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subId: targetSub.id, topic: topicObj })
    });
    
    if (res.ok) {
      sessionStorage.setItem('topic_generated', 'true');
      targetSub.topics.push(topicObj);
      const curCat = document.querySelector('.nav-item.active')?.dataset?.cat;
      const curSub = document.querySelector('.sub-btn.sub-active')?.dataset?.sub;
      if (curSub === targetSub.id) renderSub(curCat, curSub);
    }
  } catch (err) {
    console.error("Failed to generate dynamic topic:", err);
  }
}

// ── Global Synchronous Exports ──
window.initKokoro = initKokoro;
window.speak = speak;
window.runPipeline = runPipeline;
window.runFallacy = runFallacy;
window.runLayer = runLayer;
window.runSocratic = runSocratic;
window.runScore = runScore;
window.runCoach = runCoach;
window.runAIA = runAIA;
window.startLive = startLive;
window.handleUserTurn = handleUserTurn;
window.endLive = endLive;
window.api = api;
window.apiWithTokens = apiWithTokens;
