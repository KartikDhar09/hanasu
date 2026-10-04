// Pure logic: spaced repetition, streaks, placeholder filling and speech matching. No DOM.

const DAY = 864e5;
// Days until the next review for each Leitner box. Box 0 = still learning.
export const INTERVALS = [0, 1, 3, 7, 14, 30, 60];
export const AGAIN = 0, GOOD = 1, EASY = 2;

// Returns the card's new schedule after a review.
export function grade(card, g, now = Date.now()) {
  const prev = card || { box: 0, seen: 0 };
  const box = g === AGAIN ? 0 : Math.min((prev.seen ? prev.box : 0) + g, INTERVALS.length - 1);
  const due = g === AGAIN ? now + 10 * 60e3 : now + INTERVALS[box] * DAY;
  return { box, due, seen: (prev.seen || 0) + 1 };
}

export const isLearned = s => !!s && s.box >= 1;
export const isDue = (s, now = Date.now()) => !!s && s.due <= now;

// Cards to study for a session: due reviews first, then new cards, capped.
export function pickSession(cards, progress, { now = Date.now(), newLimit = 8, max = 20 } = {}) {
  const due = cards.filter(c => isDue(progress[c.id], now)).sort((a, b) => progress[a.id].due - progress[b.id].due);
  const fresh = cards.filter(c => !progress[c.id]).slice(0, newLimit);
  return [...due, ...fresh].slice(0, max);
}

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Mark today as practised. streak = { last: 'YYYY-MM-DD', count }.
export function bumpStreak(streak, today = new Date()) {
  const key = dayKey(today);
  if (streak && streak.last === key) return streak;
  const y = new Date(today); y.setDate(y.getDate() - 1);
  const count = streak && streak.last === dayKey(y) ? streak.count + 1 : 1;
  return { last: key, count };
}

// Streak shown on the home screen: drops to 0 once a whole day is missed.
export function liveStreak(streak, today = new Date()) {
  if (!streak) return 0;
  const y = new Date(today); y.setDate(y.getDate() - 1);
  return streak.last === dayKey(today) || streak.last === dayKey(y) ? streak.count : 0;
}

export function fill(text, p) {
  return text
    .replaceAll('{nameRo}', p.nameRo).replaceAll('{name}', p.name)
    .replaceAll('{countryKana}', p.countryKana).replaceAll('{countryRo}', p.countryRo)
    .replaceAll('{countryEn}', p.countryEn).replaceAll('{country}', p.country);
}

// ---- Speech matching ----
const KANJI_DIGITS = { 一: '1', 二: '2', 三: '3', 四: '4', 五: '5', 六: '6', 七: '7', 八: '8', 九: '9', 十: '10', 千: '1000', 百: '100' };

export function normalize(s) {
  return s
    .replace(/[\s。、！？!?…「」・,.〜ー～]/g, '')
    .replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60)) // katakana → hiragana
    .toLowerCase();
}

function levenshtein(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]; row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

export function similarity(a, b) {
  a = normalize(a); b = normalize(b);
  if (!a.length && !b.length) return 1;
  return 1 - levenshtein(a, b) / Math.max(a.length, b.length);
}

// Best score (0..1) of anything the recogniser heard against the target phrase.
// Recognisers return kanji, kana or digits, so compare against each form.
export function matchScore(heard, jp, kana) {
  const targets = [jp, kana, jp.replace(/[一二三四五六七八九十千百]/g, k => KANJI_DIGITS[k])];
  let best = 0;
  for (const h of heard) for (const t of targets) best = Math.max(best, similarity(h, t));
  return best;
}

export const PASS = 0.75;
