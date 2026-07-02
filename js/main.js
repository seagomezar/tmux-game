// main.js
//
// Game controller. Owns the game state, routes screens, and drives the drill
// loop: render a challenge, capture input, score it, advance. No persistence -
// reloading the page restarts everything at level 1.

import { LEVELS } from './levels.js';
import {
  createGame,
  setOs,
  startGame,
  beginDrill,
  recordCorrect,
  recordMistake,
  nextLevel,
  restart,
  currentChallenge,
  Screen,
} from './state.js';
import {
  getKeybinding,
  getCommand,
  getTerminalShortcut,
} from './keybindings.js';
import {
  attachCapture,
  KeySequenceMatcher,
  needsTypedFallback,
} from './input.js';
import { UI } from './ui.js';
import { TmuxScreen } from './tmuxScreen.js';

const root = document.getElementById('app');
UI.init(root);

let game = createGame(LEVELS);

// Per-challenge runtime state.
let detachCapture = null;
let matcher = null;
let timerRAF = null;
let challengeStart = 0;
let challengeDeadline = 0;
let tmux = null;
let resolved = false; // guards against double-resolving a challenge

const now = () =>
  typeof performance !== 'undefined' && performance.now
    ? performance.now()
    : Date.now();

/** Resolve the display string a challenge expects (for hints/fallback). */
function expectedDisplay(challenge) {
  if (challenge.type === 'key') return getKeybinding(challenge.ref).display;
  if (challenge.type === 'command') return getCommand(challenge.ref).display;
  const t = getTerminalShortcut(challenge.ref);
  return t.keysByOs[game.os].display;
}

/** The final chord a key/terminal challenge ends on (for fallback detection). */
function finalChord(challenge) {
  if (challenge.type === 'key') {
    const kb = getKeybinding(challenge.ref);
    return kb.keys[kb.keys.length - 1];
  }
  if (challenge.type === 'terminal') {
    return getTerminalShortcut(challenge.ref).keysByOs[game.os].chord;
  }
  return null; // commands are typed anyway
}

/**
 * Does this challenge require typed input rather than live capture?
 * - commands are always typed (they're typed at the tmux prompt anyway)
 * - terminal-emulator shortcuts are always typed: they belong to the terminal
 *   around tmux, not the page, and combos like Ctrl-Shift-C / Cmd-T are
 *   browser-reserved (devtools, tabs) and can't be captured reliably
 * - otherwise, only fall back for the handful of browser-reserved tmux combos
 */
function usesFallback(challenge) {
  if (challenge.type === 'command') return true;
  if (challenge.type === 'terminal') return true;
  const fc = finalChord(challenge);
  return fc ? needsTypedFallback(fc) : false;
}

function clearTimers() {
  if (timerRAF) cancelAnimationFrame(timerRAF);
  timerRAF = null;
}

function teardownChallenge() {
  if (detachCapture) detachCapture();
  detachCapture = null;
  clearTimers();
}

/** Advance after a correct or mistaken answer, re-rendering the flow. */
function advance(nextGame) {
  teardownChallenge();
  game = nextGame;
  route();
}

function handleCorrect() {
  if (resolved) return;
  resolved = true;
  const elapsedMs = now() - challengeStart;
  const challenge = currentChallenge(game);
  if (tmux) tmux.applyEffect(challenge.effect);
  flashFeedback('correct', '✓ nailed it');
  // Small delay so the player sees the animation before moving on.
  setTimeout(() => advance(recordCorrect(game, { elapsedMs, limitMs: challenge.limitMs })), 450);
}

function handleMistake(reason) {
  if (resolved) return;
  resolved = true;
  flashFeedback('wrong', reason === 'timeout' ? '✗ too slow' : '✗ wrong keys');
  setTimeout(() => {
    const after = recordMistake(game);
    // On a non-fatal mistake we retry the same challenge; renderDrill re-inits.
    advance(after);
  }, 600);
}

function flashFeedback(kind, text) {
  const el = root.querySelector('.feedback');
  if (el) {
    el.textContent = text;
    el.className = `feedback ${kind}`;
  }
}

/** Start the timer bar animation and the timeout deadline. */
function startTimer(limitMs, timerFill) {
  challengeStart = now();
  challengeDeadline = challengeStart + limitMs;
  const tick = () => {
    const remaining = Math.max(0, challengeDeadline - now());
    const frac = remaining / limitMs;
    if (timerFill) timerFill.style.width = `${frac * 100}%`;
    if (remaining <= 0) {
      handleMistake('timeout');
      return;
    }
    timerRAF = requestAnimationFrame(tick);
  };
  tick();
}

/** Render and wire a single drill challenge. */
function renderDrill() {
  resolved = false;
  const challenge = currentChallenge(game);
  const fallback = usesFallback(challenge);
  const refs = UI.drill(game, challenge, expectedDisplay(challenge), { fallback });

  // Mount / carry over the mock tmux screen.
  tmux = new TmuxScreen(refs.tmuxMount);

  startTimer(challenge.limitMs, refs.timerFill);

  if (fallback) {
    wireFallback(challenge, refs);
  } else {
    wireCapture(challenge);
  }
}

function wireCapture(challenge) {
  matcher = new KeySequenceMatcher(getKeybinding(challenge.ref));
  detachCapture = attachCapture((chord) => {
    const result = matcher.feed(chord);
    if (result === 'correct') handleCorrect();
    else if (result === 'wrong') handleMistake('wrong');
    // 'incomplete' -> keep waiting for the next chord
  });
}

function wireFallback(challenge, refs) {
  const expected =
    challenge.type === 'command'
      ? getCommand(challenge.ref).text
      : expectedDisplay(challenge);

  const submit = () => {
    const val = (refs.fallbackInput.value || '').trim();
    if (matchesTyped(val, expected, challenge)) handleCorrect();
    else handleMistake('wrong');
  };

  if (refs.fallbackInput) {
    refs.fallbackInput.focus();
    refs.fallbackInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
    });
  }
  if (refs.fallbackSubmit) refs.fallbackSubmit.addEventListener('click', submit);
}

/**
 * Accept typed answers flexibly.
 * - commands: match the command text (an optional leading ':' is ignored)
 * - terminal shortcuts: match the OS display string, tolerating notation like
 *   "cmd", "ctrl", "shift", separators and spacing
 * - key shortcuts (rare fallback): accept "C-b &", "prefix &" or the display
 */
function matchesTyped(input, expected, challenge) {
  const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
  const a = norm(input).replace(/^:/, '');

  if (challenge.type === 'command') {
    return a === norm(expected).replace(/^:/, '');
  }

  if (challenge.type === 'terminal') {
    // Canonicalize modifier notation and drop separators/spaces entirely.
    const canonTerm = (s) =>
      norm(s)
        .replace(/command|cmd|⌘/g, 'meta')
        .replace(/control|ctrl|⌃/g, 'ctrl')
        .replace(/option|opt|alt|⌥/g, 'alt')
        .replace(/[-+_ ]/g, '')
        .split('')
        .sort()
        .join('');
    return canonTerm(a) === canonTerm(expected);
  }

  const target = norm(expected)
    .replace('prefix', 'c-b')
    .replace(/ctrl-/g, 'c-')
    .replace(/alt-/g, 'm-');
  const canon = a
    .replace('prefix', 'c-b')
    .replace(/ctrl-/g, 'c-')
    .replace(/alt-/g, 'm-');
  return canon === target;
}

/** Top-level router. */
function route() {
  if (game.screen === Screen.DRILL) {
    renderDrill();
    return;
  }
  UI.render(game, handlers);
}

const handlers = {
  onSelectOs: (os) => {
    game = setOs(game, os);
    route();
  },
  onStart: () => {
    game = startGame(game);
    route();
  },
  onBeginDrill: () => {
    game = beginDrill(game);
    route();
  },
  onNext: () => {
    game = nextLevel(game);
    route();
  },
  onRestart: () => {
    game = restart(game);
    route();
  },
};

route();
