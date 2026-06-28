# 🐻 Words with TOTO! — Dani's Game

> A word game for learning, playing, and tapping letters with Toto the little bear.

![Made with love for Dani](https://img.shields.io/badge/made%20with-%F0%9F%92%9C%20for%20Dani-ff6b6b?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind%20v4-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 🎮 What is this?

**Words with TOTO!** is a super colorful web game made so Dani can practice words in a fun way. Each word appears with an illustration, and Dani just has to press the letters in the right order. If correct, the letter explodes with sparkles and plays a musical note! If wrong… a friendly "boing" lets them know that wasn't it.

There is confetti 🎉, achievements 🏆, streaks 🔥, and even an animated little bear named **Toto** who celebrates every victory.

---

## ✨ Main Features

- 🐻 **Toto the bear** welcomes you and dances while you play.
- 🖼️ **One image per word**: cars, animals, fruits, dinosaurs, rockets…
- 🔊 **Sounds generated on the fly**: little bells when correct, "boing" when wrong, and fanfares when a word is completed.
- 🗣️ **Text-to-speech**: every word is read aloud automatically and can be replayed.
- ⌨️ **Two ways to play**: tap the on-screen keyboard or use the real keyboard.
- 🏅 **Achievements and streaks**: Novice, Expert, Master, streaks of 3, 5, 10…
- 💾 **Progress saved**: localStorage remembers how many words you completed today and your best streak.
- 🌈 **Cartoon-style design**: thick borders, shadows, pastel colors, and lots of joy.

---

## 🚀 How to Play

1. Open the page and say hi to Toto 🐻
2. Choose a level:
   - 🟡 **Level 1**: short and easy words (`sol`, `gato`, `casa`, `pelota`…)
   - 🔵 **Level 2**: slightly harder words (`elefante`, `mariposa`, `cohete`, `dinosaurio`…)
3. Look at the picture and listen to the word.
4. Press the first letter, then the second… until the whole word is complete!
5. When finished, Toto celebrates with confetti and music 🎊

---

## 🛠️ Tech Stack

| Technology | What it's for |
|------------|---------------|
| ⚛️ **React 19** + **Vite** | The super-fast UI |
| 🔷 **TypeScript** | To avoid typos in letters |
| 🎨 **Tailwind CSS v4** | All the colors and animations |
| 🎊 **canvas-confetti** | Confetti party time! |
| 🎵 **Web Audio API** | Music and effects without sound files |
| 🗣️ **Web Speech API** | Reads words aloud |

---

## 📦 Installation & Development

> You need [Node.js](https://nodejs.org/) installed (recommended: v20 or higher) and preferably `pnpm`.

```bash
# 1. Install dependencies
pnpm install

# 2. Start the game in development mode
pnpm dev

# 3. Open the link shown (usually http://localhost:5173)
```

Other useful commands:

```bash
pnpm build     # Build the production version into /dist
pnpm preview   # Preview the production build
pnpm lint      # Check that everything is tidy
```

---

## 🗂️ Project Structure

```
dans-game/
├── public/images/          # 🖼️ Drawings for each word (SVG)
├── src/
│   ├── components/         # 🧩 Screens and buttons
│   │   ├── Game.tsx        # Main game screen
│   │   ├── StartScreen.tsx # Menu with Toto
│   │   ├── VictoryScreen.tsx # Level completed!
│   │   └── ui/             # Buttons, cards, letters, keyboard, and Toto
│   ├── data/words.ts       # 📚 All words per level
│   ├── hooks/useGame.ts    # 🎮 Game logic + saved progress
│   ├── reducers/gameReducer.ts # Rules for what happens when letters are pressed
│   ├── utils/
│   │   ├── sounds.ts       # 🎼 Music and effects
│   │   ├── speech.ts       # 🗣️ Voice
│   │   └── gameHelpers.ts  # 🔧 Shuffle helpers
│   ├── types/game.ts       # Types and achievements
│   └── index.css           # 🌈 Colors and animations
└── package.json
```

---

## 🎯 Achievements You Can Unlock

| Achievement | How to earn it |
|-------------|----------------|
| 🥉 Novice | Complete 5 words in total |
| 🥈 Expert | Complete 20 words in total |
| 🥇 Master | Complete 50 words in total |
| 🔥 Streak of 3 | 3 words in a row without mistakes |
| ⚡ Streak of 5 | 5 words in a row without mistakes |
| 🌟 Streak of 10 | 10 words in a row without mistakes |
| 🏆 Best streak 10 | Reach a streak of 10 |

---

## 💡 Notes for Grown-ups

- The game saves progress in the browser (`localStorage`), so if Dani comes back tomorrow, today's word count is still there.
- No external audio files: everything is generated with code, so no need to worry about missing files.
- The game respects `prefers-reduced-motion`: if the system asks for less motion, animations turn off automatically.

---

## 🧒 A Note for Dani

> "Hi Dani! Toto has prepared a bunch of words for you. How many achievements can you unlock today? Let's play! 🐻🎉"

---

Made with lots of love for Dani ❤️
