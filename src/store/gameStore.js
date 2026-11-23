import { create } from 'zustand';
import { GameConfig } from '../game/GameConfig';
import { GAME_PHASES, SURVIVOR_STATUS } from '../utils/constants';
import { calculateRank, getDistance2D } from '../utils/helpers';
import { GameEvents, EVENT_TYPES } from '../game/core/GameEvents';
import { audioSystem } from '../utils/audioSystem';

export const useGameStore = create((set, get) => ({
  // Core Phase
  phase: GAME_PHASES.MENU,

  // Audio settings
  soundEnabled: true,
  volume: 0.6,

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

  // Camera State
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
    survivorsLocated: 0,
    currentObjective: 'Search devastated Sector 4-B and locate 3 trapped survivors.',
    isExtractionReady: false,
    extractionReached: false
  },

  // Dynamic Mission Objectives
  objectives: JSON.parse(JSON.stringify(GameConfig.initialObjectives || [
    { id: 'obj-locate', title: 'Locate 3 missing civilians in Sector 4-B', current: 0, target: 3, completed: false },
    { id: 'obj-stabilize', title: 'Stabilize all civilian trauma casualties', current: 0, target: 3, completed: false },
    { id: 'obj-conserve', title: 'Maintain supply reserves (Conserve ≥ 1 Medkit & 1 Tool)', completed: false, isBonus: true },
    { id: 'obj-extract', title: 'Rendezvous at Helipad LZ for helicopter extraction', completed: false }
  ])),

  // Survivors Data (Deep clone)
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

  // Active Hazard Zone
  activeHazard: null,

  // Decision & Action History Log for Mission Debrief
  rescueLog: [],

  // Mission Score and Statistics
  score: {
    totalPoints: 0,
    rank: 'Pending',
    survivorsSaved: 0,
    timeRemainingBonus: 0,
    suppliesBonus: 0,
    objectivesBonus: 0,
    cleanRescueBonus: 0,
    success: false
  },

  // Notifications
  notification: null,

  // Sound Actions
  toggleSound: () => {
    const next = !get().soundEnabled;
    set({ soundEnabled: next });
    audioSystem.setMuted(!next);
  },

  setVolume: (vol) => {
    set({ volume: vol });
    audioSystem.setVolume(vol);
  },

  // Phase Actions
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
    audioSystem.playClick();
    set({ phase: GAME_PHASES.BRIEFING });
  },

  startMission: () => {
    audioSystem.playRadioChime();
    set({
      phase: GAME_PHASES.PLAYING,
      mission: {
        ...get().mission,
        currentObjective: 'Scan Sector 4-B perimeter and locate 3 trapped survivors.'
      }
    });
    GameEvents.emit(EVENT_TYPES.MISSION_STARTED, { timestamp: Date.now() });
  },

  togglePause: () => {
    audioSystem.playClick();
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
    audioSystem.playClick();
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

    // Auto-detect survivors when player approaches within 16m
    get().checkSurvivorProximity(position);
  },

  checkSurvivorProximity: (playerPos) => {
    const { survivors, objectives, mission } = get();
    let updated = false;
    const newSurvivors = survivors.map((s) => {
      if (s.status === SURVIVOR_STATUS.MISSING) {
        const dist = getDistance2D(playerPos, s.position);
        if (dist <= 16.0) {
          updated = true;
          audioSystem.playRadioChime();
          get().showNotification(`DISTRESS SIGNAL TRIANGULATED: ${s.name} (${s.role}) located!`, 'success');
          return { ...s, status: SURVIVOR_STATUS.LOCATED };
        }
      }
      return s;
    });

    if (updated) {
      const locatedCount = newSurvivors.filter((s) => s.status !== SURVIVOR_STATUS.MISSING).length;
      const newObjectives = objectives.map((obj) => {
        if (obj.id === 'obj-locate') {
          return {
            ...obj,
            current: locatedCount,
            completed: locatedCount >= 3
          };
        }
        return obj;
      });

      set({
        survivors: newSurvivors,
        objectives: newObjectives,
        mission: {
          ...mission,
          survivorsLocated: locatedCount
        }
      });
    }
  },

  setCameraRotation: (yaw, pitch) => {
    set({ cameraRotation: { yaw, pitch } });
  },

  setActiveHazard: (hazard) => {
    const prev = get().activeHazard;
    if (hazard && !prev) {
      audioSystem.playHazardAlert();
    }
    set({ activeHazard: hazard });
  },

  updateTimer: (delta) => {
    const { phase, mission, player, activeHazard } = get();
    if (phase !== GAME_PHASES.PLAYING && phase !== GAME_PHASES.EXTRACTION) return;

    const newTimer = Math.max(0, mission.timer - delta);
    const newElapsed = mission.elapsed + delta;

    if (newTimer <= 0 && phase !== GAME_PHASES.RESULTS) {
      get().completeMission(false);
      return;
    }

    // Health logic: Environmental Hazard damages suit integrity; clean air slowly recovers
    let currentHealth = player.health;
    if (activeHazard) {
      currentHealth = Math.max(15, currentHealth - delta * 4.0);
    } else if (currentHealth < 100) {
      currentHealth = Math.min(100, currentHealth + delta * 2.0);
    }

    set({
      player: {
        ...player,
        health: currentHealth
      },
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
    const { survivors } = get();
    const survivor = survivors.find((s) => s.id === survivorId);
    if (survivor) {
      audioSystem.playRadioChime();
      // If currently located, transition to assessment
      let updatedSurvivors = survivors;
      if (survivor.status === SURVIVOR_STATUS.LOCATED) {
        updatedSurvivors = survivors.map((s) =>
          s.id === survivorId ? { ...s, status: SURVIVOR_STATUS.ASSESSMENT } : s
        );
      }
      set({
        survivors: updatedSurvivors,
        activeRescueSurvivor: updatedSurvivors.find((s) => s.id === survivorId)
      });
      GameEvents.emit(EVENT_TYPES.SURVIVOR_INTERACT, survivor);
    }
  },

  closeRescueModal: () => {
    audioSystem.playClick();
    set({ activeRescueSurvivor: null });
  },

  // Decision action dispatcher
  performRescueDecision: (survivorId, decisionType) => {
    const { survivors, supplies, mission, objectives, rescueLog } = get();
    const survivorIndex = survivors.findIndex((s) => s.id === survivorId);
    if (survivorIndex === -1) return false;

    const survivor = survivors[survivorIndex];
    if (survivor.status === SURVIVOR_STATUS.STABILIZED || survivor.status === SURVIVOR_STATUS.EVACUATED) {
      return false;
    }

    let supplyToUse = null;
    let stabilityGain = 100;
    let logDescription = '';

    if (decisionType === 'PRIMARY_PROTOCOL') {
      supplyToUse = survivor.requiredSupply;
      if (!supplies[supplyToUse] || supplies[supplyToUse] <= 0) {
        get().showNotification(`CRITICAL: Depleted ${survivor.supplyLabel}!`, 'error');
        return false;
      }
      stabilityGain = 100;
      logDescription = `Deployed primary protocol (${survivor.actionLabel}) on ${survivor.name}. Complete physiological stabilization achieved.`;
    } else if (decisionType === 'FIELD_STABILIZE') {
      // Secondary: Field First Aid using Trauma Medkit
      supplyToUse = 'medkits';
      if (!supplies.medkits || supplies.medkits <= 0) {
        get().showNotification('CRITICAL: Depleted Trauma Medkits for field dressing!', 'error');
        return false;
      }
      stabilityGain = 45;
      logDescription = `Administered emergency field dressing on ${survivor.name}. Vitals temporarily stabilized (+45%).`;
    } else if (decisionType === 'SKIP') {
      get().closeRescueModal();
      get().showNotification(`Triage delayed for ${survivor.name}. Prioritizing other casualty vectors.`, 'info');
      return true;
    }

    // Deduct supply
    const newSupplies = { ...supplies };
    if (supplyToUse) {
      newSupplies[supplyToUse] = Math.max(0, newSupplies[supplyToUse] - 1);
    }

    // Audio feedback
    audioSystem.playPneumaticHiss();
    audioSystem.playSuccessChime();

    // Calculate new stability
    const currentStab = survivor.vitals?.stability || 30;
    const newStability = Math.min(100, currentStab + stabilityGain);
    const isNowStabilized = newStability >= 85 || decisionType === 'PRIMARY_PROTOCOL';

    const updatedSurvivor = {
      ...survivor,
      status: isNowStabilized ? SURVIVOR_STATUS.STABILIZED : SURVIVOR_STATUS.ASSESSMENT,
      vitals: {
        ...survivor.vitals,
        stability: newStability,
        hr: Math.round(survivor.vitals.hr * (isNowStabilized ? 0.8 : 0.9)),
        spo2: Math.min(99, survivor.vitals.spo2 + (isNowStabilized ? 15 : 8))
      }
    };

    const updatedSurvivors = [...survivors];
    updatedSurvivors[survivorIndex] = updatedSurvivor;

    const stabilizedCount = updatedSurvivors.filter(
      (s) => s.status === SURVIVOR_STATUS.STABILIZED || s.status === SURVIVOR_STATUS.EVACUATED
    ).length;
    const allStabilized = stabilizedCount >= mission.totalSurvivors;

    // Update objectives
    const updatedObjectives = objectives.map((obj) => {
      if (obj.id === 'obj-stabilize') {
        return { ...obj, current: stabilizedCount, completed: allStabilized };
      }
      if (obj.id === 'obj-conserve') {
        const hasReserves = newSupplies.medkits >= 1 && newSupplies.toolkits >= 1;
        return { ...obj, completed: hasReserves };
      }
      if (obj.id === 'obj-extract') {
        return { ...obj, completed: allStabilized && mission.extractionReached };
      }
      return obj;
    });

    const newObjectiveText = allStabilized
      ? 'All 3 civilian casualties stabilized! Rendezvous at EVAC HELIPAD in the north clearing.'
      : `Rescue remaining survivors (${stabilizedCount}/${mission.totalSurvivors} stabilized).`;

    const newLog = [
      ...rescueLog,
      {
        timestamp: Math.round(mission.elapsed),
        survivorId: survivor.id,
        survivorName: survivor.name,
        decisionType,
        supplyUsed: supplyToUse,
        text: logDescription
      }
    ];

    set({
      survivors: updatedSurvivors,
      supplies: newSupplies,
      activeRescueSurvivor: null,
      objectives: updatedObjectives,
      rescueLog: newLog,
      mission: {
        ...mission,
        survivorsRescued: stabilizedCount,
        isExtractionReady: allStabilized,
        currentObjective: newObjectiveText
      }
    });

    GameEvents.emit(EVENT_TYPES.SURVIVOR_RESCUED, {
      survivor: updatedSurvivor,
      totalRescued: stabilizedCount
    });

    get().showNotification(`Triage Complete: ${survivor.name} stabilized!`, 'success');

    if (allStabilized) {
      get().setPhase(GAME_PHASES.EXTRACTION);
      audioSystem.playRadioChime();
      GameEvents.emit(EVENT_TYPES.EXTRACTION_ACTIVE);
      get().showNotification('EXTRACTION LZ ACTIVE: Helipad landing lights illuminated!', 'warning', 6000);
    }

    return true;
  },

  triggerExtraction: () => {
    const { mission, survivors } = get();
    if (!mission.isExtractionReady) {
      audioSystem.playHazardAlert();
      get().showNotification('Evacuation locked: Stabilize all 3 survivors first!', 'error');
      return;
    }

    // Evacuate all survivors
    const evacuatedSurvivors = survivors.map((s) => ({
      ...s,
      status: SURVIVOR_STATUS.EVACUATED
    }));

    audioSystem.playEvacFanfare();
    set({
      survivors: evacuatedSurvivors,
      mission: {
        ...mission,
        extractionReached: true
      }
    });

    get().completeMission(true);
  },

  completeMission: (success = true) => {
    const { mission, supplies, objectives, survivors } = get();
    const survivorsBonus = mission.survivorsRescued * GameConfig.scoring.survivorSavedPoints;
    const timeRemainingBonus = Math.floor(mission.timer * GameConfig.scoring.timeRemainingMultiplier);
    const suppliesBonus =
      (supplies.medkits + supplies.oxygen + supplies.toolkits) * GameConfig.scoring.unusedSupplyPoints;

    const completedBonusObjs = objectives.filter((o) => o.completed).length;
    const objectivesBonus = completedBonusObjs * (GameConfig.scoring.objectiveBonus || 100);
    const cleanRescueBonus =
      mission.survivorsRescued === mission.totalSurvivors ? GameConfig.scoring.cleanRescueBonus : 0;

    const totalPoints = success
      ? survivorsBonus + timeRemainingBonus + suppliesBonus + objectivesBonus + cleanRescueBonus
      : Math.floor(survivorsBonus * 0.5);

    const rank = success ? calculateRank(totalPoints) : 'F';

    if (success) {
      audioSystem.playEvacFanfare();
    } else {
      audioSystem.playHazardAlert();
    }

    set({
      phase: GAME_PHASES.RESULTS,
      score: {
        totalPoints,
        rank,
        survivorsSaved: mission.survivorsRescued,
        timeRemainingBonus,
        suppliesBonus,
        objectivesBonus,
        cleanRescueBonus,
        success
      }
    });

    GameEvents.emit(EVENT_TYPES.EXTRACTION_COMPLETED, { success, totalPoints, rank });
  },

  restartMission: () => {
    audioSystem.playClick();
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
        survivorsLocated: 0,
        currentObjective: 'Search devastated Sector 4-B and locate 3 trapped survivors.',
        isExtractionReady: false,
        extractionReached: false
      },
      objectives: JSON.parse(JSON.stringify(GameConfig.initialObjectives)),
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
      activeHazard: null,
      rescueLog: [],
      score: {
        totalPoints: 0,
        rank: 'Pending',
        survivorsSaved: 0,
        timeRemainingBonus: 0,
        suppliesBonus: 0,
        objectivesBonus: 0,
        cleanRescueBonus: 0,
        success: false
      },
      notification: null
    });
  }
}));
