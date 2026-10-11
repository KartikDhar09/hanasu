// Records a natural voice clip for every line in scripts/audio-texts.mjs, using a local VOICEVOX engine.
// Run the engine first (it listens only on this Mac):  ~/tools/voicevox/macos-arm64/run --host 127.0.0.1 --port 50021
// Then:  node scripts/make-audio.mjs        (only new lines are recorded; clips for removed lines are deleted)
//        node scripts/make-audio.mjs --all  (re-records every clip; bump AUDIO in sw.js so phones fetch the new ones)
// Voices (credit required, shown in Settings): n = VOICEVOX:四国めたん, f = VOICEVOX:冥鳴ひまり, m = VOICEVOX:青山龍星.
import { mkdirSync, existsSync, readdirSync, rmSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { audioTexts } from './audio-texts.mjs';
import { clipPath, normalizeLine } from '../js/clips.js';

const ENGINE = 'http://127.0.0.1:50021';
const SPEAKERS = { n: 2, f: 14, m: 13 };
const BITRATE = '32000';
const LEAD = 0.4; // seconds of silence before the voice (js/clips.js LEAD_SKIP must stay below this)
const ALL = process.argv.includes('--all'); // re-record every clip, e.g. after changing LEAD
const ROOT = new URL('../', import.meta.url).pathname;
const tmp = mkdtempSync(join(tmpdir(), 'hanasu-audio-'));

async function synth(text, speaker) {
  const q = await fetch(`${ENGINE}/audio_query?${new URLSearchParams({ text, speaker })}`, { method: 'POST' });
  if (!q.ok) throw new Error(`audio_query ${q.status} for ${text}`);
  // Lead-in silence: speakers and Bluetooth headphones that have gone idle fade in over the first few hundred ms,
  // which swallowed the first word with VOICEVOX's default 0.1 s. The app skips most of it when audio is already awake.
  const query = { ...(await q.json()), prePhonemeLength: LEAD };
  const s = await fetch(`${ENGINE}/synthesis?speaker=${speaker}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(query) });
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
  const todo = [...want].filter(([p]) => ALL || !existsSync(join(ROOT, p)));
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
console.log(`done: ${made} recorded, ${kept} already there, ${removed} removed`);
