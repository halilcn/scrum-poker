import { cardValues } from "@/constants";

/**
 * Calculate average from participants and round to nearest card value
 * @param {Object} participants - Room participants object
 * @returns {Object} - { average: number, roundedAverage: string }
 */
export const calculateAverage = (participants) => {
  const numericPoints = Object.values(participants)
    .filter((participant) => participant.point !== "?" && !!participant.point)
    .map((participant) => Number(participant.point));

  if (numericPoints.length === 0) return { average: 0, roundedAverage: "1" };

  const sum = numericPoints.reduce((acc, point) => acc + point, 0);
  const average = sum / numericPoints.length;

  // Find the nearest card value
  const roundedAverage = findNearestCardValue(average);

  return { average: parseFloat(average.toFixed(1)), roundedAverage };
};

/**
 * Find the nearest card value to the given number
 * @param {number} value - The value to round
 * @returns {string} - The nearest card value
 */
export const findNearestCardValue = (value) => {
  const numericCardValues = cardValues.map(Number);
  
  // Find the closest card value
  let closest = numericCardValues[0];
  let minDiff = Math.abs(value - closest);

  for (const cardValue of numericCardValues) {
    const diff = Math.abs(value - cardValue);
    if (diff < minDiff) {
      minDiff = diff;
      closest = cardValue;
    }
  }

  return closest.toString();
};

/**
 * Check if user's point should show tooltip based on difference from rounded average
 * @param {string|number} userPoint - User's selected point
 * @param {string} roundedAverage - Rounded average point
 * @returns {Object} - { shouldShow: boolean, isLower: boolean, isHigher: boolean }
 */
export const shouldShowTooltip = (userPoint, roundedAverage) => {
  if (!userPoint || userPoint === "?" || !roundedAverage) {
    return { shouldShow: false, isLower: false, isHigher: false };
  }

  const userPointNum = Number(userPoint);
  const averageNum = Number(roundedAverage);
  const numericCardValues = cardValues.map(Number);

  // Find indices in card values array
  const userIndex = numericCardValues.indexOf(userPointNum);
  const averageIndex = numericCardValues.indexOf(averageNum);

  if (userIndex === -1 || averageIndex === -1) {
    return { shouldShow: false, isLower: false, isHigher: false };
  }

  // Check if difference is 2 or more steps in card values array
  const diff = Math.abs(userIndex - averageIndex);
  
  if (diff >= 2) {
    return {
      shouldShow: true,
      isLower: userIndex < averageIndex,
      isHigher: userIndex > averageIndex
    };
  }

  return { shouldShow: false, isLower: false, isHigher: false };
};

/**
 * Get proximity info showing which two card values the average falls between
 * and how close it is to each one.
 * @param {number} average - The calculated average
 * @returns {Object} - { isExactMatch, lowerCard, upperCard, closestCard, percentage }
 */
export const getProximityInfo = (average) => {
  const numericCardValues = cardValues.map(Number);
  const min = numericCardValues[0];
  const max = numericCardValues[numericCardValues.length - 1];

  const clamped = Math.max(min, Math.min(max, average));

  const exactMatch = numericCardValues.find((v) => v === clamped);
  if (exactMatch !== undefined) {
    return {
      isExactMatch: true,
      lowerCard: exactMatch,
      upperCard: exactMatch,
      closestCard: exactMatch,
      percentage: 50,
    };
  }

  let lowerCard = numericCardValues[0];
  let upperCard = numericCardValues[numericCardValues.length - 1];

  for (let i = 0; i < numericCardValues.length - 1; i++) {
    if (clamped > numericCardValues[i] && clamped < numericCardValues[i + 1]) {
      lowerCard = numericCardValues[i];
      upperCard = numericCardValues[i + 1];
      break;
    }
  }

  const percentage = ((clamped - lowerCard) / (upperCard - lowerCard)) * 100;
  const closestCard = percentage > 50 ? upperCard : lowerCard;

  return { isExactMatch: false, lowerCard, upperCard, closestCard, percentage };
};