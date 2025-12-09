"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getRoomIdCookie, getUserIdCookie } from "@/utils/cookieActions";
import { subscribeToRoom, updateRoomName } from "@/lib/firebase/actions";

// Context oluştur
const RoomContext = createContext(null);

// Custom hook
export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};

// Provider component
export function RoomProvider({ children }) {
  const [room, setRoom] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRoomCreator, setIsRoomCreator] = useState(false);

  useEffect(() => {
    const roomId = getRoomIdCookie();
    const userId = getUserIdCookie();

    if (!roomId || !userId) {
      setLoading(false);
      return;
    }

    // Firebase'den room bilgilerini dinle
    const handleRoomUpdate = (snapshot) => {
      const roomData = snapshot.val();

      if (roomData) {
        setRoom(roomData);
        setIsRoomCreator(roomData.createdBy === userId);

        // Participants içinden current user'ı bul
        if (roomData.participants && roomData.participants[userId]) {
          setCurrentUser(roomData.participants[userId]);
        }
      }

      setLoading(false);
    };

    const unsubscribe = subscribeToRoom(roomId, handleRoomUpdate);

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);

  // Participants değiştiğinde current user'ı güncelle
  useEffect(() => {
    if (!room || !room.participants) return;

    const userId = getUserIdCookie();
    if (userId && room.participants[userId]) {
      setCurrentUser(room.participants[userId]);
    }
  }, [room?.participants]);

  const value = {
    room,
    currentUser,
    loading,
    isRoomCreator,
    participants: room?.participants || {},
    roomName: room?.roomName || "",
    status: room?.status || "voting",
    raffle: room?.raffle || null,
    updateRoomName,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}
