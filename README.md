# 🐻 Words with TOTO! — Dani's Game

> A typing game for a 5-year-old: look at the sticker, listen to the word, and press its letters one by one with Toto the teddy bear.

![Made with love for Dani](https://img.shields.io/badge/made%20with-%F0%9F%92%9C%20for%20Dani-ff6b6b?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind%20v4-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 🎮 How it plays

1. Pick a game on the menu (or press **1–4**).
2. A picture appears and Toto says the word out loud.
3. The word is built from wooden alphabet blocks. Each correct key paints the next block and Toto says the letter's name ("eme", "uve"…).
4. A wrong key just wobbles the block. After two misses on the same letter the right key glows on the keyboard and Toto says "busca la ge".
5. Finished word: confetti, a fanfare, 1–3 stars and the word's sticker goes into the album.
6. A round is **6 words**, then a summary with the stickers earned.

| Game | Words |
|------|-------|
| 🟡 **Cortitas** | Up to 4 letters (`sol`, `gato`, `mamá`) |
| 🟢 **Medianas** | 5–6 letters (`perro`, `conejo`) |
| 🔵 **Larguísimas** | 7+ letters (`mariposa`, `dinosaurio`) |
| 🩷 **Secretas** | Up to 5 letters, but the blocks are blank: listen and spell it |

Words are written correctly with accents (`papá`, `árbol`, `pingüino`), but accents never need to be typed: pressing `a` fills `á`. `ñ` is its own key.

Normal rounds prefer words whose sticker is still missing, so the album keeps growing; *Secretas* prefers words already practised.

### Stars

| Mistakes in the word | Stars |
|----|----|
| 0 | ⭐⭐⭐ |
| 1–2 | ⭐⭐ |
| 3+ | ⭐ |

The album keeps the best result per word.

### Keyboard shortcuts

- **1–4**: start a game from the menu
- **Space / Enter**: hear the word again (or play another round on the summary)
- **Esc**: back to the menu

---

## 🛠️ Development

```bash
pnpm install
pnpm dev       # http://localhost:5173
pnpm test      # game logic tests (Vitest)
pnpm build     # production build into /dist
pnpm lint
```

```
src/
├── data/
│   ├── words.ts        # every word: text with accents, emoji, sticker colour
│   └── levels.ts       # the 4 games and how a round is picked
├── game/
│   ├── state.ts        # reducer: key presses, stars, round flow
│   ├── useGame.ts      # wires state to sound, voice and confetti
│   ├── letters.ts      # accent-insensitive keys, Spanish letter names
│   └── storage.ts      # progress + settings in localStorage
├── audio/
│   ├── sounds.ts       # synthesized effects + background music (Web Audio)
│   └── speech.ts       # text-to-speech (Web Speech API)
├── components/         # Toto (SVG), keyboard, sticker, stars, icons
├── screens/            # Menu, Play, RoundEnd, Album
└── index.css           # tokens, wooden blocks, animations
```

To add a word, add one line to `src/data/words.ts`: its level is chosen automatically from its length.

---

## 💡 Notes for grown-ups

- Two separate toggles: **music** and **voice + sounds**. The music quietens while Toto is talking.
- The voice uses the browser's Spanish voice. On Linux you may need `speech-dispatcher` + `espeak-ng` (Chrome/Brave), or the voice will be silent.
- Progress (album and today's word count) is saved in the browser's `localStorage`.
- Respects `prefers-reduced-motion`.

---

Made with lots of love for Dani ❤️
