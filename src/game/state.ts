import type { LevelId } from '../data/levels';
import type { Word } from '../data/words';
import { keyFor, lettersOf } from './letters';
import { localDay, type Progress } from './storage';

export type Screen = 'menu' | 'playing' | 'roundEnd' | 'album';

export interface RoundResult {
  word: Word;
  stars: number;
  /** First time this sticker was earned. */
  isNew: boolean;
}

export interface State {
  screen: Screen;
  levelId: LevelId;
  round: Word[];
  index: number;
  /** Letters already typed in the current word. */
  pos: number;
  /** Misses in the current word (decides the stars). */
  mistakes: number;
  /** Consecutive misses on the current letter (decides when to help). */
  missesHere: number;
  /** Bumped on every miss so the shake animation restarts each time. */
  missTick: number;
  solved: boolean;
  results: RoundResult[];
  progress: Progress;
}

export type Action =
  | { type: 'start'; levelId: LevelId; round: Word[] }
  | { type: 'press'; key: string }
  | { type: 'next' }
  | { type: 'menu' }
  | { type: 'album' };

/** Misses on one letter before the right key starts glowing. */
export const HINT_AFTER = 2;

export function starsFor(mistakes: number): number {
  if (mistakes === 0) return 3;
  if (mistakes <= 2) return 2;
  return 1;
}

export function initialState(progress: Progress): State {
  return {
    screen: 'menu',
    levelId: 'cortas',
    round: [],
    index: 0,
    pos: 0,
    mistakes: 0,
    missesHere: 0,
    missTick: 0,
    solved: false,
    results: [],
    progress,
  };
}

export function currentWord(state: State): Word | undefined {
  return state.round[state.index];
}

/** The key that has to be pressed next, or null if nothing is expected. */
export function expectedKey(state: State): string | null {
  const word = currentWord(state);
  if (state.screen !== 'playing' || state.solved || !word) return null;
  const ch = lettersOf(word.text)[state.pos];
  return ch ? keyFor(ch) : null;
}

const freshWord = { pos: 0, mistakes: 0, missesHere: 0, solved: false };

function recordWin(progress: Progress, word: Word, stars: number): Progress {
  const day = localDay();
  const prevBest = progress.stickers[word.text] ?? 0;
  return {
    stickers: { ...progress.stickers, [word.text]: Math.max(prevBest, stars) },
    day,
    today: (progress.day === day ? progress.today : 0) + 1,
  };
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'start':
      return {
        ...state,
        ...freshWord,
        screen: 'playing',
        levelId: action.levelId,
        round: action.round,
        index: 0,
        results: [],
      };

    case 'press': {
      const expected = expectedKey(state);
      const word = currentWord(state);
      if (!expected || !word) return state;

      if (action.key !== expected) {
        return {
          ...state,
          mistakes: state.mistakes + 1,
          missesHere: state.missesHere + 1,
          missTick: state.missTick + 1,
        };
      }

      const pos = state.pos + 1;
      if (pos < lettersOf(word.text).length) {
        return { ...state, pos, missesHere: 0 };
      }

      const stars = starsFor(state.mistakes);
      return {
        ...state,
        pos,
        missesHere: 0,
        solved: true,
        results: [
          ...state.results,
          { word, stars, isNew: state.progress.stickers[word.text] === undefined },
        ],
        progress: recordWin(state.progress, word, stars),
      };
    }

    case 'next': {
      if (!state.solved) return state;
      const index = state.index + 1;
      if (index >= state.round.length) {
        return { ...state, screen: 'roundEnd' };
      }
      return { ...state, ...freshWord, index };
    }

    case 'menu':
      return { ...state, screen: 'menu' };

    case 'album':
      return { ...state, screen: 'album' };
  }
}
