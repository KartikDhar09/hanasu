// JLPT-style reading and listening practice.
import { READING_MORE, LISTENING_MORE } from './exam-more.js';
// Reading: { id, level, title, pic, text, en, words: [[word, kana, english]], qs: [{ q, en, options, answer }] }
// Listening: { id, level, kind, pic, lines: [[speaker 'm'|'f'|'n', japanese, english]], q: [japanese, english],
//   options: [{ jp, en, pic? }], answer }

export const READING = [
  // ---- N5 ----
  { id: 'r5-memo', level: 'n5', title: 'A note from your boss', pic: '📝',
    text: '田中さんへ\n明日の会議は十時から十一時までです。三階の会議室でします。会議の前に、資料を十部コピーしてください。\n山本',
    en: 'To Tanaka: Tomorrow’s meeting is from 10 to 11, in the 3rd-floor meeting room. Before the meeting, please make 10 copies of the documents. — Yamamoto',
    words: [['会議', 'かいぎ', 'meeting'], ['三階', 'さんがい', '3rd floor'], ['資料', 'しりょう', 'documents'], ['十部', 'じゅうぶ', '10 copies']],
    qs: [
      { q: '田中さんは会議の前に何をしますか。', en: 'What will Tanaka do before the meeting?', options: ['会議室を予約します', '資料をコピーします', '山本さんに電話します', '三階で待ちます'], answer: 1 },
      { q: '会議は何時に終わりますか。', en: 'What time does the meeting end?', options: ['十時', '十時半', '十一時', '十二時'], answer: 2 },
    ] },
  { id: 'r5-raj', level: 'n5', title: 'Raj introduces himself', pic: '🙋',
    text: 'わたしはラジです。インドから来ました。今、浜松の工場で働いています。毎朝七時に起きて、自転車で会社へ行きます。週末は、友達と料理を作ったり、公園でクリケットをしたりします。日本の食べ物の中で、ラーメンがいちばん好きです。',
    en: 'I’m Raj. I came from India. I now work at a factory in Hamamatsu. I get up at seven every morning and cycle to work. At weekends I cook with friends and play cricket in the park. Of all Japanese food, I like ramen best.',
    words: [['工場', 'こうじょう', 'factory'], ['自転車', 'じてんしゃ', 'bicycle'], ['週末', 'しゅうまつ', 'weekend'], ['公園', 'こうえん', 'park']],
    qs: [
      { q: 'ラジさんは何で会社へ行きますか。', en: 'How does Raj get to work?', options: ['電車で', 'バスで', '自転車で', '車で'], answer: 2 },
      { q: 'ラジさんは週末に何をしますか。', en: 'What does Raj do at weekends?', options: ['工場で働きます', '料理とクリケットをします', 'ラーメンを作ります', 'インドへ帰ります'], answer: 1 },
    ] },
  { id: 'r5-shop', level: 'n5', title: 'Supermarket notice', pic: '🛒',
    text: 'スーパーさくら　お知らせ\n今週の土曜日と日曜日は、野菜と果物が安いです。\n卵は一人一パックです。\n日曜日は午後六時に店を閉めます。',
    en: 'Supermarket Sakura notice: This Saturday and Sunday, vegetables and fruit are cheap. Eggs: one pack per person. On Sunday the shop closes at 6 pm.',
    words: [['お知らせ', 'おしらせ', 'notice'], ['野菜', 'やさい', 'vegetables'], ['果物', 'くだもの', 'fruit'], ['閉めます', 'しめます', 'close']],
    qs: [
      { q: '日曜日、店は何時までですか。', en: 'Until what time is the shop open on Sunday?', options: ['午後五時', '午後六時', '午後七時', '午後八時'], answer: 1 },
      { q: '今週、何が安いですか。', en: 'What is cheap this week?', options: ['肉と魚', '野菜と果物', '卵とパン', 'お茶とコーヒー'], answer: 1 },
    ] },
  { id: 'r5-invite', level: 'n5', title: 'A dinner invitation', pic: '🍛',
    text: 'マリアさん、こんにちは。\n来週の金曜日、うちで晩ご飯を食べませんか。七時から始めます。わたしはカレーを作ります。マリアさんは飲み物を持ってきてください。駅からうちまで、歩いて十分です。\nゆうこ',
    en: 'Hi Maria. Would you like to have dinner at my place next Friday? We’ll start at seven. I’ll make curry. Please bring drinks. It’s a 10-minute walk from the station. — Yuko',
    words: [['晩ご飯', 'ばんごはん', 'dinner'], ['始めます', 'はじめます', 'start'], ['飲み物', 'のみもの', 'drinks'], ['持ってきて', 'もってきて', 'bring']],
    qs: [
      { q: 'マリアさんは何を持っていきますか。', en: 'What will Maria bring?', options: ['カレー', '飲み物', 'ご飯', 'ケーキ'], answer: 1 },
      { q: '晩ご飯は何曜日ですか。', en: 'Which day is the dinner?', options: ['月曜日', '水曜日', '金曜日', '日曜日'], answer: 2 },
    ] },
  // ---- N4 ----
  { id: 'r4-overtime', level: 'n4', title: 'Company notice: no-overtime day', pic: '🏢',
    text: '社員の皆さんへ\n来月から、毎週水曜日は「ノー残業デー」になります。水曜日は六時までに仕事を終わらせて、帰ってください。どうしても残業しなければならない人は、前の日までに課長に連絡してください。\n総務部',
    en: 'To all staff: From next month, every Wednesday will be a “no-overtime day”. On Wednesdays, please finish work by six and go home. If you absolutely must work overtime, contact your section manager by the day before. — General Affairs',
    words: [['社員', 'しゃいん', 'employee'], ['残業', 'ざんぎょう', 'overtime'], ['どうしても', 'どうしても', 'no matter what'], ['連絡', 'れんらく', 'contact']],
    qs: [
      { q: '水曜日に残業したい人は、どうしなければなりませんか。', en: 'What must someone who wants overtime on Wednesday do?', options: ['水曜日の朝、総務部に言う', '前の日までに課長に連絡する', '六時までに帰る', '何もしなくてもいい'], answer: 1 },
      { q: '「ノー残業デー」は何曜日ですか。', en: 'Which day is the no-overtime day?', options: ['月曜日', '火曜日', '水曜日', '金曜日'], answer: 2 },
    ] },
  { id: 'r4-fuji', level: 'n4', title: 'Diary: climbing Mt Fuji', pic: '🗻',
    text: '先週の日曜日、初めて富士山に登りました。朝五時に起きて、友達の車で行きました。山の上はとても寒かったですが、景色がきれいで、来てよかったと思いました。でも、帰りに足が痛くなってしまいました。今度は、もっといい靴を買ってから登ろうと思っています。',
    en: 'Last Sunday I climbed Mt Fuji for the first time. I got up at five and went in a friend’s car. It was very cold at the top, but the view was beautiful and I was glad I came. But on the way down my feet started to hurt. Next time I’m thinking of buying better shoes before I climb.',
    words: [['初めて', 'はじめて', 'for the first time'], ['登りました', 'のぼりました', 'climbed'], ['景色', 'けしき', 'scenery'], ['帰り', 'かえり', 'way back']],
    qs: [
      { q: 'この人は帰りにどうなりましたか。', en: 'What happened to this person on the way back?', options: ['寒くなった', '足が痛くなった', '車が止まった', '道が分からなくなった'], answer: 1 },
      { q: '次に登る前に、何をするつもりですか。', en: 'What do they plan to do before climbing next time?', options: ['友達を誘う', 'もっと早く起きる', 'いい靴を買う', '車を買う'], answer: 2 },
    ] },
  { id: 'r4-clinic', level: 'n4', title: 'Clinic opening hours', pic: '🏥',
    text: 'さくらクリニック\n受付時間：月〜金　9:00〜12:00、14:00〜18:00\n　　　　　土　　　9:00〜12:00\n日曜日・祝日は休みです。\n初めての方は、保険証を持ってきてください。予約しなくても大丈夫ですが、予約すると、待つ時間が短くなります。',
    en: 'Sakura Clinic. Reception: Mon–Fri 9–12 and 14–18, Sat 9–12. Closed Sundays and public holidays. First-time patients, please bring your health insurance card. You don’t need to book, but booking shortens your wait.',
    words: [['受付', 'うけつけ', 'reception'], ['祝日', 'しゅくじつ', 'public holiday'], ['保険証', 'ほけんしょう', 'insurance card'], ['予約', 'よやく', 'reservation']],
    qs: [
      { q: '土曜日の午後三時に、このクリニックに行けますか。', en: 'Can you go to this clinic at 3 pm on Saturday?', options: ['はい、行けます', 'いいえ、行けません', '予約すれば行けます', '保険証があれば行けます'], answer: 1 },
      { q: '初めて行く人は、何を持っていかなければなりませんか。', en: 'What must a first-time patient bring?', options: ['予約の紙', 'お金だけ', '保険証', '薬'], answer: 2 },
    ] },
  { id: 'r4-trip', level: 'n4', title: 'Business trip change', pic: '🚄',
    text: '山田さんへ\n明日の出張ですが、大阪の会議が一時間早くなりました。九時の新幹線ではなく、八時の新幹線に乗ってください。切符は私が買っておきました。明日、駅で渡します。\n佐藤',
    en: 'To Yamada: About tomorrow’s business trip, the Osaka meeting has moved one hour earlier. Please take the 8:00 shinkansen instead of the 9:00. I’ve already bought the ticket and will give it to you at the station tomorrow. — Sato',
    words: [['出張', 'しゅっちょう', 'business trip'], ['新幹線', 'しんかんせん', 'bullet train'], ['切符', 'きっぷ', 'ticket'], ['渡します', 'わたします', 'hand over']],
    qs: [
      { q: '山田さんは明日、何時の新幹線に乗りますか。', en: 'Which shinkansen will Yamada take tomorrow?', options: ['七時', '八時', '九時', '十時'], answer: 1 },
      { q: '切符はだれが買いましたか。', en: 'Who bought the ticket?', options: ['山田さん', '佐藤さん', '大阪の人', 'まだ買っていない'], answer: 1 },
    ] },
];

export const LISTENING = [
  // ---- N5 ----
  { id: 'l5-fruit', level: 'n5', kind: 'Picture question', pic: '🍎',
    lines: [['f', 'すみません、りんごを三つと、バナナを一つください。', 'Excuse me, three apples and one banana, please.'], ['m', 'はい。全部で五百円です。', 'Sure. That’s 500 yen altogether.']],
    q: ['女の人は何を買いましたか。', 'What did the woman buy?'],
    options: [{ pic: '🍎🍎🍎🍌', jp: 'りんご3・バナナ1', en: '3 apples, 1 banana' }, { pic: '🍎🍌🍌🍌', jp: 'りんご1・バナナ3', en: '1 apple, 3 bananas' }, { pic: '🍎🍎🍌', jp: 'りんご2・バナナ1', en: '2 apples, 1 banana' }, { pic: '🍌🍌🍌', jp: 'バナナ3', en: '3 bananas' }], answer: 0 },
  { id: 'l5-meeting', level: 'n5', kind: 'Key point', pic: '🕘',
    lines: [['m', '明日の会議は何時からですか。', 'What time is tomorrow’s meeting?'], ['f', '十時からです。でも、九時半に会議室に来てください。準備をしますから。', 'From ten. But please come to the meeting room at 9:30, because we’ll set up.']],
    q: ['男の人は何時に会議室に行きますか。', 'What time will the man go to the meeting room?'],
    options: [{ jp: '九時', en: '9:00' }, { jp: '九時半', en: '9:30' }, { jp: '十時', en: '10:00' }, { jp: '十時半', en: '10:30' }], answer: 1 },
  { id: 'l5-weekend', level: 'n5', kind: 'Picture question', pic: '⚽',
    lines: [['f', '田中さん、週末は何をしましたか。', 'Tanaka-san, what did you do at the weekend?'], ['m', '土曜日は家で掃除をしました。日曜日は友達とサッカーをしました。', 'On Saturday I cleaned at home. On Sunday I played football with friends.']],
    q: ['男の人は日曜日に何をしましたか。', 'What did the man do on Sunday?'],
    options: [{ pic: '🧹', jp: '掃除', en: 'cleaning' }, { pic: '⚽', jp: 'サッカー', en: 'football' }, { pic: '🛍️', jp: '買い物', en: 'shopping' }, { pic: '🎬', jp: '映画', en: 'a movie' }], answer: 1 },
  { id: 'l5-pen', level: 'n5', kind: 'What do you say?', pic: '🖊️',
    lines: [['n', 'ペンを借りたいです。何と言いますか。', 'You want to borrow a pen. What do you say?']],
    q: ['何と言いますか。', 'What do you say?'],
    options: [{ jp: 'ペンを借りてもいいですか。', en: 'May I borrow a pen?' }, { jp: 'ペンを貸してもいいですか。', en: 'May I lend you a pen?' }, { jp: 'ペンをどうぞ。', en: 'Here’s a pen.' }], answer: 0 },
  { id: 'l5-leave', level: 'n5', kind: 'Quick response', pic: '🚪',
    lines: [['m', 'お先に失礼します。', 'I’m heading off before you.']],
    q: ['何と答えますか。', 'How do you reply?'],
    options: [{ jp: 'お疲れ様でした。', en: 'Good work today.' }, { jp: 'いただきます。', en: '(before eating)' }, { jp: 'いらっしゃいませ。', en: 'Welcome (to a shop).' }], answer: 0 },
  // ---- N4 ----
  { id: 'l4-station', level: 'n4', kind: 'Task-based', pic: '🚉',
    lines: [['f', '駅までどうやって行けばいいですか。', 'How should I get to the station?'], ['m', 'バスもありますが、この時間は道が込んでいるので、電車のほうが早いですよ。', 'There’s a bus too, but the roads are busy at this time, so the train is faster.'], ['f', 'わかりました。そうします。', 'OK, I’ll do that.']],
    q: ['女の人は何で駅まで行きますか。', 'How will the woman go to the station?'],
    options: [{ pic: '🚌', jp: 'バス', en: 'bus' }, { pic: '🚃', jp: '電車', en: 'train' }, { pic: '🚕', jp: 'タクシー', en: 'taxi' }, { pic: '🚶', jp: '歩いて', en: 'on foot' }], answer: 1 },
  { id: 'l4-copies', level: 'n4', kind: 'Key point', pic: '📄',
    lines: [['m', '課長、明日の資料ですが、何部コピーしましょうか。', 'Boss, about tomorrow’s documents, how many copies shall I make?'], ['f', '会議に来るのは八人だけど、二部多めにお願い。', 'Eight people are coming to the meeting, but make two extra, please.']],
    q: ['男の人は何部コピーしますか。', 'How many copies will the man make?'],
    options: [{ jp: '八部', en: '8' }, { jp: '九部', en: '9' }, { jp: '十部', en: '10' }, { jp: '十二部', en: '12' }], answer: 2 },
  { id: 'l4-sick', level: 'n4', kind: 'Task-based', pic: '🤒',
    lines: [['f', '山田さん、顔色が悪いですね。', 'Yamada-san, you look pale.'], ['m', 'ええ、昨日から熱があって…。', 'Yes, I’ve had a fever since yesterday…'], ['f', 'じゃあ、今日は早く帰ったほうがいいですよ。', 'Then you’d better go home early today.'], ['m', 'そうします。すみません。', 'I will. Sorry.']],
    q: ['男の人はこれからどうしますか。', 'What will the man do now?'],
    options: [{ pic: '🏥', jp: '病院に行く', en: 'go to hospital' }, { pic: '🏠', jp: '早く帰る', en: 'go home early' }, { pic: '💊', jp: '薬を飲む', en: 'take medicine' }, { pic: '💻', jp: '仕事を続ける', en: 'keep working' }], answer: 1 },
  { id: 'l4-late', level: 'n4', kind: 'What do you say?', pic: '🚆',
    lines: [['n', '電車が止まって、会社に遅れます。課長に電話します。何と言いますか。', 'Your train stopped and you’ll be late. You call your boss. What do you say?']],
    q: ['何と言いますか。', 'What do you say?'],
    options: [{ jp: '電車が止まってしまって、少し遅れます。', en: 'The train stopped, so I’ll be a little late.' }, { jp: '遅れてもいいですよ。', en: 'It’s fine to be late.' }, { jp: 'お先に失礼します。', en: 'I’m heading off first.' }], answer: 0 },
  { id: 'l4-check', level: 'n4', kind: 'Quick response', pic: '📋',
    lines: [['f', 'この資料、明日までに見ておいてもらえますか。', 'Could you look over this document by tomorrow?']],
    q: ['何と答えますか。', 'How do you reply?'],
    options: [{ jp: 'はい、わかりました。', en: 'Yes, understood.' }, { jp: 'はい、見てもいいです。', en: 'Yes, you may look.' }, { jp: 'いいえ、見ませんでした。', en: 'No, I didn’t look.' }], answer: 0 },
];

READING.push(...READING_MORE);
LISTENING.push(...LISTENING_MORE);
