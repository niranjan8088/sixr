import { useGameStore } from '../store/gameStore';

/**
 * missionSystem
 * Handles mission progression, phase initialization, and objective updates.
 */
export const missionSystem = {
  getMissionState: () => useGameStore.getState().mission,

  getObjectives: () => useGameStore.getState().objectives,

  startMission: () => {
    useGameStore.getState().startMission();
  },

  updateObjective: (text) => {
    const store = useGameStore.getState();
    useGameStore.setState({
      mission: {
        ...store.mission,
        currentObjective: text
      }
    });
  },

  checkExtractionAvailability: () => {
    const { mission } = useGameStore.getState();
    return mission.isExtractionReady;
  },

  completeMission: (success) => {
    useGameStore.getState().completeMission(success);
  }
};
