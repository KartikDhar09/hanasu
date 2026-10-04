// N5 particles. Japanese, like Hindi, puts these little words AFTER the noun (postpositions),
// and the verb comes at the end, so Hinglish comparisons work well.
// Example tuple: [japanese, kana, romaji, english, hinglish]; the particle being taught is in [brackets].

export const PARTICLES_INTRO = {
  en: 'Good news: Japanese grammar works like Hindi. The verb goes at the end, and particles come AFTER the word, just like se, ko, mein, tak.',
  hg: 'Hindi: “Main Tokyo se Osaka tak train se jaata hoon.” Japanese: 東京から大阪まで電車で行きます。 Same order!',
};

// Particles that can also be correct in the same blank, so they’re never offered as wrong answers.
export const CONFUSABLE = {
  'は': ['が', 'も'], 'が': ['は', 'も'], 'を': ['は', 'も'], 'に': ['へ', 'から', 'まで'], 'で': ['に'], 'へ': ['に'],
  'と': ['や'], 'も': ['は', 'が', 'を'], 'から': ['まで', 'より'], 'まで': ['から'], 'か': ['ね', 'よ'],
  'ね': ['か', 'よ'], 'よ': ['か', 'ね'], 'や': ['と'], 'より': ['から'], 'の': [],
};

export const PARTICLES = [
  {
    id: 'wa', p: 'は', ro: 'wa', title: 'Topic: “as for…”', hg: '“toh” (topic)',
    explain: 'Marks what the sentence is about. Written は (ha) but always pronounced “wa” as a particle.',
    hindi: 'Like “Main toh…” or “Jahaan tak X ki baat hai…”. It sets the topic, then you say something about it.',
    tip: 'In casual speech it’s often dropped: 私(は)インドから来ました → インドから来ました.',
    examples: [
      ['私[は]インドから来ました。', 'わたし[は]インドからきました。', 'watashi [wa] Indo kara kimashita.', 'I’m from India.', 'Main (toh) India se hoon.'],
      ['今日[は]休みです。', 'きょう[は]やすみです。', 'kyō [wa] yasumi desu.', 'Today is my day off.', 'Aaj (toh) chhutti hai.'],
      ['この店[は]安いです。', 'このみせ[は]やすいです。', 'kono mise [wa] yasui desu.', 'This shop is cheap.', 'Ye dukaan sasti hai.'],
      ['日本語[は]難しいですね。', 'にほんご[は]むずかしいですね。', 'nihongo [wa] muzukashii desu ne.', 'Japanese is hard, isn’t it?', 'Japanese mushkil hai, hai na?'],
    ],
  },
  {
    id: 'ga', p: 'が', ro: 'ga', title: 'Subject / with 好き, ある, わかる', hg: 'subject (jaise “mujhe X pasand hai”)',
    explain: 'Marks the subject, especially new information, and the thing with 好き (like), ある/いる (there is), わかる (understand), できる (can).',
    hindi: 'Works like Hindi “mujhe chai pasand hai”: chai is the subject, so it gets が. 私はお茶が好きです = Mujhe chai pasand hai.',
    tip: 'Question words always take が, never は: 誰が来ますか? (Kaun aa raha hai?)',
    examples: [
      ['私はお茶[が]好きです。', 'わたしはおちゃ[が]すきです。', 'watashi wa o-cha [ga] suki desu.', 'I like tea.', 'Mujhe chai pasand hai.'],
      ['近くにコンビニ[が]あります。', 'ちかくにコンビニ[が]あります。', 'chikaku ni konbini [ga] arimasu.', 'There’s a convenience store nearby.', 'Paas mein ek convenience store hai.'],
      ['誰[が]来ますか。', 'だれ[が]きますか。', 'dare [ga] kimasu ka?', 'Who is coming?', 'Kaun aa raha hai?'],
      ['日本語[が]少しわかります。', 'にほんご[が]すこしわかります。', 'nihongo [ga] sukoshi wakarimasu.', 'I understand a little Japanese.', 'Mujhe thodi Japanese samajh aati hai.'],
    ],
  },
  {
    id: 'o', p: 'を', ro: 'o', title: 'Object: what you act on', hg: '“ko” (object)',
    explain: 'Marks the thing the verb acts on: eat WHAT, buy WHAT. Written を (wo) but said “o”.',
    hindi: 'Like Hindi “ko” for an object (“use dekho”), but Japanese uses it every time: khaana khaata hoon → ご飯を食べます.',
    tip: 'In casual speech を is often dropped: コーヒー(を)飲む?',
    examples: [
      ['朝ご飯[を]食べます。', 'あさごはん[を]たべます。', 'asagohan [o] tabemasu.', 'I eat breakfast.', 'Main naashta karta/karti hoon.'],
      ['コーヒー[を]飲みます。', 'コーヒー[を]のみます。', 'kōhī [o] nomimasu.', 'I drink coffee.', 'Main coffee peeta/peeti hoon.'],
      ['日本語[を]勉強しています。', 'にほんご[を]べんきょうしています。', 'nihongo [o] benkyō shite imasu.', 'I’m studying Japanese.', 'Main Japanese padh raha/rahi hoon.'],
      ['この資料[を]見てください。', 'このしりょう[を]みてください。', 'kono shiryō [o] mite kudasai.', 'Please look at this document.', 'Is document ko dekhiye.'],
    ],
  },
  {
    id: 'ni', p: 'に', ro: 'ni', title: 'Time, destination, where something is', hg: '“ko / par / mein” (point)',
    explain: 'Points at a target: a clock time (7時に), a destination (会社に行く), where something exists (部屋にいる), or the person you give to or meet.',
    hindi: '7時に = 7 baje; 東京に行く = Tokyo jaana; 部屋にいる = kamre mein hona. Careful: 友達に会う = dost SE milna, but Japanese uses に.',
    tip: 'Days like 今日, 明日, 毎日 take no に. Clock times and dates do.',
    examples: [
      ['七時[に]起きます。', 'しちじ[に]おきます。', 'shichiji [ni] okimasu.', 'I wake up at seven.', 'Main saat baje uthta/uthti hoon.'],
      ['明日、東京[に]行きます。', 'あした、とうきょう[に]いきます。', 'ashita, Tōkyō [ni] ikimasu.', 'I’m going to Tokyo tomorrow.', 'Kal Tokyo jaa raha/rahi hoon.'],
      ['田中さんは会議室[に]います。', 'たなかさんはかいぎしつ[に]います。', 'Tanaka-san wa kaigishitsu [ni] imasu.', 'Tanaka-san is in the meeting room.', 'Tanaka ji meeting room mein hain.'],
      ['友達[に]会います。', 'ともだち[に]あいます。', 'tomodachi [ni] aimasu.', 'I’m meeting a friend.', 'Dost se mil raha/rahi hoon.'],
    ],
  },
  {
    id: 'de', p: 'で', ro: 'de', title: 'Where it happens / by what means', hg: '“mein” (action) / “se” (means)',
    explain: 'Marks the place where an action happens (会社で働く) and the tool or way you do it (バスで, 日本語で).',
    hindi: 'Office mein kaam karna = 会社で働く. Bus se jaana = バスで行く. Hindi uses mein/se; Japanese uses で for both.',
    tip: 'に vs で: いる/ある (just being somewhere) take に. Doing something somewhere takes で.',
    examples: [
      ['会社[で]働いています。', 'かいしゃ[で]はたらいています。', 'kaisha [de] hataraite imasu.', 'I work at a company.', 'Main company mein kaam karta/karti hoon.'],
      ['バス[で]来ました。', 'バス[で]きました。', 'basu [de] kimashita.', 'I came by bus.', 'Main bus se aaya/aayi.'],
      ['日本語[で]話しましょう。', 'にほんご[で]はなしましょう。', 'nihongo [de] hanashimashō.', 'Let’s talk in Japanese.', 'Japanese mein baat karte hain.'],
      ['駅[で]待っています。', 'えき[で]まっています。', 'eki [de] matte imasu.', 'I’m waiting at the station.', 'Station pe wait kar raha/rahi hoon.'],
    ],
  },
  {
    id: 'e', p: 'へ', ro: 'e', title: 'Direction: towards', hg: '“ki taraf”',
    explain: 'Shows direction of movement. Written へ (he) but said “e”. Usually you can use に instead.',
    hindi: 'Ghar ki taraf jaana = 家へ帰る.',
    tip: 'In everyday speech に is more common. へ sounds a little more “towards”.',
    examples: [
      ['家[へ]帰ります。', 'いえ[へ]かえります。', 'ie [e] kaerimasu.', 'I’m going home.', 'Ghar ja raha/rahi hoon.'],
      ['こちら[へ]どうぞ。', 'こちら[へ]どうぞ。', 'kochira [e] dōzo.', 'This way, please.', 'Idhar aaiye.'],
      ['来月、インド[へ]帰ります。', 'らいげつ、インド[へ]かえります。', 'raigetsu, Indo [e] kaerimasu.', 'I’m going back to India next month.', 'Agle mahine India waapas jaa raha/rahi hoon.'],
    ],
  },
  {
    id: 'to', p: 'と', ro: 'to', title: '“and” / “with”', hg: '“aur” / “ke saath”',
    explain: 'Joins nouns (A と B = A and B, complete list) and means “together with” someone.',
    hindi: 'Chai aur samosa = お茶とサモサ. Dost ke saath = 友達と.',
    tip: 'と only joins nouns, not sentences. For “and then…” use the て-form of a verb.',
    examples: [
      ['パン[と]コーヒーをください。', 'パン[と]コーヒーをください。', 'pan [to] kōhī o kudasai.', 'Bread and coffee, please.', 'Bread aur coffee dijiye.'],
      ['友達[と]映画を見ました。', 'ともだち[と]えいがをみました。', 'tomodachi [to] eiga o mimashita.', 'I watched a movie with a friend.', 'Dost ke saath movie dekhi.'],
      ['田中さん[と]話しました。', 'たなかさん[と]はなしました。', 'Tanaka-san [to] hanashimashita.', 'I talked with Tanaka-san.', 'Tanaka ji se baat ki.'],
    ],
  },
  {
    id: 'mo', p: 'も', ro: 'mo', title: '“also / too”', hg: '“bhi”',
    explain: 'Means “too / also”. It replaces は, が or を.',
    hindi: 'Exactly like “bhi”, and it also comes after the word: 私も = main bhi.',
    tip: 'With a negative it means “not even / none”: 何も食べていません = kuch bhi nahi khaaya.',
    examples: [
      ['私[も]行きます。', 'わたし[も]いきます。', 'watashi [mo] ikimasu.', 'I’m going too.', 'Main bhi chalunga/chalungi.'],
      ['これ[も]ください。', 'これ[も]ください。', 'kore [mo] kudasai.', 'This one too, please.', 'Ye bhi dijiye.'],
      ['何[も]食べていません。', 'なに[も]たべていません。', 'nani [mo] tabete imasen.', 'I haven’t eaten anything.', 'Kuch bhi nahi khaaya.'],
    ],
  },
  {
    id: 'no', p: 'の', ro: 'no', title: 'Possession: “’s / of”', hg: '“ka / ki / ke”',
    explain: 'Links two nouns: A の B = A’s B. Same order as Hindi!',
    hindi: '田中さんの電話 = Tanaka ka phone. 会社の人 = company ke log. Japanese の never changes for gender, unlike ka/ki/ke.',
    tip: 'You can chain them: 私の会社の名前 = meri company ka naam.',
    examples: [
      ['これは私[の]かばんです。', 'これはわたし[の]かばんです。', 'kore wa watashi [no] kaban desu.', 'This is my bag.', 'Ye mera bag hai.'],
      ['田中さん[の]電話番号を知っていますか。', 'たなかさん[の]でんわばんごうをしっていますか。', 'Tanaka-san [no] denwa bangō o shitte imasu ka?', 'Do you know Tanaka-san’s phone number?', 'Tanaka ji ka phone number pata hai?'],
      ['日本語[の]先生です。', 'にほんご[の]せんせいです。', 'nihongo [no] sensei desu.', 'She’s a Japanese teacher.', 'Ye Japanese ki teacher hain.'],
    ],
  },
  {
    id: 'kara', p: 'から', ro: 'kara', title: '“from” / “because”', hg: '“se” / “kyunki”',
    explain: 'After a noun: starting point (time or place). After a sentence: the reason.',
    hindi: '9時から = 9 baje se. 暑いから = garmi hai, isliye…',
    tip: 'Pairs with まで: 9時から5時まで = 9 se 5 tak.',
    examples: [
      ['会議は三時[から]です。', 'かいぎはさんじ[から]です。', 'kaigi wa sanji [kara] desu.', 'The meeting is from three.', 'Meeting teen baje se hai.'],
      ['インド[から]来ました。', 'インド[から]きました。', 'Indo [kara] kimashita.', 'I came from India.', 'India se aaya/aayi hoon.'],
      ['暑い[から]、窓を開けます。', 'あつい[から]、まどをあけます。', 'atsui [kara], mado o akemasu.', 'It’s hot, so I’ll open the window.', 'Garmi hai, isliye khidki khol raha/rahi hoon.'],
    ],
  },
  {
    id: 'made', p: 'まで', ro: 'made', title: '“until / up to”', hg: '“tak”',
    explain: 'The end point, in time or place.',
    hindi: 'Exactly “tak”: 5時まで = 5 baje tak, 駅まで = station tak.',
    tip: 'までに = “by” a deadline: 金曜日までに = Friday tak (deadline).',
    examples: [
      ['五時[まで]働きます。', 'ごじ[まで]はたらきます。', 'goji [made] hatarakimasu.', 'I work until five.', 'Paanch baje tak kaam karta/karti hoon.'],
      ['駅[まで]歩きます。', 'えき[まで]あるきます。', 'eki [made] arukimasu.', 'I walk to the station.', 'Station tak paidal jaata/jaati hoon.'],
      ['金曜日[まで]に出してください。', 'きんようび[まで]にだしてください。', 'kin-yōbi [made] ni dashite kudasai.', 'Please submit it by Friday.', 'Friday tak jama kar dijiye.'],
    ],
  },
  {
    id: 'ka', p: 'か', ro: 'ka', title: 'Question marker', hg: '“kya…?” (at the end)',
    explain: 'Put か at the end to make a question. No word order change needed.',
    hindi: 'Like spoken Hindi “Theek hai kya?”: the question word goes at the END.',
    tip: 'In casual speech か is dropped and you just raise your voice: 行く? (Chaloge?)',
    examples: [
      ['これは何です[か]。', 'これはなんです[か]。', 'kore wa nan desu [ka]?', 'What is this?', 'Ye kya hai?'],
      ['明日、来ます[か]。', 'あした、きます[か]。', 'ashita, kimasu [ka]?', 'Are you coming tomorrow?', 'Kal aa rahe hain kya?'],
      ['大丈夫です[か]。', 'だいじょうぶです[か]。', 'daijōbu desu [ka]?', 'Are you OK?', 'Theek ho?'],
    ],
  },
  {
    id: 'ne', p: 'ね', ro: 'ne', title: '“…right? / isn’t it?”', hg: '“hai na?”',
    explain: 'Added at the end to seek agreement or share a feeling. Very common: it makes you sound friendly.',
    hindi: 'Exactly “hai na?”: 暑いですね = garmi hai, hai na?',
    tip: 'Reply to a ね with そうですね (haan, sahi baat hai).',
    examples: [
      ['今日は暑いです[ね]。', 'きょうはあついです[ね]。', 'kyō wa atsui desu [ne].', 'Hot today, isn’t it?', 'Aaj garmi hai, hai na?'],
      ['おいしいです[ね]。', 'おいしいです[ね]。', 'oishii desu [ne].', 'This is tasty, isn’t it?', 'Tasty hai na?'],
      ['また明日です[ね]。', 'またあしたです[ね]。', 'mata ashita desu [ne].', 'See you tomorrow, then.', 'Toh kal milte hain, na?'],
    ],
  },
  {
    id: 'yo', p: 'よ', ro: 'yo', title: '“I’m telling you” (new info)', hg: '“…hai, yaar” (emphasis)',
    explain: 'Added at the end when you tell the listener something they don’t know.',
    hindi: 'Like adding emphasis: “Wo meeting cancel ho gayi, yaar!”',
    tip: 'Don’t overuse it with your boss: it can sound pushy.',
    examples: [
      ['会議は三時からです[よ]。', 'かいぎはさんじからです[よ]。', 'kaigi wa sanji kara desu [yo].', 'The meeting’s at three, you know.', 'Meeting teen baje se hai, yaad hai na.'],
      ['このラーメン、おいしいです[よ]。', 'このラーメン、おいしいです[よ]。', 'kono rāmen, oishii desu [yo].', 'This ramen is really good!', 'Ye ramen sach mein tasty hai!'],
      ['ミュートになってます[よ]。', 'ミュートになってます[よ]。', 'myūto ni natte masu [yo].', 'You’re on mute!', 'Aap mute pe ho!'],
    ],
  },
  {
    id: 'ya', p: 'や', ro: 'ya', title: '“and… (among others)”', hg: '“aur… vagairah”',
    explain: 'Lists a few examples, implying there are more. と means a complete list.',
    hindi: 'Chai, coffee vagairah = お茶やコーヒー.',
    tip: 'Often ends with など: お茶やコーヒーなど.',
    examples: [
      ['お茶[や]コーヒーを飲みます。', 'おちゃ[や]コーヒーをのみます。', 'o-cha [ya] kōhī o nomimasu.', 'I drink tea, coffee and so on.', 'Chai, coffee vagairah peeta/peeti hoon.'],
      ['週末は買い物[や]掃除をします。', 'しゅうまつはかいもの[や]そうじをします。', 'shūmatsu wa kaimono [ya] sōji o shimasu.', 'On weekends I do shopping, cleaning and stuff.', 'Weekend pe shopping, safaai vagairah karta/karti hoon.'],
    ],
  },
  {
    id: 'yori', p: 'より', ro: 'yori', title: '“than” (comparing)', hg: '“se (zyaada)”',
    explain: 'A より B = “more than A”. The thing you compare against takes より.',
    hindi: 'Exactly like “se”: 犬より猫が好き = kutte se zyaada billi pasand hai.',
    tip: 'Pattern: A より B の方が… = A se zyaada B…',
    examples: [
      ['電車はバス[より]速いです。', 'でんしゃはバス[より]はやいです。', 'densha wa basu [yori] hayai desu.', 'Trains are faster than buses.', 'Train bus se tez hai.'],
      ['夏[より]冬の方が好きです。', 'なつ[より]ふゆのほうがすきです。', 'natsu [yori] fuyu no hō ga suki desu.', 'I like winter more than summer.', 'Garmi se zyaada sardi pasand hai.'],
    ],
  },
];
