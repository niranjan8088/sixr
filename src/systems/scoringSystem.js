import { useGameStore } from '../store/gameStore';
import { GameConfig } from '../game/GameConfig';
import { calculateRank } from '../utils/helpers';

/**
 * scoringSystem
 * Calculates scores, bonuses, and performance ranks.
 */
export const scoringSystem = {
  calculateScore: (survivorsSaved, timeRemaining, remainingSupplies, success = true) => {
    if (!success) {
      return {
        totalPoints: Math.floor(survivorsSaved * GameConfig.scoring.survivorSavedPoints * 0.5),
        rank: 'F',
        survivorsBonus: 0,
        timeBonus: 0,
        suppliesBonus: 0
      };
    }

    const survivorsBonus = survivorsSaved * GameConfig.scoring.survivorSavedPoints;
    const timeBonus = Math.floor(timeRemaining * GameConfig.scoring.timeRemainingMultiplier);
    const suppliesBonus = (remainingSupplies.medkits + remainingSupplies.oxygen + remainingSupplies.toolkits) * GameConfig.scoring.unusedSupplyPoints;
    const totalPoints = survivorsBonus + timeBonus + suppliesBonus + GameConfig.scoring.cleanRescueBonus;
    const rank = calculateRank(totalPoints);

    return {
      totalPoints,
      rank,
      survivorsBonus,
      timeBonus,
      suppliesBonus
    };
  }
};

