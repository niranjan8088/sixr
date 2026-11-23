# AFTERLIGHT — CORE INTEGRATION CONTRACT & ARCHITECTURE
**Lead Developer & Integrator:** Niranjan  
**Project:** AFTERLIGHT (3D Urban Disaster Rescue)  
**Hackathon Target Duration:** 4–5 Hours  
**Active Core Branch:** `feature/core`

---

## 1. Architecture Overview

AFTERLIGHT is built with React, Three.js, `@react-three/fiber`, `@react-three/drei`, and `zustand`.

```
src/
├── App.jsx                     [Niranjan - App Root & Layer Integrator]
├── main.jsx                    [Niranjan - DOM Entry]
├── game/
│   ├── World.jsx               [Niranjan - 3D Scene Root]
│   ├── Player.jsx              [Niranjan - Controllable 3D Operative & Rig]
│   ├── CameraController.jsx    [Niranjan - 3rd Person Orbital Follow Camera]
│   ├── GameLoop.jsx            [Niranjan - Master Delta Time Frame Step]
│   ├── GameConfig.js           [Niranjan - Game Tuning & Mission Balance]
│   ├── Lighting.jsx            [Siddappa / Niranjan Fallback - Mood & Strobe]
│   ├── Environment.jsx         [Siddappa / Niranjan Fallback - Urban Ruins]
│   ├── Survivors.jsx           [Lukky / Niranjan Fallback - 3D Survivor NPCs]
│   ├── RescueZone.jsx          [Lukky / Niranjan Fallback - Helipad Evac]
│   ├── Interactions.jsx        [Lukky / Niranjan Fallback - Proximity Sensing]
│   ├── core/
│   │   ├── GameController.js   [Niranjan - Central Action & Input Bridge]
│   │   ├── InputManager.js     [Niranjan - Keyboard & Mouse Input Engine]
│   │   ├── CollisionManager.js [Niranjan - High-performance AABB Wall Sliding]
│   │   └── GameEvents.js       [Niranjan - Decoupled Pub/Sub Event Hub]
│   └── environment/
│       ├── Buildings.jsx       [Siddappa - Damaged Skyscrapers & Colliders]
│       ├── CityGround.jsx      [Siddappa - Cracked Boulevard & Curbs]
│       ├── DebrisPiles.jsx     [Siddappa - Rubble, Girders & Barricades]
│       └── Atmosphere.jsx      [Siddappa - Volumetric Fog & Ash Particles]
├── systems/                    [Lukky - Gameplay Logic & Rules]
│   ├── missionSystem.js
│   ├── rescueSystem.js
│   ├── interactionSystem.js
│   ├── scoringSystem.js
│   └── resourceSystem.js
├── ui/                         [Rajesh - UI/UX & Tactical HUD]
│   ├── screens/
│   │   ├── MainMenu.jsx
│   │   ├── MissionBriefing.jsx
│   │   ├── PauseMenu.jsx
│   │   └── ResultsScreen.jsx
│   ├── hud/
│   │   └── HUD.jsx             [Tactical Radar, Objective, Clock, Vitals]
│   ├── rescue/
│   │   └── RescueModal.jsx     [Triage Diagnosis & Resource Treatment]
│   └── common/
│       └── Button.jsx
└── store/
    └── gameStore.js            [Single Source of Truth (Zustand)]
```

---

## 2. Shared Game State Contract (`useGameStore`)

All modules read and update state through `src/store/gameStore.js`.

### State Properties:
- `phase`: `'MENU' | 'BRIEFING' | 'PLAYING' | 'PAUSED' | 'EXTRACTION' | 'RESULTS'`
- `player`: `{ position: [x, y, z], rotation, speed, isMoving, isSprinting, health, stamina }`
- `cameraRotation`: `{ yaw, pitch }` (used by UI Radar/Compass)
- `mission`: `{ id, title, briefing, timer, elapsed, totalSurvivors, survivorsRescued, currentObjective, isExtractionReady }`
- `survivors`: Array of 3 survivors:
  - `id`: `'survivor-1' | 'survivor-2' | 'survivor-3'`
  - `name`, `role`, `position`: `[x, y, z]`
  - `injury`, `condition`, `requiredSupply`, `status`: `'TRAPPED' | 'RESCUED'`
  - `dialogue`, `rescuedDialogue`
- `supplies`: `{ medkits: number, oxygen: number, toolkits: number }`
- `interaction`: `{ active: boolean, targetId, targetType: 'SURVIVOR' | 'EXTRACTION', promptText, distance }`
- `activeRescueSurvivor`: `null | SurvivorObject` (when triage modal is open)
- `score`: `{ totalPoints, rank, survivorsSaved, timeRemainingBonus, suppliesBonus }`

### Store Methods:
- `setPhase(newPhase)`
- `startMission()`
- `togglePause()` / `resumeGame()`
- `performRescue(survivorId, supplyUsed)`
- `triggerExtraction()`
- `completeMission(success)`
- `restartMission()`
- `showNotification(text, type, duration)`

---

## 3. Team Member Handoff & Extension Guide

### For RAJESH (UI/UX) — Branch: `feature/ui`
1. **Your Sandbox:** `src/ui/**` and `src/styles/**`.
2. All HUD panels read cleanly from `useGameStore`.
3. To open/close triage UI, observe `activeRescueSurvivor` in `gameStore`.
4. Buttons use `.sci-btn` and panels use `.sci-panel` in `src/styles/game.css`.
5. **No 3D canvas modification:** Do not add HTML elements inside `<Canvas>`. The UI layer is in `App.jsx` above the canvas.

### For LUKKY (Gameplay) — Branch: `feature/gameplay`
1. **Your Sandbox:** `src/systems/**`, `src/game/Survivors.jsx`, `src/game/RescueZone.jsx`, `src/game/Interactions.jsx`.
2. If you add survivor conditions or triage puzzles, update `rescueSystem.js` and `rescueSystem.attemptRescue(id, supply)`.
3. The core engine passes `[E]` key presses directly to `GameController.handleInteractionTrigger()`, which dispatches to `openRescueModal()` or `triggerExtraction()`.
4. You can emit and listen to custom events via `GameEvents.on(EVENT_TYPES..., cb)` from `src/game/core/GameEvents.js`.
5. **Preserve survivor IDs:** Use `survivor-1`, `survivor-2`, `survivor-3` so radar and scoring remain synced.

### For SIDDAPPA (Environment) — Branch: `feature/environment`
1. **Your Sandbox:** `src/game/Environment.jsx` and `src/game/environment/**`.
2. To add collidable buildings or ruins, simply call:
   ```javascript
   import { globalCollisions } from '../core/CollisionManager';
   globalCollisions.addBox(minX, minZ, maxX, maxZ, 'my-building-id');
   globalCollisions.addCylinder(x, z, radius, 'rubble-id');
   ```
3. The player will automatically slide along your walls without clipping or falling through the ground.
4. Keep geometry grouped with standard materials for high 60fps performance on laptops.

### For VENKI (Backend & QA) — Branch: `feature/backend-qa`
1. **Your Sandbox:** `server/**`, `README.md`, and test suites.
2. A lightweight backend template is ready in `server/index.js`.
3. Health check: `GET /api/health`
4. Post mission results: `POST /api/results`
5. Get leaderboard: `GET /api/leaderboard`
6. **Graceful degradation:** The frontend runs completely standalone even if the backend is unreachable.

---

## 4. Input & Control Mapping

| Key / Input | Action | Behavior |
| --- | --- | --- |
| **W, A, S, D** | Movement | Moves relative to orbital camera yaw |
| **SHIFT** | Sprint | Accelerates from 5.5 m/s to 9.8 m/s (drains Exo-Stamina) |
| **MOUSE** | Camera Orbit | Click canvas to lock pointer; pitch clamped -0.55 to +0.95 rad |
| **E** | Contextual Action | Opens triage modal near survivor; triggers evac at helipad |
| **ESC** | Pause / Dismiss | Toggles pause menu; dismisses open triage modal |

---

## 5. Team Git Branching & Merge Protocol

All teammates branch off and merge into the integration branch:

```
        feature/ui ──────────────┐
        feature/gameplay ────────┤
main ── feature/core ────────────┼──> INTEGRATION (AFTERLIGHT Complete)
        feature/environment ─────┤
        feature/backend-qa ──────┘
```

### PR Merge Rules:
1. **Zero Collision Guarantee:** Do not create duplicate instances of `<Player>`, `<CameraController>`, `<World>`, or `useGameStore`.
2. **File Isolation:** Each developer only edits files in their assigned directories.
3. **Build Check:** Every branch must pass `npm run build` with 0 errors before PR merge.
4. **Standalone Verification:** The game must launch and remain fully playable if any single teammate's branch is delayed.
