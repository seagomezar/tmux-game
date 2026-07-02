import { describe, it, expect } from 'vitest';
import {
  normalizeEvent,
  chordMatches,
  isPrefix,
  needsTypedFallback,
  KeySequenceMatcher,
} from '../../js/input.js';
import { getKeybinding, PREFIX } from '../../js/keybindings.js';

// Build a fake KeyboardEvent-ish object.
const ev = (key, mods = {}) => ({
  key,
  ctrlKey: !!mods.ctrl,
  altKey: !!mods.alt,
  shiftKey: !!mods.shift,
  metaKey: !!mods.meta,
});

describe('normalizeEvent', () => {
  it('ignores modifier-only presses', () => {
    expect(normalizeEvent(ev('Control'))).toBeNull();
    expect(normalizeEvent(ev('Shift'))).toBeNull();
    expect(normalizeEvent(ev('Meta'))).toBeNull();
  });
  it('lowercases single letters and keeps modifiers', () => {
    const c = normalizeEvent(ev('B', { ctrl: true }));
    expect(c).toMatchObject({ key: 'b', ctrl: true });
  });
  it('preserves named keys like ArrowLeft', () => {
    expect(normalizeEvent(ev('ArrowLeft')).key).toBe('ArrowLeft');
  });
});

describe('chordMatches / isPrefix', () => {
  it('matches the prefix Ctrl-b', () => {
    expect(isPrefix(normalizeEvent(ev('b', { ctrl: true })))).toBe(true);
  });
  it('rejects b without ctrl as the prefix', () => {
    expect(isPrefix(normalizeEvent(ev('b')))).toBe(false);
  });
  it('requires ctrl/alt/meta to match exactly', () => {
    const expected = { key: 'ArrowLeft', ctrl: true };
    expect(chordMatches(normalizeEvent(ev('ArrowLeft', { ctrl: true })), expected)).toBe(true);
    expect(chordMatches(normalizeEvent(ev('ArrowLeft')), expected)).toBe(false);
  });
  it('matches shifted symbols by their symbol value', () => {
    // '%' arrives as the symbol already; matching should not require shift flag
    const expected = { key: '%' };
    expect(chordMatches(normalizeEvent(ev('%', { shift: true })), expected)).toBe(true);
  });
});

describe('needsTypedFallback', () => {
  it('flags browser-reserved combos', () => {
    expect(needsTypedFallback({ key: 'w', ctrl: true })).toBe(true);
    expect(needsTypedFallback({ key: 't', meta: true })).toBe(true);
  });
  it('does not flag normal keys', () => {
    expect(needsTypedFallback({ key: '%' })).toBe(false);
    expect(needsTypedFallback({ key: 'c' })).toBe(false);
  });
});

describe('KeySequenceMatcher', () => {
  it('requires the prefix first, then the key', () => {
    const m = new KeySequenceMatcher(getKeybinding('window-create')); // prefix c
    expect(m.feed(normalizeEvent(ev('b', { ctrl: true })))).toBe('incomplete');
    expect(m.feed(normalizeEvent(ev('c')))).toBe('correct');
  });
  it('reports wrong when the prefix is skipped', () => {
    const m = new KeySequenceMatcher(getKeybinding('window-create'));
    expect(m.feed(normalizeEvent(ev('c')))).toBe('wrong');
  });
  it('reports wrong on the incorrect second key', () => {
    const m = new KeySequenceMatcher(getKeybinding('pane-split-vertical')); // prefix %
    expect(m.feed(normalizeEvent(ev('b', { ctrl: true })))).toBe('incomplete');
    expect(m.feed(normalizeEvent(ev('x')))).toBe('wrong');
  });
  it('matches a modified final chord (prefix Ctrl-Left resize)', () => {
    const m = new KeySequenceMatcher(getKeybinding('resize-left'));
    expect(m.feed(normalizeEvent(ev('b', { ctrl: true })))).toBe('incomplete');
    expect(m.feed(normalizeEvent(ev('ArrowLeft', { ctrl: true })))).toBe('correct');
  });
  it('resets cleanly', () => {
    const m = new KeySequenceMatcher(getKeybinding('window-create'));
    m.feed(normalizeEvent(ev('b', { ctrl: true })));
    m.reset();
    // After reset the prefix is required again.
    expect(m.feed(normalizeEvent(ev('c')))).toBe('wrong');
  });
});
