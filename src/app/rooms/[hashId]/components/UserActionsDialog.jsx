"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { kickUserFromRoom } from "@/lib/firebase/actions";
import { toast } from "sonner";

export default function UserActionsDialog({ isOpen, onOpenChange, player }) {
  const [showKickConfirmation, setShowKickConfirmation] = useState(false);

  if (!player) return null;

  const handleKickPlayer = async () => {
    try {
      await kickUserFromRoom(player.userId);
      toast.success(`${player.username} has been kicked from the room`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to kick player");
      console.error("Error kicking player:", error);
    }
    setShowKickConfirmation(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Actions / {player.username}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => setShowKickConfirmation(true)}
            >
              Kick player out
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showKickConfirmation} onOpenChange={setShowKickConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to kick {player.username} from the room? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleKickPlayer}>
              Yes, kick player
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 