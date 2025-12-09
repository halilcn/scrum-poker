"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRoom } from "../context/RoomContext";
import { X } from "lucide-react";
import { DEFAULT_AVATAR_URL } from "@/lib/firebase/actions";
import Image from "next/image";
import { useClickOutside } from "@/hooks/use-click-outside";
import Lottie from "lottie-react";
import {
  setRaffleType,
  addRaffleParticipant,
  addRaffleManualParticipant,
  removeRaffleParticipant,
  startRaffle,
  completeRaffle,
  resetRaffleForNewDraw,
} from "@/lib/firebase/actions";

const RAFFLE_TYPES = [
  {
    id: "single-selection",
    name: "Single Selection",
  },
];

const RaffleDrawer = ({ open, onOpenChange }) => {
  const { participants, raffle } = useRoom();
  const [hoveredParticipantId, setHoveredParticipantId] = useState(null);
  const [selectValue, setSelectValue] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualInputValue, setManualInputValue] = useState("");
  const manualInputRef = useRef(null);
  const lottieRef = useRef(null);
  const countdownTimeoutRef = useRef(null);

  // Get raffle info from Firebase
  const raffleType = raffle?.type || RAFFLE_TYPES[0].id;
  const raffleStatus = raffle?.status || null;
  const raffleParticipants = raffle?.participants || {};
  const winner = raffle?.winner || null;

  // Parse raffle participants
  const selectedParticipants = Object.keys(raffleParticipants).filter(
    (id) => raffleParticipants[id]?.userId
  );
  const manualParticipants = Object.entries(raffleParticipants)
    .filter(([id, data]) => data?.name && !data?.userId)
    .map(([id, data]) => ({ id, name: data.name }));

  // Get active users in the room
  const availableParticipants = Object.values(participants || {}).filter(
    (p) => p.isActive
  );

  // Filter users not yet added for dropdown
  const unselectedParticipants = availableParticipants.filter(
    (p) => !selectedParticipants.includes(p.userId)
  );

  // Reset local states when drawer closes
  useEffect(() => {
    if (!open) {
      setHoveredParticipantId(null);
      setSelectValue("");
      setShowManualInput(false);
      setManualInputValue("");
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current);
        countdownTimeoutRef.current = null;
      }
    }
  }, [open]);

  // Start countdown when raffle status changes
  useEffect(() => {
    if (raffleStatus === "pending" && !countdownTimeoutRef.current && !winner) {
      // Select winner when countdown animation completes
      countdownTimeoutRef.current = setTimeout(async () => {
        const allRaffleParticipants = [];
        
        // Add active users
        selectedParticipants.forEach((userId) => {
          const participant = availableParticipants.find((p) => p.userId === userId);
          if (participant) {
            allRaffleParticipants.push({
              type: "active",
              userId: participant.userId,
              name: participant.username,
              imageUrl: participant.imageUrl || DEFAULT_AVATAR_URL,
            });
          }
        });
        
        // Add manual entries
        manualParticipants.forEach(({ name }) => {
          allRaffleParticipants.push({
            type: "manual",
            name: name.trim(),
          });
        });
        
        // Select random winner for single selection
        if (allRaffleParticipants.length > 0) {
          const randomIndex = Math.floor(Math.random() * allRaffleParticipants.length);
          const selectedWinner = allRaffleParticipants[randomIndex];
          await completeRaffle(selectedWinner);
        }
        countdownTimeoutRef.current = null;
      }, 5000); // Countdown animation lasts approximately 5 seconds
    }

    return () => {
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current);
        countdownTimeoutRef.current = null;
      }
    };
  }, [raffleStatus, selectedParticipants, manualParticipants, availableParticipants, winner]);

  // Add user to Firebase when selected from dropdown
  const handleSelectParticipant = async (value) => {
    if (value === "manual-add") {
      setShowManualInput(true);
      setSelectValue("");
    } else if (value && !selectedParticipants.includes(value)) {
      await addRaffleParticipant(value);
      setSelectValue("");
    }
  };

  // Add manual user (to Firebase)
  const handleAddManualParticipant = async () => {
    const trimmedValue = manualInputValue.trim();
    if (trimmedValue) {
      // Create unique ID for manual user
      const manualId = `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await addRaffleManualParticipant(manualId, trimmedValue);
      setManualInputValue("");
      setShowManualInput(false);
    } else {
      setShowManualInput(false);
      setManualInputValue("");
    }
  };

  // Cancel manual input
  const handleCancelManualInput = () => {
    setShowManualInput(false);
    setManualInputValue("");
  };

  // Handle click outside input
  useClickOutside(manualInputRef, () => {
    if (showManualInput) {
      handleAddManualParticipant();
    }
  });

  // Remove manual user (from Firebase)
  const handleRemoveManual = async (manualId) => {
    await removeRaffleParticipant(manualId);
  };

  // Remove active user (from Firebase)
  const handleRemoveParticipant = async (userId) => {
    await removeRaffleParticipant(userId);
  };

  // Change raffle type
  const handleRaffleTypeChange = async (type) => {
    await setRaffleType(type);
  };

  // Start raffle (write to Firebase)
  const handleStartRaffle = async () => {
    // Don't proceed if there are no participants
    if (selectedParticipants.length === 0 && manualParticipants.length === 0) {
      return;
    }
    
    // Start raffle in Firebase (sets status to "pending")
    await startRaffle();
  };

  // Raffle again (only clears status and winner, keeps participants)
  const handleResetRaffle = async () => {
    await resetRaffleForNewDraw();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[800px] sm:w-[900px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Raffle</SheetTitle>
        </SheetHeader>

        {/* Countdown Overlay */}
        {raffleStatus === "pending" && (
          <div className="absolute top-[73px] left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-white">
            <Lottie
              lottieRef={lottieRef}
              animationData={null}
              path="/lottie/countdown.json"
              loop={false}
              autoplay
              style={{ width: 400, height: 400 }}
              onDOMLoaded={() => {
                if (lottieRef.current) {
                  lottieRef.current.setSpeed(1);
                }
              }}
            />
          </div>
        )}

        {/* Result Overlay */}
        {raffleStatus === "completed" && winner && (
          <div className="absolute top-[73px] left-0 right-0 bottom-0 z-50 flex flex-col bg-white">
            <style jsx>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: scale(0.8);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}</style>
            <div className="relative flex-1 flex flex-col items-center justify-center">
              {/* Glow effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-96 h-96 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-full opacity-30 blur-3xl animate-pulse"></div>
                <div className="absolute w-80 h-80 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
              </div>
              
              {/* Winner */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                {winner.type === "active" && winner.imageUrl && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <img
                      src={winner.imageUrl}
                      alt={winner.name}
                      className="relative w-32 h-32 rounded-full border-4 border-yellow-400 shadow-2xl"
                      style={{
                        animation: "fadeIn 0.8s ease-in-out",
                      }}
                    />
                  </div>
                )}
                <h2 
                  className="text-5xl font-bold text-gray-900 text-center"
                  style={{
                    animation: "fadeIn 0.8s ease-in-out",
                  }}
                >
                  {winner.name}
                </h2>
              </div>
            </div>
            
            {/* Raffle Again Button - Bottom */}
            <div className="px-4 pb-6 pt-4 border-t border-gray-100">
              <button
                onClick={handleResetRaffle}
                className="w-full h-12 rounded-lg bg-blue-600 text-white font-medium text-base hover:bg-blue-700 transition-colors duration-200"
                style={{
                  animation: "fadeIn 1s ease-in-out",
                }}
              >
                Raffle Again
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Raffle Type Selection */}
          <div>
            <h3 className="text-sm font-medium mb-3">Raffle Type</h3>
            <div className="flex gap-3">
              {RAFFLE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleRaffleTypeChange(type.id)}
                  className={`
                    relative rounded-lg border-2 overflow-hidden p-3
                    transition-all hover:scale-105 hover:shadow-md flex items-center gap-2
                    ${
                      raffleType === type.id
                        ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 bg-white"
                    }
                  `}
                >
                  <Image
                    src="/raffle.png"
                    alt={type.name}
                    width={24}
                    height={24}
                    className="flex-shrink-0"
                  />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {type.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Participants */}
          <div>
            <h3 className="text-sm font-medium mb-3">Participants</h3>
            <div className="flex flex-wrap gap-2 min-h-[60px] items-start">
              {/* Active users */}
              {selectedParticipants.map((userId) => {
                const participant = availableParticipants.find(
                  (p) => p.userId === userId
                );
                if (!participant) return null;

                const isHovered = hoveredParticipantId === userId;
                return (
                  <Badge
                    key={userId}
                    variant="secondary"
                    className="flex items-center gap-2 px-4 py-2 relative overflow-visible"
                    onMouseEnter={() => setHoveredParticipantId(userId)}
                    onMouseLeave={() => setHoveredParticipantId(null)}
                  >
                    <img
                      src={participant.imageUrl || DEFAULT_AVATAR_URL}
                      alt={participant.username}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-sm">{participant.username}</span>
                    {isHovered && (
                      <button
                        onClick={() => handleRemoveParticipant(userId)}
                        className="absolute -top-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow-sm hover:bg-red-50 transition-colors z-10 cursor-pointer"
                      >
                        <X className="w-3 h-3 text-red-500" />
                      </button>
                    )}
                  </Badge>
                );
              })}

              {/* Manually added users */}
              {manualParticipants.map(({ id, name }) => {
                const isHovered = hoveredParticipantId === id;
                return (
                  <Badge
                    key={id}
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 relative bg-gray-100 overflow-visible"
                    onMouseEnter={() => setHoveredParticipantId(id)}
                    onMouseLeave={() => setHoveredParticipantId(null)}
                  >
                    <span className="text-sm">{name}</span>
                    {isHovered && (
                      <button
                        onClick={() => handleRemoveManual(id)}
                        className="absolute -top-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow-sm hover:bg-red-50 transition-colors z-10 cursor-pointer"
                      >
                        <X className="w-3 h-3 text-red-500" />
                      </button>
                    )}
                  </Badge>
                );
              })}

              {/* Show manual input */}
              {showManualInput ? (
                <div
                  ref={manualInputRef}
                  className="flex items-center gap-2 rounded-md border-2 border-gray-200 bg-white px-3 py-1.5"
                >
                  <input
                    type="text"
                    value={manualInputValue}
                    onChange={(e) => setManualInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddManualParticipant();
                      } else if (e.key === "Escape") {
                        handleCancelManualInput();
                      }
                    }}
                    placeholder="Enter name..."
                    className="flex-1 outline-none text-sm bg-transparent"
                    autoFocus
                  />
                  <button
                    onClick={handleCancelManualInput}
                    className="text-gray-500 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                // Add participant dropdown
                <Select value={selectValue} onValueChange={handleSelectParticipant}>
                  <SelectTrigger className="h-auto py-1.5 w-auto min-w-[120px]">
                    <SelectValue placeholder="Add Entry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual-add">
                      <span className="font-medium">Add Manually</span>
                    </SelectItem>
                    {unselectedParticipants.length > 0 && (
                      <>
                        <SelectSeparator />
                        {unselectedParticipants.map((participant) => (
                          <SelectItem key={participant.userId} value={participant.userId}>
                            <div className="flex items-center gap-2">
                              <img
                                src={participant.imageUrl || DEFAULT_AVATAR_URL}
                                alt={participant.username}
                                className="w-5 h-5 rounded-full"
                              />
                              <span>{participant.username}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Start Raffle Button */}
        {raffleStatus !== "completed" && raffleStatus !== "pending" && (
          <SheetFooter className="pt-4">
            <Button
              onClick={handleStartRaffle}
              className="w-full h-14 text-lg font-semibold"
              disabled={
                selectedParticipants.length === 0 &&
                manualParticipants.length === 0
              }
            >
              Start Raffle
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default RaffleDrawer;
