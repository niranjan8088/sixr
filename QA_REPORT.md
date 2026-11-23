# AFTERLIGHT — Quality Assurance & Testing Report

**QA Lead & Backend Engineer:** Venki  
**Branch:** `feature/backend-qa`  
**Target Integration Branch:** `integration`  
**Test Date:** 2026-11-23  

---

## 1. Tested Functionality

### A. Health & System Status (`GET /api/health`)
- [x] Returns HTTP `200 OK`.
- [x] Returns server status (`"server": "ok"`), API status (`"api": "ok"`), database status (`"connected"` or `"unavailable"`), and timestamp.
- [x] Accurately indicates fallback status (`"persistence": "in-memory"` or `"mongodb"`).

### B. Mission Results Persistence (`POST /api/results` & `/api/missions`)
- [x] Input validation verifies required `score` is a numeric value and >= 0 (zero accepted, negative rejected).
- [x] Input validation verifies `missionTime` is numeric and >= 0 when provided (zero accepted, negative rejected).
- [x] Input validation checks `survivorsRescued` is a non-negative integer.
- [x] Accepts either `missionId` or `missionName`.
- [x] Gracefully handles optional fields (`playerId`, `playerName`, `missionTime`, `resourcesRemaining`, `outcome`).
- [x] Rejects empty or malformed requests with `400 Bad Request` and detailed validation error messages.
- [x] Aliased route `/api/missions` accepts and records results identically for cross-module compatibility.

### C. Results Retrieval (`GET /api/results`)
- [x] Returns HTTP `200 OK` with JSON array of recorded missions (newest first).
- [x] Operates correctly with in-memory array and MongoDB collections.

### D. Leaderboard & High Score Tracking (`GET /api/leaderboard`)
- [x] Returns HTTP `200 OK` with top 20 best scores.
- [x] Scores sorted strictly descending (`highest score first`).
- [x] Multiple submissions from the same player update and retain only their best (highest) score.
- [x] Lower subsequent scores do not overwrite `survivorsRescued`, `timestamp`, or player details associated with the best score.

### E. Database Resilience & In-Memory Fallback
- [x] Operates cleanly without MongoDB installed or configured.
- [x] Fast 2000ms timeout prevents hanging when an unreachable MongoDB URI is provided.
- [x] Simulated connection failures (`mongodb://127.0.0.1:27019/unreachable_db`) do not crash the server and automatically activate in-memory mode.

---

## 2. Test Execution Summary

| Test Suite | Tests Run | Passed | Failed | Status |
|------------|-----------|--------|--------|--------|
| `__tests__/api.test.js` | 17 | 17 | 0 | **PASS** |
| `__tests__/mongo-resilience.test.js` | 2 | 2 | 0 | **PASS** |
| **Total** | **19** | **19** | **0** | **PASS** |

---

## 3. Bugs Found & Fixed

1. **MongoDB Connection Stalling:**
   - *Issue:* Missing server timeout configuration caused server to stall when provided an offline MongoDB URI.
   - *Fix:* Added `serverSelectionTimeoutMS: 2000` and conditional `isMongoReady()` checks.
2. **Leaderboard Inversion / Multi-Submission:**
   - *Issue:* Repeated runs from the same player with a lower score could overwrite statistics (`survivorsRescued`, `timestamp`, `playerName`) associated with their best score.
   - *Fix:* In-memory update now conditionally updates all fields only when `score > existing.score`. MongoDB updates now use a conditional query (`score: { $lt: score }`) combined with `$setOnInsert` for new players, ensuring inferior runs never overwrite best-run data.
3. **Payload Field Discrepancies:**
   - *Issue:* Core and UI modules planned to send `missionName` while earlier schema enforced `missionId`.
   - *Fix:* Supported both `missionId` and `missionName` flexibly in validation and handler.
4. **Negative Value Validation:**
   - *Issue:* Score and missionTime did not reject negative inputs.
   - *Fix:* Updated validation rules to require `score >= 0` and `missionTime >= 0` (zero accepted, negative rejected with 400).

---

## 4. Known Issues & Limitations

- **In-Memory Volatility:** In pure in-memory mode (default when MongoDB is omitted), mission results and leaderboard reset if the server process restarts.
- **MongoDB Test Environment:** Automated tests verify offline fallback and connection resilience. Live MongoDB operations rely on an external running MongoDB instance.
- **Frontend Code Arrival:** Frontend files (`Player.jsx`, `World.jsx`, `App.jsx`, UI styling) have not yet been pushed to git by team members Niranjan, Rajesh, Lukky, and Siddappa. Full integration testing is queued upon receiving their PRs.

---

## 5. Integration Problems & Recommendations

- **CORS:** Enabled globally with `cors()` so the Vite/React dev server (usually port 5173 or 3000) can communicate without cross-origin blocks.
- **Fail-Open Strategy for Frontend:** The frontend should invoke `fetch('/api/results', ...)` inside a `try/catch`. If the backend is not running, the game must continue smoothly and present the local game-over results screen.

---

## 6. Performance Observations

- Jest test suite execution time: **~3.2 seconds** across 19 tests.
- Average endpoint response latency (in-memory): **< 5ms**.
- Zero memory leaks detected during test teardown.

---

## 7. Current Readiness

- **Backend Readiness:** Ready for integration testing and hackathon demo.
- **Git State:** Working on branch `feature/backend-qa`, ready for code review before commit.
