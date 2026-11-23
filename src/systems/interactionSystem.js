import { useGameStore } from '../store/gameStore';

/**
 * interactionSystem
 * Handles player interaction requests and triggers appropriate action.
 */
export const interactionSystem = {
  getCurrentInteraction: () => useGameStore.getState().interaction,

  triggerInteraction: () => {
    const { interaction, openRescueModal, triggerExtraction } = useGameStore.getState();
    if (!interaction.active) return false;

    if (interaction.targetType === 'SURVIVOR') {
      openRescueModal(interaction.targetId);
      return true;
    } else if (interaction.targetType === 'EXTRACTION') {
      triggerExtraction();
      return true;
    }
    return false;
  }
};

