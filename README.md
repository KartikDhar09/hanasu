# Hanasu 話す

A PWA for learning to **speak** Japanese fast: N5 everyday conversation and office Japanese.

- 24 units (8 everyday, 8 office, 8 corporate), 200 phrases, a role-play dialogue per unit
- Learn: new phrases introduced with audio, then English → Japanese recall with spaced repetition
- Speak: the mic checks your pronunciation (Web Speech API, Chrome/Safari)
- Quiz: listening and "how do you say…" multiple choice
- Role-play: the app speaks one side, you speak the other
- Works offline; progress stays on the device (localStorage)

Run locally: `npm run dev` → http://localhost:8080. Test: `npm test`.
Content lives in `js/data.js`. Bump `CACHE` in `sw.js` on each release.
