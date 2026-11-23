import { useGameStore } from '../store/gameStore';

/**
 * rescueSystem
 * Handles survivor medical triage, supply deduction, and rescue resolution.
 */
export const rescueSystem = {
  getSurvivors: () => useGameStore.getState().survivors,

  getSurvivorById: (id) => {
    return useGameStore.getState().survivors.find((s) => s.id === id);
  },

  attemptRescue: (survivorId, supplyType) => {
    const store = useGameStore.getState();
    return store.performRescue(survivorId, supplyType);
  }
};

