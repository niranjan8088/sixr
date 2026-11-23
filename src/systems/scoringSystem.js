/**
 * AFTERLIGHT — Scoring System
 *
 * calculateScore({ survivors, resources, missionTimer, decisions })
 * → ScoreBreakdown {
 *     survivors:  number,   // points from rescue decisions
 *     time:       number,   // bonus for speed
 *     resources:  number,   // bonus for leftover resources
 *     decisions:  number,   // quality-of-decision bonus
 *     penalties:  number,   // deductions for losses
 *     total:      number,
 *     breakdown:  string[], // human-readable lines for the UI
 *   }
 *
 * All point values are integers; negative penalties reduce total.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const RESCUE_OUTCOMES = {
  rescued:          1,    // full rescue
  treated_stable:   0.6,  // survived but sub-optimal
  lost:             0,    // did not survive
  waiting:          0,    // never interacted
};

const BASE_RESCUE_SCORE   = 500;   // per survivor fully rescued
const TIME_BONUS_MAX      = 300;   // max bonus for fast completion
const TIME_BONUS_THRESHOLD = 300;  // seconds — under this earns time bonus
const RESOURCE_BONUS_PER  = 50;    // per leftover medical kit
const TOOL_BONUS_PER      = 40;    // per leftover tool kit
const LOSS_PENALTY        = -200;  // per survivor lost

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
export function calculateScore({ survivors, resources, missionTimer, decisions }) {
  const breakdown = [];
  let survivorPoints   = 0;
  let decisionPoints   = 0;
  let penalties        = 0;

  // ── Survivor outcome points ──────────────────────────────────────────────
  survivors.forEach(s => {
    const factor = RESCUE_OUTCOMES[s.state] ?? 0;

    if (s.state === 'lost' || (!s.interacted && s.state === 'waiting')) {
      penalties += LOSS_PENALTY;
      breakdown.push(`❌ ${s.name}: Lost  ${LOSS_PENALTY} pts`);
      return;
    }

    // Decision bonus from survivorData definition
    const choiceDef = s.choices?.find(c => c.key === s.decisionKey);
    const bonus = choiceDef?.scoreBonus ?? 0;
    const pts   = Math.round(BASE_RESCUE_SCORE * factor + bonus * factor);

    survivorPoints += pts;
    breakdown.push(`✅ ${s.name}: ${s.state === 'rescued' ? 'Rescued' : 'Stabilized'}  +${pts} pts`);
  });

  // ── Decision quality bonus ───────────────────────────────────────────────
  const optimalChoices = survivors.filter(s => {
    const c = s.choices?.find(ch => ch.key === s.decisionKey);
    return c && c.scoreBonus >= 300;
  }).length;

  if (optimalChoices >= 2) {
    decisionPoints = 150;
    breakdown.push(`⭐ Optimal triage decisions  +${decisionPoints} pts`);
  }

  // ── Time bonus ───────────────────────────────────────────────────────────
  let timePoints = 0;
  if (missionTimer > 0 && missionTimer < TIME_BONUS_THRESHOLD) {
    const factor = 1 - missionTimer / TIME_BONUS_THRESHOLD;
    timePoints   = Math.round(TIME_BONUS_MAX * factor);
    breakdown.push(`⏱️  Completion time (${formatTime(missionTimer)})  +${timePoints} pts`);
  } else {
    breakdown.push(`⏱️  Completion time (${formatTime(missionTimer)})  +0 pts`);
  }

  // ── Resource bonus ───────────────────────────────────────────────────────
  const resourcePoints =
    (resources.medical ?? 0) * RESOURCE_BONUS_PER +
    (resources.tools   ?? 0) * TOOL_BONUS_PER;

  if (resourcePoints > 0) {
    breakdown.push(
      `🎒 Remaining resources (${resources.medical} med / ${resources.tools} tools)  +${resourcePoints} pts`
    );
  }

  // ── Penalties breakdown ──────────────────────────────────────────────────
  if (penalties < 0) {
    breakdown.push(`💀 Casualties  ${penalties} pts`);
  }

  // ── Total ────────────────────────────────────────────────────────────────
  const total = Math.max(
    0,
    survivorPoints + decisionPoints + timePoints + resourcePoints + penalties
  );

  return {
    survivors:  survivorPoints,
    decisions:  decisionPoints,
    time:       timePoints,
    resources:  resourcePoints,
    penalties,
    total,
    breakdown,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
