/**
 * AFTERLIGHT — Mission System
 * MISSION 01: AFTER THE COLLAPSE
 *
 * Owns objective definitions, evaluation labels, and mission
 * state queries used by HUD / UI.
 *
 * Exported:
 *   MISSION_OBJECTIVES   — initial objective list (copied per run in store)
 *   getMissionEvaluation(score) → { grade, label, summary }
 *   getSurvivorCountLabel(survivors) → "X/3 found"
 *   getPhaseLabel(phase) → human-readable string
 */

// ─────────────────────────────────────────────────────────────────────────────
// Objective definitions
// ─────────────────────────────────────────────────────────────────────────────
export const MISSION_OBJECTIVES = [
  {
    id: 'find_survivors',
    label: 'Locate & Assess Survivors',
    description: 'Find and assess all 3 survivors in the collapse zone.',
    target: 3,
    progress: 0,
    completed: false,
    icon: '🔍',
  },
  {
    id: 'rescue_survivors',
    label: 'Rescue Survivors',
    description: 'Successfully rescue at least 1 survivor.',
    target: 1,
    progress: 0,
    completed: false,
    icon: '🏥',
  },
  {
    id: 'reach_extraction',
    label: 'Reach Extraction Zone',
    description: 'Make it to the extraction point to complete the mission.',
    target: 1,
    progress: 0,
    completed: false,
    icon: '🚁',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Mission evaluation (called after mission complete)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {Object} scoreBreakdown — from scoringSystem.calculateScore
 * @returns {{ grade: string, label: string, summary: string }}
 */
export function getMissionEvaluation(scoreBreakdown) {
  if (!scoreBreakdown) return { grade: '-', label: 'No data', summary: '' };

  const total = scoreBreakdown.total;
  if (total >= 1200) return { grade: 'S', label: 'Outstanding', summary: 'All survivors rescued with optimal resource use and speed.' };
  if (total >= 900)  return { grade: 'A', label: 'Excellent',   summary: 'Most survivors rescued with strong resource management.' };
  if (total >= 600)  return { grade: 'B', label: 'Good',        summary: 'Mission completed with some losses.' };
  if (total >= 300)  return { grade: 'C', label: 'Acceptable',  summary: 'Extraction reached but significant casualties.' };
  return               { grade: 'D', label: 'Poor',         summary: 'High casualties. Review your triage decisions.' };
}

// ─────────────────────────────────────────────────────────────────────────────
// UI helper functions
// ─────────────────────────────────────────────────────────────────────────────
export function getSurvivorCountLabel(survivors) {
  const assessed = survivors.filter(s => s.interacted).length;
  const rescued  = survivors.filter(s => s.state === 'rescued' || s.state === 'treated_stable').length;
  return { assessed, rescued, total: survivors.length };
}

export function getPhaseLabel(phase) {
  const labels = {
    menu:       'STANDBY',
    playing:    'ACTIVE MISSION',
    extraction: 'HEAD TO EXTRACTION',
    complete:   'MISSION COMPLETE',
    failed:     'MISSION FAILED',
  };
  return labels[phase] || phase.toUpperCase();
}

export function getUrgencyColor(urgency) {
  const map = {
    moderate: '#f59e0b',
    high:     '#ef4444',
    critical: '#dc2626',
  };
  return map[urgency] || '#6b7280';
}

export function getConditionIcon(condition) {
  const map = {
    injured:  '🩹',
    trapped:  '⛏️',
    critical: '🚨',
  };
  return map[condition] || '❓';
}
