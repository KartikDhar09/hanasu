// Records a natural voice clip for every line in scripts/audio-texts.mjs, using a local VOICEVOX engine.
// Run the engine first (it listens only on this Mac):  ~/tools/voicevox/macos-arm64/run --host 127.0.0.1 --port 50021
// Then:  node scripts/make-audio.mjs        (only new lines are recorded; clips for removed lines are deleted)
//        node scripts/make-audio.mjs --all  (re-records every clip; bump AUDIO in sw.js so phones fetch the new ones)
//        node scripts/make-audio.mjs --fix-readings  (re-records clips the engine reads differently from the app's kana)
// Voices (credit required, shown in Settings): n = VOICEVOX:四国めたん, f = VOICEVOX:冥鳴ひまり, m = VOICEVOX:青山龍星.
import { mkdirSync, existsSync, readdirSync, rmSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { audioTexts, audioKana } from './audio-texts.mjs';
import { furigana } from '../js/furigana.js';
import { clipPath, normalizeLine } from '../js/clips.js';

const ENGINE = 'http://127.0.0.1:50021';
const SPEAKERS = { n: 2, f: 14, m: 13 };
const BITRATE = '32000';
const LEAD = 0.4; // seconds of silence before the voice (js/clips.js LEAD_SKIP must stay below this)
const ALL = process.argv.includes('--all'); // re-record every clip, e.g. after changing LEAD
const FIX = process.argv.includes('--fix-readings'); // re-record clips whose kanji the engine reads differently from the app
const ROOT = new URL('../', import.meta.url).pathname;
const tmp = mkdtempSync(join(tmpdir(), 'hanasu-audio-'));

// The engine guesses kanji readings and sometimes gets them wrong (日本 → にっぽん, 辛い → つらい, 十分 → じゅうぶん).
// Each line's reading is checked against the app's own kana; if they differ, the line is spoken with its kanji
// swapped for that kana, which keeps katakana words and punctuation (and so the rhythm) as they were.
const query = async (text, speaker = 2) => {
  const q = await fetch(`${ENGINE}/audio_query?${new URLSearchParams({ text, speaker })}`, { method: 'POST' });
  if (!q.ok) throw new Error(`audio_query ${q.status} for ${text}`);
  return q.json();
};
const heard = q => q.accent_phrases.map(ap => ap.moras.map(m => m.text).join('')).join('');
const kata = s => s.replace(/[ぁ-ゖ]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60));
const VOWEL = {};
for (const [v, cs] of Object.entries({ ア: 'アカサタナハマヤラワガザダバパァャヮ', イ: 'イキシチニヒミリギジヂビピィ', ウ: 'ウクスツヌフムユルグズヅブプゥュ', エ: 'エケセテネヘメレゲゼデベペェ', オ: 'オコソトノホモヨロヲゴゾドボポォョ' })) for (const c of cs) VOWEL[c] = v;
// Sounds only: long vowels however written, particle は/へ/を as spoken, ヅ/ヂ as ズ/ジ, いう as ゆう.
function sounds(s) {
  let out = '';
  for (const ch of kata(s).replace(/[^ァ-ヺー]/g, '')) out += ch === 'ー' ? (VOWEL[out.at(-1)] || '') : ch;
  out = out.replace(/ヅ/g, 'ズ').replace(/ヂ/g, 'ジ').replace(/ハ/g, 'ワ').replace(/ヘ/g, 'エ').replace(/ヲ/g, 'オ').replace(/イウ/g, 'ユウ'); // 言う is said ゆう
  let r = '';
  for (const ch of out) { const v = VOWEL[r.at(-1)]; r += ch === 'ウ' && v === 'オ' ? 'オ' : ch === 'イ' && v === 'エ' ? 'エ' : ch; }
  return r;
}
const withKana = (text, kana) => { const h = furigana(text, kana, s => s); return h ? h.replace(/<ruby[^>]*>.*?<rt>(.*?)<\/rt><\/ruby>/g, '$1') : kana; };
// Returns the engine query to synthesise (made for that speaker's voice), plus how the reading was settled.
async function settle(text, speaker) {
  const q = await query(text, speaker), kana = KANA.get(text);
  if (kana && !/[A-Za-z0-9]/.test(kana)) { // a reading with letters or digits (N3) can't be compared
    if (sounds(heard(q)) === sounds(kana)) return { q, how: 'ok' };
    for (const t of [withKana(text, kana), kana.replace(/〜/g, '')]) {
      const q2 = await query(t, speaker);
      if (sounds(heard(q2)) === sounds(kana)) return { q: q2, how: 'fixed' };
    }
    return { q, how: 'unresolved' };
  }
  // No kana for this line (listening conversations): the one misreading seen there is 日本 as にっぽん.
  if (/日本/.test(text) && /ニッポン/.test(heard(q))) return { q: await query(text.replace(/日本/g, 'にほん'), speaker), how: 'fixed' };
  return { q, how: 'ok' };
}

async function synth(text, speaker) {
  const { q } = await settle(text, speaker);
  // Lead-in silence: speakers and Bluetooth headphones that have gone idle fade in over the first few hundred ms,
  // which swallowed the first word with VOICEVOX's default 0.1 s. The app skips most of it when audio is already awake.
  const body = { ...q, prePhonemeLength: LEAD };
  const s = await fetch(`${ENGINE}/synthesis?speaker=${speaker}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!s.ok) throw new Error(`synthesis ${s.status} for ${text}`);
  return Buffer.from(await s.arrayBuffer());
}

function toM4a(wav, out) {
  const w = join(tmp, Math.random().toString(36).slice(2) + '.wav');
  writeFileSync(w, wav);
  execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', BITRATE, '-c', '1', w, out]);
  rmSync(w);
}

// 0.1 s of silence: played on the first tap to unlock audio on iOS.
function silenceWav() {
  const rate = 24000, n = rate / 10, b = Buffer.alloc(44 + n * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(rate, 24); b.writeUInt32LE(rate * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 2, 40);
  return b;
}

try { await fetch(`${ENGINE}/version`); } catch { console.error('VOICEVOX engine is not running on 127.0.0.1:50021'); process.exit(1); }

const texts = await audioTexts();
const KANA = await audioKana();
mkdirSync(join(ROOT, 'audio'), { recursive: true });
if (!existsSync(join(ROOT, 'audio/silence.m4a'))) toM4a(silenceWav(), join(ROOT, 'audio/silence.m4a'));

let made = 0, kept = 0, removed = 0;
for (const [who, lines] of Object.entries(texts)) {
  const dir = join(ROOT, 'audio', who);
  mkdirSync(dir, { recursive: true });
  const want = new Map();
  for (const t of lines) {
    const p = clipPath(t, who);
    if (want.has(p) && normalizeLine(want.get(p)) !== normalizeLine(t)) throw new Error(`clip name collision: ${t} / ${want.get(p)}`);
    want.set(p, t);
  }
  let todo = [...want].filter(([p]) => ALL || !existsSync(join(ROOT, p)));
  // --fix-readings: also re-record existing clips whose reading needs fixing (checking is quick; recording isn't).
  if (FIX && !ALL) {
    const have = [...want].filter(([p]) => existsSync(join(ROOT, p)));
    for (const job of have) if ((await settle(normalizeLine(job[1]))).how !== 'ok') todo.push(job);
  }
  kept += want.size - todo.length;
  // A few at a time keeps the engine busy without overloading the Mac.
  const queue = [...todo];
  await Promise.all(Array.from({ length: 3 }, async () => {
    for (let job; (job = queue.shift());) {
      const [p, t] = job;
      toM4a(await synth(normalizeLine(t), SPEAKERS[who]), join(ROOT, p));
      if (++made % 100 === 0) console.log(`${made} recorded…`);
    }
  }));
  for (const f of readdirSync(dir)) if (!want.has(`/audio/${who}/${f}`)) { rmSync(join(dir, f)); removed++; }
}
rmSync(tmp, { recursive: true, force: true });
// Lines whose reading couldn't be matched to the app's kana even with the kanji swapped out: listen to these.
const unresolved = [];
for (const t of new Set(Object.values(texts).flat())) if (KANA.has(normalizeLine(t)) && (FIX || ALL) && (await settle(normalizeLine(t))).how === 'unresolved') unresolved.push(t);
if (unresolved.length) console.log(`reading still differs from the app's kana (check by ear): ${unresolved.join(' | ')}`);
console.log(`done: ${made} recorded, ${kept} already there, ${removed} removed`);
