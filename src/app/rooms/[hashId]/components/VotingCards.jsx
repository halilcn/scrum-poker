"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRoom } from "@/app/rooms/[hashId]/context/RoomContext";
import { VOTING_CARDS } from "@/constants";
import { updateParticipantPoint, updateParticipantBreakStatus } from "@/lib/firebase/actions";

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
  const { status, currentUser } = useRoom();

  const handleCardSelect = async (value) => {
    // Eğer kullanıcı break modundaysa, önce break'i temizle
    if (currentUser?.breakStatus && currentUser.breakStatus !== 'none') {
      await updateParticipantBreakStatus('none', 0);
    }

    if (selectedCard === value) {
      // Aynı karta tekrar tıklandıysa, seçimi kaldır
      setSelectedCard(null);
      await updateParticipantPoint(null);
    } else {
      // Farklı bir kart seçildiyse, normal şekilde güncelle
      setSelectedCard(value);
      await updateParticipantPoint(value);
    }
  };

  const isVotingEnabled = status === "voting";

  // Set selected card based on currentUser's point value
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
          <div className="p-4">
            <div className="text-center mb-3">
              <span className="text-xs font-medium text-gray-600">
                Choose your point
              </span>
            </div>
            <div className="flex gap-2">
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
                              ? "border-[#3F72AF] text-[#3F72AF] -translate-y-2 shadow-md"
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
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
