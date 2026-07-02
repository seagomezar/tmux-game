// input.js
//
// Keystroke capture, normalization and sequence matching.
//
// The matching logic is pure so it can be unit-tested without a browser.
// The DOM wiring (attachCapture) is a thin layer on top that feeds normalized
// chords into a KeySequenceMatcher.

import { PREFIX } from './keybindings.js';

/**
 * Combos that browsers reserve so aggressively that we cannot reliably capture
 * them even with preventDefault (they may close the tab/window first). A
 * challenge whose answer needs one of these auto-falls-back to a typed answer.
 *
 * Keyed by `${ctrl?'C':''}${meta?'M':''}${key.toLowerCase()}`.
 */
export const UNRELIABLE_COMBOS = new Set([
  'Cw', // Ctrl-W closes the tab in most browsers
  'Ct', // Ctrl-T opens a new tab
  'Cn', // Ctrl-N opens a new window
  'Cq', // Ctrl-Q quits in some browsers
  'Mw', // Cmd-W closes the tab (macOS)
  'Mt', // Cmd-T new tab (macOS)
  'Mn', // Cmd-N new window (macOS)
  'Mq', // Cmd-Q quits the browser (macOS)
]);

/**
 * Normalize a KeyboardEvent into a plain chord object the matcher understands.
 * Modifier-only presses (pressing just Ctrl) return null so they are ignored
 * until the real key arrives.
 *
 * @param {KeyboardEvent} e
 * @returns {{key:string, ctrl:boolean, alt:boolean, shift:boolean, meta:boolean}|null}
 */
export function normalizeEvent(e) {
  const key = e.key;
  if (key === 'Control' || key === 'Alt' || key === 'Shift' || key === 'Meta') {
    return null;
  }
  // Normalize single letters to lowercase; shift is tracked separately, but
  // symbols that require shift (like %, ", $) arrive already as the symbol.
  const normalizedKey = key.length === 1 ? key.toLowerCase() : key;
  return {
    key: normalizedKey,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey,
  };
}

/**
 * Does a captured chord match an expected chord from the keybinding table?
 * Shift is intentionally NOT compared directly: symbols like % already encode
 * their shifted nature in the key value, and requiring shift state would make
 * matching brittle across keyboard layouts. Ctrl/Alt/Meta must match exactly.
 *
 * @param {Object} captured  From normalizeEvent.
 * @param {Object} expected  A KeyChord from keybindings.js (key + modifiers).
 */
export function chordMatches(captured, expected) {
  if (!captured) return false;
  const expectedKey = expected.key.length === 1 ? expected.key.toLowerCase() : expected.key;
  return (
    captured.key === expectedKey &&
    captured.ctrl === !!expected.ctrl &&
    captured.alt === !!expected.alt &&
    !!captured.meta === !!expected.meta
  );
}

/** Is this captured chord the tmux prefix (Ctrl-b)? */
export function isPrefix(captured) {
  return chordMatches(captured, PREFIX);
}

/** Build the fallback lookup key for a chord (matches UNRELIABLE_COMBOS). */
function comboKey(chord) {
  return `${chord.ctrl ? 'C' : ''}${chord.meta ? 'M' : ''}${chord.key.toLowerCase()}`;
}

/**
 * Should a challenge fall back to typed input because its final chord can't be
 * reliably captured in a browser?
 *
 * @param {Object} finalChord The last chord the player must press.
 */
export function needsTypedFallback(finalChord) {
  return UNRELIABLE_COMBOS.has(comboKey(finalChord));
}

/**
 * Stateful matcher for a prefix-based challenge. Feed it normalized chords;
 * it tracks whether the prefix has been pressed and whether the sequence
 * completed correctly.
 *
 * Result of feed():
 *   'incomplete' - progress made (e.g. prefix accepted), keep going
 *   'correct'    - full sequence matched
 *   'wrong'      - a mistake; caller should count it against lives
 */
export class KeySequenceMatcher {
  /**
   * @param {Object} keybinding A KEYBINDINGS entry (usesPrefix + keys[]).
   */
  constructor(keybinding) {
    this.binding = keybinding;
    this.prefixSeen = !keybinding.usesPrefix; // no prefix needed => already satisfied
    this.index = 0; // which chord in keys[] we expect next
  }

  reset() {
    this.prefixSeen = !this.binding.usesPrefix;
    this.index = 0;
  }

  /**
   * @param {Object} captured From normalizeEvent (never null; caller filters).
   * @returns {'incomplete'|'correct'|'wrong'}
   */
  feed(captured) {
    if (this.binding.usesPrefix && !this.prefixSeen) {
      if (isPrefix(captured)) {
        this.prefixSeen = true;
        return 'incomplete';
      }
      // Anything else before the prefix is a mistake.
      return 'wrong';
    }

    const expected = this.binding.keys[this.index];
    if (chordMatches(captured, expected)) {
      this.index += 1;
      if (this.index >= this.binding.keys.length) {
        return 'correct';
      }
      return 'incomplete';
    }
    return 'wrong';
  }
}

/**
 * Attach a global keydown capturer. Aggressively prevents default browser
 * behavior so tmux-style combos don't trigger the browser. Calls
 * onChord(normalizedChord) for every real (non-modifier) key press.
 *
 * Returns a detach function.
 *
 * @param {(chord:Object, event:KeyboardEvent)=>void} onChord
 * @param {Document|HTMLElement} [target=document]
 */
export function attachCapture(onChord, target = document) {
  const handler = (e) => {
    const chord = normalizeEvent(e);
    if (!chord) return; // modifier-only; let it pass
    // Prevent the browser from acting on the combo where we can.
    e.preventDefault();
    e.stopPropagation();
    onChord(chord, e);
  };
  target.addEventListener('keydown', handler, { capture: true });
  return () => target.removeEventListener('keydown', handler, { capture: true });
}
