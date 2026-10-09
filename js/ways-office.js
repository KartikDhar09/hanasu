// More ways to say each Office Japanese phrase. Format: see js/ways.js.
export const WAYS_OFFICE = `
@o-greet:0
b=
a|お疲れ様です。今、少しよろしいですか。|おつかれさまです。いま、すこしよろしいですか。|otsukaresama desu. ima, sukoshi yoroshii desu ka?|Hi, do you have a moment now?|Namaste, kya abhi thoda samay hai?|The usual way to start talking to a coworker
a|お疲れ様です、{name}です。|おつかれさまです、{name}です。|otsukaresama desu, {nameRo} desu.|Hi, it’s {nameRo}.|Namaste, main {nameRo} bol raha/rahi hoon.|Starting an internal call or chat message
@o-greet:1
b|お先に失礼いたします。|おさきにしつれいいたします。|osaki ni shitsurei itashimasu.|I’ll be leaving before you (very polite).|Main pehle nikal raha/rahi hoon, maaf kijiye.
a|では、お先に失礼します。お疲れ様でした。|では、おさきにしつれいします。おつかれさまでした。|de wa, osaki ni shitsurei shimasu. otsukaresama deshita.|Well, I’ll head off first. Good work today.|Achha, main pehle chalta/chalti hoon. Aaj ki mehnat ke liye shukriya.
a|今日はこれで失礼します。|きょうはこれでしつれいします。|kyō wa kore de shitsurei shimasu.|That’s it for me today.|Aaj ke liye bas, main chalta/chalti hoon.
@o-greet:2
b=
a|今日もお疲れ様でした。|きょうもおつかれさまでした。|kyō mo otsukaresama deshita.|Thanks for all your work today, too.|Aaj bhi bahut mehnat ki, shukriya.
a|長い一日でしたね。お疲れ様でした。|ながいいちにちでしたね。おつかれさまでした。|nagai ichinichi deshita ne. otsukaresama deshita.|It was a long day. Good work.|Lamba din tha na. Achha kaam kiya.
a|お疲れ様でした、気をつけて。|おつかれさまでした、きをつけて。|otsukaresama deshita, ki o tsukete.|Good work, take care going home.|Shukriya, dhyan se jaana.
@o-greet:3
b|失礼いたします。|しつれいいたします。|shitsurei itashimasu.|Excuse me (very polite).|Maaf kijiye, andar aa sakta/sakti hoon.
a|失礼します。入ってもよろしいですか。|しつれいします。はいってもよろしいですか。|shitsurei shimasu. haitte mo yoroshii desu ka?|Excuse me. May I come in?|Maaf kijiye, kya main andar aa sakta/sakti hoon?
a|では、失礼します。|では、しつれいします。|de wa, shitsurei shimasu.|Well, excuse me (leaving).|Achha, main chalta/chalti hoon.
@o-greet:4
b|行ってまいります。|いってまいります。|itte mairimasu.|I’m heading out (humble).|Main jaakar aata/aati hoon.
a|ちょっと出てきます。|ちょっとでてきます。|chotto dete kimasu.|I’m popping out for a bit.|Main thodi der ke liye bahar ja raha/rahi hoon.
a|客先に行ってきます。三時に戻ります。|きゃくさきにいってきます。さんじにもどります。|kyakusaki ni itte kimasu. sanji ni modorimasu.|I’m off to the client. Back at three.|Main client ke paas ja raha/rahi hoon. Teen baje laut aaunga/aaungi.
@o-greet:5
b=
a|ただ今、帰社しました。|ただいま、きしゃしました。|tadaima, kisha shimashita.|I’m back at the office now.|Main abhi office wapas aa gaya/gayi.
a|遅くなりました。今戻りました。|おそくなりました。いまもどりました。|osoku narimashita. ima modorimashita.|Sorry I took a while. I’m back now.|Der ho gayi, abhi laut aaya/aayi.
@o-greet:6
b|お疲れ様です。|おつかれさまです。|otsukaresama desu.|Welcome back (thanks for your work outside).|Wapas aaye, shukriya.|To a senior coming back, お疲れ様です sounds more respectful
a|お帰りなさい。どうでしたか。|おかえりなさい。どうでしたか。|okaerinasai. dō deshita ka?|Welcome back. How did it go?|Wapas aa gaye. Kaisa raha?
a|お帰りなさい。外、暑かったでしょう。|おかえりなさい。そと、あつかったでしょう。|okaerinasai. soto, atsukatta deshō.|Welcome back. It must have been hot out there.|Wapas aa gaye. Bahar garmi thi na?
@o-greet:7
b=
a|お世話になっております。|おせわになっております。|osewa ni natte orimasu.|Thank you for your support (shorter).|Aapke sahyog ke liye dhanyavaad.
a|大変お世話になっております。|たいへんおせわになっております。|taihen osewa ni natte orimasu.|We are greatly indebted to you.|Aapka bahut aabhaar hai.
a|いつもありがとうございます。|いつもありがとうございます。|itsumo arigatō gozaimasu.|Thank you as always.|Hamesha ki tarah shukriya.|Friendlier, for regular contacts
@o-intro:0
b|本日よりお世話になります。|ほんじつよりおせわになります。|honjitsu yori osewa ni narimasu.|I join you from today (formal).|Aaj se main aapke saath kaam karunga/karungi.
a|今日からよろしくお願いします。|きょうからよろしくおねがいします。|kyō kara yoroshiku onegaishimasu.|I’m starting today; I look forward to working with you.|Aaj se shuru kar raha/rahi hoon, saath kaam karne ka intezaar hai.
a|今日から入社しました。|きょうからにゅうしゃしました。|kyō kara nyūsha shimashita.|I’ve joined the company as of today.|Maine aaj se company join ki hai.
@o-intro:1
b=
a|{name}です。|{name}です。|{nameRo} desu.|I’m {nameRo}.|Main {nameRo} hoon.|To coworkers your age, once you’ve been introduced
a|{country}から来ました、{name}です。|{countryKana}からきました、{name}です。|{countryRo} kara kimashita, {nameRo} desu.|I’m {nameRo}, from {countryEn}.|Main {nameRo} hoon, {countryHi} se.
a|{name}と言います。|{name}といいます。|{nameRo} to iimasu.|I’m called {nameRo}.|Mujhe {nameRo} kehte hain.
@o-intro:2
b|技術部に配属となりました。|ぎじゅつぶにはいぞくとなりました。|gijutsubu ni haizoku to narimashita.|I have been assigned to the engineering department.|Mujhe engineering department mein bheja gaya hai.
a|技術部に入りました。|ぎじゅつぶにはいりました。|gijutsubu ni hairimashita.|I’ve joined engineering.|Main engineering mein aaya/aayi hoon.
a|技術部の所属です。|ぎじゅつぶのしょぞくです。|gijutsubu no shozoku desu.|I belong to the engineering department.|Main engineering department se hoon.
@o-intro:3
b|日本語はまだ勉強中のため、不十分な点もあるかと思いますが、よろしくお願いいたします。|にほんごはまだべんきょうちゅうのため、ふじゅうぶんなてんもあるかとおもいますが、よろしくおねがいいたします。|nihongo wa mada benkyō-chū no tame, fujūbun na ten mo aru ka to omoimasu ga, yoroshiku onegai itashimasu.|My Japanese is still a work in progress, so please bear with me.|Meri Japanese abhi kachchi hai, kripya sahyog kijiye.
a|日本語、勉強しているところです。|にほんご、べんきょうしているところです。|nihongo, benkyō shite iru tokoro desu.|I’m in the middle of learning Japanese.|Main abhi Japanese seekh raha/rahi hoon.
a|日本語はまだまだです。|にほんごはまだまだです。|nihongo wa madamada desu.|My Japanese still has a long way to go.|Meri Japanese abhi bahut kachchi hai.
@o-intro:4
b|至らない点も多いかと存じますが、ご指導のほどよろしくお願いいたします。|いたらないてんもおおいかとぞんじますが、ごしどうのほどよろしくおねがいいたします。|itaranai ten mo ōi ka to zonjimasu ga, go-shidō no hodo yoroshiku onegai itashimasu.|I’m sure I have much to learn; I would appreciate your guidance.|Mujhme abhi bahut kami hogi, kripya maargdarshan dijiye.
a|色々教えていただけると助かります。|いろいろおしえていただけるとたすかります。|iroiro oshiete itadakeru to tasukarimasu.|I’d be grateful if you could teach me lots.|Aap mujhe cheezein sikhayenge toh badi madad hogi.
a|わからないことがあったら、聞いてもいいですか。|わからないことがあったら、きいてもいいですか。|wakaranai koto ga attara, kiite mo ii desu ka?|If I don’t understand something, can I ask you?|Kuch samajh na aaye toh aapse pooch sakta/sakti hoon?
@o-intro:5
b|精一杯努めてまいります。|せいいっぱいつとめてまいります。|seiippai tsutomete mairimasu.|I will do my utmost.|Main poori koshish karunga/karungi.
a|全力で頑張ります。|ぜんりょくでがんばります。|zenryoku de ganbarimasu.|I’ll give it everything.|Main poori taakat lagaunga/lagaungi.
a|早く戦力になれるよう頑張ります。|はやくせんりょくになれるようがんばります。|hayaku senryoku ni nareru yō ganbarimasu.|I’ll work hard to be useful to the team quickly.|Jaldi team ke kaam aane ki koshish karunga/karungi.
@o-intro:6
b=
a|よろしくお願いします。|よろしくおねがいします。|yoroshiku onegaishimasu.|I look forward to working with you.|Aapke saath kaam karne ka intezaar hai.
a|皆さん、これからよろしくお願いします。|みなさん、これからよろしくおねがいします。|minasan, kore kara yoroshiku onegaishimasu.|Everyone, I look forward to working with you.|Sabhi ko, aage ke liye saath chahiye.
@o-ask:0
b|恐れ入りますが、少々お時間よろしいでしょうか。|おそれいりますが、しょうしょうおじかんよろしいでしょうか。|osoreirimasu ga, shōshō o-jikan yoroshii deshō ka?|Excuse me, could I have a moment of your time?|Maaf kijiye, kya aap thoda samay de sakte hain?
a|今、少しだけいいですか。|いま、すこしだけいいですか。|ima, sukoshi dake ii desu ka?|Do you have just a minute now?|Abhi bas ek minute milega?
a|お忙しいところすみません。|おいそがしいところすみません。|o-isogashii tokoro sumimasen.|Sorry to bother you while you’re busy.|Aap vyast hain, phir bhi disturb kar raha/rahi hoon, maaf kijiye.
@o-ask:1
b|今、お時間よろしいでしょうか。|いま、おじかんよろしいでしょうか。|ima, o-jikan yoroshii deshō ka?|Would now be a convenient time?|Kya abhi aapke paas samay hai?
a|今、話しかけても大丈夫ですか。|いま、はなしかけてもだいじょうぶですか。|ima, hanashikakete mo daijōbu desu ka?|Is it OK to talk to you now?|Abhi baat kar sakte hain?
a|五分だけいいですか。|ごふんだけいいですか。|gofun dake ii desu ka?|Can I have just five minutes?|Bas paanch minute milenge?
@o-ask:2
b|一点、質問させていただいてもよろしいでしょうか。|いってん、しつもんさせていただいてもよろしいでしょうか。|itten, shitsumon sasete itadaite mo yoroshii deshō ka?|May I ask one question?|Kya main ek sawaal pooch sakta/sakti hoon?
a|ちょっと聞いてもいいですか。|ちょっときいてもいいですか。|chotto kiite mo ii desu ka?|Can I ask you something?|Kuch pooch sakta/sakti hoon?
a|一つ質問があるんですが。|ひとつしつもんがあるんですが。|hitotsu shitsumon ga arun desu ga.|I have a question.|Mera ek sawaal hai.
@o-ask:3
b|こちらはどのように進めればよろしいでしょうか。|こちらはどのようにすすめればよろしいでしょうか。|kochira wa dono yō ni susumereba yoroshii deshō ka?|How should I proceed with this?|Ise kaise aage badhaun?
a|これのやり方を教えてください。|これのやりかたをおしえてください。|kore no yarikata o oshiete kudasai.|Please show me how to do this.|Yeh kaise karte hain, bataiye.
a|これはどうすればいいですか。|これはどうすればいいですか。|kore wa dō sureba ii desu ka?|What should I do with this?|Iska kya karna chahiye?
@o-ask:4
b|教えていただけますか。|おしえていただけますか。|oshiete itadakemasu ka?|Could you kindly show me?|Kya aap mujhe sikha denge?
a|教えてもらってもいいですか。|おしえてもらってもいいですか。|oshiete moratte mo ii desu ka?|Is it OK if you show me?|Aap mujhe bata sakte hain?
a|やり方を見せてもらえますか。|やりかたをみせてもらえますか。|yarikata o misete moraemasu ka?|Could you show me how it’s done?|Karke dikhayenge?
@o-ask:5
b|こちら、ご確認いただけますでしょうか。|こちら、ごかくにんいただけますでしょうか。|kochira, go-kakunin itadakemasu deshō ka?|Could you please review this?|Kya aap ise check kar denge?
a|これ、見てもらえますか。|これ、みてもらえますか。|kore, mite moraemasu ka?|Could you look at this?|Ise dekh lenge?
a|これで合っているか、確認してもらえますか。|これであっているか、かくにんしてもらえますか。|kore de atte iru ka, kakunin shite moraemasu ka?|Could you check whether this is right?|Yeh sahi hai ya nahi, check kar denge?
@o-ask:6
b|お手伝いいただけないでしょうか。|おてつだいいただけないでしょうか。|o-tetsudai itadakenai deshō ka?|Would you be able to help me?|Kya aap meri madad kar sakte hain?
a|手を貸してもらえますか。|てをかしてもらえますか。|te o kashite moraemasu ka?|Could you lend me a hand?|Thoda haath bataenge?
a|ちょっと手伝ってほしいんですが。|ちょっとてつだってほしいんですが。|chotto tetsudatte hoshiin desu ga.|I’d like a little help.|Mujhe thodi madad chahiye.
@o-ask:7
b|大変助かりました。ありがとうございました。|たいへんたすかりました。ありがとうございました。|taihen tasukarimashita. arigatō gozaimashita.|That was a great help. Thank you very much.|Isse bahut madad mili. Bahut shukriya.
a|本当に助かりました。|ほんとうにたすかりました。|hontō ni tasukarimashita.|You really saved me.|Sach mein badi madad hui.
a|おかげで助かりました。|おかげでたすかりました。|okage de tasukarimashita.|Thanks to you, it worked out.|Aapki wajah se kaam ban gaya.
@o-task:0
b|承知いたしました。|しょうちいたしました。|shōchi itashimashita.|Understood (very polite).|Samajh gaya/gayi.
a|わかりました、やっておきます。|わかりました、やっておきます。|wakarimashita, yatte okimasu.|Got it, I’ll take care of it.|Theek hai, main kar dunga/dungi.
a|はい、対応します。|はい、たいおうします。|hai, taiō shimasu.|Yes, I’ll handle it.|Ji, main sambhal lunga/lungi.
@o-task:1
b=
a|はい、かしこまりました。すぐにご用意します。|はい、かしこまりました。すぐにごよういします。|hai, kashikomarimashita. sugu ni go-yōi shimasu.|Certainly. I’ll prepare it right away.|Ji zaroor, abhi taiyaar karta/karti hoon.
a|承りました。|うけたまわりました。|uketamawarimashita.|Your request is received (very formal).|Aapka anurodh mil gaya.|Taking an order or request from a customer
@o-task:2
b|いつまでにご用意すればよろしいでしょうか。|いつまでにごよういすればよろしいでしょうか。|itsu made ni go-yōi sureba yoroshii deshō ka?|By when should I have it ready?|Ise kab tak taiyaar karna hai?
a|締め切りはいつですか。|しめきりはいつですか。|shimekiri wa itsu desu ka?|When’s the deadline?|Deadline kab hai?
a|いつまでに必要ですか。|いつまでにひつようですか。|itsu made ni hitsuyō desu ka?|When do you need it by?|Kab tak chahiye?
@o-task:3
b|直ちに対応いたします。|ただちにたいおういたします。|tadachi ni taiō itashimasu.|I will deal with it immediately.|Main turant iska dhyan rakhta/rakhti hoon.
a|今すぐやります。|いますぐやります。|ima sugu yarimasu.|I’ll do it right now.|Abhi karta/karti hoon.
a|すぐ取りかかります。|すぐとりかかります。|sugu torikakarimasu.|I’ll get started right away.|Turant shuru karta/karti hoon.
@o-task:4
b|少々お時間をいただくことになりそうです。|しょうしょうおじかんをいただくことになりそうです。|shōshō o-jikan o itadaku koto ni narisō desu.|I may need a little more time.|Mujhe thoda aur samay lagega.
a|もう少しかかりそうです。|もうすこしかかりそうです。|mō sukoshi kakarisō desu.|It’ll take a bit longer.|Thoda aur samay lagega.
a|今日中は難しいかもしれません。|きょうじゅうはむずかしいかもしれません。|kyōjū wa muzukashii kamo shiremasen.|It might be hard to finish today.|Aaj khatam karna mushkil ho sakta hai.
@o-task:5
b|完了いたしました。ご確認のほどよろしくお願いいたします。|かんりょういたしました。ごかくにんのほどよろしくおねがいいたします。|kanryō itashimashita. go-kakunin no hodo yoroshiku onegai itashimasu.|It’s complete. I’d appreciate your review.|Kaam poora ho gaya. Kripya ek baar check kar lijiye.
a|できました。見てもらえますか。|できました。みてもらえますか。|dekimashita. mite moraemasu ka?|It’s ready. Could you take a look?|Ho gaya. Ek baar dekh lenge?
a|終わったので、チェックお願いします。|おわったので、チェックおねがいします。|owatta node, chekku onegaishimasu.|It’s finished, so please check it.|Ho gaya hai, check kar lijiye.
@o-task:6
b|申し訳ありません、まだ完了しておりません。|もうしわけありません、まだかんりょうしておりません。|mōshiwake arimasen, mada kanryō shite orimasen.|I’m sorry, it isn’t complete yet.|Maaf kijiye, abhi poora nahi hua hai.
a|すみません、もう少しで終わります。|すみません、もうすこしでおわります。|sumimasen, mō sukoshi de owarimasu.|Sorry, it’s almost done.|Maaf kijiye, bas hone wala hai.
a|まだ途中です。|まだとちゅうです。|mada tochū desu.|It’s still in progress.|Abhi beech mein hai.
@o-task:7
b|確認のうえ、改めてご連絡いたします。|かくにんのうえ、あらためてごれんらくいたします。|kakunin no ue, aratamete go-renraku itashimasu.|I’ll check and contact you again.|Check karke main phir se sampark karunga/karungi.
a|調べて、後で連絡します。|しらべて、あとでれんらくします。|shirabete, ato de renraku shimasu.|I’ll look into it and get back to you later.|Pata karke baad mein batata/batati hoon.
a|確認してから返事します。|かくにんしてからへんじします。|kakunin shite kara henji shimasu.|I’ll reply after I check.|Check karne ke baad jawaab dunga/dungi.
@o-sorry:0
b|大変申し訳ございません。|たいへんもうしわけございません。|taihen mōshiwake gozaimasen.|I am terribly sorry.|Mujhe bahut bahut khed hai.
a|ご迷惑をおかけしてすみません。|ごめいわくをおかけしてすみません。|go-meiwaku o okake shite sumimasen.|Sorry for the trouble I caused.|Aapko takleef di, maaf kijiye.
a|本当にすみませんでした。|ほんとうにすみませんでした。|hontō ni sumimasen deshita.|I’m really sorry.|Sach mein maaf kijiye.
@o-sorry:1
b|遅れてしまい、申し訳ありません。|おくれてしまい、もうしわけありません。|okurete shimai, mōshiwake arimasen.|I apologise for being late.|Der se aane ke liye maafi chahta/chahti hoon.
a|遅くなってすみません。|おそくなってすみません。|osoku natte sumimasen.|Sorry I’m late.|Der ho gayi, maaf kijiye.
a|お待たせしてすみません。|おまたせしてすみません。|o-matase shite sumimasen.|Sorry to keep you waiting.|Intezaar karwaya, maaf kijiye.
@o-sorry:2
b|電車の遅延により、到着が遅れております。|でんしゃのちえんにより、とうちゃくがおくれております。|densha no chien ni yori, tōchaku ga okurete orimasu.|Due to a train delay, I’m running late.|Train late hone ki wajah se main der se pahunch raha/rahi hoon.
a|電車が止まってしまって…。|でんしゃがとまってしまって…。|densha ga tomatte shimatte...|The train has stopped…|Train ruk gayi hai…
a|人身事故で電車が遅れています。|じんしんじこででんしゃがおくれています。|jinshin jiko de densha ga okurete imasu.|The train is delayed by an accident on the line.|Line par haadse ki wajah se train late hai.
@o-sorry:3
b|十分ほど遅れて到着いたします。|じゅっぷんほどおくれてとうちゃくいたします。|juppun hodo okurete tōchaku itashimasu.|I will arrive about ten minutes late.|Main lagbhag das minute der se pahunchunga/pahunchungi.
a|十分くらい遅れます。|じゅっぷんくらいおくれます。|juppun kurai okuremasu.|I’ll be about ten minutes late.|Das minute late ho jaunga/jaungi.
a|あと十分で着きます。|あとじゅっぷんでつきます。|ato juppun de tsukimasu.|I’ll be there in ten minutes.|Das minute mein pahunch jaunga/jaungi.
@o-sorry:4
b|私の不注意でした。申し訳ありません。|わたしのふちゅういでした。もうしわけありません。|watashi no fuchūi deshita. mōshiwake arimasen.|It was my carelessness. I’m very sorry.|Meri laaparwahi thi. Maaf kijiye.
a|私が間違えました。すみません。|わたしがまちがえました。すみません。|watashi ga machigaemashita. sumimasen.|I got it wrong. Sorry.|Galti meri thi. Maaf kijiye.
a|確認不足でした。|かくにんぶそくでした。|kakunin-busoku deshita.|I didn’t check it enough.|Maine theek se check nahi kiya.
@o-sorry:5
b|早急に修正いたします。|そうきゅうにしゅうせいいたします。|sōkyū ni shūsei itashimasu.|I will correct it promptly.|Main ise turant theek karunga/karungi.
a|今すぐ修正します。|いますぐしゅうせいします。|ima sugu shūsei shimasu.|I’ll fix it right now.|Abhi theek karta/karti hoon.
a|すぐに対応します。|すぐにたいおうします。|sugu ni taiō shimasu.|I’ll deal with it straight away.|Turant dekh leta/leti hoon.
@o-sorry:6
b|今後このようなことがないよう、十分注意いたします。|こんごこのようなことがないよう、じゅうぶんちゅういいたします。|kongo kono yō na koto ga nai yō, jūbun chūi itashimasu.|I will take great care that this doesn’t happen again.|Aage se aisa na ho, iska poora dhyan rakhunga/rakhungi.
a|二度としないようにします。|にどとしないようにします。|nido to shinai yō ni shimasu.|I’ll make sure it never happens again.|Dobara aisa nahi hoga.
a|以後、気をつけます。|いご、きをつけます。|igo, ki o tsukemasu.|I’ll be careful from here on.|Ab se dhyan rakhunga/rakhungi.
@o-phone:0
b=
a|お電話ありがとうございます。さくら商事でございます。|おでんわありがとうございます。さくらしょうじでございます。|o-denwa arigatō gozaimasu. sakura shōji de gozaimasu.|Thank you for calling, Sakura Trading.|Phone karne ke liye shukriya, Sakura Trading.
a|はい、さくら商事、{name}でございます。|はい、さくらしょうじ、{name}でございます。|hai, sakura shōji, {nameRo} de gozaimasu.|Sakura Trading, {nameRo} speaking.|Sakura Trading, main {nameRo} bol raha/rahi hoon.
a|お待たせいたしました。さくら商事でございます。|おまたせいたしました。さくらしょうじでございます。|o-matase itashimashita. sakura shōji de gozaimasu.|Sorry to keep you waiting, Sakura Trading.|Intezaar ke liye maaf kijiye, Sakura Trading.|When the phone rang three times or more
@o-phone:1
b|少々お待ちくださいませ。|しょうしょうおまちくださいませ。|shōshō o-machi kudasaimase.|Please wait one moment (very polite).|Kripya ek kshan pratiksha kijiye.
a|ただいまおつなぎします。|ただいまおつなぎします。|tadaima o-tsunagi shimasu.|I’ll put you through now.|Abhi call connect kar raha/rahi hoon.
a|確認しますので、お待ちいただけますか。|かくにんしますので、おまちいただけますか。|kakunin shimasu node, o-machi itadakemasu ka?|I’ll check, so could you hold?|Main check karta/karti hoon, thoda rukenge?
@o-phone:2
b|恐れ入りますが、お名前を頂戴できますでしょうか。|おそれいりますが、おなまえをちょうだいできますでしょうか。|osoreirimasu ga, o-namae o chōdai dekimasu deshō ka?|Excuse me, may I have your name?|Maaf kijiye, kya main aapka naam jaan sakta/sakti hoon?
a|失礼ですが、お名前は？|しつれいですが、おなまえは？|shitsurei desu ga, o-namae wa?|Excuse me, your name is…?|Maaf kijiye, aapka naam?
a|どちら様でしょうか。|どちらさまでしょうか。|dochira-sama deshō ka?|Who is calling, please?|Kaun bol rahe hain?
@o-phone:3
b|あいにく田中は席を外しております。|あいにくたなかはせきをはずしております。|ainiku tanaka wa seki o hazushite orimasu.|Unfortunately, Tanaka is away from the desk.|Afsos, Tanaka abhi apni seat par nahi hain.
a|田中は外出しております。|たなかはがいしゅつしております。|tanaka wa gaishutsu shite orimasu.|Tanaka is out of the office.|Tanaka abhi bahar gaye hain.
a|田中は会議中です。|たなかはかいぎちゅうです。|tanaka wa kaigi-chū desu.|Tanaka is in a meeting.|Tanaka abhi meeting mein hain.
@o-phone:4
b|戻り次第、折り返しお電話させていただきます。|もどりしだい、おりかえしおでんわさせていただきます。|modori shidai, orikaeshi o-denwa sasete itadakimasu.|As soon as they’re back, we will call you back.|Wapas aate hi aapko call kiya jayega.
a|折り返し電話してもいいですか。|おりかえしでんわしてもいいですか。|orikaeshi denwa shite mo ii desu ka?|Can I call you back?|Main aapko baad mein call karun?
a|後ほどこちらからお電話します。|のちほどこちらからおでんわします。|nochihodo kochira kara o-denwa shimasu.|We’ll call you later.|Hum baad mein aapko call karenge.
@o-phone:5
b|恐れ入りますが、もう一度おっしゃっていただけますか。|おそれいりますが、もういちどおっしゃっていただけますか。|osoreirimasu ga, mō ichido osshatte itadakemasu ka?|Sorry, could you say that once more?|Maaf kijiye, kya aap ek baar phir kahenge?
a|すみません、もう一回お願いできますか。|すみません、もういっかいおねがいできますか。|sumimasen, mō ikkai onegai dekimasu ka?|Sorry, one more time please?|Maaf kijiye, ek baar aur?
a|申し訳ありません、聞き取れませんでした。|もうしわけありません、ききとれませんでした。|mōshiwake arimasen, kikitoremasen deshita.|I’m sorry, I couldn’t catch that.|Maaf kijiye, main sun nahi paaya/paayi.
@o-phone:6
b=
a|すみません、声が聞こえにくいです。|すみません、こえがきこえにくいです。|sumimasen, koe ga kikoenikui desu.|Sorry, it’s hard to hear you.|Maaf kijiye, aawaaz theek se nahi aa rahi.
a|電波が悪いみたいです。|でんぱがわるいみたいです。|denpa ga warui mitai desu.|The signal seems bad.|Network kharab lag raha hai.
@o-phone:7
b|お忙しいところ、お電話ありがとうございました。|おいそがしいところ、おでんわありがとうございました。|o-isogashii tokoro, o-denwa arigatō gozaimashita.|Thank you for calling despite being busy.|Vyast hote hue bhi call karne ke liye shukriya.
a|ご連絡ありがとうございました。|ごれんらくありがとうございました。|go-renraku arigatō gozaimashita.|Thank you for getting in touch.|Sampark karne ke liye shukriya.
a|わざわざありがとうございました。|わざわざありがとうございました。|wazawaza arigatō gozaimashita.|Thank you for taking the trouble.|Itni zehmat uthane ke liye shukriya.
@o-phone:8
b=
a|それでは、失礼いたします。|それでは、しつれいいたします。|sore de wa, shitsurei itashimasu.|Well then, goodbye.|Achha, phir milte hain.
a|では、よろしくお願いいたします。失礼いたします。|では、よろしくおねがいいたします。しつれいいたします。|de wa, yoroshiku onegai itashimasu. shitsurei itashimasu.|Thank you, and goodbye.|Toh, kripya dhyan rakhiye. Namaste.
@o-meet:0
b|会議は何時からでしょうか。|かいぎはなんじからでしょうか。|kaigi wa nanji kara deshō ka?|What time does the meeting start?|Meeting kitne baje se hai?
a|会議、何時に始まりますか。|かいぎ、なんじにはじまりますか。|kaigi, nanji ni hajimarimasu ka?|What time does the meeting begin?|Meeting kab shuru hogi?
a|打ち合わせは何時からでしたっけ。|うちあわせはなんじからでしたっけ。|uchiawase wa nanji kara deshita kke?|What time was the meeting again?|Meeting kitne baje thi, yaad nahi?
@o-meet:1
b|会議室はどちらでしょうか。|かいぎしつはどちらでしょうか。|kaigishitsu wa dochira deshō ka?|Which way is the meeting room?|Meeting room kis taraf hai?
a|会議室の場所を教えてください。|かいぎしつのばしょをおしえてください。|kaigishitsu no basho o oshiete kudasai.|Please tell me where the meeting room is.|Meeting room kahan hai, bataiye.
a|今日の会議、どの部屋ですか。|きょうのかいぎ、どのへやですか。|kyō no kaigi, dono heya desu ka?|Which room is today’s meeting in?|Aaj ki meeting kis kamre mein hai?
@o-meet:2
b|画面を共有させていただきます。|がめんをきょうゆうさせていただきます。|gamen o kyōyū sasete itadakimasu.|Allow me to share my screen.|Main apni screen share karta/karti hoon.
a|今から画面を共有します。|いまからがめんをきょうゆうします。|ima kara gamen o kyōyū shimasu.|I’ll share my screen now.|Abhi screen share karta/karti hoon.
a|資料を映しますね。|しりょうをうつしますね。|shiryō o utsushimasu ne.|I’ll put the slides up.|Main documents dikhata/dikhati hoon.
@o-meet:3
b|画面は見えておりますでしょうか。|がめんはみえておりますでしょうか。|gamen wa miete orimasu deshō ka?|Can you see the screen?|Kya aapko screen dikh rahi hai?
a|画面、ちゃんと映ってますか。|がめん、ちゃんとうつってますか。|gamen, chanto utsuttemasu ka?|Is my screen showing properly?|Screen theek se dikh rahi hai?
a|資料、見えますか。|しりょう、みえますか。|shiryō, miemasu ka?|Can you see the document?|Document dikh raha hai?
@o-meet:4
b|私の声は聞こえておりますでしょうか。|わたしのこえはきこえておりますでしょうか。|watashi no koe wa kikoete orimasu deshō ka?|Can you hear my voice?|Kya aapko meri aawaaz aa rahi hai?
a|音声、大丈夫ですか。|おんせい、だいじょうぶですか。|onsei, daijōbu desu ka?|Is the audio OK?|Audio theek hai?
a|聞こえますか。|きこえますか。|kikoemasu ka?|Can you hear me?|Sunai de raha hai?
@o-meet:5
b|一点、よろしいでしょうか。|いってん、よろしいでしょうか。|itten, yoroshii deshō ka?|May I raise one point?|Kya main ek baat keh sakta/sakti hoon?
a|一つ付け加えてもいいですか。|ひとつつけくわえてもいいですか。|hitotsu tsukekuwaete mo ii desu ka?|Can I add one thing?|Ek baat jod sakta/sakti hoon?
a|ちょっと補足させてください。|ちょっとほそくさせてください。|chotto hosoku sasete kudasai.|Let me add a little.|Thoda aur jodna chahta/chahti hoon.
@o-meet:6
b|よろしいかと存じます。|よろしいかとぞんじます。|yoroshii ka to zonjimasu.|I believe that is fine.|Mere vichaar se yeh theek hai.
a|賛成です。|さんせいです。|sansei desu.|I agree.|Main sahmat hoon.
a|それでいいと思います。|それでいいとおもいます。|sore de ii to omoimasu.|I think that works.|Mujhe lagta hai yeh theek hai.
@o-meet:7
b|一度検討させていただけますか。|いちどけんとうさせていただけますか。|ichido kentō sasete itadakemasu ka?|May I consider it first?|Kya main ek baar is par vichaar kar sakta/sakti hoon?
a|持ち帰って検討します。|もちかえってけんとうします。|mochikaette kentō shimasu.|I’ll take it back and consider it.|Main ise le jaakar sochta/sochti hoon.
a|少し時間をもらえますか。|すこしじかんをもらえますか。|sukoshi jikan o moraemasu ka?|Could I have a little time?|Thoda samay milega?
@o-meet:8
b|以上でございます。|いじょうでございます。|ijō de gozaimasu.|That concludes my part.|Mera bas itna hi tha.
a|私からは以上です。|わたしからはいじょうです。|watashi kara wa ijō desu.|That’s all from me.|Meri taraf se bas itna.
a|説明は以上です。|せつめいはいじょうです。|setsumei wa ijō desu.|That’s the end of my explanation.|Samjhaana bas itna tha.
@o-life:0
b|明日、お休みをいただいてもよろしいでしょうか。|あした、おやすみをいただいてもよろしいでしょうか。|ashita, o-yasumi o itadaite mo yoroshii deshō ka?|Would it be all right if I took tomorrow off?|Kya main kal chhutti le sakta/sakti hoon?
a|明日、休んでもいいですか。|あした、やすんでもいいですか。|ashita, yasunde mo ii desu ka?|Can I be off tomorrow?|Kal chhutti le loon?
a|明日、有給を取りたいんですが。|あした、ゆうきゅうをとりたいんですが。|ashita, yūkyū o toritain desu ga.|I’d like to take paid leave tomorrow.|Kal paid leave lena chahta/chahti hoon.
@o-life:1
b|体調不良のため、本日はお休みをいただきます。|たいちょうふりょうのため、ほんじつはおやすみをいただきます。|taichō furyō no tame, honjitsu wa o-yasumi o itadakimasu.|Due to illness, I will take today off.|Tabiyat kharab hone ki wajah se aaj chhutti le raha/rahi hoon.
a|熱があるので、今日は休みます。|ねつがあるので、きょうはやすみます。|netsu ga aru node, kyō wa yasumimasu.|I have a fever, so I’m off today.|Bukhaar hai, isliye aaj chhutti.
a|すみません、今日は体調不良で休みます。|すみません、きょうはたいちょうふりょうでやすみます。|sumimasen, kyō wa taichō furyō de yasumimasu.|Sorry, I’m off sick today.|Maaf kijiye, aaj tabiyat kharab hai, nahi aa paunga/paungi.
@o-life:2
b|通院のため、早退させていただいてもよろしいでしょうか。|つういんのため、そうたいさせていただいてもよろしいでしょうか。|tsūin no tame, sōtai sasete itadaite mo yoroshii deshō ka?|May I leave early for a hospital appointment?|Hospital jaana hai, kya main jaldi ja sakta/sakti hoon?
a|病院の予約があるので、早めに帰ってもいいですか。|びょういんのよやくがあるので、はやめにかえってもいいですか。|byōin no yoyaku ga aru node, hayame ni kaette mo ii desu ka?|I have a hospital appointment; can I go home early?|Hospital ka appointment hai, jaldi ghar ja sakta/sakti hoon?
a|今日、三時に上がってもいいですか。|きょう、さんじにあがってもいいですか。|kyō, sanji ni agatte mo ii desu ka?|Can I finish at three today?|Aaj teen baje chhutti le sakta/sakti hoon?
@o-life:3
b|本日は残業いたします。|ほんじつはざんぎょういたします。|honjitsu wa zangyō itashimasu.|I will be working overtime today.|Aaj main overtime karunga/karungi.
a|今日はちょっと遅くまで残ります。|きょうはちょっとおそくまでのこります。|kyō wa chotto osoku made nokorimasu.|I’m staying a bit late today.|Aaj thodi der tak rukunga/rukungi.
a|これを終わらせてから帰ります。|これをおわらせてからかえります。|kore o owarasete kara kaerimasu.|I’ll go home after finishing this.|Yeh khatam karke ghar jaunga/jaungi.
@o-life:4
b|本日は暑いですね。|ほんじつはあついですね。|honjitsu wa atsui desu ne.|It’s hot today, isn’t it? (formal)|Aaj garmi hai na.
a|今日は蒸し暑いですね。|きょうはむしあついですね。|kyō wa mushiatsui desu ne.|It’s humid today, isn’t it?|Aaj umas hai na?
a|毎日暑いですね。|まいにちあついですね。|mainichi atsui desu ne.|It’s hot every day, isn’t it?|Roz garmi hai na?
@o-life:5
b|週末はいかがでしたか。|しゅうまつはいかがでしたか。|shūmatsu wa ikaga deshita ka?|How was your weekend?|Aapka weekend kaisa raha?
a|週末、何かしましたか。|しゅうまつ、なにかしましたか。|shūmatsu, nanika shimashita ka?|Did you do anything at the weekend?|Weekend par kuch kiya?
a|休み、ゆっくりできましたか。|やすみ、ゆっくりできましたか。|yasumi, yukkuri dekimashita ka?|Did you get to relax on your days off?|Chhutti mein aaram mila?
@o-life:6
b|よろしければ、お昼をご一緒しませんか。|よろしければ、おひるをごいっしょしませんか。|yoroshikereba, o-hiru o go-issho shimasen ka?|If you’re free, shall we have lunch together?|Agar aap free hain, toh saath lunch karein?
a|お昼、一緒にどうですか。|おひる、いっしょにどうですか。|o-hiru, issho ni dō desu ka?|How about lunch together?|Lunch saath mein karein?
a|ランチ行きませんか。|ランチいきませんか。|ranchi ikimasen ka?|Shall we go for lunch?|Lunch chalein?
@o-life:7
b|皆様のご健康を祈って、乾杯！|みなさまのごけんこうをいのって、かんぱい！|minasama no go-kenkō o inotte, kanpai!|To everyone’s good health, cheers!|Sabki achhi sehat ke liye, cheers!|The classic toast at a company dinner
a|お疲れ様です、乾杯！|おつかれさまです、かんぱい！|otsukaresama desu, kanpai!|Good work everyone, cheers!|Sabki mehnat ke naam, cheers!
a|乾杯しましょう！|かんぱいしましょう！|kanpai shimashō!|Let’s make a toast!|Chaliye cheers karte hain!
`;
