/**
 * AFTERLIGHT — Shared Game Store
 * Zustand store that owns all cross-cutting game state.
 *
 * Interface contract (for App.jsx / Niranjan / Rajesh):
 *   useGameStore()         → full store
 *   useGameStore.getState() → snapshot outside React
 *
 * Key slices exposed:
 *   phase          : 'menu' | 'playing' | 'extraction' | 'complete' | 'failed'
 *   survivors      : SurvivorDef[]
 *   resources      : { medical, tools }
 *   activeSurvivor : id | null           ← set by Interactions, read by UI panel
 *   decisions      : { [survivorId]: string }
 *   objectives     : ObjectiveDef[]
 *   score          : ScoreBreakdown
 *   missionTimer   : seconds elapsed
 *   missionStarted : boolean
 */

import { create } from 'zustand';
import { SURVIVOR_DEFINITIONS } from './survivorData.js';
import { calculateScore } from './scoringSystem.js';
import { MISSION_OBJECTIVES } from './missionSystem.js';

// ─────────────────────────────────────────────────────────────────────────────
// Initial state factory (also used by restart)
// ─────────────────────────────────────────────────────────────────────────────
function buildInitialState() {
  return {
    phase: 'menu',
    survivors: SURVIVOR_DEFINITIONS.map(s => ({ ...s })),   // deep-copy per run
    resources: { medical: 3, tools: 2 },
    activeSurvivor: null,         // survivor id currently being interacted with
    decisionPanel: false,         // whether the decision panel is open
    decisions: {},                // { [survivorId]: choiceKey }
    objectives: MISSION_OBJECTIVES.map(o => ({ ...o })),
    score: null,                  // null until mission complete
    missionTimer: 0,
    missionStarted: false,
    playerPosition: [0, 0, 0],   // kept in sync by Player.jsx via store action
    extractionReached: false,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────
export const useGameStore = create((set, get) => ({
  ...buildInitialState(),

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  startMission() {
    set({ phase: 'playing', missionStarted: true, missionTimer: 0 });
  },

  restartMission() {
    set(buildInitialState());
  },

  tickTimer() {
    set(s => ({ missionTimer: s.missionTimer + 1 }));
  },

  // ── Player position (called by Player.jsx each frame) ─────────────────────
  setPlayerPosition(pos) {
    set({ playerPosition: pos });
  },

  // ── Interaction ───────────────────────────────────────────────────────────
  openSurvivorPanel(id) {
    set({ activeSurvivor: id, decisionPanel: true });
  },

  closeSurvivorPanel() {
    set({ activeSurvivor: null, decisionPanel: false });
  },

  // ── Decision / rescue logic ───────────────────────────────────────────────
  /**
   * applyDecision(survivorId, choiceKey)
   * Resolves the player's decision for a survivor:
   *  - consumes resources
   *  - updates survivor state (rescued / lost / treated)
   *  - updates objectives
   *  - checks mission completion
   */
  applyDecision(survivorId, choiceKey) {
    const state = get();
    const survivorIndex = state.survivors.findIndex(s => s.id === survivorId);
    if (survivorIndex === -1) return;
    if (state.decisions[survivorId]) return; // already decided

    const survivor = state.survivors[survivorIndex];
    const choice   = survivor.choices.find(c => c.key === choiceKey);
    if (!choice) return;

    // Clone survivors array
    const updatedSurvivors = state.survivors.map(s => s.id === survivorId
      ? { ...s, state: choice.outcome, interacted: true, decisionKey: choiceKey }
      : s);

    // Resource consumption (clamp at 0)
    const updatedResources = {
      medical: Math.max(0, state.resources.medical - (choice.costMedical || 0)),
      tools:   Math.max(0, state.resources.tools   - (choice.costTools   || 0)),
    };

    // Update decisions map
    const updatedDecisions = { ...state.decisions, [survivorId]: choiceKey };

    // Objective progress
    const updatedObjectives = updateObjectives(
      state.objectives, updatedSurvivors, state.extractionReached
    );

    set({
      survivors:   updatedSurvivors,
      resources:   updatedResources,
      decisions:   updatedDecisions,
      objectives:  updatedObjectives,
      activeSurvivor: null,
      decisionPanel: false,
    });

    // Check if only objectives left is extraction
    get()._checkMissionState();
  },

  // ── Extraction ────────────────────────────────────────────────────────────
  triggerExtraction() {
    const state = get();
    if (state.phase !== 'playing') return;

    // Player must have interacted with all reachable survivors first
    const pendingSurvivors = state.survivors.filter(
      s => s.state === 'waiting' && !s.interacted
    );
    if (pendingSurvivors.length > 0) {
      // Soft warning — not blocking, but objectives reflect it
    }

    const updatedObjectives = updateObjectives(state.objectives, state.survivors, true);
    const finalScore = calculateScore({
      survivors:   state.survivors,
      resources:   state.resources,
      missionTimer: state.missionTimer,
      decisions:   state.decisions,
    });

    set({
      extractionReached: true,
      phase: 'complete',
      objectives: updatedObjectives,
      score: finalScore,
    });
  },

  // ── Internal ──────────────────────────────────────────────────────────────
  _checkMissionState() {
    const state = get();
    // All survivors interacted with → move to extraction phase hint
    const allInteracted = state.survivors.every(s => s.interacted);
    if (allInteracted) {
      set({ phase: 'extraction' }); // signals player to head to extraction zone
    }
  },

  // Exposed for UI to read survivor count
  get rescuedCount() {
    return get().survivors.filter(s => s.state === 'rescued').length;
  },
  get lostCount() {
    return get().survivors.filter(s => s.state === 'lost').length;
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// Pure helper: objective updater
// ─────────────────────────────────────────────────────────────────────────────
function updateObjectives(objectives, survivors, extractionReached) {
  const rescued  = survivors.filter(s => s.state === 'rescued').length;
  const assessed = survivors.filter(s => s.interacted).length;

  return objectives.map(obj => {
    switch (obj.id) {
      case 'find_survivors':
        return { ...obj, progress: assessed, completed: assessed >= obj.target };
      case 'rescue_survivors':
        return { ...obj, progress: rescued,  completed: rescued  >= 1 };
      case 'reach_extraction':
        return { ...obj, progress: extractionReached ? 1 : 0, completed: extractionReached };
      default:
        return obj;
    }
  });
}
