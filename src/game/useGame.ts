import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { getLevel, pickRound, type LevelId } from '../data/levels';
import { playCorrectNote, playSuccessJingle, playWrongSound, setMusicOn, setSoundOn, unlockAudio } from '../audio/sounds';
import { loadVoices, speakLetter, speakPhrase, speakWord, stopSpeaking } from '../audio/speech';
import { letterName } from './letters';
import { HINT_AFTER, currentWord, expectedKey, initialState, reducer, type Action, type State } from './state';
import { loadProgress, loadSettings, saveProgress, saveSettings, type Settings } from './storage';

/** Time to enjoy a finished word before the next one appears. */
const NEXT_WORD_DELAY = 3000;

const PRAISE = ['¡Muy bien!', '¡Genial, Dani!', '¡Bravo!', '¡Lo has conseguido!', '¡Qué bien escribes!'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function celebrate(): void {
  const colors = ['#ef5b6b', '#ffc83d', '#3f8fe0', '#4cbf7f', '#ffffff'];
  const base = { colors, disableForReducedMotion: true, ticks: 180, scalar: 1.1 };
  confetti({ ...base, particleCount: 70, spread: 70, startVelocity: 42, angle: 60, origin: { x: 0, y: 0.75 } });
  confetti({ ...base, particleCount: 70, spread: 70, startVelocity: 42, angle: 120, origin: { x: 1, y: 0.75 } });
}

export function useGame() {
  const [state, rawDispatch] = useReducer(reducer, undefined, () => initialState(loadProgress()));
  const [settings, setSettings] = useState<Settings>(loadSettings);

  // Mirror of the latest state, updated synchronously on every dispatch so two
  // very quick key presses never both read the same (stale) letter.
  const stateRef = useRef<State>(state);
  const dispatch = useCallback((action: Action) => {
    stateRef.current = reducer(stateRef.current, action);
    rawDispatch(action);
  }, []);

  useEffect(() => {
    saveProgress(state.progress);
  }, [state.progress]);

  useEffect(() => {
    setSoundOn(settings.sound);
    setMusicOn(settings.music);
    if (!settings.sound) stopSpeaking();
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    loadVoices();
  }, []);

  const word = currentWord(state);

  // Say every new word once it is on screen.
  useEffect(() => {
    if (state.screen !== 'playing' || !word) return;
    const t = setTimeout(() => speakWord(word.text), 450);
    return () => clearTimeout(t);
  }, [state.screen, word]);

  // Move on after a finished word.
  useEffect(() => {
    if (!state.solved || state.screen !== 'playing') return;
    const t = setTimeout(() => dispatch({ type: 'next' }), NEXT_WORD_DELAY);
    return () => clearTimeout(t);
  }, [state.solved, state.screen, dispatch]);

  // End of round.
  const roundStars = state.results.reduce((sum, r) => sum + r.stars, 0);
  useEffect(() => {
    if (state.screen !== 'roundEnd') return;
    playSuccessJingle();
    const t = setTimeout(() => speakPhrase(`¡Bravo, Dani! Has ganado ${roundStars} estrellas.`), 700);
    return () => clearTimeout(t);
  }, [state.screen, roundStars]);

  const press = useCallback(
    (key: string) => {
      unlockAudio();
      const before = stateRef.current;
      const expected = expectedKey(before);
      if (!expected) return;

      dispatch({ type: 'press', key });
      const after = stateRef.current;

      if (key !== expected) {
        playWrongSound();
        if (after.missesHere === HINT_AFTER) {
          speakPhrase(`Busca la ${letterName(expected)}`);
        }
        return;
      }

      playCorrectNote(before.pos);
      if (after.solved) {
        playSuccessJingle();
        celebrate();
        speakPhrase(`¡${currentWord(after)?.text}! ${pick(PRAISE)}`);
      } else {
        speakLetter(key);
      }
    },
    [dispatch],
  );

  const start = useCallback(
    (levelId: LevelId) => {
      unlockAudio();
      const level = getLevel(levelId);
      dispatch({ type: 'start', levelId, round: pickRound(level, stateRef.current.progress.stickers) });
    },
    [dispatch],
  );

  const repeatWord = useCallback(() => {
    unlockAudio();
    const w = currentWord(stateRef.current);
    if (w) speakWord(w.text);
  }, []);

  const goMenu = useCallback(() => {
    stopSpeaking();
    dispatch({ type: 'menu' });
  }, [dispatch]);

  const goAlbum = useCallback(() => {
    unlockAudio();
    stopSpeaking();
    dispatch({ type: 'album' });
  }, [dispatch]);

  return { state, settings, setSettings, press, start, repeatWord, goMenu, goAlbum };
}
