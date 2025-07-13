/**
 * Check if all active users have voted the same point
 * @param {Object} participants - Room participants object
 * @returns {Object} - { hasConsensus: boolean, consensusPoint: string|null, activeVoters: number }
 */
export const checkVotingConsensus = (participants) => {
  // Get all active participants with points
  const activeParticipants = Object.values(participants || {}).filter(
    (participant) => participant.isActive && participant.point !== null && participant.point !== undefined
  );

  // Need at least 2 users to have consensus
  if (activeParticipants.length < 2) {
    return {
      hasConsensus: false,
      consensusPoint: null,
      activeVoters: activeParticipants.length,
    };
  }

  // Check if all points are the same
  const firstPoint = activeParticipants[0].point;
  const hasConsensus = activeParticipants.every((participant) => participant.point === firstPoint);

  return {
    hasConsensus,
    consensusPoint: hasConsensus ? firstPoint : null,
    activeVoters: activeParticipants.length,
  };
}; 