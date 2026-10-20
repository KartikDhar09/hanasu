// Book tab: Nihongo Fun & Easy (ASK Publishing), personal study copy. The contents list is small and loads with
// the tab; each page (js/book-<id>.js) loads only when it is opened.
export { BOOK_INFO, FOOD_PIC, COLOR, spoken, sayOf, voiceOf } from './book-kit.js';
import { spoken, sayOf, voiceOf } from './book-kit.js';
import { BOOK_INDEX } from './book-index.js';
export { BOOK_INDEX };

export const loadPage = id => BOOK_INDEX.some(p => p.id === id) ? import(`./book-${id}.js`).then(m => m.default) : Promise.reject(new Error(`no page ${id}`));
export const allPages = () => Promise.all(BOOK_INDEX.map(p => loadPage(p.id)));

// Every line the Book tab can speak, by voice, for scripts/audio-texts.mjs.
export async function bookSpoken() {
  const out = { n: new Set(), m: new Set(), f: new Set() };
  const add = (who, t) => { if (t) out[who].add(t); };
  for (const page of await allPages()) {
    if (page.jp) add('n', spoken(page.jp));
    for (const sec of page.sections) for (const b of sec.blocks) {
      if (b.t === 'key') add('n', spoken(b.jp));
      if (b.t === 'words' || b.t === 'lines') b.items.forEach(w => add('n', sayOf(w)));
      if (b.t === 'talk') b.lines.forEach(l => add(voiceOf(l[0]), spoken(l[1])));
      if (b.t === 'subs') b.sets.forEach(s => s.forEach(x => add('n', spoken(x[1]))));
      if (b.t === 'listen') b.script.forEach(l => add(voiceOf(l[0]), spoken(l[1])));
    }
  }
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, [...v]]));
}
