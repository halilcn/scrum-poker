"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AVATAR_URLS } from "@/lib/firebase/actions";
import { useState, useEffect } from "react";

export default function ChangeAvatarDialog({
  open,
  setOpen,
  avatarLoading,
  handleAvatarSubmit,
  currentAvatarUrl,
  onAIGenerate,
  title = "Change Avatar",
  description = "Select an avatar from the list below:",
  showCancelButton = true,
  variant = "change", // "change" or "welcome"
}) {
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [activeTab, setActiveTab] = useState("preset");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedAvatar, setAiGeneratedAvatar] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");

  // Dialog açıldığında mevcut avatar'ı set et
  useEffect(() => {
    if (open && currentAvatarUrl) {
      setSelectedAvatar(currentAvatarUrl);
    }
  }, [open, currentAvatarUrl]);

  // Dialog kapandığında state'leri resetle
  useEffect(() => {
    if (!open) {
      setActiveTab("preset");
      setAiGeneratedAvatar("");
      setAiGenerating(false);
      setAiPrompt("");
    }
  }, [open]);

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      return;
    }

    setAiGenerating(true);
    try {
      const generatedUrl = await onAIGenerate?.(aiPrompt);
      if (generatedUrl) {
        setAiGeneratedAvatar(generatedUrl);
        setSelectedAvatar(generatedUrl);
      }
    } catch (error) {
      console.error("AI generation failed:", error);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAvatarSubmit(selectedAvatar);
  };

  const handleUseAIAvatar = async () => {
    if (aiGeneratedAvatar) {
      await handleAvatarSubmit(aiGeneratedAvatar);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          {/* Avatar Selection Tabs */}
          <div className="mt-6 mb-4">
            <div className="flex gap-2 mb-4 border-b">
              <button
                type="button"
                onClick={() => setActiveTab("preset")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "preset"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Preset Avatars
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ai")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "ai"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                AI Generate
              </button>
            </div>

            {/* Preset Avatars Tab */}
            {activeTab === "preset" && (
              <div>
                <p className="text-sm text-gray-600 mb-4">{description}</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-96 overflow-y-auto p-2">
                  {AVATAR_URLS.map((avatarUrl, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedAvatar(avatarUrl)}
                      className={`
                        relative aspect-square rounded-lg border-2 overflow-hidden
                        transition-all hover:scale-105 hover:shadow-md
                        ${
                          selectedAvatar === avatarUrl
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-blue-300"
                        }
                      `}
                      disabled={avatarLoading}
                    >
                      <img
                        src={avatarUrl}
                        alt={`Avatar ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Generate Tab */}
            {activeTab === "ai" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Describe the avatar you want to generate:
                </p>

                {/* AI Prompt Input */}
                <div className="space-y-2">
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="A friendly cartoon character with glasses, wearing a blue hoodie, professional style, modern and colorful..."
                    className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={aiGenerating || avatarLoading}
                  />
                  <div className="flex items-start gap-2">
                    <p className="text-xs text-gray-500 flex-1">
                      💡 Tip: Be specific about colors, style, and
                      characteristics you want
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setAiPrompt(
                          "A professional cartoon avatar with friendly smile, wearing glasses, modern style with vibrant colors, suitable for a tech professional"
                        )
                      }
                      className="text-xs text-blue-600 hover:text-blue-700 underline whitespace-nowrap"
                      disabled={aiGenerating || avatarLoading}
                    >
                      Use Example
                    </button>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleAIGenerate}
                    disabled={aiGenerating || avatarLoading || !aiPrompt.trim()}
                    className="flex-1"
                  >
                    {aiGenerating ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      "Generate AI Avatar"
                    )}
                  </Button>
                </div>

                {/* Generated Avatar Preview */}
                {aiGeneratedAvatar && (
                  <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                    <div className="w-40 h-40 rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={aiGeneratedAvatar}
                        alt="AI Generated Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleUseAIAvatar}
                      disabled={avatarLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base"
                      size="lg"
                    >
                      {avatarLoading ? "Saving..." : "Use This Avatar"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer - Only show for preset tab */}
          {activeTab === "preset" && (
            <DialogFooter>
              <Button type="submit" disabled={avatarLoading || !selectedAvatar}>
                {avatarLoading
                  ? "Saving..."
                  : variant === "welcome"
                  ? "Continue"
                  : "Save"}
              </Button>
              {showCancelButton && (
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    {variant === "welcome" ? "Skip" : "Cancel"}
                  </Button>
                </DialogClose>
              )}
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
