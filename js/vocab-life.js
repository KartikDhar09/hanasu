// Life & work in Japan: common words for daily life and the office that JLPT N5/N4 lists don't cover.
// Same one-line format as vocab-n4.js:  japanese | kana | english | hinglish | picture (optional) | romaji override (optional)
// Words already in the N5 or N4 lists are skipped when merged (vocab-data.js), so each word is taught once.

export const LIFE_TOPICS = [
  { id: 'life-office', title: 'At the office', hg: 'Office mein', icon: '🏢', list: `
打ち合わせ|うちあわせ|meeting (informal, small)|choti meeting|🗣️
会議室|かいぎしつ|meeting room|meeting room|🚪
議事録|ぎじろく|meeting minutes|meeting ke notes|📝
議題|ぎだい|agenda item|meeting ka topic
資料|しりょう|documents / handouts|documents|📄
書類|しょるい|paperwork / forms|kaagzaat|📑
締め切り|しめきり|deadline|deadline|⏰
納期|のうき|delivery deadline|delivery ki deadline|📦
予定表|よていひょう|schedule|schedule|🗓️
出社|しゅっしゃ|coming in to the office|office aana|🏢
退社|たいしゃ|leaving the office (for the day); leaving a company|office se nikalna / company chhodna
在宅勤務|ざいたくきんむ|working from home|work from home|🏠
テレワーク|テレワーク|remote work|remote kaam|💻
出張|しゅっちょう|business trip|business trip|🧳
外出中|がいしゅつちゅう|out of the office|office se bahar|🚶
席を外す|せきをはずす|be away from one’s desk|seat se uthe hue hona|🪑
残業|ざんぎょう|overtime|overtime|🌙
定時|ていじ|regular finishing time|fixed time pe chhutti|🕔
休憩|きゅうけい|break|break|☕
朝礼|ちょうれい|morning meeting|subah ki meeting|🌅
報告|ほうこく|report (to a superior)|report karna
連絡|れんらく|contact / letting someone know|khabar dena|📞
相談|そうだん|consultation / asking for advice|salaah lena
報連相|ほうれんそう|report, inform, consult (Japanese work rule)|report-inform-consult ka rule
確認|かくにん|checking / confirmation|check karna|✅
承認|しょうにん|approval|manzoori|👍
決裁|けっさい|sign-off (by a manager)|final approval
稟議|りんぎ|formal approval request (circulated)|approval ke liye ghumaya gaya prastaav|📋
提案|ていあん|proposal|prastaav|💡
企画|きかく|plan / project idea|yojana
担当|たんとう|in charge (of)|zimmedaar
担当者|たんとうしゃ|person in charge|zimmedaar vyakti|🧑‍💼
部署|ぶしょ|department|vibhaag
総務|そうむ|general affairs (dept.)|general affairs vibhaag
人事|じんじ|human resources|HR
経理|けいり|accounting (dept.)|accounts|🧾
営業|えいぎょう|sales|sales|🤝
社長|しゃちょう|company president|company ke president|👔
部長|ぶちょう|department head|department head|👔
課長|かちょう|section manager|section manager|👔
係長|かかりちょう|team leader / chief|team leader|👔
取引先|とりひきさき|client / business partner|client|🤝
名刺|めいし|business card|visiting card|🪪
社員証|しゃいんしょう|staff ID card|company ID card|🪪
印鑑|いんかん|personal seal (stamp)|mohar|🔴
判子|はんこ|seal / stamp|mohar|🔴
押印|おういん|stamping one’s seal|mohar lagaana
署名|しょめい|signature|dastakhat|✍️
コピー機|コピーき|photocopier|photocopy machine|🖨️
ホチキス|ホチキス|stapler|stapler|📎
付箋|ふせん|sticky note|sticky note|🗒️
ファイル|ファイル|file / folder|file|📁
` },
  { id: 'life-mail', title: 'Email, phone & keigo', hg: 'Email, phone aur keigo', icon: '📧', list: `
件名|けんめい|subject (of an email)|email ka subject|📧
宛先|あてさき|addressee / "To"|kisko bhejna hai
添付|てんぷ|attachment|attachment|📎
返信|へんしん|reply|jawaab|↩️
転送|てんそう|forwarding|forward karna|➡️
一斉送信|いっせいそうしん|sending to everyone at once|sabko ek saath bhejna
お世話になっております|おせわになっております|(standard email/phone greeting)|namaste (formal business)
よろしくお願いいたします|よろしくおねがいいたします|thank you in advance (formal)|kripya dhyaan dein (formal)
お疲れ様です|おつかれさまです|hello / thanks for your work (to coworkers)|kaam ke liye shukriya (colleagues ko)
恐れ入りますが|おそれいりますが|I’m sorry to trouble you, but…|takleef ke liye maafi, par…
申し訳ございません|もうしわけございません|I’m very sorry (formal)|bahut maafi chahta hoon
承知しました|しょうちしました|understood / certainly (formal)|samajh gaya (formal)
かしこまりました|かしこまりました|certainly (very polite)|ji bilkul
少々お待ちください|しょうしょうおまちください|one moment, please|ek minute rukiye
折り返し|おりかえし|calling back|wapas call karna|📞
伝言|でんごん|message (left for someone)|sandesh|📝
不在|ふざい|absent / not in|maujood nahi
外線|がいせん|outside line|bahar ki line|☎️
内線|ないせん|extension (phone)|extension|☎️
着信|ちゃくしん|incoming call|aane wali call|📲
留守番電話|るすばんでんわ|voicemail|voicemail|📼
` },
  { id: 'life-hr', title: 'Jobs, pay & contracts', hg: 'Naukri, tankhwaah aur contract', icon: '💼', list: `
就職|しゅうしょく|getting a job|naukri lagna|💼
転職|てんしょく|changing jobs|naukri badalna|🔁
退職|たいしょく|retiring / quitting a job|naukri chhodna|👋
面接|めんせつ|interview|interview|🤝
履歴書|りれきしょ|CV / résumé|resume|📄
職務経歴書|しょくむけいれきしょ|work-history document|kaam ka itihaas (document)|📄
内定|ないてい|job offer|job offer|🎉
入社|にゅうしゃ|joining a company|company join karna|🏢
新入社員|しんにゅうしゃいん|new employee|naya karmchaari|🧑‍💼
正社員|せいしゃいん|permanent employee|permanent naukri wala
派遣社員|はけんしゃいん|agency (dispatch) worker|agency se aaya karmchaari
契約社員|けいやくしゃいん|contract employee|contract karmchaari
アルバイト|アルバイト|part-time job|part-time naukri|🧑‍🍳
契約書|けいやくしょ|contract (document)|contract|📜
給料|きゅうりょう|salary|tankhwaah|💴
給与明細|きゅうよめいさい|payslip|salary slip|🧾
手取り|てどり|take-home pay|haath mein aane wali tankhwaah|💴
ボーナス|ボーナス|bonus|bonus|🎁
交通費|こうつうひ|travel allowance|aane-jaane ka kharcha|🚃
昇進|しょうしん|promotion|promotion|📈
昇給|しょうきゅう|pay rise|tankhwaah badhna|📈
有給休暇|ゆうきゅうきゅうか|paid leave|paid chhutti|🏖️
有給|ゆうきゅう|paid leave (short)|paid chhutti|🏖️
病欠|びょうけつ|sick leave|beemaari ki chhutti|🤒
早退|そうたい|leaving early|jaldi chale jaana
遅刻届|ちこくとどけ|late-arrival form|late aane ka form|📝
研修|けんしゅう|training|training|🎓
評価|ひょうか|evaluation|moolyaankan|📊
異動|いどう|transfer (within a company)|transfer
年末調整|ねんまつちょうせい|year-end tax adjustment|saal ke ant ka tax hisaab|🧾
社会保険|しゃかいほけん|social insurance|social insurance|🛡️
年金|ねんきん|pension|pension|👴
雇用保険|こようほけん|employment insurance|berozgaari beema|🛡️
` },
  { id: 'life-business', title: 'Business & projects', hg: 'Business aur projects', icon: '📊', list: `
売上|うりあげ|sales (revenue)|bikri|📈
利益|りえき|profit|munaafa|💰
赤字|あかじ|deficit / loss|ghaata|📉
黒字|くろじ|surplus / profit|munaafa|📈
予算|よさん|budget|budget|💰
費用|ひよう|cost / expenses|kharcha|💸
経費|けいひ|business expenses|office kharcha|🧾
見積もり|みつもり|quote / estimate|estimate / quotation|🧮
請求書|せいきゅうしょ|invoice / bill|bill / invoice|🧾
領収書|りょうしゅうしょ|receipt|raseed|🧾
発注|はっちゅう|placing an order|order dena|📦
納品|のうひん|delivery (of goods)|maal pahunchaana|🚚
在庫|ざいこ|stock / inventory|stock|📦
顧客|こきゃく|customer / client|graahak|🛎️
契約|けいやく|contract|anubandh|📜
交渉|こうしょう|negotiation|baatcheet / mol-bhaav|🤝
市場|しじょう|market (economic)|bazaar|📊
競合|きょうごう|competitor|pratidvandvi
戦略|せんりゃく|strategy|ranneeti|♟️
目標|もくひょう|goal / target|lakshya|🎯
進捗|しんちょく|progress|progress|📊
課題|かだい|issue / task to solve|samasya / kaam
対応|たいおう|dealing with / response|nipatna
対策|たいさく|countermeasure|upaay
改善|かいぜん|improvement|sudhaar|📈
効率|こうりつ|efficiency|kushalta|⚡
品質|ひんしつ|quality|gunvatta|🏅
納得|なっとく|being convinced / agreeing|santusht hona
問題点|もんだいてん|problem point|samasya ki baat
解決|かいけつ|solution / solving|hal karna|✅
優先|ゆうせん|priority|praathmikta|🔝
期限|きげん|time limit / due date|samay seema|⏰
修正|しゅうせい|correction / revision|sudhaar karna|✏️
変更|へんこう|change|badlaav|🔄
共有|きょうゆう|sharing (info)|share karna|🔗
検討|けんとう|consideration / looking into|vichaar karna|🤔
導入|どうにゅう|introduction (of a system)|lagu karna
資格|しかく|qualification / licence|yogyata / certificate|📜
` },
  { id: 'life-it', title: 'Computers & internet', hg: 'Computer aur internet', icon: '💻', list: `
パソコン|パソコン|PC / computer|computer|💻
ノートパソコン|ノートパソコン|laptop|laptop|💻
画面|がめん|screen|screen|🖥️
キーボード|キーボード|keyboard|keyboard|⌨️
マウス|マウス|mouse|mouse|🖱️
充電|じゅうでん|charging|charge karna|🔋
充電器|じゅうでんき|charger|charger|🔌
電池|でんち|battery|battery|🔋
パスワード|パスワード|password|password|🔑
ログイン|ログイン|log in|login|🔐
保存|ほぞん|save|save karna|💾
削除|さくじょ|delete|delete karna|🗑️
更新|こうしん|update / renewal|update|🔄
設定|せってい|settings|settings|⚙️
接続|せつぞく|connection|connection|🔗
通信|つうしん|communication / data|data / sampark|📶
電波|でんぱ|signal (radio waves)|signal|📶
検索|けんさく|search|search|🔍
画像|がぞう|image|tasveer|🖼️
動画|どうが|video|video|🎬
印刷|いんさつ|printing|print karna|🖨️
入力|にゅうりょく|input / typing in|type karna|⌨️
変換|へんかん|conversion (e.g. kana → kanji)|badalna|🔤
文字化け|もじばけ|garbled text|ulta-pulta text
不具合|ふぐあい|bug / malfunction|kharaabi|🐞
再起動|さいきどう|restart|restart|🔄
アプリ|アプリ|app|app|📱
スマホ|スマホ|smartphone|smartphone|📱
ネット|ネット|internet|internet|🌐
ダウンロード|ダウンロード|download|download|⬇️
` },
  { id: 'life-papers', title: 'City hall & paperwork', hg: 'City office aur kaagzaat', icon: '🏛️', list: `
市役所|しやくしょ|city hall|city office|🏛️
区役所|くやくしょ|ward office|ward office|🏛️
窓口|まどぐち|service counter|counter|🪟
手続き|てつづき|procedure / paperwork|karyavahi|📋
申請|しんせい|application (official)|aavedan|📝
申込書|もうしこみしょ|application form|aavedan patra|📝
届け出|とどけで|notification (to authorities)|soochna dena|📝
記入|きにゅう|filling in (a form)|form bharna|✍️
提出|ていしゅつ|submission|jama karna|📤
在留カード|ざいりゅうカード|residence card|residence card|🪪
住民票|じゅうみんひょう|certificate of residence|nivaas praman patra|📄
転入届|てんにゅうとどけ|moving-in notice|shift hone ki soochna|📝
転出届|てんしゅつとどけ|moving-out notice|jagah chhodne ki soochna|📝
マイナンバー|マイナンバー|My Number (ID number)|My Number (pehchaan sankhya)|🔢
パスポート|パスポート|passport|passport|🛂
ビザ|ビザ|visa|visa|🛂
在留資格|ざいりゅうしかく|residence status|nivaas ka darja
更新手続き|こうしんてつづき|renewal procedure|renew karne ki karyavahi|🔄
国民健康保険|こくみんけんこうほけん|national health insurance|rashtriya health beema|🏥
保険証|ほけんしょう|health insurance card|health card|💳
税金|ぜいきん|tax|tax|💴
住民税|じゅうみんぜい|residence tax|nivaas tax|💴
所得税|しょとくぜい|income tax|income tax|💴
証明書|しょうめいしょ|certificate|praman patra|📜
本人確認|ほんにんかくにん|identity check|pehchaan ki jaanch|🪪
身分証明書|みぶんしょうめいしょ|ID document|pehchaan patra|🪪
印鑑登録|いんかんとうろく|seal registration|mohar ka registration|🔴
郵便番号|ゆうびんばんごう|postcode|pin code|📮
番地|ばんち|house number (address)|makaan number|🏠
` },
  { id: 'life-money', title: 'Money & banking', hg: 'Paisa aur bank', icon: '🏦', list: `
口座|こうざ|bank account|bank khaata|🏦
口座番号|こうざばんごう|account number|account number|🔢
暗証番号|あんしょうばんごう|PIN|PIN|🔢
通帳|つうちょう|bankbook|passbook|📒
キャッシュカード|キャッシュカード|cash (ATM) card|ATM card|💳
振込|ふりこみ|bank transfer|bank transfer|💸
振り込む|ふりこむ|to transfer (money)|paise transfer karna|💸
引き落とし|ひきおとし|direct debit|auto-debit|🔁
残高|ざんだか|balance|balance|💰
手数料|てすうりょう|fee / commission|fees / charge|💴
両替|りょうがえ|currency exchange|paise badalna|💱
送金|そうきん|sending money / remittance|paise bhejna|💸
貯金|ちょきん|savings|bachat|🐷
借金|しゃっきん|debt|karz|📉
現金|げんきん|cash|nakad|💴
小銭|こぜに|small change|chhutta|🪙
お釣り|おつり|change (money back)|wapas paise|🪙
割引|わりびき|discount|chhoot|🏷️
税込|ぜいこみ|tax included|tax shaamil|🏷️
税抜|ぜいぬき|tax excluded|tax alag|🏷️
分割払い|ぶんかつばらい|paying in instalments|kisht mein dena|💳
一括払い|いっかつばらい|paying in one go|ek baar mein dena|💳
支払い|しはらい|payment|bhugtaan|💳
家計簿|かけいぼ|household accounts book|ghar ka hisaab|📒
公共料金|こうきょうりょうきん|utility bills|bijli-paani ke bill|🧾
` },
  { id: 'life-home', title: 'Housing & utilities', hg: 'Ghar aur suvidhaayein', icon: '🏠', list: `
家賃|やちん|rent|kiraaya|💴
敷金|しききん|security deposit|security deposit|💴
礼金|れいきん|key money (non-refundable gift)|key money (wapas nahi milta)|💴
大家さん|おおやさん|landlord|makaan maalik|🧓
不動産屋|ふどうさんや|estate agent|property dealer|🏘️
賃貸|ちんたい|rental|kiraaye par|🏘️
引っ越し|ひっこし|moving house|ghar shift karna|📦
間取り|まどり|floor plan|ghar ka naksha|📐
ワンルーム|ワンルーム|studio flat|ek kamre ka flat|🏠
管理会社|かんりがいしゃ|property management company|building management company|🏢
管理費|かんりひ|management fee|maintenance charge|💴
更新料|こうしんりょう|contract renewal fee|renewal fees|💴
電気代|でんきだい|electricity bill|bijli ka bill|💡
水道代|すいどうだい|water bill|paani ka bill|🚰
ガス代|ガスだい|gas bill|gas ka bill|🔥
停電|ていでん|power cut|bijli jaana|🔌
ブレーカー|ブレーカー|circuit breaker|main switch / breaker|🔌
エアコン|エアコン|air conditioner|AC|❄️
暖房|だんぼう|heating|heater|🔥
冷房|れいぼう|air conditioning (cooling)|cooling|❄️
換気扇|かんきせん|extractor fan|exhaust fan|🌀
ベランダ|ベランダ|balcony|balcony|🪴
玄関|げんかん|entrance (where shoes come off)|ghar ka darwaaza (joote utaarne ki jagah)|🚪
押し入れ|おしいれ|closet (for futons)|almaari|🗄️
布団|ふとん|futon|bistar (futon)|🛏️
畳|たたみ|tatami mat|tatami chatai|🟫
洗濯機|せんたくき|washing machine|washing machine|🧺
冷蔵庫|れいぞうこ|fridge|fridge|🧊
電子レンジ|でんしレンジ|microwave|microwave|📟
騒音|そうおん|noise (nuisance)|shor|🔊
近所|きんじょ|neighbourhood|padosi ilaaka|🏘️
隣の人|となりのひと|neighbour (next door)|padosi|🧑
回覧板|かいらんばん|neighbourhood notice board (passed around)|mohalle ka notice board|📋
` },
  { id: 'life-trash', title: 'Rubbish & chores', hg: 'Kooda aur ghar ke kaam', icon: '🧹', list: `
燃えるゴミ|もえるゴミ|burnable rubbish|jalne wala kooda|🔥
燃えないゴミ|もえないゴミ|non-burnable rubbish|na jalne wala kooda|🗑️
粗大ゴミ|そだいゴミ|bulky rubbish|bada kooda (furniture wagairah)|🛋️
資源ゴミ|しげんゴミ|recyclables|recycle hone wala kooda|♻️
生ゴミ|なまゴミ|food waste|khaane ka kachra|🍂
ペットボトル|ペットボトル|plastic (PET) bottle|plastic bottle|🧴
空き缶|あきかん|empty can|khaali dabba|🥫
分別|ぶんべつ|sorting (rubbish)|kooda alag karna|♻️
ゴミ袋|ゴミぶくろ|rubbish bag|kooda bag|🛍️
ゴミ置き場|ゴミおきば|rubbish collection point|kooda daalne ki jagah|🗑️
収集日|しゅうしゅうび|collection day|kooda uthne ka din|🗓️
掃除機|そうじき|vacuum cleaner|vacuum cleaner|🧹
洗濯物|せんたくもの|laundry|dhulne ke kapde|👕
干す|ほす|to hang out (to dry)|sukhaana|👕
畳む|たたむ|to fold|tah karna|👕
アイロン|アイロン|iron (for clothes)|press / iron|👔
洗剤|せんざい|detergent|sarf / detergent|🧴
片付け|かたづけ|tidying up|saaf-safaai|🧹
皿洗い|さらあらい|washing dishes|bartan dhona|🍽️
` },
  { id: 'life-shop', title: 'Shopping & konbini', hg: 'Shopping aur konbini', icon: '🛒', list: `
コンビニ|コンビニ|convenience store|konbini (24 ghante ki dukaan)|🏪
スーパー|スーパー|supermarket|supermarket|🛒
ドラッグストア|ドラッグストア|drugstore|dawaai ki dukaan|💊
百円ショップ|ひゃくえんショップ|100-yen shop|100 yen shop|🏪
レジ|レジ|checkout / till|billing counter|🧾
レジ袋|レジぶくろ|plastic shopping bag|plastic bag|🛍️
エコバッグ|エコバッグ|reusable shopping bag|kapde ka thaila|👜
ポイントカード|ポイントカード|points card|points card|💳
温める|あたためる|to heat up|garam karna|🔥
お箸|おはし|chopsticks|chopsticks|🥢
賞味期限|しょうみきげん|best-before date|best before date|📅
消費期限|しょうひきげん|use-by date|expiry date|📅
半額|はんがく|half price|aadhe daam|🏷️
特売|とくばい|special sale|special sale|🏷️
売り切れ|うりきれ|sold out|bik gaya|🚫
品切れ|しなぎれ|out of stock|stock khatam|🚫
返品|へんぴん|returning goods|saamaan wapas karna|↩️
交換|こうかん|exchange|badalna|🔄
通販|つうはん|mail order / online shopping|online shopping|📦
宅配便|たくはいびん|parcel delivery|parcel delivery|📦
再配達|さいはいたつ|redelivery|dobaara delivery|🚚
不在票|ふざいひょう|missed-delivery slip|delivery ki parchi|📝
着払い|ちゃくばらい|cash on delivery|cash on delivery|💴
送料|そうりょう|shipping fee|delivery charge|🚚
` },
  { id: 'life-health', title: 'Health & clinic', hg: 'Sehat aur clinic', icon: '🏥', list: `
病院|びょういん|hospital|hospital|🏥
クリニック|クリニック|clinic|clinic|🏥
内科|ないか|internal medicine|physician|🩺
歯医者|はいしゃ|dentist|daant ka doctor|🦷
受付|うけつけ|reception|reception|🛎️
診察|しんさつ|medical examination|doctor ka check-up|🩺
診察券|しんさつけん|patient card|patient card|💳
問診票|もんしんひょう|medical questionnaire|sawaal-jawaab form|📋
予約|よやく|appointment / booking|appointment|📅
処方箋|しょほうせん|prescription|prescription|📝
薬局|やっきょく|pharmacy|dawaai ki dukaan|💊
症状|しょうじょう|symptom|lakshan|🤒
頭痛|ずつう|headache|sir dard|🤕
腹痛|ふくつう|stomach ache|pet dard|🤢
吐き気|はきけ|nausea|ulti jaisa lagna|🤢
咳|せき|cough|khaansi|😷
鼻水|はなみず|runny nose|naak behna|🤧
くしゃみ|くしゃみ|sneeze|chheenk|🤧
花粉症|かふんしょう|hay fever|pollen allergy|🌸
アレルギー|アレルギー|allergy|allergy|🤧
寒気|さむけ|chills|thand lagna|🥶
めまい|めまい|dizziness|chakkar|😵
怪我|けが|injury|chot|🩹
骨折|こっせつ|broken bone|haddi tootna|🦴
点滴|てんてき|IV drip|drip|💉
注射|ちゅうしゃ|injection|injection|💉
検査|けんさ|test / examination|jaanch|🔬
健康診断|けんこうしんだん|health check-up|health check-up|🩺
救急車|きゅうきゅうしゃ|ambulance|ambulance|🚑
体温|たいおん|body temperature|shareer ka taapmaan|🌡️
体温計|たいおんけい|thermometer|thermometer|🌡️
マスク|マスク|face mask|mask|😷
お大事に|おだいじに|get well soon / take care|apna khayaal rakhna|💐
` },
  { id: 'life-travel', title: 'Commuting & travel', hg: 'Aana-jaana aur safar', icon: '🚃', list: `
通勤|つうきん|commuting to work|office aana-jaana|🚃
定期券|ていきけん|commuter pass|monthly pass|🎫
改札|かいさつ|ticket gate|ticket gate|🚧
乗り換え|のりかえ|change (trains)|train badalna|🔁
各駅停車|かくえきていしゃ|local (stopping) train|har station rukne wali train|🚃
快速|かいそく|rapid train|tez train|🚄
新幹線|しんかんせん|bullet train|bullet train|🚅
終電|しゅうでん|last train|aakhri train|🌙
始発|しはつ|first train|pehli train|🌅
満員電車|まんいんでんしゃ|packed train|bhari hui train|🚃
遅延|ちえん|delay|der|⏰
運休|うんきゅう|service suspended|seva band|🚫
人身事故|じんしんじこ|accident involving a person (train)|train hadsa|⚠️
ホーム|ホーム|platform|platform|🚉
出口|でぐち|exit|bahar jaane ka raasta|🚪
入口|いりぐち|entrance|andar aane ka raasta|🚪
指定席|していせき|reserved seat|reserved seat|💺
自由席|じゆうせき|unreserved seat|general seat|💺
優先席|ゆうせんせき|priority seat|priority seat|♿
交通系ICカード|こうつうけいアイシーカード|IC transit card (Suica etc.)|Suica jaisa card|💳
チャージ|チャージ|top-up|recharge|💴
乗車券|じょうしゃけん|ticket (fare)|ticket|🎫
運賃|うんちん|fare|kiraaya|💴
時刻表|じこくひょう|timetable|time table|🗓️
免許証|めんきょしょう|driving licence|driving licence|🪪
駐車場|ちゅうしゃじょう|car park|parking|🅿️
駐輪場|ちゅうりんじょう|bicycle parking|cycle stand|🚲
渋滞|じゅうたい|traffic jam|traffic jam|🚗
` },
  { id: 'life-food', title: 'Eating out & cooking', hg: 'Bahar khaana aur khaana banaana', icon: '🍳', list: `
定食|ていしょく|set meal|thali jaisa set meal|🍱
食べ放題|たべほうだい|all-you-can-eat|jitna chaho utna khaao|🍖
飲み放題|のみほうだい|all-you-can-drink|jitna chaho utna piyo|🍻
お通し|おとおし|small starter (charged, at izakaya)|chhota starter (paise lagte hain)|🥢
お冷|おひや|glass of water (restaurant)|thanda paani|💧
おしぼり|おしぼり|wet towel|geela towel|🧻
会計|かいけい|the bill (paying)|bill|🧾
割り勘|わりかん|splitting the bill|bill baant lena|💴
おごる|おごる|to treat (someone)|treat dena|🎁
持ち帰り|もちかえり|takeaway|parcel / takeaway|🥡
店内|てんない|eating in|dukaan ke andar|🍽️
飲み会|のみかい|drinking party (work)|office ki drinks party|🍻
歓迎会|かんげいかい|welcome party|swaagat party|🎉
送別会|そうべつかい|farewell party|vidaai party|👋
忘年会|ぼうねんかい|year-end party|saal ke ant ki party|🎉
乾杯|かんぱい|cheers!|cheers!|🥂
食材|しょくざい|ingredients|khaane ka saamaan|🥕
調味料|ちょうみりょう|seasoning|masaale|🧂
醤油|しょうゆ|soy sauce|soy sauce|🍶
味噌|みそ|miso|miso|🥣
炊飯器|すいはんき|rice cooker|rice cooker|🍚
フライパン|フライパン|frying pan|tawa / frying pan|🍳
鍋|なべ|pot / hot pot|patila / hot pot|🍲
包丁|ほうちょう|kitchen knife|chaaku|🔪
まな板|まないた|chopping board|chopping board|🪵
ベジタリアン|ベジタリアン|vegetarian|shaakaahaari|🥗
豚肉|ぶたにく|pork|suar ka gosht|🐖
牛肉|ぎゅうにく|beef|gaay ka gosht|🐄
鶏肉|とりにく|chicken (meat)|chicken|🐔
` },
  { id: 'life-safety', title: 'Weather, disasters & safety', hg: 'Mausam, aapda aur suraksha', icon: '⚠️', list: `
地震|じしん|earthquake|bhookamp|🌏
津波|つなみ|tsunami|tsunami|🌊
台風|たいふう|typhoon|toofaan|🌀
大雨|おおあめ|heavy rain|tez baarish|🌧️
大雪|おおゆき|heavy snow|bhaari barf|❄️
警報|けいほう|warning (weather)|chetaavni|🚨
注意報|ちゅういほう|advisory (weather)|saavdhaani soochna|⚠️
避難|ひなん|evacuation|surakshit jagah jaana|🏃
避難所|ひなんじょ|evacuation shelter|raahat kendra|🏫
防災|ぼうさい|disaster prevention|aapda se bachaav|🧯
非常口|ひじょうぐち|emergency exit|emergency exit|🚪
消火器|しょうかき|fire extinguisher|aag bujhaane ka yantra|🧯
懐中電灯|かいちゅうでんとう|torch / flashlight|torch|🔦
非常食|ひじょうしょく|emergency food|aapaat ka khaana|🥫
震度|しんど|seismic intensity|bhookamp ki taakat|📊
余震|よしん|aftershock|baad ke jhatke|🌏
天気予報|てんきよほう|weather forecast|mausam ki bhavishyavaani|🌤️
梅雨|つゆ|rainy season|barsaat ka mausam|☔
熱中症|ねっちゅうしょう|heatstroke|loo lagna|🥵
湿気|しっけ|humidity|nami|💧
交番|こうばん|police box|police chowki|👮
警察|けいさつ|police|police|👮
落とし物|おとしもの|lost item|khoya hua saamaan|👛
泥棒|どろぼう|thief|chor|🦹
詐欺|さぎ|fraud / scam|dhokhadhadi|⚠️
` },
];
