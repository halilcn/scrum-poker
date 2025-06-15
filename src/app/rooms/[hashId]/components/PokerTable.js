"use client";

import { COLORS } from '@/constants';

export default function PokerTable() {
  return (
    <div className="relative">
      {/* Masa */}
      <div 
        className="w-[350px] h-[170px] rounded-[50px] shadow-2xl border-8 relative overflow-hidden"
        style={{
          backgroundColor: COLORS.gray200,
          borderColor: COLORS.gray400,
        }}
      >
        {/* Masa kenar çizgisi */}
        <div 
          className="absolute inset-2 rounded-[40px] border-2"
          style={{ borderColor: `${COLORS.gray300}50` }}
        ></div>
        
        {/* Masa içi content alanı */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="text-center" style={{ color: `${COLORS.gray600}` }}>
            <p className="text-sm">Sprint Story</p>
            <p className="text-xs mt-1">Kart seçimi bekleniyor...</p>
          </div>
        </div>
        
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