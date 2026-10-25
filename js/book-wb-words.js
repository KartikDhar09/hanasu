// Book tab page: wb-words. Loaded only when opened; see js/book-kit.js for the helpers.
import { P, N, LINK, WL } from './book-kit.js';

export default {
  id: 'wb-words', title: 'Wordbook: list of useful words', jp: 'お役立ち語彙集',
  sections: [
    { h: '仕事 Shigoto · Jobs', blocks: [WL(`
government worker|公務員|kōmuin
company worker|会社員|kaishain
engineer|エンジニア|enjinia
programmer|プログラマー|puroguramā
lawyer|弁護士|bengoshi
accountant|会計士|kaikeishi
tax accountant|税理士|zeirishi
banker|銀行員|ginkōin
translator|翻訳家|hon’yakuka
interpreter|通訳(者)|tsūyaku(sha)|通訳者
doctor|医者|isha
nurse|看護師|kangoshi
researcher|研究員|kenkyūin
teacher|先生／教師|sensei / kyōshi
student|学生|gakusei
artist|アーティスト|āthisuto
architect|建築家|kenchikuka
designer|デザイナー|dezainā
musician|ミュージシャン|myūjishan
cameraman|カメラマン|kameraman
photographer|写真家|shashinka
writer|作家／ライター|sakka / raitā
chef|シェフ／コック|shefu / kokku
beautician|美容師|biyōshi
self-employed|自営業|jieigyō
housewife|主婦|shufu`)] },
    { h: '趣味／スポーツ Shumi / Supōtsu · Hobbies / Sports', blocks: [WL(`
movie|映画|eiga
music|音楽|ongaku
reading|読書|dokusho
leisure walk|散歩|sampo
gardening|ガーデニング|gādeningu
paintings|絵|e
travel / trip|旅行|ryokō
leisure drive|ドライブ|doraibu
picture / photo|写真|shashin
shopping|買い物|kaimono
cooking|料理|ryōri
bowling|ボウリング|bōringu
pool / billiard|ビリヤード|biriyādo
karaoke|カラオケ|karaoke
darts|ダーツ|dātsu
video games|ゲーム|gēmu
manga / comic|まんが|manga
the outdoors|アウトドア|autodoa
the internet|インターネット|intānetto
eating tour|食べ歩き|tabe-aruki
cycling|サイクリング|saikuringu
jogging|ジョギング|jogingu
soccer / football|サッカー|sakkā
baseball|野球|yakyū
snowboarding|スノーボード|sunōbōdo
skiing|スキー|sukī
scuba diving|スキューバダイビング|sukyūba-daibingu
surfing|サーフィン|sāfin
yoga|ヨガ|yoga
dancing|ダンス|dansu
golf|ゴルフ|gorufu
tennis|テニス|tenisu
ping pong|卓球|takkyū
weight training|ウエイトトレーニング|ueito-torēningu
martial arts|格闘技|kakutōgi
judo|柔道|jūdō
aikido|合気道|aikidō
karate|空手|karate
swimming|水泳|suiei
mountain climbing|山登り|yama-nobori
hiking|ハイキング|haikingu`)] },
    { h: '店／施設 Mise / Shisetsu · Shops / Facilities', blocks: [WL(`
bookstore|本屋|hon-ya
flower shop|花屋|hana-ya
internet café|インターネットカフェ|intānetto kafe
restaurant|レストラン|resutoran
café|喫茶店／カフェ|kissaten / kafe
izakaya / Japanese pub|居酒屋|izakaya
bakery|パン屋|pan-ya
ramen house|ラーメン屋|rāmen-ya
sushi restaurant|すし屋|sushi-ya
electronics store|電気屋|denki-ya
beauty salon|美容院|biyō-in
barbershop|床屋|tokoya
100-yen store|100円ショップ|hyaku-en shoppu|ひゃくえんショップ
discount store|ディスカウントショップ|disukaunto shoppu
drugstore|薬屋／ドラッグストア|kusuri-ya / doraggu sutoa
pharmacy|薬局|yakkyoku
super market|スーパー|sūpā
convenience store|コンビニ|kombini
bank|銀行|ginkō
ATM|ATM|ATM|エーティーエム
station|駅|eki
bus stop|バス停|basu-tei
movie theater|映画館|eigakan
museum|美術館|bijutsukan
zoo|動物園|dōbutsu-en
police box|交番|kōban
post office|郵便局|yūbinkyoku
amusement park|遊園地|yūenchi
park|公園|kōen
hotel|ホテル|hoteru
guesthouse|ゲストハウス|gesuto-hausu
gas station|ガソリンスタンド|gasorin sutando
parking lot|駐車場|chūshajō
city hall|区役所／市役所|kuyakusho / shiyakusho
airport|空港|kūkō
university|大学|daigaku
school|学校|gakkō
hospital|病院|byōin
department store|デパート|depāto
shopping mall|ショッピングモール|shoppingu mōru
onsen (hot spring)|温泉|onsen
temple|お寺|otera
restroom|トイレ|toire
cash register|レジ|reji
elevator|エレベーター|erebētā
escalator|エスカレーター|esukarētā
coin-operated locker|コインロッカー|koin rokkā
entrance|入り口|iriguchi
exit|出口|deguchi`)] },
    { h: '衣類／アクセサリー Irui / Akusesarī · Clothing / Accessories', blocks: [WL(`
T-shirt|Tシャツ|T-shatsu
dress shirt|ワイシャツ|wai-shatsu
shoes|靴|kutsu
socks|靴下|kutsushita
necktie|ネクタイ|nekutai
shorts|半ズボン／ショートパンツ|han-zubon / shōto-pantsu
pants / trousers|ズボン／パンツ|zubon / pantsu
jacket|ジャケット|jaketto
underwear|下着|shitagi
short / long sleeves|半／長そで|han- / naga-sode|半そで、長そで
skirt|スカート|sukāto
jeans|ジーンズ|jīnzu
sweater|セーター|sētā
jumper|ジャンパー|jampā
kimono|着物|kimono
yukata / cotton kimono|浴衣|yukata
watch / clock|時計|tokei
scarf|マフラー|mafurā
glasses|めがね|megane
swimsuit|水着|mizugi
hat / cap|帽子|bōshi
pierced earring|ピアス|piasu
earring|イヤリング|iyaringu
necklace|ネックレス|nekkuresu
glove|手袋|tebukuro
belt|ベルト|beruto
ring|ゆびわ|yubiwa
handkerchief|ハンカチ|hankachi
bag|バッグ／かばん|baggu / kaban`)] },
    { h: '文房具 Bumbōgu · Stationery', blocks: [WL(`
notebook|ノート|nōto
pen|ペン|pen
scissors|ハサミ|hasami
file|ファイル|fairu
eraser|消しゴム|keshigomu
sticky note|付箋|fusen
scotch tape|セロテープ|serotēpu
packaging tape|ガムテープ|gamu-tēpu
stapler|ホッチキス|hocchikisu`)] },
    { h: '家具／電化製品 Kagu / Denka-seihin · Furniture / Appliance', blocks: [WL(`
desk|机|tsukue
chair|いす|isu
table|テーブル|tēburu
bed|ベッド|beddo
Japanese-style bedding|布団|futon
refrigerator|冷蔵庫|reizōko
washing machine|洗濯機|sentakuki
vacuum cleaner|掃除機|sōjiki
microwave|電子レンジ|denshi-renji
air conditioner|エアコン|eakon
printer|プリンタ|purinta
digital camera|デジカメ／デジタルカメラ|dejikame / dejitaru-kamera
personal computer|パソコン|pasokon
cellular phone|携帯(電話)|keitai (denwa)|携帯電話
electronic dictionary|電子辞書|denshi-jisho
TV|テレビ|terebi`)] },
    { h: '薬 Kusuri · Medicine', blocks: [WL(`
headache medicine|頭痛薬|zutsū-yaku
painkiller|痛み止め|itami-dome
cold medicine|かぜ薬|kazegusuri
stomach medicine|胃薬|igusuri
gargle|うがい薬|ugaigusuri
eye drops|目薬|megusuri
nasal drops|点鼻薬|tenbi-yaku
itch medicine|かゆみ止め|kayumi-dome
disinfectant|消毒液|shōdoku-eki
band-aid|ばんそうこう|bansōkō
diarrhea medicine|下痢止め|geri-dome
wet cloth (compress)|湿布|shippu
insecticide|殺虫剤|sacchū-zai`)] },
    { h: '色 Iro · Colors', blocks: [P('The colours are on the Pictures page.'), LINK('#book/pictures', 'Open Pictures: colors & Japanese food')] },
    { h: '料理 Ryōri · Food', blocks: [
      P('The book’s food list repeats every dish from the Pictures pages; those are on the Pictures page with photos. These are the dishes that are only in the list:'),
      LINK('#book/pictures', 'Open Pictures: colors & Japanese food'),
      WL(`
Japanese food|日本料理|Nihon ryōri
rice with hashed meat|ハヤシライス|hayashi raisu
pizza|ピザ|piza
pasta with tomato ketchup|ナポリタン|naporitan
spaghetti with cod roe|タラコスパゲッティ|tarako-supagetthi
carbonara|カルボナーラ|karubonāra
gratin|グラタン|guratan
rice and cheese casserole|ドリア|doria
hamburger|ハンバーガー|hambāgā
cheeseburger|チーズバーガー|chīzu bāgā
teriyaki burger|テリヤキバーガー|teriyaki bāgā
french fries|(フライド)ポテト|(furaido) poteto|フライドポテト
salad|サラダ|sarada
Chinese food|中華料理|Chūka ryōri
shrimp with chili sauce|エビチリ|ebichiri
meat dumpling (bun)|肉まん|nikuman
stir-fried vegetables|野菜炒め|yasai-itame
chop suey rice bowl|中華丼|chūkadon
cold Chinese noodles|冷やし中華|hiyashi chūka
desserts|デザート|dezāto
pudding|プリン|purin
chocolate parfait|チョコレートパフェ|chokorēto pafe
sweet boiled beans|みつまめ|mitsumame
dumpling (sweet)|だんご|dango
shaved ice|かき氷|kakigōri
pickled vegetables|漬物|tsukemono`)] },
    { h: '食材 Shokuzai · Cooking Ingredients', blocks: [WL(`
seasoning|調味料|chōmiryō
salt|塩|shio
pepper|こしょう|koshō
sugar|砂糖|satō
soy sauce|しょうゆ|shōyu
tabasco sauce|タバスコ|tabasuko
mustard|マスタード|masutādo
grated cheese|粉チーズ|kona-chīzu
sauce|ソース|sōsu
a mixture of red pepper and other spices|七味(とうがらし)|shichimi (tōgarashi)|七味とうがらし
vinegar|(お)酢|(o)su|お酢
ponzu (made from soy sauce and citrus juice)|ポン酢|ponzu
mayonnaise|マヨネーズ|mayonēzu
sweet sake (used as a condiment)|みりん|mirin
ketchup|ケチャップ|kechappu
Chinese chili oil|ラー油|rā-yu
miso|味噌|miso
condiments|薬味|yakumi
egg|卵|tamago
seafoods|シーフード|shīfūdo
tuna|まぐろ|maguro
shrimp|えび|ebi
squid|いか|ika
scallop|ほたて|hotate
octopus|たこ|tako
abalone|あわび|awabi
oyster|かき|kaki
sardine|いわし|iwashi
salmon|さけ|sake
mackerel|さば|saba
eel|うなぎ|unagi
salmon roe|いくら|ikura
urchin|うに|uni
crab|かに|kani
blowfish|フグ|fugu
meat|肉|niku
pork|豚肉|butaniku
beef|牛肉|gyūniku
chicken|鶏肉|toriniku
minced meat|ひき肉|hikiniku
vegetables|野菜|yasai
bean sprouts|もやし|moyashi
lettuce|レタス|retasu
cucumber|きゅうり|kyūri
eggplant|なす|nasu
bitter melon|ゴーヤ|gōya
cabbage|キャベツ|kyabetsu
carrot|にんじん|ninjin
pepper (green)|ピーマン|pīman
onion|たまねぎ|tamanegi
bamboo shoot|たけのこ|takenoko
spinach|ほうれんそう|hōrensō
Japanese pumpkin|かぼちゃ|kabocha
potato|じゃがいも|jagaimo
Japanese sweet potato|さつまいも|satsumaimo
garlic|にんにく|ninniku
celery|セロリ|serori
Chinese cabbage|白菜|hakusai
daikon radish|大根|daikon
lotus root|レンコン|renkon
burdock|ごぼう|gobō
shiitake mushroom|しいたけ|shiitake
shimeji mushroom|しめじ|shimeji
enoki mushroom|えのき|enoki
fruits|果物|kudamono
grape|ぶどう|budō
watermelon|すいか|suika
apple|りんご|ringo
tangerine|みかん|mikan
loquat|びわ|biwa
peach|もも|momo
strawberry|いちご|ichigo
pear|なし|nashi
persimmon|かき|kaki
cherry|さくらんぼ|sakurambo`), N('Condiments like nori, katsuobushi, wasabi and tofu are on the Pictures page with photos.')] },
    { h: '飲み物 Nomimono · Drinks', blocks: [WL(`
water|水|mizu
tea|お茶|o-cha
green tea|緑茶|ryoku-cha
powdered green tea|抹茶|maccha
barley tea|麦茶|mugi-cha
oolong tea|ウーロン茶|ūron-cha
black tea|紅茶|kōcha
iced tea|アイスティー|aisu-thī
coffee|コーヒー|kōhī
iced coffee|アイスコーヒー|aisu-kōhī
cream|(コーヒー)ミルク|(kōhī) miruku|コーヒーミルク
liquid sugar|ガムシロップ|gamu shiroppu
café au lait|カフェオレ|kafeore
cappuccino|カプチーノ|kapuchīno
hot chocolate|ココア|kokoa
juice|ジュース|jūsu
cola|コーラ|kōra
ginger ale|ジンジャエール|jinjā ēru
milk|牛乳|gyūnyū
soy milk|豆乳|tōnyū
alcoholic drink / Japanese sake|(お)酒|(o)sake|お酒
(canned / bottled) beer|(缶／ビン)ビール|(kan / bin) bīru|缶ビール、ビンビール
draft beer|生ビール|nama-bīru
Japanese sake|日本酒|nihon-shu
hot sake|熱燗|atsukan
cold sake|冷酒|reishu
red / white wine|(赤／白)ワイン|(aka / shiro) wain|赤ワイン、白ワイン
champagne|シャンパン|shampan
cocktail|カクテル|kakuteru
shochu (Japanese liquor similar to vodka)|焼酎|shōchū
with cold water|水割り|mizu-wari
with hot water|お湯割り|oyu-wari
with soda|ソーダ割り|sōda-wari
shochu with lemon and soda|レモンサワー|remon sawā
whiskey|ウイスキー|uisukī
on the rocks|ロック|rokku
straight|ストレート|sutorēto
shochu with tonic water|チューハイ|chū-hai
plum wine|梅酒|umeshu`)] },
    { h: '食器類 Shokki-rui · Tableware', blocks: [WL(`
plate / dish|皿|sara
small plate|取り皿|torizara
cup|コップ|koppu
glass|グラス|gurasu
knife|ナイフ|naifu
fork|フォーク|fōku
Chinese soup spoon|れんげ|renge
spoon|スプーン|supūn
chopsticks|(お)はし|(o)hashi|おはし
disposable chopsticks|割りばし|waribashi
straw|ストロー|sutorō
rolled wet towel|おしぼり|oshibori
toothpick|つまようじ|tsumayōji
napkin|ナプキン|napukin`)] },
    { h: '日用品 Nichiyō-hin · Daily Commodities', blocks: [WL(`
umbrella|かさ|kasa
tissue|ティッシュ|thisshu
toothbrush|歯ブラシ|haburashi
battery / dry cell|電池|denchi
light bulb|電球|denkyū
cigarette|たばこ|tabako
ashtray|灰皿|haizara
towel|タオル|taoru
soap|せっけん|sekken
detergent|洗剤|senzai
paper bag|紙袋|kami-bukuro
plastic bag|ビニール袋|binīru-bukuro
newspaper|新聞|shimbun
map|地図|chizu`)] },
    { h: '乗り物／電車 Norimono / Densha · Vehicles / Train', blocks: [WL(`
car / automobile|車／自動車|kuruma / jidōsha
motorcycle|バイク|baiku
bus|バス|basu
taxi|タクシー|takushī
airplane|飛行機|hikōki
bicycle|自転車|jitensha
boat / ship|船|fune
ferry|フェリー|ferī
train|電車|densha
subway|地下鉄|chikatetsu
Shinkansen / bullet train|新幹線|shinkansen
platform|ホーム|hōmu
platform no. …|〜番線|-ban sen|番線
ticket gate|改札|kaisatsu
ticket|切符|kippu
ticket salespoint|切符売り場|kippu-uriba
bound for …|〜行き|-iki|行き
local|普通／各駅停車|futsū / kakueki-teisha
rapid|快速|kaisoku
express|急行|kyūkō
special express|特急|tokkyū
not in service|回送|kaisō
station employee|駅員|eki-in
conductor|車掌|shashō
seat|席|seki
designated seating|指定席|shitei-seki
free seating|自由席|jiyū-seki
first-class car|グリーン車|gurīn sha
last train|終電|shūden
first train|始発(電車)|shihatsu (densha)|始発電車
priority seating|優先席|yūsen-seki
women-only car|女性専用車|josei-sen’yō sha
kiosk|売店／キオスク|baiten / kiosuku
station bento|駅弁|eki-ben`)] },
    { h: 'イベント Ibento · Event', blocks: [WL(`
party|パーティー|pāthī
drinking party at izakaya|飲み会|nomikai
new year’s party|新年会|shinnenkai
year-end party|忘年会|bōnenkai
spring break|春休み|haru-yasumi
summer break|夏休み|natsu-yasumi
winter break|冬休み|fuyu-yasumi
rice-cake making|餅つき|mochitsuki
concert / gig|コンサート／ライブ|konsāto / raibu
barbecue|バーベキュー|bābekyū
fireworks display|花火大会|hanabi-taikai
flower (sakura) viewing|花見|hanami
goodbye party|送別会|sōbetsukai
welcome party|歓迎会|kangeikai
after-party|2次会|niji-kai|にじかい
date|デート|dēto
mixer|合コン|gō-kon
wedding|結婚式|kekkonshiki
open-air festival|野外フェス|yagai-fesu`)] },
    { h: '伝統芸能 Dentō geinō · Traditional Arts', blocks: [WL(`
kabuki|歌舞伎|kabuki
sumo wrestling|すもう|sumō
noh theatre|能|nō
tea ceremony|茶道|sadō
flower arrangement|華道|kadō
calligraphy|書道|shodō
haiku poetry|俳句|haiku
Japanese comedic storytelling|落語|rakugo`)] },
  ],
};
