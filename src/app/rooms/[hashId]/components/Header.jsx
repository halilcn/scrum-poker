"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, LogOut, User } from "lucide-react";
import { logoutFromRoom } from "@/lib/firebase/actions";
import React, { useState } from "react";
import { toast } from "sonner";
import { setUsernameCookie } from "@/utils/cookieActions";
import { updateParticipantUsername } from "@/lib/firebase/actions";
import ChangeUsernameDialog from "./ChangeUsernameDialog";
import { useRoom } from "../context/RoomContext";
import Image from "next/image";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);

  const { currentUser } = useRoom();
  const username = currentUser?.username || "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    await logoutFromRoom();
    setLogoutLoading(false);
    window.location.href = "/";
  };

  const handleUsernameSubmit = async (newUsername) => {
    setUsernameLoading(true);
    try {
      setUsernameCookie(newUsername);
      await updateParticipantUsername(newUsername);
      toast.success("Username updated!");
      setDialogOpen(false);
    } catch (err) {
      toast.error("Failed to update username");
    } finally {
      setUsernameLoading(false);
    }
  };

  return (
    <header className="w-full border-b bg-white px-6 py-2">
      <div className="flex items-center justify-between mx-auto max-w-6xl">
        {/* Sol taraf - Logo */}
        <div className="flex flex-col items-start">
          <img
            src="/storipoi.svg"
            alt="Storypointer Logo"
            className="h-8 w-auto"
            style={{ height: 23 }}
          />
          <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
            <span>sponsored by</span>
            <a
              href="https://www.savaron.com.tr/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/savaron.svg"
                alt="Savaron"
                width={45}
                height={7}
                className="inline-block"
                priority
              />
            </a>
          </p>
        </div>

        {/* Sağ taraf - Butonlar */}
        <div className="flex items-center gap-3">
          {/* Link Butonu */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Link
          </Button>

          {/* Username Dropdown */}
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <User className="h-4 w-4" />
                {username || "Username"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setDropdownOpen(false);
                  setDialogOpen(true);
                }}
              >
                <User className="mr-2 h-4 w-4" />
                Change Username
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                className="text-red-600"
                disabled={logoutLoading}
              >
                {logoutLoading ? (
                  <svg
                    className="animate-spin mr-2 h-4 w-4 text-red-600"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Change Username Dialog */}
          <ChangeUsernameDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
            usernameLoading={usernameLoading}
            handleUsernameSubmit={handleUsernameSubmit}
          />
        </div>
      </div>
    </header>
  );
}
