// Lesson check: turns one Lessons page into multiple-choice questions. Called by js/lessons.js (the "Test yourself"
// screen at the end of a page) and by scripts/check.mjs.
//
// Questions are built only from lines the page already teaches, so no new Japanese is written here: a wrong
// answer key is impossible as long as the page itself is right. Pure functions, no DOM and no storage; the
// result is shown once and thrown away (the app keeps no scores).

export const TEST_LEN = 15;
// Under this many usable lines a page gets no test: the same few options would repeat in every question.
export const MIN_POOL = 8;

// Lines the learner is meant to complete or adapt (blanks, 〜 patterns, [number]) have no single right meaning.
const OPEN = /[＿_〜～…［\[]|〈[\s　]*〉/;

// The written line without the textbook's marks: (1) slots, 〈swap〉 brackets, footnote stars. ASCII brackets
// hold optional words, e.g. (私は) or (お)国, so the words stay; full-width （ ） hold a second form and are kept whole.
const cleanJp = jp => jp.replace(/\(\d\)/g, '').replace(/[〈〉<>()*＊]/g, '').trim();
// keep: the Japanese shows a second form in （ ）, so the romaji keeps its brackets too: chichi (otōsan).
const cleanRo = (ro, keep) => ro.replace(/^(?:[A-Z]\. )?(?:[a-z]\. )?/, '').replace(/\(\d\)\s*/g, '').replace(/\*\d?/g, '').replace(keep ? /[<>]/g : /[<>()]/g, '').replace(/\s+/g, ' ').trim();
// "job → See Appendix, Jobs" → "job"; footnote marks go.
// Exercise labels and prices are not part of the meaning either: "① pen · ¥120" → "pen", "Q: Are you alright?".
const cleanEn = en => en.replace(/\s*→.*$/, '').replace(/\*\d?/g, '').replace(/^(?:Ex\.|[QA]:|\(\d+\)|[①-⑳])\s*/, '').replace(/\s*·\s*¥[\d,]+$/, '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();

// Two English lines that would both be a right answer: "I see." / "i see", and anything that differs only by a
// bracketed aside ("I gave her my dog." / "I gave her my dog. (same meaning)").
const key = en => en.toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
// Names and loanwords whose romaji already is the English (Yokohama, karaoke) would be free marks.
const plain = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');

// Every usable line of a page as { k, jp, ro, en }; k is 's' for a sentence, 'w' for a word, so a word is never
// offered as the wrong answer to a sentence (length alone would give the answer away).
export function lessonPool(page) {
  const seen = new Set(), out = [];
  const add = (jp, ro, en) => {
    if (!jp || !en || OPEN.test(jp) || OPEN.test(en)) return;
    // Conjugation cards list five forms joined by ・; the first is the form the meaning is given for.
    jp = cleanJp(jp.split('・')[0]); ro = cleanRo((ro || '').split(' · ')[0], jp.includes('（')); en = cleanEn(en);
    const k = /[。？?！!]$/.test(jp) ? 's' : 'w';
    // A sentence with ／ is two alternative sentences, and a long gloss is an explanation, not a meaning.
    // English that quotes Japanese is a worked example ("Ex. 仕事 shigoto 8:30 a.m."), not a meaning either.
    if (!jp || !en || en.length > 70 || en.includes('=') || /[ぁ-ゖァ-ヺ一-龯]/.test(en) || (k === 's' && /[／/]/.test(jp)) || seen.has(jp) || plain(ro) === plain(en)) return;
    // A bare number or price (55円 → ¥55) shows its own answer in the digits; so does an English word left inside
    // the Japanese, and a meaning with no letters ("?") is no meaning.
    if ((k === 'w' && /[0-9０-９]/.test(jp)) || /[a-z]{2}/.test(jp) || !/[A-Za-z]/.test(en)) return;
    seen.add(jp);
    out.push({ k, jp, ro, en });
  };
  if (page.n) add(page.jp, page.ro, page.title);
  for (const s of page.sections) for (const b of s.blocks) {
    if (b.t === 'key') add(b.jp, b.ro, b.en);
    if (b.t === 'words' || b.t === 'lines') for (const w of b.items) add(w[0], w[1], w[2]);
    // Listening scripts are left out: they are the page's own listening questions.
    if (b.t === 'talk') for (const l of b.lines) add(l[1], l[2], l[3]);
  }
  return out;
}

const shuffled = (a, rnd) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// n questions, each { dir, item, options, right }: dir 'jp' shows the Japanese and asks for the meaning, 'en' shows
// the English and asks for the Japanese. Returns [] when the page is too small to test.
export function makeTest(pool, n = TEST_LEN, rnd = Math.random) {
  if (pool.length < MIN_POOL) return [];
  // A wrong option must differ in both languages, or two options would be equally right.
  const differs = (a, b) => a.jp !== b.jp && key(a.en) !== key(b.en);
  return shuffled(pool, rnd).slice(0, n).map((item, i) => {
    const wrong = [];
    // Same kind first; the other kind only fills up when a page has too few of one.
    for (const c of [...shuffled(pool.filter(x => x.k === item.k), rnd), ...shuffled(pool.filter(x => x.k !== item.k), rnd)]) {
      if (wrong.length === 3) break;
      if (differs(c, item) && wrong.every(w => differs(c, w))) wrong.push(c);
    }
    const options = shuffled([item, ...wrong], rnd);
    return { dir: i % 2 ? 'en' : 'jp', item, options, right: options.indexOf(item) };
  }).filter(q => q.options.length === 4);
}
