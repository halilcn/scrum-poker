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
  const {
    roomName: contextRoomName,
    updateRoomName,
    isRoomCreator,
  } = useRoom();
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
    <div className="w-full relative" ref={dropdownRef}>
      <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <Button
          variant="ghost"
          size="icon"
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 cursor-pointer z-10 rounded-full transition-colors duration-200 ${
            isRoomCreator
              ? "hover:bg-gray-100 text-gray-600"
              : "text-gray-400 cursor-not-allowed"
          }`}
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
                  className={`text-center text-lg font-medium py-5 px-6 border-0 bg-transparent focus:ring-0 focus-visible:ring-0 placeholder:text-gray-400 ${
                    !isRoomCreator
                      ? "cursor-not-allowed opacity-60 text-gray-500"
                      : "text-gray-900"
                  }`}
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
