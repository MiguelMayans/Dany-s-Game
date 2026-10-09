import { letterName } from '../game/letters';
import { duckMusic, isSoundOn } from './sounds';

let voicesReady = false;
let spanishVoice: SpeechSynthesisVoice | null = null;
// Keep a reference so the utterance isn't garbage-collected mid-speech (Chrome bug).
let currentUtterance: SpeechSynthesisUtterance | null = null;
// Pending delayed speak (cancel+speak in the same tick is unreliable in Chrome).
let speakTimer: number | null = null;
let watchdogStarted = false;

// Chrome can silently pause synthesis after inactivity; nudge it periodically.
function startWatchdog(): void {
  if (watchdogStarted || typeof window === 'undefined' || !window.speechSynthesis) return;
  watchdogStarted = true;
  window.setInterval(() => {
    try {
      window.speechSynthesis.resume();
    } catch {
      /* ignore */
    }
  }, 8000);
}

function isSpanish(voice: SpeechSynthesisVoice): boolean {
  return voice.lang.toLowerCase().startsWith('es');
}

function pickSpanishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const spanish = voices.filter(isSpanish);
  // Prefer a locally-installed voice: network voices (e.g. Google's) can fail silently.
  return spanish.find(v => v.localService) ?? spanish[0] ?? null;
}

function refreshVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return;

  voicesReady = true;
  spanishVoice = pickSpanishVoice(voices);

  if (import.meta.env.DEV) {
    console.log('[speech] voices loaded:', voices.length, spanishVoice?.name ?? 'no Spanish voice');
  }
}

export function loadVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  startWatchdog();
  refreshVoices();

  window.speechSynthesis.onvoiceschanged = () => {
    refreshVoices();
  };

  // Some browsers need a small nudge before voices become available.
  if (!voicesReady) {
    setTimeout(refreshVoices, 100);
    setTimeout(refreshVoices, 500);
    if (import.meta.env.DEV && window.speechSynthesis.getVoices().length === 0) {
      console.warn(
        '[speech] no TTS voices found. On Linux you may need speech-dispatcher + espeak-ng.',
      );
    }
  }
}

function ensureVoices(): void {
  if (!voicesReady) {
    refreshVoices();
  }
}

function speak(text: string, rate = 0.9, pitch = 1.05): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  if (!isSoundOn()) return;

  try {
    ensureVoices();
    const synth = window.speechSynthesis;
    synth.cancel();
    if (speakTimer !== null) {
      clearTimeout(speakTimer);
      speakTimer = null;
    }

    const make = (voice: SpeechSynthesisVoice | null): SpeechSynthesisUtterance => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES';
      u.rate = rate;
      u.pitch = pitch;
      if (voice) u.voice = voice;
      return u;
    };

    const utterance = make(spanishVoice);
    currentUtterance = utterance;
    utterance.onstart = () => duckMusic(true);
    utterance.onend = () => {
      if (currentUtterance === utterance) currentUtterance = null;
      duckMusic(false);
    };
    utterance.onerror = event => {
      duckMusic(false);
      if (import.meta.env.DEV) {
        console.warn('[speech] error:', event.error);
      }
      // If the chosen voice failed (e.g. a network voice), retry once with the default voice.
      if (utterance.voice && event.error !== 'canceled' && event.error !== 'interrupted') {
        try {
          const retry = make(null);
          currentUtterance = retry;
          retry.onstart = () => duckMusic(true);
          retry.onend = () => {
            if (currentUtterance === retry) currentUtterance = null;
            duckMusic(false);
          };
          synth.speak(retry);
        } catch {
          /* ignore */
        }
      }
    };

    // Small delay after cancel(): speaking in the same tick as cancel() can
    // silently drop the utterance in some browsers.
    speakTimer = window.setTimeout(() => {
      speakTimer = null;
      synth.resume();
      synth.speak(utterance);
    }, 40);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[speech] speak failed:', error);
    }
  }
}

export function speakWord(word: string): void {
  speak(word, 0.8, 1.05);
}

/** Says the letter's name ("eme", "uve", "i griega"). */
export function speakLetter(letter: string): void {
  speak(letterName(letter), 0.95, 1.05);
}

export function speakPhrase(phrase: string): void {
  speak(phrase, 0.9, 1.1);
}

export function stopSpeaking(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  if (speakTimer !== null) {
    clearTimeout(speakTimer);
    speakTimer = null;
  }
  window.speechSynthesis.cancel();
  duckMusic(false);
}
