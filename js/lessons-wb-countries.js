// Lessons tab page: wb-countries. Loaded only when opened; see js/lessons-kit.js for the helpers.
import { WL } from './lessons-kit.js';

export default {
  id: 'wb-countries', title: 'Word list: countries and regions', jp: '国・地域',
  sections: [
    { h: 'アフリカ Afurika · Africa', blocks: [WL(`
Benin|ベナン|Benan
Cameroon|カメルーン|Kamerūn
Cote d’Ivoire|コートジボアール|Kōtojiboāru
Egypt|エジプト|Ejiputo
Ethiopia|エチオピア|Echiopia
Ghana|ガーナ|Gāna
Guinea|ギニア|Ginia
Kenya|ケニア|Kenia
Madagascar|マダガスカル|Madagasukaru
Morocco|モロッコ|Morokko
Nigeria|ナイジェリア|Naijeria
Senegal|セネガル|Senegaru
South African Republic|南アフリカ共和国|Minami Afurika kyōwakoku
Tanzania|タンザニア|Tanzania
Tunisia|チュニジア|Chunijia`)] },
    { h: 'アジア／オセアニア Ajia / Oseania · Asia / Oceania', blocks: [WL(`
Afghanistan|アフガニスタン|Afuganisutan
Australia|オーストラリア|Ōsutoraria
Bahrain|バーレーン|Bārēn
Bangladesh|バングラデシュ|Banguradeshu
China|中国|Chūgoku
India|インド|Indo
Indonesia|インドネシア|Indoneshia
Iran|イラン|Iran
Iraq|イラク|Iraku
Japan|日本|Nihon
Korea|韓国|Kankoku
Kuwait|クウェート|Kuwēto
Kyrgyzstan|キルギス|Kirugisu
Lebanon|レバノン|Rebanon
Malaysia|マレーシア|Marēshia
Mongolia|モンゴル|Mongoru
Myanmar|ミャンマー|Myanmā
Nepal|ネパール|Nepāru
New Zealand|ニュージーランド|Nyūjīrando
Oman|オマーン|Omān
Pakistan|パキスタン|Pakisutan
Philippines|フィリピン|Firipin
Qatar|カタール|Katāru
Saudi Arabia|サウジアラビア|Sauji Arabia
Singapore|シンガポール|Shingapōru
Sri Lanka|スリランカ|Suriranka
Taiwan|台湾|Taiwan
Thailand|タイ|Tai
Turkey|トルコ|Toruko
United Arab Emirates|アラブ首長国連邦|Arabu shuchōkoku rempō
Uzbekistan|ウズベキスタン|Uzubekisutan
Vietnam|ベトナム|Betonamu`)] },
    { h: 'ヨーロッパ Yōroppa · Europe', blocks: [WL(`
Austria|オーストリア|Ōsutoria
Belgium|ベルギー|Berugī
Bulgaria|ブルガリア|Burugaria
Croatia|クロアチア|Kuroachia
Czech|チェコ|Cheko
Denmark|デンマーク|Denmāku
Estonia|エストニア|Esutonia
Finland|フィンランド|Finrando
France|フランス|Furansu
Germany|ドイツ|Doitsu
Greece|ギリシャ|Girisha
Hungary|ハンガリー|Hangarī
Iceland|アイスランド|Aisurando
Ireland|アイルランド|Airurando
Israel|イスラエル|Isuraeru
Italy|イタリア|Itaria
Latvia|ラトビア|Ratobia
Lithuania|リトアニア|Ritoania
Luxembourg|ルクセンブルク|Rukusenburuku
Moldova|モルドバ|Morudoba
Netherlands|オランダ|Oranda
Norway|ノルウェー|Noruwē
Poland|ポーランド|Pōrando
Portugal|ポルトガル|Porutogaru
Romania|ルーマニア|Rūmania
Russian Federation|ロシア|Roshia
Spain|スペイン|Supein
Sweden|スウェーデン|Suwēden
Switzerland|スイス|Suisu
Ukraine|ウクライナ|Ukuraina
United Kingdom|イギリス|Igirisu`)] },
    { h: '北・中央・南アメリカ Kita / Chūō / Minami Amerika · North / Central / South America', blocks: [WL(`
Argentina|アルゼンチン|Aruzenchin
Brazil|ブラジル|Burajiru
Canada|カナダ|Kanada
Chile|チリ|Chiri
Colombia|コロンビア|Korombia
Costa Rica|コスタリカ|Kosutarika
Cuba|キューバ|Kyūba
Ecuador|エクアドル|Ekuadoru
Guatemala|グアテマラ|Guatemara
Jamaica|ジャマイカ|Jamaika
Mexico|メキシコ|Mekishiko
Paraguay|パラグアイ|Paraguai
Peru|ペルー|Perū
United States of America|アメリカ|Amerika
Uruguay|ウルグアイ|Uruguai
Venezuela|ベネズエラ|Benezuera`)] },
  ],
};
