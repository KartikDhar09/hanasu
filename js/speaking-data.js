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

// ---- Sentence builder: workplace request patterns with swappable X / Y ----
// Slot item: [japanese, kana, romaji, english, hinglish]
export const SLOTS = {
  software: { label: 'Software', items: [
    ['エクセル', 'エクセル', 'ekuseru', 'Excel', 'Excel'], ['ワード', 'ワード', 'wādo', 'Word', 'Word'],
    ['チームズ', 'チームズ', 'chīmuzu', 'Teams', 'Teams'], ['ズーム', 'ズーム', 'zūmu', 'Zoom', 'Zoom'],
    ['スラック', 'スラック', 'surakku', 'Slack', 'Slack'], ['パイソン', 'パイソン', 'paison', 'Python', 'Python'],
    ['VSコード', 'ブイエスコード', 'bui-esu kōdo', 'VS Code', 'VS Code'], ['ギット', 'ギット', 'gitto', 'Git', 'Git'],
    ['クローム', 'クローム', 'kurōmu', 'Chrome', 'Chrome'], ['このソフト', 'このソフト', 'kono sofuto', 'this software', 'ye software'],
    ['テスト用のアプリ', 'テストようのアプリ', 'tesuto-yō no apuri', 'the test app', 'test wala app'],
    ['ウイルス対策ソフト', 'ウイルスたいさくソフト', 'uirusu taisaku sofuto', 'antivirus software', 'antivirus'],
  ] },
  device: { label: 'Device', items: [
    ['このパソコン', 'このパソコン', 'kono pasokon', 'this PC', 'is PC'], ['私のパソコン', 'わたしのパソコン', 'watashi no pasokon', 'my PC', 'mere PC'],
    ['新しいパソコン', 'あたらしいパソコン', 'atarashii pasokon', 'the new PC', 'naye PC'],
    ['テスト用のパソコン', 'テストようのパソコン', 'tesuto-yō no pasokon', 'the test PC', 'test wale PC'],
    ['スマホ', 'スマホ', 'sumaho', 'my phone', 'phone'], ['社用携帯', 'しゃようけいたい', 'shayō keitai', 'the work phone', 'office phone'],
    ['タブレット', 'タブレット', 'taburetto', 'the tablet', 'tablet'], ['サーバー', 'サーバー', 'sābā', 'the server', 'server'],
    ['開発サーバー', 'かいはつサーバー', 'kaihatsu sābā', 'the development server', 'development server'],
    ['検証機', 'けんしょうき', 'kenshōki', 'the test device', 'test device'],
  ] },
  resource: { label: 'Shared resource', items: [
    ['テスト環境', 'テストかんきょう', 'tesuto kankyō', 'the test environment', 'test environment'],
    ['検証環境', 'けんしょうかんきょう', 'kenshō kankyō', 'the staging environment', 'staging environment'],
    ['会議室', 'かいぎしつ', 'kaigishitsu', 'the meeting room', 'meeting room'], ['プロジェクター', 'プロジェクター', 'purojekutā', 'the projector', 'projector'],
    ['モニター', 'モニター', 'monitā', 'the monitor', 'monitor'], ['プリンター', 'プリンター', 'purintā', 'the printer', 'printer'],
    ['社用車', 'しゃようしゃ', 'shayōsha', 'the company car', 'company ki gaadi'],
    ['共有フォルダ', 'きょうゆうフォルダ', 'kyōyū foruda', 'the shared folder', 'shared folder'],
    ['データベース', 'データベース', 'dētabēsu', 'the database', 'database'],
  ] },
  network: { label: 'Connect to', items: [
    ['社内ネットワーク', 'しゃないネットワーク', 'shanai nettowāku', 'the office network', 'office network'],
    ['ワイファイ', 'ワイファイ', 'waifai', 'the Wi-Fi', 'Wi-Fi'], ['VPN', 'ブイピーエヌ', 'bui-pī-enu', 'the VPN', 'VPN'],
    ['モニター', 'モニター', 'monitā', 'the monitor', 'monitor'], ['プロジェクター', 'プロジェクター', 'purojekutā', 'the projector', 'projector'],
    ['プリンター', 'プリンター', 'purintā', 'the printer', 'printer'],
  ] },
};

// Pattern: { id, jp, kana, ro, en, hg, x: [slot groups], y?: [slot groups], tip? } with {X} / {Y} placeholders.
export const PATTERNS = [
  { id: 'install', jp: '{X}を{Y}にインストールしてもらえますか。', kana: '{X}を{Y}にインストールしてもらえますか。', ro: '{X} o {Y} ni insutōru shite moraemasu ka?',
    en: 'Could you install {X} on {Y}?', hg: '{X} ko {Y} pe install kar denge?', x: ['software'], y: ['device'],
    tip: 'To your boss: 〜していただけますか (more polite).' },
  { id: 'installed', jp: '{Y}に{X}は入っていますか。', kana: '{Y}に{X}ははいっていますか。', ro: '{Y} ni {X} wa haitte imasu ka?',
    en: 'Is {X} installed on {Y}?', hg: 'Kya {Y} mein {X} installed hai?', x: ['software'], y: ['device'],
    tip: '入っている (“is inside”) is how people say “installed” in conversation.' },
  { id: 'use', jp: '{X}を使ってもいいですか。', kana: '{X}をつかってもいいですか。', ro: '{X} o tsukatte mo ii desu ka?',
    en: 'Can I use {X}?', hg: 'Kya {X} use kar sakte hain?', x: ['software', 'device', 'resource'],
    tip: 'More polite: 使ってもよろしいですか。' },
  { id: 'test', jp: '{X}はテストに使えますか。', kana: '{X}はテストにつかえますか。', ro: '{X} wa tesuto ni tsukaemasu ka?',
    en: 'Is {X} available for testing?', hg: 'Kya {X} testing ke liye available hai?', x: ['device', 'resource'],
    tip: 'Also: テスト用に空いていますか (is it free for testing?).' },
  { id: 'free', jp: '{X}は今、空いていますか。', kana: '{X}はいま、あいていますか。', ro: '{X} wa ima, aite imasu ka?',
    en: 'Is {X} free right now?', hg: 'Kya {X} abhi free hai?', x: ['resource', 'device'] },
  { id: 'inuse', jp: '{X}、今使っていますか。', kana: '{X}、いまつかっていますか。', ro: '{X}, ima tsukatte imasu ka?',
    en: 'Are you using {X} right now?', hg: 'Kya aap abhi {X} use kar rahe hain?', x: ['resource', 'device'] },
  { id: 'whenfree', jp: '{X}はいつ空きますか。', kana: '{X}はいつあきますか。', ro: '{X} wa itsu akimasu ka?',
    en: 'When will {X} be free?', hg: '{X} kab free hoga?', x: ['resource', 'device'] },
  { id: 'book', jp: '{X}を予約したいんですが。', kana: '{X}をよやくしたいんですが。', ro: '{X} o yoyaku shitai n desu ga.',
    en: 'I’d like to book {X}.', hg: '{X} book karna tha.', x: ['resource', 'device'] },
  { id: 'access', jp: '{X}のアクセス権をもらえますか。', kana: '{X}のアクセスけんをもらえますか。', ro: '{X} no akusesu-ken o moraemasu ka?',
    en: 'Could I get access to {X}?', hg: 'Kya mujhe {X} ka access mil sakta hai?', x: ['software', 'resource'] },
  { id: 'account', jp: '{X}のアカウントを作ってもらえますか。', kana: '{X}のアカウントをつくってもらえますか。', ro: '{X} no akaunto o tsukutte moraemasu ka?',
    en: 'Could you create a {X} account for me?', hg: 'Mere liye {X} ka account bana denge?', x: ['software', 'resource'] },
  { id: 'howto', jp: '{X}の使い方を教えてもらえますか。', kana: '{X}のつかいかたをおしえてもらえますか。', ro: '{X} no tsukaikata o oshiete moraemasu ka?',
    en: 'Could you show me how to use {X}?', hg: '{X} use karna sikha denge?', x: ['software', 'device', 'resource'] },
  { id: 'borrow', jp: '{X}をちょっと借りてもいいですか。', kana: '{X}をちょっとかりてもいいですか。', ro: '{X} o chotto karite mo ii desu ka?',
    en: 'May I borrow {X} for a bit?', hg: 'Kya {X} thodi der ke liye le sakte hain?', x: ['device', 'resource'] },
  { id: 'connect', jp: '{X}を{Y}につなぎたいんですが。', kana: '{X}を{Y}につなぎたいんですが。', ro: '{X} o {Y} ni tsunagitai n desu ga.',
    en: 'I’d like to connect {X} to {Y}.', hg: '{X} ko {Y} se connect karna tha.', x: ['device'], y: ['network'] },
  { id: 'update', jp: '{X}をアップデートしてもいいですか。', kana: '{X}をアップデートしてもいいですか。', ro: '{X} o appudēto shite mo ii desu ka?',
    en: 'Is it OK to update {X}?', hg: 'Kya {X} update kar sakte hain?', x: ['software'] },
  { id: 'manager', jp: '{X}は誰が管理していますか。', kana: '{X}はだれがかんりしていますか。', ro: '{X} wa dare ga kanri shite imasu ka?',
    en: 'Who manages {X}?', hg: '{X} kaun manage karta hai?', x: ['software', 'device', 'resource'] },
  { id: 'return', jp: 'テストが終わったら、{X}を返します。', kana: 'テストがおわったら、{X}をかえします。', ro: 'tesuto ga owattara, {X} o kaeshimasu.',
    en: 'I’ll return {X} when the test is done.', hg: 'Test khatam hone ke baad {X} lauta denge.', x: ['device', 'resource'] },
];

// Fills a pattern with slot items ([jp, kana, romaji, english, hinglish]); returns a phrase line.
export function buildSentence(p, x, y) {
  const put = (s, i) => s.replaceAll('{X}', x[i]).replaceAll('{Y}', y ? y[i] : '');
  const ro = put(p.ro, 2);
  return [put(p.jp, 0), put(p.kana, 1), ro, put(p.en, 3), put(p.hg, 4)];
}

// A slot item from text the user typed (e.g. a tool name). Kana/katakana gets romaji; anything else is kept as is.
export function customItem(text, toRomaji) {
  const t = text.trim();
  const kanaOnly = /^[぀-ヿー・]+$/.test(t);
  return [t, t, kanaOnly ? toRomaji(t) : t, t, t];
}
