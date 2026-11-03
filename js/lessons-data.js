// Lessons tab data: third-party material kept as a personal study copy (see NOTICE.md). The contents list is small and loads with
// the tab; each page (js/lessons-<id>.js) loads only when it is opened.
export { FOOD_PIC, COLOR, spoken, sayOf, voiceOf } from './lessons-kit.js';
import { spoken, sayOf, voiceOf } from './lessons-kit.js';
import { LESSONS_INDEX } from './lessons-index.js';
export { LESSONS_INDEX };

export const loadPage = id => LESSONS_INDEX.some(p => p.id === id) ? import(`./lessons-${id}.js`).then(m => m.default) : Promise.reject(new Error(`no page ${id}`));
export const allPages = () => Promise.all(LESSONS_INDEX.map(p => loadPage(p.id)));

// Every line the Lessons tab can speak, by voice, for scripts/audio-texts.mjs.
export async function lessonsSpoken() {
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
