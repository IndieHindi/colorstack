'use client';

import { GameProvider } from './context/GameContext';
import GameUI from './components/GameUI';

export default function Home() {
  return (
    <main className="min-h-screen">
      <GameProvider>
        <GameUI />
      </GameProvider>
    </main>
  );
}
