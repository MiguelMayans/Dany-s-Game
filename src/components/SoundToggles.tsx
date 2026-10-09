import type { Settings } from '../game/storage';
import { MusicIcon, SpeakerIcon } from './icons';

interface Props {
  settings: Settings;
  onChange: (s: Settings) => void;
}

export default function SoundToggles({ settings, onChange }: Props) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        className="toy-btn size-11 sm:size-12"
        aria-pressed={settings.music}
        aria-label="Música"
        title={settings.music ? 'Quitar la música' : 'Poner la música'}
        onClick={() => onChange({ ...settings, music: !settings.music })}
      >
        <MusicIcon off={!settings.music} />
      </button>
      <button
        type="button"
        className="toy-btn size-11 sm:size-12"
        aria-pressed={settings.sound}
        aria-label="Voz y sonidos"
        title={settings.sound ? 'Quitar la voz y los sonidos' : 'Poner la voz y los sonidos'}
        onClick={() => onChange({ ...settings, sound: !settings.sound })}
      >
        <SpeakerIcon off={!settings.sound} />
      </button>
    </div>
  );
}
