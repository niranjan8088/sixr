// Game constants and enums
export const GAME_PHASES = {
  MENU: 'MENU',
  BRIEFING: 'BRIEFING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  EXTRACTION: 'EXTRACTION',
  RESULTS: 'RESULTS'
};

export const SURVIVOR_STATUS = {
  MISSING: 'MISSING',
  LOCATED: 'LOCATED',
  ASSESSMENT: 'ASSESSMENT',
  STABILIZED: 'STABILIZED',
  EVACUATED: 'EVACUATED',
  // Backward compatibility aliases
  TRAPPED: 'LOCATED',
  RESCUED: 'STABILIZED'
};

export const TRIAGE_TAGS = {
  IMMEDIATE: { label: 'PRIORITY 1 — IMMEDIATE', color: '#ef4444', code: 'RED' },
  URGENT: { label: 'PRIORITY 2 — URGENT', color: '#f59e0b', code: 'YELLOW' },
  DELAYED: { label: 'PRIORITY 3 — DELAYED', color: '#10b981', code: 'GREEN' }
};

export const SUPPLY_TYPES = {
  MEDKIT: 'medkits',
  OXYGEN: 'oxygen',
  TOOLKIT: 'toolkits'
};

export const INTERACTION_DISTANCES = {
  DETECTION: 16.0,
  SURVIVOR: 3.5,
  EXTRACTION: 5.0
};


