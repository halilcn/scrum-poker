"use client";

import { Card } from '@/components/ui/card';
import { COLORS } from '@/constants';

export default function PlayingCard({ isRevealed = false, value = '?', flip = false, voted = false }) {
  return (
    <div className="relative" style={{ perspective: '600px' }}>
      <div
        style={{
          transformStyle: 'preserve-3d',
          transition: flip ? 'transform 0.6s ease-in-out' : 'none',
          transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Ön yüz - Kapalı kart */}
        <Card
          className="w-12 h-16 border-2 shadow-lg flex items-center justify-center"
          style={{
            backgroundColor: voted ? COLORS.darkNavy : COLORS.gray200,
            borderColor: voted ? COLORS.primaryBlue : COLORS.gray400,
            backfaceVisibility: 'hidden',
          }}
        >
          {!voted && (
            <div
              className="absolute inset-1 rounded border"
              style={{ borderColor: `${COLORS.gray400}30` }}
            ></div>
          )}
          <div
            className="w-6 h-6 rounded-full backdrop-blur-sm"
            style={{ backgroundColor: voted ? `${COLORS.white}30` : `${COLORS.gray500}20` }}
          ></div>
        </Card>

        {/* Arka yüz - Açık kart (değer gösterilen) */}
        <Card
          className="w-12 h-16 border-2 shadow-lg flex items-center justify-center absolute inset-0"
          style={{
            backgroundColor: COLORS.snow,
            borderColor: COLORS.gray300,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <span className="text-xl font-bold" style={{ color: COLORS.gray800 }}>
            {value}
          </span>
        </Card>
      </div>
    </div>
  );
}
