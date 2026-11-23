import { useGameStore } from '../store/gameStore';

/**
 * resourceSystem
 * Manages player equipment, medkits, oxygen canisters, and toolkits.
 * Prevents negative values.
 */
export const resourceSystem = {
  getSupplies: () => useGameStore.getState().supplies,

  hasSupply: (supplyType) => {
    const supplies = useGameStore.getState().supplies;
    return supplies && supplies[supplyType] > 0;
  },

  useSupply: (supplyType) => {
    const store = useGameStore.getState();
    const supplies = store.supplies;
    if (supplies && supplies[supplyType] > 0) {
      useGameStore.setState({
        supplies: {
          ...supplies,
          [supplyType]: Math.max(0, supplies[supplyType] - 1)
        }
      });
      return true;
    }
    return false;
  }
};
