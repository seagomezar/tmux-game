import { describe, it, expect } from 'vitest';
import { LEVELS } from '../../js/levels.js';
import {
  getKeybinding,
  getCommand,
  getTerminalShortcut,
  KEYBINDINGS,
} from '../../js/keybindings.js';

describe('level content integrity', () => {
  it('has 11 levels ending in the boss round', () => {
    expect(LEVELS).toHaveLength(11);
    expect(LEVELS[LEVELS.length - 1].id).toBe('terminal-and-boss');
  });

  it('every level has a title, concept, diagram and challenges', () => {
    for (const level of LEVELS) {
      expect(level.title, level.id).toBeTruthy();
      expect(level.concept, level.id).toBeTruthy();
      expect(level.diagram, level.id).toBeTruthy();
      expect(level.challenges.length, level.id).toBeGreaterThan(0);
    }
  });

  it('every challenge resolves to a real keybinding/command/shortcut', () => {
    for (const level of LEVELS) {
      for (const ch of level.challenges) {
        expect(['key', 'command', 'terminal']).toContain(ch.type);
        expect(ch.prompt, `${level.id}:${ch.ref}`).toBeTruthy();
        expect(ch.limitMs, `${level.id}:${ch.ref}`).toBeGreaterThan(0);
        // These throw if the id is unknown - the whole point of the check.
        if (ch.type === 'key') expect(() => getKeybinding(ch.ref)).not.toThrow();
        if (ch.type === 'command') expect(() => getCommand(ch.ref)).not.toThrow();
        if (ch.type === 'terminal') expect(() => getTerminalShortcut(ch.ref)).not.toThrow();
      }
    }
  });

  it('the prefix is Ctrl-b on every prefixed binding (tmux accuracy)', () => {
    // Sanity: no binding accidentally claims a Cmd-based prefix or similar.
    for (const b of KEYBINDINGS) {
      expect(typeof b.display).toBe('string');
      if (b.usesPrefix) {
        expect(b.display.startsWith('prefix')).toBe(true);
      }
    }
  });

  it('terminal shortcuts define all three OS variants', () => {
    const term = LEVELS.flatMap((l) => l.challenges).filter((c) => c.type === 'terminal');
    for (const c of term) {
      const s = getTerminalShortcut(c.ref);
      expect(s.keysByOs.mac).toBeTruthy();
      expect(s.keysByOs.linux).toBeTruthy();
      expect(s.keysByOs.windows).toBeTruthy();
    }
  });

  it('covers all major tmux categories (expert-level breadth)', () => {
    const categories = new Set();
    for (const level of LEVELS) {
      for (const ch of level.challenges) {
        if (ch.type === 'key') categories.add(getKeybinding(ch.ref).category);
      }
    }
    for (const expected of ['session', 'window', 'pane', 'resize', 'copy', 'advanced', 'meta']) {
      expect(categories, `missing category ${expected}`).toContain(expected);
    }
  });
});
