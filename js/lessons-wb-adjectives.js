// Lessons tab page: wb-adjectives. Loaded only when opened; see js/lessons-kit.js for the helpers.
import { P, IADJ, NADJ } from './lessons-kit.js';

export default {
  id: 'wb-adjectives', title: 'Word list: adjective conjugation list', jp: '形容詞活用表',
  sections: [
    { h: 'I-adjectives', blocks: [P('Each card: non-past affirmative · negative · past affirmative · negative (add です to each). Tap to hear all four.'), IADJ(`
bright|あかるい
smart / wise|あたま が いい
new|あたらしい
hot|あつい
dangerous|あぶない
good / fine|いい
busy|いそがしい
noisy|うるさい
delicious / tasty|おいしい
big|おおきい
heavy|おもい
interesting / fun|おもしろい
good-looking / cool|かっこ いい
light / lightweight|かるい
pretty / cute|かわいい
dirty|きたない
feel good|きもち いい
dark|くらい
scary / feel fear|こわい
cold [weather]|さむい
great|すごい
wonderful|すばらしい
tall|せ が たかい
short (in height)|せ が ひくい
narrow|せまい
expensive / high|たかい
enjoyable / fun|たのしい
small|ちいさい
close / near|ちかい
boring|つまらない
cold [thing]|つめたい
strong|つよい
far|とおい
long|ながい
wide / large [space]|ひろい
old|ふるい
taste bad|まずい
short|みじかい
difficult|むずかしい
easy / kind|やさしい
cheap|やすい
weak|よわい
young|わかい`)] },
    { h: 'Na-adjectives', blocks: [P('Each card: です · じゃありません · でした · じゃありませんでした. Tap to hear all four.'), NADJ(`
safe|あんぜん
easy|かんたん
clean / beautiful|きれい
fine|げんき
quiet|しずか
skillful / good|じょうず
simple|シンプル
like / favorite|すき
hard / tough / terrible|たいへん
lively|にぎやか
free / not busy|ひま
complicated|ふくざつ
friendly|フレンドリー
unskillful / bad|へた
convenient|べんり
serious|まじめ
famous|ゆうめい
selfish|わがまま`)] },
  ],
};
