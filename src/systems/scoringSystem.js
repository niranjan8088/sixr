import { useGameStore } from '../store/gameStore';
import { GameConfig } from '../game/GameConfig';
import { calculateRank } from '../utils/helpers';

/**
 * scoringSystem
 * Calculates scores, bonuses, and performance ranks consistently.
 */
export const scoringSystem = {
  calculateScore: (survivorsSaved, timeRemaining, remainingSupplies, completedObjectives = 0, success = true) => {
    if (!success) {
      return {
        totalPoints: Math.floor(survivorsSaved * GameConfig.scoring.survivorSavedPoints * 0.5),
        rank: 'F',
        survivorsBonus: Math.floor(survivorsSaved * GameConfig.scoring.survivorSavedPoints * 0.5),
        timeBonus: 0,
        suppliesBonus: 0,
        objectivesBonus: 0,
        cleanRescueBonus: 0
      };
    }

    const survivorsBonus = survivorsSaved * GameConfig.scoring.survivorSavedPoints;
    const timeBonus = Math.floor(timeRemaining * GameConfig.scoring.timeRemainingMultiplier);
    const suppliesBonus =
      (remainingSupplies.medkits + remainingSupplies.oxygen + remainingSupplies.toolkits) *
      GameConfig.scoring.unusedSupplyPoints;
    const objectivesBonus = completedObjectives * (GameConfig.scoring.objectiveBonus || 100);
    const cleanRescueBonus = survivorsSaved === 3 ? GameConfig.scoring.cleanRescueBonus : 0;

    const totalPoints = survivorsBonus + timeBonus + suppliesBonus + objectivesBonus + cleanRescueBonus;
    const rank = calculateRank(totalPoints);

    return {
      totalPoints,
      rank,
      survivorsBonus,
      timeBonus,
      suppliesBonus,
      objectivesBonus,
      cleanRescueBonus
    };
  }
};
