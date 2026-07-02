// levels.js
//
// All game content. This is the ONLY file that changes when adding or editing
// levels - game logic never hard-codes content. Every challenge references a
// keybinding/command/terminal-shortcut by id from keybindings.js, and a unit
// test asserts those ids all resolve.
//
// Challenge schema:
//   { type: 'key'|'command'|'terminal', ref: <id>, prompt: string,
//     limitMs: number, effect?: string }
// `effect` is a hint to the mock tmux renderer about what to animate.

export const DEFAULT_LIMIT_MS = 6000;

const key = (ref, prompt, effect, limitMs = DEFAULT_LIMIT_MS) => ({
  type: 'key',
  ref,
  prompt,
  effect,
  limitMs,
});

const command = (ref, prompt, effect, limitMs = 9000) => ({
  type: 'command',
  ref,
  prompt,
  effect,
  limitMs,
});

const terminal = (ref, prompt, limitMs = 7000) => ({
  type: 'terminal',
  ref,
  prompt,
  limitMs,
});

export const LEVELS = [
  // 1 -----------------------------------------------------------------------
  {
    id: 'prefix',
    title: 'The Prefix',
    concept: `tmux listens for one special key combination called the **prefix**, then interprets the next key as a command. The default prefix is **Ctrl-b**.

Almost every tmux shortcut is: press **Ctrl-b**, release, then press one more key. This is the same on macOS, Linux and Windows - tmux runs inside your terminal, so there is no Cmd-b.

Two commands unlock everything else: the built-in key list, and the command prompt.`,
    diagram: `Ctrl-b  then  ?     ->  show every binding
Ctrl-b  then  :     ->  type a command`,
    challenges: [
      key('list-keys', 'Open the built-in list of all key bindings.', 'flash'),
      key('command-prompt', 'Open the tmux command prompt.', 'prompt'),
      key('list-keys', 'Show the key bindings again - build the habit.', 'flash'),
    ],
  },

  // 2 -----------------------------------------------------------------------
  {
    id: 'sessions',
    title: 'Sessions',
    concept: `A **session** is a collection of windows that keeps running even after you disconnect. Detach, close your laptop, reconnect later, and everything is exactly as you left it.

You can run many named sessions and jump between them.`,
    diagram: `session: work  [detached]  ->  reattach anytime
Ctrl-b d  detach     Ctrl-b s  switch     Ctrl-b $  rename`,
    challenges: [
      key('session-detach', 'Detach from this session (leave it running).', 'detach'),
      key('session-list', 'Open the interactive session switcher.', 'list'),
      key('session-rename', 'Rename the current session.', 'rename'),
      key('session-next', 'Jump to the next session.', 'shift'),
      key('session-prev', 'Jump to the previous session.', 'shift'),
    ],
  },

  // 3 -----------------------------------------------------------------------
  {
    id: 'windows-basics',
    title: 'Windows: Basics',
    concept: `A **window** is like a tab inside a session - it fills the whole terminal and appears in the status bar at the bottom. Each session can hold many windows.`,
    diagram: `[0:vim] [1:shell] [2:logs]      <- status bar (windows)
Ctrl-b c  create   Ctrl-b ,  rename   Ctrl-b & kill`,
    challenges: [
      key('window-create', 'Create a new window.', 'window-add'),
      key('window-rename', 'Rename the current window.', 'rename'),
      key('window-next', 'Move to the next window.', 'window-next'),
      key('window-prev', 'Move to the previous window.', 'window-prev'),
      key('window-select-1', 'Jump straight to window number 1.', 'window-select'),
      key('window-kill', 'Kill (close) the current window.', 'window-kill'),
    ],
  },

  // 4 -----------------------------------------------------------------------
  {
    id: 'windows-navigation',
    title: 'Windows: Navigation',
    concept: `When you have many windows, you need faster ways to find them than stepping one at a time. tmux gives you an interactive list, a jump-to-last toggle, and name search.`,
    diagram: `Ctrl-b w  choose from list
Ctrl-b l  last window (toggle)      Ctrl-b f  find by name`,
    challenges: [
      key('window-list', 'Open the interactive window chooser.', 'list'),
      key('window-last', 'Toggle back to the last window you used.', 'window-next'),
      key('window-find', 'Search for a window by name.', 'prompt'),
    ],
  },

  // 5 -----------------------------------------------------------------------
  {
    id: 'panes-splitting',
    title: 'Panes: Splitting',
    concept: `A **pane** is a split of a window - multiple shells side by side in the same view.

A tip on tmux's naming: **Ctrl-b %** makes a **left/right** split (tmux calls this -h), and **Ctrl-b "** makes a **top/bottom** split (tmux calls this -v). Learn them by the picture, not the flag.`,
    diagram: `Ctrl-b %            Ctrl-b "
+------+------+      +-------------+
|      |      |      |             |
|      |      |      +-------------+
+------+------+      |             |
 left / right         top / bottom`,
    challenges: [
      key('pane-split-vertical', 'Split into LEFT and RIGHT panes.', 'split-lr'),
      key('pane-split-horizontal', 'Split into TOP and BOTTOM panes.', 'split-tb'),
      key('pane-split-vertical', 'Split left/right again.', 'split-lr'),
      key('pane-split-horizontal', 'Split top/bottom again.', 'split-tb'),
    ],
  },

  // 6 -----------------------------------------------------------------------
  {
    id: 'panes-navigation',
    title: 'Panes: Navigation',
    concept: `Once a window has several panes, move between them with the arrow keys after the prefix. You can also cycle, jump to the last pane, or flash the pane numbers.`,
    diagram: `Ctrl-b <arrow>  move by direction
Ctrl-b o  cycle    Ctrl-b ;  last pane    Ctrl-b q  show numbers`,
    challenges: [
      key('pane-left', 'Move to the pane on the LEFT.', 'focus-left'),
      key('pane-right', 'Move to the pane on the RIGHT.', 'focus-right'),
      key('pane-up', 'Move to the pane ABOVE.', 'focus-up'),
      key('pane-down', 'Move to the pane BELOW.', 'focus-down'),
      key('pane-cycle', 'Cycle to the next pane.', 'focus-cycle'),
      key('pane-last', 'Jump to the last active pane.', 'focus-cycle'),
      key('pane-numbers', 'Flash the pane numbers on screen.', 'numbers'),
    ],
  },

  // 7 -----------------------------------------------------------------------
  {
    id: 'panes-management',
    title: 'Panes: Management',
    concept: `Panes can be zoomed to fill the window, swapped around, killed, or broken out into their own window. **Ctrl-b z** zoom is the one you'll reach for constantly.`,
    diagram: `Ctrl-b z  zoom/unzoom     Ctrl-b x  kill pane
Ctrl-b { / }  swap prev/next    Ctrl-b !  break to window`,
    challenges: [
      key('pane-zoom', 'Zoom the current pane to fill the window.', 'zoom'),
      key('pane-swap-right', 'Swap this pane with the next one.', 'swap'),
      key('pane-swap-left', 'Swap this pane with the previous one.', 'swap'),
      key('pane-break', 'Break this pane out into its own window.', 'window-add'),
      key('pane-kill', 'Kill (close) the current pane.', 'pane-kill'),
    ],
  },

  // 8 -----------------------------------------------------------------------
  {
    id: 'resize-layouts',
    title: 'Resizing & Layouts',
    concept: `Fine-tune pane sizes by holding a modifier with the arrows after the prefix: **Ctrl** for one cell, **Alt** for five. Or press **Space** to cycle through tmux's preset layouts.`,
    diagram: `Ctrl-b Ctrl-<arrow>  resize by 1
Ctrl-b Alt-<arrow>   resize by 5      Ctrl-b Space  cycle layouts`,
    challenges: [
      key('resize-right', 'Resize the pane one cell to the RIGHT.', 'resize'),
      key('resize-left', 'Resize the pane one cell to the LEFT.', 'resize'),
      key('resize-left-big', 'Resize the pane FIVE cells to the left.', 'resize'),
      key('layout-cycle', 'Cycle to the next preset layout.', 'layout'),
    ],
  },

  // 9 -----------------------------------------------------------------------
  {
    id: 'copy-mode',
    title: 'Copy Mode & Buffers',
    concept: `**Copy mode** lets you scroll back through output and select text with the keyboard - no mouse needed. Copied text goes into paste **buffers** you can reuse.`,
    diagram: `Ctrl-b [  enter copy mode (scroll/select)
Ctrl-b ]  paste     Ctrl-b =  choose buffer     Ctrl-b #  list buffers`,
    challenges: [
      key('copy-enter', 'Enter copy mode to scroll and select.', 'copy-mode'),
      key('copy-paste', 'Paste the most recent buffer.', 'paste'),
      key('buffer-choose', 'Choose which buffer to paste from.', 'list'),
      key('buffer-list', 'List all paste buffers.', 'list'),
    ],
  },

  // 10 ----------------------------------------------------------------------
  {
    id: 'config-command',
    title: 'Config & Command Mode',
    concept: `The command prompt (**Ctrl-b :**) runs tmux commands directly - the same commands you'd put in **~/.tmux.conf**. Two favorites: enabling the mouse, and synchronizing typing across every pane.

You'll also mark panes and pop up a clock.`,
    diagram: `Ctrl-b :  then type a command
  set -g mouse on
  setw synchronize-panes
Ctrl-b m / M  mark / clear      Ctrl-b t  clock`,
    challenges: [
      command('cmd-mouse-on', 'Open the prompt and enable mouse support.', 'prompt'),
      command('cmd-synchronize', 'Open the prompt and toggle synchronize-panes.', 'prompt'),
      key('mark-pane', 'Mark the current pane.', 'mark'),
      key('mark-clear', 'Clear the marked pane.', 'mark'),
      key('clock', 'Show the big clock.', 'clock'),
    ],
  },

  // 11 ----------------------------------------------------------------------
  {
    id: 'terminal-and-boss',
    title: 'Terminal Shortcuts & Expert Boss Round',
    concept: `One thing that DOES change per OS: your **terminal emulator's** own copy/paste/new-tab shortcuts, which live outside tmux. On macOS they use **Cmd**; on Linux/Windows they use **Ctrl-Shift**.

Then it's the boss round - a fast mixed drill of everything you've learned. Clear it and you're a tmux expert.`,
    diagram: `Terminal (NOT tmux):
  macOS: Cmd-C / Cmd-V / Cmd-T
  Linux/Win: Ctrl-Shift-C / Ctrl-Shift-V / Ctrl-Shift-T
Then: rapid-fire mixed tmux drill`,
    challenges: [
      terminal('term-copy', 'Copy selected text in your terminal (OS-specific).'),
      terminal('term-paste', 'Paste in your terminal (OS-specific).'),
      terminal('term-new-tab', 'Open a new terminal tab (OS-specific).'),
      // Boss round: fast mixed tmux recall (tighter limits).
      key('window-create', 'BOSS: new window.', 'window-add', 4000),
      key('pane-split-vertical', 'BOSS: split left/right.', 'split-lr', 4000),
      key('pane-split-horizontal', 'BOSS: split top/bottom.', 'split-tb', 4000),
      key('pane-zoom', 'BOSS: zoom the pane.', 'zoom', 4000),
      key('session-detach', 'BOSS: detach the session.', 'detach', 4000),
      key('copy-enter', 'BOSS: enter copy mode.', 'copy-mode', 4000),
      key('command-prompt', 'BOSS: open the command prompt.', 'prompt', 4000),
    ],
  },
];
