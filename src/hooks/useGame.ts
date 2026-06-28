import { useReducer, useEffect, useCallback, useRef } from 'react';
import type { Level, GameState, Spark } from '../types/game';
import { ACHIEVEMENTS } from '../types/game';
import { getWordsForLevel, shuffleArray } from '../utils/gameHelpers';
import { playCorrectNote, playWrongSound } from '../utils/sounds';
import { loadVoices, speakWord } from '../utils/speech';
import { gameReducer, initialState } from '../reducers/gameReducer';

const STORAGE_KEY = 'dan-game-progress-v2';

interface SavedProgress {
  date: string;
  streak: number;
  bestStreak: number;
  totalWordsToday: number;
  achievements: string[];
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function serializeState(state: GameState): string {
  return JSON.stringify({
    date: getToday(),
    streak: state.streak,
    bestStreak: state.bestStreak,
    totalWordsToday: state.totalWordsToday,
    achievements: Array.from(state.achievements),
  });
}

function deserializeState(raw: string | null): Partial<GameState> | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as SavedProgress;
    const today = getToday();
    return {
      streak: data.streak ?? 0,
      bestStreak: data.bestStreak ?? 0,
      totalWordsToday: data.date === today ? data.totalWordsToday ?? 0 : 0,
      achievements: new Set(data.achievements ?? []),
    };
  } catch {
    return null;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState, init => {
    const saved = deserializeState(localStorage.getItem(STORAGE_KEY));
    return saved
      ? { ...init, ...saved, screen: 'menu' as const }
      : init;
  });

  const sparkIdRef = useRef(0);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  });

  // Persist progress.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, serializeState(state));
    } catch {
      // Ignore storage errors (private mode, quota exceeded).
    }
  }, [state]);

  // Load voices once on mount.
  useEffect(() => {
    loadVoices();
  }, []);

  // Speak the current word when a new word appears.
  useEffect(() => {
    if (state.screen === 'playing' && state.word && state.pos === 0 && !state.success) {
      speakWord(state.word);
    }
  }, [state.screen, state.word, state.pos, state.success]);

  // UI cleanup effects.
  useEffect(() => {
    if (state.poppedIndex !== null) {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_POP' }), 240);
      return () => clearTimeout(t);
    }
  }, [state.poppedIndex]);

  useEffect(() => {
    if (state.wrong) {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_WRONG' }), 400);
      return () => clearTimeout(t);
    }
  }, [state.wrong]);

  useEffect(() => {
    if (state.success) {
      const t = setTimeout(() => dispatch({ type: 'NEXT_WORD' }), 2400);
      return () => clearTimeout(t);
    }
  }, [state.success]);

  const { totalWordsToday, streak, bestStreak, achievements } = state;

  // Achievement system.
  useEffect(() => {
    for (const achievement of ACHIEVEMENTS) {
      if (
        achievement.condition({ totalWordsToday, streak, bestStreak }) &&
        !achievements.has(achievement.id)
      ) {
        dispatch({ type: 'ADD_ACHIEVEMENT', id: achievement.id });
      }
    }
  }, [totalWordsToday, streak, bestStreak, achievements]);

  const startLevel = useCallback((level: Level) => {
    const entries = getWordsForLevel(level);
    const shuffled = shuffleArray(entries);
    const wordList = shuffled.map(e => e.word.toLowerCase());
    dispatch({ type: 'START_LEVEL', level, words: wordList });
  }, []);

  const handleKeyPress = useCallback((key: string) => {
    const current = stateRef.current;
    if (current.success) return;

    const expected = current.word[current.pos];
    if (!expected) return;

    if (key === expected) {
      playCorrectNote(current.pos);
      const newSparks: Spark[] = Array.from({ length: 4 }, () => ({
        id: sparkIdRef.current++,
        letterIndex: current.pos,
        offset: Math.floor(Math.random() * 44) - 22,
      }));
      dispatch({ type: 'KEY_PRESS', key, sparks: newSparks });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_SPARKS', ids: newSparks.map(s => s.id) });
      }, 660);
    } else {
      playWrongSound();
      dispatch({ type: 'KEY_PRESS', key });
    }
  }, []);

  const goMenu = useCallback(() => {
    dispatch({ type: 'GO_MENU' });
  }, []);

  return {
    state,
    startLevel,
    handleKeyPress,
    goMenu,
  };
}
