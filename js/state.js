// state.js
//
// In-memory game state. Deliberately holds NO persistence: there is no
// localStorage, no cookies, no server. A refresh recreates this from scratch,
// so the player always restarts at level 1. That is a product requirement.

import { newRun, applyCorrect, applyMistake, isGameOver } from './scoring.js';

/** Screens the game can be on. */
export const Screen = {
  START: 'start',
  CONCEPT: 'concept',
  DRILL: 'drill',
  LEVEL_COMPLETE: 'levelComplete',
  GAME_OVER: 'gameOver',
  VICTORY: 'victory',
};

/**
 * Create the initial game state.
 * @param {Array} levels The level content array (from levels.js).
 */
export function createGame(levels) {
  return {
    levels,
    os: 'linux', // chosen on the start screen; only affects terminal-track challenges
    lang: 'en', // default language
    screen: Screen.START,
    levelIndex: 0,
    challengeIndex: 0,
    run: newRun(), // { score, streak, lives, lastGain }
  };
}

export function currentLevel(game) {
  return game.levels[game.levelIndex];
}

export function currentChallenge(game) {
  const level = currentLevel(game);
  return level ? level.challenges[game.challengeIndex] : null;
}

/** Set the player's OS (start screen). */
export function setOs(game, os) {
  return { ...game, os };
}

/** Set the player's language (start screen). */
export function setLang(game, lang) {
  return { ...game, lang };
}

/** Begin a run: go to the first level's concept card. */
export function startGame(game) {
  return {
    ...game,
    screen: Screen.CONCEPT,
    levelIndex: 0,
    challengeIndex: 0,
    run: newRun(),
  };
}

/** Move from a level's concept card into its drill. */
export function beginDrill(game) {
  return { ...game, screen: Screen.DRILL, challengeIndex: 0 };
}

/**
 * Record a correct answer. Advances to the next challenge, or to the
 * level-complete screen when the level's challenges are exhausted.
 *
 * @param {Object} game
 * @param {{elapsedMs:number, limitMs:number}} answer
 */
export function recordCorrect(game, answer) {
  const run = applyCorrect(game.run, answer);
  const level = currentLevel(game);
  const isLastChallenge = game.challengeIndex >= level.challenges.length - 1;

  if (isLastChallenge) {
    return { ...game, run, screen: Screen.LEVEL_COMPLETE };
  }
  return { ...game, run, challengeIndex: game.challengeIndex + 1 };
}

/**
 * Record a mistake (wrong key or timeout). Loses a life. If lives hit zero the
 * run is over; otherwise the player retries the SAME challenge.
 */
export function recordMistake(game) {
  const run = applyMistake(game.run);
  if (isGameOver(run)) {
    return { ...game, run, screen: Screen.GAME_OVER };
  }
  return { ...game, run };
}

/**
 * Advance from the level-complete screen. Goes to the next level's concept
 * card, or to victory after the final level.
 */
export function nextLevel(game) {
  const isLastLevel = game.levelIndex >= game.levels.length - 1;
  if (isLastLevel) {
    return { ...game, screen: Screen.VICTORY };
  }
  return {
    ...game,
    screen: Screen.CONCEPT,
    levelIndex: game.levelIndex + 1,
    challengeIndex: 0,
  };
}

/** Restart from level 1 with a fresh run (after game over or victory). */
export function restart(game) {
  return {
    ...game,
    screen: Screen.START,
    levelIndex: 0,
    challengeIndex: 0,
    run: newRun(),
  };
}
