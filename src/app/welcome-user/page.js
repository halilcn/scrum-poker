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
import { useRouter } from "next/navigation";
import withRedirectPage from "@/hocs/withRedirectPage";

const WelcomeUser = () => {
  return (
    <div className="min-h-screen bg-[#F9F7F7] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Let&apos;s Start!</CardTitle>
            <CardDescription className="text-center">
              Ready to begin your Scrum Poker session?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
             

              <div className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/create-room">Create New Room</Link>
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/join-room">Join Existing Room</Link>
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
};

export default withRedirectPage(WelcomeUser);
