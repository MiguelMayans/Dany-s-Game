import { useEffect, useState } from 'react';
import { LEVELS } from './data/levels';
import { KEYS, keyFor } from './game/letters';
import { useGame } from './game/useGame';
import { unlockAudio } from './audio/sounds';
import AlbumScreen from './screens/AlbumScreen';
import MenuScreen from './screens/MenuScreen';
import PlayScreen from './screens/PlayScreen';
import RoundEndScreen from './screens/RoundEndScreen';

export default function App() {
  const { state, settings, setSettings, press, start, repeatWord, goMenu, goAlbum } = useGame();
  const [flash, setFlash] = useState<{ key: string; n: number } | null>(null);
  const { screen, levelId } = state;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      unlockAudio();

      if (e.key === 'Escape') {
        goMenu();
        return;
      }

      if (screen === 'menu') {
        const level = LEVELS[Number(e.key) - 1];
        if (level) start(level.id);
        return;
      }

      if (screen === 'roundEnd' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        start(levelId);
        return;
      }

      if (screen !== 'playing') return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!e.repeat) repeatWord();
        return;
      }

      // Accented letters typed with dead keys (á) count as their base letter.
      const k = keyFor(e.key);
      if (KEYS.has(k) && !e.repeat) {
        e.preventDefault();
        setFlash(f => ({ key: k, n: (f?.n ?? 0) + 1 }));
        press(k);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, levelId, press, start, repeatWord, goMenu]);

  switch (screen) {
    case 'menu':
      return (
        <MenuScreen
          progress={state.progress}
          settings={settings}
          onSettings={setSettings}
          onStart={start}
          onAlbum={goAlbum}
        />
      );
    case 'album':
      return (
        <AlbumScreen progress={state.progress} settings={settings} onSettings={setSettings} onHome={goMenu} />
      );
    case 'roundEnd':
      return (
        <RoundEndScreen
          results={state.results}
          settings={settings}
          onSettings={setSettings}
          onAgain={() => start(levelId)}
          onHome={goMenu}
          onAlbum={goAlbum}
        />
      );
    case 'playing':
      return (
        <PlayScreen
          state={state}
          settings={settings}
          onSettings={setSettings}
          onPress={press}
          onRepeat={repeatWord}
          onHome={goMenu}
          flash={flash}
        />
      );
  }
}
