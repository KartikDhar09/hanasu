// Speaking path: 11 levels from the sounds of Japanese to talking freely at work and with friends.
// Every phrase unit (37) and every Q&A question (16) belongs to exactly one level (check.mjs).
//
// Level fields (as in path-jlpt.js), plus
//   study.units / study.qa   phrase units and Speak-tab questions (QA index) practised in this level
//   kit       key phrases for this level, one per line: jp|kana|romaji|English|Hinglish (all voiced)
//   missions  real-world tasks to do with real people (shown, never tracked)
//   drill     topics for the 4/3/2 talking drill: [title, Hinglish, hint words in Japanese]
//
// No speaking tests since v6.0 (the user's choice, 2026-10-25): a level is done when the learner marks it complete.

export const PATH_TALK_INTRO = {
  en: 'Eleven levels take you from the sounds of Japanese to talking freely with coworkers, customers and friends. Each level gives you phrases to master, practice in the app and missions to do with real people. When you have done a level, mark it complete. Speaking only grows by speaking: do the missions, not just the screens.',
  hg: 'Bolne se hi bolna aata hai. App mein practice karo, phir asli logon ke saath missions karo. Level ho gaya? Complete mark karo.',
};

export const PATH_TALK = [
  {
    id: 't1', icon: '👄', title: 'The sounds of Japanese', part: 'Start', time: '1 week · 15–20 min a day',
    goal: 'Say every Japanese sound clearly, with long vowels, small っ and an even rhythm, so people understand your greetings the first time.',
    goalHg: 'Har Japanese awaaz saaf bol paoge: lambi awaaz, chhota “tsu”, aur barabar rhythm.',
    steps: [
      ['あ', 'Say every kana out loud', 'Open the kana chart and tap every kana. Repeat each one right after the voice. Japanese has only five vowels: a i u e o, always short and clean.', '#jlpt/kana'],
      ['👄', 'Sounds that change meaning', 'Do the Pronunciation drills: おばさん (aunt) vs おばあさん (grandmother), きて vs きって. Hold long vowels for two beats.', '#speak/sounds'],
      ['🥁', 'Even rhythm', 'Every kana gets the same beat: に・ほ・ん・ご is four beats, が・っ・こ・う is four (the small っ is a silent beat). Clap it.', ''],
      ['🔁', 'Shadow the greetings', 'Play each greeting and speak along with the voice at the same time, copying its melody, not just the words.', 'shadow-unit:greet'],
      ['👋', 'Greetings unit', 'Learn, then Speak (the microphone scores you), then the Role-play.', '#unit/greet'],
    ],
    daily: ['5 min: kana out loud', '5 min: pronunciation pairs', '5 min: shadow the greetings', 'Say おはようございます to someone at work tomorrow morning'],
    tip: 'Japanese has no stress like English. Don’t punch one syllable: keep it flat and even, and change pitch gently. Hindi speakers already have the right clean vowels.',
    tipHg: 'English ki tarah zor mat do. Hindi jaise saaf vowels bolo, barabar beat mein.',
    kit: `
おばさん|おばさん|obasan|aunt|chachi / mausi
おばあさん|おばあさん|obāsan|grandmother|dadi / nani
きて|きて|kite|come (and…)|aao
きって|きって|kitte|stamp|daak ticket
ビル|びる|biru|building|building
ビール|びーる|bīru|beer|beer`,
    missions: ['Greet three people at work today with the right greeting for the time of day.', 'Record yourself saying the six key words, then compare with the app’s voice.'],
    study: { units: ['greet'] },
  },
  {
    id: 't2', icon: '🆘', title: 'Never get stuck', part: 'Survival', time: '1 week · 20 min a day',
    goal: 'Keep any conversation alive even when you don’t understand: ask people to repeat, slow down or write it, ask what a word means, and say how much Japanese you speak.',
    goalHg: 'Samajh na aaye tab bhi baat chalti rahe: dobara bolne, dheere bolne, likhne ko keh sako.',
    steps: [
      ['🆘', 'Learn the “help” unit by heart', 'Learn, Speak and Role-play “When you don’t understand”. These are the most useful phrases in the whole app.', '#unit/help'],
      ['🧰', 'Key phrases below', 'Tap each one, say it three times, then cover the Japanese and say it from the English.', ''],
      ['🔁', 'Shadow them', 'Shadow the unit until you can say each line without looking.', 'shadow-unit:help'],
      ['🎯', 'Use them on purpose', 'Next time someone speaks to you in Japanese, use at least one of these instead of switching to English.', ''],
    ],
    daily: ['10 min: the help unit (Learn or Speak)', '5 min: key phrases out loud', '5 min: shadowing'],
    tip: 'もう一回お願いします and ゆっくりお願いします are not rude: Japanese people are happy to repeat. Switching to English too soon is what stops your progress.',
    tipHg: 'Dobara poochna bilkul theek hai. Jaldi English par mat jao.',
    kit: `
日本語は少しだけ話せます。|にほんごはすこしだけはなせます。|nihongo wa sukoshi dake hanasemasu.|I speak only a little Japanese.|Main thodi si hi Japanese bol sakta / sakti hoon.
書いてもらえますか。|かいてもらえますか。|kaite moraemasu ka?|Could you write it down?|Kya aap likh denge?
ひらがなでお願いします。|ひらがなでおねがいします。|hiragana de onegai shimasu.|In hiragana, please.|Hiragana mein likhiye please.
英語で言ってもいいですか。|えいごでいってもいいですか。|eigo de itte mo ii desu ka?|May I say it in English?|Kya main English mein bol sakta / sakti hoon?
大丈夫です。|だいじょうぶです。|daijōbu desu.|I’m fine. / No, thank you.|Theek hai. / Nahi chahiye.
助けてください！|たすけてください！|tasukete kudasai!|Help!|Madad kijiye!`,
    missions: ['Ask a shop clerk a question, and when you don’t understand the answer, ask them to say it again.', 'Ask a coworker what one Japanese word means.'],
    study: { units: ['help'] },
  },
  {
    id: 't3', icon: '🙋', title: 'Introduce yourself', part: 'Basics', time: '1–2 weeks · 20 min a day',
    goal: 'Give a one-minute self-introduction (name, country, job, how long in Japan, hobbies, family) and answer the questions people always ask you.',
    goalHg: 'Ek minute ka apna introduction de paoge aur log jo hamesha poochte hain uska jawab.',
    steps: [
      ['🙋', 'Build your own introduction', 'Use the self-introduction builder with your real name, country and job. Practise it line by line with the microphone.', '#speak/intro'],
      ['💬', 'Introducing yourself unit', 'Learn, Speak, Role-play.', '#unit/intro'],
      ['❓', 'Answer the questions everyone asks', 'In each question below, play it, answer out loud without looking, then compare with the examples.', ''],
      ['⏱', 'One minute, no notes', 'Say your whole introduction in one go, by heart, under a minute. Record it on your phone and listen back.', ''],
    ],
    daily: ['5 min: your introduction, by heart', '10 min: two questions from the list', '5 min: the unit’s Speak mode'],
    tip: 'Japanese introductions are short and modest. Name, where you’re from, what you do, and よろしくお願いします. Long life stories come later, when people ask.',
    tipHg: 'Introduction chhota aur namr rakho. Lambi kahani baad mein.',
    kit: `
インドのデリー出身です。|インドのデリーしゅっしんです。|Indo no Derī shusshin desu.|I’m from Delhi, India.|Main Bharat ki Dilli se hoon.
エンジニアをしています。|エンジニアをしています。|enjinia o shite imasu.|I work as an engineer.|Main engineer ka kaam karta / karti hoon.
静岡に住んでいます。|しずおかにすんでいます。|Shizuoka ni sunde imasu.|I live in Shizuoka.|Main Shizuoka mein rehta / rehti hoon.
家族は四人です。|かぞくはよにんです。|kazoku wa yonin desu.|There are four of us in my family.|Mere parivaar mein chaar log hain.
日本語を勉強しています。|にほんごをべんきょうしています。|nihongo o benkyō shite imasu.|I’m studying Japanese.|Main Japanese seekh raha / rahi hoon.`,
    missions: ['Introduce yourself in Japanese to someone you haven’t really talked to: a neighbour, a coworker from another team, a shop owner.', 'Ask someone two questions about themselves (where they’re from, their hobby).'],
    study: { units: ['intro'], qa: [0, 1, 2, 3, 4, 10] },
  },
  {
    id: 't4', icon: '🛒', title: 'Shops, food & getting around', part: 'Daily life', time: '2 weeks · 20–30 min a day',
    goal: 'Handle the konbini, shops and restaurants, ask the way, use trains, and talk about times, all in Japanese without switching to English.',
    goalHg: 'Konbini, dukaan, restaurant, raasta aur train: sab Japanese mein sambhal paoge.',
    steps: [
      ['🛒', 'Four everyday units', 'Shopping, At a restaurant, Directions & trains, Time & days: Learn, Speak, then the Role-play for each.', ''],
      ['👂', 'Learn what staff say to you', 'Most stress comes from what you hear: ポイントカードはお持ちですか、温めますか、何名様ですか. Know these by ear.', '#unit/shop'],
      ['❓', 'Food and travel questions', 'Answer the questions below out loud.', ''],
      ['🎯', 'Do the missions', 'Real practice is the point of this level: every mission below, in Japanese only.', ''],
    ],
    daily: ['10 min: one unit (Speak mode)', '5 min: role-play', '5 min: key phrases', 'One real errand in Japanese every day'],
    tip: 'You don’t need full sentences in shops: これ、お願いします and 大丈夫です (no thanks) get you through most of it. Speed comes from reflexes, not grammar.',
    tipHg: 'Dukaan mein poore sentence ki zaroorat nahi: “kore onegai shimasu” aur “daijoubu desu” kaafi hai.',
    kit: `
これ、温めてください。|これ、あたためてください。|kore, atatamete kudasai.|Please heat this up.|Ise garam kar dijiye.
お箸ください。|おはしください。|o-hashi kudasai.|Chopsticks, please.|Chopsticks dijiye.
持ち帰りでお願いします。|もちかえりでおねがいします。|mochikaeri de onegai shimasu.|To take away, please.|Pack kar dijiye.
ここで食べます。|ここでたべます。|koko de tabemasu.|I’ll eat here.|Yahin khaunga / khaungi.
静岡駅までいくらですか。|しずおかえきまでいくらですか。|Shizuoka-eki made ikura desu ka?|How much is it to Shizuoka Station?|Shizuoka station tak kitna hai?`,
    missions: ['Buy something at a konbini and answer every question from the clerk in Japanese.', 'Order a meal at a restaurant without pointing at the menu.', 'Ask a station worker or passer-by the way somewhere.'],
    study: { units: ['shop', 'food', 'way', 'time'], qa: [6, 7, 9] },
  },
  {
    id: 't5', icon: '🗓️', title: 'Talk about your life', part: 'Daily life', time: '2–3 weeks · 30 min a day',
    goal: 'Chat about your weekend, plans, likes and feelings in past, present and future, invite people and accept or turn down invitations, and keep talking for two minutes.',
    goalHg: 'Weekend, plans, pasand, feelings: beete, abhi aur aage ki baat. Do minute tak bolte reh paoge.',
    steps: [
      ['🗓️', 'Likes & plans unit', 'Learn, Speak, Role-play.', '#unit/plans'],
      ['❓', 'Small-talk questions', 'Answer each question below out loud in two or three sentences, not one word.', ''],
      ['⏱', 'The 4/3/2 drill', 'Tell the same story three times: in 4 minutes, then 3, then 2. Each round you get faster and smoother. This is the best exercise for fluency.', 'path-drill:talk.t5'],
      ['🔁', 'Shadow 10 random phrases', 'Mix of everything so far, every day.', 'shadow-random:'],
    ],
    daily: ['10 min: 4/3/2 drill on one topic', '10 min: two small-talk questions', '5 min: shadowing'],
    tip: 'Answer with more than the question needs: 週末、何しましたか → 友達と浜松に行きました。すごく楽しかったです。 One extra sentence keeps the conversation going.',
    tipHg: 'Sawaal se thoda zyada jawab do: ek extra sentence se baat aage badhti hai.',
    kit: `
週末は家でゆっくりしました。|しゅうまつはいえでゆっくりしました。|shūmatsu wa ie de yukkuri shimashita.|I relaxed at home at the weekend.|Weekend pe ghar par aaram kiya.
友達と浜松に行きました。|ともだちとはままつにいきました。|tomodachi to Hamamatsu ni ikimashita.|I went to Hamamatsu with friends.|Doston ke saath Hamamatsu gaya / gayi.
来月、インドに帰ります。|らいげつ、インドにかえります。|raigetsu, Indo ni kaerimasu.|I’m going back to India next month.|Agle mahine Bharat ja raha / rahi hoon.
最近、ジムに通っています。|さいきん、ジムにかよっています。|saikin, jimu ni kayotte imasu.|Lately I’ve been going to the gym.|Aajkal gym ja raha / rahi hoon.
すごく楽しかったです。|すごくたのしかったです。|sugoku tanoshikatta desu.|It was really fun.|Bahut mazaa aaya.
ちょっと疲れました。|ちょっとつかれました。|chotto tsukaremashita.|I’m a bit tired.|Thoda thak gaya / gayi.`,
    missions: ['On Monday, ask a coworker how their weekend was, and tell them about yours.', 'Invite someone for lunch or coffee in Japanese.'],
    drill: [
      ['Your weekend', 'Tera weekend', 'いつ・どこ・だれと・何をした・どうだった'],
      ['Your hometown in India', 'Tera shehar', 'どこ・どんな町・食べ物・天気・おすすめ'],
      ['Your job', 'Tera kaam', '会社・仕事・毎日・好きなこと・大変なこと'],
      ['Your favourite food', 'Pasandida khana', '何・どうして・どこで・いつ・作り方'],
      ['Your family', 'Tera parivaar', '何人・だれ・どこに住んでいる・仕事・趣味'],
    ],
    study: { units: ['plans'], qa: [5, 8, 11, 12, 14, 15] },
  },
  {
    id: 't6', icon: '🏢', title: 'Japanese at work: the basics', part: 'Work', time: '2–3 weeks · 30 min a day',
    goal: 'Use the daily office phrases: greetings, your first-day speech, asking for help, taking instructions, apologising, and asking for time off.',
    goalHg: 'Office ki roz ki baatein: greetings, madad maangna, kaam lena, sorry bolna, chhutti maangna.',
    steps: [
      ['🏢', 'Six office units', 'Office greetings, First day at work, Asking for help, Taking instructions, Apologies, Time off & small talk. Learn, Speak, Role-play each.', ''],
      ['👔', 'Open the 👔 business versions', 'Under each phrase, the fold shows the business version and other ways to say it. At work, aim for the business version.', '#unit/o-greet'],
      ['❓', '“Can you do this job?”', 'Answer the question below out loud.', ''],
      ['🎯', 'Missions at your office', 'Do each one this week.', ''],
    ],
    daily: ['10 min: one office unit', '5 min: role-play', '5 min: key phrases', 'Use お疲れ様です every time you pass a coworker'],
    tip: 'お疲れ様です is the all-purpose office greeting: when you arrive after the morning, pass someone in the corridor, start an email or join a call.',
    tipHg: '“Otsukaresama desu” office ka sabse kaam ka greeting hai.',
    kit: `
おはようございます。今日もよろしくお願いします。|おはようございます。きょうもよろしくおねがいします。|ohayō gozaimasu. kyō mo yoroshiku onegai shimasu.|Good morning. Let’s work well together today too.|Good morning. Aaj bhi saath mein achha kaam karenge.
これ、どこに置けばいいですか。|これ、どこにおけばいいですか。|kore, doko ni okeba ii desu ka?|Where should I put this?|Ise kahan rakhun?
今、何をすればいいですか。|いま、なにをすればいいですか。|ima, nani o sureba ii desu ka?|What should I do now?|Ab main kya karun?`,
    missions: ['Say お先に失礼します when you leave work, every day this week.', 'Ask a senior coworker to check something you made.', 'Report one finished task with 終わりました。確認お願いします。'],
    study: { units: ['o-greet', 'o-intro', 'o-ask', 'o-task', 'o-sorry', 'o-life'], qa: [13] },
  },
  {
    id: 't7', icon: '🔄', title: 'Keep the conversation going', part: 'Conversation', time: '2–3 weeks · 30 min a day',
    goal: 'React like a Japanese speaker (あいづち: へえ, そうなんですか, なるほど), buy time with fillers, check you understood, ask follow-up questions and turn the question back.',
    goalHg: 'Japanese style mein react karna, sochne ka time lena, samjha ya nahi check karna, aur sawaal wapas poochna.',
    steps: [
      ['🔄', 'Reactions and fillers', 'Learn the key phrases below until they come out by reflex. Japanese listeners react every few seconds; silence feels like you aren’t listening.', ''],
      ['❓', 'Asking and checking', 'Asking a coworker, Checking you understood: Learn, Speak, Role-play.', '#unit/c-check'],
      ['🍻', 'After-work drinks', 'The social unit: small talk with coworkers.', '#unit/c-social'],
      ['🔁', 'Role-play with reactions', 'In every role-play, add a reaction before your line: へえ、そうなんですか。じゃあ…', ''],
    ],
    daily: ['5 min: reactions out loud', '10 min: one unit', '10 min: role-play adding reactions', 'Use one reaction phrase in a real conversation every day'],
    tip: 'あいづち (へえ, うん, そうですね, なるほど) is half of a Japanese conversation. Use them while the other person is still talking: it means “I’m with you”.',
    tipHg: 'Saamne wala bol raha ho tab bhi “hee, naruhodo” bolte raho: matlab main sun raha / rahi hoon.',
    kit: `
へえ、そうなんですか。|へえ、そうなんですか。|hē, sō nan desu ka.|Oh, really?|Achha, sach mein?
本当ですか。|ほんとうですか。|hontō desu ka?|Really?|Sach mein?
いいですね。|いいですね。|ii desu ne.|That’s nice.|Bahut badhiya.
それで？|それで？|sorede?|And then?|Phir?
私もです。|わたしもです。|watashi mo desu.|Me too.|Main bhi.
確かに。|たしかに。|tashika ni.|True. / Good point.|Sahi baat hai.
大変でしたね。|たいへんでしたね。|taihen deshita ne.|That must have been tough.|Mushkil raha hoga.
えっと、何て言うんだろう…。|えっと、なんていうんだろう…。|etto, nan te iu n darō…|Um, how do I say it…|Umm, kaise bolun…
田中さんは？|たなかさんは？|Tanaka-san wa?|And you, Tanaka-san?|Aur aap, Tanaka-san?`,
    missions: ['In one conversation, use three different reactions (へえ, 本当ですか, いいですね).', 'When you get an instruction at work, repeat it back to check: つまり、〜ってことですか。', 'At lunch, ask a coworker two follow-up questions about something they said.'],
    study: { units: ['c-ask', 'c-check', 'c-social'] },
  },
  {
    id: 't8', icon: '💡', title: 'Explain, report & give opinions', part: 'Conversation', time: '3 weeks · 30 min a day',
    goal: 'Report progress, explain reasons, make suggestions, agree and disagree politely, and ask for feedback: say what you think and why.',
    goalHg: 'Progress batana, kaaran samjhana, suggestion dena, namr tareeke se haan ya na kehna.',
    steps: [
      ['📣', 'Report like a pro', 'Reporting progress: the boss wants the conclusion first (予定通りです / 遅れています), then the reason.', '#unit/c-report'],
      ['💡', 'Opinions and suggestions', 'Giving opinions, Making suggestions, Disagreeing politely, Asking for feedback: Learn, Speak, Role-play.', ''],
      ['🧱', 'Structure your answer', 'Use the key phrases: 理由は二つあります。まず…次に… Practise giving a reason for every opinion.', ''],
      ['⏱', '4/3/2 drill: explain something', 'Topics below make you explain and compare. Three rounds, faster each time.', 'path-drill:talk.t8'],
    ],
    daily: ['10 min: one unit', '10 min: 4/3/2 drill', '5 min: key phrases'],
    tip: 'Disagreeing in Japanese is soft: agree first, then add your point. 確かにそうですね。ただ…  Never a flat いいえ, 違います to a senior.',
    tipHg: 'Pehle haan kaho, phir apni baat: “tashika ni… tada…”. Senior ko seedha “nahi” mat kaho.',
    kit: `
こっちのほうがいいと思います。|こっちのほうがいいとおもいます。|kotchi no hō ga ii to omoimasu.|I think this one is better.|Mujhe lagta hai yeh wala behtar hai.
理由は二つあります。|りゆうはふたつあります。|riyū wa futatsu arimasu.|There are two reasons.|Do kaaran hain.
まず、安いです。次に、早いです。|まず、やすいです。つぎに、はやいです。|mazu, yasui desu. tsugi ni, hayai desu.|First, it’s cheap. Second, it’s fast.|Pehla, sasta hai. Doosra, jaldi hai.
なぜかというと、時間がないからです。|なぜかというと、じかんがないからです。|naze ka to iu to, jikan ga nai kara desu.|The reason is that there isn’t time.|Kyunki samay nahi hai.
個人的には、賛成です。|こじんてきには、さんせいです。|kojin-teki ni wa, sansei desu.|Personally, I agree.|Mere hisaab se, main sehmat hoon.`,
    missions: ['Give your boss a short progress report in Japanese: conclusion first, then one reason.', 'In a meeting, give one opinion with a reason.', 'Ask a senior for feedback on something you made.'],
    drill: [
      ['A problem at work and how you solved it', 'Kaam ki ek problem aur solution', '問題・原因・どうした・結果・学んだこと'],
      ['India and Japan: compare trains, food or work', 'Bharat aur Japan ki tulna', 'インドでは・日本では・違うところ・同じところ・どっちが好き'],
      ['Recommend a place to visit, and why', 'Ghoomne ki jagah suggest karo', 'どこ・何がある・いつ行く・どうやって・おすすめの理由'],
    ],
    study: { units: ['c-discuss', 'c-suggest', 'c-feedback', 'c-disagree', 'c-report'] },
  },
  {
    id: 't9', icon: '📞', title: 'Phone, meetings & keigo', part: 'Business', time: '3 weeks · 30 min a day',
    goal: 'Answer the office phone, take a message, receive visitors, schedule and run meetings, and write the standard emails, in proper keigo.',
    goalHg: 'Office phone uthana, message lena, mehmaan ka swagat, meeting chalana: sab keigo mein.',
    steps: [
      ['📞', 'Phone calls first', 'The phone is the hardest (no face, fast keigo). Learn the unit until you can answer without thinking.', '#unit/o-phone'],
      ['🤝', 'Visitors, scheduling, favours', 'Visitors & business cards, Scheduling, Favours & saying no: Learn, Speak, Role-play.', ''],
      ['🗂️', 'Meetings and email', 'Meetings, Running a meeting, Chat & online meetings, Email & chat.', ''],
      ['👔', 'Keigo verbs', 'Review the honorific and humble verbs (いらっしゃる / 参る, おっしゃる / 申す).', 'gpoint:sonkeigo'],
    ],
    daily: ['10 min: phone unit (Speak mode)', '10 min: one more unit', '5 min: key phrases', 'Write one work chat message in Japanese'],
    tip: 'On the phone, your own boss is humble to outsiders: 田中は今、席を外しております (no さん). Inside the company, it’s 田中さん again.',
    tipHg: 'Bahar walon se phone par apne boss ke naam ke saath “san” nahi lagate.',
    kit: `
お電話代わりました。|おでんわかわりました。|o-denwa kawarimashita.|Hello, you’re speaking with me now. (taking over a call)|Ji, ab main baat kar raha / rahi hoon.
ご伝言を承りましょうか。|ごでんごんをうけたまわりましょうか。|go-dengon o uketamawarimashō ka?|Shall I take a message?|Kya main aapka message le loon?
申し訳ございません。|もうしわけございません。|mōshiwake gozaimasen.|I’m terribly sorry. (very polite)|Bahut maafi chahta / chahti hoon.
恐れ入ります。|おそれいります。|osoreirimasu.|Thank you. / Excuse me. (very polite)|Bahut shukriya. / Maaf kijiye.
ただいま参ります。|ただいままいります。|tadaima mairimasu.|I’ll be right there. (humble)|Abhi aata / aati hoon.`,
    missions: ['Answer the office phone once (or role-play it with a coworker).', 'Book a meeting room or a meeting time in Japanese.', 'Send one work email or chat in Japanese using お疲れ様です and よろしくお願いします.'],
    study: { units: ['o-phone', 'o-meet', 'c-schedule', 'c-guest', 'c-request', 'c-mail', 'c-runmeeting', 'c-remote'] },
  },
  {
    id: 't10', icon: '🛠️', title: 'Work like a pro', part: 'Business', time: '3 weeks · 30 min a day',
    goal: 'Solve problems in Japanese: IT trouble, tools and test equipment, deadlines and priorities, handing over work, learning new tasks, and thanking people well.',
    goalHg: 'Kaam ki har problem Japanese mein: IT, tools, deadline, handover, nayi cheez seekhna, aur achhe se thank you.',
    steps: [
      ['🛠️', 'Problem units', 'IT & office problems, IT help, Using tools & test equipment: Learn, Speak, Role-play.', ''],
      ['📅', 'Deadlines and handovers', 'Deadlines & priorities, Covering & handing over work, Learning the ropes.', ''],
      ['🧩', 'Sentence builder', 'Swap any software, device or resource into “Can I use X?”, “Could you install X on Y?”. Make ten sentences about your own tools.', '#speak/builder'],
      ['🙏', 'Thanking and praising', 'Thanking & praising coworkers: good relationships make everything easier.', '#unit/c-thanks'],
    ],
    daily: ['10 min: one unit', '5 min: sentence builder', '5 min: role-play', 'Ask for one thing at work in Japanese every day'],
    tip: 'Asking for help is a skill: start with すみません、今少しよろしいですか, say the problem, then the request (〜てもらえますか), and finish with ありがとうございます。助かりました。',
    tipHg: 'Madad maangne ka tareeka: maafi, problem, request, aur shukriya.',
    kit: `
ちょっと困っているんですが…。|ちょっとこまっているんですが…。|chotto komatte iru n desu ga…|I’m having a bit of trouble…|Thodi pareshaani ho rahi hai…
どうすればいいですか。|どうすればいいですか。|dō sureba ii desu ka?|What should I do?|Kya karna chahiye?
今日中にやります。|きょうじゅうにやります。|kyō-jū ni yarimasu.|I’ll do it by the end of today.|Aaj hi kar dunga / dungi.
あと少しで終わります。|あとすこしでおわります。|ato sukoshi de owarimasu.|I’m almost done.|Bas thoda sa baaki hai.`,
    missions: ['Report an IT or equipment problem in Japanese.', 'Negotiate a deadline once: say what you can finish and by when.', 'Thank a coworker specifically for something they did this week.'],
    study: { units: ['c-trouble', 'c-it', 'c-handover', 'c-thanks', 'c-deadline', 'c-ropes', 'c-tools'] },
  },
  {
    id: 't11', icon: '🗣️', title: 'Speak freely', part: 'Fluent', time: '4+ weeks · 30 min a day, then for life',
    goal: 'Talk for two minutes on any everyday or work topic without stopping, switch between casual and polite, and hold a 10-minute conversation with a Japanese speaker.',
    goalHg: 'Kisi bhi topic par do minute bina ruke bolna, casual aur polite dono, aur 10 minute ki baatcheet.',
    steps: [
      ['⏱', '4/3/2 drill on bigger topics', 'One topic a day, three rounds. When 2 minutes feels easy, the topic is done.', 'path-drill:talk.t11'],
      ['🔗', 'Connect your sentences', 'Use the linking words below (それから, でも, だから, 例えば, 実は): they turn short sentences into real talk.', ''],
      ['🔁', 'Shadow at natural speed', 'Settings → Voice speed 1.1–1.2×, then shadow random phrases. Natural Japanese is fast; train your mouth for it.', 'shadow-random:'],
      ['❓', 'All the questions, answered freely', 'Go through every question in the Speak tab and answer in your own words for 30 seconds each.', 'qa:0'],
      ['🧑‍🤝‍🧑', 'Talk to people every week', 'This is the step that matters most. Free 日本語教室 run by local international associations (Fukuroi, Iwata, Hamamatsu), lunch with coworkers, a language exchange.', ''],
      ['🎙', 'Record a 2-minute talk weekly', 'Same topic every 4 weeks: listen back and hear how far you’ve come.', ''],
    ],
    daily: ['10 min: 4/3/2 drill', '10 min: shadowing at 1.1–1.2×', '10 min: answer questions freely', 'Weekly: one real conversation of 10+ minutes in Japanese'],
    tip: 'Fluency is not perfect grammar: it is not stopping. When you lack a word, go around it (〜みたいなもの, 〜するための物) and keep going.',
    tipHg: 'Fluency ka matlab perfect grammar nahi, rukna nahi. Shabd na aaye to ghuma ke bolo aur aage badho.',
    kit: `
それから、|それから、|sorekara,|And then,|Uske baad,
でも、|でも、|demo,|But,|Lekin,
だから、|だから、|dakara,|So,|Isliye,
例えば、|たとえば、|tatoeba,|For example,|Jaise,
実は、|じつは、|jitsu wa,|Actually, / To be honest,|Asal mein,
要するに、|ようするに、|yō suru ni,|In short,|Matlab,
ところで、|ところで、|tokoro de,|By the way,|Waise,
お昼、行かない？|おひる、いかない？|o-hiru, ikanai?|Want to grab lunch? (casual)|Lunch chalein?`,
    missions: ['Join a free 日本語教室 or language exchange and talk for 10 minutes or more.', 'Make a phone call in Japanese: book a restaurant, a haircut or a clinic.', 'Tell a coworker a story (a trip, a funny event) for two minutes.', 'Spend one whole lunch break speaking only Japanese.'],
    drill: [
      ['Your career so far and your goals', 'Career aur aage ke goals', '今までの仕事・どうして日本・今の仕事・これから・夢'],
      ['The hardest thing about living in Japan', 'Japan mein sabse mushkil kya', '何が大変・例えば・どうした・今は・アドバイス'],
      ['A trip you’ll never forget', 'Yaadgaar safar', 'いつ・どこ・だれと・何があった・どう思った'],
      ['Explain your job to a new coworker', 'Naye saathi ko apna kaam samjhao', '仕事の内容・毎日の流れ・使う道具・気をつけること・コツ'],
      ['What you would change at your company, and why', 'Company mein kya badlein aur kyun', '今の問題・理由・提案・メリット・まとめ'],
    ],
    study: {},
  },
];
