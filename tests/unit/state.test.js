import { describe, it, expect } from 'vitest';
import {
  createGame,
  startGame,
  beginDrill,
  recordCorrect,
  recordMistake,
  nextLevel,
  restart,
  currentLevel,
  currentChallenge,
  setOs,
  Screen,
} from '../../js/state.js';

// A compact fake level set: 2 levels, each with 2 challenges.
const fakeLevels = [
  {
    id: 'l1',
    title: 'One',
    challenges: [
      { type: 'key', ref: 'a', limitMs: 6000 },
      { type: 'key', ref: 'b', limitMs: 6000 },
    ],
  },
  {
    id: 'l2',
    title: 'Two',
    challenges: [{ type: 'key', ref: 'c', limitMs: 6000 }],
  },
];

const answer = { elapsedMs: 0, limitMs: 6000 };

describe('game flow', () => {
  it('starts on the start screen at level 1', () => {
    const g = createGame(fakeLevels);
    expect(g.screen).toBe(Screen.START);
    expect(g.levelIndex).toBe(0);
    expect(currentLevel(g).id).toBe('l1');
  });

  it('start -> concept -> drill', () => {
    let g = createGame(fakeLevels);
    g = startGame(g);
    expect(g.screen).toBe(Screen.CONCEPT);
    g = beginDrill(g);
    expect(g.screen).toBe(Screen.DRILL);
    expect(currentChallenge(g).ref).toBe('a');
  });

  it('advances challenges then reaches level complete', () => {
    let g = beginDrill(startGame(createGame(fakeLevels)));
    g = recordCorrect(g, answer);
    expect(g.challengeIndex).toBe(1);
    expect(g.screen).toBe(Screen.DRILL);
    g = recordCorrect(g, answer);
    expect(g.screen).toBe(Screen.LEVEL_COMPLETE);
  });

  it('nextLevel moves to the next concept, then victory after the last', () => {
    let g = beginDrill(startGame(createGame(fakeLevels)));
    g = recordCorrect(g, answer);
    g = recordCorrect(g, answer); // level complete
    g = nextLevel(g);
    expect(g.screen).toBe(Screen.CONCEPT);
    expect(g.levelIndex).toBe(1);
    g = beginDrill(g);
    g = recordCorrect(g, answer); // last challenge of last level
    expect(g.screen).toBe(Screen.LEVEL_COMPLETE);
    g = nextLevel(g);
    expect(g.screen).toBe(Screen.VICTORY);
  });

  it('mistakes cost lives and end the game at zero', () => {
    let g = beginDrill(startGame(createGame(fakeLevels)));
    g = recordMistake(g);
    expect(g.run.lives).toBe(2);
    expect(g.screen).toBe(Screen.DRILL); // retry same challenge
    g = recordMistake(g);
    g = recordMistake(g);
    expect(g.run.lives).toBe(0);
    expect(g.screen).toBe(Screen.GAME_OVER);
  });

  it('a mistake keeps the player on the same challenge', () => {
    let g = beginDrill(startGame(createGame(fakeLevels)));
    expect(currentChallenge(g).ref).toBe('a');
    g = recordMistake(g);
    expect(currentChallenge(g).ref).toBe('a');
  });

  it('restart returns to the start screen at level 1 with full lives', () => {
    let g = beginDrill(startGame(createGame(fakeLevels)));
    g = recordMistake(g);
    g = restart(g);
    expect(g.screen).toBe(Screen.START);
    expect(g.levelIndex).toBe(0);
    expect(g.run.lives).toBe(3);
    expect(g.run.score).toBe(0);
  });

  it('setOs only changes the os field', () => {
    const g = setOs(createGame(fakeLevels), 'mac');
    expect(g.os).toBe('mac');
  });
});
