import { create } from 'zustand';
import { GameConfig } from '../game/GameConfig';
import { GAME_PHASES, SURVIVOR_STATUS } from '../utils/constants';
import { calculateRank } from '../utils/helpers';
import { GameEvents, EVENT_TYPES } from '../game/core/GameEvents';

export const useGameStore = create((set, get) => ({
  // Core Phase
  phase: GAME_PHASES.MENU,

  // Player State
  player: {
    position: [...GameConfig.player.spawnPosition],
    rotation: 0,
    speed: 0,
    isMoving: false,
    isSprinting: false,
    health: 100,
    stamina: 100
  },

  // Camera State (shared for minimap or overlay sync)
  cameraRotation: {
    yaw: 0,
    pitch: 0.15
  },

  // Mission State
  mission: {
    id: GameConfig.mission.id,
    title: GameConfig.mission.title,
    codename: GameConfig.mission.codename,
    briefing: GameConfig.mission.briefing,
    timer: GameConfig.mission.initialTimer,
    elapsed: 0,
    totalSurvivors: GameConfig.mission.totalSurvivors,
    survivorsRescued: 0,
    currentObjective: 'Search devastated Sector 4-B and locate 3 trapped survivors.',
    isExtractionReady: false,
    extractionReached: false
  },

  // Survivors Data
  survivors: JSON.parse(JSON.stringify(GameConfig.survivors)),

  // Supplies Inventory
  supplies: { ...GameConfig.initialSupplies },

  // Contextual Interaction State
  interaction: {
    active: false,
    targetId: null,
    targetType: null, // 'SURVIVOR' | 'EXTRACTION'
    promptText: '',
    targetName: '',
    distance: 999
  },

  // Currently focused survivor for triage / rescue modal
  activeRescueSurvivor: null,

  // Mission Score and Statistics
  score: {
    totalPoints: 0,
    rank: 'Pending',
    survivorsSaved: 0,
    timeRemainingBonus: 0,
    suppliesBonus: 0
  },

  // Notifications / Alert messages
  notification: null,

  // Actions
  setPhase: (newPhase) => {
    set({ phase: newPhase });
  },

  showNotification: (text, type = 'info', duration = 3500) => {
    set({ notification: { text, type, id: Date.now() } });
    setTimeout(() => {
      const current = get().notification;
      if (current && Date.now() - current.id >= duration - 100) {
        set({ notification: null });
      }
    }, duration);
  },

  startBriefing: () => {
    set({ phase: GAME_PHASES.BRIEFING });
  },

  startMission: () => {
    set({
      phase: GAME_PHASES.PLAYING,
      mission: {
        ...get().mission,
        currentObjective: 'Locate and stabilize 3 trapped survivors in Sector 4-B.'
      }
    });
    GameEvents.emit(EVENT_TYPES.MISSION_STARTED, { timestamp: Date.now() });
  },

  togglePause: () => {
    const current = get().phase;
    if (current === GAME_PHASES.PLAYING) {
      set({ phase: GAME_PHASES.PAUSED });
      GameEvents.emit(EVENT_TYPES.GAME_PAUSED);
    } else if (current === GAME_PHASES.PAUSED) {
      set({ phase: GAME_PHASES.PLAYING });
      GameEvents.emit(EVENT_TYPES.GAME_RESUMED);
    }
  },

  resumeGame: () => {
    if (get().phase === GAME_PHASES.PAUSED) {
      set({ phase: GAME_PHASES.PLAYING });
      GameEvents.emit(EVENT_TYPES.GAME_RESUMED);
    }
  },

  updatePlayerPosition: (position, rotation, isMoving, isSprinting, stamina) => {
    set((state) => ({
      player: {
        ...state.player,
        position,
        rotation,
        isMoving,
        isSprinting,
        stamina: stamina !== undefined ? stamina : state.player.stamina
      }
    }));
  },

  setCameraRotation: (yaw, pitch) => {
    set({ cameraRotation: { yaw, pitch } });
  },

  updateTimer: (delta) => {
    const { phase, mission } = get();
    if (phase !== GAME_PHASES.PLAYING && phase !== GAME_PHASES.EXTRACTION) return;

    const newTimer = Math.max(0, mission.timer - delta);
    const newElapsed = mission.elapsed + delta;

    if (newTimer <= 0 && phase !== GAME_PHASES.RESULTS) {
      // Time expired
      get().completeMission(false);
      return;
    }

    set({
      mission: {
        ...mission,
        timer: newTimer,
        elapsed: newElapsed
      }
    });
  },

  setInteraction: (interaction) => {
    set({ interaction });
  },

  openRescueModal: (survivorId) => {
    const survivor = get().survivors.find(s => s.id === survivorId);
    if (survivor) {
      set({ activeRescueSurvivor: survivor });
      GameEvents.emit(EVENT_TYPES.SURVIVOR_INTERACT, survivor);
    }
  },

  closeRescueModal: () => {
    set({ activeRescueSurvivor: null });
  },

  performRescue: (survivorId, supplyUsed) => {
    const { survivors, supplies, mission } = get();
    const survivorIndex = survivors.findIndex(s => s.id === survivorId);
    if (survivorIndex === -1) return false;

    const survivor = survivors[survivorIndex];
    if (survivor.status === SURVIVOR_STATUS.RESCUED) return false;

    // Check if required supply is available
    if (supplyUsed && supplies[supplyUsed] > 0) {
      supplies[supplyUsed] -= 1;
      GameEvents.emit(EVENT_TYPES.SUPPLY_USED, { supply: supplyUsed, remaining: supplies[supplyUsed] });
    }

    // Update survivor status
    const updatedSurvivors = [...survivors];
    updatedSurvivors[survivorIndex] = {
      ...survivor,
      status: SURVIVOR_STATUS.RESCUED
    };

    const rescuedCount = updatedSurvivors.filter(s => s.status === SURVIVOR_STATUS.RESCUED).length;
    const allRescued = rescuedCount >= mission.totalSurvivors;

    const newObjective = allRescued
      ? 'All survivors stabilized! Reach the EVAC HELIPAD in the north clearing.'
      : `Rescue remaining survivors (${rescuedCount}/${mission.totalSurvivors} saved).`;

    set({
      survivors: updatedSurvivors,
      supplies: { ...supplies },
      activeRescueSurvivor: null,
      mission: {
        ...mission,
        survivorsRescued: rescuedCount,
        isExtractionReady: allRescued,
        currentObjective: newObjective
      }
    });

    GameEvents.emit(EVENT_TYPES.SURVIVOR_RESCUED, {
      survivor: updatedSurvivors[survivorIndex],
      totalRescued: rescuedCount
    });

    get().showNotification(`Survivor ${survivor.name} stabilized!`, 'success');

    if (allRescued) {
      get().setPhase(GAME_PHASES.EXTRACTION);
      GameEvents.emit(EVENT_TYPES.EXTRACTION_ACTIVE);
      get().showNotification('EXTRACTION ZONE ACTIVE: Proceed to Helipad Beacon!', 'warning', 5000);
    }

    return true;
  },

  triggerExtraction: () => {
    const { mission } = get();
    if (!mission.isExtractionReady) {
      get().showNotification('Rescue remaining survivors before extracting!', 'error');
      return;
    }

    get().completeMission(true);
  },

  completeMission: (success = true) => {
    const { mission, supplies } = get();
    const survivorsBonus = mission.survivorsRescued * GameConfig.scoring.survivorSavedPoints;
    const timeRemainingBonus = Math.floor(mission.timer * GameConfig.scoring.timeRemainingMultiplier);
    const suppliesBonus = (supplies.medkits + supplies.oxygen + supplies.toolkits) * GameConfig.scoring.unusedSupplyPoints;
    const totalPoints = success ? (survivorsBonus + timeRemainingBonus + suppliesBonus + GameConfig.scoring.cleanRescueBonus) : Math.floor(survivorsBonus * 0.5);

    const rank = success ? calculateRank(totalPoints) : 'F';

    set({
      phase: GAME_PHASES.RESULTS,
      score: {
        totalPoints,
        rank,
        survivorsSaved: mission.survivorsRescued,
        timeRemainingBonus,
        suppliesBonus,
        success
      }
    });

    GameEvents.emit(EVENT_TYPES.EXTRACTION_COMPLETED, { success, totalPoints, rank });
  },

  restartMission: () => {
    set({
      phase: GAME_PHASES.MENU,
      player: {
        position: [...GameConfig.player.spawnPosition],
        rotation: 0,
        speed: 0,
        isMoving: false,
        isSprinting: false,
        health: 100,
        stamina: 100
      },
      mission: {
        id: GameConfig.mission.id,
        title: GameConfig.mission.title,
        codename: GameConfig.mission.codename,
        briefing: GameConfig.mission.briefing,
        timer: GameConfig.mission.initialTimer,
        elapsed: 0,
        totalSurvivors: GameConfig.mission.totalSurvivors,
        survivorsRescued: 0,
        currentObjective: 'Search devastated Sector 4-B and locate 3 trapped survivors.',
        isExtractionReady: false,
        extractionReached: false
      },
      survivors: JSON.parse(JSON.stringify(GameConfig.survivors)),
      supplies: { ...GameConfig.initialSupplies },
      interaction: {
        active: false,
        targetId: null,
        targetType: null,
        promptText: '',
        targetName: '',
        distance: 999
      },
      activeRescueSurvivor: null,
      score: {
        totalPoints: 0,
        rank: 'Pending',
        survivorsSaved: 0,
        timeRemainingBonus: 0,
        suppliesBonus: 0
      },
      notification: null
    });
  }
}));
