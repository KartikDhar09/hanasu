// JLPT vocabulary by topic. Word: [japanese, kana, romaji, english, hinglish, picture].
// The full lists live in vocab-n5.js / vocab-n4.js in a compact one-line format and are merged in below.
import { toRomaji } from './conjugate.js';
import { N5_TOPICS } from './vocab-n5.js';
import { N4_TOPICS } from './vocab-n4.js';
import { LIFE_TOPICS } from './vocab-life.js';

export const VOCAB = [
  // ================= N5 =================
  { id: 'n5-food', level: 'n5', title: 'Food & drink', hg: 'Khaana-peena', icon: '🍙', words: [
    ['水', 'みず', 'mizu', 'water', 'paani', '💧'], ['お茶', 'おちゃ', 'o-cha', 'tea (green)', 'chai (green tea)', '🍵'],
    ['牛乳', 'ぎゅうにゅう', 'gyūnyū', 'milk', 'doodh', '🥛'], ['肉', 'にく', 'niku', 'meat', 'meat / gosht', '🥩'],
    ['魚', 'さかな', 'sakana', 'fish', 'machhli', '🐟'], ['野菜', 'やさい', 'yasai', 'vegetables', 'sabzi', '🥦'],
    ['果物', 'くだもの', 'kudamono', 'fruit', 'phal', '🍎'], ['卵', 'たまご', 'tamago', 'egg', 'anda', '🥚'],
    ['ご飯', 'ごはん', 'gohan', 'rice / meal', 'chawal / khaana', '🍚'], ['パン', 'パン', 'pan', 'bread', 'bread', '🍞'],
    ['朝ご飯', 'あさごはん', 'asagohan', 'breakfast', 'naashta', '🍳'], ['晩ご飯', 'ばんごはん', 'bangohan', 'dinner', 'raat ka khaana', '🍛'],
    ['お菓子', 'おかし', 'o-kashi', 'sweets / snacks', 'mithai / snacks', '🍬'], ['お弁当', 'おべんとう', 'o-bentō', 'boxed lunch', 'tiffin', '🍱'],
    ['おいしい', 'おいしい', 'oishii', 'tasty', 'swaadisht', '😋'], ['辛い', 'からい', 'karai', 'spicy', 'teekha', '🌶️'],
    ['甘い', 'あまい', 'amai', 'sweet', 'meetha', '🍯'],
  ] },
  { id: 'n5-people', level: 'n5', title: 'People & family', hg: 'Log aur parivaar', icon: '👨‍👩‍👧', words: [
    ['家族', 'かぞく', 'kazoku', 'family', 'parivaar', '👨‍👩‍👧'], ['父', 'ちち', 'chichi', 'my father', 'mere papa', '👨'],
    ['母', 'はは', 'haha', 'my mother', 'meri maa', '👩'], ['兄', 'あに', 'ani', 'my older brother', 'bade bhaiya', '👦'],
    ['姉', 'あね', 'ane', 'my older sister', 'badi didi', '👧'], ['弟', 'おとうと', 'otōto', 'younger brother', 'chhota bhai', '🧒'],
    ['妹', 'いもうと', 'imōto', 'younger sister', 'chhoti behen', '👧'], ['子ども', 'こども', 'kodomo', 'child', 'bachcha', '🧒'],
    ['友達', 'ともだち', 'tomodachi', 'friend', 'dost', '🤝'], ['先生', 'せんせい', 'sensei', 'teacher / doctor', 'teacher / doctor', '🧑‍🏫'],
    ['学生', 'がくせい', 'gakusei', 'student', 'student', '🎓'], ['医者', 'いしゃ', 'isha', 'doctor', 'doctor', '🩺'],
    ['大人', 'おとな', 'otona', 'adult', 'bada / adult', '🧑'], ['皆さん', 'みなさん', 'minasan', 'everyone', 'aap sab', '👥'],
  ] },
  { id: 'n5-places', level: 'n5', title: 'Places', hg: 'Jagah', icon: '🏙️', words: [
    ['家', 'いえ', 'ie', 'house / home', 'ghar', '🏠'], ['会社', 'かいしゃ', 'kaisha', 'company', 'company', '🏢'],
    ['学校', 'がっこう', 'gakkō', 'school', 'school', '🏫'], ['病院', 'びょういん', 'byōin', 'hospital', 'hospital', '🏥'],
    ['銀行', 'ぎんこう', 'ginkō', 'bank', 'bank', '🏦'], ['駅', 'えき', 'eki', 'station', 'station', '🚉'],
    ['郵便局', 'ゆうびんきょく', 'yūbinkyoku', 'post office', 'daakghar', '🏤'], ['公園', 'こうえん', 'kōen', 'park', 'park', '🌳'],
    ['店', 'みせ', 'mise', 'shop', 'dukaan', '🏪'], ['図書館', 'としょかん', 'toshokan', 'library', 'library', '📚'],
    ['部屋', 'へや', 'heya', 'room', 'kamra', '🚪'], ['トイレ', 'トイレ', 'toire', 'toilet', 'toilet', '🚻'],
    ['空港', 'くうこう', 'kūkō', 'airport', 'airport', '🛫'], ['レストラン', 'レストラン', 'resutoran', 'restaurant', 'restaurant', '🍽️'],
  ] },
  { id: 'n5-things', level: 'n5', title: 'Things around you', hg: 'Aas-paas ki cheezein', icon: '🎒', words: [
    ['本', 'ほん', 'hon', 'book', 'kitaab', '📕'], ['かばん', 'かばん', 'kaban', 'bag', 'bag / thaila', '👜'],
    ['傘', 'かさ', 'kasa', 'umbrella', 'chhata', '☂️'], ['時計', 'とけい', 'tokei', 'clock / watch', 'ghadi', '⌚'],
    ['電話', 'でんわ', 'denwa', 'telephone', 'phone', '☎️'], ['財布', 'さいふ', 'saifu', 'wallet', 'batua', '👛'],
    ['鍵', 'かぎ', 'kagi', 'key', 'chaabi', '🔑'], ['机', 'つくえ', 'tsukue', 'desk', 'mez', '🗄️'],
    ['椅子', 'いす', 'isu', 'chair', 'kursi', '🪑'], ['窓', 'まど', 'mado', 'window', 'khidki', '🪟'],
    ['靴', 'くつ', 'kutsu', 'shoes', 'joote', '👟'], ['服', 'ふく', 'fuku', 'clothes', 'kapde', '👕'],
    ['写真', 'しゃしん', 'shashin', 'photo', 'photo', '📷'], ['お金', 'おかね', 'o-kane', 'money', 'paisa', '💴'],
  ] },
  { id: 'n5-transport', level: 'n5', title: 'Getting around', hg: 'Aana-jaana', icon: '🚃', words: [
    ['電車', 'でんしゃ', 'densha', 'train', 'train', '🚃'], ['バス', 'バス', 'basu', 'bus', 'bus', '🚌'],
    ['車', 'くるま', 'kuruma', 'car', 'gaadi', '🚗'], ['自転車', 'じてんしゃ', 'jitensha', 'bicycle', 'cycle', '🚲'],
    ['飛行機', 'ひこうき', 'hikōki', 'aeroplane', 'hawai jahaz', '✈️'], ['タクシー', 'タクシー', 'takushī', 'taxi', 'taxi', '🚕'],
    ['道', 'みち', 'michi', 'road / way', 'raasta', '🛣️'], ['切符', 'きっぷ', 'kippu', 'ticket', 'ticket', '🎫'],
    ['右', 'みぎ', 'migi', 'right', 'daayein', '👉'], ['左', 'ひだり', 'hidari', 'left', 'baayein', '👈'],
    ['近い', 'ちかい', 'chikai', 'near', 'paas', '📍'], ['遠い', 'とおい', 'tōi', 'far', 'door', '🗺️'],
  ] },
  { id: 'n5-time', level: 'n5', title: 'Time & weather', hg: 'Samay aur mausam', icon: '⛅', words: [
    ['今日', 'きょう', 'kyō', 'today', 'aaj', '📅'], ['明日', 'あした', 'ashita', 'tomorrow', 'kal (aane wala)', '➡️'],
    ['昨日', 'きのう', 'kinō', 'yesterday', 'kal (beeta hua)', '⬅️'], ['朝', 'あさ', 'asa', 'morning', 'subah', '🌅'],
    ['昼', 'ひる', 'hiru', 'noon / daytime', 'dopahar', '☀️'], ['夜', 'よる', 'yoru', 'night', 'raat', '🌙'],
    ['今週', 'こんしゅう', 'konshū', 'this week', 'is hafte', '🗓️'], ['毎日', 'まいにち', 'mainichi', 'every day', 'roz', '🔁'],
    ['天気', 'てんき', 'tenki', 'weather', 'mausam', '🌤️'], ['雨', 'あめ', 'ame', 'rain', 'baarish', '🌧️'],
    ['雪', 'ゆき', 'yuki', 'snow', 'barf', '❄️'], ['暑い', 'あつい', 'atsui', 'hot (weather)', 'garmi', '🥵'],
    ['寒い', 'さむい', 'samui', 'cold (weather)', 'thand', '🥶'], ['春', 'はる', 'haru', 'spring', 'basant', '🌸'],
    ['夏', 'なつ', 'natsu', 'summer', 'garmi ka mausam', '🌻'], ['冬', 'ふゆ', 'fuyu', 'winter', 'sardi', '⛄'],
  ] },
  { id: 'n5-adj', level: 'n5', title: 'Describing words', hg: 'Visheshan', icon: '✨', words: [
    ['大きい', 'おおきい', 'ōkii', 'big', 'bada', '🐘'], ['小さい', 'ちいさい', 'chiisai', 'small', 'chhota', '🐭'],
    ['高い', 'たかい', 'takai', 'expensive / tall', 'mehenga / ooncha', '💰'], ['安い', 'やすい', 'yasui', 'cheap', 'sasta', '🏷️'],
    ['新しい', 'あたらしい', 'atarashii', 'new', 'naya', '🆕'], ['古い', 'ふるい', 'furui', 'old (things)', 'puraana', '🏚️'],
    ['いい', 'いい', 'ii', 'good', 'achha', '👍'], ['悪い', 'わるい', 'warui', 'bad', 'bura', '👎'],
    ['忙しい', 'いそがしい', 'isogashii', 'busy', 'busy', '🏃'], ['楽しい', 'たのしい', 'tanoshii', 'fun', 'mazedaar', '🎉'],
    ['難しい', 'むずかしい', 'muzukashii', 'difficult', 'mushkil', '🧩'], ['易しい', 'やさしい', 'yasashii', 'easy', 'aasaan', '✅'],
    ['元気', 'げんき', 'genki', 'well / lively', 'theek / fit', '💪'], ['静か', 'しずか', 'shizuka', 'quiet', 'shaant', '🤫'],
    ['有名', 'ゆうめい', 'yūmei', 'famous', 'mashhoor', '🌟'], ['きれい', 'きれい', 'kirei', 'pretty / clean', 'sundar / saaf', '💐'],
  ] },
  // ================= N4 =================
  { id: 'n4-work', level: 'n4', title: 'Work & office', hg: 'Kaam aur office', icon: '💼', words: [
    ['会議', 'かいぎ', 'kaigi', 'meeting', 'meeting', '🗣️'], ['資料', 'しりょう', 'shiryō', 'documents / materials', 'documents', '📄'],
    ['仕事', 'しごと', 'shigoto', 'work / job', 'kaam / naukri', '🛠️'], ['給料', 'きゅうりょう', 'kyūryō', 'salary', 'tankhwaah', '💴'],
    ['残業', 'ざんぎょう', 'zangyō', 'overtime', 'overtime', '🌃'], ['出張', 'しゅっちょう', 'shutchō', 'business trip', 'official tour', '🧳'],
    ['予定', 'よてい', 'yotei', 'plan / schedule', 'plan', '📆'], ['連絡', 'れんらく', 'renraku', 'contact / message', 'sampark / khabar', '📨'],
    ['説明', 'せつめい', 'setsumei', 'explanation', 'samjhaana', '🧑‍🏫'], ['経験', 'けいけん', 'keiken', 'experience', 'anubhav', '🎖️'],
    ['工場', 'こうじょう', 'kōjō', 'factory', 'factory', '🏭'], ['社長', 'しゃちょう', 'shachō', 'company president', 'company ke maalik', '🤵'],
    ['部長', 'ぶちょう', 'buchō', 'department manager', 'department head', '👔'], ['課長', 'かちょう', 'kachō', 'section manager', 'manager', '🧑‍💼'],
  ] },
  { id: 'n4-life', level: 'n4', title: 'Daily life', hg: 'Roz ki zindagi', icon: '🏠', words: [
    ['引っ越し', 'ひっこし', 'hikkoshi', 'moving house', 'ghar badalna', '📦'], ['家賃', 'やちん', 'yachin', 'rent', 'kiraaya', '🏘️'],
    ['ごみ', 'ごみ', 'gomi', 'rubbish', 'kachra', '🗑️'], ['洗濯', 'せんたく', 'sentaku', 'laundry', 'kapde dhona', '🧺'],
    ['掃除', 'そうじ', 'sōji', 'cleaning', 'safaai', '🧹'], ['料理', 'りょうり', 'ryōri', 'cooking / dish', 'khaana banana', '🍳'],
    ['買い物', 'かいもの', 'kaimono', 'shopping', 'shopping', '🛍️'], ['近所', 'きんじょ', 'kinjo', 'neighbourhood', 'padosi ilaaka', '🏡'],
    ['予約', 'よやく', 'yoyaku', 'reservation', 'booking', '📝'], ['趣味', 'しゅみ', 'shumi', 'hobby', 'shauk', '🎨'],
    ['旅行', 'りょこう', 'ryokō', 'travel / trip', 'safar / trip', '✈️'], ['お祭り', 'おまつり', 'o-matsuri', 'festival', 'tyohaar / mela', '🏮'],
  ] },
  { id: 'n4-health', level: 'n4', title: 'Health & body', hg: 'Sehat aur sharir', icon: '🩺', words: [
    ['体', 'からだ', 'karada', 'body', 'sharir', '🧍'], ['頭', 'あたま', 'atama', 'head', 'sar', '🗣️'],
    ['熱', 'ねつ', 'netsu', 'fever', 'bukhaar', '🤒'], ['風邪', 'かぜ', 'kaze', 'a cold', 'zukaam', '🤧'],
    ['薬', 'くすり', 'kusuri', 'medicine', 'dawai', '💊'], ['けが', 'けが', 'kega', 'injury', 'chot', '🩹'],
    ['痛い', 'いたい', 'itai', 'painful / it hurts', 'dard', '😣'], ['歯', 'は', 'ha', 'tooth', 'daant', '🦷'],
    ['入院', 'にゅういん', 'nyūin', 'hospitalisation', 'hospital mein bharti', '🛏️'], ['保険証', 'ほけんしょう', 'hokenshō', 'health insurance card', 'insurance card', '🪪'],
  ] },
  { id: 'n4-feelings', level: 'n4', title: 'Feelings & character', hg: 'Bhaavnaayein', icon: '😊', words: [
    ['うれしい', 'うれしい', 'ureshii', 'happy / glad', 'khush', '😄'], ['悲しい', 'かなしい', 'kanashii', 'sad', 'udaas', '😢'],
    ['怖い', 'こわい', 'kowai', 'scary / scared', 'darr', '😱'], ['恥ずかしい', 'はずかしい', 'hazukashii', 'embarrassed', 'sharam', '😳'],
    ['心配', 'しんぱい', 'shinpai', 'worry', 'chinta', '😟'], ['安心', 'あんしん', 'anshin', 'relief', 'tasalli', '😌'],
    ['優しい', 'やさしい', 'yasashii', 'kind / gentle', 'dayalu / naram', '🤗'], ['厳しい', 'きびしい', 'kibishii', 'strict', 'sakht', '😠'],
    ['親切', 'しんせつ', 'shinsetsu', 'kind (helpful)', 'madadgaar', '🙏'], ['大切', 'たいせつ', 'taisetsu', 'important / precious', 'zaroori / keemti', '💎'],
  ] },
  { id: 'n4-verbs', level: 'n4', title: 'N4 action words', hg: 'N4 kriyaayein', icon: '🏃', words: [
    ['運ぶ', 'はこぶ', 'hakobu', 'carry', 'uthaake le jaana', '📦'], ['届ける', 'とどける', 'todokeru', 'deliver', 'pahunchaana', '🚚'],
    ['集める', 'あつめる', 'atsumeru', 'collect', 'ikattha karna', '🧺'], ['調べる', 'しらべる', 'shiraberu', 'look up / check', 'pata karna', '🔍'],
    ['決める', 'きめる', 'kimeru', 'decide', 'tay karna', '✅'], ['間違える', 'まちがえる', 'machigaeru', 'make a mistake', 'galti karna', '❌'],
    ['頼む', 'たのむ', 'tanomu', 'ask (a favour)', 'request karna', '🙏'], ['謝る', 'あやまる', 'ayamaru', 'apologise', 'maafi maangna', '🙇'],
    ['褒める', 'ほめる', 'homeru', 'praise', 'taareef karna', '👏'], ['叱る', 'しかる', 'shikaru', 'scold', 'daantna', '😤'],
    ['遅れる', 'おくれる', 'okureru', 'be late', 'late hona', '⏰'], ['準備する', 'じゅんびする', 'junbi suru', 'prepare', 'taiyaari karna', '🎒'],
  ] },
];

// Parses "japanese|kana|english|hinglish|picture?|romaji?" lines into word tuples.
export function parseList(text) {
  return text.trim().split('\n').map(l => l.split('|').map(x => x.trim())).map(([jp, kana, en, hg, pic = '', ro = '']) =>
    [jp, kana, ro || toRomaji(kana.replace(/〜/g, '')).replace(/^/, kana.startsWith('〜') ? '-' : ''), en, hg, pic]);
}

// Add the full-list topics. A word (same writing + reading) is taught once: N4 skips anything already in N5,
// and Life & work (level 'life', not a JLPT level) skips anything in either.
const key = w => w[0] + '|' + w[1];
const seen = new Set(VOCAB.flatMap(t => t.words.map(key)));
for (const [level, topics] of [['n5', N5_TOPICS], ['n4', N4_TOPICS], ['life', LIFE_TOPICS]]) {
  for (const t of topics) {
    const words = parseList(t.list).filter(w => !seen.has(key(w)) && seen.add(key(w)));
    if (words.length) VOCAB.push({ id: t.id, level, title: t.title, hg: t.hg, icon: t.icon, words });
  }
}

// id = topic:word; a second word written the same way (止める とめる / やめる) also gets its reading,
// so existing ids (and saved progress) never change.
const ids = new Set();
export const WORDS = VOCAB.flatMap(t => t.words.map(w => {
  let id = `${t.id}:${w[0]}`;
  if (ids.has(id)) id += `:${w[1]}`;
  ids.add(id);
  return { id, topic: t.id, level: t.level, jp: w[0], kana: w[1], ro: w[2], en: w[3], hg: w[4], pic: w[5] };
}));
