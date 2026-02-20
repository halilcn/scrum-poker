"use client"

import Link from 'next/link';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { joinRoom, checkRoomExists } from "@/lib/firebase/actions";
import { getRoomIdCookie, getUserIdCookie, getUsernameCookie, setRoomIdCookie } from "@/utils/cookieActions";

export default function JoinRoom() {
  const [hashId, setHashId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const roomId = getRoomIdCookie();
    const userId = getUserIdCookie();
    const username = getUsernameCookie();
    if (!userId || !username) {
      router.replace("/login");
    } else if (roomId) {
      router.replace(`/rooms/${roomId}`);
    } else {
      setChecking(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!hashId) throw new Error("Room ID is required");
      
      // Check if room exists
      const roomExists = await checkRoomExists(hashId);
      if (!roomExists) {
        throw new Error("Invalid room ID. Please check the room ID and try again.");
      }
      
      const roomId = await joinRoom(hashId);
      setRoomIdCookie(roomId);
      router.replace(`/rooms/${roomId}`);
    } catch (err) {
      setError(err.message || "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;

  return (
    <div className="min-h-screen bg-[#F9F7F7] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Join Room</CardTitle>
            <CardDescription className="text-center">
              Enter room details to join an existing Scrum Poker session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-3">
                <Label htmlFor="hashId">Room ID</Label>
                <Input
                  id="hashId"
                  type="text"
                  placeholder="Enter room ID"
                  required
                  value={hashId}
                  onChange={e => setHashId(e.target.value)}
                  disabled={loading}
                />
              </div>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Joining..." : "Join Room"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link 
                href="/welcome-user" 
                className="text-gray-600 hover:text-gray-700 text-sm font-medium inline-block hover:underline"
              >
                ← Back to welcome page
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 