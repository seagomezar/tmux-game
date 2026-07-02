// keybindings.js
//
// Canonical source of truth for every shortcut the game teaches.
//
// WHY this file exists: tmux keybindings must never drift from reality. All
// level content references these entries by id, and a unit test asserts that
// every challenge maps to an entry here. If tmux changes a default, it changes
// in exactly one place.
//
// tmux keybindings are IDENTICAL across macOS, Linux and Windows because tmux
// runs inside a terminal, not as a native app. The default prefix is Ctrl-b.
// There is no Cmd-b. The only place Cmd vs Ctrl genuinely differs is the
// terminal emulator around tmux (copy/paste/clear/new-tab) - those live in
// TERMINAL_SHORTCUTS and adapt to the player's chosen OS.
//
// Verified against tmux 3.x default key table (prefix table + root table).

// The prefix every tmux command starts with.
export const PREFIX = { ctrl: true, key: 'b', label: 'Ctrl-b' };

/**
 * A keybinding entry.
 * @typedef {Object} Keybinding
 * @property {string} id            Stable identifier referenced by level content.
 * @property {string} category      Grouping (session/window/pane/...).
 * @property {boolean} usesPrefix   Whether the binding is pressed after the prefix.
 * @property {Array<KeyChord>} keys The chord(s) pressed AFTER the prefix (or raw if !usesPrefix).
 * @property {string} display       Human-readable form, e.g. "prefix %".
 * @property {string} description   What the command does.
 */

/**
 * A single key chord: the physical key plus required modifiers.
 * @typedef {Object} KeyChord
 * @property {string} key    Normalized key (single char, or 'Arrow*', 'Enter', etc.).
 * @property {boolean} [ctrl]
 * @property {boolean} [alt]
 * @property {boolean} [shift]
 */

/** Helper to build a plain (unmodified) chord. */
const k = (key, mods = {}) => ({ key, ctrl: false, alt: false, shift: false, ...mods });

export const KEYBINDINGS = [
  // --- The prefix itself / meta ---------------------------------------------
  {
    id: 'list-keys',
    category: 'meta',
    usesPrefix: true,
    keys: [k('?')],
    display: 'prefix ?',
    description: 'List all key bindings (the built-in cheat sheet).',
  },
  {
    id: 'command-prompt',
    category: 'meta',
    usesPrefix: true,
    keys: [k(':')],
    display: 'prefix :',
    description: 'Open the tmux command prompt to type a command.',
  },

  // --- Sessions -------------------------------------------------------------
  {
    id: 'session-detach',
    category: 'session',
    usesPrefix: true,
    keys: [k('d')],
    display: 'prefix d',
    description: 'Detach from the current session (it keeps running in the background).',
  },
  {
    id: 'session-list',
    category: 'session',
    usesPrefix: true,
    keys: [k('s')],
    display: 'prefix s',
    description: 'Interactively list and switch between sessions.',
  },
  {
    id: 'session-rename',
    category: 'session',
    usesPrefix: true,
    keys: [k('$')],
    display: 'prefix $',
    description: 'Rename the current session.',
  },
  {
    id: 'session-prev',
    category: 'session',
    usesPrefix: true,
    keys: [k('(')],
    display: 'prefix (',
    description: 'Switch to the previous session.',
  },
  {
    id: 'session-next',
    category: 'session',
    usesPrefix: true,
    keys: [k(')')],
    display: 'prefix )',
    description: 'Switch to the next session.',
  },

  // --- Windows --------------------------------------------------------------
  {
    id: 'window-create',
    category: 'window',
    usesPrefix: true,
    keys: [k('c')],
    display: 'prefix c',
    description: 'Create a new window.',
  },
  {
    id: 'window-rename',
    category: 'window',
    usesPrefix: true,
    keys: [k(',')],
    display: 'prefix ,',
    description: 'Rename the current window.',
  },
  {
    id: 'window-kill',
    category: 'window',
    usesPrefix: true,
    keys: [k('&')],
    display: 'prefix &',
    description: 'Kill (close) the current window.',
  },
  {
    id: 'window-next',
    category: 'window',
    usesPrefix: true,
    keys: [k('n')],
    display: 'prefix n',
    description: 'Move to the next window.',
  },
  {
    id: 'window-prev',
    category: 'window',
    usesPrefix: true,
    keys: [k('p')],
    display: 'prefix p',
    description: 'Move to the previous window.',
  },
  {
    id: 'window-select-1',
    category: 'window',
    usesPrefix: true,
    keys: [k('1')],
    display: 'prefix 1',
    description: 'Select window number 1 (works for 0-9).',
  },
  {
    id: 'window-list',
    category: 'window',
    usesPrefix: true,
    keys: [k('w')],
    display: 'prefix w',
    description: 'Interactively list and choose a window.',
  },
  {
    id: 'window-last',
    category: 'window',
    usesPrefix: true,
    keys: [k('l')],
    display: 'prefix l',
    description: 'Jump to the last (previously active) window.',
  },
  {
    id: 'window-find',
    category: 'window',
    usesPrefix: true,
    keys: [k('f')],
    display: 'prefix f',
    description: 'Search for a window by name.',
  },

  // --- Panes: splitting -----------------------------------------------------
  {
    id: 'pane-split-vertical',
    category: 'pane',
    usesPrefix: true,
    keys: [k('%')],
    display: 'prefix %',
    description: 'Split the current pane into left and right panes. (tmux flag: -h)',
  },
  {
    id: 'pane-split-horizontal',
    category: 'pane',
    usesPrefix: true,
    keys: [k('"')],
    display: 'prefix "',
    description: 'Split the current pane into top and bottom panes. (tmux flag: -v)',
  },

  // --- Panes: navigation ----------------------------------------------------
  {
    id: 'pane-left',
    category: 'pane',
    usesPrefix: true,
    keys: [k('ArrowLeft')],
    display: 'prefix Left',
    description: 'Move to the pane on the left.',
  },
  {
    id: 'pane-right',
    category: 'pane',
    usesPrefix: true,
    keys: [k('ArrowRight')],
    display: 'prefix Right',
    description: 'Move to the pane on the right.',
  },
  {
    id: 'pane-up',
    category: 'pane',
    usesPrefix: true,
    keys: [k('ArrowUp')],
    display: 'prefix Up',
    description: 'Move to the pane above.',
  },
  {
    id: 'pane-down',
    category: 'pane',
    usesPrefix: true,
    keys: [k('ArrowDown')],
    display: 'prefix Down',
    description: 'Move to the pane below.',
  },
  {
    id: 'pane-cycle',
    category: 'pane',
    usesPrefix: true,
    keys: [k('o')],
    display: 'prefix o',
    description: 'Cycle to the next pane.',
  },
  {
    id: 'pane-last',
    category: 'pane',
    usesPrefix: true,
    keys: [k(';')],
    display: 'prefix ;',
    description: 'Jump to the last (previously active) pane.',
  },
  {
    id: 'pane-numbers',
    category: 'pane',
    usesPrefix: true,
    keys: [k('q')],
    display: 'prefix q',
    description: 'Briefly show pane numbers (press a number to jump).',
  },

  // --- Panes: management ----------------------------------------------------
  {
    id: 'pane-kill',
    category: 'pane',
    usesPrefix: true,
    keys: [k('x')],
    display: 'prefix x',
    description: 'Kill (close) the current pane.',
  },
  {
    id: 'pane-zoom',
    category: 'pane',
    usesPrefix: true,
    keys: [k('z')],
    display: 'prefix z',
    description: 'Toggle zoom - make the current pane fill the window, then restore.',
  },
  {
    id: 'pane-swap-left',
    category: 'pane',
    usesPrefix: true,
    keys: [k('{')],
    display: 'prefix {',
    description: 'Swap the current pane with the previous one.',
  },
  {
    id: 'pane-swap-right',
    category: 'pane',
    usesPrefix: true,
    keys: [k('}')],
    display: 'prefix }',
    description: 'Swap the current pane with the next one.',
  },
  {
    id: 'pane-break',
    category: 'pane',
    usesPrefix: true,
    keys: [k('!')],
    display: 'prefix !',
    description: 'Break the current pane out into its own window.',
  },

  // --- Resizing & layouts ---------------------------------------------------
  {
    id: 'resize-left',
    category: 'resize',
    usesPrefix: true,
    keys: [k('ArrowLeft', { ctrl: true })],
    display: 'prefix Ctrl-Left',
    description: 'Resize the pane one cell to the left.',
  },
  {
    id: 'resize-right',
    category: 'resize',
    usesPrefix: true,
    keys: [k('ArrowRight', { ctrl: true })],
    display: 'prefix Ctrl-Right',
    description: 'Resize the pane one cell to the right.',
  },
  {
    id: 'resize-left-big',
    category: 'resize',
    usesPrefix: true,
    keys: [k('ArrowLeft', { alt: true })],
    display: 'prefix Alt-Left',
    description: 'Resize the pane five cells to the left.',
  },
  {
    id: 'layout-cycle',
    category: 'resize',
    usesPrefix: true,
    keys: [k(' ')],
    display: 'prefix Space',
    description: 'Cycle through the preset pane layouts.',
  },

  // --- Copy mode & buffers --------------------------------------------------
  {
    id: 'copy-enter',
    category: 'copy',
    usesPrefix: true,
    keys: [k('[')],
    display: 'prefix [',
    description: 'Enter copy mode to scroll and select text.',
  },
  {
    id: 'copy-paste',
    category: 'copy',
    usesPrefix: true,
    keys: [k(']')],
    display: 'prefix ]',
    description: 'Paste the most recent buffer.',
  },
  {
    id: 'buffer-choose',
    category: 'copy',
    usesPrefix: true,
    keys: [k('=')],
    display: 'prefix =',
    description: 'Choose which buffer to paste from a list.',
  },
  {
    id: 'buffer-list',
    category: 'copy',
    usesPrefix: true,
    keys: [k('#')],
    display: 'prefix #',
    description: 'List all paste buffers.',
  },

  // --- Config / command mode / advanced -------------------------------------
  {
    id: 'mark-pane',
    category: 'advanced',
    usesPrefix: true,
    keys: [k('m')],
    display: 'prefix m',
    description: 'Mark the current pane (used with commands that act on a marked pane).',
  },
  {
    id: 'mark-clear',
    category: 'advanced',
    usesPrefix: true,
    keys: [k('M')],
    display: 'prefix M',
    description: 'Clear the marked pane.',
  },
  {
    id: 'clock',
    category: 'advanced',
    usesPrefix: true,
    keys: [k('t')],
    display: 'prefix t',
    description: 'Show a large clock in the current pane.',
  },
];

// Command-prompt commands (typed after `prefix :`). These are validated as
// typed text, not as keystrokes.
export const COMMANDS = [
  {
    id: 'cmd-mouse-on',
    category: 'command',
    text: 'set -g mouse on',
    display: ':set -g mouse on',
    description: 'Enable mouse support (click panes, scroll, resize by dragging).',
  },
  {
    id: 'cmd-synchronize',
    category: 'command',
    text: 'setw synchronize-panes',
    display: ':setw synchronize-panes',
    description: 'Toggle sending typed input to every pane in the window at once.',
  },
];

// OS-specific TERMINAL-EMULATOR shortcuts. These are NOT tmux commands - they
// belong to the terminal around tmux, and this is the only place Cmd vs Ctrl
// genuinely differs. `keysByOs` gives the correct chord per platform.
export const TERMINAL_SHORTCUTS = [
  {
    id: 'term-copy',
    category: 'terminal',
    description: 'Copy the selected text from the terminal.',
    keysByOs: {
      mac: { chord: k('c', { meta: true }), display: 'Cmd-C' },
      linux: { chord: k('c', { ctrl: true, shift: true }), display: 'Ctrl-Shift-C' },
      windows: { chord: k('c', { ctrl: true, shift: true }), display: 'Ctrl-Shift-C' },
    },
  },
  {
    id: 'term-paste',
    category: 'terminal',
    description: 'Paste into the terminal.',
    keysByOs: {
      mac: { chord: k('v', { meta: true }), display: 'Cmd-V' },
      linux: { chord: k('v', { ctrl: true, shift: true }), display: 'Ctrl-Shift-V' },
      windows: { chord: k('v', { ctrl: true, shift: true }), display: 'Ctrl-Shift-V' },
    },
  },
  {
    id: 'term-new-tab',
    category: 'terminal',
    description: 'Open a new terminal tab (terminal emulator, not tmux).',
    keysByOs: {
      mac: { chord: k('t', { meta: true }), display: 'Cmd-T' },
      linux: { chord: k('t', { ctrl: true, shift: true }), display: 'Ctrl-Shift-T' },
      windows: { chord: k('t', { ctrl: true, shift: true }), display: 'Ctrl-Shift-T' },
    },
  },
];

/** Look up a keybinding by id. Throws if missing (fail fast on content typos). */
export function getKeybinding(id) {
  const found = KEYBINDINGS.find((b) => b.id === id);
  if (!found) throw new Error(`Unknown keybinding id: ${id}`);
  return found;
}

/** Look up a command by id. */
export function getCommand(id) {
  const found = COMMANDS.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown command id: ${id}`);
  return found;
}

/** Look up a terminal shortcut by id. */
export function getTerminalShortcut(id) {
  const found = TERMINAL_SHORTCUTS.find((t) => t.id === id);
  if (!found) throw new Error(`Unknown terminal shortcut id: ${id}`);
  return found;
}

/** All ids that exist, for content-validation tests. */
export function allIds() {
  return [
    ...KEYBINDINGS.map((b) => b.id),
    ...COMMANDS.map((c) => c.id),
    ...TERMINAL_SHORTCUTS.map((t) => t.id),
  ];
}
