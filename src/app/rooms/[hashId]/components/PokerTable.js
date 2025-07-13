"use client";

import { COLORS } from "@/constants";
import TableContent from "@/app/rooms/[hashId]/components/TableContent";
import ConfettiCelebration from "./ConfettiCelebration";

export default function PokerTable() {
  return (
    <div className="relative">
      {/* Masa */}
      <div
        className="w-[300px] h-[145px] rounded-[42px] shadow-2xl border-3 relative overflow-hidden"
        style={{
          backgroundColor: COLORS.gray200,
          borderColor: COLORS.gray400,
        }}
      >
        {/* Masa kenar çizgisi */}
        <div
          className="absolute inset-2 rounded-[34px] border-2"
          style={{ borderColor: `${COLORS.gray300}50` }}
        ></div>

        {/* Konfeti - sadece table içinde */}
        <ConfettiCelebration />

        {/* Masa içi content alanı */}
        <TableContent />

        {/* Dekoratif detaylar */}
        <div
          className="absolute top-4 left-4 w-2 h-2 rounded-full"
          style={{ backgroundColor: `${COLORS.gray400}40` }}
        ></div>
        <div
          className="absolute top-4 right-4 w-2 h-2 rounded-full"
          style={{ backgroundColor: `${COLORS.gray400}40` }}
        ></div>
        <div
          className="absolute bottom-4 left-4 w-2 h-2 rounded-full"
          style={{ backgroundColor: `${COLORS.gray400}40` }}
        ></div>
        <div
          className="absolute bottom-4 right-4 w-2 h-2 rounded-full"
          style={{ backgroundColor: `${COLORS.gray400}40` }}
        ></div>
      </div>
    </div>
  );
}
