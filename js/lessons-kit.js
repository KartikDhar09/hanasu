// Lessons tab building blocks: speech text, voices, picture maps and the helpers every page file (js/lessons-*.js) uses.
// The pages are third-party material kept as a personal study copy; see NOTICE.md.
//
// Word or phrase: [japanese, romaji, english, spoken?]   (spoken = what the voice reads, when the written form doesn't read well)
// Conversation line: [speaker, japanese, romaji, english]
// In the Japanese, 〈 〉 marks a word to swap, (1) marks a slot in a dialogue, ＿＿ is a blank (not spoken).

import { toRomaji } from './conjugate.js';

// Speakers' voices: m = man, f = woman (anyone else uses the main voice).
export const VOICE = {
  ジョン: 'm', クマール: 'm', 佐藤: 'm', 男の人: 'm', 警察官: 'm', 駅員: 'm', 運転手: 'm', 管理人: 'm', 係員: 'm', M: 'm',
  田中: 'f', 鈴木: 'f', カレン: 'f', 女の人: 'f', 店員: 'f', 受付: 'f', F: 'f',
};
export const voiceOf = who => VOICE[who] || 'n';

// What the voice reads for a written line: swap marks, slot numbers and footnote stars go; alternatives become a pause.
// Lines with a blank to fill (＿＿, 〈　〉) aren't read at all.
export function spoken(jp) {
  if (!jp || /＿|〈\s*〉|〈　〉/.test(jp)) return null;
  const s = jp
    .replace(/\(\d\)|[①②③④⑤⑥⑦⑧⑨]/g, '')
    .replace(/[〈〉<>()（）*＊〜～]/g, '')
    .replace(/\s*[／/]\s*/g, '、')
    .replace(/。、/g, '。').replace(/^、|、$/g, '')
    .trim();
  return /[ぁ-ゖァ-ヺ一-龯々]/.test(s) ? s : null;
}
export const sayOf = w => w[3] || spoken(w[0]);


// Pictures cut from the source PDF (img/lessons/, loaded lazily). Food photos by the word they show; colours as swatches.
export const FOOD_PIC = {
  すき焼き: 'sukiyaki', しゃぶしゃぶ: 'shabushabu', 焼肉: 'yakiniku', 焼き鳥: 'yakitori', 刺身: 'sashimi', 天ぷら: 'tempura', から揚げ: 'karaage',
  しょうが焼き: 'shogayaki', 鶏の照り焼き: 'teriyaki', 肉じゃが: 'nikujaga', おでん: 'oden', 親子丼: 'oyakodon', 牛丼: 'gyudon', かつ丼: 'katsudon',
  天丼: 'tendon', にぎりずし: 'nigirizushi', ちらしずし: 'chirashizushi', いなりずし: 'inarizushi', のり巻き: 'norimaki', きつねうどん: 'kitsuneudon',
  たぬきうどん: 'tanukiudon', 天ぷらそば: 'tempurasoba', ざるそば: 'zarusoba', しょうゆラーメン: 'shoyuramen', 塩ラーメン: 'shioramen', 味噌ラーメン: 'misoramen',
  とんこつラーメン: 'tonkotsuramen', 焼きそば: 'yakisoba', お好み焼き: 'okonomiyaki', もんじゃ焼き: 'monjayaki', たこ焼き: 'takoyaki', 冷奴: 'hiyayakko',
  揚げ出し豆腐: 'agedashidofu', 枝豆: 'edamame', 卵焼き: 'tamagoyaki', おにぎり: 'onigiri', お茶漬け: 'ochazuke', 味噌汁: 'misoshiru', とん汁: 'tonjiru',
  コロッケ: 'korokke', えびフライ: 'ebifurai', トンカツ: 'tonkatsu', ハンバーグ: 'hambagu', カレーライス: 'kareraisu', カツカレー: 'katsukare', オムライス: 'omuraisu',
  ミートソース: 'mitososu', チャーハン: 'chahan', 餃子: 'gyoza', 春巻き: 'harumaki', シュウマイ: 'shumai', ショートケーキ: 'shotokeki', シュークリーム: 'shukurimu',
  梅干: 'umeboshi', たくあん: 'takuan', ふくじんづけ: 'fukujinzuke', らっきょう: 'rakkyo', キムチ: 'kimuchi', のり: 'nori', 青のり: 'aonori', かつおぶし: 'katsuobushi',
  紅しょうが: 'benishoga', ごま: 'goma', ねぎ: 'negi', 大根おろし: 'daikonoroshi', '七味(とうがらし)': 'shichimi', わさび: 'wasabi', からし: 'karashi', 納豆: 'natto',
  豆腐: 'tofu', 油揚げ: 'aburaage', かまぼこ: 'kamaboko', こんにゃく: 'konnyaku', わかめ: 'wakame', こんぶ: 'kombu', たらこ: 'tarako', 明太子: 'mentaiko',
};
export const COLOR = {
  '赤(い)*': '#D7262E', '青(い)*': '#1E73BE', '黄色(い)*': '#F5E11B', '黒(い)*': '#1A1A1A', '白(い)*': '#FFFFFF', 緑: '#149A3C', オレンジ: '#F0901E',
  ピンク: '#F29CC0', 黄緑: '#9CCB3B', 紺: '#232A6E', 水色: '#8CCDF0', 紫: '#7B2C8C', '茶色／ブラウン': '#7A4A2A', '灰色／グレー': '#B8B8B8',
};

// ---- Block helpers (keep the content below readable) ----
export const K = (jp, ro, en) => ({ t: 'key', jp, ro, en });             // the unit's target phrase
export const H = text => ({ t: 'h', text });                             // small heading (Practice A, MEMO…)
export const P = text => ({ t: 'p', text });                             // instruction or paragraph
export const N = text => ({ t: 'note', text });                          // the original's NOTE / footnotes
export const TIP = text => ({ t: 'tip', text });                         // Hanasu's own note (not from the original)
export const W = (...items) => ({ t: 'words', items });                  // word cards
export const L = (...items) => ({ t: 'lines', items });                  // phrase list (MEMO, useful expressions)
export const T = (...lines) => ({ t: 'talk', lines });                   // conversation
export const SUBS = (...sets) => ({ t: 'subs', sets });                  // dialogue substitutions: [[slot, jp, ro], …] per set
export const LISTEN = (q, setting, options, answer, script) => ({ t: 'listen', q, setting, options, answer, script });
export const ROLE = (title, a, b) => ({ t: 'role', title, a, b });
export const CHECK = (...items) => ({ t: 'check', items });
export const LIST = (...items) => ({ t: 'list', items });
export const TABLE = (head, rows) => ({ t: 'table', head, rows });
export const LINK = (href, text) => ({ t: 'link', href, text });
export const WP = (...items) => ({ t: 'words', items, pics: true });       // word cards with the original's photo / colour
export const IMG = (file, alt) => ({ t: 'img', file, alt });              // one picture from the original (map, menu)
export const SCENES = (unit, ...items) => ({ t: 'scenes', unit, items });  // "Do you remember?" pictures with their situation


// Word list helpers: one word per line, fields separated by |.
const lines = text => text.trim().split('\n').map(l => l.split('|'));
// Kana with spaces between words: the Japanese drops the spaces, the romaji keeps them (たばこ を すいます → tabako o suimasu).
const jpOf = k => k.replace(/ /g, '');
const roOf = k => k.split(' ').map(x => toRomaji(x)).join(' ');
const card = (forms, en) => [forms.map(jpOf).join('・'), forms.map(roOf).join(' · '), en, forms.map(jpOf).join('、')];
// WL: english|japanese|romaji[|spoken] → word cards
export const WL = text => W(...lines(text).map(([en, jp, ro, say]) => say ? [jp, ro, en, say] : [jp, ro, en]));
// VERBS: meaning|masu|dictionary|te|ta|nai → one card per verb, all five forms spoken
export const VERBS = text => W(...lines(text).map(([en, ...f]) => card(f, en)));
// I-adjectives: meaning|dictionary form → non-past, negative, past, past negative (いい-endings conjugate from よい)
const iForms = a => { const s = a.endsWith('いい') ? a.slice(0, -2) + 'よ' : a.slice(0, -1); return [a, s + 'くない', s + 'かった', s + 'くなかった']; };
export const IADJ = text => W(...lines(text).map(([en, a]) => card(iForms(a), en)));
export const NADJ = text => W(...lines(text).map(([en, a]) => card(['です', 'じゃ ありません', 'でした', 'じゃ ありません でした'].map(e => `${a} ${e}`), en)));
