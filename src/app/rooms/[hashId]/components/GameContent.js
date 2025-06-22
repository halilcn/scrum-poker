"use client";

import { useState, useEffect, useRef } from "react";
import PokerTable from "./PokerTable";
import PlayerCard from "./PlayerCard";
import EmojiThrower from "./EmojiThrower";
import { motion, AnimatePresence } from "framer-motion";
import { useRoom } from "@/app/rooms/[hashId]/context/RoomContext";

export default function GameContent() {
  const { participants } = useRoom();
  const playerRefs = useRef({});

  // Firebase'den gelen participants'ı array'e çevir ve sadece active olanları al
  const players = Object.values(participants || {}).filter(
    (player) => player.isActive
  );

  // Her oyuncu için ref oluştur
  useEffect(() => {
    players.forEach((player) => {
      if (!playerRefs.current[player.userId]) {
        playerRefs.current[player.userId] = { current: null };
      }
    });
  }, [players]);

  // Oyuncuları masa etrafına eşit dağıtmak için pozisyon hesaplama
  const calculatePlayerPositions = (playerCount) => {
    const positions = [];

    if (playerCount === 0) return positions;

    // Masa boyutları ve merkez
    const centerX = 0;
    const centerY = 0;
    const tableWidth = 300;
    const tableHeight = 120;
    const offsetDistance = 110; // Masadan uzaklık (biraz azalttım)

    for (let i = 0; i < playerCount; i++) {
      // Açıyı düzgün dağıt - üstten başlayarak saat yönünde
      const angle = (i * 2 * Math.PI) / playerCount - Math.PI / 2;

      // Eliptik pozisyon hesaplama
      const radiusX = tableWidth / 2 + offsetDistance;
      const radiusY = tableHeight / 2 + offsetDistance;

      const x = centerX + radiusX * Math.cos(angle);
      const y = centerY + radiusY * Math.sin(angle);

      positions.push({
        x: Math.round(x),
        y: Math.round(y),
        angle: angle,
      });
    }

    return positions;
  };

  const playerPositions = calculatePlayerPositions(players.length);

  return (
    <>
      <EmojiThrower playerRefs={playerRefs.current} />

      <div className="flex items-center justify-center">
        <div className="relative w-[700px] h-[500px]">
          {/* Masa */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <PokerTable />
          </div>

          {/* Oyuncular */}
          <AnimatePresence>
            {players.map((player, index) => {
              const position = playerPositions[index];
              return (
                <motion.div
                  key={player.userId}
                  className="absolute"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: position.x,
                    y: position.y,
                    transition: { type: "spring", stiffness: 300, damping: 30 },
                  }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  style={{
                    left: `320px`,
                    top: `200px`,
                    transform: `translate(-50%, -50%)`,
                    zIndex: 2,
                  }}
                  layout
                >
                  <PlayerCard
                    ref={(el) => {
                      if (playerRefs.current[player.userId]) {
                        playerRefs.current[player.userId].current = el;
                      }
                    }}
                    player={player}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
