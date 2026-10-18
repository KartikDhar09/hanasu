// Kana tables shared by the JLPT kana charts, the paths and the stroke-order screen.
// Gojūon chart; ・ is an empty cell.
export const KANA_ROWS = ['あいうえお', 'かきくけこ', 'さしすせそ', 'たちつてと', 'なにぬねの', 'はひふへほ', 'まみむめも', 'や・ゆ・よ', 'らりるれろ', 'わ・・・を', 'ん・・・・'];
export const DAKUTEN_ROWS = ['がぎぐげご', 'ざじずぜぞ', 'だぢづでど', 'ばびぶべぼ', 'ぱぴぷぺぽ'];
export const COMBO_ROWS = ['きゃきゅきょ', 'しゃしゅしょ', 'ちゃちゅちょ', 'にゃにゅにょ', 'ひゃひゅひょ', 'みゃみゅみょ', 'りゃりゅりょ', 'ぎゃぎゅぎょ', 'じゃじゅじょ', 'びゃびゅびょ', 'ぴゃぴゅぴょ'];
export const toKata = s => s.replace(/[ぁ-ゖ]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60));
export const combos = row => row.match(/.[ゃゅょ]/g);
export const ALL_KANA = [...KANA_ROWS, ...DAKUTEN_ROWS].join('').replace(/・/g, '').split('').concat(COMBO_ROWS.flatMap(combos));
// The 46 basic hiragana and katakana, in chart order (stroke order is shown for these).
export const BASIC_HIRA = KANA_ROWS.join('').replace(/・/g, '').split('');
export const BASIC_KATA = BASIC_HIRA.map(toKata);
