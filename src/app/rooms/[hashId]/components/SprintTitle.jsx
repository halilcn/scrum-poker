"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useRoom } from "@/app/rooms/[hashId]/context/RoomContext";
import { debounce } from "lodash";
import AIGenerateInput from "./AIGenerateInput";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SprintTitle() {
  const { roomName: contextRoomName, updateRoomName, isRoomCreator } = useRoom();
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
    if (!isRoomCreator) return; // Prevent changes if not room creator
    handleTitleChange(e.target.value);
  };

  const handleTitleChange = (newName) => {
    setLocalRoomName(newName); // Local state'i anında güncelle
    debouncedUpdateName(newName); // 400ms sonra Firebase'e gönder
  };

  const closeAIInput = () => {
    setShowAIInput(false);
  };

  const handleAIButtonClick = () => {
    if (!isRoomCreator) return; // Prevent AI input if not room creator
    setShowAIInput(!showAIInput);
  };

  useClickOutside(dropdownRef, closeAIInput);

  return (
    <div className="w-full max-w-xs mx-auto mb-8 relative" ref={dropdownRef}>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 w-8 cursor-pointer z-10 h-full hover:bg-transparent"
          onClick={handleAIButtonClick}
          disabled={!isRoomCreator}
        >
          <Sparkles className="h-4 w-4" />
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Input
                  type="text"
                  placeholder="Sprint Title"
                  value={localRoomName}
                  onChange={handleTitleOnChange}
                  className="text-center text-lg font-medium"
                  readOnly={!isRoomCreator}
                  disabled={!isRoomCreator}
                />
              </div>
            </TooltipTrigger>
            {!isRoomCreator && (
              <TooltipContent>
                <p>Only the room creator can modify the sprint title</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      <AIGenerateInput
        isOpen={showAIInput}
        onClose={closeAIInput}
        handleTitleChange={handleTitleChange}
      />
    </div>
  );
}
