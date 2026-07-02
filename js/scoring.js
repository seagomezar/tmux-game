// scoring.js
//
// Pure scoring, lives and combo logic. No DOM, no state mutation - every
// function takes inputs and returns new values so it is trivial to unit test.

export const BASE_POINTS = 100;
export const MAX_SPEED_BONUS = 100; // awarded for an instant answer, decays to 0
export const STARTING_LIVES = 3;
export const MAX_COMBO_MULTIPLIER = 4;

/**
 * Speed bonus for answering within the time limit.
 * Full bonus for an instant answer, decaying linearly to 0 at the time limit.
 *
 * @param {number} elapsedMs   Time taken to answer.
 * @param {number} limitMs     Challenge time limit.
 * @returns {number} Integer bonus in [0, MAX_SPEED_BONUS].
 */
export function speedBonus(elapsedMs, limitMs) {
  if (limitMs <= 0) return 0;
  const remaining = Math.max(0, limitMs - elapsedMs);
  const fraction = Math.min(1, remaining / limitMs);
  return Math.round(MAX_SPEED_BONUS * fraction);
}

/**
 * Combo multiplier grows with the current streak but is capped.
 * streak 0 -> 1x, 1 -> 1x, 2 -> 2x, 3 -> 3x, 4+ -> capped at MAX.
 *
 * @param {number} streak Number of consecutive correct answers so far.
 * @returns {number} Integer multiplier in [1, MAX_COMBO_MULTIPLIER].
 */
export function comboMultiplier(streak) {
  if (streak <= 1) return 1;
  return Math.min(streak, MAX_COMBO_MULTIPLIER);
}

/**
 * Points awarded for a single correct answer.
 *
 * @param {Object} opts
 * @param {number} opts.elapsedMs
 * @param {number} opts.limitMs
 * @param {number} opts.streak    Streak BEFORE this answer counts.
 * @returns {number} Integer points.
 */
export function pointsForAnswer({ elapsedMs, limitMs, streak }) {
  const bonus = speedBonus(elapsedMs, limitMs);
  const multiplier = comboMultiplier(streak + 1);
  return (BASE_POINTS + bonus) * multiplier;
}

/**
 * Apply a correct answer to a scoring snapshot, returning a new snapshot.
 *
 * @param {{score:number, streak:number, lives:number}} snap
 * @param {{elapsedMs:number, limitMs:number}} answer
 */
export function applyCorrect(snap, { elapsedMs, limitMs }) {
  const gained = pointsForAnswer({ elapsedMs, limitMs, streak: snap.streak });
  return {
    ...snap,
    score: snap.score + gained,
    streak: snap.streak + 1,
    lastGain: gained,
  };
}

/**
 * Apply a mistake (wrong key or timeout): lose a life, reset the streak.
 *
 * @param {{score:number, streak:number, lives:number}} snap
 */
export function applyMistake(snap) {
  return {
    ...snap,
    lives: Math.max(0, snap.lives - 1),
    streak: 0,
    lastGain: 0,
  };
}

/** Whether the run is over (out of lives). */
export function isGameOver(snap) {
  return snap.lives <= 0;
}

/** A fresh scoring snapshot for a new run. */
export function newRun() {
  return { score: 0, streak: 0, lives: STARTING_LIVES, lastGain: 0 };
}
