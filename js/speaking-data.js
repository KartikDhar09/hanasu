// Speaking practice content.
// Line: [japanese, kana, romaji, english, hinglish]. Placeholders as in data.js ({name}, {country}…).

// Questions people really ask you, with natural answers you can say out loud.
export const QA = [
  { q: ['お名前は？', 'おなまえは？', 'o-namae wa?', 'What’s your name?', 'Aapka naam?'], pic: '🙋',
    a: [['{name}です。', '{name}です。', '{nameRo} desu.', 'I’m {nameRo}.', 'Main {nameRo} hoon.'],
      ['{name}と申します。', '{name}ともうします。', '{nameRo} to mōshimasu.', 'My name is {nameRo}. (polite)', 'Mera naam {nameRo} hai. (polite)']] },
  { q: ['どちらからですか。', 'どちらからですか。', 'dochira kara desu ka?', 'Where are you from?', 'Aap kahaan se hain?'], pic: '🌏',
    a: [['{country}から来ました。', '{countryKana}からきました。', '{countryRo} kara kimashita.', 'I’m from {countryEn}.', 'Main {countryHi} se hoon.'],
      ['{country}です。', '{countryKana}です。', '{countryRo} desu.', '{countryEn}.', '{countryHi}.']] },
  { q: ['日本に来て、どのくらいですか。', 'にほんにきて、どのくらいですか。', 'nihon ni kite, dono kurai desu ka?', 'How long have you been in Japan?', 'Japan aaye kitna time hua?'], pic: '🗾',
    a: [['三年です。', 'さんねんです。', 'sannen desu.', 'Three years.', 'Teen saal.'],
      ['もうすぐ一年です。', 'もうすぐいちねんです。', 'mō sugu ichinen desu.', 'Almost a year.', 'Lagbhag ek saal hone wala hai.']] },
  { q: ['お仕事は何ですか。', 'おしごとはなんですか。', 'o-shigoto wa nan desu ka?', 'What do you do for work?', 'Aap kya kaam karte hain?'], pic: '💼',
    a: [['エンジニアです。', 'エンジニアです。', 'enjinia desu.', 'I’m an engineer.', 'Main engineer hoon.'],
      ['工場で働いています。', 'こうじょうではたらいています。', 'kōjō de hataraite imasu.', 'I work at a factory.', 'Factory mein kaam karta/karti hoon.']] },
  { q: ['趣味は何ですか。', 'しゅみはなんですか。', 'shumi wa nan desu ka?', 'What are your hobbies?', 'Aapka shauk kya hai?'], pic: '🎨',
    a: [['料理です。', 'りょうりです。', 'ryōri desu.', 'Cooking.', 'Khaana banana.'],
      ['クリケットが好きです。', 'クリケットがすきです。', 'kuriketto ga suki desu.', 'I like cricket.', 'Mujhe cricket pasand hai.']] },
  { q: ['週末、何しましたか。', 'しゅうまつ、なにしましたか。', 'shūmatsu, nani shimashita ka?', 'What did you do at the weekend?', 'Weekend pe kya kiya?'], pic: '🛍️',
    a: [['買い物に行きました。', 'かいものにいきました。', 'kaimono ni ikimashita.', 'I went shopping.', 'Shopping gaye the.'],
      ['家でゆっくりしました。', 'いえでゆっくりしました。', 'ie de yukkuri shimashita.', 'I relaxed at home.', 'Ghar pe aaraam kiya.']] },
  { q: ['日本の食べ物で、何が好きですか。', 'にほんのたべもので、なにがすきですか。', 'nihon no tabemono de, nani ga suki desu ka?', 'What Japanese food do you like?', 'Japanese khaane mein kya pasand hai?'], pic: '🍜',
    a: [['ラーメンが好きです。', 'ラーメンがすきです。', 'rāmen ga suki desu.', 'I like ramen.', 'Mujhe ramen pasand hai.'],
      ['カレーライスが好きです。', 'カレーライスがすきです。', 'karē raisu ga suki desu.', 'I like curry rice.', 'Mujhe curry rice pasand hai.']] },
  { q: ['辛い物は大丈夫ですか。', 'からいものはだいじょうぶですか。', 'karai mono wa daijōbu desu ka?', 'Are you OK with spicy food?', 'Teekha chal jaata hai?'], pic: '🌶️',
    a: [['はい、大好きです！', 'はい、だいすきです！', 'hai, daisuki desu!', 'Yes, I love it!', 'Haan, bahut pasand hai!'],
      ['ちょっと苦手です。', 'ちょっとにがてです。', 'chotto nigate desu.', 'I’m not great with it.', 'Thoda mushkil hai mere liye.']] },
  { q: ['日本語は難しいですか。', 'にほんごはむずかしいですか。', 'nihongo wa muzukashii desu ka?', 'Is Japanese hard?', 'Japanese mushkil hai?'], pic: '📖',
    a: [['はい、ちょっと難しいです。', 'はい、ちょっとむずかしいです。', 'hai, chotto muzukashii desu.', 'Yes, a bit.', 'Haan, thoda mushkil hai.'],
      ['漢字が難しいです。', 'かんじがむずかしいです。', 'kanji ga muzukashii desu.', 'Kanji is the hard part.', 'Kanji mushkil hain.']] },
  { q: ['今日はどうやって来ましたか。', 'きょうはどうやってきましたか。', 'kyō wa dō yatte kimashita ka?', 'How did you get here today?', 'Aaj kaise aaye?'], pic: '🚲',
    a: [['電車で来ました。', 'でんしゃできました。', 'densha de kimashita.', 'By train.', 'Train se aaya/aayi.'],
      ['自転車で来ました。', 'じてんしゃできました。', 'jitensha de kimashita.', 'By bicycle.', 'Cycle se aaya/aayi.']] },
  { q: ['家族は何人ですか。', 'かぞくはなんにんですか。', 'kazoku wa nannin desu ka?', 'How many are in your family?', 'Aapke ghar mein kitne log hain?'], pic: '👨‍👩‍👧',
    a: [['四人です。', 'よにんです。', 'yonin desu.', 'Four.', 'Chaar log.'],
      ['両親と兄がいます。', 'りょうしんとあにがいます。', 'ryōshin to ani ga imasu.', 'My parents and an older brother.', 'Mummy-papa aur bade bhaiya hain.']] },
  { q: ['お昼、もう食べました？', 'おひる、もうたべました？', 'o-hiru, mō tabemashita?', 'Have you had lunch yet?', 'Lunch kar liya?'], pic: '🍱',
    a: [['はい、もう食べました。', 'はい、もうたべました。', 'hai, mō tabemashita.', 'Yes, already.', 'Haan, kar liya.'],
      ['いいえ、まだです。', 'いいえ、まだです。', 'iie, mada desu.', 'No, not yet.', 'Nahi, abhi nahi.']] },
  { q: ['明日は何時に来ますか。', 'あしたはなんじにきますか。', 'ashita wa nanji ni kimasu ka?', 'What time are you coming tomorrow?', 'Kal kitne baje aaoge?'], pic: '⏰',
    a: [['九時に来ます。', 'くじにきます。', 'kuji ni kimasu.', 'At nine.', 'Nau baje.'],
      ['八時半ごろ来ます。', 'はちじはんごろきます。', 'hachiji han goro kimasu.', 'Around 8:30.', 'Saadhe aath ke aas-paas.']] },
  { q: ['この仕事、できますか。', 'このしごと、できますか。', 'kono shigoto, dekimasu ka?', 'Can you do this job?', 'Ye kaam kar paoge?'], pic: '🛠️',
    a: [['はい、できます。', 'はい、できます。', 'hai, dekimasu.', 'Yes, I can.', 'Haan, kar lunga/lungi.'],
      ['すみません、ちょっと難しいです。', 'すみません、ちょっとむずかしいです。', 'sumimasen, chotto muzukashii desu.', 'Sorry, that’s a bit difficult.', 'Maaf kijiye, thoda mushkil hai.']] },
  { q: ['最近、忙しいですか。', 'さいきん、いそがしいですか。', 'saikin, isogashii desu ka?', 'Been busy lately?', 'Aajkal busy ho?'], pic: '📈',
    a: [['はい、ちょっと忙しいです。', 'はい、ちょっといそがしいです。', 'hai, chotto isogashii desu.', 'Yes, a bit busy.', 'Haan, thoda busy hoon.'],
      ['いいえ、そんなに。', 'いいえ、そんなに。', 'iie, sonna ni.', 'No, not really.', 'Nahi, itna nahi.']] },
  { q: ['今日はどうでした？', 'きょうはどうでした？', 'kyō wa dō deshita?', 'How was today?', 'Aaj kaisa raha?'], pic: '🌇',
    a: [['忙しかったです。', 'いそがしかったです。', 'isogashikatta desu.', 'It was busy.', 'Busy tha.'],
      ['楽しかったです！', 'たのしかったです！', 'tanoshikatta desu!', 'It was fun!', 'Mazaa aaya!']] },
];

// Self-introduction builder choices.
export const JOBS = [
  ['会社員です。', 'かいしゃいんです。', 'kaishain desu.', 'I’m an office worker.', 'Main office mein kaam karta/karti hoon.', '💼'],
  ['エンジニアです。', 'エンジニアです。', 'enjinia desu.', 'I’m an engineer.', 'Main engineer hoon.', '👨‍💻'],
  ['IT関係の仕事をしています。', 'ITかんけいのしごとをしています。', 'aitī kankei no shigoto o shite imasu.', 'I work in IT.', 'Main IT mein kaam karta/karti hoon.', '💻'],
  ['工場で働いています。', 'こうじょうではたらいています。', 'kōjō de hataraite imasu.', 'I work at a factory.', 'Main factory mein kaam karta/karti hoon.', '🏭'],
  ['介護の仕事をしています。', 'かいごのしごとをしています。', 'kaigo no shigoto o shite imasu.', 'I work in elderly care.', 'Main care worker hoon.', '🧓'],
  ['学生です。', 'がくせいです。', 'gakusei desu.', 'I’m a student.', 'Main student hoon.', '🎓'],
];
export const HOBBIES = [
  ['料理', 'りょうり', 'ryōri', 'cooking', 'khaana banana', '🍳'], ['映画', 'えいが', 'eiga', 'movies', 'movies', '🎬'],
  ['音楽', 'おんがく', 'ongaku', 'music', 'music', '🎵'], ['旅行', 'りょこう', 'ryokō', 'travel', 'ghoomna', '✈️'],
  ['クリケット', 'クリケット', 'kuriketto', 'cricket', 'cricket', '🏏'], ['サッカー', 'サッカー', 'sakkā', 'football', 'football', '⚽'],
  ['読書', 'どくしょ', 'dokusho', 'reading', 'kitaabein padhna', '📚'], ['ゲーム', 'ゲーム', 'gēmu', 'video games', 'games', '🎮'],
];
// Years in Japan: [label, japanese, kana, romaji]
export const YEARS = [
  ['< 1 year', 'まだ半年です。', 'まだはんとしです。', 'mada hantoshi desu.'],
  ['1', '一年', 'いちねん', 'ichinen'], ['2', '二年', 'にねん', 'ninen'], ['3', '三年', 'さんねん', 'sannen'], ['4', '四年', 'よねん', 'yonen'],
  ['5', '五年', 'ごねん', 'gonen'], ['6', '六年', 'ろくねん', 'rokunen'], ['7', '七年', 'ななねん', 'nananen'],
  ['8', '八年', 'はちねん', 'hachinen'], ['9', '九年', 'きゅうねん', 'kyūnen'], ['10+', '十年以上', 'じゅうねんいじょう', 'jūnen ijō'],
];

// Sounds that change the meaning. Each pair: two words with a picture; listen, pick, then say both.
export const PRONUNCIATION = [
  { title: 'Long vowels', hg: 'Lambi awaaz', tip: 'Hold a long vowel for twice as long. It changes the word completely, like “kam” vs “kaam” in Hindi.',
    pairs: [
      [['おばさん', 'obasan', 'aunt', 'aunty', '👩'], ['おばあさん', 'obāsan', 'grandmother', 'daadi / naani', '👵']],
      [['おじさん', 'ojisan', 'uncle', 'chacha / mama', '👨'], ['おじいさん', 'ojiisan', 'grandfather', 'daada / naana', '👴']],
      [['ゆき', 'yuki', 'snow', 'barf', '❄️'], ['ゆうき', 'yūki', 'courage', 'himmat', '🦁']],
      [['びよういん', 'biyōin', 'hair salon', 'salon', '💇'], ['びょういん', 'byōin', 'hospital', 'hospital', '🏥']],
    ] },
  { title: 'Small っ (double consonant)', hg: 'Chhota っ = ruko', tip: 'Small っ is a tiny pause before the next sound, like the double “t” in Hindi “patta” vs “pata”.',
    pairs: [
      [['きて', 'kite', 'come (please)', 'aao', '👋'], ['きって', 'kitte', 'postage stamp', 'dak ticket', '📮']],
      [['さか', 'saka', 'slope', 'dhalaan', '⛰️'], ['さっか', 'sakka', 'writer', 'lekhak', '✍️']],
      [['おと', 'oto', 'sound', 'awaaz', '🔊'], ['おっと', 'otto', 'husband', 'pati', '🤵']],
    ] },
  { title: 'つ vs す, じゆう vs じゅう', hg: 'Milti-julti awaazein', tip: 'つ is “ts” (like the end of “cats”). じゅう is one beat “ju”; じゆう is three beats “ji-yu-u”.',
    pairs: [
      [['つき', 'tsuki', 'moon', 'chaand', '🌙'], ['すき', 'suki', 'like', 'pasand', '❤️']],
      [['じゆう', 'jiyū', 'freedom', 'aazaadi', '🕊️'], ['じゅう', 'jū', 'ten', 'das', '🔟']],
    ] },
];

export const SOUND_TIPS = [
  ['です・ます', 'The final u is almost silent: です sounds like “des”, します like “shimas”.', 'Last “u” lagbhag gaayab: “des”, “shimas”.'],
  ['ら・り・る・れ・ろ', 'Japanese r is a light tap between r, l and d. Like the quick “r” in Hindi “bara”.', 'Halka sa “r”, jaise “bara” mein.'],
  ['ん', 'ん is a full beat on its own: こんにちは = ko-n-ni-chi-wa (5 beats).', 'ん ka bhi poora beat hota hai.'],
  ['Flat rhythm', 'Every kana gets the same length. No strong stress like English. Speak evenly, like a gentle drumbeat.', 'Har kana barabar lamba. Ek jaisi taal mein bolo.'],
];
