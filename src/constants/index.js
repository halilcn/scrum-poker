export const COLORS = {
  // Neutrals (unchanged)
  white: "#fafafa",
  gray50: "#f5f5f5",
  gray100: "#e5e5e5",
  gray200: "#d4d4d4",
  gray300: "#a3a3a3",
  gray400: "#737373",
  gray500: "#525252",
  gray600: "#404040",
  gray700: "#262626",
  gray800: "#171717",
  black: "#0a0a0a",

  // Brand palette
  primaryBlue: "#3F72AF",  // --primary
  darkNavy: "#112D4E",     // Dark emphasis
  softBlue: "#DBE2EF",     // --secondary
  snow: "#F9F7F7",         // --background

  // Legacy (maps to primaryBlue)
  "stori-poi": "#3F72AF",

  // Keep blue utilities for places not yet migrated
  blue400: "#60a5fa",
  blue500: "#3b82f6",
  blue600: "#2563eb",
};

export const VOTING_CARDS = {
  UNKNOWN: "?",
};

export const cardValues = ["1", "2", "3", "5", "8", "13", "21"];

// Timing constants
export const TIMING = {
  CARD_REVEAL_DELAY: 3125,
  CONFETTI_DURATION: 3125,
};
