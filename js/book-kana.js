// Book tab page: kana. Loaded only when opened; see js/book-kit.js for the helpers.
import { P, LINK } from './book-kit.js';

export default {
  id: 'kana', title: 'Hiragana & katakana', jp: 'ひらがな・カタカナ',
  sections: [{
    h: 'Kana charts', blocks: [
      P('The book opens with full hiragana and katakana charts: the basic sounds, voiced sounds (が, ざ, だ, ば, ぱ) and combined sounds (きゃ, しゃ, ちゃ…). The same charts, with audio and a quiz, are in the app.'),
      LINK('#jlpt/kana', 'Open the hiragana & katakana charts'),
    ],
  }],
};
