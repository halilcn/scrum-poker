"use client";

import PlayingCard from "./PlayingCard";
import { COLORS } from "@/constants";
import { useRoom } from "@/app/rooms/[hashId]/context/RoomContext";
import { Card } from "@/components/ui/card";
import { forwardRef, useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { addReaction } from "@/lib/firebase/actions";
import { getUserIdCookie } from "@/utils/cookieActions";

import "./PlayerCard.css";

const PlayerCard = forwardRef(function PlayerCard({ player }, ref) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [showRevealedCard, setShowRevealedCard] = useState(false);
  const emojiPickerRef = useRef(null);
  const previousStatusRef = useRef(null);

  const { status, currentUser } = useRoom();

  // Status değişimini takip et
  useEffect(() => {
    // İlk mount'ta previousStatusRef'i set et
    if (previousStatusRef.current === null) {
      previousStatusRef.current = status;
      
      // İlk mount'ta status zaten completed ise kartları direkt göster
      if (status === "completed") {
        setShowRevealedCard(true);
      }
      return;
    }

    // Status voting'den completed'a geçtiğinde
    if (previousStatusRef.current === "voting" && status === "completed") {
      // 5 saniye bekle ve kartları göster
      const timer = setTimeout(() => {
        setShowRevealedCard(true);
      }, 5000);

      return () => clearTimeout(timer);
    }

    // Status voting'e geri döndüğünde kartları gizle
    if (status === "voting") {
      setShowRevealedCard(false);
    }

    // Önceki status'u güncelle
    previousStatusRef.current = status;
  }, [status]);

  // Emoji picker dışına tıklandığında kapat
  useClickOutside(emojiPickerRef, () => {
    setIsEmojiPickerOpen(false);
  });

  const renderCard = () => {
    const hasPoint = player.point !== null && player.point !== undefined;

    // Eğer room status voting ise ve point var ise, blue background ile kapalı kart göster
    if (status === "voting" && hasPoint) {
      return (
        <Card
          className="w-12 h-16 border-2 shadow-lg flex items-center justify-center"
          style={{
            backgroundColor: COLORS.blue500,
            borderColor: COLORS.blue600,
          }}
        >
          <div
            className="w-6 h-6 rounded-full backdrop-blur-sm"
            style={{ backgroundColor: `${COLORS.white}30` }}
          ></div>
        </Card>
      );
    }

    // Eğer room status completed ise ve point var ise
    if (status === "completed" && hasPoint) {
      // showRevealedCard true olana kadar kapalı kart göster
      if (!showRevealedCard) {
        return (
          <Card
            className="w-12 h-16 border-2 shadow-lg flex items-center justify-center"
            style={{
              backgroundColor: COLORS.blue500,
              borderColor: COLORS.blue600,
            }}
          >
            <div
              className="w-6 h-6 rounded-full backdrop-blur-sm"
              style={{ backgroundColor: `${COLORS.white}30` }}
            ></div>
          </Card>
        );
      }
      // 5 saniye sonra açık kart göster
      return <PlayingCard isRevealed={true} value={player.point} />;
    }

    // Default durum: kapalı kart
    return <PlayingCard isRevealed={false} value={player.point ?? "?"} />;
  };

  const handleThrowEmoji = async (emoji) => {
    // Firebase'e reaction ekle
    try {
      await addReaction(player.userId, emoji);
    } catch (error) {
      console.error("Reaction gönderilirken hata:", error);
    }
  };

  const handleOnMouseEnterPlayerCard = () => {
    const currentUserId = getUserIdCookie();
    // Kendi kartına gelince emoji picker açma
    if (currentUserId === player.userId) {
      return;
    }
    setIsEmojiPickerOpen(true);
  };

  const handleOnMouseLeavePlayerCard = () => {
    setIsEmojiPickerOpen(false);
  };

  const handleOnReactionClick = (emojiData) => {
    handleThrowEmoji(emojiData.emoji);
  };

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-2 p-2 relative"
      onMouseEnter={handleOnMouseEnterPlayerCard}
      onMouseLeave={handleOnMouseLeavePlayerCard}
    >
      {/* Kart Alanı */}
      <div>{renderCard()}</div>

      {isEmojiPickerOpen && (
        <div
          ref={emojiPickerRef}
          className="absolute top-[-50px] left-auto right-auto"
        >
          <EmojiPicker
            reactionsDefaultOpen={true}
            onReactionClick={handleOnReactionClick}
            onEmojiClick={handleOnReactionClick}
          />
        </div>
      )}

      {/* Kullanıcı İsmi */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 max-w-[110px]">
        <p
          className="text-sm font-medium truncate"
          style={{ color: COLORS.gray800 }}
          title={player.username}
        >
          {player.username}
        </p>
      </div>
    </div>
  );
});

export default PlayerCard;
