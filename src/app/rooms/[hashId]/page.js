"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "./components/Header";
import SprintTitle from "./components/SprintTitle";
import VotingCards from "./components/VotingCards";
import GameContent from "./components/GameContent";
import { RoomProvider } from "./context/RoomContext";
import withRedirectPage from "@/hocs/withRedirectPage";
import {
  checkRoomExists,
  checkUserIsParticipant,
  joinRoom,
  setParticipantActive,
  setParticipantInactive,
} from "@/lib/firebase/actions";
import {
  getUserIdCookie,
  getUsernameCookie,
  getRoomIdCookie,
  setRoomIdCookie,
} from "@/utils/cookieActions";
import Test from "./components/Test";

const ScrumRoom = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldSetBeforeUnloadListener, setShouldSetBeforeUnloadListener] =
    useState(false);
  const router = useRouter();
  const { hashId: urlRoomId } = useParams();

  useEffect(() => {
    const handleRoomSync = async () => {
      try {
        const userId = getUserIdCookie();
        const username = getUsernameCookie();
        const cookieRoomId = getRoomIdCookie();

        // Kullanıcı bilgileri kontrolü
        if (!userId || !username) {
          router.replace("/login");
          return;
        }

        // URL'deki room ID ile cookie'deki farklı ise, cookie'yi güncelle
        if (urlRoomId !== cookieRoomId) {
          // Eski room'dan kullanıcıyı pasif yap
          if (cookieRoomId) {
            await setParticipantInactive(cookieRoomId);
          }

          // Önce room'un var olup olmadığını kontrol et
          const roomExists = await checkRoomExists(urlRoomId);
          if (!roomExists) {
            throw new Error("Room does not exist");
          }

          // Cookie'yi güncelle
          setRoomIdCookie(urlRoomId);
        }

        // Kullanıcının bu room'da participant olup olmadığını kontrol et
        const isParticipant = await checkUserIsParticipant(urlRoomId, userId);

        // Eğer participant değilse, joinRoom ile katıl
        if (!isParticipant) {
          await joinRoom(urlRoomId);
        }

        // Kullanıcıyı active yap
        await setParticipantActive();

        setIsLoading(false);
        setShouldSetBeforeUnloadListener(true);
      } catch (err) {
        console.error("Room sync error:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    handleRoomSync();
  }, [urlRoomId, router]);

  // Kullanıcının sayfayı kapatması/tarayıcıyı kapatması durumunu handle et
  useEffect(() => {
    if (!shouldSetBeforeUnloadListener) return;

    const userId = getUserIdCookie();
    if (!userId || !urlRoomId) return;

    const handleBeforeUnload = async () => {
      try {
        await setParticipantInactive();
      } catch (error) {
        console.error("Error setting participant inactive:", error);
      }
    };

    // Event listener'ı ekle
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Component unmount olduğunda da inactive yap
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Component unmount olduğunda kullanıcıyı inactive yap
      setParticipantInactive().catch((error) => {
        console.error("Error setting participant inactive on unmount:", error);
      });
    };
  }, [urlRoomId, shouldSetBeforeUnloadListener]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.replace("/")}
            className="text-blue-600 hover:underline"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <RoomProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        {/* <Test /> */}
        {/* Content Area - Header altındaki tüm alan */}
        <main className="flex-1 flex flex-col">
          {/* Sprint Title - Content'in en üstü */}
          <div className="pt-4">
            <SprintTitle />
          </div>

          {/* Main Content Area - Geri kalan alan */}
          <div className="flex-1 px-6 pb-24">
            <GameContent />
          </div>
        </main>

        {/* Voting Cards - Fixed bottom */}
        <VotingCards />
      </div>
    </RoomProvider>
  );
};

export default withRedirectPage(ScrumRoom);
