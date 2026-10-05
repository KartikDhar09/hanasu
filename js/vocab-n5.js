// Full JLPT N5 vocabulary (standard unofficial list), one word per line:
//   japanese | kana | english | hinglish | picture (optional) | romaji override (optional)
// Romaji is generated from the kana. Words already in vocab-data.js are skipped when merged.

export const N5_TOPICS = [
  { id: 'n5-numbers', title: 'Numbers & counting', hg: 'Ginti', icon: '🔢', list: `
一つ|ひとつ|one (thing)|ek|1️⃣
二つ|ふたつ|two (things)|do|2️⃣
三つ|みっつ|three (things)|teen|3️⃣
四つ|よっつ|four (things)|chaar|4️⃣
五つ|いつつ|five (things)|paanch|5️⃣
六つ|むっつ|six (things)|chhe|6️⃣
七つ|ななつ|seven (things)|saat|7️⃣
八つ|やっつ|eight (things)|aath|8️⃣
九つ|ここのつ|nine (things)|nau|9️⃣
十|とお|ten (things)|das|🔟
いくつ|いくつ|how many / how old|kitne|❓
一人|ひとり|one person / alone|ek vyakti / akela|🧍
二人|ふたり|two people|do log|👫
〜人|〜にん|… people (counter)|… log|👥
〜枚|〜まい|counter for flat things|… (kaagaz jaisi cheezein)|📄
〜本|〜ほん|counter for long things|… (lambi cheezein)|🖊️
〜冊|〜さつ|counter for books|… kitaabein|📚
〜台|〜だい|counter for machines|… machine / gaadi|🚗
〜個|〜こ|counter for small things|… chhoti cheezein|🍬
〜回|〜かい|… times|… baar|🔁
〜階|〜かい|… floor|… manzil|🏢
〜歳|〜さい|… years old|… saal ka|🎂
〜番|〜ばん|number …|number …|#️⃣
〜円|〜えん|… yen|… yen|💴
半分|はんぶん|half|aadha|🌓
全部|ぜんぶ|all|sab|💯
たくさん|たくさん|a lot|bahut|📚
少し|すこし|a little|thoda|🤏
ちょっと|ちょっと|a little / a moment|thoda / ek minute|🤏
` },
  { id: 'n5-calendar', title: 'Days, months & dates', hg: 'Din, mahine, taareekh', icon: '📅', list: `
月曜日|げつようび|Monday|Somvaar|🌙
火曜日|かようび|Tuesday|Mangalvaar|🔥
水曜日|すいようび|Wednesday|Budhvaar|💧
木曜日|もくようび|Thursday|Guruvaar|🌳
金曜日|きんようび|Friday|Shukravaar|💰
土曜日|どようび|Saturday|Shanivaar|🌱
日曜日|にちようび|Sunday|Ravivaar|☀️
何曜日|なんようび|what day of the week|kaunsa din|❓
一月|いちがつ|January|January|📅
二月|にがつ|February|February|📅
三月|さんがつ|March|March|📅
四月|しがつ|April|April|📅
五月|ごがつ|May|May|📅
六月|ろくがつ|June|June|📅
七月|しちがつ|July|July|📅
八月|はちがつ|August|August|📅
九月|くがつ|September|September|📅
十月|じゅうがつ|October|October|📅
十一月|じゅういちがつ|November|November|📅
十二月|じゅうにがつ|December|December|📅
一日|ついたち|1st of the month|pehli taareekh|1️⃣
二日|ふつか|2nd / two days|do taareekh / do din|2️⃣
三日|みっか|3rd / three days|teen taareekh|3️⃣
四日|よっか|4th / four days|chaar taareekh|4️⃣
五日|いつか|5th / five days|paanch taareekh|5️⃣
六日|むいか|6th / six days|chhe taareekh|6️⃣
七日|なのか|7th / seven days|saat taareekh|7️⃣
八日|ようか|8th / eight days|aath taareekh|8️⃣
九日|ここのか|9th / nine days|nau taareekh|9️⃣
十日|とおか|10th / ten days|das taareekh|🔟
二十日|はつか|20th / twenty days|bees taareekh|📆
誕生日|たんじょうび|birthday|janmdin|🎂
休み|やすみ|holiday / day off|chhutti|🏖️
夏休み|なつやすみ|summer holiday|garmi ki chhutti|🌻
週|しゅう|week|hafta|🗓️
先週|せんしゅう|last week|pichhla hafta|⬅️
来週|らいしゅう|next week|agla hafta|➡️
毎週|まいしゅう|every week|har hafte|🔁
週末|しゅうまつ|weekend|weekend|🎉
月|つき|month / moon|mahina / chaand|🌙
先月|せんげつ|last month|pichhla mahina|⬅️
今月|こんげつ|this month|is mahine|📅
来月|らいげつ|next month|agla mahina|➡️
毎月|まいつき|every month|har mahine|🔁
年|とし|year|saal|📆
去年|きょねん|last year|pichhla saal|⬅️
今年|ことし|this year|is saal|📆
来年|らいねん|next year|agle saal|➡️
毎年|まいとし|every year|har saal|🔁
〜年|〜ねん|year …|saal …|📆
〜か月|〜かげつ|… months|… mahine|🗓️
〜週間|〜しゅうかん|… weeks|… hafte|🗓️
` },
  { id: 'n5-clock', title: 'Time of day', hg: 'Din ka samay', icon: '🕒', list: `
時間|じかん|time / hours|samay / ghante|⏳
〜時|〜じ|… o’clock|… baje|🕐
〜分|〜ふん|… minutes|… minute|⏱️
半|はん|half past|saadhe|🕧
今|いま|now|abhi|⌚
午前|ごぜん|a.m.|subah (AM)|🌅
午後|ごご|p.m.|dopahar ke baad (PM)|🌇
今朝|けさ|this morning|aaj subah|🌄
今晩|こんばん|this evening|aaj shaam|🌆
今夜|こんや|tonight|aaj raat|🌃
夕方|ゆうがた|early evening|shaam|🌇
晩|ばん|evening|shaam / raat|🌙
毎朝|まいあさ|every morning|har subah|🔁
毎晩|まいばん|every evening|har raat|🔁
おととい|おととい|day before yesterday|parson (beeta hua)|⏮️
あさって|あさって|day after tomorrow|parson (aane wala)|⏭️
前|まえ|before / in front|pehle / aage|⬅️
後|あと|after / later|baad mein|➡️
ごろ|ごろ|about (time)|ke aas-paas|🕰️
いつ|いつ|when|kab|❓
いつも|いつも|always|hamesha|♾️
時々|ときどき|sometimes|kabhi-kabhi|🔂
もう|もう|already|pehle hi|✅
まだ|まだ|not yet / still|abhi nahi / abhi bhi|⏳
すぐ|すぐ|soon / immediately|turant|⚡
早く|はやく|early / quickly|jaldi|🏃
遅い|おそい|late / slow|der / dheema|🐢
早い|はやい|early / fast|jaldi / tez|🏎️
` },
  { id: 'n5-family2', title: 'More family & people', hg: 'Aur rishtedaar aur log', icon: '👪', list: `
お父さん|おとうさん|father (someone’s)|papa / pitaji|👨
お母さん|おかあさん|mother (someone’s)|mummy / maa|👩
お兄さん|おにいさん|older brother (someone’s)|bade bhaiya|👦
お姉さん|おねえさん|older sister (someone’s)|badi didi|👧
兄弟|きょうだい|siblings|bhai-behen|🧑‍🤝‍🧑
両親|りょうしん|parents|maa-baap|👨‍👩‍👦
祖父|そふ|my grandfather|mere daada / naana|👴
祖母|そぼ|my grandmother|meri daadi / naani|👵
おじいさん|おじいさん|grandfather / old man|daada / budhe baba|👴
おばあさん|おばあさん|grandmother / old woman|daadi / budhi amma|👵
おじさん|おじさん|uncle / middle-aged man|chacha / uncle|👨
おばさん|おばさん|aunt / middle-aged woman|chachi / aunty|👩
夫|おっと|my husband|mere pati|🤵
妻|つま|my wife|meri patni|👰
主人|しゅじん|husband (my)|pati|🤵
奥さん|おくさん|wife (someone’s)|unki patni|👩
子供|こども|child|bachcha|🧒
赤ちゃん|あかちゃん|baby|baby / shishu|👶
人|ひと|person|insaan|🧍
男|おとこ|man / male|aadmi|👨
女|おんな|woman / female|aurat|👩
男の子|おとこのこ|boy|ladka|👦
女の子|おんなのこ|girl|ladki|👧
男の人|おとこのひと|man|aadmi|👨
女の人|おんなのひと|woman|aurat|👩
外国人|がいこくじん|foreigner|videshi|🌍
留学生|りゅうがくせい|international student|videshi student|🎓
私|わたし|I / me|main|🙋
あなた|あなた|you|aap|👉
彼|かれ|he / boyfriend|wo (ladka) / boyfriend|👨
彼女|かのじょ|she / girlfriend|wo (ladki) / girlfriend|👩
皆|みんな|everyone|sab log|👥
〜さん|〜さん|Mr./Ms. …|… ji|🙇
〜ちゃん|〜ちゃん|(cute suffix for kids)|(bachchon ke liye)|🧸
〜君|〜くん|(suffix for boys)|(ladkon ke liye)|👦
自分|じぶん|oneself|khud|🪞
` },
  { id: 'n5-body', title: 'Body & health', hg: 'Sharir aur sehat', icon: '🧍', list: `
体|からだ|body|sharir|🧍
頭|あたま|head|sar|🧠
顔|かお|face|chehra|🙂
目|め|eye|aankh|👁️
耳|みみ|ear|kaan|👂
鼻|はな|nose|naak|👃
口|くち|mouth|munh|👄
歯|は|tooth|daant|🦷
手|て|hand|haath|✋
足|あし|leg / foot|pair|🦶
お腹|おなか|stomach|pet|🫃
背|せ|height / back|kad / peeth|📏
声|こえ|voice|awaaz|🗣️
病気|びょうき|illness|beemari|🤒
風邪|かぜ|a cold|zukaam|🤧
薬|くすり|medicine|dawai|💊
痛い|いたい|painful|dard|😣
丈夫|じょうぶ|strong / sturdy|mazboot|💪
大丈夫|だいじょうぶ|OK / all right|theek hai|👌
` },
  { id: 'n5-home', title: 'Home & household', hg: 'Ghar ka saamaan', icon: '🏠', list: `
うち|うち|home / my house|ghar|🏠
台所|だいどころ|kitchen|rasoi|🍳
お風呂|おふろ|bath|nahaane ka tub|🛁
シャワー|シャワー|shower|shower|🚿
玄関|げんかん|entrance hall|ghar ka darwaaza|🚪
庭|にわ|garden|bageecha|🌷
階段|かいだん|stairs|seedhiyaan|🪜
ドア|ドア|door|darwaaza|🚪
戸|と|door (sliding)|darwaaza|🚪
ベッド|ベッド|bed|bistar|🛏️
テーブル|テーブル|table|mez|🪑
テレビ|テレビ|TV|TV|📺
ラジオ|ラジオ|radio|radio|📻
冷蔵庫|れいぞうこ|fridge|fridge|🧊
電気|でんき|electricity / light|bijli / light|💡
電灯|でんとう|lamp|batti|💡
ストーブ|ストーブ|heater|heater|🔥
箱|はこ|box|dabba|📦
棚|たな|shelf|almaari / shelf|🗄️
本棚|ほんだな|bookshelf|kitaabon ki almaari|📚
鏡|かがみ|mirror|aaina|🪞
石鹸|せっけん|soap|saabun|🧼
タオル|タオル|towel|towel|🧺
花瓶|かびん|vase|guldaan|🏺
灰皿|はいざら|ashtray|ashtray|🚬
物|もの|thing|cheez|📦
荷物|にもつ|luggage|saamaan|🧳
アパート|アパート|apartment|flat|🏢
建物|たてもの|building|imaarat|🏢
隣|となり|next door|bagal mein|🏘️
` },
  { id: 'n5-food2', title: 'More food & cooking', hg: 'Aur khaana', icon: '🍽️', list: `
食べ物|たべもの|food|khaana|🍲
飲み物|のみもの|drinks|peene ki cheez|🥤
料理|りょうり|cooking / dish|khaana banana / dish|🍳
昼ご飯|ひるごはん|lunch|lunch|🍱
ご飯|ごはん|meal / cooked rice|khaana / chawal|🍚
お米|おこめ|rice (uncooked)|chawal (kachcha)|🌾
牛肉|ぎゅうにく|beef|beef|🥩
豚肉|ぶたにく|pork|pork|🥓
鶏肉|とりにく|chicken|chicken|🍗
野菜|やさい|vegetables|sabzi|🥦
りんご|りんご|apple|seb|🍎
みかん|みかん|mandarin orange|santra|🍊
バナナ|バナナ|banana|kela|🍌
お茶|おちゃ|tea|chai|🍵
紅茶|こうちゃ|black tea|kaali chai|☕
コーヒー|コーヒー|coffee|coffee|☕
ジュース|ジュース|juice|juice|🧃
お酒|おさけ|alcohol / sake|sharaab|🍶
ビール|ビール|beer|beer|🍺
砂糖|さとう|sugar|cheeni|🍬
塩|しお|salt|namak|🧂
醤油|しょうゆ|soy sauce|soy sauce|🫙
バター|バター|butter|makkhan|🧈
ケーキ|ケーキ|cake|cake|🍰
カレー|カレー|curry|curry|🍛
ラーメン|ラーメン|ramen|ramen|🍜
すし|すし|sushi|sushi|🍣
お皿|おさら|plate|plate|🍽️
茶碗|ちゃわん|rice bowl|katori|🍚
箸|はし|chopsticks|chopsticks|🥢
スプーン|スプーン|spoon|chammach|🥄
フォーク|フォーク|fork|kaanta|🍴
ナイフ|ナイフ|knife|chaaku|🔪
コップ|コップ|glass / cup|gilaas|🥛
カップ|カップ|cup|cup|☕
食堂|しょくどう|cafeteria|canteen|🍽️
喫茶店|きっさてん|café|café|☕
八百屋|やおや|greengrocer|sabzi waala|🥕
` },
  { id: 'n5-clothes', title: 'Clothes & colours', hg: 'Kapde aur rang', icon: '👕', list: `
洋服|ようふく|clothes (western)|kapde|👗
上着|うわぎ|jacket|jacket|🧥
コート|コート|coat|coat|🧥
シャツ|シャツ|shirt|shirt|👔
ワイシャツ|ワイシャツ|dress shirt|formal shirt|👔
セーター|セーター|sweater|sweater|🧶
ズボン|ズボン|trousers|pant|👖
スカート|スカート|skirt|skirt|👗
ネクタイ|ネクタイ|tie|tie|👔
帽子|ぼうし|hat|topi|🧢
眼鏡|めがね|glasses|chashma|👓
靴下|くつした|socks|moze|🧦
ポケット|ポケット|pocket|jeb|👖
ボタン|ボタン|button|button|🔘
色|いろ|colour|rang|🎨
赤い|あかい|red|laal|🔴
青い|あおい|blue|neela|🔵
黄色い|きいろい|yellow|peela|🟡
白い|しろい|white|safed|⚪
黒い|くろい|black|kaala|⚫
茶色|ちゃいろ|brown|bhoora|🟤
緑|みどり|green|hara|🟢
` },
  { id: 'n5-places2', title: 'More places', hg: 'Aur jagah', icon: '🗺️', list: `
所|ところ|place|jagah|📍
町|まち|town|kasba|🏘️
国|くに|country|desh|🗾
外国|がいこく|foreign country|videsh|🌍
大使館|たいしかん|embassy|embassy|🏛️
交番|こうばん|police box|police chowki|👮
大学|だいがく|university|university|🎓
教室|きょうしつ|classroom|classroom|🏫
食堂|しょくどう|dining hall|canteen|🍽️
映画館|えいがかん|cinema|cinema hall|🎬
本屋|ほんや|bookshop|kitaabon ki dukaan|📚
花屋|はなや|florist|phoolon ki dukaan|💐
デパート|デパート|department store|department store|🏬
スーパー|スーパー|supermarket|supermarket|🛒
コンビニ|コンビニ|convenience store|convenience store|🏪
ホテル|ホテル|hotel|hotel|🏨
プール|プール|swimming pool|swimming pool|🏊
池|いけ|pond|taalaab|🪷
海|うみ|sea|samundar|🌊
山|やま|mountain|pahaad|⛰️
川|かわ|river|nadi|🏞️
橋|はし|bridge|pul|🌉
入口|いりぐち|entrance|andar jaane ka raasta|🚪
出口|でぐち|exit|bahar jaane ka raasta|🚪
角|かど|corner|kona|↩️
交差点|こうさてん|crossroads|chauraaha|🚦
` },
  { id: 'n5-position', title: 'Position & direction', hg: 'Jagah aur disha', icon: '🧭', list: `
上|うえ|above / on|upar|⬆️
下|した|below / under|neeche|⬇️
中|なか|inside|andar|📥
外|そと|outside|baahar|📤
前|まえ|front|saamne|⬆️
後ろ|うしろ|behind|peeche|⬇️
横|よこ|side|bagal|↔️
側|そば|near / beside|paas|📍
近く|ちかく|nearby|paas mein|📍
間|あいだ|between|beech mein|↔️
真ん中|まんなか|middle|beech|🎯
向こう|むこう|over there / other side|us paar|➡️
東|ひがし|east|poorab|🌅
西|にし|west|pashchim|🌇
南|みなみ|south|dakshin|⬇️
北|きた|north|uttar|⬆️
まっすぐ|まっすぐ|straight|seedha|⬆️
` },
  { id: 'n5-kosoado', title: 'This, that & question words', hg: 'Ye, wo aur sawaal', icon: '👉', list: `
これ|これ|this (near me)|ye|👇
それ|それ|that (near you)|wo (aapke paas)|👉
あれ|あれ|that (over there)|wo (door)|☝️
どれ|どれ|which one|kaunsa|❓
この|この|this …|ye …|👇
その|その|that …|wo …|👉
あの|あの|that … over there|wo … (door)|☝️
どの|どの|which …|kaunsa …|❓
ここ|ここ|here|yahaan|📍
そこ|そこ|there|wahaan|👉
あそこ|あそこ|over there|wahaan (door)|☝️
どこ|どこ|where|kahaan|❓
こちら|こちら|this way (polite)|idhar|👇
そちら|そちら|that way (polite)|udhar|👉
あちら|あちら|over there (polite)|udhar (door)|☝️
どちら|どちら|which way / where (polite)|kidhar / kaunsa|❓
こっち|こっち|this way (casual)|idhar|👇
そっち|そっち|that way (casual)|udhar|👉
あっち|あっち|over there (casual)|udhar|☝️
どっち|どっち|which (casual)|kaunsa|❓
こんな|こんな|this kind of|aisa|👇
そんな|そんな|that kind of|waisa|👉
あんな|あんな|that kind of (over there)|waisa (door wala)|☝️
どんな|どんな|what kind of|kaisa|❓
何|なに|what|kya|❓
誰|だれ|who|kaun|🕵️
どなた|どなた|who (polite)|kaun (aadar se)|🕵️
どう|どう|how|kaise|❓
どうして|どうして|why|kyun|🤔
なぜ|なぜ|why|kyun|🤔
いくら|いくら|how much|kitne ka|💴
どのくらい|どのくらい|how long / how much|kitna|📏
` },
  { id: 'n5-nature', title: 'Nature & animals', hg: 'Prakriti aur jaanwar', icon: '🌳', list: `
空|そら|sky|aasmaan|☁️
太陽|たいよう|sun|suraj|☀️
星|ほし|star|taara|⭐
風|かぜ|wind|hawa|🌬️
雲|くも|cloud|baadal|☁️
晴れ|はれ|sunny weather|dhoop|🌤️
曇り|くもり|cloudy|baadal waala mausam|☁️
秋|あき|autumn|patjhad|🍁
季節|きせつ|season|mausam|🍂
木|き|tree|ped|🌳
花|はな|flower|phool|🌸
石|いし|stone|patthar|🪨
動物|どうぶつ|animal|jaanwar|🐾
犬|いぬ|dog|kutta|🐕
猫|ねこ|cat|billi|🐈
鳥|とり|bird|chidiya|🐦
馬|うま|horse|ghoda|🐎
牛|うし|cow|gaay|🐄
豚|ぶた|pig|suar|🐖
暖かい|あたたかい|warm|garam (halka)|🌤️
涼しい|すずしい|cool|thanda (sukhad)|🍃
冷たい|つめたい|cold (to touch)|thanda (chhoone mein)|🧊
熱い|あつい|hot (to touch)|garam (chhoone mein)|♨️
` },
  { id: 'n5-school', title: 'School, study & work', hg: 'Padhai aur kaam', icon: '🏫', list: `
勉強|べんきょう|study|padhai|📖
宿題|しゅくだい|homework|homework|📝
問題|もんだい|problem / question|sawaal / samasya|❓
質問|しつもん|question|sawaal|🙋
答え|こたえ|answer|jawaab|✅
試験|しけん|exam|pariksha|📝
テスト|テスト|test|test|📝
練習|れんしゅう|practice|abhyaas|🔁
意味|いみ|meaning|matlab|💡
言葉|ことば|word / language|shabd / bhasha|💬
漢字|かんじ|kanji|kanji|漢
平仮名|ひらがな|hiragana|hiragana|あ
片仮名|かたかな|katakana|katakana|ア
文章|ぶんしょう|sentence / text|vaakya / lekh|📄
作文|さくぶん|composition|nibandh|✍️
英語|えいご|English|English|🇬🇧
日本語|にほんご|Japanese|Japanese|🇯🇵
〜語|〜ご|… language|… bhasha|🗣️
クラス|クラス|class|class|🏫
授業|じゅぎょう|lesson|class / lecture|🧑‍🏫
夏休み|なつやすみ|summer vacation|garmi ki chhutti|🌻
辞書|じしょ|dictionary|shabdkosh|📕
ノート|ノート|notebook|copy|📓
鉛筆|えんぴつ|pencil|pencil|✏️
ペン|ペン|pen|pen|🖊️
万年筆|まんねんひつ|fountain pen|fountain pen|🖋️
消しゴム|けしゴム|eraser|rubber|🧽
紙|かみ|paper|kaagaz|📄
新聞|しんぶん|newspaper|akhbaar|📰
雑誌|ざっし|magazine|patrika|📰
手紙|てがみ|letter|chitthi|✉️
葉書|はがき|postcard|postcard|📮
切手|きって|stamp|dak ticket|📮
封筒|ふうとう|envelope|lifaafa|✉️
地図|ちず|map|naksha|🗺️
仕事|しごと|work / job|kaam|💼
会社員|かいしゃいん|office worker|naukri-pesha|🧑‍💼
警官|けいかん|police officer|police waala|👮
番号|ばんごう|number|number|#️⃣
電話番号|でんわばんごう|phone number|phone number|📞
名前|なまえ|name|naam|📛
` },
  { id: 'n5-hobbies', title: 'Hobbies & free time', hg: 'Shauk aur khaali samay', icon: '🎮', list: `
映画|えいが|movie|movie|🎬
音楽|おんがく|music|sangeet|🎵
歌|うた|song|gaana|🎤
絵|え|picture / painting|tasveer|🖼️
写真|しゃしん|photo|photo|📷
旅行|りょこう|travel|safar|✈️
散歩|さんぽ|walk|tehelna|🚶
スポーツ|スポーツ|sports|khel|⚽
テニス|テニス|tennis|tennis|🎾
ギター|ギター|guitar|guitar|🎸
ピアノ|ピアノ|piano|piano|🎹
レコード|レコード|record|record|💿
カメラ|カメラ|camera|camera|📷
パーティー|パーティー|party|party|🎉
お祭り|おまつり|festival|tyohaar|🏮
趣味|しゅみ|hobby|shauk|🎨
` },
  { id: 'n5-transport2', title: 'More travel words', hg: 'Aur safar ke shabd', icon: '🚉', list: `
地下鉄|ちかてつ|subway|metro|🚇
新幹線|しんかんせん|bullet train|bullet train|🚄
船|ふね|ship|jahaaz|🚢
エレベーター|エレベーター|lift|lift|🛗
道|みち|road|raasta|🛣️
信号|しんごう|traffic light|signal|🚦
駐車場|ちゅうしゃじょう|car park|parking|🅿️
旅行|りょこう|trip|trip|🧳
外国|がいこく|abroad|videsh|🌏
` },
  { id: 'n5-verbs', title: 'N5 verbs', hg: 'N5 kriyaayein', icon: '🏃', list: `
会う|あう|meet|milna|🤝
開く|あく|open (it opens)|khulna|🔓
開ける|あける|open (something)|kholna|🚪
上げる|あげる|give / raise|dena / uthaana|🎁
遊ぶ|あそぶ|play|khelna|🧸
浴びる|あびる|take (a shower)|nahaana|🚿
洗う|あらう|wash|dhona|🧼
ある|ある|there is (things)|hona (cheez)|📦
歩く|あるく|walk|chalna|🚶
言う|いう|say|kehna|💬
行く|いく|go|jaana|➡️
いる|いる|there is (people)|hona (log)|🧍
要る|いる|need|zaroorat hona|🙏
入れる|いれる|put in|daalna|📥
歌う|うたう|sing|gaana|🎤
生まれる|うまれる|be born|paida hona|👶
売る|うる|sell|bechna|🏷️
起きる|おきる|wake up|uthna|⏰
置く|おく|put / place|rakhna|📍
教える|おしえる|teach / tell|sikhaana / bataana|🧑‍🏫
押す|おす|push / press|dabaana|👆
覚える|おぼえる|remember / memorise|yaad karna|🧠
泳ぐ|およぐ|swim|tairna|🏊
降りる|おりる|get off|utarna|⬇️
終わる|おわる|end|khatam hona|🏁
買う|かう|buy|khareedna|🛒
返す|かえす|return (something)|lautaana|↩️
帰る|かえる|go home|ghar jaana|🏠
かかる|かかる|take (time / money)|lagna (samay / paisa)|⏳
書く|かく|write|likhna|✍️
かける|かける|make (a call) / wear (glasses)|phone karna / chashma lagaana|📞
貸す|かす|lend|udhaar dena|🤲
かぶる|かぶる|put on (a hat)|topi pehenna|🧢
借りる|かりる|borrow|udhaar lena|🤲
消える|きえる|disappear / go out|gaayab hona / bujhna|💨
消す|けす|turn off / erase|band karna / mitaana|🔌
聞く|きく|listen / ask|sunna / poochhna|👂
切る|きる|cut|kaatna|✂️
着る|きる|wear (clothes)|pehenna|👕
来る|くる|come|aana|👋
答える|こたえる|answer|jawaab dena|✅
困る|こまる|be in trouble|pareshaan hona|😟
咲く|さく|bloom|khilna|🌸
差す|さす|open (an umbrella)|chhata kholna|☂️
死ぬ|しぬ|die|marna|🥀
閉まる|しまる|close (it closes)|band hona|🔒
閉める|しめる|close (something)|band karna|🚪
締める|しめる|tie / fasten|baandhna|👔
知る|しる|know|jaanna|💡
吸う|すう|smoke / breathe in|cigarette peena / saans lena|🚬
住む|すむ|live (somewhere)|rehna|🏠
する|する|do|karna|✅
座る|すわる|sit|baithna|🪑
出す|だす|take out / submit|nikaalna / jama karna|📤
立つ|たつ|stand|khade hona|🧍
頼む|たのむ|ask / request|request karna|🙏
食べる|たべる|eat|khaana|🍽️
違う|ちがう|be different / wrong|alag / galat hona|❌
使う|つかう|use|istemaal karna|🛠️
疲れる|つかれる|get tired|thakna|😩
着く|つく|arrive|pahunchna|📍
作る|つくる|make|banaana|🛠️
つける|つける|turn on|chaalu karna|💡
勤める|つとめる|work for|naukri karna|🏢
出かける|でかける|go out|baahar jaana|🚶
できる|できる|can / be done|kar paana / ho jaana|💪
出る|でる|leave / go out|nikalna|🚪
飛ぶ|とぶ|fly|udna|🕊️
止まる|とまる|stop|rukna|🛑
取る|とる|take|lena|🤏
撮る|とる|take (a photo)|photo lena|📷
鳴く|なく|cry (animal)|bolna (jaanwar)|🐦
なくす|なくす|lose|khona|🔍
習う|ならう|learn|seekhna|📖
並ぶ|ならぶ|line up|line mein lagna|🧍‍🧍
並べる|ならべる|arrange|sajaana|🗂️
なる|なる|become|banna / hona|🦋
脱ぐ|ぬぐ|take off (clothes)|utaarna|👕
寝る|ねる|sleep|sona|😴
登る|のぼる|climb|chadhna|🧗
飲む|のむ|drink|peena|🥤
乗る|のる|ride|savaar hona|🚌
入る|はいる|enter|andar jaana|🚪
はく|はく|wear (shoes / trousers)|pehenna (joote / pant)|👟
始まる|はじまる|begin|shuru hona|🏁
走る|はしる|run|daudna|🏃
働く|はたらく|work|kaam karna|👷
話す|はなす|speak|baat karna|🗣️
貼る|はる|stick|chipkaana|📌
晴れる|はれる|clear up (weather)|mausam saaf hona|🌤️
引く|ひく|pull / catch (a cold)|kheenchna / zukaam hona|🫳
弾く|ひく|play (an instrument)|bajaana|🎹
吹く|ふく|blow|phoonkna / chalna (hawa)|🌬️
降る|ふる|fall (rain / snow)|barasna|🌧️
曲がる|まがる|turn|mudna|↪️
待つ|まつ|wait|intezaar karna|⏳
磨く|みがく|brush / polish|maanjna|🪥
見せる|みせる|show|dikhaana|👀
見る|みる|see / watch|dekhna|👁️
持つ|もつ|hold / have|pakadna|🤲
休む|やすむ|rest|aaraam karna|😌
呼ぶ|よぶ|call|bulaana|📣
読む|よむ|read|padhna|📖
分かる|わかる|understand|samajhna|💡
渡す|わたす|hand over|dena / saumpna|🤝
渡る|わたる|cross|paar karna|🚶
忘れる|わすれる|forget|bhoolna|🤦
` },
  { id: 'n5-iadj', title: 'More い-adjectives', hg: 'Aur visheshan (-i wale)', icon: '🎨', list: `
暖かい|あたたかい|warm|garam|🌤️
危ない|あぶない|dangerous|khatarnaak|⚠️
厚い|あつい|thick|mota|📚
薄い|うすい|thin|patla|📄
忙しい|いそがしい|busy|busy|🏃
うるさい|うるさい|noisy / annoying|shor waala|🔊
嬉しい|うれしい|happy|khush|😄
多い|おおい|many|bahut|📚
少ない|すくない|few|kam|🤏
重い|おもい|heavy|bhaari|🏋️
軽い|かるい|light|halka|🪶
面白い|おもしろい|interesting / funny|mazedaar|😂
つまらない|つまらない|boring|bore|🥱
かわいい|かわいい|cute|pyaara|🐱
汚い|きたない|dirty|ganda|🗑️
暗い|くらい|dark|andhera|🌑
明るい|あかるい|bright|roshan|💡
狭い|せまい|narrow / small (room)|tang|📦
広い|ひろい|wide / spacious|khula|🏟️
長い|ながい|long|lamba|📏
短い|みじかい|short|chhota|✂️
太い|ふとい|fat / thick|mota|🪵
細い|ほそい|thin / slender|patla|🧵
低い|ひくい|low / short|neecha / chhota|⬇️
強い|つよい|strong|mazboot|💪
弱い|よわい|weak|kamzor|🥀
欲しい|ほしい|want|chahiye|🎁
まずい|まずい|bad-tasting|bekaar swaad|🤢
丸い|まるい|round|gol|⚪
若い|わかい|young|jawaan|🧑
痛い|いたい|painful|dard|😣
近い|ちかい|near|paas|📍
速い|はやい|fast|tez|🏎️
` },
  { id: 'n5-naadj', title: 'な-adjectives', hg: 'Visheshan (-na wale)', icon: '🌸', list: `
好き|すき|like|pasand|❤️
大好き|だいすき|love / really like|bahut pasand|😍
嫌い|きらい|dislike|naapasand|👎
大嫌い|だいきらい|hate|bilkul naapasand|🙅
上手|じょうず|good at|mahir|🏅
下手|へた|bad at|kamzor|🤷
綺麗|きれい|pretty / clean|sundar / saaf|💐
静か|しずか|quiet|shaant|🤫
賑やか|にぎやか|lively|raunak waala|🎊
便利|べんり|convenient|aasaan / suvidhajanak|👍
不便|ふべん|inconvenient|asuvidhajanak|👎
暇|ひま|free (time)|khaali|🛋️
大切|たいせつ|important|zaroori|💎
大事|だいじ|important|ahem|💎
大変|たいへん|hard / terrible|mushkil|😰
簡単|かんたん|easy / simple|aasaan|✅
いろいろ|いろいろ|various|tarah-tarah ke|🌈
同じ|おなじ|same|ek jaisa|🟰
結構|けっこう|fine / quite|theek / kaafi|👌
嫌|いや|unpleasant / no|naapasand / nahi|🙅
親切|しんせつ|kind|dayalu|🤗
` },
  { id: 'n5-adverbs', title: 'Adverbs & useful words', hg: 'Kaam ke shabd', icon: '✨', list: `
とても|とても|very|bahut|💯
よく|よく|well / often|achhe se / aksar|👍
あまり|あまり|not very (+ negative)|zyaada nahi|🤏
全然|ぜんぜん|not at all (+ negative)|bilkul nahi|🚫
もっと|もっと|more|aur zyaada|➕
一番|いちばん|most / number one|sabse|🥇
一緒に|いっしょに|together|saath mein|🤝
ゆっくり|ゆっくり|slowly|dheere|🐢
大体|だいたい|mostly / about|zyaadatar / lagbhag|📊
たぶん|たぶん|probably|shaayad|🤔
本当に|ほんとうに|really|sach mein|❗
また|また|again|phir se|🔁
まだ|まだ|still / not yet|abhi bhi / abhi nahi|⏳
初めて|はじめて|for the first time|pehli baar|🆕
最初|さいしょ|first|shuru mein|1️⃣
最後|さいご|last|aakhir mein|🏁
次|つぎ|next|agla|➡️
ほか|ほか|other|doosra|🔀
だけ|だけ|only|sirf|☝️
もちろん|もちろん|of course|bilkul|👍
そう|そう|so / that way|aisa|👌
はい|はい|yes|haan / ji|✅
いいえ|いいえ|no|nahi|❌
ええ|ええ|yes (casual)|haan|👍
でも|でも|but|lekin|↔️
それから|それから|and then|uske baad|➡️
じゃあ|じゃあ|well then|toh phir|👋
どうぞ|どうぞ|please / go ahead|lijiye / kijiye|🙏
どうも|どうも|thanks|shukriya|🙇
お願いします|おねがいします|please|please|🙏
すみません|すみません|excuse me / sorry|maaf kijiye|🙇
ごめんなさい|ごめんなさい|I’m sorry|sorry|🙇
` },
  { id: 'n5-katakana', title: 'Katakana loanwords', hg: 'Angrezi se aaye shabd', icon: '🔤', list: `
アイスクリーム|アイスクリーム|ice cream|ice cream|🍦
カレンダー|カレンダー|calendar|calendar|📅
カード|カード|card|card|💳
ゲーム|ゲーム|game|game|🎮
コピー|コピー|copy|copy|📄
シャワー|シャワー|shower|shower|🚿
スリッパ|スリッパ|slippers|chappal|🩴
ゼロ|ゼロ|zero|zero|0️⃣
タバコ|タバコ|cigarette|cigarette|🚬
テープ|テープ|tape|tape|📼
ドア|ドア|door|darwaaza|🚪
トイレ|トイレ|toilet|toilet|🚻
ニュース|ニュース|news|khabar|📰
ハンカチ|ハンカチ|handkerchief|rumaal|🤧
ページ|ページ|page|panna|📄
ペット|ペット|pet|paaltu jaanwar|🐕
ボールペン|ボールペン|ballpoint pen|ball pen|🖊️
ポスト|ポスト|postbox|post box|📮
マッチ|マッチ|match (to light)|maachis|🔥
メートル|メートル|metre|meter|📏
キロ|キロ|kilo|kilo|⚖️
グラム|グラム|gram|gram|⚖️
` },
];
