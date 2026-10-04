// Speak tab: shadowing, answering questions, self-introduction builder and pronunciation drills.
import { QA, JOBS, HOBBIES, YEARS, PRONUNCIATION, SOUND_TIPS } from './speaking-data.js';
import { UNITS, CARDS } from './data.js';
import { listen } from './speech.js';
import { matchScore, PASS, isLearned } from './core.js';

export function initSpeaking(ctx) {
  const { esc, render, speak, shuffle, bar, back, practised, save } = ctx;
  const S = () => ctx.S();
  const hg = (t, cls = 'hi') => S().settings.hindi && t ? `<div class="${cls}" lang="hi-Latn">${esc(t)}</div>` : '';
  const fillLine = l => l.map(x => ctx.fill(x));
  let st = null;

  // Japanese line block from a [jp, kana, ro, en, hg] tuple.
  const line = (l, big = false) => `<div class="jpblock ${big ? 'big' : ''}">
    <div class="jp" lang="ja">${esc(l[0])}</div>
    ${S().settings.kana && l[1] !== l[0] ? `<div class="kana" lang="ja">${esc(l[1])}</div>` : ''}
    ${S().settings.romaji ? `<div class="ro">${esc(l[2])}</div>` : ''}
  </div>`;
  const micBtn = (act, arg = '', label = '🎤 Speak') => ctx.canListen()
    ? `<button class="btn mic big" id="mic" data-act="${act}" data-arg="${arg}">${label}</button>`
    : `<p class="muted center">This browser can’t check speech. Say it aloud and compare with 🔊.</p>`;

  // ================= Hub =================
  function hub() {
    ctx.clearSess(); st = null;
    const spoken = Object.keys(S().spoken || {}).length;
    render(`
      <h1 class="page">Speak <span lang="ja">話す</span></h1>
      <div class="intro">Speaking is a skill, like cricket: you get better by doing it out loud, every day. Use headphones, speak at normal volume, and copy the rhythm.${hg('Roz zor se bolo. Sunte raho, copy karo, phir khud bolo.', 'hi intro-hg')}</div>
      <div class="stats small-stats"><div><b>${spoken}</b><span>phrases spoken</span></div><div><b>${S().qaDone || 0}</b><span>questions answered</span></div></div>
      <div class="speak-grid">
        <button class="scard" data-act="shadow-random"><span>🔁</span><b>Shadow 10 phrases</b><small>Listen, repeat, get a score. Mixes phrases you know with new ones.</small></button>
        <button class="scard" data-act="qa" data-arg="0"><span>💬</span><b>Answer questions</b><small>Real questions people ask you. Answer out loud.</small></button>
        <button class="scard" data-act="intro-builder"><span>🙋</span><b>My self-introduction</b><small>Build your own jikoshoukai and practise it line by line.</small></button>
        <button class="scard" data-act="sounds"><span>👄</span><b>Pronunciation</b><small>Sounds that change meaning: おばさん vs おばあさん.</small></button>
      </div>
      <h3>Shadow a unit</h3>
      <div class="vlist">${UNITS.map(u => `<button class="vrow" data-act="shadow-unit" data-arg="${u.id}">
        <span class="vjp">${u.icon}</span><span class="vmeta">${esc(u.title)}${S().settings.hindi ? ` · <span class="muted" lang="hi-Latn">${esc(u.hi)}</span>` : ''}</span><span>🎤</span></button>`).join('')}</div>
      <h3>Role-play a conversation</h3>
      <div class="vlist">${UNITS.map(u => `<button class="vrow" data-act="talk" data-arg="${u.id}">
        <span class="vjp">${u.icon}</span><span class="vmeta">${esc(u.title)}</span><span>💬</span></button>`).join('')}</div>`);
  }

  function shadowRandom() {
    const known = shuffle(CARDS.filter(c => isLearned(S().progress[c.id])));
    const rest = shuffle(CARDS.filter(c => !isLearned(S().progress[c.id])));
    ctx.speakMode(null, 0, [...known.slice(0, 6), ...rest].slice(0, 10), 'speak-tab');
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
    S().qaDone = (S().qaDone || 0) + (st?.counted ? 0 : 1);
    if (st) st.counted = true;
    practised();
  }

  // ================= Self-introduction =================
  const introState = () => (S().intro = S().intro || { job: 0, hobby: 0, years: 3, style: 'friendly' });

  function introLines() {
    const o = introState(), p = ctx.profile();
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
      <p class="muted">The 自己紹介 (jikoshoukai) you’ll give at work, school and parties. Change the options and it rewrites itself. Name and country come from Settings ⚙︎.</p>
      <div class="card left form">
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
    const score = await ctx.record({ jp: l[0], kana: l[1] }, document.getElementById('res-' + i), document.getElementById('mic-' + i));
    if (score != null) practised();
  }

  function introSet() {
    const o = introState(), v = id => +document.getElementById(id).value;
    o.style = v('i-style') ? 'office' : 'friendly'; o.job = v('i-job'); o.hobby = v('i-hobby'); o.years = v('i-years');
    save(); introBuilder();
  }

  // ================= Pronunciation =================
  function sounds() {
    ctx.clearSess(); st = { kind: 'sounds', test: null, right: 0, tries: 0 };
    render(`
      <div class="head">${back('speak-tab')}<h1>👄 Pronunciation</h1></div>
      <div class="intro">Tap a picture to hear the word. Then press <b>🎧 Test me</b>: the app says one of the pair and you pick the picture. Press <b>🎤</b> and say one word, and the app tells you which one it heard.${hg('Picture dabao, suno. Phir test karo, aur khud bolke dekho.', 'hi intro-hg')}</div>
      <div id="score" class="muted center"></div>
      ${PRONUNCIATION.map((g, gi) => `
        <h3>${esc(g.title)}${S().settings.hindi ? ` <small class="muted" lang="hi-Latn">${esc(g.hg)}</small>` : ''}</h3>
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
      <h3>Rhythm tips</h3>
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
      practised();
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
      const scores = pair.map(w => matchScore(heard, w[0], w[0]));
      const best = scores[0] >= scores[1] ? 0 : 1;
      res.innerHTML = scores[best] >= 0.6
        ? `<div class="score ok">I heard <b lang="ja">${esc(pair[best][0])}</b> ${pair[best][4]} (${esc(pair[best][2])})</div>`
        : `<div class="score retry">I heard “${esc(heard[0])}”. Try again, slowly.</div>`;
      practised();
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
    'sound-tap': a => soundTap(a),
    'sound-test': k => soundTest(k),
    'sound-mic': k => soundMic(k),
  };

  function route(h) {
    if (h === 'speak') return hub(), true;
    if (h === 'speak/intro') return introBuilder(), true;
    if (h === 'speak/sounds') return sounds(), true;
    return false;
  }

  function rerender() {
    if (!st) return false;
    if (st.kind === 'qa') qa(st.i); else if (st.kind === 'intro') introBuilder(); else sounds();
    return true;
  }

  return { actions, route, rerender, clear() { st = null; } };
}
