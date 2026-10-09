import type { RoundResult } from '../game/state';
import type { Settings } from '../game/storage';
import SoundToggles from '../components/SoundToggles';
import Stars from '../components/Stars';
import Sticker from '../components/Sticker';
import Toto from '../components/Toto';
import { StarIcon, AlbumIcon, HomeIcon, PlayIcon } from '../components/icons';

interface Props {
  results: RoundResult[];
  settings: Settings;
  onSettings: (s: Settings) => void;
  onAgain: () => void;
  onHome: () => void;
  onAlbum: () => void;
}

export default function RoundEndScreen({ results, settings, onSettings, onAgain, onHome, onAlbum }: Props) {
  const total = results.reduce((sum, r) => sum + r.stars, 0);

  return (
    <div className="flex min-h-dvh flex-col items-center px-4 pb-8">
      <header className="flex w-full max-w-4xl justify-end pt-3">
        <SoundToggles settings={settings} onChange={onSettings} />
      </header>

      <Toto mood="party" size="min(22dvh, 36vw, 170px)" />
      <h1 className="anim-pop-in mt-2 text-center text-[min(9vw,48px)] font-bold leading-tight">¡Bravo, Dani!</h1>
      <p
        className="anim-pop-in mt-1 flex items-center gap-2 text-[min(7vw,34px)] font-semibold [animation-delay:200ms]"
      >
        <StarIcon size={44} />
        {total} estrellas
      </p>

      <ul className="mt-[4dvh] grid max-w-3xl grid-cols-3 gap-x-4 gap-y-5 sm:grid-cols-6">
        {results.map((r, i) => (
          <li
            key={r.word.text}
            className="anim-pop-in relative flex flex-col items-center gap-1"
            style={{ animationDelay: `${300 + i * 110}ms` }}
          >
            <Sticker word={r.word} size="min(24vw, 104px)" tilt={[-4, 3, -2, 5, -3, 2][i % 6]} />
            {r.isNew && (
              <span className="absolute -top-2 -right-2 rotate-12 rounded-full border-2 border-ink bg-berry px-2 text-sm font-bold text-white">
                Nueva
              </span>
            )}
            <span className="text-lg font-semibold">{r.word.text}</span>
            <Stars count={r.stars} size={22} />
          </li>
        ))}
      </ul>

      <div className="mt-[5dvh] flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onAgain} className="toy-btn bg-leaf! px-8 py-4 text-3xl [--depth:7px]" autoFocus>
          <PlayIcon size={34} />
          Otra ronda
        </button>
        <button type="button" onClick={onAlbum} className="toy-btn px-5 py-4 text-xl">
          <AlbumIcon />
          Álbum
        </button>
        <button type="button" onClick={onHome} className="toy-btn px-5 py-4 text-xl">
          <HomeIcon />
          Inicio
        </button>
      </div>
    </div>
  );
}
