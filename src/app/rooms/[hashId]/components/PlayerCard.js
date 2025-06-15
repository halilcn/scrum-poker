"use client";

import PlayingCard from './PlayingCard';
import { COLORS } from '@/constants';

export default function PlayerCard({ player }) {
  return (
    <div className="flex flex-col items-center gap-2 p-2">
      {/* Kart Alanı */}
      <div>
        <PlayingCard isRevealed={false} value={player.vote} />
      </div>
      
      {/* Kullanıcı İsmi */}
      <div className="text-center">
        <p className="text-sm font-medium" style={{ color: COLORS.gray800 }}>
          {player.name}
        </p>
      </div>
    </div>
  );
} 