# AFTERLIGHT — CORE INTEGRATION CONTRACT & ARCHITECTURE
**Lead Developer & Integrator:** Niranjan  
**Project:** AFTERLIGHT (3D Urban Disaster Rescue)  
**Hackathon Target Duration:** 4–5 Hours  
**Active Integration Branch:** `integration`  
**Core Source Branch:** `feature/core`

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

## 2. Team File Ownership & Boundaries

| Member | Domain | Assigned Branch | Owned Files & Directories | Strict Boundary Rules |
| --- | --- | --- | --- | --- |
| **Niranjan** | Core Architecture & Integration | `feature/core` | `src/App.jsx`, `src/main.jsx`, `src/game/World.jsx`, `src/game/Player.jsx`, `src/game/CameraController.jsx`, `src/game/GameLoop.jsx`, `src/game/GameConfig.js`, `src/game/core/**`, `CORE_INTEGRATION.md` | Sole authority to integrate PRs into `integration` and merge to `main`. |
| **Rajesh** | UI / UX | `feature/ui` | `src/ui/**`, `src/styles/**` | Do not place HTML elements inside R3F `<Canvas>`. Use `.interactive` class for clickable overlays. |
| **Lukky** | Gameplay & Mission Systems | `feature/gameplay` | `src/systems/**`, `src/game/Survivors.jsx`, `src/game/RescueZone.jsx`, `src/game/Interactions.jsx` | Preserve survivor IDs (`survivor-1`, `survivor-2`, `survivor-3`). Do not create duplicate game loops. |
| **Siddappa** | Environment & Atmosphere | `feature/environment` | `src/game/Environment.jsx`, `src/game/Lighting.jsx`, `src/game/environment/**` | Register colliders via `globalCollisions.addBox()` and `addCylinder()`. Keep polygon counts optimized for 60fps. |
| **Venki** | Backend & QA Testing | `feature/backend-qa` | `server/**`, `README.md`, test suites | Game must operate 100% standalone if backend is offline. |

---

## 3. Shared Game State Contract (`useGameStore`)

All modules read and update state through `src/store/gameStore.js`. Never create a secondary store or duplicate state variables.

### State Schema:
```typescript
interface GameStore {
  // Phase Management
  phase: 'MENU' | 'BRIEFING' | 'PLAYING' | 'PAUSED' | 'EXTRACTION' | 'RESULTS';

  // Player State
  player: {
    position: [number, number, number]; // [x, y, z]
    rotation: number;                   // Radians
    speed: number;                      // Current velocity (m/s)
    isMoving: boolean;
    isSprinting: boolean;
    health: number;                     // 0 - 100
    stamina: number;                    // 0 - 100
  };

  // Camera Orientation (Synchronized for Radar/Compass)
  cameraRotation: {
    yaw: number;                        // Azimuth angle (radians)
    pitch: number;                      // Elevation angle (radians)
  };

  // Mission State
  mission: {
    id: string;                         // 'mission-01'
    title: string;                      // 'AFTER THE COLLAPSE'
    codename: string;                   // 'OP: CITADEL EMBERS'
    briefing: string;
    timer: number;                      // Seconds remaining
    elapsed: number;                    // Elapsed gameplay seconds
    totalSurvivors: number;             // 3
    survivorsRescued: number;           // 0 to 3
    currentObjective: string;
    isExtractionReady: boolean;         // true when survivorsRescued >= 3
    extractionReached: boolean;
  };

  // Survivor Data
  survivors: Array<{
    id: 'survivor-1' | 'survivor-2' | 'survivor-3';
    name: string;
    role: string;
    position: [number, number, number];
    injury: string;
    condition: string;
    requiredSupply: 'medkits' | 'oxygen' | 'toolkits';
    supplyLabel: string;
    status: 'TRAPPED' | 'RESCUED';
    dialogue: string;
    rescuedDialogue: string;
  }>;

  // Supplies Inventory
  supplies: {
    medkits: number;                    // Initial: 3
    oxygen: number;                     // Initial: 2
    toolkits: number;                   // Initial: 2
  };

  // Proximity & Contextual Interaction
  interaction: {
    active: boolean;
    targetId: string | null;            // e.g. 'survivor-1' or 'EXTRACTION_ZONE'
    targetType: 'SURVIVOR' | 'EXTRACTION' | null;
    promptText: string;
    targetName: string;
    distance: number;
  };

  // Modal State
  activeRescueSurvivor: object | null;  // Non-null opens RescueModal and pauses movement

  // Scoring Breakdown
  score: {
    totalPoints: number;
    rank: 'S' | 'A' | 'B' | 'C' | 'D' | 'F' | 'Pending';
    survivorsSaved: number;
    timeRemainingBonus: number;
    suppliesBonus: number;
    success?: boolean;
  };

  // Notification Toast
  notification: { text: string; type: 'info' | 'success' | 'error'; id: number } | null;
}
```

### Store Action Methods:
- `setPhase(newPhase)`: Updates game phase.
- `startMission()`: Transitions from BRIEFING to PLAYING.
- `togglePause()` / `resumeGame()`: Toggles pause state.
- `performRescue(survivorId, supplyUsed)`: Validates supply, consumes item, marks survivor RESCUED, updates objectives, checks evac readiness.
- `triggerExtraction()`: Verifies `isExtractionReady`, completes mission, transitions to RESULTS.
- `completeMission(success)`: Calculates final score, bonuses, and grade.
- `restartMission()`: Fully resets player position, timer, survivors, and inventory.
- `showNotification(text, type, duration)`: Triggers HUD banner alert.

---

## 4. Survivor Catalog & Canonical IDs

Do not modify or re-key these IDs, positions, or supply labels:

| ID | Name | Role | Position `[x, y, z]` | Diagnosis / Condition | Required Supply Key | Supply Label |
| --- | --- | --- | --- | --- | --- | --- |
| `survivor-1` | **Elena Vance** | Structural Engineer | `[-16, 0, -10]` | Crush syndrome; pinned under collapsed reinforced beam | `toolkits` | Hydraulic Spreader Toolkit |
| `survivor-2` | **Marcus Chen** | Metro Transit Tech | `[20, 0, -22]` | Acute toxic particulate inhalation in subway airshaft | `oxygen` | Emergency O2 Canister |
| `survivor-3` | **Dr. Sarah Al-Jamil** | Emergency Physician | `[-6, 0, -50]` | Severe arterial lacerations from shattered glass canopy | `medkits` | Trauma Medkit |

---

## 5. Interaction & Proximity Rules

1. **Distance Thresholds:**
   - Survivor interaction threshold: **`3.5 meters`** (`INTERACTION_DISTANCES.SURVIVOR`).
   - Evac Helipad interaction threshold: **`5.0 meters`** (`INTERACTION_DISTANCES.EXTRACTION`).
2. **Contextual HUD Banner:**
   - Surfaces automatically when player is within range.
   - For trapped survivors: `[E] STABILIZE [SURVIVOR_NAME] ([ROLE])`
   - For stabilized survivors: `[SURVIVOR_NAME] is stabilized and awaiting extraction`
   - For Extraction Helipad (Ready): `[E] ENTER HELIPAD & CALL EXTRACTION`
   - For Extraction Helipad (Locked): `EXTRACTION UNAVAILABLE: Locate and rescue all survivors first`
3. **Rescue Execution:**
   - Pressing `[E]` near a trapped survivor opens `<RescueModal />`.
   - Administering treatment deducts 1 unit of `requiredSupply`. If `supplies[key] <= 0`, action is blocked with an error toast.
   - Stabilized survivors switch their ground beacon ring from red/amber to bright green.
4. **Extraction Helipad (`[0, 0, -42]`):**
   - Inactive/amber until all 3 survivors have status `RESCUED`.
   - Upon rescuing survivor 3, phase updates to `EXTRACTION` and beacon pulses bright cyan/teal.
   - Entering the helipad and pressing `[E]` finishes the mission and navigates to `RESULTS`.

---

## 6. Team Merge Protocol & Checklists

All team branches must be created from `integration` and submit Pull Requests targeting `integration`:

```
        feature/environment ─────┐
        feature/gameplay ────────┤
main ── integration ─────────────┼──> [Niranjan Review & QA] ──> Production Release
        feature/ui ──────────────┤
        feature/backend-qa ──────┘
```

### Recommended Integration Sequence:
1. **Merge 1: `feature/environment` (Siddappa)** — Expands visual city without altering gameplay logic.
2. **Merge 2: `feature/gameplay` (Lukky)** — Integrates survivor behavior and objective flow.
3. **Merge 3: `feature/ui` (Rajesh)** — Integrates enhanced HUD, menus, and styling.
4. **Merge 4: `feature/backend-qa` (Venki)** — Adds backend scoring, leaderboard persistence, and test reports.

---

### Integration Review Checklists:

#### 📋 Checklist for `feature/ui` (Rajesh):
- [ ] Only files in `src/ui/**` and `src/styles/**` are modified.
- [ ] No HTML or DOM elements are placed inside the Three.js `<Canvas>`.
- [ ] HUD consumes `useGameStore` for timer, vitals, supplies, and radar coordinates.
- [ ] UI overlays allow mouse clicks through to canvas using `.interactive` on interactive panels only.
- [ ] `npm run build` succeeds with zero errors.

#### 📋 Checklist for `feature/gameplay` (Lukky):
- [ ] Only files in `src/systems/**`, `Survivors.jsx`, `RescueZone.jsx`, `Interactions.jsx` are modified.
- [ ] Canonical survivor IDs (`survivor-1`, `survivor-2`, `survivor-3`) are preserved.
- [ ] Supply consumption maps to valid keys: `medkits`, `oxygen`, `toolkits`.
- [ ] Extraction only unlocks when `survivorsRescued >= 3`.
- [ ] No duplicate player controllers or secondary animation loops are introduced.
- [ ] `npm run build` succeeds with zero errors.

#### 📋 Checklist for `feature/environment` (Siddappa):
- [ ] Only files in `src/game/Environment.jsx` and `src/game/environment/**` are modified.
- [ ] New collidable structures register AABB boxes via `globalCollisions.addBox()`.
- [ ] Rubble and circular props register via `globalCollisions.addCylinder()`.
- [ ] Polygon counts and materials are optimized for browser WebGL (60fps on standard laptops).
- [ ] No second `<Canvas>` or camera is declared.
- [ ] `npm run build` succeeds with zero errors.

#### 📋 Checklist for `feature/backend-qa` (Venki):
- [ ] Only files in `server/**`, `README.md`, and test suites are modified.
- [ ] Frontend remains 100% playable even if Express/MongoDB is offline.
- [ ] Endpoint `/api/health` returns status 200 with `{ status: 'online' }`.
- [ ] Endpoint `/api/results` accepts mission score payload without crashing.
- [ ] `npm run build` succeeds with zero errors.

---

## 7. Verification Commands

Run before submitting any PR and after each merge into `integration`:

```bash
# 1. Verify build compilation
npm run build

# 2. Check git branch status
git status

# 3. Test dev server
npm run dev
```
