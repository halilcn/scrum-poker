"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRoom } from "../context/RoomContext";
import { useState, useEffect } from "react";

export default function ChangeUsernameDialog({ open, setOpen, usernameLoading, handleUsernameSubmit }) {
  const { currentUser } = useRoom();
  const [username, setUsername] = useState("");

  // Dialog açıldığında mevcut username'i set et
  useEffect(() => {
    if (open && currentUser?.username) {
      setUsername(currentUser.username);
    }
  }, [open, currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUsernameSubmit(username);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Change Username</DialogTitle>
          </DialogHeader>
          <Input
            className="mt-8"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter new username"
            disabled={usernameLoading}
            autoFocus
          />
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={usernameLoading || !username.trim()}>
              {usernameLoading ? "Saving..." : "Save"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 