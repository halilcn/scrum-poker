import Link from "next/link";
import Header from "./components/Header";
import SprintTitle from "./components/SprintTitle";
import VotingCards from "./components/VotingCards";
import GameContent from "./components/GameContent";
import { RoomProvider } from "./context/RoomContext";

export default function ScrumRoom({ params }) {
  return (
    <RoomProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        {/* Content Area - Header altındaki tüm alan */}
        <main className="flex-1 flex flex-col">
          {/* Sprint Title - Content'in en üstü */}
          <div className="pt-8 px-6">
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
}
