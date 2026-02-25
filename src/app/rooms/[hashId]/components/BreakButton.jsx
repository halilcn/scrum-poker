"use client";

import { useState, useEffect } from "react";
import { HandshakeIcon } from "lucide-react";
import { useRoom } from "@/app/rooms/[hashId]/context/RoomContext";
import { getRaffleSeenCookie, setRaffleSeenCookie } from "@/utils/cookieActions";
import RaffleDrawer from "./RaffleDrawer";

const BreakButton = () => {
  const [isRaffleDrawerOpen, setIsRaffleDrawerOpen] = useState(false);
  const [showNewBadge, setShowNewBadge] = useState(false);
  const { raffle } = useRoom();

  useEffect(() => {
    const hasSeenRaffle = getRaffleSeenCookie();
    setShowNewBadge(!hasSeenRaffle);
  }, []);

  const handleRaffleDrawerOpen = () => {
    setIsRaffleDrawerOpen(true);
    if (showNewBadge) {
      setRaffleSeenCookie();
      setShowNewBadge(false);
    }
  };

  const isRaffleCompleted = raffle?.status === "completed" && raffle?.winner;

  return (
    <>
      <div className="absolute z-50 right-0 top-3">
        <div className="relative">
          {isRaffleCompleted && (
            <>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 opacity-30 blur-xl animate-pulse" />
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-20 blur-lg animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
            </>
          )}
          {showNewBadge && (
            <div className="absolute -top-1 -right-1 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md animate-pulse">
              NEW
            </div>
          )}
          <button
            onClick={handleRaffleDrawerOpen}
            className="relative w-12 h-12 rounded-full shadow-lg flex items-center justify-center p-3 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 border cursor-pointer bg-white border-gray-200"
          >
            <HandshakeIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <RaffleDrawer
        open={isRaffleDrawerOpen}
        onOpenChange={setIsRaffleDrawerOpen}
      />
    </>
  );
};

export default BreakButton;
