// Builds strokes/<hex>.json for every kanji in the app and the 46 basic hiragana and katakana: the strokes in writing order, from KanjiVG
// (© Ulrich Apel and contributors, CC BY-SA 3.0, https://kanjivg.tagaini.net). Each file is
// { p: [SVG path per stroke], n: [[x, y] position of each stroke number] } on a 109 × 109 grid.
// Run: download kanjivg-*-main.zip from github.com/KanjiVG/kanjivg/releases, unzip it, then
//      node scripts/strokes.mjs path/to/kanji        (the folder of 0xxxx.svg files)
//      add --only-missing to keep existing files (e.g. when a newer KanjiVG release is used just for new characters)
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

export const strokeFile = ch => `strokes/${ch.codePointAt(0).toString(16).padStart(5, '0')}.json`;
const SAFE_PATH = /^[MmCcSsLlHhVvZz0-9.,\s-]+$/;

export function parseKanjiVG(svg) {
  const paths = [...svg.matchAll(/<path id="kvg:[0-9a-f]+-s(\d+)"[^>]*\sd="([^"]+)"/g)]
    .map(m => [+m[1], m[2]]).sort((a, b) => a[0] - b[0]).map(m => m[1]);
  const nums = [...svg.matchAll(/<text transform="matrix\(1 0 0 1 ([\d.]+) ([\d.]+)\)">(\d+)<\/text>/g)]
    .sort((a, b) => a[3] - b[3]).map(m => [+m[1], +m[2]]);
  if (!paths.length || paths.some(d => !SAFE_PATH.test(d))) throw new Error('unexpected path data');
  return { p: paths, n: nums.length === paths.length ? nums : [] };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const src = process.argv[2];
  if (!src) { console.error('usage: node scripts/strokes.mjs path/to/kanjivg/kanji'); process.exit(1); }
  const { KANJI } = await import('../js/kanji-data.js');
  const { BASIC_HIRA, BASIC_KATA } = await import('../js/kana-data.js');
  const onlyMissing = process.argv.includes('--only-missing');
  const chars = [...KANJI.map(k => k.ch), ...BASIC_HIRA, ...BASIC_KATA];
  const root = new URL('../', import.meta.url).pathname;
  mkdirSync(join(root, 'strokes'), { recursive: true });
  const want = new Set(chars.map(strokeFile));
  let n = 0, missing = [];
  for (const ch of chars) {
    if (onlyMissing && existsSync(join(root, strokeFile(ch)))) continue;
    const f = join(src, strokeFile(ch).replace('strokes/', '').replace('.json', '.svg'));
    if (!existsSync(f)) { missing.push(ch); continue; }
    writeFileSync(join(root, strokeFile(ch)), JSON.stringify(parseKanjiVG(readFileSync(f, 'utf8'))));
    n++;
  }
  for (const f of readdirSync(join(root, 'strokes'))) if (!want.has(`strokes/${f}`)) rmSync(join(root, 'strokes', f));
  console.log(`${n} stroke files written${missing.length ? `; no KanjiVG data for ${missing.join('')}` : ''}`);
}
