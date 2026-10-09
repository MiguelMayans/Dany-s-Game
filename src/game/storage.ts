export interface Progress {
  /** Best stars (1–3) earned per word; a word in here is a sticker in the album. */
  stickers: Record<string, number>;
  /** Local date (YYYY-MM-DD) that `today` refers to. */
  day: string;
  /** Words completed on `day`. */
  today: number;
}

export interface Settings {
  music: boolean;
  /** Voice and sound effects. */
  sound: boolean;
}

const PROGRESS_KEY = 'dani-palabras-progress-v3';
const SETTINGS_KEY = 'dani-palabras-settings-v1';

export function localDay(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function read<T>(key: string): Partial<T> | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Partial<T>) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or storage full: the game still works, it just forgets.
  }
}

export function loadProgress(): Progress {
  const saved = read<Progress>(PROGRESS_KEY);
  const day = localDay();
  return {
    stickers: saved?.stickers ?? {},
    day,
    today: saved?.day === day ? (saved.today ?? 0) : 0,
  };
}

export function saveProgress(p: Progress): void {
  write(PROGRESS_KEY, p);
}

export function loadSettings(): Settings {
  const saved = read<Settings>(SETTINGS_KEY);
  return { music: saved?.music ?? true, sound: saved?.sound ?? true };
}

export function saveSettings(s: Settings): void {
  write(SETTINGS_KEY, s);
}
