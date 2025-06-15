"use client";

import { useState, useEffect } from 'react';
import PokerTable from './PokerTable';
import PlayerCard from './PlayerCard';

export default function GameContent() {
  // Örnek kullanıcı verisi - gerçekte API'den gelecek
  const [players] = useState([
    { id: 1, name: 'Halil', hasVoted: true },
    { id: 1, name: 'Halil', hasVoted: true },
    { id: 1, name: 'Halil', hasVoted: true },
    { id: 1, name: 'Halil', hasVoted: true },
    { id: 1, name: 'Halil', hasVoted: true },
  ]);

  // Oyuncuları masa etrafına eşit dağıtmak için pozisyon hesaplama
  const calculatePlayerPositions = (playerCount) => {
    const positions = [];
    const centerX = 0;
    const centerY = 0;
    // Masa boyutları: 350px x 170px
    const tableWidth = 350;
    const tableHeight = 170;
    const offsetDistance = 100; // Masadan uzaklık

    for (let i = 0; i < playerCount; i++) {
      const angle = (i * 2 * Math.PI) / playerCount - Math.PI / 2; // Üstten başla
      
      // Masa şekline uygun eliptik dağılım
      const radiusX = (tableWidth / 2) + offsetDistance;
      const radiusY = (tableHeight / 2) + offsetDistance;
      
      const x = centerX + radiusX * Math.cos(angle);
      const y = centerY + radiusY * Math.sin(angle);
      
      positions.push({ x, y, angle });
    }
    
    return positions;
  };

  const playerPositions = calculatePlayerPositions(players.length);

  return (
    <div className="flex-1 flex items-center justify-center relative">
      <div className="relative w-[500px] h-[350px]">
        {/* Masa */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <PokerTable />
        </div>
        
        {/* Oyuncular */}
        {players.map((player, index) => {
          const position = playerPositions[index];
          return (
            <div
              key={player.id}
              className="absolute"
              style={{
                left: `50%`,
                top: `50%`,
                transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
              }}
            >
              <PlayerCard player={player} />
            </div>
          );
        })}
      </div>
    </div>
  );
} 