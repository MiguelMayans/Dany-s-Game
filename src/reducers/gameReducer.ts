import type { GameState, GameAction } from '../types/game';

export const initialState: GameState = {
  screen: 'menu',
  level: null,
  word: '',
  pos: 0,
  wrong: false,
  wrongIndex: null,
  wrongCount: 0,
  wrongEmoji: '🙈',
  wrongMessage: '¡Casi!',
  success: false,
  poppedIndex: null,
  sparks: [],
  currentIndex: 0,
  levelWords: [],
  streak: 0,
  bestStreak: 0,
  totalWordsToday: 0,
  achievements: new Set(),
  newAchievements: [],
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_LEVEL': {
      const firstWord = action.words[0] ?? '';
      return {
        ...initialState,
        screen: 'playing',
        level: action.level,
        levelWords: action.words,
        word: firstWord,
        achievements: state.achievements,
        streak: state.streak,
        bestStreak: state.bestStreak,
        totalWordsToday: state.totalWordsToday,
      };
    }
    case 'KEY_PRESS': {
      if (state.success) return state;
      const expected = state.word[state.pos];
      if (!expected) return state;

      if (action.key === expected) {
        const nextPos = state.pos + 1;
        const isComplete = nextPos >= state.word.length;
        const newStreak = isComplete ? state.streak + 1 : state.streak;
        return {
          ...state,
          pos: nextPos,
          wrong: false,
          wrongIndex: null,
          wrongCount: 0,
          poppedIndex: state.pos,
          sparks: action.sparks ? [...state.sparks, ...action.sparks] : state.sparks,
          success: isComplete,
          streak: newStreak,
          bestStreak: isComplete ? Math.max(state.bestStreak, newStreak) : state.bestStreak,
          totalWordsToday: isComplete ? state.totalWordsToday + 1 : state.totalWordsToday,
        };
      }

      // No castigo: solo marcamos el fallo, la racha no se reinicia.
      return {
        ...state,
        wrong: true,
        wrongIndex: state.pos,
        wrongCount: state.wrongCount + 1,
        wrongEmoji: action.wrongEmoji ?? state.wrongEmoji,
        wrongMessage: action.wrongMessage ?? state.wrongMessage,
      };
    }
    case 'CLEAR_POP':
      return { ...state, poppedIndex: null };
    case 'CLEAR_WRONG':
      return { ...state, wrong: false, wrongIndex: null };
    case 'CLEAR_SPARKS':
      return { ...state, sparks: state.sparks.filter(s => !action.ids.includes(s.id)) };
    case 'CLEAR_NEW_ACHIEVEMENTS':
      return { ...state, newAchievements: [] };
    case 'NEXT_WORD': {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.levelWords.length) {
        return {
          ...state,
          screen: 'victory',
          success: false,
          poppedIndex: null,
          sparks: [],
        };
      }
      const nextWord = state.levelWords[nextIndex];
      return {
        ...state,
        word: nextWord,
        pos: 0,
        wrong: false,
        wrongIndex: null,
        wrongCount: 0,
        success: false,
        poppedIndex: null,
        sparks: [],
        currentIndex: nextIndex,
        newAchievements: [],
      };
    }
    case 'GO_MENU':
      return { ...state, screen: 'menu', newAchievements: [] };
    case 'ADD_ACHIEVEMENT': {
      if (state.achievements.has(action.id)) return state;
      const nextAchievements = new Set(state.achievements);
      nextAchievements.add(action.id);
      return {
        ...state,
        achievements: nextAchievements,
        newAchievements: [...state.newAchievements, action.id],
      };
    }
    default:
      return state;
  }
}
