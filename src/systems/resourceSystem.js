import { useGameStore } from '../store/gameStore';

/**
 * resourceSystem
 * Manages player equipment, medkits, oxygen canisters, and toolkits.
 */
export const resourceSystem = {
  getSupplies: () => useGameStore.getState().supplies,

  hasSupply: (supplyType) => {
    const supplies = useGameStore.getState().supplies;
    return supplies[supplyType] > 0;
  },

  useSupply: (supplyType) => {
    const store = useGameStore.getState();
    const supplies = store.supplies;
    if (supplies[supplyType] > 0) {
      useGameStore.setState({
        supplies: {
          ...supplies,
          [supplyType]: supplies[supplyType] - 1
        }
      });
      return true;
    }
    return false;
  }
};

