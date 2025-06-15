"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function VotingCards() {
  const cardValues = ["1", "2", "3", "5", "8", "13", "21"];
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardSelect = (value) => {
    setSelectedCard(value);
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
      <div className="p-4">
        <div className="text-center mb-3">
          <span className="text-xs font-medium text-gray-600">
            Choose your card
          </span>
        </div>
        <div className="flex gap-2">
          {cardValues.map((value) => (
            <Button
              key={value}
              variant="outline"
              size="lg"
              onClick={() => handleCardSelect(value)}
              className={`min-w-12 h-16 text-lg font-bold cursor-pointer transition-all duration-200 hover:border-[#5c91e8] hover:text-[#5c91e8] ${
                selectedCard === value
                  ? "border-[#5c91e8] text-[#5c91e8] -translate-y-2 shadow-md"
                  : ""
              }`}
            >
              {value}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
} 