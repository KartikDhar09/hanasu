# What the licence covers

Everything in this repository is under the MIT licence in [LICENSE](LICENSE), **except** the files below.
They belong to other people, so the MIT licence cannot be given for them. Each keeps its own terms.

## Not licensed: the textbook (all rights reserved by its publisher)

*Nihongo Fun & Easy: Survival Japanese Conversation for Beginners* (Ogata Yukiko, ASK Publishing,
ISBN 978-4-87217-721-3). The Book tab holds a personal study copy of it. No rights to copy, share or reuse
any of it are granted here.

- `js/book-*.js`, except `js/book.js`, `js/book-kit.js` and `js/book-data.js` (the screen code that shows the
  book, which is MIT)
- `img/book/` (pictures cropped from the book)
- The listening answer key in the Book section of `scripts/check.mjs` (the code around it is MIT)

## Voice clips: VOICEVOX terms

`audio/` holds clips made with VOICEVOX (https://voicevox.hiroshiba.jp) using the voices 四国めたん, 冥鳴ひまり
and 青山龍星. They are not under the MIT licence: each voice has its own terms of use set by its owner, and
every use needs the credit "VOICEVOX:<voice name>". Some clips are lines from the textbook above. The scripts
that make the clips (`scripts/make-audio.mjs`, `scripts/audio-texts.mjs`) are MIT.

## Third-party data and icons

| Files | Source | Licence |
|---|---|---|
| `strokes/` | KanjiVG © Ulrich Apel | CC BY-SA 3.0 (changes stay under CC BY-SA 3.0) |
| `js/kanji-readings.js` | KANJIDIC2 © Electronic Dictionary Research and Development Group | CC BY-SA 4.0 (changes stay under CC BY-SA 4.0) |
| `js/icons.js` and the inline icons in `index.html` | Lucide © Lucide Contributors, portions © Cole Bemis (Feather) | ISC / MIT |

The generator scripts for these files (`scripts/strokes.mjs`, `scripts/kanji-readings.mjs`, `scripts/icons.mjs`)
are MIT.
