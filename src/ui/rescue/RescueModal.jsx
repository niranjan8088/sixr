import React from 'react';
import { useGameStore } from '../../store/gameStore';
import RescuePanel from './RescuePanel';

/**
 * RescueModal — Integrates RescuePanel with the game store
 */
export default function RescueModal() {
  const activeSurvivor = useGameStore((state) => state.activeRescueSurvivor);
  const closeRescueModal = useGameStore((state) => state.closeRescueModal);
  const performRescue = useGameStore((state) => state.performRescue);
  const supplies = useGameStore((state) => state.supplies);

  if (!activeSurvivor) return null;

  return (
    <RescuePanel
      survivor={activeSurvivor}
      supplies={supplies}
      onClose={closeRescueModal}
      onConfirmRescue={(decision) => {
        performRescue(decision.survivorId, decision.supplyUsed);
      }}
    />
  );
}

export { RescuePanel };
