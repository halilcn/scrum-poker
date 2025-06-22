"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getUserIdCookie,
  getUsernameCookie,
  getRoomIdCookie,
  setRoomIdCookie,
} from "@/utils/cookieActions";
import { createRoom } from "@/lib/firebase/actions";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
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
    setLoading(true);
    setError("");
    try {
      const userId = getUserIdCookie();
      const username = getUsernameCookie();
      if (!userId || !username) {
        setError("User not found. Please login again.");
        setLoading(false);
        return;
      }
      const roomId = await createRoom({ roomName });

      setRoomIdCookie(roomId);
      router.push(`/rooms/${roomId}`);
    } catch (err) {
      setError("Room could not be created. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create Room</CardTitle>
            <CardDescription className="text-center">
              Create your room instantly and start planning with your team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-3">
                <Label htmlFor="roomName">Room Name</Label>
                <Input
                  id="roomName"
                  type="text"
                  placeholder="Enter your room name"
                  required
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Room"}
              </Button>
              {error && (
                <div className="text-red-500 text-center text-sm mt-2">
                  {error}
                </div>
              )}
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
};

export default CreateRoom;
