"use client";

import { useState, useRef, useEffect } from "react";
import { Coffee, X, HandshakeIcon } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useRoom } from "@/app/rooms/[hashId]/context/RoomContext";
import {
  updateParticipantBreakStatus,
  updateParticipantBreakSeconds,
} from "@/lib/firebase/actions";
import { getRaffleSeenCookie, setRaffleSeenCookie } from "@/utils/cookieActions";
import RaffleDrawer from "./RaffleDrawer";

const BreakButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isRaffleDrawerOpen, setIsRaffleDrawerOpen] = useState(false);
  const [showNewBadge, setShowNewBadge] = useState(false);
  const dropdownRef = useRef(null);
  const { currentUser, raffle } = useRoom();

  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Check if user has seen raffle feature
  useEffect(() => {
    const hasSeenRaffle = getRaffleSeenCookie();
    setShowNewBadge(!hasSeenRaffle);
  }, []);

  // Mark raffle as seen when drawer opens
  const handleRaffleDrawerOpen = () => {
    setIsRaffleDrawerOpen(true);
    if (showNewBadge) {
      setRaffleSeenCookie();
      setShowNewBadge(false);
    }
  };

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
        // Break is over, reset status
        await updateParticipantBreakStatus("none", 0);
        clearInterval(interval);
      } else {
        // Update seconds
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
      const seconds = minutes * 60;
      await updateParticipantBreakStatus("time", seconds);
    }
    setIsOpen(false);
  };

  const handleClearBreak = async () => {
    await updateParticipantBreakStatus("none", 0);
  };

  const breakOptions = [
    { label: "Indefinite", value: "indefinite" },
    { label: "2 minutes", value: "2" },
    { label: "5 minutes", value: "5" },
  ];

  // Check if user is on break
  const isOnBreak =
    currentUser?.breakStatus && currentUser.breakStatus !== "none";

  // Format seconds to display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Check if raffle is completed
  const isRaffleCompleted = raffle?.status === "completed" && raffle?.winner;

  return (
    <>
      <div className="absolute z-50 right-0 top-3 flex items-center gap-2" ref={dropdownRef}>
        {/* Raffle Button */}
        <div className="relative">
          {/* Glow effect when raffle is completed */}
          {isRaffleCompleted && (
            <>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 opacity-30 blur-xl animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-20 blur-lg animate-pulse" style={{ animationDelay: "0.5s" }}></div>
            </>
          )}
          {/* New Badge */}
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

        {/* Break Button */}
        <button
          onClick={() => (isOnBreak ? handleClearBreak() : setIsOpen(!isOpen))}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={isOnBreak && isOpen}
          className={`
            w-12 h-12 rounded-full shadow-lg flex items-center gap-2 
            hover:shadow-xl transition-all duration-200 border cursor-pointer justify-center p-3 hover:bg-gray-50
            ${
              isOnBreak
                ? "text-white border-[#286ddb] w-24"
                : "bg-white border-gray-200"
            }
            ${
              isOnBreak && isHovered
                ? "hover:bg-red-500 hover:border-red-600 w-24"
                : ""
            }
          `}
          style={{
            backgroundColor: isOnBreak && !isHovered ? "#286ddb" : undefined,
          }}
        >
          {isOnBreak && isHovered ? (
            <X className="w-5 h-5" />
          ) : (
            <>
              <Coffee className="w-5 h-5" />
              {isOnBreak && (
                <span className="text-sm font-medium">
                  {currentUser.breakStatus === "time" &&
                  currentUser.breakSeconds > 0
                    ? formatTime(currentUser.breakSeconds)
                    : currentUser.breakStatus === "Indefinite"
                    ? "∞"
                    : ""}
                </span>
              )}
            </>
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && !isOnBreak && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="py-1">
              {breakOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleBreakSelect(option.value)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Raffle Drawer */}
      <RaffleDrawer
        open={isRaffleDrawerOpen}
        onOpenChange={setIsRaffleDrawerOpen}
      />
    </>
  );
};

export default BreakButton;
