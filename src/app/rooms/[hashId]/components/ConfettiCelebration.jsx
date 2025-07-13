"use client";

import { useEffect, useState, useRef } from "react";
import { useRoom } from "@/app/rooms/[hashId]/context/RoomContext";
import { TIMING } from "@/constants";
import { checkVotingConsensus } from "@/utils/checkVotingConsensus";
import Confetti from "react-confetti";

export default function ConfettiCelebration() {
  const { participants, status } = useRoom();
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState(150);
  const [confettiOpacity, setConfettiOpacity] = useState(1);
  const previousStatusRef = useRef(status);
  const isMountedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  // Table dimensions - fixed size
  const tableWidth = 300;
  const tableHeight = 145;

  useEffect(() => {
    // Set initial status on mount
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      previousStatusRef.current = status;
      return;
    }

    // Status değişimini kontrol et (voting -> completed geçişinde)
    if (
      previousStatusRef.current === "voting" &&
      status === "completed" &&
      mounted
    ) {
      // Check if all users voted the same using utility function
      const { hasConsensus } = checkVotingConsensus(participants);
      
      if (hasConsensus) {
        // 5 saniye bekle (kartlar açıldıktan sonra konfeti göster)
        setTimeout(() => {
          setShowConfetti(true);
          setConfettiPieces(150);
          setConfettiOpacity(1);
          
          // Konfeti'yi yumuşak bir şekilde bitir
          setTimeout(() => {
            // Önce yeni parçacık gelmesini durdur
            setConfettiPieces(0);
            
            // Sonra 1 saniye içinde opacity'yi azalt
            setTimeout(() => {
              setConfettiOpacity(0);
              
              // Tamamen kaybolunca kapat
              setTimeout(() => {
                setShowConfetti(false);
                setConfettiOpacity(1); // Reset for next time
              }, 1000);
            }, 1000);
          }, TIMING.CONFETTI_DURATION);
        }, TIMING.CARD_REVEAL_DELAY);
      }
    }

    // Update previous status
    previousStatusRef.current = status;
  }, [status, participants, mounted]);

  // Hide confetti when status changes to voting (new round starts)
  useEffect(() => {
    if (status === "voting") {
      setShowConfetti(false);
      setConfettiPieces(150);
      setConfettiOpacity(1);
    }
  }, [status]);

  // Mounted state - TableContent.js'teki gibi
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 1000);
  }, []);

  if (!showConfetti) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-10 rounded-[42px] overflow-hidden transition-opacity duration-1000"
      style={{ opacity: confettiOpacity }}
    >
      <Confetti
        width={tableWidth}
        height={tableHeight}
        recycle={false}
        numberOfPieces={confettiPieces}
        gravity={0.2}
        initialVelocityX={3}
        initialVelocityY={15}
        colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFA07A']}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
} 