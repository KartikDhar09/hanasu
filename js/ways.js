// "More ways to say it": for each line, a 👔 business version and 2–3 other natural ways to say the same thing.
// Data lives in compact text blocks (js/ways-*.js), one block per line id:
//   @id                                           e.g. @greet:0 (a phrase id)
//   b|japanese|kana|romaji|english|hinglish|note?   👔 business version
//   b=                                            the line is already right for business
//   a|japanese|kana|romaji|english|hinglish|note?   another way to say it (2–3 per id)
// Placeholders ({name}, {country}…) work as in data.js. Notes say when a version fits.

export function parseWays(text) {
  const out = new Map();
  let cur = null;
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('@')) {
      const id = line.slice(1);
      if (out.has(id)) throw new Error(`ways: duplicate id ${id}`);
      out.set(id, cur = { biz: null, alt: [] });
      continue;
    }
    if (!cur) throw new Error(`ways: line before any @id: ${line}`);
    if (line === 'b=') { cur.biz = 'same'; continue; }
    const [kind, jp, kana, ro, en, hi, note = ''] = line.split('|');
    if (!['a', 'b'].includes(kind) || !jp || !kana || !ro || !en || !hi) throw new Error(`ways: bad line: ${line}`);
    const entry = { jp, kana, ro, en, hi, note };
    if (kind === 'b') cur.biz = entry; else cur.alt.push(entry);
  }
  return out;
}

// One file per part of the app, loaded only when that part is opened (screens draw first, folds fill in after).
const FILES = {
  n5: () => import('./ways-n5.js').then(m => m.WAYS_N5),
};
export const WAYS_PARTS = Object.keys(FILES);
const cache = {};
export const loadWays = part => cache[part] || (cache[part] = (FILES[part] ? FILES[part]() : Promise.resolve('')).then(parseWays));
// Every part merged (for tests and the audio list).
export async function allWays() {
  const out = new Map();
  for (const part of WAYS_PARTS) for (const [k, v] of await loadWays(part)) out.set(k, v);
  return out;
}
