"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeftRight } from "lucide-react";
import { COLORS } from "@/constants";
import { getProximityInfo } from "@/utils/calculateAverage";

const BADGE_STYLES = {
  active: {
    backgroundColor: COLORS.primaryBlue,
    color: "#fff",
  },
  muted: {
    backgroundColor: "transparent",
    color: COLORS.gray400,
    border: `1.5px solid ${COLORS.gray300}`,
  },
};

function Badge({ value, isActive }) {
  return (
    <span
      className="text-sm font-semibold rounded-full px-2.5 py-0.5 min-w-[28px] text-center"
      style={isActive ? BADGE_STYLES.active : BADGE_STYLES.muted}
    >
      {value}
    </span>
  );
}

export default function NearestPointIndicator({ average }) {
  if (!average || average === 0) return null;

  const { isExactMatch, lowerCard, upperCard, closestCard, percentage } =
    getProximityInfo(average);

  if (isExactMatch) {
    return (
      <motion.div
        className="flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span
          className="text-2xl font-bold"
          style={{ color: COLORS.darkNavy }}
        >
          {closestCard}
        </span>
        <div className="flex items-center gap-1">
          <CheckCircle2
            className="w-3.5 h-3.5"
            style={{ color: "#10b981" }}
          />
          <span
            className="text-xs font-medium"
            style={{ color: COLORS.gray400 }}
          >
            Exact scrum point
          </span>
        </div>
      </motion.div>
    );
  }

  const isMiddle = percentage === 50;
  const isCloserToUpper = percentage > 50;
  const clampedPct = Math.max(8, Math.min(92, percentage));

  return (
    <motion.div
      className="flex flex-col items-center mt-1.5 gap-1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-0">
        <Badge
          value={lowerCard}
          isActive={isMiddle || !isCloserToUpper}
        />

        <div className="relative w-[120px] h-[3px] mx-1" style={{ backgroundColor: COLORS.gray200 }}>
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: `${clampedPct}%`,
              backgroundColor: COLORS.primaryBlue,
              opacity: 0.3,
            }}
          />
          <div
            className="absolute top-0 h-full"
            style={{
              left: `${clampedPct}%`,
              right: 0,
              backgroundColor: COLORS.gray300,
              opacity: 0.3,
            }}
          />
          <div
            className="absolute top-1/2 w-[10px] h-[10px] rounded-full border-2 border-white shadow-md"
            style={{
              left: `${clampedPct}%`,
              transform: "translate(-50%, -50%)",
              backgroundColor: COLORS.primaryBlue,
            }}
          />
        </div>

        <Badge
          value={upperCard}
          isActive={isMiddle || isCloserToUpper}
        />
      </div>

      {isMiddle && (
        <ArrowLeftRight
          className="w-3.5 h-3.5"
          style={{ color: COLORS.gray400 }}
        />
      )}
    </motion.div>
  );
}
