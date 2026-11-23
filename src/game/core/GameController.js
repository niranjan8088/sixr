import { globalInput } from './InputManager';
import { globalCollisions } from './CollisionManager';
import { GameEvents, EVENT_TYPES } from './GameEvents';
import { useGameStore } from '../../store/gameStore';
import { GAME_PHASES } from '../../utils/constants';

/**
 * GameController coordinates core interactions, pause states, and global inputs.
 */
export class GameControllerClass {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    // Attach input handlers
    globalInput.init(
      () => this.handleInteractionTrigger(),
      () => this.handlePauseTrigger()
    );

    this.initialized = true;
  }

  handleInteractionTrigger() {
    const { phase, interaction, openRescueModal, triggerExtraction, activeRescueSurvivor } = useGameStore.getState();

    // If already in a rescue modal, ignore interaction trigger
    if (activeRescueSurvivor) return;

    if (phase !== GAME_PHASES.PLAYING && phase !== GAME_PHASES.EXTRACTION) return;

    if (interaction.active && interaction.targetId) {
      if (interaction.targetType === 'SURVIVOR') {
        const survivor = useGameStore.getState().survivors.find((s) => s.id === interaction.targetId);
        if (survivor && survivor.status !== 'RESCUED') {
          openRescueModal(interaction.targetId);
        } else if (survivor) {
          useGameStore.getState().showNotification(`${survivor.name} is already stabilized.`, 'info', 2000);
        }
      } else if (interaction.targetType === 'EXTRACTION') {
        triggerExtraction();
      }
    }
  }

  handlePauseTrigger() {
    const { phase, togglePause, activeRescueSurvivor, closeRescueModal } = useGameStore.getState();

    // If modal is open, close it first
    if (activeRescueSurvivor) {
      closeRescueModal();
      return;
    }

    if (phase === GAME_PHASES.PLAYING || phase === GAME_PHASES.PAUSED) {
      togglePause();
    }
  }

  destroy() {
    globalInput.cleanup();
    globalCollisions.clear();
    GameEvents.clear();
    this.initialized = false;
  }
}

export const GameController = new GameControllerClass();

