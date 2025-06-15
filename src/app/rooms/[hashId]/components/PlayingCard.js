"use client";

import { Card } from '@/components/ui/card';
import { COLORS } from '@/constants';

export default function PlayingCard({ isRevealed = false, value = '?' }) {
  return (
    <div className="relative">
      {!isRevealed ? (
        // Kapalı kart
        <Card 
          className="w-12 h-16 border-2 shadow-lg flex items-center justify-center cursor-pointer transform transition-transform hover:scale-105"
          style={{
            backgroundColor: COLORS.gray200,
            borderColor: COLORS.gray400
          }}
        >
          <div 
            className="absolute inset-1 rounded border"
            style={{ borderColor: `${COLORS.gray400}30` }}
          ></div>
          <div 
            className="w-6 h-6 rounded-full backdrop-blur-sm"
            style={{ backgroundColor: `${COLORS.gray500}20` }}
          ></div>
        </Card>
      ) : (
        // Açık kart
        <Card 
          className="w-12 h-16 border-2 shadow-lg flex items-center justify-center"
          style={{
            backgroundColor: COLORS.white,
            borderColor: COLORS.gray300
          }}
        >
          <span className="text-xl font-bold" style={{ color: COLORS.gray800 }}>
            {value}
          </span>
        </Card>
      )}
    </div>
  );
} 