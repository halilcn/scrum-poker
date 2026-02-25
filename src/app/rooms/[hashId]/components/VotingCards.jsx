"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Coffee, X } from "lucide-react";
import { useRoom } from "@/app/rooms/[hashId]/context/RoomContext";
import { useClickOutside } from "@/hooks/use-click-outside";
import { VOTING_CARDS } from "@/constants";
import {
  updateParticipantPoint,
  updateParticipantBreakStatus,
  updateParticipantBreakSeconds,
} from "@/lib/firebase/actions";

export default function VotingCards() {
  const cardValues = [
    "1",
    "2",
    "3",
    "5",
    "8",
    "13",
    "21",
    VOTING_CARDS.UNKNOWN,
  ];
  const [selectedCard, setSelectedCard] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const breakRef = useRef(null);
  const { status, currentUser } = useRoom();

  useClickOutside(breakRef, () => setIsOpen(false));

  // Countdown effect for timed breaks
  useEffect(() => {
    if (
      !currentUser ||
      currentUser.breakStatus !== "time" ||
      !currentUser.breakSeconds
    )
      return;

    const interval = setInterval(async () => {
      const newSeconds = currentUser.breakSeconds - 1;
      if (newSeconds <= 0) {
        await updateParticipantBreakStatus("none", 0);
        clearInterval(interval);
      } else {
        await updateParticipantBreakSeconds(newSeconds);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser?.breakStatus, currentUser?.breakSeconds]);

  const handleBreakSelect = async (value) => {
    if (value === "indefinite") {
      await updateParticipantBreakStatus("Indefinite", 0);
    } else {
      const minutes = parseInt(value);
      await updateParticipantBreakStatus("time", minutes * 60);
    }
    setIsOpen(false);
  };

  const handleClearBreak = async () => {
    await updateParticipantBreakStatus("none", 0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const breakOptions = [
    { label: "Indefinite", value: "indefinite", icon: "∞" },
    { label: "2 min", value: "2", icon: "2m" },
    { label: "5 min", value: "5", icon: "5m" },
  ];

  const isOnBreak =
    currentUser?.breakStatus && currentUser.breakStatus !== "none";

  const handleCardSelect = async (value) => {
    if (currentUser?.breakStatus && currentUser.breakStatus !== "none") {
      await updateParticipantBreakStatus("none", 0);
    }

    if (selectedCard === value) {
      setSelectedCard(null);
      await updateParticipantPoint(null);
    } else {
      setSelectedCard(value);
      await updateParticipantPoint(value);
    }
  };

  const isVotingEnabled = status === "voting";

  useEffect(() => {
    if (isVotingEnabled && currentUser?.point) {
      setSelectedCard(currentUser.point);
    }
  }, [isVotingEnabled, currentUser?.point]);

  useEffect(() => {
    !isVotingEnabled && setSelectedCard(null);
  }, [isVotingEnabled]);

  return (
    <AnimatePresence>
      {isVotingEnabled && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.4,
          }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 px-5 py-4">
            <div className="text-center mb-3">
              <span className="text-xs font-medium text-gray-600">
                Choose your point
              </span>
            </div>
            <div className="flex gap-2 items-end">
              {cardValues.map((value) => {
                const isUnknownCard = value === VOTING_CARDS.UNKNOWN;
                const isSelected = selectedCard === value;

                return (
                  <Button
                    key={value}
                    variant="outline"
                    size="lg"
                    onClick={() => handleCardSelect(value)}
                    className={`w-14 h-16 text-lg font-bold cursor-pointer transition-all duration-200 ${
                      isUnknownCard
                        ? `border-2 ${
                            isSelected
                              ? "border-[#3F72AF] text-[#3F72AF] -translate-y-2 shadow-md hover:border-[#3F72AF] hover:text-[#3F72AF]"
                              : "border-orange-400 text-orange-400 bg-orange-25 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50"
                          }`
                        : `hover:border-[#3F72AF] hover:text-[#112D4E] ${
                            isSelected
                              ? "border-[#3F72AF] text-[#112D4E] -translate-y-2 shadow-md"
                              : ""
                          }`
                    }`}
                  >
                    {value}
                  </Button>
                );
              })}

              {/* Divider */}
              <div className="w-px h-10 bg-gray-200 self-center mx-1" />

              {/* Break Button */}
              <div className="relative" ref={breakRef}>
                {/* Dropdown — opens upward */}
                <AnimatePresence>
                  {isOpen && !isOnBreak && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/60 overflow-hidden"
                    >
                      <div className="p-1.5 flex flex-col gap-0.5 min-w-[120px]">
                        {breakOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleBreakSelect(option.value)}
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer w-full"
                          >
                            <span className="w-6 text-center text-xs font-bold text-[#3F72AF]">
                              {option.icon}
                            </span>
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    isOnBreak ? handleClearBreak() : setIsOpen(!isOpen)
                  }
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={`w-14 h-16 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                    isOnBreak
                      ? isHovered
                        ? "border-red-400 text-red-500 bg-red-50 -translate-y-2 shadow-md"
                        : "border-[#112D4E] text-white bg-[#112D4E] -translate-y-2 shadow-md hover:bg-[#112D4E] hover:text-white"
                      : isOpen
                      ? "border-[#3F72AF] text-[#112D4E]"
                      : "hover:border-[#3F72AF] hover:text-[#112D4E]"
                  }`}
                >
                  {isOnBreak && isHovered ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <>
                      <Coffee className="w-5 h-5" />
                      {isOnBreak && (
                        <span className="text-[11px] font-bold leading-none">
                          {currentUser.breakStatus === "time" &&
                          currentUser.breakSeconds > 0
                            ? formatTime(currentUser.breakSeconds)
                            : "∞"}
                        </span>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
