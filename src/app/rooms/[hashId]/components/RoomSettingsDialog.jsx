"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SprintTitle from "./SprintTitle";

export default function RoomSettingsDialog({ open, setOpen }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Room Settings</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <SprintTitle />
        </div>
      </DialogContent>
    </Dialog>
  );
}
