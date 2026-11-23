// Simple event hub for decoupled communication across team modules
class GameEventsEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      });
    }
  }

  clear() {
    this.listeners.clear();
  }
}

export const GameEvents = new GameEventsEmitter();

// Standard event types for team contracts
export const EVENT_TYPES = {
  MISSION_STARTED: 'MISSION_STARTED',
  SURVIVOR_INTERACT: 'SURVIVOR_INTERACT',
  SURVIVOR_RESCUED: 'SURVIVOR_RESCUED',
  SUPPLY_USED: 'SUPPLY_USED',
  EXTRACTION_ACTIVE: 'EXTRACTION_ACTIVE',
  EXTRACTION_COMPLETED: 'EXTRACTION_COMPLETED',
  GAME_PAUSED: 'GAME_PAUSED',
  GAME_RESUMED: 'GAME_RESUMED',
  GAME_OVER: 'GAME_OVER'
};
