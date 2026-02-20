"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS, TIMING } from "@/constants";
import { useRoom } from "@/app/rooms/[hashId]/context/RoomContext";
import { checkVotingConsensus } from "@/utils/checkVotingConsensus";
import TableContent from "@/app/rooms/[hashId]/components/TableContent";
import ConfettiCelebration from "./ConfettiCelebration";

export default function PokerTable() {
  const { status, participants } = useRoom();
  const [showGlow, setShowGlow] = useState(false);
  const previousStatusRef = useRef(status);
  const isMountedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      previousStatusRef.current = status;
      return;
    }

    if (
      previousStatusRef.current === "voting" &&
      status === "completed" &&
      mounted
    ) {
      const { hasConsensus } = checkVotingConsensus(participants);
      if (hasConsensus) {
        setTimeout(() => {
          setShowGlow(true);
          setTimeout(() => setShowGlow(false), 4500);
        }, TIMING.CARD_REVEAL_DELAY);
      }
    }

    previousStatusRef.current = status;
  }, [status, participants, mounted]);

  useEffect(() => {
    if (status === "voting") {
      setShowGlow(false);
    }
  }, [status]);

  useEffect(() => {
    setTimeout(() => setMounted(true), 1000);
  }, []);

  return (
    <div className="relative">
      <AnimatePresence>
        {showGlow && (
          <motion.div
            className="absolute -inset-3 rounded-[54px] pointer-events-none z-0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0 rounded-[54px] animate-pulse"
              style={{
                background:
                  "linear-gradient(135deg, #10b981 0%, #3F72AF 40%, #6366f1 70%, #10b981 100%)",
                opacity: 0.4,
                filter: "blur(16px)",
              }}
            />
            <div
              className="absolute inset-1 rounded-[50px] animate-pulse"
              style={{
                background:
                  "linear-gradient(225deg, #34d399 0%, #60a5fa 50%, #a78bfa 100%)",
                opacity: 0.25,
                filter: "blur(10px)",
                animationDelay: "0.3s",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="w-[300px] h-[145px] rounded-[42px] shadow-2xl border-3 relative overflow-hidden z-10"
        style={{
          backgroundColor: COLORS.gray200,
          borderColor: showGlow ? "#10b981" : COLORS.gray400,
          transition: "border-color 0.6s ease",
        }}
      >
        <div
          className="absolute inset-2 rounded-[34px] border-2"
          style={{ borderColor: `${COLORS.gray300}50` }}
        ></div>

        <ConfettiCelebration />
        <TableContent />

        <div
          className="absolute top-4 left-4 w-2 h-2 rounded-full"
          style={{ backgroundColor: `${COLORS.gray400}40` }}
        ></div>
        <div
          className="absolute top-4 right-4 w-2 h-2 rounded-full"
          style={{ backgroundColor: `${COLORS.gray400}40` }}
        ></div>
        <div
          className="absolute bottom-4 left-4 w-2 h-2 rounded-full"
          style={{ backgroundColor: `${COLORS.gray400}40` }}
        ></div>
        <div
          className="absolute bottom-4 right-4 w-2 h-2 rounded-full"
          style={{ backgroundColor: `${COLORS.gray400}40` }}
        ></div>
      </div>
    </div>
  );
}
