"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useRoom } from "@/app/rooms/[hashId]/context/RoomContext";
import { debounce } from "lodash";
import AIGenerateInput from "./AIGenerateInput";

export default function SprintTitle() {
  const { roomName: contextRoomName, updateRoomName } = useRoom();
  const [localRoomName, setLocalRoomName] = useState("");
  const [showAIInput, setShowAIInput] = useState(false);
  const dropdownRef = useRef(null);

  // Component mount olduğunda context'teki roomName ile sync yap
  useEffect(() => {
    setLocalRoomName(contextRoomName || "");
  }, [contextRoomName]);

  // Debounced function to update room name
  const debouncedUpdateName = useCallback(
    debounce((name) => {
      updateRoomName(name);
    }, 400),
    [updateRoomName]
  );

  const handleTitleOnChange = (e) => {
    handleTitleChange(e.target.value);
  };

  const handleTitleChange = (newName) => {
    setLocalRoomName(newName); // Local state'i anında güncelle
    debouncedUpdateName(newName); // 400ms sonra Firebase'e gönder
  };

  const closeAIInput = () => {
    setShowAIInput(false);
  };

  useClickOutside(dropdownRef, closeAIInput);

  return (
    <div className="w-full max-w-xs mx-auto mb-8 relative" ref={dropdownRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Sprint Title"
          value={localRoomName}
          onChange={handleTitleOnChange}
          className="pr-12 text-center text-lg font-medium"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 cursor-pointer hover:bg-accent"
          onClick={() => setShowAIInput(!showAIInput)}
        >
          <Sparkles className="h-4 w-4" />
        </Button>
      </div>

      <AIGenerateInput
        isOpen={showAIInput}
        onClose={closeAIInput}
        handleTitleChange={handleTitleChange}
      />
    </div>
  );
}
