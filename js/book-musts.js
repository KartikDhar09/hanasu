// Book tab page: musts. Loaded only when opened; see js/book-kit.js for the helpers.
import { N, W, L } from './book-kit.js';

export default {
  id: 'musts', icon: '⭐', title: 'Must-know words and phrases', jp: '絶対に覚えておきたい表現',
  sections: [
    { h: 'Survival Phrases', blocks: [
      L(['すみません。*', 'Sumimasen. *', 'Sorry. / Excuse me. / Thank you.']),
      N('* An all-purpose phrase that can be used when calling out to a person, apologizing, or thanking someone.'),
      L(['はい。／いいえ。', 'a) Hai. b) Iie.', 'a) Yes. b) No.'],
        ['そうです。／ちがいます。', 'a) Sō desu. b) Chigaimasu.', 'a) That’s right. b) That’s wrong. / No.'],
        ['英語は話せますか。', 'Eigo wa hanasemasu ka.', 'Do you speak English?'],
        ['英語が話せる人はいますか。', 'Eigo ga hanaseru hito wa imasu ka.', 'Is there anyone (here) who speaks English?'],
        ['わかりますか。', 'Q: Wakarimasu ka.', 'Q: Do you understand?'],
        ['わかります。／わかりません。', 'A: a) Wakarimasu. b) Wakarimasen.', 'A: a) I understand. b) I don’t understand.'],
        ['わかりましたか。', 'Q: Wakarimashita ka.', 'Q: Did you get that? / Did that make sense?'],
        ['わかりました。／わかりません。', 'A: a) Wakarimashita. b) Wakarimasen.', 'A: a) I got it. b) I don’t get it.'],
        ['日本語はわかりません。', 'Nihon-go wa wakarimasen.', 'I don’t understand Japanese.'],
        ['大丈夫ですか。', 'Q: Daijōbu desu ka.', 'Q: Are you alright?'],
        ['大丈夫です。', 'A: Daijōbu desu.', 'A: I’m alright.'],
        ['いいですか。', 'Q: Ii desu ka.', 'Q: Can I …? / Is it okay?'],
        ['どうぞ。／すみません、ちょっと……。', 'A: a) Dōzo. b) Sumimasen, chotto….', 'A: a) Please. / Okay. / Go ahead. b) Sorry, but….'],
        ['もう一度いいですか。', 'Mō ichido ii desu ka.', 'Would you say that one more time?']),
    ] },
    { h: 'Greetings', blocks: [
      L(['おはよう(ございます)。', 'Ohayō (gozaimasu).', 'Good morning.'],
        ['こんにちは。', 'Konnichiwa.', 'Hello. / Good afternoon.'],
        ['こんばんは。', 'Kombanwa.', 'Good evening.'],
        ['じゃ、また。', 'Ja, mata.', 'See you (later).'],
        ['ありがとう(ございます)。', 'Arigatō (gozaimasu).', 'Thank you (very much).'],
        ['いただきます。', 'Itadakimasu.', 'I humbly receive this food. [said before a meal]'],
        ['ごちそうさま(でした)。', 'Gochisōsama (deshita).', 'Thank you. [a set phrase said at the end of a meal]']),
    ] },
    { h: 'Helpful Words and Phrases', blocks: [
      L(['(お)元気ですか。*', '(O)genki desu ka. *', 'How are you?']),
      N('* Typically not asked to people seen on a daily basis.'),
      L(['元気です。', 'Genki desu.', 'I’m fine.'],
        ['がんばって(ください)。', 'Gambatte (kudasai).', 'Do your best. / Good luck. / Break a leg.'],
        ['どうぞ。', 'Dōzo.', 'Go ahead. / Please.'],
        ['どうも。', 'Dōmo.', 'Thanks. [casual]'],
        ['すごい', 'sugoi', 'Awesome / amazing / great / a lot'],
        ['本当', 'hontō', 'Really / true'],
        ['もちろん', 'mochiron', 'Of course']),
    ] },
    { h: 'Numbers', blocks: [
      W(['いち', 'ichi', '1'], ['に', 'ni', '2'], ['さん', 'san', '3'], ['よん／し', 'yon / shi', '4'], ['ご', 'go', '5'],
        ['ろく', 'roku', '6'], ['なな／しち', 'nana / shichi', '7'], ['はち', 'hachi', '8'], ['きゅう／く', 'kyū / ku', '9'], ['じゅう', 'jū', '10']),
    ] },
  ],
};
