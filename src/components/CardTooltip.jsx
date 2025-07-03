"use client";

import { COLORS } from "@/constants";
import { useState, useEffect } from "react";

export default function CardTooltip({
  children,
  userPoint,
  roundedAverage,
  shouldShow = false,
  isLower = false,
  isHigher = false,
  autoHideDelay = 15000, // 15 seconds default
}) {
  const [isVisible, setIsVisible] = useState(false);

  // Show tooltip when shouldShow changes to true
  useEffect(() => {
    if (shouldShow) {
      setIsVisible(true);

      // Auto hide after delay
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDelay);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [shouldShow, autoHideDelay]);

  // Generate dynamic message based on user's point relative to average
  const generateMessage = () => {
    if (isLower) {
      return "You gave a **lower** point than average. Want to explain why?";
    } else if (isHigher) {
      return "You gave a **higher** point than average. Want to share your reasoning?";
    }
    return "Your point differs significantly from the team average.";
  };

  // If tooltip shouldn't be visible, just return children
  if (!isVisible) {
    return children;
  }

  const message = generateMessage();

  return (
    <div className="relative inline-block overflow-visible">
      {children}

      {/* Tooltip */}
      <div
        className="absolute z-50 px-3 py-2 text-xs font-light rounded-lg shadow-xl transition-opacity duration-200 -top-16 left-1/2 transform -translate-x-1/2 border animate-in fade-in-0 zoom-in-95 flex items-center gap-2"
        style={{
          backgroundColor: COLORS.white,
          color: COLORS.gray600,
          minWidth: "250px",
          whiteSpace: "normal",
          borderColor: COLORS.gray200,
        }}
      >
        {/* Warning Info Icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <circle cx="12" cy="12" r="10" fill="#F59E0B" />
          <path
            d="m12 8v4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m12 16h.01"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Tooltip Text */}
        <span
          className="flex-1"
          dangerouslySetInnerHTML={{
            __html: message.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
          }}
        />

        {/* Tooltip Arrow */}
        <div
          className="absolute w-2 h-2 transform rotate-45 top-full left-1/2 -translate-x-1/2 -mt-1 border-r border-b"
          style={{
            backgroundColor: COLORS.white,
            borderColor: COLORS.gray200,
          }}
        />
      </div>
    </div>
  );
}
