# SPEC: tmux Trainer - Interactive Shortcut Practice Game

## 1. Objective

Build a browser-based game that trains programmers in tmux keyboard shortcuts through interactive, level-based, muscle-memory practice.
A player who completes the final level is a genuine tmux expert, fluent in sessions, windows, panes, copy mode, layouts, and advanced commands.

**Target users:** Developers who use (or want to use) tmux daily and want to build real muscle memory, from beginners to intermediate users leveling up to expert.

**Core principles:**

- 100% client-side. Plain HTML, CSS, and vanilla JavaScript. No build step, no framework, no backend, no database.
- Fully hostable on GitHub Pages as static files.
- No persistence. Refreshing or leaving the page resets progress to level 1. No localStorage, no cookies, no server state.
- tmux-accurate against current tmux 3.x default keybindings.

## 2. tmux Accuracy Model (Critical Domain Rule)

tmux keybindings are **identical on macOS, Linux, and Windows** because tmux runs inside a terminal, not as a native app.
The default prefix is `Ctrl-b`, then a key. There is **no `Cmd-b`**.

The game therefore has two tracks:

1. **tmux track (OS-independent):** Real tmux keybindings, same on every platform. This is the bulk of the game.
2. **Terminal track (OS-specific):** A smaller set of terminal-emulator shortcuts where `Cmd` vs `Ctrl` genuinely differs (e.g. copy/paste, clear, new tab). Player selects their OS at start; these challenges adapt (`Cmd-C` on macOS vs `Ctrl-Shift-C` on Linux/Windows).

The player picks their OS on the start screen. It only affects the terminal track; tmux challenges are constant.

### Canonical keybinding reference (tmux 3.x defaults, prefix = `Ctrl-b`)

- **Sessions:** `prefix d` detach, `prefix s` list/switch, `prefix $` rename, `prefix (` prev, `prefix )` next
- **Windows:** `prefix c` create, `prefix ,` rename, `prefix &` kill, `prefix n` next, `prefix p` prev, `prefix 0-9` select, `prefix w` list, `prefix l` last, `prefix f` find
- **Panes:** `prefix %` split vertical (L/R), `prefix "` split horizontal (T/B), `prefix ←↑→↓` navigate, `prefix o` cycle, `prefix ;` last, `prefix x` kill, `prefix z` zoom, `prefix {` swap-left, `prefix }` swap-right, `prefix !` break to window, `prefix q` show pane numbers, `prefix space` cycle layouts
- **Resize:** `prefix Ctrl-arrow` (by 1), `prefix Alt-arrow` (by 5)
- **Copy mode:** `prefix [` enter, `prefix ]` paste, `prefix =` choose buffer, `prefix #` list buffers
- **Command/config:** `prefix :` command prompt, `:set -g mouse on`, `:setw synchronize-panes`
- **Advanced:** `prefix m` mark, `prefix M` clear mark, `prefix t` clock, `prefix ?` list keys

## 3. Gameplay Design

### Level structure (Learn-then-drill)

Each level:

1. **Concept card:** Short explanation of the concept and its shortcut(s), with a static diagram of what it does.
2. **Drill:** A series of timed challenges. The mock tmux screen shows the scenario; the player performs the shortcut by physically pressing the keys.
3. **Level complete:** Summary of score, accuracy, and time before advancing.

### Levels (Full mastery, ~11 levels)

1. **The Prefix** - what `Ctrl-b` is and why it exists; `prefix ?` (list keys), `prefix :` (command prompt)
2. **Sessions** - detach `d`, list/switch `s`, rename `$`, prev/next `(` `)`
3. **Windows basics** - create `c`, rename `,`, kill `&`, next/prev `n`/`p`, select `0-9`
4. **Windows navigation** - list `w`, last `l`, find `f`
5. **Panes: splitting** - split vertical `%`, split horizontal `"`
6. **Panes: navigation** - arrows, cycle `o`, last `;`, show numbers `q`
7. **Panes: management** - kill `x`, zoom `z`, swap `{` `}`, break `!`
8. **Resizing & layouts** - `Ctrl-arrow`, `Alt-arrow`, cycle layouts `space`
9. **Copy mode & buffers** - enter `[`, paste `]`, choose buffer `=`, list buffers `#`
10. **Config & command mode** - `:set -g mouse on`, `:setw synchronize-panes`, marks `m`/`M`, clock `t`
11. **Terminal shortcuts (OS-specific) + expert mixed drill** - OS copy/paste/clear/new-tab, then a randomized boss round mixing all prior shortcuts under time pressure

Completing level 11 = tmux expert.

### Input handling

- Player physically presses the key sequence (e.g. `Ctrl-b` then `%`). The game captures real keystrokes and validates the full sequence.
- **Key-conflict strategy:** Aggressively `preventDefault()`/`stopPropagation()` to intercept browser actions. For combos that browsers reserve and cannot reliably capture (e.g. `Ctrl-w`, `Ctrl-t`), that specific challenge auto-falls-back to a typed-text answer (e.g. type `C-b &`). An upfront notice warns the player about this.
- A short list of known-unreliable combos is maintained in the challenge data so fallback is deterministic, not guessed at runtime.

### Scoring & lives

- **Points:** Base points per correct answer + speed bonus (faster = more) + combo multiplier for consecutive correct answers.
- **Lives:** 3 hearts. Each mistake (wrong key or timeout) loses one heart. 0 hearts = game over, restart from level 1.
- Lives persist across levels within a run (do not reset per level).
- Score displayed live; final score shown on game over / victory.

## 4. Visual Design

**Terminal/retro aesthetic:**

- Monospace font (e.g. system monospace stack), dark terminal background, green/amber accent palette, blinking cursor.
- **Animated mock tmux screen:** A faux tmux render with status bar, windows, and panes. Correct actions animate the result (e.g. a correct `%` visibly splits a pane left/right; `c` adds a window to the status bar). This reinforces what each shortcut does.
- HUD shows: current level, score, combo, hearts, and a countdown timer per challenge.
- Responsive enough to be usable on a laptop screen; keyboard-first (mouse only for menus).

## 5. Project Structure

```
/
├── index.html                      # Single entry point; hostable on GitHub Pages
├── css/
│   └── style.css                    # Terminal aesthetic, layout, animations
├── js/
│   ├── main.js                      # Bootstrap, screen routing, game loop
│   ├── state.js                     # In-memory game state (level, score, lives, combo)
│   ├── input.js                     # Keystroke capture, sequence matching, conflict fallback
│   ├── levels.js                    # Level + challenge data (content lives here)
│   ├── scoring.js                   # Pure scoring/lives/combo logic (unit-tested)
│   ├── keybindings.js               # Canonical tmux reference table (source of truth)
│   ├── tmuxScreen.js                # Mock tmux renderer + animations
│   └── ui.js                        # HUD, concept cards, screen transitions
├── assets/                          # Any static images/fonts if needed
├── tests/
│   ├── unit/                        # Vitest unit tests (scoring, matching, state, content validation)
│   └── e2e/                         # Playwright e2e specs (level flow, keystroke capture, hearts)
├── .github/
│   ├── workflows/
│   │   └── ci-and-deploy.yml        # Test + build-free deploy to GitHub Pages
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
├── package.json                     # Dev-only: test scripts + devDependencies (NOT shipped to Pages)
├── playwright.config.js
├── vitest.config.js
├── README.md                        # What it is, how to play, how to develop, how to deploy
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md               # Contributor Covenant
├── CHANGELOG.md
├── LICENSE                          # MIT
└── SPEC.md
```

- No bundler for the app. The shipped game is plain ES modules loaded directly in `index.html` with zero runtime dependencies.
- `package.json`, `node_modules`, and configs exist **only for local dev and CI**. GitHub Pages serves just `index.html`, `css/`, `js/`, and `assets/` - the tooling is never deployed.
- Content (levels, challenges, keybindings) is data-driven in `levels.js` / `keybindings.js` so adding/editing content never touches game logic.

## 6. Commands

The app has no build step. Commands below are for local dev, testing, and CI only.

- **Run locally:** `npm run dev` (serves the static files, e.g. via a tiny static server for correct ES-module behavior). Also works by opening `index.html` through any static server.
- **Unit tests:** `npm test` (Vitest, run in CI and locally). `npm run test:watch` for watch mode.
- **E2E tests:** `npm run test:e2e` (Playwright against the locally served game, headless in CI).
- **All tests:** `npm run test:all` (unit + e2e).
- **Deploy:** automatic via GitHub Actions on push to the default branch - runs unit + e2e tests, then publishes the static files to GitHub Pages. No manual build.

## 7. Code Style

- Vanilla ES modules, modern JS (ES2020+). No transpilation.
- Small, single-responsibility modules; game logic separated from content data and from DOM rendering.
- Pure functions for scoring, sequence matching, and state transitions where practical (easy to unit test).
- No external **runtime** dependencies. No CDN scripts in the shipped game; everything vendored so GitHub Pages works offline-capable. (Dev/test dependencies in `package.json` are fine and never shipped.)
- Descriptive names; comments explain *why* (especially browser key-conflict workarounds), not *what*.
- CSS: plain CSS with custom properties for the color palette; no preprocessor.

Two automated layers plus content validation, all wired into CI (see section 10).

- **Unit tests (Vitest):** scoring (base + speed + combo), lives decrement/game-over, key-sequence matching, OS-specific shortcut resolution, and state transitions. Pure-function design keeps these fast and deterministic.
- **Content validation (Vitest):** an automated check that every challenge's expected keybinding matches the canonical reference table in `keybindings.js`, so content can never drift from real tmux.
- **E2E tests (Playwright):** real-browser flows - start screen + OS selection, concept card → drill, physical keystroke capture, conflict fallback to typed answer, hearts decrement on mistakes, game over restarts at level 1, level completion advances, and a full run to victory on level 11. Run headless in CI across at least Chromium and Firefox.
- **Persistence check:** an e2e assertion that a refresh truly resets to level 1 (no localStorage/cookies leaked).

## 10. CI/CD Pipeline

A single GitHub Actions workflow (`.github/workflows/ci-and-deploy.yml`):

- **On pull request:** install dev deps, run `npm test` (unit) and `npm run test:e2e` (Playwright). PRs cannot merge on failure.
- **On push to default branch:** run the full test suite, then - only if green - deploy the static files to GitHub Pages using the official Pages deploy actions (`actions/upload-pages-artifact` + `actions/deploy-pages`).
- The deploy step publishes only the static app assets (`index.html`, `css/`, `js/`, `assets/`), never dev tooling.
- Playwright browsers cached to keep CI fast.

## 11. Open-Source Guidelines

- **License:** MIT (`LICENSE`).
- **README.md:** project pitch, live demo link (GitHub Pages URL), screenshots/GIF, how to play, level overview, local dev + test instructions, deploy notes, contribution pointer, license.
- **CONTRIBUTING.md:** how to set up, run tests, coding conventions, the "content must match `keybindings.js`" rule, and PR expectations (tests green, no runtime deps added).
- **CODE_OF_CONDUCT.md:** Contributor Covenant.
- **Issue templates:** bug report + feature request.
- **PR template:** checklist (tests pass, tmux accuracy verified, no new runtime deps, docs updated).
- **CHANGELOG.md:** Keep a Changelog format, semver. (Maintained manually per Sebastian's convention - not auto-generated.)

## 12. Boundaries

**Always:**

- Keep every tmux keybinding accurate to tmux 3.x defaults; validate against the canonical reference table in `keybindings.js`.
- Keep the **shipped app** 100% static and GitHub-Pages hostable with no build step, no backend, and no runtime dependencies.
- Keep the game fully playable via keyboard; explain the concept before drilling it.
- Keep progress non-persistent: refresh/leave resets to level 1.
- Keep unit + e2e tests green; CI must pass before merge and before deploy.

**Ask first before:**

- Adding any external **runtime** dependency, CDN, or framework to the shipped game, or introducing a build step for the app. (Dev/test dependencies for the CI pipeline are expected and fine.)
- Adding any form of persistence (localStorage, cookies, server).
- Changing the level count, level ordering, or what constitutes "expert."
- Changing core mechanics (lives count, scoring formula, input method).
- Changing the license or core OSS documents.

**Never:**

- Never introduce a backend, database, or network calls to third-party services in the shipped game.
- Never invent or approximate tmux shortcuts; if unsure, use only verified defaults.
- Never claim `Cmd-b` exists in tmux, or present OS differences as if tmux keybindings change per OS.
- Never persist user data or track users.
- Never deploy dev/test tooling to GitHub Pages.
- Never auto-generate or hand-edit `CHANGELOG.md` outside its documented manual process.
