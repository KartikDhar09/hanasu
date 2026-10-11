// Speak tab: shadowing, answering questions, self-introduction builder and pronunciation drills.
import { QA, JOBS, HOBBIES, YEARS, PRONUNCIATION, SOUND_TIPS, SLOTS, PATTERNS, buildSentence, customItem } from './speaking-data.js';
import { toRomaji } from './conjugate.js';
import { UNITS, CARDS, TRACKS, COUNTRIES } from './data.js';
import { listen } from './speech.js';
import { furigana } from './furigana.js';
import { matchScore, useReadings, PASS } from './core.js';
import { READINGS } from './kanji-readings.js';

export function initSpeaking(ctx) {
  const { esc, render, speak, shuffle, bar, back } = ctx;
  const S = () => ctx.S();
  const hg = (t, cls = 'hi') => S().settings.hindi && t ? `<div class="${cls}" lang="hi-Latn">${esc(t)}</div>` : '';
  const fillLine = l => l.map(x => ctx.fill(x));
  let st = null;

  // Japanese line block from a [jp, kana, ro, en, hg] tuple.
  const line = (l, big = false) => { const furi = S().settings.kana ? furigana(l[0], l[1], esc) : null; return `<div class="jpblock ${big ? 'big' : ''}">
    <div class="jp" lang="ja">${furi || esc(l[0])}</div>
    ${S().settings.kana && !furi && l[1] !== l[0] ? `<div class="kana" lang="ja">${esc(l[1])}</div>` : ''}
    ${S().settings.romaji ? `<div class="ro">${esc(l[2])}</div>` : ''}
  </div>`; };
  const micBtn = (act, arg = '', label = '🎤 Speak') => ctx.canListen()
    ? `<button class="btn mic big" id="mic" data-act="${act}" data-arg="${arg}">${label}</button>`
    : `<p class="muted center">This browser can’t check speech. Say it aloud and compare with 🔊.</p>`;

  // ================= Hub =================
  function hub() {
    ctx.clearSess(); st = null;
    render(`
      <h1 class="page">Speak <span lang="ja">話す</span></h1>
      <div class="intro">Speaking is a skill, like cricket: you get better by doing it out loud, every day. Use headphones, speak at normal volume, and copy the rhythm.${hg('Roz zor se bolo. Sunte raho, copy karo, phir khud bolo.', 'hi intro-hg')}</div>
      <div class="speak-grid">
        <button class="scard" data-act="shadow-random"><span>🔁</span><b>Shadow 10 phrases</b><small>Listen, repeat, get a score. A random mix from every unit.</small></button>
        <button class="scard" data-act="qa" data-arg="0"><span>💬</span><b>Answer questions</b><small>Real questions people ask you. Answer out loud.</small></button>
        <button class="scard wide" data-act="builder"><span>🧩</span><b>Sentence builder: “Can I use X?”</b><small>Pick a pattern, swap in any software, device or test resource, and practise the sentence. “Could you install X on Y?”, “Is X available for testing?”…</small></button>
        <button class="scard" data-act="intro-builder"><span>🙋</span><b>My self-introduction</b><small>Build your own jikoshoukai and practise it line by line.</small></button>
        <button class="scard" data-act="sounds"><span>👄</span><b>Pronunciation</b><small>Sounds that change meaning: おばさん vs おばあさん.</small></button>
      </div>
      <h2 class="sec">Practise a unit <small class="muted">🎤 shadow · 💬 role-play</small></h2>
      ${TRACKS.map(t => `<details class="fold" ${t.id === 'n5' ? 'open' : ''}><summary><span class="sum-title">${esc(t.title)}<small lang="ja" class="accent">${t.jp}</small></span></summary>
        <div class="ulist">${UNITS.filter(u => u.track === t.id).map(u => `<div class="urow">
          <span class="uicon">${u.icon}</span>
          <span class="vmeta">${esc(u.title)}${S().settings.hindi ? `<small class="muted" lang="hi-Latn">${esc(u.hi)}</small>` : ''}</span>
          <button class="ubtn" data-act="shadow-unit" data-arg="${u.id}" aria-label="Shadow ${esc(u.title)}">🎤</button>
          <button class="ubtn" data-act="talk" data-arg="${u.id}" aria-label="Role-play ${esc(u.title)}">💬</button>
        </div>`).join('')}</div></details>`).join('')}`);
  }

  function shadowRandom() {
    ctx.speakMode(null, 0, shuffle(CARDS).slice(0, 10), 'speak-tab');
  }

  // ================= Q&A =================
  function qa(i) {
    ctx.clearSess();
    i = +i;
    const item = QA[i];
    const q = fillLine(item.q), answers = item.a.map(fillLine);
    st = { kind: 'qa', i };
    render(`
      <div class="head">${back('speak-tab')}<div class="grow">${bar(i, QA.length)}</div><span class="muted">${i + 1}/${QA.length}</span></div>
      <div class="card">
        <div class="pic">${item.pic}</div>
        <span class="tag alt">Answer out loud</span>
        ${line(q, true)}
        <div class="en">${esc(q[3])}</div>${hg(q[4])}
        <div class="row center"><button class="btn icon" data-act="say-text" data-arg="${esc(q[0])}">🔊</button></div>
      </div>
      <div class="actions">
        ${micBtn('qa-mic', i, '🎤 Answer')}
        <div id="result" class="result center"></div>
        <details class="answers" ${ctx.canListen() ? '' : 'open'}><summary>💡 Example answers</summary>
          <ul class="phrases">${answers.map(a => `<li class="ex" data-act="say-text" data-arg="${esc(a[0])}">${line(a)}<div class="en">${esc(a[3])}</div>${hg(a[4])}</li>`).join('')}</ul>
        </details>
        <p class="muted center small">Say an example answer, or make up your own. Only the examples can be scored.</p>
        <div class="row">
          <button class="btn" data-act="qa" data-arg="${i - 1}" ${i ? '' : 'disabled'}>‹ Prev</button>
          <button class="btn" data-act="${i + 1 < QA.length ? 'qa' : 'speak-tab'}" data-arg="${i + 1}">${i + 1 < QA.length ? 'Next ›' : 'Finish'}</button>
        </div>
      </div>`);
    speak(q[0]);
  }

  async function qaMic(i) {
    const answers = QA[+i].a.map(fillLine);
    const target = { jp: answers[0][0], kana: answers[0][1], alts: answers.slice(1).map(a => [a[0], a[1]]) };
    const score = await ctx.record(target, document.getElementById('result'), document.getElementById('mic'));
    if (score == null) return;
    if (score < PASS) document.querySelector('.answers').open = true;
  }

  // ================= Self-introduction =================
  // Kept in memory only; nothing about the learner is saved.
  const intro = { job: 0, hobby: 0, years: 3, style: 'friendly', name: 'スミス', nameRo: 'Sumisu', country: 0 };
  const introState = () => intro;

  function introLines() {
    const o = introState(), c = COUNTRIES[o.country] || COUNTRIES[0];
    const p = { name: o.name, nameRo: o.nameRo, country: c[0], countryKana: c[1], countryRo: c[2], countryEn: c[3], countryHi: c[4] };
    const office = o.style === 'office';
    const job = JOBS[o.job], hob = HOBBIES[o.hobby], yr = YEARS[o.years];
    const yearsLine = o.years === 0
      ? ['日本に来て、まだ半年です。', 'にほんにきて、まだはんとしです。', 'nihon ni kite, mada hantoshi desu.', 'I’ve only been in Japan for half a year.', 'Japan aaye abhi chhe mahine hue hain.']
      : [`日本に来て${yr[1]}になります。`, `にほんにきて${yr[2]}になります。`, `nihon ni kite ${yr[3]} ni narimasu.`, `I’ve been in Japan for ${yr[0]} year${yr[0] === '1' ? '' : 's'}.`, `Japan aaye ${yr[0]} saal ho gaye.`];
    return [
      ['はじめまして。', 'はじめまして。', 'hajimemashite.', 'Nice to meet you.', 'Aapse milkar khushi hui.'],
      office ? [`${p.name}と申します。`, `${p.name}ともうします。`, `${p.nameRo} to mōshimasu.`, `My name is ${p.nameRo}.`, `Mera naam ${p.nameRo} hai.`]
        : [`${p.name}です。`, `${p.name}です。`, `${p.nameRo} desu.`, `I’m ${p.nameRo}.`, `Main ${p.nameRo} hoon.`],
      [`${p.country}から来ました。`, `${p.countryKana}からきました。`, `${p.countryRo} kara kimashita.`, `I’m from ${p.countryEn}.`, `Main ${p.countryHi} se hoon.`],
      yearsLine,
      job.slice(0, 5),
      [`趣味は${hob[0]}です。`, `しゅみは${hob[1]}です。`, `shumi wa ${hob[2]} desu.`, `My hobby is ${hob[3]}.`, `Mera shauk ${hob[4]} hai.`],
      office ? ['どうぞよろしくお願いいたします。', 'どうぞよろしくおねがいいたします。', 'dōzo yoroshiku onegai itashimasu.', 'I look forward to working with you.', 'Aap sabke saath kaam karne ka intezaar hai.']
        : ['よろしくお願いします。', 'よろしくおねがいします。', 'yoroshiku onegaishimasu.', 'Nice to meet you.', 'Milkar achha laga.'],
    ];
  }

  function introBuilder() {
    ctx.clearSess(); st = { kind: 'intro' };
    const o = introState();
    const sel = (id, opts, cur) => `<select id="${id}" data-change="intro-set">${opts.map((x, i) => `<option value="${i}" ${i === cur ? 'selected' : ''}>${x}</option>`).join('')}</select>`;
    const lines = introLines();
    render(`
      <div class="head">${back('speak-tab')}<h1>🙋 My self-introduction</h1></div>
      <p class="muted">The 自己紹介 (jikoshoukai) you’ll give at work, school and parties. Change the options and it rewrites itself. Nothing you type here is saved.</p>
      <div class="card left form">
        <label>Name (katakana) <input class="search" id="i-name" data-change="intro-set" value="${esc(o.name)}" autocomplete="off" maxlength="20"></label>
        <label>Name (romaji) <input class="search" id="i-namero" data-change="intro-set" value="${esc(o.nameRo)}" autocomplete="off" maxlength="30"></label>
        <label>Country ${sel('i-country', COUNTRIES.map(c => `${c[3]} · ${c[0]}`), o.country)}</label>
        <label>Style ${sel('i-style', ['😊 Friendly (neighbours, friends)', '👔 Office (first day, clients)'], o.style === 'office' ? 1 : 0)}</label>
        <label>Job ${sel('i-job', JOBS.map(j => `${j[5]} ${j[3]}`), o.job)}</label>
        <label>Hobby ${sel('i-hobby', HOBBIES.map(h => `${h[5]} ${h[3]}`), o.hobby)}</label>
        <label>Years in Japan ${sel('i-years', YEARS.map(y => y[0]), o.years)}</label>
      </div>
      <button class="btn primary big" data-act="intro-play">▶ Listen to the whole thing</button>
      <ol class="intro-lines">${lines.map((l, i) => `<li>
        <div class="il-main" data-act="say-text" data-arg="${esc(l[0])}">${line(l)}<div class="en">${esc(l[3])}</div>${hg(l[4])}</div>
        ${ctx.canListen() ? `<button class="btn mic small" id="mic-${i}" data-act="intro-mic" data-arg="${i}">🎤</button>` : ''}
        <div class="result" id="res-${i}"></div>
      </li>`).join('')}</ol>`);
  }

  async function introPlay() {
    const s = st;
    for (const l of introLines()) { if (st !== s) return; await speak(l[0]); await new Promise(r => setTimeout(r, 350)); }
  }

  async function introMic(i) {
    const l = introLines()[+i];
    await ctx.record({ jp: l[0], kana: l[1] }, document.getElementById('res-' + i), document.getElementById('mic-' + i));
  }

  function introSet() {
    const o = introState(), v = id => +document.getElementById(id).value;
    o.style = v('i-style') ? 'office' : 'friendly'; o.job = v('i-job'); o.hobby = v('i-hobby'); o.years = v('i-years');
    o.country = v('i-country');
    o.name = document.getElementById('i-name').value.trim().slice(0, 20) || 'スミス';
    o.nameRo = document.getElementById('i-namero').value.trim().slice(0, 30) || 'Sumisu';
    introBuilder();
  }

  // ================= Sentence builder =================
  const bs = { p: 'install', x: 'software:0', y: 'device:0', custom: '' };
  const bstate = () => bs;
  const slotOptions = groups => groups.flatMap(g => SLOTS[g].items.map((it, i) => ({ key: `${g}:${i}`, it, group: SLOTS[g].label })));
  const pick = (groups, key) => { const opts = slotOptions(groups); return (opts.find(o => o.key === key) || opts[0]); };

  function currentSentence() {
    const b = bstate(), p = PATTERNS.find(x => x.id === b.p) || PATTERNS[0];
    const x = b.custom.trim() ? customItem(b.custom, toRomaji) : pick(p.x, b.x).it;
    const y = p.y ? pick(p.y, b.y).it : null;
    return { p, line: buildSentence(p, x, y) };
  }

  function sentenceCard() {
    const { p, line } = currentSentence();
    return `${line_(line)}<div class="en">${esc(line[3])}</div>${hg(line[4])}
      ${p.tip ? `<div class="note">💡 ${esc(p.tip)}</div>` : ''}
      <div class="row center">
        <button class="btn icon" data-act="say-text" data-arg="${esc(line[0])}">🔊</button>
        <button class="btn icon" data-act="builder-slow">🐢</button>
        <button class="btn icon" data-act="builder-random" aria-label="Random example">🎲</button>
      </div>
      <div id="bresult" class="result"></div>`;
  }
  const line_ = l => line(l, true);

  function builder() {
    ctx.clearSess(); st = { kind: 'builder' };
    const b = bstate(), p = PATTERNS.find(x => x.id === b.p) || PATTERNS[0];
    const selOpts = (groups, cur) => {
      const opts = slotOptions(groups); let last = '';
      return opts.map(o => { const head = o.group !== last ? `${last ? '</optgroup>' : ''}<optgroup label="${esc(o.group)}">` : ''; last = o.group;
        return `${head}<option value="${o.key}" ${o.key === cur ? 'selected' : ''}>${esc(o.it[3])} · ${esc(o.it[0])}</option>`; }).join('') + '</optgroup>';
    };
    render(`
      <div class="head">${back('speak-tab')}<h1>🧩 Sentence builder</h1></div>
      <p class="muted">Choose a pattern, then fill in the blanks. You can also type a tool name your team uses.${S().settings.hindi ? ' Pattern chuno, blanks bharo, aur bolke practice karo.' : ''}</p>
      <div class="card left form">
        <label>Pattern <select id="b-p" data-change="builder-set">${PATTERNS.map(x => `<option value="${x.id}" ${x.id === p.id ? 'selected' : ''}>${esc(x.en.replace('{X}', 'X').replace('{Y}', 'Y'))}</option>`).join('')}</select></label>
        <label>X <select id="b-x" data-change="builder-set" ${b.custom.trim() ? 'disabled' : ''}>${selOpts(p.x, b.x)}</select></label>
        <label class="sub-label">…or type your own X <input class="search" id="b-custom" data-input="builder-custom" placeholder="e.g. Photoshop, ジラ, 新しいモニター" value="${esc(b.custom)}" autocomplete="off"></label>
        ${p.y ? `<label>Y <select id="b-y" data-change="builder-set">${selOpts(p.y, b.y)}</select></label>` : ''}
      </div>
      <div class="card" id="bcard">${sentenceCard()}</div>
      <div class="actions">${micBtn('builder-mic', '', '🎤 Say it')}</div>
      <details class="fold"><summary>📋 All ${PATTERNS.length} patterns</summary>
        <ul class="phrases">${PATTERNS.map(x => `<li class="ex" data-act="builder-pattern" data-arg="${x.id}"><div class="jp" lang="ja">${esc(x.jp.replaceAll('{X}', 'Ｘ').replaceAll('{Y}', 'Ｙ'))}</div>
          <div class="en">${esc(x.en.replace('{X}', 'X').replace('{Y}', 'Y'))}</div></li>`).join('')}</ul></details>`);
  }

  function builderSet() {
    const b = bstate(), v = id => document.getElementById(id)?.value;
    const newP = v('b-p');
    if (newP && newP !== b.p) { b.p = newP; const p = PATTERNS.find(x => x.id === newP); b.x = slotOptions(p.x)[0].key; if (p.y) b.y = slotOptions(p.y)[0].key; }
    else { if (v('b-x')) b.x = v('b-x'); if (v('b-y')) b.y = v('b-y'); }
    builder();
  }

  function builderRandom() {
    const b = bstate(), p = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
    const rnd = groups => { const o = slotOptions(groups); return o[Math.floor(Math.random() * o.length)].key; };
    b.p = p.id; b.x = rnd(p.x); if (p.y) b.y = rnd(p.y); b.custom = '';
    builder(); speak(currentSentence().line[0]);
  }

  async function builderMic() {
    const { line: l } = currentSentence();
    await ctx.record({ jp: l[0], kana: l[1] }, document.getElementById('bresult'), document.getElementById('mic'));
  }

  // ================= Pronunciation =================
  function sounds() {
    ctx.clearSess(); st = { kind: 'sounds', test: null, right: 0, tries: 0 };
    render(`
      <div class="head">${back('speak-tab')}<h1>👄 Pronunciation</h1></div>
      <div class="intro">Tap a picture to hear the word. Then press <b>🎧 Test me</b>: the app says one of the pair and you pick the picture. Press <b>🎤</b> and say one word, and the app tells you which one it heard.${hg('Picture dabao, suno. Phir test karo, aur khud bolke dekho.', 'hi intro-hg')}</div>
      <div id="score" class="muted center"></div>
      ${PRONUNCIATION.map((g, gi) => `
        <h2 class="sec">${esc(g.title)}${S().settings.hindi ? ` <small class="muted" lang="hi-Latn">${esc(g.hg)}</small>` : ''}</h2>
        <p class="muted small">${esc(g.tip)}</p>
        ${g.pairs.map((pair, pi) => `<div class="pair" id="pair-${gi}-${pi}">
          ${pair.map((w, wi) => `<button class="ptile" data-act="sound-tap" data-arg="${gi}.${pi}.${wi}">
            <span class="pic">${w[4]}</span><b lang="ja">${w[0]}</b><small>${esc(w[1])} · ${esc(w[2])}${S().settings.hindi ? ` · ${esc(w[3])}` : ''}</small></button>`).join('')}
          <div class="pair-actions">
            <button class="btn small" data-act="sound-test" data-arg="${gi}.${pi}">🎧 Test me</button>
            ${ctx.canListen() ? `<button class="btn small mic" id="smic-${gi}-${pi}" data-act="sound-mic" data-arg="${gi}.${pi}">🎤</button>` : ''}
          </div>
          <div class="result" id="sres-${gi}-${pi}"></div>
        </div>`).join('')}`).join('')}
      <h2 class="sec">Rhythm tips</h2>
      <ul class="phrases">${SOUND_TIPS.map(t => `<li><b lang="ja">${t[0]}</b><div>${esc(t[1])}</div>${hg(t[2])}</li>`).join('')}</ul>`);
  }

  const pairOf = key => { const [gi, pi] = key.split('.').map(Number); return { gi, pi, pair: PRONUNCIATION[gi].pairs[pi] }; };

  function soundTap(arg) {
    const [gi, pi, wi] = arg.split('.').map(Number);
    const w = PRONUNCIATION[gi].pairs[pi][wi];
    const t = st?.test;
    if (t && t.gi === gi && t.pi === pi) {
      const ok = wi === t.wi;
      st.tries++; if (ok) st.right++;
      const res = document.getElementById(`sres-${gi}-${pi}`);
      res.innerHTML = ok ? `<div class="score ok">✓ Right: ${esc(w[0])} (${esc(w[2])})</div>`
        : `<div class="score retry">✗ It was ${esc(PRONUNCIATION[gi].pairs[pi][t.wi][0])}. Listen again.</div>`;
      document.getElementById('score').textContent = `Listening score: ${st.right}/${st.tries}`;
      st.test = null;
      document.querySelectorAll('.pair.testing').forEach(el => el.classList.remove('testing'));
      if (!ok) speak(PRONUNCIATION[gi].pairs[pi][t.wi][0], true);
      return;
    }
    speak(w[0]);
  }

  function soundTest(key) {
    const { gi, pi, pair } = pairOf(key);
    const wi = Math.floor(Math.random() * 2);
    st.test = { gi, pi, wi };
    document.querySelectorAll('.pair.testing').forEach(el => el.classList.remove('testing'));
    document.getElementById(`pair-${gi}-${pi}`).classList.add('testing');
    document.getElementById(`sres-${gi}-${pi}`).innerHTML = '<span class="muted">Which one did you hear? Tap the picture.</span>';
    speak(pair[wi][0]);
  }

  async function soundMic(key) {
    const { gi, pi, pair } = pairOf(key);
    const res = document.getElementById(`sres-${gi}-${pi}`), mic = document.getElementById(`smic-${gi}-${pi}`);
    mic.classList.add('on'); mic.textContent = '●';
    try {
      const heard = await listen();
      if (!heard.length) { res.innerHTML = '<span class="muted">Didn’t catch that. Try again.</span>'; return; }
      useReadings(READINGS);
      const scores = pair.map(w => matchScore(heard, w[0], w[0]));
      const best = scores[0] >= scores[1] ? 0 : 1;
      res.innerHTML = scores[best] >= 0.6
        ? `<div class="score ok">I heard <b lang="ja">${esc(pair[best][0])}</b> ${pair[best][4]} (${esc(pair[best][2])})</div>`
        : `<div class="score retry">I heard “${esc(heard[0])}”. Try again, slowly.</div>`;
    } catch (e) {
      res.innerHTML = `<span class="muted">Couldn’t listen (${esc(e.message)}).</span>`;
    } finally { mic.classList.remove('on'); mic.textContent = '🎤'; }
  }

  const actions = {
    'speak-tab': () => ctx.go('speak'),
    'shadow-random': () => shadowRandom(),
    'shadow-unit': id => ctx.speakMode(id, 0, null, 'speak-tab'),
    qa: i => qa(i),
    'qa-mic': i => qaMic(i),
    'intro-builder': () => ctx.go('speak/intro'),
    'intro-play': () => introPlay(),
    'intro-mic': i => introMic(i),
    'intro-set': () => introSet(),
    sounds: () => ctx.go('speak/sounds'),
    builder: () => ctx.go('speak/builder'),
    'builder-set': () => builderSet(),
    'builder-custom': (_, v) => { bstate().custom = v; document.getElementById('b-x').disabled = !!v.trim(); document.getElementById('bcard').innerHTML = sentenceCard(); },
    'builder-slow': () => ctx.speakSlow(currentSentence().line[0]),
    'builder-random': () => builderRandom(),
    'builder-mic': () => builderMic(),
    'builder-pattern': id => { const b = bstate(), p = PATTERNS.find(x => x.id === id); b.p = id; b.x = slotOptions(p.x)[0].key; if (p.y) b.y = slotOptions(p.y)[0].key; b.custom = ''; builder(); window.scrollTo(0, 0); speak(currentSentence().line[0]); },
    'sound-tap': a => soundTap(a),
    'sound-test': k => soundTest(k),
    'sound-mic': k => soundMic(k),
  };

  function route(h) {
    if (h === 'speak') return hub(), true;
    if (h === 'speak/intro') return introBuilder(), true;
    if (h === 'speak/sounds') return sounds(), true;
    if (h === 'speak/builder') return builder(), true;
    return false;
  }

  function rerender() {
    if (!st) return false;
    if (st.kind === 'qa') qa(st.i); else if (st.kind === 'intro') introBuilder(); else if (st.kind === 'builder') builder(); else sounds();
    return true;
  }

  return { actions, route, rerender, clear() { st = null; } };
}
