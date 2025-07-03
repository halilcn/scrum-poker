"use client";

import PlayingCard from "./PlayingCard";
import { COLORS } from "@/constants";
import { useRoom } from "@/app/rooms/[hashId]/context/RoomContext";
import { Card } from "@/components/ui/card";
import { forwardRef, useState, useRef, useEffect, useMemo } from "react";
import EmojiPicker from "emoji-picker-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { addReaction } from "@/lib/firebase/actions";
import { getUserIdCookie } from "@/utils/cookieActions";
import { MoreVertical, Coffee } from "lucide-react";
import UserActionsDialog from "./UserActionsDialog";
import CardTooltip from "@/components/CardTooltip";
import { calculateAverage, shouldShowTooltip } from "@/utils/calculateAverage";

import "./PlayerCard.css";

const PlayerCard = forwardRef(function PlayerCard({ player }, ref) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [showRevealedCard, setShowRevealedCard] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [shouldShowDiffTooltip, setShouldShowDiffTooltip] = useState(false);
  const emojiPickerRef = useRef(null);
  const previousStatusRef = useRef(null);

  const { status, currentUser, isRoomCreator, participants } = useRoom();

  // Tooltip hesaplamalarını optimize et
  const tooltipData = useMemo(() => {
    if (!participants || !player.point) {
      return { 
        roundedAverage: null, 
        shouldShow: false, 
        isLower: false, 
        isHigher: false 
      };
    }

    const { roundedAverage } = calculateAverage(participants);
    const tooltipConfig = shouldShowTooltip(player.point, roundedAverage);

    return {
      roundedAverage,
      shouldShow: tooltipConfig.shouldShow,
      isLower: tooltipConfig.isLower,
      isHigher: tooltipConfig.isHigher
    };
  }, [participants, player.point]);

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
        
        // Kartlar açıldıktan sonra tooltip kontrolü yap
        checkAndShowTooltip();
      }, 5000);

      return () => clearTimeout(timer);
    }

    // Status voting'e geri döndüğünde kartları gizle ve tooltip'i kapat
    if (status === "voting") {
      setShowRevealedCard(false);
      setShouldShowDiffTooltip(false);
    }

    // Önceki status'u güncelle
    previousStatusRef.current = status;
  }, [status]);

  // Emoji picker dışına tıklandığında kapat
  useClickOutside(emojiPickerRef, () => {
    setIsEmojiPickerOpen(false);
  });

  // Tooltip kontrolü yap - tüm oyuncular için
  const checkAndShowTooltip = () => {
    // Herhangi bir oyuncunun puanı ortalamadan farklıysa, 
    // o oyuncunun kartında tooltip göster (tüm oyunculara görünür)
    if (tooltipData.shouldShow) {
      setShouldShowDiffTooltip(true);
    }
  };

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

  const handleOnMouseLeavePlayerCard = (e) => {
    // Mouse dialog'a gidiyorsa emoji picker'ı kapatma
    if (e.relatedTarget?.closest('[role="dialog"]')) {
      return;
    }
    setIsEmojiPickerOpen(false);
  };

  const handleOnReactionClick = (emojiData) => {
    handleThrowEmoji(emojiData.emoji);
  };

  const handleSettingsClick = (e) => {
    e.stopPropagation();
    setIsEmojiPickerOpen(false);
    setIsSettingsDialogOpen(true);
  };

  return (
    <>
      <div
        ref={ref}
        className="flex flex-col items-center gap-2 p-2 relative"
        onMouseEnter={handleOnMouseEnterPlayerCard}
        onMouseLeave={handleOnMouseLeavePlayerCard}
      >
        {/* Kart Alanı */}
        <CardTooltip
          userPoint={player.point}
          roundedAverage={tooltipData.roundedAverage}
          shouldShow={shouldShowDiffTooltip}
          isLower={tooltipData.isLower}
          isHigher={tooltipData.isHigher}
        >
          <div>{renderCard()}</div>
        </CardTooltip>

        {isEmojiPickerOpen && (
          <div
            ref={emojiPickerRef}
            className="absolute top-[-50px] left-auto right-auto flex items-center gap-2"
          >
            <div>
              <EmojiPicker
                reactionsDefaultOpen={true}
                onReactionClick={handleOnReactionClick}
                onEmojiClick={handleOnReactionClick}
                reactions={["1f44d", "2764-fe0f", "1f621", "1f602"]}
              />
            </div>
            {isRoomCreator && (
              <button
                onClick={handleSettingsClick}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors cursor-pointer shadow-sm"
                style={{ backgroundColor: COLORS.white }}
              >
                <MoreVertical size={18} color={COLORS.gray600} />
              </button>
            )}
          </div>
        )}

        {/* Kullanıcı İsmi */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 max-w-[110px]">
          <div className="flex items-center justify-center gap-1">
            <p
              className="text-sm font-medium truncate"
              style={{ color: COLORS.gray800 }}
              title={player.username}
            >
              {player.username}
            </p>
            {player.breakStatus && player.breakStatus !== "none" && (
              <Coffee
                className="w-4 h-4 flex-shrink-0"
                style={{ color: COLORS["stori-poi"] }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <UserActionsDialog
        isOpen={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
        player={player}
      />
    </>
  );
});

export default PlayerCard;
