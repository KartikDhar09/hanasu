// More ways to say each example answer in Speak → Answer questions (ids qa:<question>:<answer>). Format: see js/ways.js.
export const WAYS_QA = `
@qa:0:0
b|{name}と申します。|{name}ともうします。|{nameRo} to mōshimasu.|My name is {nameRo}.|Mera naam {nameRo} hai.
a|{name}といいます。|{name}といいます。|{nameRo} to iimasu.|I’m called {nameRo}.|Mujhe {nameRo} kehte hain.
a|{name}です。よろしくお願いします。|{name}です。よろしくおねがいします。|{nameRo} desu. yoroshiku onegaishimasu.|I’m {nameRo}. Nice to meet you.|Main {nameRo} hoon. Aapse milkar khushi hui.
@qa:0:1
b=
a|{name}と申します。どうぞよろしくお願いいたします。|{name}ともうします。どうぞよろしくおねがいいたします。|{nameRo} to mōshimasu. dōzo yoroshiku onegai itashimasu.|My name is {nameRo}. I look forward to working with you.|Mera naam {nameRo} hai. Aapse milkar khushi hui.
a|{name}と申します。{name}と呼んでください。|{name}ともうします。{name}とよんでください。|{nameRo} to mōshimasu. {nameRo} to yonde kudasai.|My name is {nameRo}. Please call me {nameRo}.|Mera naam {nameRo} hai. Mujhe {nameRo} bulaiye.
@qa:1:0
b|{country}から参りました。|{countryKana}からまいりました。|{countryRo} kara mairimashita.|I come from {countryEn}.|Main {countryHi} se aaya/aayi hoon.
a|{country}出身です。|{countryKana}しゅっしんです。|{countryRo} shusshin desu.|I’m from {countryEn}.|Main {countryHi} ka/ki hoon.
a|{country}から日本に来ました。|{countryKana}からにほんにきました。|{countryRo} kara nihon ni kimashita.|I came to Japan from {countryEn}.|{countryHi} se Japan aaya/aayi hoon.
@qa:1:1
b|{country}の出身でございます。|{countryKana}のしゅっしんでございます。|{countryRo} no shusshin de gozaimasu.|I am from {countryEn}.|Main {countryHi} se hoon.
a|生まれも育ちも{country}です。|うまれもそだちも{countryKana}です。|umare mo sodachi mo {countryRo} desu.|I was born and raised in {countryEn}.|{countryHi} mein paida hua/hui aur pala-badha/pali-badhi.
a|国は{country}です。|くには{countryKana}です。|kuni wa {countryRo} desu.|My country is {countryEn}.|Mera desh {countryHi} hai.
@qa:2:0
b|三年になります。|さんねんになります。|sannen ni narimasu.|It has been three years.|Teen saal ho gaye.
a|来て三年です。|きてさんねんです。|kite sannen desu.|It’s been three years since I came.|Aaye hue teen saal ho gaye.
a|三年ぐらい住んでいます。|さんねんぐらいすんでいます。|sannen gurai sunde imasu.|I’ve lived here about three years.|Lagbhag teen saal se reh raha/rahi hoon.
@qa:2:1
b|間もなく一年になります。|まもなくいちねんになります。|mamonaku ichinen ni narimasu.|It will soon be one year.|Jald hi ek saal hone wala hai.
a|一年ちょっと前に来ました。|いちねんちょっとまえにきました。|ichinen chotto mae ni kimashita.|I came a little over a year ago.|Ek saal se thoda pehle aaya/aayi.
a|まだ一年たっていません。|まだいちねんたっていません。|mada ichinen tatte imasen.|It hasn’t been a year yet.|Abhi ek saal nahi hua.
@qa:3:0
b|エンジニアとして働いております。|エンジニアとしてはたらいております。|enjinia to shite hataraite orimasu.|I work as an engineer.|Main engineer ke roop mein kaam karta/karti hoon.
a|IT企業でエンジニアをしています。|アイティーきぎょうでエンジニアをしています。|aitī kigyō de enjinia o shite imasu.|I’m an engineer at an IT company.|IT company mein engineer hoon.
a|システムエンジニアです。|システムエンジニアです。|shisutemu enjinia desu.|I’m a systems engineer.|Main systems engineer hoon.
@qa:3:1
b|製造業の工場に勤めております。|せいぞうぎょうのこうじょうにつとめております。|seizōgyō no kōjō ni tsutomete orimasu.|I work at a manufacturing plant.|Main ek manufacturing factory mein kaam karta/karti hoon.
a|工場で製品を作っています。|こうじょうでせいひんをつくっています。|kōjō de seihin o tsukutte imasu.|I make products at a factory.|Factory mein products banata/banati hoon.
a|工場勤務です。|こうじょうきんむです。|kōjō kinmu desu.|I work in a factory.|Factory mein naukri hai.
@qa:4:0
b|料理が趣味でございます。|りょうりがしゅみでございます。|ryōri ga shumi de gozaimasu.|Cooking is my hobby.|Khaana banana mera shauk hai.
a|料理をするのが好きです。|りょうりをするのがすきです。|ryōri o suru no ga suki desu.|I like cooking.|Mujhe khaana banana pasand hai.
a|休みの日は、よく料理をします。|やすみのひは、よくりょうりをします。|yasumi no hi wa, yoku ryōri o shimasu.|I often cook on my days off.|Chhutti ke din aksar khaana banata/banati hoon.
@qa:4:1
b|クリケット観戦が趣味です。|クリケットかんせんがしゅみです。|kuriketto kansen ga shumi desu.|My hobby is watching cricket.|Cricket dekhna mera shauk hai.
a|クリケットをするのも見るのも好きです。|クリケットをするのもみるのもすきです。|kuriketto o suru no mo miru no mo suki desu.|I like both playing and watching cricket.|Cricket khelna aur dekhna dono pasand hai.
a|クリケットが大好きです。|クリケットがだいすきです。|kuriketto ga daisuki desu.|I love cricket.|Mujhe cricket bahut pasand hai.
@qa:5:0
b|買い物に出かけておりました。|かいものにでかけておりました。|kaimono ni dekakete orimashita.|I went out shopping.|Shopping karne gaya/gayi tha/thi.
a|友達と買い物をしました。|ともだちとかいものをしました。|tomodachi to kaimono o shimashita.|I went shopping with a friend.|Dost ke saath shopping ki.
a|デパートに行きました。|デパートにいきました。|depāto ni ikimashita.|I went to a department store.|Department store gaya/gayi.
@qa:5:1
b|自宅でゆっくり過ごしました。|じたくでゆっくりすごしました。|jitaku de yukkuri sugoshimashita.|I spent a relaxing time at home.|Ghar par aaraam se samay bitaaya.
a|家でのんびりしました。|いえでのんびりしました。|ie de nonbiri shimashita.|I took it easy at home.|Ghar pe aaraam kiya.
a|特に何もしないで、休みました。|とくになにもしないで、やすみました。|toku ni nani mo shinaide, yasumimashita.|I didn’t do anything special; I rested.|Kuch khaas nahi kiya, aaraam kiya.
@qa:6:0
b|ラーメンが特に好きです。|ラーメンがとくにすきです。|rāmen ga toku ni suki desu.|I especially like ramen.|Mujhe khaas taur par ramen pasand hai.
a|ラーメンが一番好きです。|ラーメンがいちばんすきです。|rāmen ga ichiban suki desu.|Ramen is my favourite.|Ramen sabse zyaada pasand hai.
a|ラーメンをよく食べます。|ラーメンをよくたべます。|rāmen o yoku tabemasu.|I often eat ramen.|Main aksar ramen khaata/khaati hoon.
@qa:6:1
b|カレーライスをよくいただきます。|カレーライスをよくいただきます。|karē raisu o yoku itadakimasu.|I often have curry rice.|Main aksar curry rice khaata/khaati hoon.
a|日本のカレーが好きです。|にほんのカレーがすきです。|nihon no karē ga suki desu.|I like Japanese curry.|Japanese curry pasand hai.
a|カレーライスがおいしいと思います。|カレーライスがおいしいとおもいます。|karē raisu ga oishii to omoimasu.|I think curry rice is tasty.|Curry rice swaadisht lagta hai.
@qa:7:0
b|はい、辛い物は好物です。|はい、からいものはこうぶつです。|hai, karai mono wa kōbutsu desu.|Yes, spicy food is a favourite of mine.|Haan, teekha khaana mujhe bahut pasand hai.
a|はい、辛いのは得意です。|はい、からいのはとくいです。|hai, karai no wa tokui desu.|Yes, I handle spicy food well.|Haan, teekha aaram se kha leta/leti hoon.
a|全然大丈夫です！|ぜんぜんだいじょうぶです！|zenzen daijōbu desu!|No problem at all!|Bilkul koi dikkat nahi!
@qa:7:1
b|申し訳ないのですが、辛い物は少し苦手です。|もうしわけないのですが、からいものはすこしにがてです。|mōshiwake nai no desu ga, karai mono wa sukoshi nigate desu.|I’m sorry, but I’m not very good with spicy food.|Maaf kijiye, teekha thoda kam chalta hai.
a|辛すぎるのはちょっと…。|からすぎるのはちょっと…。|karasugiru no wa chotto…|Too spicy is a bit…|Zyaada teekha thoda mushkil hai…
a|少しなら大丈夫です。|すこしならだいじょうぶです。|sukoshi nara daijōbu desu.|A little is fine.|Thoda chal jaata hai.
@qa:8:0
b|はい、まだまだ勉強中です。|はい、まだまだべんきょうちゅうです。|hai, madamada benkyō-chū desu.|Yes, I’m still learning.|Haan, abhi seekh raha/rahi hoon.
a|難しいですが、楽しいです。|むずかしいですが、たのしいです。|muzukashii desu ga, tanoshii desu.|It’s hard, but fun.|Mushkil hai, par mazaa aata hai.
a|はい、でも頑張っています。|はい、でもがんばっています。|hai, demo ganbatte imasu.|Yes, but I’m working hard at it.|Haan, par mehnat kar raha/rahi hoon.
@qa:8:1
b|漢字を覚えるのに苦労しております。|かんじをおぼえるのにくろうしております。|kanji o oboeru no ni kurō shite orimasu.|I’m struggling to memorise kanji.|Kanji yaad karne mein mehnat lag rahi hai.
a|漢字がなかなか覚えられません。|かんじがなかなかおぼえられません。|kanji ga nakanaka oboeraremasen.|I can’t easily remember kanji.|Kanji yaad hi nahi hote.
a|話すのはいいですけど、漢字が大変です。|はなすのはいいですけど、かんじがたいへんです。|hanasu no wa ii desu kedo, kanji ga taihen desu.|Speaking is OK, but kanji is tough.|Bolna theek hai, par kanji mushkil hain.
@qa:9:0
b|電車で参りました。|でんしゃでまいりました。|densha de mairimashita.|I came by train.|Main train se aaya/aayi.
a|電車とバスで来ました。|でんしゃとバスできました。|densha to basu de kimashita.|By train and bus.|Train aur bus se aaya/aayi.
a|駅から歩いて来ました。|えきからあるいてきました。|eki kara aruite kimashita.|I walked from the station.|Station se paidal aaya/aayi.
@qa:9:1
b|自転車で参りました。|じてんしゃでまいりました。|jitensha de mairimashita.|I came by bicycle.|Main cycle se aaya/aayi.
a|自転車で十分ぐらいです。|じてんしゃでじゅっぷんぐらいです。|jitensha de juppun gurai desu.|About ten minutes by bike.|Cycle se lagbhag das minute.
a|天気がよかったので、自転車にしました。|てんきがよかったので、じてんしゃにしました。|tenki ga yokatta node, jitensha ni shimashita.|The weather was nice, so I came by bike.|Mausam achha tha, isliye cycle se aaya/aayi.
@qa:10:0
b|四人家族です。|よにんかぞくです。|yonin kazoku desu.|We are a family of four.|Hamara chaar logon ka parivaar hai.
a|私を入れて四人です。|わたしをいれてよにんです。|watashi o irete yonin desu.|Four, including me.|Mujhe milaakar chaar.
a|四人です。父と母と姉と私です。|よにんです。ちちとははとあねとわたしです。|yonin desu. chichi to haha to ane to watashi desu.|Four: my father, mother, older sister and me.|Chaar: papa, mummy, didi aur main.
@qa:10:1
b|両親と兄がおります。|りょうしんとあにがおります。|ryōshin to ani ga orimasu.|I have my parents and an older brother.|Mere mata-pita aur bade bhaiya hain.
a|父と母と兄がいます。|ちちとははとあにがいます。|chichi to haha to ani ga imasu.|I have a father, mother and older brother.|Papa, mummy aur bhaiya hain.
a|両親と兄の四人家族です。|りょうしんとあにのよにんかぞくです。|ryōshin to ani no yonin kazoku desu.|We’re four: my parents, my brother and me.|Mata-pita, bhaiya aur main, chaar log.
@qa:11:0
b|はい、先ほどいただきました。|はい、さきほどいただきました。|hai, sakihodo itadakimashita.|Yes, I had it a little while ago.|Haan, abhi thodi der pehle kha liya.
a|はい、さっき食べました。|はい、さっきたべました。|hai, sakki tabemashita.|Yes, I ate just now.|Haan, abhi khaaya.
a|はい、お弁当を食べました。|はい、おべんとうをたべました。|hai, o-bentō o tabemashita.|Yes, I had my packed lunch.|Haan, tiffin kha liya.
@qa:11:1
b|いえ、まだいただいておりません。|いえ、まだいただいておりません。|ie, mada itadaite orimasen.|No, I haven’t eaten yet.|Nahi, abhi tak nahi khaaya.
a|まだなんです。これから食べます。|まだなんです。これからたべます。|mada na n desu. kore kara tabemasu.|Not yet. I’m about to eat.|Abhi nahi. Ab khaane wala/wali hoon.
a|いいえ、まだ食べていません。|いいえ、まだたべていません。|iie, mada tabete imasen.|No, I haven’t eaten yet.|Nahi, abhi tak nahi khaaya.
@qa:12:0
b|九時に伺います。|くじにうかがいます。|ku-ji ni ukagaimasu.|I’ll come at nine.|Main nau baje aaunga/aaungi.
a|九時までに来ます。|くじまでにきます。|ku-ji made ni kimasu.|I’ll be here by nine.|Nau baje tak aa jaaunga/jaaungi.
a|明日も九時です。|あしたもくじです。|ashita mo ku-ji desu.|Nine again tomorrow.|Kal bhi nau baje.
@qa:12:1
b|八時半頃に参ります。|はちじはんごろにまいります。|hachi-ji han goro ni mairimasu.|I’ll come at around half past eight.|Saadhe aath baje ke aas-paas aaunga/aaungi.
a|八時半には着くと思います。|はちじはんにはつくとおもいます。|hachi-ji han ni wa tsuku to omoimasu.|I think I’ll arrive by 8:30.|Saadhe aath tak pahunch jaaunga/jaaungi.
a|少し早めに、八時半ぐらいに来ます。|すこしはやめに、はちじはんぐらいにきます。|sukoshi hayame ni, hachi-ji han gurai ni kimasu.|A bit early, around 8:30.|Thoda jaldi, saadhe aath ke aas-paas.
@qa:13:0
b|はい、承知しました。お任せください。|はい、しょうちしました。おまかせください。|hai, shōchi shimashita. o-makase kudasai.|Yes, understood. Leave it to me.|Haan, theek hai. Mujh par chhod dijiye.
a|はい、やってみます。|はい、やってみます。|hai, yatte mimasu.|Yes, I’ll give it a try.|Haan, karke dekhta/dekhti hoon.
a|はい、大丈夫です。|はい、だいじょうぶです。|hai, daijōbu desu.|Yes, no problem.|Haan, ho jaayega.
@qa:13:1
b|申し訳ございません、少々難しいかと存じます。|もうしわけございません、しょうしょうむずかしいかとぞんじます。|mōshiwake gozaimasen, shōshō muzukashii ka to zonjimasu.|I’m very sorry, but I think that would be difficult.|Maaf kijiye, yeh thoda mushkil lagta hai.
a|すみません、一人では難しいです。手伝ってもらえますか。|すみません、ひとりではむずかしいです。てつだってもらえますか。|sumimasen, hitori de wa muzukashii desu. tetsudatte moraemasu ka?|Sorry, it’s hard alone. Could you help me?|Maaf kijiye, akele mushkil hai. Madad karenge?
a|すみません、やったことがないので、教えていただけますか。|すみません、やったことがないので、おしえていただけますか。|sumimasen, yatta koto ga nai node, oshiete itadakemasu ka?|Sorry, I’ve never done it. Could you show me?|Maaf kijiye, maine kabhi nahi kiya, sikha denge?
@qa:14:0
b|はい、おかげさまで忙しくしております。|はい、おかげさまでいそがしくしております。|hai, okagesama de isogashiku shite orimasu.|Yes, I’m kept busy, thankfully.|Haan, kaafi busy hoon.
a|はい、最近は残業が多いです。|はい、さいきんはざんぎょうがおおいです。|hai, saikin wa zangyō ga ōi desu.|Yes, lots of overtime lately.|Haan, aajkal overtime zyaada hai.
a|ええ、まあまあ忙しいです。|ええ、まあまあいそがしいです。|ē, māmā isogashii desu.|Yeah, fairly busy.|Haan, theek-thaak busy.
@qa:14:1
b|いえ、今は落ち着いております。|いえ、いまはおちついております。|ie, ima wa ochitsuite orimasu.|No, things are calm at the moment.|Nahi, abhi sab shaant hai.
a|いいえ、最近は落ち着いています。|いいえ、さいきんはおちついています。|iie, saikin wa ochitsuite imasu.|No, it’s calmed down lately.|Nahi, aajkal aaraam hai.
a|それほどでもないです。|それほどでもないです。|sore hodo demo nai desu.|Not that much.|Itna bhi nahi.
@qa:15:0
b|本日は忙しい一日でした。|ほんじつはいそがしいいちにちでした。|honjitsu wa isogashii ichinichi deshita.|Today was a busy day.|Aaj ka din busy tha.
a|ちょっと疲れました。|ちょっとつかれました。|chotto tsukaremashita.|I’m a bit tired.|Thoda thak gaya/gayi.
a|バタバタしていました。|バタバタしていました。|batabata shite imashita.|It was hectic.|Bhaag-daud lagi rahi.
@qa:15:1
b|充実した一日でした。|じゅうじつしたいちにちでした。|jūjitsu shita ichinichi deshita.|It was a fulfilling day.|Din bahut achha aur bharpoor raha.
a|いい一日でした。|いいいちにちでした。|ii ichinichi deshita.|It was a good day.|Achha din tha.
a|すごく楽しかったです！|すごくたのしかったです！|sugoku tanoshikatta desu!|It was really fun!|Bahut mazaa aaya!
`;
