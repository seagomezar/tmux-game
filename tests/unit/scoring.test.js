import { describe, it, expect } from 'vitest';
import {
  speedBonus,
  comboMultiplier,
  pointsForAnswer,
  applyCorrect,
  applyMistake,
  isGameOver,
  newRun,
  BASE_POINTS,
  MAX_SPEED_BONUS,
  STARTING_LIVES,
  MAX_COMBO_MULTIPLIER,
} from '../../js/scoring.js';

describe('speedBonus', () => {
  it('gives full bonus for an instant answer', () => {
    expect(speedBonus(0, 6000)).toBe(MAX_SPEED_BONUS);
  });
  it('gives zero at or past the limit', () => {
    expect(speedBonus(6000, 6000)).toBe(0);
    expect(speedBonus(9000, 6000)).toBe(0);
  });
  it('decays linearly at the halfway point', () => {
    expect(speedBonus(3000, 6000)).toBe(Math.round(MAX_SPEED_BONUS / 2));
  });
  it('handles a zero limit without dividing by zero', () => {
    expect(speedBonus(10, 0)).toBe(0);
  });
});

describe('comboMultiplier', () => {
  it('is 1x for streaks of 0 or 1', () => {
    expect(comboMultiplier(0)).toBe(1);
    expect(comboMultiplier(1)).toBe(1);
  });
  it('scales with the streak', () => {
    expect(comboMultiplier(2)).toBe(2);
    expect(comboMultiplier(3)).toBe(3);
  });
  it('caps at the max multiplier', () => {
    expect(comboMultiplier(10)).toBe(MAX_COMBO_MULTIPLIER);
  });
});

describe('pointsForAnswer', () => {
  it('is base + bonus at 1x on the first correct answer', () => {
    // streak passed is BEFORE this answer -> 0, so multiplier uses streak+1 = 1
    const pts = pointsForAnswer({ elapsedMs: 0, limitMs: 6000, streak: 0 });
    expect(pts).toBe((BASE_POINTS + MAX_SPEED_BONUS) * 1);
  });
  it('applies the combo multiplier as the streak grows', () => {
    const pts = pointsForAnswer({ elapsedMs: 6000, limitMs: 6000, streak: 2 });
    // no speed bonus, streak+1 = 3 -> 3x
    expect(pts).toBe(BASE_POINTS * 3);
  });
});

describe('applyCorrect / applyMistake', () => {
  it('accumulates score and streak on correct', () => {
    let snap = newRun();
    snap = applyCorrect(snap, { elapsedMs: 6000, limitMs: 6000 });
    expect(snap.streak).toBe(1);
    expect(snap.score).toBe(BASE_POINTS);
    expect(snap.lastGain).toBe(BASE_POINTS);
  });
  it('loses a life and resets streak on mistake', () => {
    let snap = newRun();
    snap = applyCorrect(snap, { elapsedMs: 0, limitMs: 6000 });
    snap = applyMistake(snap);
    expect(snap.lives).toBe(STARTING_LIVES - 1);
    expect(snap.streak).toBe(0);
  });
  it('never goes below zero lives', () => {
    let snap = { score: 0, streak: 0, lives: 1, lastGain: 0 };
    snap = applyMistake(snap);
    snap = applyMistake(snap);
    expect(snap.lives).toBe(0);
  });
});

describe('isGameOver / newRun', () => {
  it('starts with the configured lives and is not over', () => {
    const snap = newRun();
    expect(snap.lives).toBe(STARTING_LIVES);
    expect(isGameOver(snap)).toBe(false);
  });
  it('is over when lives reach zero', () => {
    expect(isGameOver({ score: 0, streak: 0, lives: 0 })).toBe(true);
  });
});
