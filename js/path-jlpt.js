// JLPT path: 13 levels from the first hiragana to passing the N4 mock test.
// Every N5/N4 grammar point, kanji group, vocabulary topic and particle belongs to exactly one level (check.mjs).
//
// Level fields
//   steps  [icon, title, how to do it, target]; target is '#hash' or 'action:arg' ('' = no link)
//   study  content taught in this level: particles, grammar, kanji (group ids), vocab (topic ids), units
//   daily  a day's routine for this level
//   test   { pass: % to pass, kana: 'hira' | 'kata' (generated reading questions), n: how many, qs: authored questions }
//          or { mock: 'n5' | 'n4' } (pass the full-length mock test in the JLPT tab)
//
// Authored questions, one per line (right answer first; options are shuffled when shown):
//   g|sentence with the [answer]|kana with the [answer]|English|wrong|wrong|wrong   fill in the grammar
//   r|word|right reading|wrong|wrong|wrong                                           how is it read?
//   m|word|kana|right meaning|wrong|wrong|wrong                                      what does it mean?
//   w|English|right Japanese|wrong|wrong|wrong                                       which is the Japanese?
//   l|Japanese|kana|right meaning|wrong|wrong|wrong                                  listen, then choose
//   p|passage|question|question in English|right|wrong|wrong|wrong                   short reading

export const PATH_JLPT_INTRO = {
  en: 'Thirteen levels take you from the first hiragana to passing the JLPT N4. Each level says what you will be able to do, what to study in what order, and a daily routine. Finish it by passing the level test, and the next level opens. Already know some Japanese? Take any level’s test: passing it moves you straight there.',
  hg: 'Tera level sirf is phone par save hota hai: aur kuch nahi. Pehle se thodi Japanese aati hai? Kisi bhi level ka test do, pass karo aur seedha wahan pahunch jao.',
};

export const PATH_JLPT = [
  {
    id: 'j1', icon: 'あ', title: 'Hiragana', part: 'Start', time: '1 week · 20–30 min a day',
    goal: 'Read and say all 46 hiragana, the voiced sounds (が, ぱ…) and combinations like きゃ and small っ.',
    goalHg: 'Saare hiragana padh aur bol paoge. Yahi Japanese ki neev hai.',
    steps: [
      ['あ', 'Learn the basic chart, two rows a day', 'Open the hiragana chart. Tap each kana, listen, and say it back out loud three times. Day 1: あ and か rows. Day 2: さ and た. Day 3: な and は. Day 4: ま, や, ら. Day 5: わ, を, ん.', '#jlpt/kana'],
      ['✍️', 'Write each one on paper', 'Writing by hand fixes the shape in memory. Write each new row five times while saying the sound.', ''],
      ['゛', 'Add the ゛ and ゜ sounds', 'Two dots make a sound voiced: か → が, さ → ざ, た → だ, は → ば. A small circle makes は → ぱ. Same shapes, so this takes one day.', '#jlpt/kana'],
      ['ゃ', 'Combinations and small っ', 'A small ゃ ゅ ょ joins the kana before it: き + ゃ = きゃ (kya). A small っ doubles the next sound: きって = kitte (stamp). Long vowels: おかあさん = okāsan.', '#jlpt/kana'],
      ['🎯', 'Hiragana quiz every day', 'Do the hiragana quiz until you score 90% or more twice in a row.', 'kana-quiz:hira'],
      ['👋', 'Read your first real words', 'Open Greetings and read the kana line under each phrase before you play it. You can read real Japanese already.', '#unit/greet'],
    ],
    daily: ['10 min: new rows, each kana said aloud 3 times', '5 min: write them from memory', '5 min: hiragana quiz', 'Read any hiragana you see around you: shop signs, packets, station names'],
    tip: 'Hindi already gives you the system: each kana is one syllable, and the order a-i-u-e-o, ka-ki-ku-ke-ko works just like ka-kii-ku-ke-ko.',
    tipHg: 'Hindi jaisa hi system hai: har akshar ek awaaz.',
    study: {},
    test: { pass: 85, kana: 'hira', n: 20 },
  },
  {
    id: 'j2', icon: 'ア', title: 'Katakana & first phrases', part: 'Start', time: '1–2 weeks · 30 min a day',
    goal: 'Read katakana words (コーヒー, パソコン, インド), and greet, thank, apologise and ask someone to repeat.',
    goalHg: 'Katakana padh paoge aur basic greetings, thank you, sorry bol paoge.',
    steps: [
      ['ア', 'Learn katakana the same way', 'Two rows a day, out loud. Katakana is for foreign words and names: インド (India), コーヒー (coffee). The long mark ー stretches the vowel.', '#jlpt/kana'],
      ['☕', 'Katakana words', 'Flashcards for the katakana loanwords: most are English words you already know, so guess first, then check.', 'vlearn:n5-katakana'],
      ['🎯', 'Katakana quiz', 'Score 90% or more twice in a row.', 'kana-quiz:kata'],
      ['👋', 'Greetings and “I don’t understand”', 'In each unit below: Learn (flashcards) first, then Speak (say it, get checked), then the Quiz. These are the phrases you will use every single day.', ''],
    ],
    daily: ['10 min: katakana rows, aloud', '10 min: one phrase unit (Learn, then Speak)', '5 min: katakana quiz', 'Use one greeting for real today: おはようございます to a coworker, ありがとうございます at a shop'],
    tip: 'Katakana words follow Japanese sounds: “computer” becomes パソコン (pasokon), “McDonald’s” マクドナルド. Say them the Japanese way or people won’t understand.',
    tipHg: 'English shabd bhi Japanese awaaz mein bolo: pasokon, konbini.',
    study: { vocab: ['n5-katakana'], units: ['greet', 'help'] },
    test: {
      pass: 80, kana: 'kata', n: 12, qs: `
m|コーヒー|こーひー|coffee|tea|juice|milk
m|パソコン|ぱそこん|computer|smartphone|television|camera
m|エレベーター|えれべーたー|lift (elevator)|escalator|stairs|exit
w|Thank you very much.|ありがとうございます。|すみません。|おはようございます。|さようなら。
w|Excuse me. / Sorry.|すみません。|いただきます。|おやすみなさい。|はじめまして。
w|Nice to meet you. (first meeting)|はじめまして。|おつかれさまです。|いってきます。|ごちそうさまでした。
w|Good morning.|おはようございます。|こんばんは。|おやすみなさい。|こんにちは。
l|もう一度お願いします。|もういちどおねがいします。|One more time, please.|Please speak slowly.|I don’t understand.|Thank you very much.`,
    },
  },
  {
    id: 'j3', icon: '🔢', title: 'Nouns, numbers & time', part: 'N5 · 1 of 5', time: '2–3 weeks · 30–45 min a day',
    goal: 'Say what things are and who people are, ask “what / where / who”, count, and tell the time, day and date: これは何ですか。今、三時です。',
    goalHg: 'Cheez kya hai, kaun hai, kitne baje hain, aaj kaunsa din hai: yeh sab bol aur samajh paoge.',
    steps: [
      ['の', 'Particles は・の・も・か・や・と', 'Open each particle below. Play every example and repeat it. Then take the quiz on the Particles page.', '#particles'],
      ['📘', 'Grammar points, in order', 'For each point: read the pattern, play every example aloud, then cover the English and say what it means. Do the N5 grammar quiz at the end.', ''],
      ['🔢', 'Numbers, time and counters', 'Numbers to 10,000, then 時 (o’clock), 分 (minutes), days of the week and dates. On the Counters page learn つ, 人, 本, 枚 first.', '#counters'],
      ['漢', 'Kanji: numbers and time', 'In each group: Learn this group (flashcards) until you know every kanji, then watch its stroke order once.', ''],
      ['🍙', 'Vocabulary', 'Flashcards, 12 words at a time. Say each word aloud before you turn the card.', ''],
      ['💬', 'Phrase units', 'Introducing yourself and Time & days: Learn, Speak, Quiz, then the Role-play.', ''],
    ],
    daily: ['10 min: one grammar point with its examples', '10 min: vocabulary flashcards', '10 min: kanji flashcards', '5 min: say the time, day and date out loud whenever you look at a clock'],
    tip: 'Dates 1–10 are irregular: 1st ついたち, 2nd ふつか, 3rd みっか … 10th とおか. So are 14th じゅうよっか, 20th はつか and 24th にじゅうよっか. Learn them like a song.',
    tipHg: 'Tareekhein ulti-seedhi hain: inko gaane ki tarah yaad karo.',
    study: {
      particles: ['wa', 'no', 'mo', 'ka', 'ya', 'to'],
      grammar: ['desu', 'formalneg', 'deshita', 'kosoado', 'aru', 'counters', 'tachi', 'momo'],
      kanji: ['num', 'time'],
      vocab: ['n5-numbers', 'n5-calendar', 'n5-clock', 'n5-kosoado', 'n5-people', 'n5-family2'],
      units: ['intro', 'time'],
    },
    test: {
      pass: 80, qs: `
g|これは[何]ですか。|これは[なん]ですか。|What is this?|だれ|どこ|いつ
g|わたし[は]学生です。|わたし[は]がくせいです。|I am a student.|を|に|で
g|これは私[の]かばんです。|これはわたし[の]かばんです。|This is my bag.|は|を|へ
g|田中さん[も]会社員です。|たなかさん[も]かいしゃいんです。|Tanaka-san is an office worker too.|を|へ|で
g|トイレは[どこ]ですか。|トイレは[どこ]ですか。|Where is the toilet?|なに|だれ|いくら
g|りんご[と]みかんがあります。|りんご[と]みかんがあります。|There are apples and mandarins.|を|で|へ
g|あそこに猫が[います]。|あそこにねこが[います]。|There’s a cat over there.|あります|です|します
g|机の上に本が[あります]。|つくえのうえにほんが[あります]。|There’s a book on the desk.|います|します|きます
g|昨日は日曜日[でした]。|きのうはにちようび[でした]。|Yesterday was Sunday.|です|でしょう|ます
g|私は先生[ではありません]。|わたしはせんせい[ではありません]。|I am not a teacher.|ではありました|ありません|でした
r|三時|さんじ|さんし|みじ|さんぢ
r|四月|しがつ|よんがつ|よがつ|しげつ
r|六百|ろっぴゃく|ろくひゃく|ろっひゃく|ろくびゃく
r|九日|ここのか|くにち|きゅうか|ここか
m|お父さん|おとうさん|(someone’s) father|mother|older brother|grandfather
w|What time is it now?|今、何時ですか。|今、何曜日ですか。|今、いくらですか。|今、何人ですか。`,
    },
  },
  {
    id: 'j4', icon: '🏃', title: 'Verbs & daily life', part: 'N5 · 2 of 5', time: '3 weeks · 30–45 min a day',
    goal: 'Talk about what you do, did and will do: where, when, with whom and how. Invite someone: 一緒に行きませんか。',
    goalHg: 'Roz kya karte ho, kal kya kiya, kahan gaye, kiske saath: yeh sab bol paoge. Kisi ko invite bhi kar paoge.',
    steps: [
      ['🏃', 'Verbs: the ます form', 'On the Verbs page learn the three verb groups and the ます / ません / ました / ませんでした forms. Say each form aloud.', '#verbs'],
      ['の', 'Particles を・に・で・へ・から・まで', 'These say what, where, when and how. Learn each one with its examples, then take the particle quiz.', '#particles'],
      ['📘', 'Grammar points, in order', 'Same method: pattern, examples aloud, then say the meaning with the English covered.', ''],
      ['漢', 'Kanji: people and places', 'Learn this group (flashcards), then the stroke order.', ''],
      ['🍙', 'Vocabulary', 'The N5 verbs list is long (106). Do 12 a day and say a sentence with each: 毎朝コーヒーを飲みます。', ''],
      ['💬', 'Phrase units', 'Directions & trains, Shopping: Learn, Speak, Quiz, Role-play. Then use them for real at a station or shop.', ''],
    ],
    daily: ['10 min: one grammar point', '15 min: verbs and vocabulary flashcards', '10 min: kanji', '5 min: say your day out loud in ます form: 七時に起きます。電車で会社へ行きます。'],
    tip: 'へ is read “e” and を is read “o” when they are particles. Time words like 今日 and 明日 take no に; clock times and days do: 七時に, 月曜日に.',
    tipHg: 'Particle he ko “e” aur wo ko “o” padhte hain.',
    study: {
      particles: ['o', 'ni', 'de', 'e', 'kara', 'made'],
      grammar: ['masu', 'mashita', 'masenka', 'mashou', 'mashouka', 'nipurpose', 'issho', 'freq', 'goro', 'gurai', 'ka-or', 'nanimo'],
      kanji: ['people', 'place'],
      vocab: ['n5-verbs', 'n5-places', 'n5-places2', 'n5-transport', 'n5-transport2', 'n5-position', 'n5-time'],
      units: ['way', 'shop'],
    },
    test: {
      pass: 80, qs: `
g|毎朝コーヒー[を]飲みます。|まいあさコーヒー[を]のみます。|I drink coffee every morning.|に|で|へ
g|図書館[で]勉強します。|としょかん[で]べんきょうします。|I study at the library.|を|に|と
g|七時[に]起きます。|しちじ[に]おきます。|I get up at seven.|で|を|へ
g|明日、東京[へ]行きます。|あした、とうきょう[へ]いきます。|Tomorrow I’ll go to Tokyo.|を|で|が
g|会社は九時[から]五時までです。|かいしゃはくじ[から]ごじまでです。|Work is from nine to five.|まで|に|で
g|昨日は何も食べ[ませんでした]。|きのうはなにもたべ[ませんでした]。|I didn’t eat anything yesterday.|ました|ます|ましょう
g|一緒に昼ご飯を食べ[ませんか]。|いっしょにひるごはんをたべ[ませんか]。|Won’t you have lunch with me?|ましたか|ません|ました
g|デパートへ服を買い[に]行きます。|デパートへふくをかい[に]いきます。|I’m going to the department store to buy clothes.|で|を|と
g|友達[と]映画を見ました。|ともだち[と]えいがをみました。|I watched a film with a friend.|を|が|へ
g|バス[で]駅まで行きます。|バス[で]えきまでいきます。|I go to the station by bus.|を|が|に
g|一週間[に]二回ジムへ行きます。|いっしゅうかん[に]にかいジムへいきます。|I go to the gym twice a week.|で|を|と
g|毎日八時間[ぐらい]寝ます。|まいにちはちじかん[ぐらい]ねます。|I sleep about eight hours a day.|ごろ|まで|から
r|学校|がっこう|がくこう|かっこう|がこう
r|駅|えき|えさ|いき|やく
m|右|みぎ|right (side)|left|front|behind
w|Let’s go together.|一緒に行きましょう。|一緒に行きました。|一人で行きます。|一緒に行きません。`,
    },
  },
  {
    id: 'j5', icon: '🍜', title: 'Adjectives, likes & wants', part: 'N5 · 3 of 5', time: '3 weeks · 30–45 min a day',
    goal: 'Describe people, places and food, say what you like and want, and compare: 東京は大阪より大きいです。',
    goalHg: 'Cheezon ko describe karna, pasand-napasand batana aur do cheezon ko compare karna.',
    steps: [
      ['🌸', 'い- and な-adjectives', 'The two adjective types change differently: 高い → 高くない → 高かった, but 静か → 静かじゃない → 静かでした. Learn both tables from the grammar points.', ''],
      ['の', 'Particles が・より・ね・よ', 'が for likes, wants and skills; より for comparing; ね and よ at the end of a sentence. Learn each, then the particle quiz.', '#particles'],
      ['📘', 'Grammar points, in order', 'Pattern, examples aloud, then say the meaning with the English covered. Finish with the N5 grammar quiz.', ''],
      ['漢', 'Kanji: nature and describing words', 'Learn this group, then the stroke order.', ''],
      ['🍙', 'Vocabulary', 'Food, clothes, hobbies and all the adjectives. Make a pair for each adjective: 高い ↔ 安い, 広い ↔ 狭い.', ''],
      ['💬', 'Phrase units', 'At a restaurant, Likes & plans: Learn, Speak, Quiz, Role-play.', ''],
    ],
    daily: ['10 min: one grammar point', '15 min: vocabulary', '10 min: kanji', '5 min: describe three things around you: この部屋は広くないです。'],
    tip: 'Never say 寒いでした. For い-adjectives the past is in the adjective itself: 寒かったです.',
    tipHg: '“samui deshita” galat hai: “samukatta desu” sahi hai.',
    study: {
      particles: ['ga', 'yori', 'ne', 'yo'],
      grammar: ['iadj', 'naadj', 'adjnoun', 'suki', 'hoshii', 'tai', 'takunai', 'yori', 'ichiban', 'dochira', 'adverb', 'kute', 'amari', 'zenzen', 'waga', 'ga-but'],
      kanji: ['nature', 'adj'],
      vocab: ['n5-adj', 'n5-iadj', 'n5-naadj', 'n5-food', 'n5-food2', 'n5-clothes', 'n5-hobbies'],
      units: ['food', 'plans'],
    },
    test: {
      pass: 80, qs: `
g|このラーメンは[おいしくない]です。|このラーメンは[おいしくない]です。|This ramen isn’t tasty.|おいしいじゃない|おいしではない|おいしいくない
g|昨日は[寒かった]です。|きのうは[さむかった]です。|It was cold yesterday.|寒いでした|寒くかった|寒いかった
g|ここは[静かな]公園です。|ここは[しずかな]こうえんです。|This is a quiet park.|静か|静かの|静かい
g|私はカレー[が]好きです。|わたしはカレー[が]すきです。|I like curry.|を|で|に
g|新しいパソコン[が]ほしいです。|あたらしいパソコン[が]ほしいです。|I want a new computer.|に|で|と
g|日本の映画が見[たい]です。|にほんのえいががみ[たい]です。|I want to see Japanese films.|ほしい|すき|ましょう
g|東京は大阪[より]大きいです。|とうきょうはおおさか[より]おおきいです。|Tokyo is bigger than Osaka.|から|まで|ほう
g|果物の中でりんごが[いちばん]好きです。|くだもののなかでりんごが[いちばん]すきです。|Of all fruit, I like apples best.|もっと|ほう|まで
g|この店は安く[て]おいしいです。|このみせはやすく[て]おいしいです。|This shop is cheap and good.|で|と|に
g|私の部屋はきれい[で]広いです。|わたしのへやはきれい[で]ひろいです。|My room is clean and spacious.|て|くて|な
g|納豆は[あまり]好きじゃありません。|なっとうは[あまり]すきじゃありません。|I don’t like natto very much.|とても|よく|いちばん
g|象は鼻[が]長いです。|ぞうははな[が]ながいです。|Elephants have long trunks.|を|に|で
g|日本語は難しいです[が]、おもしろいです。|にほんごはむずかしいです[が]、おもしろいです。|Japanese is hard, but interesting.|から|と|で
r|高い|たかい|たがい|こうい|だかい
m|暑い|あつい|hot (weather)|cold (weather)|busy|far
w|Which do you like better, tea or coffee?|お茶とコーヒーと、どちらが好きですか。|お茶とコーヒーと、どこが好きですか。|お茶とコーヒーと、だれが好きですか。|お茶とコーヒーと、いつが好きですか。`,
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
    test: {
      pass: 80, qs: `
g|ちょっと待っ[て]ください。|ちょっとまっ[て]ください。|Please wait a moment.|た|で|に
g|ここに名前を書い[て]ください。|ここになまえをかい[て]ください。|Please write your name here.|で|た|に
g|今、雨が降っ[ています]。|いま、あめがふっ[ています]。|It’s raining now.|てください|ましょう|たいです
g|写真を撮っ[てもいいですか]。|しゃしんをとっ[てもいいですか]。|May I take a photo?|てはいけません|てください|ています
g|ここでたばこを吸っ[てはいけません]。|ここでたばこをすっ[てはいけません]。|You must not smoke here.|てもいいです|てください|ています
g|手を洗っ[てから]、ご飯を食べます。|てをあらっ[てから]、ごはんをたべます。|I eat after washing my hands.|まえに|たり|ながら
g|朝起きて、顔を洗っ[て]、会社へ行きます。|あさおきて、かおをあらっ[て]、かいしゃへいきます。|I get up, wash my face and go to work.|た|で|に
g|いいえ、まだ食べ[ていません]。|いいえ、まだたべ[ていません]。|No, I haven’t eaten yet.|ませんでした|ました|ましょう
g|この漢字の読み[方]を教えてください。|このかんじのよみ[かた]をおしえてください。|Please tell me how to read this kanji.|こと|ところ|とき
g|部屋を[きれいに]します。|へやを[きれいに]します。|I’ll tidy the room (make it clean).|きれいく|きれいな|きれい
g|暖かく[なりました]ね。|あたたかく[なりました]ね。|It’s got warmer, hasn’t it?|ありました|でした|います
g|私はコーヒー[にします]。|わたしはコーヒー[にします]。|I’ll have coffee. (choosing)|がします|をします|でします
g|お茶[でも]飲みませんか。|おちゃ[でも]のみませんか。|How about some tea or something?|しか|まで|より
r|休む|やすむ|きゅうむ|やずむ|よすむ
m|聞く|きく|to listen / to ask|to speak|to read|to write
w|Please don’t forget.|忘れないでください。|忘れてください。|忘れてもいいです。|忘れました。`,
    },
  },
  {
    id: 'j7', icon: '🔗', title: 'Plain form & joining sentences', part: 'N5 · 5 of 5', time: '3 weeks · 30–45 min a day',
    goal: 'Use the plain (dictionary) form, say before / after / when / because, and describe things with whole sentences: 母が作ったケーキ.',
    goalHg: 'Plain form, pehle / baad mein / jab / kyunki: lambe sentence bana paoge.',
    steps: [
      ['🏃', 'Plain forms', 'On the Verbs page learn the dictionary, ない and た forms. Friends and family use these; you need them inside longer sentences too.', '#verbs'],
      ['📘', 'Grammar points, in order', 'Pattern, examples aloud, meaning with the English covered. Then the N5 grammar quiz once more: aim for 80%.', ''],
      ['★', 'Sentence order', 'Do the N5 ★ drill: it trains exactly the joining you learn here.', 'order:n5'],
      ['漢', 'Last N5 kanji', 'Then the full N5 kanji quiz on the Kanji page (N5): aim for 80%.', '#kanji'],
      ['🍙', 'Last N5 words', 'Then the N5 picture quiz: aim for 80%.', 'vocab-quiz:n5'],
    ],
    daily: ['10 min: one grammar point', '10 min: plain-form drill', '10 min: N5 vocabulary review', '10 min: ★ sentence order or the kanji quiz'],
    tip: 'A describing sentence goes before the noun, in plain form: 昨日買った本 (the book I bought yesterday). No です or ます inside it.',
    tipHg: 'Noun ko describe karne wala hissa pehle aata hai, plain form mein.',
    study: {
      grammar: ['plain', 'naide', 'mae', 'toki', 'tari', 'relative', 'no-one', 'kara-because', 'kedo', 'deshou', 'toiu', 'dake', 'shika', 'madeni', 'chuu', 'nanika', 'donna', 'why'],
      kanji: ['n5-school2'],
      vocab: ['n5-more'],
    },
    test: {
      pass: 80, qs: `
g|昨日は忙しかった[けど]、楽しかった。|きのうはいそがしかった[けど]、たのしかった。|Yesterday was busy, but fun.|から|と|まで
g|雨が降っている[から]、タクシーで行きましょう。|あめがふっている[から]、タクシーでいきましょう。|It’s raining, so let’s go by taxi.|けど|まで|より
g|寝る[前に]、歯を磨きます。|ねる[まえに]、はをみがきます。|I brush my teeth before going to bed.|あとで|てから|たり
g|ご飯を食べた[後で]、散歩します。|ごはんをたべた[あとで]、さんぽします。|After eating, I take a walk.|前に|ながら|まで
g|子供の[とき]、インドに住んでいました。|こどもの[とき]、インドにすんでいました。|When I was a child, I lived in India.|まえ|あと|から
g|週末は映画を見[たり]、買い物をしたりします。|しゅうまつはえいがをみ[たり]、かいものをしたりします。|At weekends I watch films, go shopping and so on.|て|ながら|から
g|これは母が[作った]ケーキです。|これはははが[つくった]ケーキです。|This is a cake my mother made.|作りました|作って|作るの
g|ここに車を止め[ないでください]。|ここにくるまをとめ[ないでください]。|Please don’t park here.|てください|てもいいです|ましょう
g|赤いのは高いです。白い[の]をください。|あかいのはたかいです。しろい[の]をください。|The red one is expensive. The white one, please.|こと|が|な
g|明日は雨が降る[でしょう]。|あしたはあめがふる[でしょう]。|It will probably rain tomorrow.|です|ます|ました
g|これは「たこ焼き」[という]食べ物です。|これは「たこやき」[という]たべものです。|This is a food called takoyaki.|とする|の|が言う
g|財布に千円[しか]ありません。|さいふにせんえん[しか]ありません。|I only have 1,000 yen in my wallet.|だけ|まで|から
g|金曜日[までに]レポートを出してください。|きんようび[までに]レポートをだしてください。|Please hand in the report by Friday.|まで|から|で
g|[どうして]日本語を勉強していますか。|[どうして]にほんごをべんきょうしていますか。|Why are you studying Japanese?|どんな|どれ|どこ
r|会社|かいしゃ|がいしゃ|かいじゃ|けいしゃ
m|毎週|まいしゅう|every week|every day|every month|this week
p|わたしは毎朝六時に起きます。シャワーをあびて、パンを食べます。七時半に家を出て、電車で会社へ行きます。|この人は家を出る前に何をしますか。|What does this person do before leaving home?|シャワーをあびて、パンを食べます。|電車に乗ります。|会社へ行きます。|六時に寝ます。`,
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
      ['✏️', 'Grammar quiz and ★', 'Grammar quiz and sentence order until both are 80%+.', 'gquiz:n5'],
      ['⚡', 'Quick mock', 'About 30 questions with no clock: find your weakest part, then go back to it.', 'ex-mock-start:n5.quick'],
      ['🏁', 'Full mock test', 'Three papers with their own clocks, like the real exam. Pass it to finish this level.', 'ex-mock:n5'],
    ],
    daily: ['15 min: reading (one passage, timed)', '15 min: listening (play once only)', '15 min: grammar quiz or ★', 'Weekly: one full mock test, then study the mistake review'],
    tip: 'The real JLPT is held in Japan on the first Sunday of July and of December. Applications open months before (around March for July, August for December): check jlpt.jp.',
    tipHg: 'Asli JLPT July aur December mein hota hai. Form pehle bharna padta hai: jlpt.jp dekho.',
    study: {},
    test: { mock: 'n5' },
  },
  {
    id: 'j9', icon: '🤔', title: 'Can, plan, think & must', part: 'N4 · 1 of 4', time: '3–4 weeks · 45 min a day',
    goal: 'Say what you can do, have done and plan to do, what you think, and what you must or don’t have to do: 日本語が話せます。行こうと思っています。',
    goalHg: 'Kya kar sakte ho, kya kiya hai, kya plan hai, kya sochte ho, kya karna zaroori hai.',
    steps: [
      ['🏃', 'Potential and volitional forms', 'On the Verbs page: 話す → 話せる (can speak), 行く → 行こう (let’s go). Drill ten verbs a day in both forms.', '#verbs'],
      ['📘', 'Grammar points, in order', 'Pattern, examples aloud, meaning with the English covered. Then the N4 grammar quiz.', ''],
      ['漢', 'N4 kanji: work, home, moving', 'Learn this group, then the stroke order. N4 adds about 190 kanji: steady groups beat cramming.', ''],
      ['🍙', 'Vocabulary', 'Work, daily life, study, technology and time words.', ''],
      ['🏢', 'Office phrase units', 'Office greetings, First day at work, Asking for help, Taking instructions: Learn, Speak, Role-play.', ''],
    ],
    daily: ['10 min: one grammar point', '15 min: vocabulary', '10 min: N4 kanji', '10 min: review N5 (one quiz) so it doesn’t fade'],
    tip: 'N4 includes everything in N5. Keep one N5 quiz a week in your routine.',
    tipHg: 'N4 mein poora N5 bhi aata hai: hafte mein ek N5 quiz karte raho.',
    study: {
      grammar: ['dekiru', 'potential', 'takotogaaru', 'kotogaaru', 'tsumori', 'volitional', 'yotei', 'toomou', 'itteita', 'kamo', 'darou', 'kana-wonder', 'houga', 'taradou', 'nakereba', 'naitoikenai', 'nakutemo', 'kamawanai', 'ndesu'],
      kanji: ['n4-work', 'n4-life', 'n4-move'],
      vocab: ['n4-work', 'n4-life', 'n4-verbs', 'n4-time3', 'n4-study2', 'n4-tech'],
      units: ['o-greet', 'o-intro', 'o-ask', 'o-task'],
    },
    test: {
      pass: 80, qs: `
g|私は漢字を読む[ことができます]。|わたしはかんじをよむ[ことができます]。|I can read kanji.|ことがあります|つもりです|ほうがいいです
g|日本語で電話が[かけられます]か。|にほんごででんわが[かけられます]か。|Can you make phone calls in Japanese?|かけさせます|かけます|かけています
g|富士山に登った[ことがあります]か。|ふじさんにのぼった[ことがあります]か。|Have you ever climbed Mt Fuji?|ことができます|ようにします|ています
g|来年、日本の大学に入る[つもりです]。|らいねん、にほんのだいがくにはいる[つもりです]。|I intend to go to a Japanese university next year.|ことがあります|たことです|ばかりです
g|明日は雨が降る[と思います]。|あしたはあめがふる[とおもいます]。|I think it will rain tomorrow.|と言いました|つもりです|ことがあります
g|週末は京都へ行こう[と思っています]。|しゅうまつはきょうとへいこう[とおもっています]。|I’m thinking of going to Kyoto at the weekend.|ことができます|つもりです|ています
g|もしかしたら、遅れる[かもしれません]。|もしかしたら、おくれる[かもしれません]。|I might be late.|なければなりません|てもいいです|つもりです
g|明日までにこれを[出さなければなりません]。|あしたまでにこれを[ださなければなりません]。|I have to hand this in by tomorrow.|出さなくてもいいです|出してもいいです|出したことがあります
g|熱がありますね。早く寝た[ほうがいいです]よ。|ねつがありますね。はやくねた[ほうがいいです]よ。|You have a fever. You’d better go to bed early.|ことがあります|つもりです|かもしれません
g|ネクタイはしなく[てもいいです]。|ネクタイはしなく[てもいいです]。|You don’t have to wear a tie.|てはいけません|ければなりません|たいです
g|田中さんは明日来ない[と言っていました]。|たなかさんはあしたこない[といっていました]。|Tanaka-san said they aren’t coming tomorrow.|ことがあります|つもりです|ほうがいいです
g|どうして遅れた[んですか]。|どうしておくれた[んですか]。|Why were you late? (asking for an explanation)|ことですか|ものですか|ましたか
r|研究|けんきゅう|けんく|げんきゅう|けんきゅ
r|旅行|りょこう|りょうこう|りょごう|りよこう
m|準備|じゅんび|preparation|experience|explanation|reservation
w|You’d better ask the teacher.|先生に聞いたほうがいいですよ。|先生に聞いたことがありますよ。|先生に聞くつもりですよ。|先生に聞いてもいいですよ。`,
    },
  },
  {
    id: 'j10', icon: '🔀', title: 'If, when, while & the て-form extras', part: 'N4 · 2 of 4', time: '4 weeks · 45 min a day',
    goal: 'Use the four “if / when” forms (たら, ば, と, なら), say “even if”, “while”, “just did”, “about to”, and add feeling with てしまう, ておく, てみる.',
    goalHg: '“Agar / jab” ke chaar tareeke, aur “galti se ho gaya”, “pehle se kar ke rakhna”, “try karna”.',
    steps: [
      ['🔀', 'The four conditionals together', 'Read たら, ば, と and なら one after another and compare their examples. たら is the safest all-rounder when unsure.', 'gpoint:tara'],
      ['📘', 'Grammar points, in order', 'Pattern, examples aloud, meaning with the English covered. Then the N4 grammar quiz.', ''],
      ['漢', 'N4 kanji', 'Body, places, people, feelings, food: learn each group, then the stroke order.', ''],
      ['🍙', 'Vocabulary', 'Health, feelings, people, home, town, travel and food.', ''],
      ['🏢', 'Office phrase units', 'Apologies & being late, Phone calls: Learn, Speak, Role-play.', ''],
    ],
    daily: ['10 min: one grammar point', '15 min: vocabulary', '10 min: N4 kanji', '10 min: N4 grammar quiz or ★'],
    tip: 'と is for things that always happen (press → opens); it can’t end in a request. 駅に着いたら電話してください is right; 着くと電話してください is wrong.',
    tipHg: '“to” ke baad request nahi aati: wahan “tara” use karo.',
    study: {
      grammar: ['tara', 'ba', 'to-cond', 'nara', 'temo', 'nagara', 'aida', 'uchini', 'tokoro', 'bakari-just', 'hajimeru', 'tsuzukeru', 'dasu', 'teshimau', 'teoku', 'temiru', 'tearu', 'teikukuru', 'mama', 'shi', 'node', 'nakute', 'naide-without', 'zuni', 'bayokatta', 'toii'],
      kanji: ['n4-world', 'n4-people2', 'n4-food2'],
      vocab: ['n4-health', 'n4-feelings', 'n4-people3', 'n4-home3', 'n4-town2', 'n4-travel2', 'n4-food4'],
      units: ['o-sorry', 'o-phone'],
    },
    test: {
      pass: 80, qs: `
g|駅に着い[たら]、電話してください。|えきについ[たら]、でんわしてください。|When you get to the station, please call me.|ても|たり|ながら
g|このボタンを押す[と]、ドアが開きます。|このボタンをおす[と]、ドアがあきます。|When you press this button, the door opens.|たら|ば|ながら
g|安けれ[ば]、買います。|やすけれ[ば]、かいます。|If it’s cheap, I’ll buy it.|たら|と|て
g|日本へ行く[なら]、京都がいいですよ。|にほんへいく[なら]、きょうとがいいですよ。|If you’re going to Japan, Kyoto is good.|ても|ながら|たら
g|雨が降っ[ても]、行きます。|あめがふっ[ても]、いきます。|Even if it rains, I’ll go.|ながら|と|ば
g|音楽を聞き[ながら]、勉強します。|おんがくをきき[ながら]、べんきょうします。|I study while listening to music.|たら|ても|ので
g|今、昼ご飯を食べる[ところです]。|いま、ひるごはんをたべる[ところです]。|I’m just about to eat lunch.|たばかりです|ままです|ながらです
g|さっき起き[たばかり]です。|さっきおき[たばかり]です。|I only just woke up.|ながら|ても|たら
g|宿題を忘れ[てしまいました]。|しゅくだいをわすれ[てしまいました]。|I (accidentally) forgot my homework.|ておきました|てみました|てあげました
g|会議の前に資料をコピーし[ておきます]。|かいぎのまえにしりょうをコピーし[ておきます]。|I’ll copy the documents before the meeting (in advance).|てみます|ながら|たばかり
g|このケーキを食べ[てみて]ください。|このケーキをたべ[てみて]ください。|Please try this cake.|ておいて|てしまって|てあって
g|窓が開け[てあります]。|まどがあけ[てあります]。|The window has been left open (on purpose).|ています|てみます|ておきます
g|頭が痛い[ので]、早く帰ります。|あたまがいたい[ので]、はやくかえります。|I have a headache, so I’ll go home early.|のに|ても|ながら
g|眼鏡をかけた[まま]寝てしまった。|めがねをかけた[まま]ねてしまった。|I fell asleep with my glasses on.|ながら|ので|ても
g|朝ご飯を食べ[ないで]、会社へ来ました。|あさごはんをたべ[ないで]、かいしゃへきました。|I came to work without eating breakfast.|ながら|なければ|ないと
r|急ぐ|いそぐ|きゅうぐ|いそく|おそぐ
m|地震|じしん|earthquake|typhoon|fire|accident
w|It’s started to rain.|雨が降り出しました。|雨が降り続けました。|雨が降っておきました。|雨が降ってみました。`,
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
    daily: ['10 min: one grammar point', '15 min: vocabulary', '10 min: N4 kanji', '10 min: N4 grammar quiz or ★'],
    tip: 'Passive often means you were troubled by it: 雨に降られた (I got rained on). That’s why it’s used for complaints.',
    tipHg: 'Passive aksar “mere saath bura hua” ke liye hota hai.',
    study: {
      grammar: ['giving', 'tehoshii', 'garu', 'passive', 'causative', 'causpass', 'youninaru', 'younisuru', 'youni', 'youniiu', 'tameni', 'noni', 'noni-for', 'sugiru', 'yasui', 'sa', 'nominal', 'kotonisuru', 'kotoninaru', 'kadouka', 'embedq', 'hodo', 'mo-emph', 'bakari-only', 'zutsu', 'imperative', 'na-prohib', 'nasai'],
      kanji: ['n4-describe2', 'n4-actions2', 'n4-society'],
      vocab: ['n4-verbs3', 'n4-iadj3', 'n4-naadj3', 'n4-adverbs2', 'n4-katakana3', 'n4-shopping', 'n4-culture', 'n4-health3', 'n4-nature3'],
      units: ['o-meet', 'o-life'],
    },
    test: {
      pass: 80, qs: `
g|友達が本を[くれました]。|ともだちがほんを[くれました]。|A friend gave me a book.|あげました|もらいました|さしあげました
g|私は先生に日本語を教えて[もらいました]。|わたしはせんせいににほんごをおしえて[もらいました]。|The teacher taught me Japanese (as a favour to me).|くれました|あげました|やりました
g|弟にお菓子を食べ[られました]。|おとうとにおかしをたべ[られました]。|My little brother ate my sweets (and I was annoyed).|させました|ています|てあげました
g|母は私に野菜を食べ[させました]。|はははわたしにやさいをたべ[させました]。|My mother made me eat vegetables.|られました|ています|ておきました
g|毎日運動する[ようにしています]。|まいにちうんどうする[ようにしています]。|I make a point of exercising every day.|ところです|ままです|たばかりです
g|日本語が少し話せる[ようになりました]。|にほんごがすこしはなせる[ようになりました]。|I’ve become able to speak a little Japanese.|ようにしました|ことにしました|ところでした
g|家を買う[ために]、貯金しています。|いえをかう[ために]、ちょきんしています。|I’m saving money in order to buy a house.|ながら|ても|たら
g|一生懸命勉強した[のに]、試験に落ちました。|いっしょうけんめいべんきょうした[のに]、しけんにおちました。|Even though I studied hard, I failed the exam.|ので|ために|から
g|このカレーは辛[すぎます]。|このカレーはから[すぎます]。|This curry is too spicy.|やすいです|にくいです|ながらです
g|このペンは書き[やすい]です。|このペンはかき[やすい]です。|This pen is easy to write with.|にくい|ながら|ている
g|来月から大阪で働く[ことになりました]。|らいげつからおおさかではたらく[ことになりました]。|It’s been decided (by the company) that I’ll work in Osaka from next month.|ことにしました|ことがありました|ところでした
g|明日来られる[かどうか]、わかりません。|あしたこられる[かどうか]、わかりません。|I don’t know whether I can come tomorrow.|かな|のに|ために
g|昨日は一時間[も]待ちました。|きのうはいちじかん[も]まちました。|Yesterday I waited a whole hour!|しか|ずつ|が
g|今年の夏は去年[ほど]暑くない。|ことしのなつはきょねん[ほど]あつくない。|This summer isn’t as hot as last year.|まで|しか|ずつ
g|ここで写真を撮る[な]。|ここでしゃしんをとる[な]。|Don’t take photos here! (strict)|なさい|ずつ|ろ
r|運転|うんてん|うんでん|うってん|うんてい
m|経験|けいけん|experience|economy|plan|exam
w|Please make sure you don’t forget.|忘れないようにしてください。|忘れるようにしてください。|忘れてもいいです。|忘れてしまいました。`,
    },
  },
  {
    id: 'j12', icon: '👔', title: 'Keigo, hearsay & guessing', part: 'N4 · 4 of 4', time: '4 weeks · 45 min a day',
    goal: 'Speak politely to customers and bosses (honorific and humble keigo), pass on what you heard, and guess from what you see: 雨が降りそうです。',
    goalHg: 'Boss aur clients se keigo mein baat, suni hui baat batana, aur andaza lagana.',
    steps: [
      ['👔', 'Honorific vs humble', 'Honorific lifts the other person (いらっしゃる, お〜になる); humble lowers you (参る, 申す, お〜する). Never use humble for your boss or a customer.', 'gpoint:sonkeigo'],
      ['📘', 'Grammar points, in order', 'そう (looks like), そう (I heard), よう/みたい and らしい look alike: compare their examples side by side.', ''],
      ['漢', 'Last N4 kanji', 'Then the full N4 kanji quiz on the Kanji page (N4): aim for 80%.', '#kanji/n4'],
      ['🍙', 'Last N4 words', 'Keigo verbs and work words, then the N4 picture quiz: aim for 80%.', 'vocab-quiz:n4'],
      ['🏢', 'Corporate phrase units', 'Asking a coworker, Checking you understood: Learn, Speak, Role-play.', ''],
    ],
    daily: ['10 min: one grammar point', '15 min: vocabulary', '10 min: N4 kanji', '10 min: N4 grammar quiz or ★'],
    tip: 'At work, keigo goes up to the customer and other companies even about your own boss: 部長の田中は今おりません (humble, about your own boss, to an outsider).',
    tipHg: 'Bahar ke logon se baat karte waqt apne boss ke liye bhi humble form.',
    study: {
      grammar: ['sou-look', 'sou-hear', 'mitai', 'rashii', 'hazu', 'niyoruto', 'okininaru', 'osuru', 'sonkeigo', 'kenjougo', 'rareru-respect', 'itadakeru', 'sasete', 'baai'],
      kanji: ['n4-nature4', 'n4-places3', 'n4-describe3', 'n4-actions3'],
      vocab: ['n4-keigo', 'n4-work3', 'n4-work4', 'n4-life4', 'n4-people4', 'n4-verbs4', 'n4-words4', 'n4-society2'],
      units: ['c-ask', 'c-check'],
    },
    test: {
      pass: 80, qs: `
g|雨が降り[そうです]ね。|あめがふり[そうです]ね。|It looks like it’s going to rain.|らしいです|ようです|はずです
g|天気予報によると、明日は雪が降る[そうです]。|てんきよほうによると、あしたはゆきがふる[そうです]。|According to the forecast, it will snow tomorrow.|ところです|つもりです|ことです
g|田中さんはもう帰った[はずです]。|たなかさんはもうかえった[はずです]。|Tanaka-san should have gone home already.|つもりです|ことです|ほうです
g|あの人はまるで子供[みたい]です。|あのひとはまるでこども[みたい]です。|That person is just like a child.|そう|はず|つもり
g|社長は何時に[いらっしゃいます]か。|しゃちょうはなんじに[いらっしゃいます]か。|What time will the company president come?|まいります|おります|いたします
g|私が駅まで[ご案内します]。|わたしがえきまで[ごあんないします]。|I will show you to the station. (humble)|ご案内になります|ご案内なさいます|案内いらっしゃいます
g|先生は何を[お飲みになります]か。|せんせいはなにを[おのみになります]か。|What would you like to drink, sensei? (honorific)|お飲みします|飲みいたします|お飲みいたします
g|山田と[申します]。|やまだと[もうします]。|My name is Yamada. (humble)|おっしゃいます|言われます|いらっしゃいます
g|すみません、この書類を見て[いただけませんか]。|すみません、このしょるいをみて[いただけませんか]。|Excuse me, could you look at this document for me?|さしあげませんか|あげませんか|おきませんか
g|今日は早く帰ら[せてください]。|きょうははやくかえら[せてください]。|Please let me go home early today.|れてください|ないでください|ずにください
g|遅れる[場合は]、連絡してください。|おくれる[ばあいは]、れんらくしてください。|If you are going to be late, please let us know.|ところは|ために|のに
g|部長は明日出張に行か[れます]。|ぶちょうはあしたしゅっちょうにいか[れます]。|The department manager is going on a business trip tomorrow. (respectful)|せます|せられます|させます
g|この店のラーメンはおいしい[らしい]です。|このみせのラーメンはおいしい[らしい]です。|Apparently this shop’s ramen is good.|ところ|つもり|まま
r|社長|しゃちょう|しゃちょ|じゃちょう|しゃっちょう
m|予約|よやく|reservation|schedule|contract|meeting
w|Excuse me. (polite, entering an office or meeting room)|失礼します。|お邪魔しました。|お先に失礼します。|ご苦労さまです。
w|Please wait a moment. (to a customer)|少々お待ちください。|ちょっと待って。|待たせてください。|少しお待ちします。`,
    },
  },
  {
    id: 'j13', icon: '🎓', title: 'N4 exam ready', part: 'N4 exam', time: '3–4 weeks · 60 min a day',
    goal: 'Pass a full-length N4 mock test: at least 90/180, with 38+ in language and reading and 19+ in listening. You’re ready to sit the real N4.',
    goalHg: 'Poora N4 mock test pass karo: 180 mein se 90+. Phir asli exam ke liye taiyaar!',
    steps: [
      ['📖', 'Reading practice', 'Every N4 passage. Question first, then the passage; for notices, scan for the one fact you need (情報検索).', 'ex-reading:n4'],
      ['🎧', 'Listening practice', 'Every N4 conversation, played once. For 即時応答 (quick response), answer in your head before the options finish.', 'ex-listening:n4'],
      ['✏️', 'Grammar quiz and ★', 'Both at 80%+.', 'gquiz:n4'],
      ['🖼️', 'Vocabulary and kanji quizzes', 'N4 picture quiz and N4 kanji quiz at 80%+.', 'vocab-quiz:n4'],
      ['⚡', 'Quick mock', 'Find your weakest part, then go back to that level’s grammar or words.', 'ex-mock-start:n4.quick'],
      ['🏁', 'Full mock test', 'Pass it to finish the path. Then book the real exam.', 'ex-mock:n4'],
    ],
    daily: ['15 min: reading (timed)', '15 min: listening (play once only)', '15 min: grammar quiz or ★', '15 min: vocabulary or kanji', 'Weekly: one full mock test, then study the mistake review'],
    tip: 'Most people fail on time, not knowledge: in reading, never spend more than 2 minutes stuck on one question. Mark a guess and move on.',
    tipHg: 'Zyada log time ki wajah se fail hote hain: ek sawaal pe 2 minute se zyada mat atko.',
    study: {},
    test: { mock: 'n4' },
  },
];
