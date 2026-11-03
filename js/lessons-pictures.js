// Lessons tab page: pictures. Loaded only when opened; see js/lessons-kit.js for the helpers.
import { N, WP } from './lessons-kit.js';

export default {
  id: 'pictures', title: 'Pictures: colors & Japanese food', jp: '写真資料',
  sections: [
    { h: '色 Iro · Colors', blocks: [
      N('* = I-adjective'),
      WP(['赤(い)*', 'aka(i)*', 'red'], ['青(い)*', 'ao(i)*', 'blue'], ['黄色(い)*', 'kiiro(i)*', 'yellow'], ['黒(い)*', 'kuro(i)*', 'black'],
        ['白(い)*', 'shiro(i)*', 'white'], ['緑', 'midori', 'green'], ['オレンジ', 'orenji', 'orange'], ['ピンク', 'pinku', 'pink'],
        ['黄緑', 'kimidori', 'yellow-green'], ['紺', 'kon', 'dark blue'], ['水色', 'mizuiro', 'light blue'], ['紫', 'murasaki', 'purple'],
        ['茶色／ブラウン', 'chairo / buraun', 'brown'], ['灰色／グレー', 'haiiro / gurē', 'gray']),
    ] },
    { h: '日本料理 Nihon ryōri · Japanese Food', blocks: [
      WP(['すき焼き', 'sukiyaki', 'beef and vegetables cooked in sweet-salty soy sauce'], ['しゃぶしゃぶ', 'shabu shabu', 'Japanese variant of hot pot'],
        ['焼肉', 'yakiniku', 'grilled meat'], ['焼き鳥', 'yakitori', 'grilled chicken skewers'], ['刺身', 'sashimi', 'raw fish'],
        ['天ぷら', 'tempura', 'deep-fried vegetables or seafood'], ['から揚げ', 'karaage', 'fried chicken'], ['しょうが焼き', 'shōgayaki', 'pork fried with ginger'],
        ['鶏の照り焼き', 'tori no teriyaki', 'chicken teriyaki'], ['肉じゃが', 'nikujaga', 'meat and potato stew'], ['おでん', 'oden', 'broth with egg, steamed fish cake etc.'],
        ['親子丼', 'oyako don', 'chicken and egg rice bowl'], ['牛丼', 'gyū don', 'beef rice bowl'], ['かつ丼', 'katsu don', 'pork cutlet rice bowl'],
        ['天丼', 'ten don', 'tempura rice bowl'], ['にぎりずし', 'nigiri zushi', 'sushi'], ['ちらしずし', 'chirashi zushi', 'sashimi or various toppings on sushi rice'],
        ['いなりずし', 'inari zushi', 'sushi rice-stuffed fried tofu'], ['のり巻き', 'norimaki', 'sushi roll'],
        ['きつねうどん', 'kitsune udon', 'thick white wheat noodles with deep-fried tofu'], ['たぬきうどん', 'tanuki udon', 'thick white wheat noodles with tempura batter'],
        ['天ぷらそば', 'tempura soba', 'buckwheat noodles with tempura'], ['ざるそば', 'zaru soba', 'cold soba with dipping sauce'],
        ['しょうゆラーメン', 'shōyu rāmen', 'soy sauce based ramen'], ['塩ラーメン', 'shio rāmen', 'salt based ramen'], ['味噌ラーメン', 'miso rāmen', 'miso based ramen'],
        ['とんこつラーメン', 'tonkotsu rāmen', 'pork bone based ramen'], ['焼きそば', 'yakisoba', 'fried noodles'],
        ['お好み焼き', 'okonomiyaki', 'Japanese pan-fried pizza with various ingredients'], ['もんじゃ焼き', 'monjayaki', 'thin Japanese pan-fried pizza with various ingredients'],
        ['たこ焼き', 'takoyaki', 'octopus dumpling'], ['冷奴', 'hiyayakko', 'cold tofu'], ['揚げ出し豆腐', 'agedashi dōfu', 'deep-fried tofu with broth'],
        ['枝豆', 'edamame', 'boiled soybeans'], ['卵焼き', 'tamagoyaki', 'fried rolled egg'], ['おにぎり', 'onigiri', 'rice ball'],
        ['お茶漬け', 'ochazuke', 'rice bowl filled with green tea'], ['味噌汁', 'misoshiru', 'miso soup'], ['とん汁', 'tonjiru', 'pork miso soup with vegetables']),
    ] },
    { h: '洋食 Yōshoku · Japanese Style Western Food', blocks: [
      WP(['コロッケ', 'korokke', 'croquette'], ['えびフライ', 'ebifurai', 'fried shrimp'], ['トンカツ', 'tonkatsu', 'pork cutlet'],
        ['ハンバーグ', 'hambāgu', 'hamburger meat'], ['カレーライス', 'karē raisu', 'curry with rice'], ['カツカレー', 'katsu karē', 'pork cutlet curry'],
        ['オムライス', 'omuraisu', 'fried omelette stuffed with rice'], ['ミートソース', 'mīto sōsu', 'spaghetti meat sauce']),
    ] },
    { h: '中華料理 Chūka ryōri · Chinese Food', blocks: [
      WP(['チャーハン', 'chāhan', 'fried rice'], ['餃子', 'gyōza', 'pot stickers'], ['春巻き', 'harumaki', 'spring roll'], ['シュウマイ', 'shūmai', 'steamed meat dumpling']),
    ] },
    { h: 'デザート Dezāto · Desserts', blocks: [
      WP(['ショートケーキ', 'shōtokēki', 'strawberry shortcake'], ['シュークリーム', 'shūkurīmu', 'cream puff']),
    ] },
    { h: '漬物 Tsukemono · Pickled Vegetables', blocks: [
      WP(['梅干', 'umeboshi', 'pickled plum', '梅干し'], ['たくあん', 'takuan', 'pickled daikon radish'], ['ふくじんづけ', 'fukujinzuke', 'pickled vegetables in soy sauce'],
        ['らっきょう', 'rakkyō', 'Japanese leek pickles'], ['キムチ', 'kimuchi', 'Korean style pickles']),
    ] },
    { h: '薬味 Yakumi · Condiments', blocks: [
      WP(['のり', 'nori', 'nori seaweed'], ['青のり', 'aonori', 'green nori seaweed'], ['かつおぶし', 'katsuobushi', 'sliced dried bonito'],
        ['紅しょうが', 'beni shōga', 'pickled ginger'], ['ごま', 'goma', 'sesame'], ['ねぎ', 'negi', 'green onion'], ['大根おろし', 'daikon oroshi', 'grated daikon radish'],
        ['七味(とうがらし)', 'shichimi (tōgarashi)', 'a mixture of red pepper and other spices', '七味とうがらし'], ['わさび', 'wasabi', 'wasabi'], ['からし', 'karashi', 'mustard']),
    ] },
    { h: 'その他の食材 Sonota no shokuzai · Other Foods', blocks: [
      WP(['納豆', 'nattō', 'fermented soybeans'], ['豆腐', 'tōfu', 'tofu'], ['油揚げ', 'abura age', 'deep-fried tofu'], ['かまぼこ', 'kamaboko', 'steamed fish cake'],
        ['こんにゃく', 'konnyaku', 'konjac potato gel'], ['わかめ', 'wakame', 'wakame seaweed'], ['こんぶ', 'kombu', 'kombu seaweed'],
        ['たらこ', 'tarako', 'salted cod roe'], ['明太子', 'mentaiko', 'spiced cod roe']),
    ] },
  ],
};
