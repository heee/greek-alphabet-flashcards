# Greek Alphabet Flashcards

Swipeable, marble-inscription flashcards for the 24 letters of the Greek alphabet. It's a static PWA: you can install it on an iPhone home screen, and it works offline after the first load.

**Live:** https://heee.github.io/greek-alphabet-flashcards/

## Use

| Input | Action |
|---|---|
| Tap card / Enter / Space | Flip |
| Swipe up / ↑ | Got it (level +1, max 5) |
| Swipe down / ↓ | Missed (level −1) |
| Swipe left / ← | Previous card (history) |
| Swipe right / → | Skip |
| Tap the MASTERED bar | Open the Stoa (stats, export / import / reset) |

Each letter has two cards, capital and small (48 in all), drawn in weighted random order: weaker cards come up more often, and a card won't repeat within six draws. The Stoa combines both cases on one tile per letter.

Progress is saved in `localStorage` (`greekFlashcards.v1`) and can be exported or imported as JSON.

**Install on iPhone:** open the link in Safari → Share → Add to Home Screen.

## Develop

No build step. Serve the folder (for example, `python -m http.server`) and open it.
When you deploy changes, bump `CACHE` in `sw.js` so installed copies update.

Fonts: GFS Didot and Cinzel (SIL Open Font License), self-hosted from Google Fonts.
