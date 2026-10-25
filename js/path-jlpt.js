// JLPT path: 13 levels from the first hiragana to the N4 mock test.
// Every N5/N4 grammar point, kanji group, vocabulary topic and particle belongs to exactly one level (check.mjs).
//
// Level fields
//   steps  [icon, title, how to do it, target]; target is '#hash' or 'action:arg' ('' = no link)
//   study  content taught in this level: particles, grammar, kanji (group ids), vocab (topic ids), units
//   daily  a day's routine for this level
//   mock   'n5' | 'n4' on the two exam levels: they point to the full-length mock test in the JLPT tab
//
// No level tests since v6.0 (the user's choice, 2026-10-25): a level is done when the learner marks it complete.
//
// Authored questions, one per line (right answer first; options are shuffled when shown):
//   g|sentence with the [answer]|kana with the [answer]|English|wrong|wrong|wrong   fill in the grammar
//   r|word|right reading|wrong|wrong|wrong                                           how is it read?
//   m|word|kana|right meaning|wrong|wrong|wrong                                      what does it mean?
//   w|English|right Japanese|wrong|wrong|wrong                                       which is the Japanese?
//   l|Japanese|kana|right meaning|wrong|wrong|wrong                                  listen, then choose
//   p|passage|question|question in English|right|wrong|wrong|wrong                   short reading

export const PATH_JLPT_INTRO = {
  en: 'Thirteen levels take you from the first hiragana to passing the JLPT N4. Each level says what you will be able to do, what to study in what order, and a daily routine. When you have done a level, mark it complete. Already know some Japanese? Mark any level complete and skip ahead: the levels can be done in any order.',
  hg: 'Level ho gaya? “Mark level complete” dabao. Pehle se thodi Japanese aati hai? Kisi bhi level ko complete mark karke aage badh jao.',
};

export const PATH_JLPT = [
  {
    id: 'j1', icon: 'あ', title: 'Hiragana', part: 'Start', time: '1 week · 20–30 min a day',
    goal: 'Read and say all 46 hiragana, the voiced sounds (が, ぱ…) and combinations like きゃ and small っ.',
    goalHg: 'Saare hiragana padh aur bol paoge. Yahi Japanese ki neev hai.',
    steps: [
      ['あ', 'Learn the basic chart, two rows a day', 'Open the hiragana chart. Tap each kana, listen, and say it back out loud three times. Day 1: あ and か rows. Day 2: さ and た. Day 3: な and は. Day 4: ま, や, ら. Day 5: わ, を, ん.', '#jlpt/kana'],
      ['✍️', 'Write each one on paper', 'Writing by hand fixes the shape in memory. Watch each kana’s stroke order first, then write each new row five times while saying the sound.', '#write/hira'],
      ['゛', 'Add the ゛ and ゜ sounds', 'Two dots make a sound voiced: か → が, さ → ざ, た → だ, は → ば. A small circle makes は → ぱ. Same shapes, so this takes one day.', '#jlpt/kana'],
      ['ゃ', 'Combinations and small っ', 'A small ゃ ゅ ょ joins the kana before it: き + ゃ = きゃ (kya). A small っ doubles the next sound: きって = kitte (stamp). Long vowels: おかあさん = okāsan.', '#jlpt/kana'],
      ['🔁', 'Read the whole chart every day', 'Go through the hiragana chart out loud until you can read every kana without stopping.', '#jlpt/kana'],
      ['👋', 'Read your first real words', 'Open Greetings and read the kana line under each phrase before you play it. You can read real Japanese already.', '#unit/greet'],
    ],
    daily: ['10 min: new rows, each kana said aloud 3 times', '5 min: write them from memory', '5 min: read the whole chart aloud', 'Read any hiragana you see around you: shop signs, packets, station names'],
    tip: 'Hindi already gives you the system: each kana is one syllable, and the order a-i-u-e-o, ka-ki-ku-ke-ko works just like ka-kii-ku-ke-ko.',
    tipHg: 'Hindi jaisa hi system hai: har akshar ek awaaz.',
    study: {},
  },
  {
    id: 'j2', icon: 'ア', title: 'Katakana & first phrases', part: 'Start', time: '1–2 weeks · 30 min a day',
    goal: 'Read katakana words (コーヒー, パソコン, インド), and greet, thank, apologise and ask someone to repeat.',
    goalHg: 'Katakana padh paoge aur basic greetings, thank you, sorry bol paoge.',
    steps: [
      ['ア', 'Learn katakana the same way', 'Two rows a day, out loud. Katakana is for foreign words and names: インド (India), コーヒー (coffee). The long mark ー stretches the vowel.', '#jlpt/kana'],
      ['✍️', 'Write them', 'Watch the stroke order of each katakana, then write every new row five times. シ/ツ and ソ/ン look alike: the stroke direction tells them apart.', '#write/kata'],
      ['☕', 'Katakana words', 'Flashcards for the katakana loanwords: most are English words you already know, so guess first, then check.', 'vlearn:n5-katakana'],
      ['🔁', 'Read the katakana chart', 'Read every katakana aloud until none makes you stop.', '#jlpt/kana'],
      ['👋', 'Greetings and “I don’t understand”', 'In each unit below: Learn (flashcards) first, then Speak (say it, get checked), then the Role-play. These are the phrases you will use every single day.', ''],
    ],
    daily: ['10 min: katakana rows, aloud', '10 min: one phrase unit (Learn, then Speak)', '5 min: read the katakana chart aloud', 'Use one greeting for real today: おはようございます to a coworker, ありがとうございます at a shop'],
    tip: 'Katakana words follow Japanese sounds: “computer” becomes パソコン (pasokon), “McDonald’s” マクドナルド. Say them the Japanese way or people won’t understand.',
    tipHg: 'English shabd bhi Japanese awaaz mein bolo: pasokon, konbini.',
    study: { vocab: ['n5-katakana'], units: ['greet', 'help'] },
  },
  {
    id: 'j3', icon: '🔢', title: 'Nouns, numbers & time', part: 'N5 · 1 of 5', time: '2–3 weeks · 30–45 min a day',
    goal: 'Say what things are and who people are, ask “what / where / who”, count, and tell the time, day and date: これは何ですか。今、三時です。',
    goalHg: 'Cheez kya hai, kaun hai, kitne baje hain, aaj kaunsa din hai: yeh sab bol aur samajh paoge.',
    steps: [
      ['の', 'Particles は・の・も・か・や・と', 'Open each particle below. Play every example and repeat it.', '#particles'],
      ['📘', 'Grammar points, in order', 'For each point: read the pattern, play every example aloud, then cover the English and say what it means.', ''],
      ['🔢', 'Numbers, time and counters', 'Numbers to 10,000, then 時 (o’clock), 分 (minutes), days of the week and dates. On the Counters page learn つ, 人, 本, 枚 first.', '#counters'],
      ['漢', 'Kanji: numbers and time', 'In each group: Learn this group (flashcards) until you know every kanji, then watch its stroke order once.', ''],
      ['🍙', 'Vocabulary', 'Flashcards, 12 words at a time. Say each word aloud before you turn the card.', ''],
      ['💬', 'Phrase units', 'Introducing yourself and Time & days: Learn, Speak, then the Role-play.', ''],
    ],
    daily: ['10 min: one grammar point with its examples', '10 min: vocabulary flashcards', '10 min: kanji flashcards', '5 min: say the time, day and date out loud whenever you look at a clock'],
    tip: 'Dates 1–10 are irregular: 1st ついたち, 2nd ふつか, 3rd みっか … 10th とおか. So are 14th じゅうよっか, 20th はつか and 24th にじゅうよっか. Learn them like a song.',
    tipHg: 'Tareekhein ulti-seedhi hain: inko gaane ki tarah yaad karo.',
    study: {
      particles: ['wa', 'no', 'mo', 'ka', 'ya', 'to'],
      grammar: ['desu', 'formalneg', 'deshita', 'kosoado', 'aru', 'counters', 'tachi', 'momo', 'o-go'],
      kanji: ['num', 'time'],
      vocab: ['n5-numbers', 'n5-calendar', 'n5-clock', 'n5-kosoado', 'n5-people', 'n5-family2'],
      units: ['intro', 'time'],
    },
  },
  {
    id: 'j4', icon: '🏃', title: 'Verbs & daily life', part: 'N5 · 2 of 5', time: '3 weeks · 30–45 min a day',
    goal: 'Talk about what you do, did and will do: where, when, with whom and how. Invite someone: 一緒に行きませんか。',
    goalHg: 'Roz kya karte ho, kal kya kiya, kahan gaye, kiske saath: yeh sab bol paoge. Kisi ko invite bhi kar paoge.',
    steps: [
      ['🏃', 'Verbs: the ます form', 'On the Verbs page learn the three verb groups and the ます / ません / ました / ませんでした forms. Say each form aloud.', '#verbs'],
      ['の', 'Particles を・に・で・へ・から・まで', 'These say what, where, when and how. Learn each one with its examples, saying them aloud.', '#particles'],
      ['📘', 'Grammar points, in order', 'Same method: pattern, examples aloud, then say the meaning with the English covered.', ''],
      ['漢', 'Kanji: people and places', 'Learn this group (flashcards), then the stroke order.', ''],
      ['🍙', 'Vocabulary', 'The N5 verbs list is long (106). Do 12 a day and say a sentence with each: 毎朝コーヒーを飲みます。', ''],
      ['💬', 'Phrase units', 'Directions & trains, Shopping: Learn, Speak, Role-play. Then use them for real at a station or shop.', ''],
    ],
    daily: ['10 min: one grammar point', '15 min: verbs and vocabulary flashcards', '10 min: kanji', '5 min: say your day out loud in ます form: 七時に起きます。電車で会社へ行きます。'],
    tip: 'へ is read “e” and を is read “o” when they are particles. Time words like 今日 and 明日 take no に; clock times and days do: 七時に, 月曜日に.',
    tipHg: 'Particle he ko “e” aur wo ko “o” padhte hain.',
    study: {
      particles: ['o', 'ni', 'de', 'e', 'kara', 'made'],
      grammar: ['masu', 'mashita', 'masenka', 'mashou', 'mashouka', 'nipurpose', 'issho', 'freq', 'goro', 'gurai', 'ka-or', 'nanimo', 'wokudasai'],
      kanji: ['people', 'place'],
      vocab: ['n5-verbs', 'n5-places', 'n5-places2', 'n5-transport', 'n5-transport2', 'n5-position', 'n5-time'],
      units: ['way', 'shop'],
    },
  },
  {
    id: 'j5', icon: '🍜', title: 'Adjectives, likes & wants', part: 'N5 · 3 of 5', time: '3 weeks · 30–45 min a day',
    goal: 'Describe people, places and food, say what you like and want, and compare: 東京は大阪より大きいです。',
    goalHg: 'Cheezon ko describe karna, pasand-napasand batana aur do cheezon ko compare karna.',
    steps: [
      ['🌸', 'い- and な-adjectives', 'The two adjective types change differently: 高い → 高くない → 高かった, but 静か → 静かじゃない → 静かでした. Learn both tables from the grammar points.', ''],
      ['の', 'Particles が・より・ね・よ', 'が for likes, wants and skills; より for comparing; ね and よ at the end of a sentence. Learn each, with its examples aloud.', '#particles'],
      ['📘', 'Grammar points, in order', 'Pattern, examples aloud, then say the meaning with the English covered.', ''],
      ['漢', 'Kanji: nature and describing words', 'Learn this group, then the stroke order.', ''],
      ['🍙', 'Vocabulary', 'Food, clothes, hobbies and all the adjectives. Make a pair for each adjective: 高い ↔ 安い, 広い ↔ 狭い.', ''],
      ['💬', 'Phrase units', 'At a restaurant, Likes & plans: Learn, Speak, Role-play.', ''],
    ],
    daily: ['10 min: one grammar point', '15 min: vocabulary', '10 min: kanji', '5 min: describe three things around you: この部屋は広くないです。'],
    tip: 'Never say 寒いでした. For い-adjectives the past is in the adjective itself: 寒かったです.',
    tipHg: '“samui deshita” galat hai: “samukatta desu” sahi hai.',
    study: {
      particles: ['ga', 'yori', 'ne', 'yo'],
      grammar: ['iadj', 'naadj', 'adjnoun', 'suki', 'hoshii', 'tai', 'takunai', 'yori', 'ichiban', 'dochira', 'adverb', 'kute', 'amari', 'zenzen', 'waga', 'ga-but', 'demo-but'],
      kanji: ['nature', 'adj'],
      vocab: ['n5-adj', 'n5-iadj', 'n5-naadj', 'n5-food', 'n5-food2', 'n5-clothes', 'n5-hobbies'],
      units: ['food', 'plans'],
    },
  },
  {
    id: 'j6', icon: '🙏', title: 'The て-form: asking & permission', part: 'N5 · 4 of 5', time: '3 weeks · 30–45 min a day',
    goal: 'Ask people to do things, ask permission, say what is happening now and what you did in order: 写真を撮ってもいいですか。',
    goalHg: 'Kisi se kuch karne ko kehna, permission lena, abhi kya ho raha hai batana.',
    steps: [
      ['🏃', 'Make the て-form', 'On the Verbs page learn the て-form rules (書く → 書いて, 飲む → 飲んで, 行く → 行って). Say ten verbs in て-form every day until it is automatic.', '#verbs'],
      ['📘', 'Grammar points, in order', 'Almost every point here is built on the て-form. Pattern, examples aloud, meaning with the English covered.', ''],
      ['漢', 'Kanji: action kanji', 'Learn this group, then the stroke order.', ''],
      ['🍙', 'Vocabulary', 'Body, home, school, things around you, nature and adverbs.', ''],
      ['💬', 'Use it at work', 'Try one real request a day: ちょっと待ってください。ここに書いてもいいですか。', ''],
    ],
    daily: ['10 min: て-form drill (10 verbs, aloud)', '10 min: one grammar point', '10 min: vocabulary', '10 min: kanji'],
    tip: 'The て-form song (to the tune of “Clementine” or any tune): う・つ・る → って, む・ぶ・ぬ → んで, く → いて, ぐ → いで, す → して. Exception: 行く → 行って.',
    tipHg: 'Te-form ke rules ek gaane ki tarah yaad karo.',
    study: {
      grammar: ['tekudasai', 'kudasaimasenka', 'teiru', 'mada-still', 'temoii', 'tewaikenai', 'tekara', 'tesequence', 'mou-mada', 'kata', 'ikaga', 'deshouka', 'demo', 'nisuru', 'kusuru', 'naru'],
      kanji: ['action'],
      vocab: ['n5-body', 'n5-home', 'n5-school', 'n5-things', 'n5-nature', 'n5-adverbs'],
    },
  },
  {
    id: 'j7', icon: '🔗', title: 'Plain form & joining sentences', part: 'N5 · 5 of 5', time: '3 weeks · 30–45 min a day',
    goal: 'Use the plain (dictionary) form, say before / after / when / because, and describe things with whole sentences: 母が作ったケーキ.',
    goalHg: 'Plain form, pehle / baad mein / jab / kyunki: lambe sentence bana paoge.',
    steps: [
      ['🏃', 'Plain forms', 'On the Verbs page learn the dictionary, ない and た forms. Friends and family use these; you need them inside longer sentences too.', '#verbs'],
      ['📘', 'Grammar points, in order', 'Pattern, examples aloud, meaning with the English covered.', ''],
      ['漢', 'Last N5 kanji', 'Then all the N5 kanji flashcards on the Kanji page (N5) until you know every one.', '#kanji'],
      ['🍙', 'Last N5 words', 'Then N5 flashcards until you know every word.', 'vlearn:n5'],
    ],
    daily: ['10 min: one grammar point', '10 min: plain-form drill', '10 min: N5 vocabulary review', '10 min: kanji flashcards'],
    tip: 'A describing sentence goes before the noun, in plain form: 昨日買った本 (the book I bought yesterday). No です or ます inside it.',
    tipHg: 'Noun ko describe karne wala hissa pehle aata hai, plain form mein.',
    study: {
      grammar: ['plain', 'naide', 'mae', 'toki', 'tari', 'relative', 'no-one', 'kara-because', 'kedo', 'deshou', 'toiu', 'dake', 'shika', 'madeni', 'chuu', 'nanika', 'donna', 'why', 'douyatte', 'naa'],
      kanji: ['n5-school2'],
      vocab: ['n5-more'],
    },
  },
  {
    id: 'j8', icon: '🏁', title: 'N5 exam ready', part: 'N5 exam', time: '2–4 weeks · 45–60 min a day',
    goal: 'Pass a full-length N5 mock test: at least 80/180, with 38+ in language and reading and 19+ in listening.',
    goalHg: 'Poora N5 mock test pass karo: 180 mein se 80+.',
    steps: [
      ['❓', 'Know the question types', 'In the JLPT tab open “Question types” and “About the exam”: know what each part looks like before you practise it.', '#jlpt'],
      ['📖', 'Reading practice', 'Every N5 passage. Read the question first, then the passage: you look for the answer instead of translating everything.', 'ex-reading:n5'],
      ['🎧', 'Listening practice', 'Every N5 conversation. Play each once only, like the exam; then replay with the text if you missed it.', 'ex-listening:n5'],
      ['✏️', 'Grammar review', 'Go back over the N5 grammar points: every example aloud, meaning with the English covered.', '#jlpt/grammar/n5'],
      ['⚡', 'Quick mock', 'About 30 questions with no clock: find your weakest part, then go back to it.', 'ex-mock-start:n5.quick'],
      ['🏁', 'Full mock test', 'Three papers with their own clocks, like the real exam. When you pass it, mark this level complete.', 'ex-mock:n5'],
    ],
    daily: ['15 min: reading (one passage, timed)', '15 min: listening (play once only)', '15 min: grammar points aloud', 'Weekly: one full mock test, then study the mistake review'],
    tip: 'The real JLPT is held in Japan on the first Sunday of July and of December. Applications open months before (around March for July, August for December): check jlpt.jp.',
    tipHg: 'Asli JLPT July aur December mein hota hai. Form pehle bharna padta hai: jlpt.jp dekho.',
    study: {},
    mock: 'n5',
  },
  {
    id: 'j9', icon: '🤔', title: 'Can, plan, think & must', part: 'N4 · 1 of 4', time: '3–4 weeks · 45 min a day',
    goal: 'Say what you can do, have done and plan to do, what you think, and what you must or don’t have to do: 日本語が話せます。行こうと思っています。',
    goalHg: 'Kya kar sakte ho, kya kiya hai, kya plan hai, kya sochte ho, kya karna zaroori hai.',
    steps: [
      ['🏃', 'Potential and volitional forms', 'On the Verbs page: 話す → 話せる (can speak), 行く → 行こう (let’s go). Drill ten verbs a day in both forms.', '#verbs'],
      ['📘', 'Grammar points, in order', 'Pattern, examples aloud, meaning with the English covered.', ''],
      ['漢', 'N4 kanji: work, home, moving', 'Learn this group, then the stroke order. N4 adds about 190 kanji: steady groups beat cramming.', ''],
      ['🍙', 'Vocabulary', 'Work, daily life, study, technology and time words.', ''],
      ['🏢', 'Office phrase units', 'Office greetings, First day at work, Asking for help, Taking instructions: Learn, Speak, Role-play.', ''],
    ],
    daily: ['10 min: one grammar point', '15 min: vocabulary', '10 min: N4 kanji', '10 min: review N5 (one set of flashcards) so it doesn’t fade'],
    tip: 'N4 includes everything in N5. Keep one N5 review a week in your routine.',
    tipHg: 'N4 mein poora N5 bhi aata hai: hafte mein ek baar N5 dohrao.',
    study: {
      grammar: ['dekiru', 'potential', 'takotogaaru', 'kotogaaru', 'tsumori', 'volitional', 'yotei', 'toomou', 'itteita', 'kamo', 'darou', 'kana-wonder', 'houga', 'taradou', 'nakereba', 'naitoikenai', 'nakutemo', 'kamawanai', 'ndesu', 'hitsuyou', 'teyokatta', 'tesumimasen', 'taraiidesuka', 'kai', 'kashira'],
      kanji: ['n4-work', 'n4-life', 'n4-move'],
      vocab: ['n4-work', 'n4-life', 'n4-verbs', 'n4-time3', 'n4-study2', 'n4-tech'],
      units: ['o-greet', 'o-intro', 'o-ask', 'o-task'],
    },
  },
  {
    id: 'j10', icon: '🔀', title: 'If, when, while & the て-form extras', part: 'N4 · 2 of 4', time: '4 weeks · 45 min a day',
    goal: 'Use the four “if / when” forms (たら, ば, と, なら), say “even if”, “while”, “just did”, “about to”, and add feeling with てしまう, ておく, てみる.',
    goalHg: '“Agar / jab” ke chaar tareeke, aur “galti se ho gaya”, “pehle se kar ke rakhna”, “try karna”.',
    steps: [
      ['🔀', 'The four conditionals together', 'Read たら, ば, と and なら one after another and compare their examples. たら is the safest all-rounder when unsure.', 'gpoint:tara'],
      ['📘', 'Grammar points, in order', 'Pattern, examples aloud, meaning with the English covered.', ''],
      ['漢', 'N4 kanji', 'Body, places, people, feelings, food: learn each group, then the stroke order.', ''],
      ['🍙', 'Vocabulary', 'Health, feelings, people, home, town, travel and food.', ''],
      ['🏢', 'Office phrase units', 'Apologies & being late, Phone calls: Learn, Speak, Role-play.', ''],
    ],
    daily: ['10 min: one grammar point', '15 min: vocabulary', '10 min: N4 kanji', '10 min: N4 grammar examples aloud'],
    tip: 'と is for things that always happen (press → opens); it can’t end in a request. 駅に着いたら電話してください is right; 着くと電話してください is wrong.',
    tipHg: '“to” ke baad request nahi aati: wahan “tara” use karo.',
    study: {
      grammar: ['tara', 'ba', 'to-cond', 'nara', 'temo', 'nagara', 'aida', 'uchini', 'tokoro', 'bakari-just', 'hajimeru', 'tsuzukeru', 'dasu', 'teshimau', 'teoku', 'temiru', 'tearu', 'teikukuru', 'mama', 'shi', 'node', 'nakute', 'naide-without', 'zuni', 'bayokatta', 'toii', 'teita', 'jidoushi', 'nakanaka', 'sonnani', 'dakede', 'oki', 'toka'],
      kanji: ['n4-world', 'n4-people2', 'n4-food2'],
      vocab: ['n4-health', 'n4-feelings', 'n4-people3', 'n4-home3', 'n4-town2', 'n4-travel2', 'n4-food4'],
      units: ['o-sorry', 'o-phone'],
    },
  },
  {
    id: 'j11', icon: '🎁', title: 'Giving, passive & causative', part: 'N4 · 3 of 4', time: '4 weeks · 45 min a day',
    goal: 'Talk about giving and receiving favours, things done to you, making or letting someone do something, purpose and change: 先生に教えてもらいました。',
    goalHg: 'Dena-lena (favours), “mere saath hua” (passive), “karwana” (causative), aur “taaki / ke liye”.',
    steps: [
      ['🎁', 'あげる / くれる / もらう', 'Start with the giving point: draw arrows between people until the three verbs feel natural. くれる is always towards you or your group.', 'gpoint:giving'],
      ['📘', 'Grammar points, in order', 'Passive, causative and causative-passive look alike: say the forms of one verb side by side (食べられる, 食べさせる, 食べさせられる).', ''],
      ['漢', 'N4 kanji', 'Colours, more action kanji, society: learn each group, then the stroke order.', ''],
      ['🍙', 'Vocabulary', 'The big N4 verb list, adjectives, adverbs, katakana, shopping, culture, health and nature.', ''],
      ['🏢', 'Office phrase units', 'Meetings, Time off & small talk: Learn, Speak, Role-play.', ''],
    ],
    daily: ['10 min: one grammar point', '15 min: vocabulary', '10 min: N4 kanji', '10 min: N4 grammar examples aloud'],
    tip: 'Passive often means you were troubled by it: 雨に降られた (I got rained on). That’s why it’s used for complaints.',
    tipHg: 'Passive aksar “mere saath bura hua” ke liye hota hai.',
    study: {
      grammar: ['giving', 'tehoshii', 'garu', 'passive', 'causative', 'causpass', 'youninaru', 'younisuru', 'youni', 'youniiu', 'tameni', 'noni', 'noni-for', 'sugiru', 'yasui', 'sa', 'nominal', 'kotonisuru', 'kotoninaru', 'kadouka', 'embedq', 'hodo', 'mo-emph', 'bakari-only', 'zutsu', 'imperative', 'na-prohib', 'nasai', 'zurai', 'gari', 'gasuru', 'nimieru', 'nikigatsuku', 'karatsukuru', 'youna', 'nowada', 'tte'],
      kanji: ['n4-describe2', 'n4-actions2', 'n4-society'],
      vocab: ['n4-verbs3', 'n4-iadj3', 'n4-naadj3', 'n4-adverbs2', 'n4-katakana3', 'n4-shopping', 'n4-culture', 'n4-health3', 'n4-nature3'],
      units: ['o-meet', 'o-life'],
    },
  },
  {
    id: 'j12', icon: '👔', title: 'Keigo, hearsay & guessing', part: 'N4 · 4 of 4', time: '4 weeks · 45 min a day',
    goal: 'Speak politely to customers and bosses (honorific and humble keigo), pass on what you heard, and guess from what you see: 雨が降りそうです。',
    goalHg: 'Boss aur clients se keigo mein baat, suni hui baat batana, aur andaza lagana.',
    steps: [
      ['👔', 'Honorific vs humble', 'Honorific lifts the other person (いらっしゃる, お〜になる); humble lowers you (参る, 申す, お〜する). Never use humble for your boss or a customer.', 'gpoint:sonkeigo'],
      ['📘', 'Grammar points, in order', 'そう (looks like), そう (I heard), よう/みたい and らしい look alike: compare their examples side by side.', ''],
      ['漢', 'Last N4 kanji', 'Then all the N4 kanji flashcards on the Kanji page (N4) until you know every one.', '#kanji/n4'],
      ['🍙', 'Last N4 words', 'Keigo verbs and work words, then N4 flashcards until you know every word.', 'vlearn:n4'],
      ['🏢', 'Corporate phrase units', 'Asking a coworker, Checking you understood: Learn, Speak, Role-play.', ''],
    ],
    daily: ['10 min: one grammar point', '15 min: vocabulary', '10 min: N4 kanji', '10 min: N4 grammar examples aloud'],
    tip: 'At work, keigo goes up to the customer and other companies even about your own boss: 部長の田中は今おりません (humble, about your own boss, to an outsider).',
    tipHg: 'Bahar ke logon se baat karte waqt apne boss ke liye bhi humble form.',
    study: {
      grammar: ['sou-look', 'sou-hear', 'mitai', 'rashii', 'hazu', 'niyoruto', 'okininaru', 'osuru', 'sonkeigo', 'kenjougo', 'rareru-respect', 'itadakeru', 'sasete', 'baai', 'hazuganai', 'tokiita', 'toiukoto', 'toiwareteiru', 'janaika', 'okudasai', 'toittemoii', 'teyaru'],
      kanji: ['n4-nature4', 'n4-places3', 'n4-describe3', 'n4-actions3'],
      vocab: ['n4-keigo', 'n4-work3', 'n4-work4', 'n4-life4', 'n4-people4', 'n4-verbs4', 'n4-words4', 'n4-society2'],
      units: ['c-ask', 'c-check'],
    },
  },
  {
    id: 'j13', icon: '🎓', title: 'N4 exam ready', part: 'N4 exam', time: '3–4 weeks · 60 min a day',
    goal: 'Pass a full-length N4 mock test: at least 90/180, with 38+ in language and reading and 19+ in listening. You’re ready to sit the real N4.',
    goalHg: 'Poora N4 mock test pass karo: 180 mein se 90+. Phir asli exam ke liye taiyaar!',
    steps: [
      ['📖', 'Reading practice', 'Every N4 passage. Question first, then the passage; for notices, scan for the one fact you need (情報検索).', 'ex-reading:n4'],
      ['🎧', 'Listening practice', 'Every N4 conversation, played once. For 即時応答 (quick response), answer in your head before the options finish.', 'ex-listening:n4'],
      ['✏️', 'Grammar review', 'Go back over the N4 grammar points: every example aloud, meaning with the English covered.', '#jlpt/grammar/n4'],
      ['🖼️', 'Vocabulary and kanji review', 'N4 word and kanji flashcards until you know them all.', 'vlearn:n4'],
      ['⚡', 'Quick mock', 'Find your weakest part, then go back to that level’s grammar or words.', 'ex-mock-start:n4.quick'],
      ['🏁', 'Full mock test', 'When you pass it, mark this level complete. Then book the real exam.', 'ex-mock:n4'],
    ],
    daily: ['15 min: reading (timed)', '15 min: listening (play once only)', '15 min: grammar points aloud', '15 min: vocabulary or kanji', 'Weekly: one full mock test, then study the mistake review'],
    tip: 'Most people fail on time, not knowledge: in reading, never spend more than 2 minutes stuck on one question. Mark a guess and move on.',
    tipHg: 'Zyada log time ki wajah se fail hote hain: ek sawaal pe 2 minute se zyada mat atko.',
    study: {},
    mock: 'n4',
  },
];
