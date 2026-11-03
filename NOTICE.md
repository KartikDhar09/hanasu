# What the licence covers

Everything in this repository is under the MIT licence in [LICENSE](LICENSE), **except** the files below.
They belong to other people, so the MIT licence cannot be given for them. Each keeps its own terms.

## Not licensed: third-party lesson material (all rights reserved by its publisher)

The Lessons tab holds a personal study copy of a published Japanese course. It is not Kartik Dhar's work, and
no rights to copy, share or reuse any of it are granted here.

- `js/lessons-*.js`, except `js/lessons.js`, `js/lessons-kit.js` and `js/lessons-data.js` (the screen code that
  shows the pages, which is MIT)
- `img/lessons/` (pictures cropped from that material)
- The listening answer key in the Lessons section of `scripts/check.mjs` (the code around it is MIT)

## Voice clips: VOICEVOX terms

`audio/` holds clips made with VOICEVOX (https://voicevox.hiroshiba.jp) using the voices 四国めたん, 冥鳴ひまり
and 青山龍星. They are not under the MIT licence: each voice has its own terms of use set by its owner, and
every use needs the credit "VOICEVOX:<voice name>". Some clips are lines from the lesson material above. The
scripts that make the clips (`scripts/make-audio.mjs`, `scripts/audio-texts.mjs`) are MIT.

## Third-party data and icons

| Files | Source | Licence |
|---|---|---|
| `strokes/` | KanjiVG © Ulrich Apel | CC BY-SA 3.0 (changes stay under CC BY-SA 3.0) |
| `js/kanji-readings.js` | KANJIDIC2 © Electronic Dictionary Research and Development Group | CC BY-SA 4.0 (changes stay under CC BY-SA 4.0) |
| `js/icons.js` and the inline icons in `index.html` | Lucide © Lucide Contributors, portions © Cole Bemis (Feather) | ISC / MIT |

The generator scripts for these files (`scripts/strokes.mjs`, `scripts/kanji-readings.mjs`, `scripts/icons.mjs`)
are MIT.
