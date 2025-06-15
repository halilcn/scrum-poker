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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRoomIdCookie, getUserIdCookie, getUsernameCookie } from "@/utils/cookieActions";

export default function WelcomeUser() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const roomId = getRoomIdCookie();
    const userId = getUserIdCookie();
    const username = getUsernameCookie();
    if (roomId) {
      router.replace(`/rooms/${roomId}`);
    } else if (!userId || !username) {
      router.replace("/login");
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome!</CardTitle>
            <CardDescription className="text-center">
              Welcome to Scrum Poker. Let&apos;s get started!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  You&apos;re ready to join or create a Scrum Poker session.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/create-room">
                    Create New Room
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/join-room">
                    Join Existing Room
                  </Link>
                </Button>
              </div>
            </div>
            
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
} 