"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
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
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAnonymously } from "@/lib/firebase/actions";
import {
  setUsernameCookie,
  setUserIdCookie,
  setRoomIdCookie,
} from "@/utils/cookieActions";
import withRedirectPage from "@/hocs/withRedirectPage";

const Login = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const searchParams = useSearchParams();

  const roomId = searchParams.get("roomId");
  const hasRoomId = !!roomId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await loginAnonymously();
      setUsernameCookie(username);
      setUserIdCookie(user.uid);
      // Başarılı login sonrası yönlendirme

      if (hasRoomId) {
        setRoomIdCookie(roomId);
        router.push(`/rooms/${roomId}`);

        return;
      }

      router.push("/welcome-user");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F7] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your username to join the Scrum Poker session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              {error && (
                <div className="text-red-500 text-center text-sm mt-2">
                  {error}
                </div>
              )}
            </form>
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-700 text-sm font-medium inline-block hover:underline"
              >
                ← Back to homepage
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default withRedirectPage(Login);
