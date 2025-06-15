"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, X } from "lucide-react";
import { generateSprintName } from "@/requests";

export default function AIGenerateInput({
  isOpen,
  onClose,
  handleTitleChange,
  className = "",
}) {
  const [promptText, setPromptText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!promptText.trim()) return;

    setIsGenerating(true);
    try {
      const sprintName = await generateSprintName(promptText);
      handleTitleChange(sprintName);
    } catch (error) {
      console.error('Error generating sprint name:', error);
      // You might want to show a toast notification here
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleClose = () => {
    setPromptText("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-top-2 duration-200 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          <h4 className="text-sm font-medium">Generate Sprint Title</h4>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-3">
        <Textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What should the sprint name remind you of? For example, a movie starting with 'A'"
          className="min-h-[80px] resize-none text-sm"
          disabled={isGenerating}
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating || !promptText.trim()}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Bot className="h-3 w-3" />
                Generate
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
