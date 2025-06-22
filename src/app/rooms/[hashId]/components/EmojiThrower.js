"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeToReactions, cleanOldReactions } from '@/lib/firebase/actions';
import { getRoomIdCookie } from '@/utils/cookieActions';

export default function EmojiThrower({ playerRefs, emojis = ['🎯', '🎉', '💥', '⭐', '🔥'] }) {
  const [thrownEmojis, setThrownEmojis] = useState([]);
  const processedReactionsRef = useRef(new Set());
  const roomId = getRoomIdCookie();

  // Firebase reactions'ları dinle
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = subscribeToReactions(roomId, (snapshot) => {
      if (snapshot.exists()) {
        const reactions = snapshot.val();
        
        Object.entries(reactions).forEach(([reactionId, reactionData]) => {
          // Daha önce işlenmiş reaction'ları tekrar işleme
          if (processedReactionsRef.current.has(reactionId)) return;
          
          // Yeni reaction'ı işle
          const { userId: targetUserId, reaction: emoji } = reactionData;
          
          // Hedef player'ın ref'i yoksa işleme
          if (!playerRefs[targetUserId]?.current) return;
          
          // Sadece soldan veya sağdan başlat
          const fromLeft = Math.random() < 0.5;
          let startX, startY;

          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;
          const offset = -50; // Ekran dışından başlat

          if (fromLeft) {
            // Sol taraftan
            startX = offset;
            startY = screenHeight * 0.3 + Math.random() * screenHeight * 0.4;
          } else {
            // Sağ taraftan
            startX = screenWidth - offset;
            startY = screenHeight * 0.3 + Math.random() * screenHeight * 0.4;
          }

          const startPosition = { x: startX, y: startY, fromLeft };
          
          // Emoji fırlat
          throwEmoji(targetUserId, startPosition, emoji);
          
          // İşlenen reaction'ı kaydet
          processedReactionsRef.current.add(reactionId);
        });
      }
    });

    // Eski reaction'ları periyodik olarak temizle
    const cleanupInterval = setInterval(() => {
      cleanOldReactions(roomId);
    }, 10000); // 10 saniyede bir temizle

    return () => {
      unsubscribe();
      clearInterval(cleanupInterval);
    };
  }, [roomId, playerRefs]);

  // Emoji fırlatma fonksiyonu
  const throwEmoji = (targetPlayerId, startPosition, selectedEmoji = null) => {
    if (!playerRefs[targetPlayerId]?.current) return;

    const targetElement = playerRefs[targetPlayerId].current;
    const targetRect = targetElement.getBoundingClientRect();
    
    // Seçilen emoji varsa onu kullan, yoksa rastgele seç
    const emoji = selectedEmoji || emojis[Math.floor(Math.random() * emojis.length)];
    const emojiId = Date.now() + Math.random();

    // Hedef pozisyonu - tam merkez
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    // Başlangıç ve hedef arasındaki mesafe
    const dx = targetX - startPosition.x;
    const dy = targetY - startPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Parabolik hareket için parametreler
    const flightTime = 1.2; // Saniye cinsinden sabit uçuş süresi
    const fps = 60;
    const totalFrames = flightTime * fps;
    
    // Yatay hız - hedefe tam ulaşacak şekilde
    const vx = dx / totalFrames;
    
    // Dikey hız ve yerçekimi - parabolik yol için
    const gravity = 0.5;
    const peakHeight = Math.min(distance * 0.4, 250); // Maksimum yükseklik
    
    // Parabolik hareket için başlangıç dikey hızı
    // vy0 = (dy + 0.5 * g * t^2) / t
    const vy = (dy - 0.5 * gravity * totalFrames * totalFrames) / totalFrames;

    // Emoji state'e ekle
    const newEmoji = {
      id: emojiId,
      emoji: emoji,
      x: startPosition.x,
      y: startPosition.y,
      vx: vx,
      vy: vy,
      gravity: gravity,
      targetX: targetX,
      targetY: targetY,
      targetPlayerId: targetPlayerId,
      startTime: Date.now(),
      rotation: 0,
      opacity: 1,
      isColliding: false,
      scale: 0.3,
      fromLeft: startPosition.fromLeft,
      frame: 0,
      totalFrames: totalFrames
    };

    setThrownEmojis(prev => [...prev, newEmoji]);

    // Pozisyon güncellemesi için interval
    const updateInterval = setInterval(() => {
      setThrownEmojis(prev => {
        return prev.map(e => {
          if (e.id !== emojiId) return e;

          // Çarpışma durumunda
          if (e.isColliding) {
            // Opacity azalt
            const newOpacity = e.opacity - 0.08;
            if (newOpacity <= 0) {
              clearInterval(updateInterval);
              setThrownEmojis(prevEmojis => prevEmojis.filter(emoji => emoji.id !== emojiId));
              return e;
            }
            return { 
              ...e, 
              opacity: newOpacity, 
              scale: e.scale + 0.05,
              rotation: e.rotation + 20 
            };
          }

          // Frame sayacını artır
          const newFrame = e.frame + 1;

          // Hedefe olan mesafeyi hesapla
          const currentDx = Math.abs(e.targetX - e.x);
          const currentDy = Math.abs(e.targetY - e.y);
          const currentDistance = Math.sqrt(currentDx * currentDx + currentDy * currentDy);

          // Hedefe ulaştıysa veya süre dolduysa çarpışma başlat
          if (currentDistance < 25 || newFrame >= e.totalFrames) {
            return { 
              ...e, 
              isColliding: true, 
              vx: 0, 
              vy: 0,
              x: e.targetX, // Tam hedefe konumla
              y: e.targetY 
            };
          }

          // Yerçekimi etkisi
          const newVy = e.vy + e.gravity;
          
          // Pozisyonu güncelle
          const newX = e.x + e.vx;
          const newY = e.y + e.vy;
          
          // Scale'i artır (yaklaştıkça büyüt)
          const scaleProgress = newFrame / e.totalFrames;
          const newScale = 0.3 + (scaleProgress * 0.7);

          return {
            ...e,
            x: newX,
            y: newY,
            vy: newVy,
            rotation: e.fromLeft ? e.rotation + 10 : e.rotation - 10,
            scale: Math.min(newScale, 1),
            frame: newFrame
          };
        });
      });

      // 5 saniye sonra otomatik kaldır
      if (Date.now() - newEmoji.startTime > 5000) {
        clearInterval(updateInterval);
        setThrownEmojis(prev => prev.filter(e => e.id !== emojiId));
      }
    }, 16);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <AnimatePresence>
        {thrownEmojis.map((emojiObj) => (
          <motion.div
            key={emojiObj.id}
            className="absolute text-4xl select-none"
            initial={{ scale: emojiObj.scale, opacity: 0 }}
            animate={{
              scale: emojiObj.scale,
              opacity: emojiObj.opacity,
            }}
            exit={{ 
              scale: 1.5, 
              opacity: 0,
              transition: { duration: 0.2 }
            }}
            style={{
              left: emojiObj.x - 20,
              top: emojiObj.y - 20,
              transform: `rotate(${emojiObj.rotation}deg)`,
            }}
          >
            {emojiObj.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 