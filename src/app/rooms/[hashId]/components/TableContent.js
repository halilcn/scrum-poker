"use client";

import { COLORS } from "@/constants";
import { useRoom } from "@/app/rooms/[hashId]/context/RoomContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  updateRoomStatus,
  resetRoomForNewVoting,
} from "@/lib/firebase/actions";
import Lottie from "lottie-react";
import { useState, useEffect, useRef } from "react";
import { calculateAverage } from "@/utils/calculateAverage";

// Status constants
const ROOM_STATUS = {
  VOTING: "voting",
  WAITING: "waiting",
  COMPLETED: "completed",
};

// Animation variants
const contentVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.9,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

// Create motion version of Button
const MotionButton = motion(Button);

// Micro components for different statuses
const VotingContent = ({ isRoomCreator }) => {
  const handleShowCards = async () => {
    await updateRoomStatus("completed");
  };

  if (!isRoomCreator) {
    return (
      <motion.div
        className="text-center flex flex-col items-center justify-center"
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        key="voting"
      >
        <Lottie
          animationData={null}
          path="/lottie/time.json"
          loop
          autoplay
          style={{ width: 50, height: 50 }}
        />
        <p className="text-sm text-gray-500 mt-2">Waiting for cards...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="text-center"
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      key="voting"
    >
      <MotionButton
        className="bg-green-600 hover:bg-green-700 text-white"
        size="lg"
        whileTap={{ scale: 0.95 }}
        onClick={handleShowCards}
      >
        Show Cards
      </MotionButton>
    </motion.div>
  );
};

const WaitingContent = ({ isRoomCreator }) => {
  const handleStartNewPoker = async () => {
    await updateRoomStatus("voting");
  };

  if (!isRoomCreator) {
    return (
      <motion.div
        className="text-center"
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        key="waiting"
      >
        <div className="flex flex-col items-center justify-center">
          <Lottie
            animationData={null}
            path="/lottie/sleep.json"
            loop
            autoplay
            style={{ width: 50, height: 50 }}
          />
          <p className="text-sm text-gray-500 mt-2">
            Waiting to start a new poker...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="text-center"
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      key="waiting"
    >
      <MotionButton
        size="lg"
        whileTap={{ scale: 0.95 }}
        onClick={handleStartNewPoker}
      >
        Start New Poker
      </MotionButton>
    </motion.div>
  );
};

const CompletedContent = ({
  participants,
  isRoomCreator,
  showCountdown,
  onCountdownComplete,
  mounted,
}) => {
  // Countdown gösteriliyorsa, countdown component'ini göster
  if (showCountdown) {
    return (
      <motion.div
        className="text-center flex flex-col items-center justify-center"
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        key="countdown"
      >
        <Lottie
          animationData={null}
          path="/lottie/countdown.json"
          loop={false}
          autoplay
          style={{ width: 100, height: 100 }}
          onComplete={onCountdownComplete}
        />
      </motion.div>
    );
  }

  // Calculate average from participants with numeric points
  console.log("participants", participants);
  const { average } = calculateAverage(participants);

  const handleStartAgain = async () => {
    await resetRoomForNewVoting();
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center"
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      key="completed"
    >
      <motion.p
        className="text-lg font-medium"
        style={{ color: `${COLORS.gray600}` }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Average: {average}
      </motion.p>
      {isRoomCreator && (
        <MotionButton
          size="lg"
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleStartAgain}
          className="mt-4"
        >
          Start Again
        </MotionButton>
      )}
    </motion.div>
  );
};

export default function TableContent() {
  const { status, participants, isRoomCreator } = useRoom();
  const [showCountdown, setShowCountdown] = useState(false);
  const previousStatusRef = useRef(status);
  const isMountedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // İlk mount'ta isMountedRef'i true yap
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      previousStatusRef.current = status;
      return;
    }

    // Status değişimini kontrol et
    if (
      previousStatusRef.current === ROOM_STATUS.VOTING &&
      status === ROOM_STATUS.COMPLETED &&
      mounted
    ) {
      // voting'den completed'a geçiş olduysa countdown'u göster
      setShowCountdown(true);
    }

    // Önceki status'u güncelle
    previousStatusRef.current = status;
  }, [status]);

  const handleCountdownComplete = () => {
    setShowCountdown(false);
  };

  // Status değiştiğinde (voting'e geçişte) countdown'u resetle
  useEffect(() => {
    if (status === ROOM_STATUS.VOTING) {
      setShowCountdown(false);
    }
  }, [status]);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 1000);
  }, []);

  const renderContent = () => {
    switch (status) {
      case ROOM_STATUS.VOTING:
        return <VotingContent isRoomCreator={isRoomCreator} />;
      case ROOM_STATUS.WAITING:
        return <WaitingContent isRoomCreator={isRoomCreator} />;
      case ROOM_STATUS.COMPLETED:
        return (
          <CompletedContent
            participants={participants}
            isRoomCreator={isRoomCreator}
            showCountdown={showCountdown}
            onCountdownComplete={handleCountdownComplete}
            mounted={mounted}
          />
        );
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
    </div>
  );
}
