// Every line the app can speak, by voice (n = main voice, m = man, f = woman in listening conversations).
// scripts/make-audio.mjs records a clip for each; check.mjs reports any line still missing a clip.
// Lines built from what the learner types (a name, a custom word in the sentence builder) can't be listed,
// so those stay on the browser voice.
const PROFILE = { name: 'スミス', nameRo: 'Sumisu', country: 'インド', countryKana: 'インド', countryRo: 'Indo', countryEn: 'India', countryHi: 'Bharat' };
const plain = s => s.replace(/[[\]]/g, '');
const toKata = s => s.replace(/[ぁ-ゖ]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60));

export async function audioTexts() {
  const { CARDS, UNITS, COUNTRIES } = await import('../js/data.js');
  const { fill } = await import('../js/core.js');
  const SP = await import('../js/speaking-data.js');
  const { WORDS } = await import('../js/vocab-data.js');
  const { GRAMMAR } = await import('../js/jlpt-data.js');
  const { PARTICLES } = await import('../js/particles-data.js');
  const { KANJI } = await import('../js/kanji-data.js');
  const { VERBS } = await import('../js/verbs-data.js');
  const { conjugate, toRomaji } = await import('../js/conjugate.js');
  const { ALL_KANA } = await import('../js/jlpt.js');
  const { LISTENING } = await import('../js/exam-data.js');
  const WAYS = await (await import('../js/ways.js')).allWays();
  const f = t => fill(t, PROFILE);
  const n = new Set(), m = new Set(), w = new Set();
  const add = (set, t) => { if (t && /[ぁ-ゖァ-ヺ一-龯々]/.test(t)) set.add(plain(t).trim()); };

  for (const c of CARDS) { add(n, f(c.jp)); if (c.casual) add(n, f(c.casual.jp)); }
  // Business versions and other ways to say each line.
  for (const w of WAYS.values()) for (const l of [w.biz, ...w.alt]) if (l && l !== 'same') add(n, f(l.jp));
  for (const u of UNITS) for (const l of u.dialogue || []) add(n, f(l[1]));
  for (const q of SP.QA) for (const l of [q.q, ...q.a]) add(n, f(l[0]));
  const { sayable } = await import('../js/core.js');
  for (const x of WORDS) add(n, sayable(x.jp, x.kana));
  for (const g of GRAMMAR) for (const e of g.ex) add(n, e[0]);
  for (const p of PARTICLES) for (const e of p.ex || p.examples || []) add(n, e[0]);
  for (const k of KANJI) for (const e of k.ex || []) add(n, sayable(e[0], e[1]));
  for (const v of VERBS) { add(n, v.jp); if (v.ex) add(n, v.ex[0]); for (const form of Object.values(conjugate(v))) add(n, form[0]); }
  for (const g of SP.PRONUNCIATION) for (const pair of g.pairs) for (const x of pair) add(n, x[0]);
  for (const k of ALL_KANA) { add(n, k); add(n, toKata(k)); }

  // Self-introduction: every option except the typed name (the default name スミス is included).
  for (const c of COUNTRIES) add(n, `${c[0]}から来ました。`);
  for (const j of SP.JOBS) add(n, j[0]);
  for (const h of SP.HOBBIES) add(n, `趣味は${h[0]}です。`);
  for (const y of SP.YEARS.slice(1)) add(n, `日本に来て${y[1]}になります。`);
  ['はじめまして。', '日本に来て、まだ半年です。', 'どうぞよろしくお願いいたします。', 'よろしくお願いします。', `${PROFILE.name}と申します。`, `${PROFILE.name}です。`].forEach(t => add(n, t));

  // Sentence builder: every pattern with every listed X and Y.
  const opts = groups => groups.flatMap(g => SP.SLOTS[g].items);
  for (const p of SP.PATTERNS) for (const x of opts(p.x)) for (const y of p.y ? opts(p.y) : [null]) add(n, SP.buildSentence(p, x, y)[0]);

  // Listening: the question in the main voice, each line in its speaker's voice.
  for (const item of LISTENING) {
    add(n, item.q[0]);
    for (const [who, jp] of item.lines) add(who === 'm' ? m : who === 'f' ? w : n, jp);
  }
  return { n: [...n].sort(), m: [...m].sort(), f: [...w].sort() };
}

// The app's own kana reading for each line that has one, so the recorder can catch the engine misreading kanji.
export async function audioKana() {
  const { CARDS, UNITS } = await import('../js/data.js');
  const { fill } = await import('../js/core.js');
  const SP = await import('../js/speaking-data.js');
  const { WORDS } = await import('../js/vocab-data.js');
  const { GRAMMAR } = await import('../js/jlpt-data.js');
  const { PARTICLES } = await import('../js/particles-data.js');
  const { KANJI } = await import('../js/kanji-data.js');
  const WAYS = await (await import('../js/ways.js')).allWays();
  const f = t => fill(t, PROFILE);
  const out = new Map();
  const put = (jp, kana) => { if (jp && kana) out.set(plain(f(jp)).trim(), plain(f(kana)).trim()); };
  for (const c of CARDS) { put(c.jp, c.kana); if (c.casual) put(c.casual.jp, c.casual.kana); }
  for (const w of WAYS.values()) for (const l of [w.biz, ...w.alt]) if (l && l !== 'same') put(l.jp, l.kana);
  for (const u of UNITS) for (const l of u.dialogue || []) put(l[1], l[2]);
  for (const q of SP.QA) for (const l of [q.q, ...q.a]) put(l[0], l[1]);
  for (const x of WORDS) put(x.jp, x.kana);
  for (const g of GRAMMAR) for (const e of g.ex) put(e[0], e[1]);
  for (const p of PARTICLES) for (const e of p.examples) put(e[0], e[1]);
  for (const k of KANJI) for (const e of k.ex || []) put(e[0], e[1]);
  const opts = groups => groups.flatMap(g => SP.SLOTS[g].items);
  for (const p of SP.PATTERNS) for (const x of opts(p.x)) for (const y of p.y ? opts(p.y) : [null]) { const l = SP.buildSentence(p, x, y); put(l[0], l[1]); }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const t = await audioTexts();
  for (const [k, v] of Object.entries(t)) console.log(k, v.length, 'lines,', v.join('').length, 'characters');
}
