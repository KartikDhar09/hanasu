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

@dlg:o-greet:0
b=
a|おはようございます。今日もよろしくお願いします。|おはようございます。きょうもよろしくおねがいします。|ohayō gozaimasu. kyō mo yoroshiku onegaishimasu.|Good morning. Let’s have a good day.|Good morning, aaj bhi saath achha kaam karein.
a|おはようございます。早いですね。|おはようございます。はやいですね。|ohayō gozaimasu. hayai desu ne.|Good morning. You’re in early.|Good morning. Aap jaldi aa gaye.
@dlg:o-greet:1
b=
a|おはようございます。今日もよろしくお願いいたします。|おはようございます。きょうもよろしくおねがいいたします。|ohayō gozaimasu. kyō mo yoroshiku onegai itashimasu.|Good morning. I look forward to working with you today.|Good morning, aaj bhi aapke saath kaam karne ka intezaar hai.
a|おはようございます。寒いですね。|おはようございます。さむいですね。|ohayō gozaimasu. samui desu ne.|Good morning. Cold, isn’t it?|Good morning. Thand hai na?
@dlg:o-greet:2
b=
a|お疲れ様です。忙しそうですね。|おつかれさまです。いそがしそうですね。|otsukaresama desu. isogashisō desu ne.|Hi. You look busy.|Hello, aap busy lag rahe hain.
a|お疲れ。|おつかれ。|otsukare.|Hey.|Hi.|To close coworkers only
@dlg:o-greet:3
b=
a|お疲れ様です。午後もよろしくお願いします。|おつかれさまです。ごごもよろしくおねがいします。|otsukaresama desu. gogo mo yoroshiku onegaishimasu.|Hi. Let’s keep it up this afternoon.|Hello, dopahar bhi achha kaam karein.
a|あ、お疲れ様です。|あ、おつかれさまです。|a, otsukaresama desu.|Oh, hi.|Arre, hello.
@dlg:o-greet:4
b|本日はお先に失礼いたします。|ほんじつはおさきにしつれいいたします。|honjitsu wa o-saki ni shitsurei itashimasu.|Excuse me for leaving before you today.|Aaj main pehle nikal raha/rahi hoon, maaf kijiye.
a|お先に失礼します。お疲れ様でした。|おさきにしつれいします。おつかれさまでした。|o-saki ni shitsurei shimasu. otsukaresama deshita.|I’m heading off. Thanks for today.|Main chalta/chalti hoon. Aaj ki mehnat ke liye shukriya.
a|今日はこれで失礼します。|きょうはこれでしつれいします。|kyō wa kore de shitsurei shimasu.|That’s it for me today.|Aaj ke liye itna hi, main chalta/chalti hoon.
@dlg:o-greet:5
b=
a|お疲れ様でした。気をつけて。|おつかれさまでした。きをつけて。|otsukaresama deshita. ki o tsukete.|Good work today. Get home safe.|Achha kaam kiya. Dhyaan se jaana.
a|お疲れ様。また明日。|おつかれさま。またあした。|otsukaresama. mata ashita.|Good work. See you tomorrow.|Shukriya. Kal milte hain.|From a senior to a junior
@dlg:o-intro:0
b|本日から入社された{name}さんです。では、ご挨拶をお願いします。|ほんじつからにゅうしゃされた{name}さんです。では、ごあいさつをおねがいします。|honjitsu kara nyūsha sareta {nameRo}-san desu. dewa, go-aisatsu o onegaishimasu.|This is {nameRo}, who joined the company today. Please say a few words.|Yeh {nameRo} hain, aaj se company join kiya hai. Kuch shabd kahiye.
a|今日から一緒に働く{name}さんです。自己紹介をお願いします。|きょうからいっしょにはたらく{name}さんです。じこしょうかいをおねがいします。|kyō kara issho ni hataraku {nameRo}-san desu. jiko shōkai o onegaishimasu.|This is {nameRo}, who works with us from today. Please introduce yourself.|Yeh {nameRo} hain, aaj se saath kaam karenge. Apna parichay dijiye.
a|新しく入った{name}さんです。|あたらしくはいった{name}さんです。|atarashiku haitta {nameRo}-san desu.|This is {nameRo}, our new member.|Yeh {nameRo} hain, team mein naye hain.
@dlg:o-intro:1
b=
a|今日からこちらでお世話になります、{name}です。|きょうからこちらでおせわになります、{name}です。|kyō kara kochira de osewa ni narimasu, {nameRo} desu.|I’m {nameRo}, and I start here today.|Main {nameRo} hoon, aaj se yahaan kaam shuru kar raha/rahi hoon.
a|{name}と申します。本日から営業部に配属になりました。|{name}ともうします。ほんじつからえいぎょうぶにはいぞくになりました。|{nameRo} to mōshimasu. honjitsu kara eigyō-bu ni haizoku ni narimashita.|My name is {nameRo}. I’ve joined the sales department from today.|Mera naam {nameRo} hai. Aaj se sales department mein hoon.|Swap 営業部 for your department
@dlg:o-intro:2
b|至らない点も多いかと存じますが、ご指導のほどよろしくお願いいたします。|いたらないてんもおおいかとぞんじますが、ごしどうのほどよろしくおねがいいたします。|itaranai ten mo ōi ka to zonjimasu ga, go-shidō no hodo yoroshiku onegai itashimasu.|I’m sure I have much to learn, so I’d be grateful for your guidance.|Mujhme bahut kamiyan hongi, kripya maargdarshan kijiye.
a|まだ慣れないことばかりですが、色々教えていただけると嬉しいです。|まだなれないことばかりですが、いろいろおしえていただけるとうれしいです。|mada narenai koto bakari desu ga, iroiro oshiete itadakeru to ureshii desu.|Everything is still new to me, so I’d be glad if you could teach me.|Abhi sab naya hai, aap sikhayenge toh khushi hogi.
a|わからないことがあったら、質問させてください。|わからないことがあったら、しつもんさせてください。|wakaranai koto ga attara, shitsumon sasete kudasai.|If there’s something I don’t understand, please let me ask.|Kuch samajh na aaye toh poochhne dijiye.
@dlg:o-intro:3
b=
a|早く仕事を覚えられるよう頑張ります。よろしくお願いします。|はやくしごとをおぼえられるようがんばります。よろしくおねがいします。|hayaku shigoto o oboerareru yō ganbarimasu. yoroshiku onegaishimasu.|I’ll work hard to learn the job quickly. Nice to work with you.|Jaldi kaam seekhne ki koshish karunga/karungi.
a|精一杯頑張ります。よろしくお願いします。|せいいっぱいがんばります。よろしくおねがいします。|seiippai ganbarimasu. yoroshiku onegaishimasu.|I’ll give it everything I’ve got.|Poori jaan laga dunga/dungi.
@dlg:o-intro:4
b|どうぞよろしくお願いいたします。|どうぞよろしくおねがいいたします。|dōzo yoroshiku onegai itashimasu.|We look forward to working with you.|Aapke saath kaam karne ka intezaar hai.
a|よろしく！何でも聞いてね。|よろしく！なんでもきいてね。|yoroshiku! nan demo kiite ne.|Welcome! Ask me anything.|Swaagat hai! Kuch bhi poochh lena.
a|こちらこそ、よろしくお願いします。|こちらこそ、よろしくおねがいします。|kochira koso, yoroshiku onegaishimasu.|Likewise, nice to work with you.|Hamari taraf se bhi swaagat.
@dlg:o-ask:0
b|鈴木さん、今少しよろしいでしょうか。|すずきさん、いますこしよろしいでしょうか。|Suzuki-san, ima sukoshi yoroshii deshō ka?|Suzuki-san, do you have a moment now?|Suzuki-san, kya abhi thoda samay hai?
a|鈴木さん、お忙しいところすみません。|すずきさん、おいそがしいところすみません。|Suzuki-san, o-isogashii tokoro sumimasen.|Suzuki-san, sorry to bother you when you’re busy.|Suzuki-san, busy samay mein disturb karne ke liye maaf kijiye.
a|鈴木さん、ちょっと聞いてもいいですか。|すずきさん、ちょっときいてもいいですか。|Suzuki-san, chotto kiite mo ii desu ka?|Suzuki-san, can I ask you something?|Suzuki-san, kuch poochh sakta/sakti hoon?
@dlg:o-ask:1
b|はい、どうされましたか。|はい、どうされましたか。|hai, dō saremashita ka?|Yes, what can I do for you?|Haan, kya hua?
a|うん、いいよ。何？|うん、いいよ。なに？|un, ii yo. nani?|Sure. What is it?|Haan, bolo.|Casual
a|はい、何でしょう？|はい、なんでしょう？|hai, nan deshō?|Yes, what is it?|Haan, kahiye?
@dlg:o-ask:2
b|こちらのやり方を教えていただけますか。|こちらのやりかたをおしえていただけますか。|kochira no yarikata o oshiete itadakemasu ka?|Could you show me how to do this?|Kya aap iska tareeka bata sakte hain?
a|これのやり方がわからないんですが。|これのやりかたがわからないんですが。|kore no yarikata ga wakaranai n desu ga.|I don’t know how to do this.|Mujhe yeh kaise karna hai samajh nahi aa raha.
a|これ、どうすればいいですか。|これ、どうすればいいですか。|kore, dō sureba ii desu ka?|What should I do with this?|Iska kya karna chahiye?
@dlg:o-ask:3
b|こちらをクリックしていただければ大丈夫です。|こちらをクリックしていただければだいじょうぶです。|kochira o kurikku shite itadakereba daijōbu desu.|If you click here, that’s all.|Bas yahaan click kar dijiye.
a|ここを押すだけで大丈夫ですよ。|ここをおすだけでだいじょうぶですよ。|koko o osu dake de daijōbu desu yo.|Just press here and you’re done.|Bas yahaan dabaiye, ho jaayega.
a|ああ、それならここをクリックしてください。|ああ、それならここをクリックしてください。|ā, sore nara koko o kurikku shite kudasai.|Oh, for that, click here.|Achha, uske liye yahaan click kijiye.
@dlg:o-ask:4
b|よくわかりました。お忙しいところありがとうございました。|よくわかりました。おいそがしいところありがとうございました。|yoku wakarimashita. o-isogashii tokoro arigatō gozaimashita.|I understand now. Thank you for your time.|Achhi tarah samajh gaya/gayi. Samay dene ke liye shukriya.
a|そうなんですね。ありがとうございます。|そうなんですね。ありがとうございます。|sō na n desu ne. arigatō gozaimasu.|Oh, I see. Thank you.|Achha, aisa hai. Shukriya.
a|わかりました！ありがとうございます。|わかりました！ありがとうございます。|wakarimashita! arigatō gozaimasu.|Got it! Thanks.|Samajh gaya/gayi! Shukriya.
@dlg:o-task:0
b|{name}さん、こちらのコピーをお願いできますか。|{name}さん、こちらのコピーをおねがいできますか。|{nameRo}-san, kochira no kopī o onegai dekimasu ka?|{nameRo}, could you make a copy of this?|{nameRo}-san, iski copy kar denge?
a|{name}さん、これコピーしてもらえる？|{name}さん、これコピーしてもらえる？|{nameRo}-san, kore kopī shite moraeru?|{nameRo}, could you copy this?|{nameRo}, iski copy kar doge?
a|{name}さん、これ十部コピーしてくれる？|{name}さん、これじゅうぶコピーしてくれる？|{nameRo}-san, kore jū-bu kopī shite kureru?|{nameRo}, can you make ten copies of this?|{nameRo}, iski das copy kar doge?
@dlg:o-task:1
b|かしこまりました。いつまでにお持ちすればよろしいですか。|かしこまりました。いつまでにおもちすればよろしいですか。|kashikomarimashita. itsu made ni o-mochi sureba yoroshii desu ka?|Certainly. By when shall I bring it?|Ji bilkul. Kab tak le aaun?
a|はい、わかりました。締め切りはいつですか。|はい、わかりました。しめきりはいつですか。|hai, wakarimashita. shimekiri wa itsu desu ka?|Sure. When’s the deadline?|Haan. Deadline kab hai?
a|はい。何部必要ですか。|はい。なんぶひつようですか。|hai. nan-bu hitsuyō desu ka?|Sure. How many copies do you need?|Haan. Kitni copies chahiye?
@dlg:o-task:2
b|三時までにお願いします。|さんじまでにおねがいします。|san-ji made ni onegaishimasu.|By three o’clock, please.|Teen baje tak kar dijiye.
a|三時の会議で使うから、それまでに。|さんじのかいぎでつかうから、それまでに。|san-ji no kaigi de tsukau kara, sore made ni.|I need it for the three o’clock meeting, so before then.|Teen baje ki meeting mein chahiye, usse pehle.
a|急ぎじゃないけど、三時までだと助かる。|いそぎじゃないけど、さんじまでだとたすかる。|isogi ja nai kedo, san-ji made da to tasukaru.|No rush, but by three would help.|Jaldi nahi hai, par teen baje tak ho jaaye toh achha.
@dlg:o-task:3
b|承知しました。すぐに取りかかります。|しょうちしました。すぐにとりかかります。|shōchi shimashita. sugu ni torikakarimasu.|Understood. I’ll get on it right away.|Samajh gaya/gayi. Abhi shuru karta/karti hoon.
a|はい、今からやります。|はい、いまからやります。|hai, ima kara yarimasu.|OK, I’ll do it now.|Haan, abhi karta/karti hoon.
a|わかりました。三時までにお持ちします。|わかりました。さんじまでにおもちします。|wakarimashita. san-ji made ni o-mochi shimasu.|Got it. I’ll bring it by three.|Theek hai. Teen baje tak le aaunga/aaungi.
@dlg:o-task:4
b|終わりました。ご確認をお願いいたします。|おわりました。ごかくにんをおねがいいたします。|owarimashita. go-kakunin o onegai itashimasu.|It’s done. Please check it.|Ho gaya. Kripya check kar lijiye.
a|コピー、できました。こちらです。|コピー、できました。こちらです。|kopī, dekimashita. kochira desu.|The copies are ready. Here they are.|Copies taiyaar hain. Yeh rahi.
a|お待たせしました。確認していただけますか。|おまたせしました。かくにんしていただけますか。|o-matase shimashita. kakunin shite itadakemasu ka?|Sorry to keep you waiting. Could you check it?|Intezaar ke liye maaf. Check kar lenge?
@dlg:o-task:5
b|ありがとうございます。助かりました。|ありがとうございます。たすかりました。|arigatō gozaimasu. tasukarimashita.|Thank you. That was a great help.|Shukriya. Badi madad hui.
a|早いね、ありがとう。|はやいね、ありがとう。|hayai ne, arigatō.|That was quick, thanks.|Jaldi kar diya, shukriya.
a|ばっちり。ありがとう。|ばっちり。ありがとう。|batchiri. arigatō.|Perfect. Thanks.|Ekdum sahi. Shukriya.
@dlg:o-sorry:0
b|おはようございます。{name}でございます。|おはようございます。{name}でございます。|ohayō gozaimasu. {nameRo} de gozaimasu.|Good morning, this is {nameRo}.|Good morning, main {nameRo} bol raha/rahi hoon.
a|おはようございます。{name}ですが、今よろしいですか。|おはようございます。{name}ですが、いまよろしいですか。|ohayō gozaimasu. {nameRo} desu ga, ima yoroshii desu ka?|Good morning, it’s {nameRo}. Is now a good time?|Good morning, {nameRo} bol raha/rahi hoon. Abhi baat ho sakti hai?
a|朝早くにすみません。{name}です。|あさはやくにすみません。{name}です。|asa hayaku ni sumimasen. {nameRo} desu.|Sorry to call so early. It’s {nameRo}.|Subah subah call ke liye maaf. {nameRo} hoon.
@dlg:o-sorry:1
b|おはようございます。どうされましたか。|おはようございます。どうされましたか。|ohayō gozaimasu. dō saremashita ka?|Good morning. What’s happened?|Good morning. Kya hua?
a|おはよう。何かあった？|おはよう。なにかあった？|ohayō. nani ka atta?|Morning. Something up?|Good morning. Kuch hua?
a|あ、{name}さん。どうしました？|あ、{name}さん。どうしました？|a, {nameRo}-san. dō shimashita?|Oh, {nameRo}. What’s wrong?|Arre {nameRo}. Kya hua?
@dlg:o-sorry:2
b|大変申し訳ございません。電車が遅延しておりまして、十分ほど遅れてしまいそうです。|たいへんもうしわけございません。でんしゃがちえんしておりまして、じゅっぷんほどおくれてしまいそうです。|taihen mōshiwake gozaimasen. densha ga chien shite orimashite, juppun hodo okurete shimaisō desu.|I’m very sorry. The train is delayed, so I expect to be about ten minutes late.|Bahut maafi chahta/chahti hoon. Train late hai, das minute der ho jaayegi.
a|すみません、電車の遅延で十分ほど遅刻します。|すみません、でんしゃのちえんでじゅっぷんほどちこくします。|sumimasen, densha no chien de juppun hodo chikoku shimasu.|Sorry, I’ll be about ten minutes late because the train is delayed.|Maaf kijiye, train late hai, das minute der se aaunga/aaungi.
a|事故で電車が止まっていて、少し遅れます。|じこででんしゃがとまっていて、すこしおくれます。|jiko de densha ga tomatte ite, sukoshi okuremasu.|The train has stopped after an accident, so I’ll be a little late.|Accident ki wajah se train ruki hai, thodi der hogi.
@dlg:o-sorry:3
b|承知しました。お気をつけてお越しください。|しょうちしました。おきをつけておこしください。|shōchi shimashita. o-ki o tsukete o-koshi kudasai.|Understood. Please come safely.|Theek hai. Dhyaan se aaiye.
a|了解。焦らなくていいよ。|りょうかい。あせらなくていいよ。|ryōkai. aseranakute ii yo.|OK. No need to rush.|Theek hai. Jaldi mat karna.
a|わかりました。着いたら教えてください。|わかりました。ついたらおしえてください。|wakarimashita. tsuitara oshiete kudasai.|Understood. Let me know when you arrive.|Theek hai. Pahunch kar bata dena.
@dlg:o-sorry:4
b|ありがとうございます。では、失礼いたします。|ありがとうございます。では、しつれいいたします。|arigatō gozaimasu. dewa, shitsurei itashimasu.|Thank you. Goodbye.|Shukriya. Achha, rakhta/rakhti hoon.
a|すみません、急いで向かいます。|すみません、いそいでむかいます。|sumimasen, isoide mukaimasu.|Sorry, I’m on my way as fast as I can.|Maaf kijiye, jaldi aa raha/rahi hoon.
a|ありがとうございます。着いたらすぐ連絡します。|ありがとうございます。ついたらすぐれんらくします。|arigatō gozaimasu. tsuitara sugu renraku shimasu.|Thank you. I’ll get in touch as soon as I arrive.|Shukriya. Pahunchte hi bataunga/bataungi.
@dlg:o-phone:0
b=
a|お電話ありがとうございます。さくら商事でございます。|おでんわありがとうございます。さくらしょうじでございます。|o-denwa arigatō gozaimasu. Sakura Shōji de gozaimasu.|Thank you for calling Sakura Trading.|Call karne ke liye shukriya, Sakura Trading.
a|さくら商事、営業部の{name}でございます。|さくらしょうじ、えいぎょうぶの{name}でございます。|Sakura Shōji, eigyō-bu no {nameRo} de gozaimasu.|Sakura Trading, sales department, {nameRo} speaking.|Sakura Trading, sales department se {nameRo}.
@dlg:o-phone:1
b|みどり銀行の山本と申します。|みどりぎんこうのやまもとともうします。|Midori Ginkō no Yamamoto to mōshimasu.|My name is Yamamoto, from Midori Bank.|Main Midori Bank se Yamamoto bol raha hoon.
a|いつもお世話になっております。みどり銀行の山本です。|いつもおせわになっております。みどりぎんこうのやまもとです。|itsumo osewa ni natte orimasu. Midori Ginkō no Yamamoto desu.|Thank you for your support. This is Yamamoto from Midori Bank.|Aapke sahyog ke liye shukriya. Midori Bank se Yamamoto.
a|みどり銀行の山本ですが。|みどりぎんこうのやまもとですが。|Midori Ginkō no Yamamoto desu ga.|This is Yamamoto from Midori Bank…|Midori Bank se Yamamoto…
@dlg:o-phone:2
b=
a|山本様、いつもお世話になっております。|やまもとさま、いつもおせわになっております。|Yamamoto-sama, itsumo osewa ni natte orimasu.|Yamamoto-sama, thank you for your continued support.|Yamamoto-ji, aapke sahyog ke liye shukriya.
a|お世話になっております。|おせわになっております。|osewa ni natte orimasu.|Thank you for your support.|Aapke sahyog ke liye shukriya.
@dlg:o-phone:3
b|恐れ入りますが、田中様はいらっしゃいますでしょうか。|おそれいりますが、たなかさまはいらっしゃいますでしょうか。|osore irimasu ga, Tanaka-sama wa irasshaimasu deshō ka?|Excuse me, would Tanaka-sama be available?|Maaf kijiye, kya Tanaka-ji hain?
a|田中さんをお願いできますか。|たなかさんをおねがいできますか。|Tanaka-san o onegai dekimasu ka?|Could I speak to Tanaka-san?|Tanaka-san se baat ho sakti hai?
a|田中さんにお繋ぎいただけますか。|たなかさんにおつなぎいただけますか。|Tanaka-san ni o-tsunagi itadakemasu ka?|Could you put me through to Tanaka-san?|Tanaka-san se connect kar denge?
@dlg:o-phone:4
b=
a|あいにく田中はただいま外出しております。|あいにくたなかはただいまがいしゅつしております。|ainiku Tanaka wa tadaima gaishutsu shite orimasu.|Unfortunately Tanaka is out of the office at the moment.|Afsos, Tanaka abhi bahar gaye hain.
a|申し訳ございません。田中は会議中でございます。|もうしわけございません。たなかはかいぎちゅうでございます。|mōshiwake gozaimasen. Tanaka wa kaigi-chū de gozaimasu.|I’m sorry, Tanaka is in a meeting.|Maaf kijiye, Tanaka meeting mein hain.
@dlg:o-phone:5
b|戻りましたら、こちらから折り返しお電話いたします。|もどりましたら、こちらからおりかえしおでんわいたします。|modorimashitara, kochira kara orikaeshi o-denwa itashimasu.|When they’re back, we’ll call you back.|Unke lautne par hum aapko call karenge.
a|戻り次第、お電話するよう伝えます。|もどりしだい、おでんわするようつたえます。|modori shidai, o-denwa suru yō tsutaemasu.|I’ll tell them to call you as soon as they return.|Lautte hi call karne ko keh dunga/dungi.
a|よろしければ、ご伝言を承りますが。|よろしければ、ごでんごんをうけたまわりますが。|yoroshikereba, go-dengon o uketamawarimasu ga.|If you like, I can take a message.|Chahein toh main sandesh le leta/leti hoon.
@dlg:o-phone:6
b|では、よろしくお願いいたします。|では、よろしくおねがいいたします。|dewa, yoroshiku onegai itashimasu.|Then, thank you very much.|Toh, kripya aisa kijiye.
a|はい、お待ちしております。|はい、おまちしております。|hai, o-machi shite orimasu.|Yes, I’ll be waiting.|Haan, intezaar karunga.
a|では、伝言をお願いできますか。|では、でんごんをおねがいできますか。|dewa, dengon o onegai dekimasu ka?|Then could you take a message?|Toh kya sandesh de denge?
@dlg:o-phone:7
b=
a|お電話ありがとうございました。失礼いたします。|おでんわありがとうございました。しつれいいたします。|o-denwa arigatō gozaimashita. shitsurei itashimasu.|Thank you for calling. Goodbye.|Call ke liye shukriya. Namaste.
a|確かに申し伝えます。失礼いたします。|たしかにもうしつたえます。しつれいいたします。|tashika ni mōshitsutaemasu. shitsurei itashimasu.|I will be sure to pass it on. Goodbye.|Zaroor bata dunga/dungi. Namaste.
@dlg:o-meet:0
b|それでは、始めさせていただきます。|それでは、はじめさせていただきます。|sore dewa, hajimesasete itadakimasu.|Well then, let us begin.|Toh chaliye, shuru karte hain.
a|時間になりましたので、始めましょう。|じかんになりましたので、はじめましょう。|jikan ni narimashita node, hajimemashō.|It’s time, so let’s start.|Samay ho gaya, shuru karte hain.
a|皆さん揃いましたね。始めましょう。|みなさんそろいましたね。はじめましょう。|minasan soroimashita ne. hajimemashō.|Everyone’s here. Let’s begin.|Sab aa gaye. Shuru karein.
@dlg:o-meet:1
b|画面を共有いたします。ご覧いただけますでしょうか。|がめんをきょうゆういたします。ごらんいただけますでしょうか。|gamen o kyōyū itashimasu. goran itadakemasu deshō ka?|I’ll share my screen. Can you see it?|Main screen share kar raha/rahi hoon. Dikh rahi hai?
a|今から画面を共有します。見えますか。|いまからがめんをきょうゆうします。みえますか。|ima kara gamen o kyōyū shimasu. miemasu ka?|I’m sharing my screen now. Can you see it?|Abhi screen share kar raha/rahi hoon. Dikh rahi hai?
a|資料を映しますね。大丈夫ですか。|しりょうをうつしますね。だいじょうぶですか。|shiryō o utsushimasu ne. daijōbu desu ka?|I’ll put the slides up. Is it OK?|Slides dikhata/dikhati hoon. Theek hai?
@dlg:o-meet:2
b|はい、問題なく見えております。|はい、もんだいなくみえております。|hai, mondai naku miete orimasu.|Yes, we can see it fine.|Haan, saaf dikh rahi hai.
a|はい、大丈夫です。|はい、だいじょうぶです。|hai, daijōbu desu.|Yes, it’s fine.|Haan, theek hai.
a|はい、はっきり見えます。|はい、はっきりみえます。|hai, hakkiri miemasu.|Yes, I can see it clearly.|Haan, saaf dikh raha hai.
@dlg:o-meet:3
b|今週の進捗についてご報告いたします。|こんしゅうのしんちょくについてごほうこくいたします。|konshū no shinchoku ni tsuite go-hōkoku itashimasu.|I’ll report on this week’s progress.|Is hafte ki progress ke baare mein bataata/bataati hoon.
a|では、今週の進み具合です。|では、こんしゅうのすすみぐあいです。|dewa, konshū no susumi-guai desu.|So, here’s how things went this week.|Toh, is hafte kaam kitna aage badha.
a|今週やったことをお話しします。|こんしゅうやったことをおはなしします。|konshū yatta koto o o-hanashi shimasu.|I’ll talk about what I did this week.|Is hafte kya kiya, woh bataata/bataati hoon.
@dlg:o-meet:4
b|以上でございます。ご質問はございますか。|いじょうでございます。ごしつもんはございますか。|ijō de gozaimasu. go-shitsumon wa gozaimasu ka?|That is all. Are there any questions?|Bas itna hi. Koi sawaal?
a|私からは以上です。|わたしからはいじょうです。|watashi kara wa ijō desu.|That’s all from me.|Meri taraf se itna hi.
a|以上になります。ありがとうございました。|いじょうになります。ありがとうございました。|ijō ni narimasu. arigatō gozaimashita.|That concludes it. Thank you.|Bas itna hi. Shukriya.
@dlg:o-meet:5
b|ご報告ありがとうございます。この方向で進めてください。|ごほうこくありがとうございます。このほうこうですすめてください。|go-hōkoku arigatō gozaimasu. kono hōkō de susumete kudasai.|Thank you for the report. Please continue in this direction.|Report ke liye shukriya. Isi tarah aage badhiye.
a|ありがとうございます。順調ですね。|ありがとうございます。じゅんちょうですね。|arigatō gozaimasu. junchō desu ne.|Thanks. It’s going well.|Shukriya. Sab theek chal raha hai.
a|わかりやすかったです。ありがとうございます。|わかりやすかったです。ありがとうございます。|wakariyasukatta desu. arigatō gozaimasu.|That was clear. Thank you.|Samajhne mein aasaan tha. Shukriya.
@dlg:o-life:0
b|週末はいかがでしたか。|しゅうまつはいかがでしたか。|shūmatsu wa ikaga deshita ka?|How was your weekend?|Weekend kaisa raha?
a|週末、何かしましたか。|しゅうまつ、なにかしましたか。|shūmatsu, nani ka shimashita ka?|Did you do anything at the weekend?|Weekend pe kuch kiya?
a|週末どうだった？|しゅうまつどうだった？|shūmatsu dō datta?|How was the weekend?|Weekend kaisa tha?|Casual
@dlg:o-life:1
b|おかげさまで楽しく過ごせました。浜松に行ってまいりました。|おかげさまでたのしくすごせました。はままつにいってまいりました。|okagesama de tanoshiku sugosemashita. Hamamatsu ni itte mairimashita.|I had a lovely time, thank you. I went to Hamamatsu.|Bahut achha guzra. Hamamatsu gaya/gayi tha/thi.
a|浜松に行ってきました。うなぎを食べました。|はままつにいってきました。うなぎをたべました。|Hamamatsu ni itte kimashita. unagi o tabemashita.|I went to Hamamatsu. I had eel.|Hamamatsu gaya/gayi tha/thi. Eel khaayi.
a|浜松まで行って、のんびりしました。|はままつまでいって、のんびりしました。|Hamamatsu made itte, nonbiri shimashita.|I went to Hamamatsu and relaxed.|Hamamatsu jaakar aaram kiya.
@dlg:o-life:2
b|それは良かったですね。|それはよかったですね。|sore wa yokatta desu ne.|That’s lovely.|Yeh toh achhi baat hai.
a|浜松、いいところですよね。|はままつ、いいところですよね。|Hamamatsu, ii tokoro desu yo ne.|Hamamatsu is a nice place, isn’t it?|Hamamatsu achhi jagah hai na.
a|いいなあ。|いいなあ。|ii nā.|Lucky you.|Wah, mazaa aaya hoga.
@dlg:o-life:3
b|よろしければ、お昼をご一緒しませんか。|よろしければ、おひるをごいっしょしませんか。|yoroshikereba, o-hiru o go-issho shimasen ka?|If you’re free, would you like to have lunch together?|Agar aap free hain, toh saath lunch karein?
a|一緒にお昼食べませんか。|いっしょにおひるたべませんか。|issho ni o-hiru tabemasen ka?|Shall we have lunch together?|Saath lunch karein?
a|ランチ、行かない？|ランチ、いかない？|ranchi, ikanai?|Lunch?|Lunch chalein?|Casual
@dlg:o-life:4
b|ぜひご一緒させてください。|ぜひごいっしょさせてください。|zehi go-issho sasete kudasai.|I’d be glad to join you.|Zaroor, saath chalunga/chalungi.
a|いいですね。どこに行きます？|いいですね。どこにいきます？|ii desu ne. doko ni ikimasu?|Sounds good. Where shall we go?|Achha hai. Kahaan chalein?
a|行きましょう！お腹すきました。|いきましょう！おなかすきました。|ikimashō! onaka sukimashita.|Let’s go! I’m hungry.|Chalo! Bhookh lagi hai.
`;
