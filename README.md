# tmux Trainer

An interactive, level-based game that builds real **tmux** muscle memory.
Learn a concept, then drill it by physically pressing the shortcuts - 11 levels, 3 lives, no save points.
Clear the final boss round and you're a tmux expert.

Plain HTML, CSS and vanilla JavaScript. No framework, no build step, no backend, fully hostable on GitHub Pages.

## Play

- **Live demo:** _enable GitHub Pages for this repo to publish it (see [Deploying](#deploying)); the URL will appear here._
- **Locally:** clone the repo and run a static server (ES modules need to be served over HTTP, not opened as a `file://` URL):

  ```bash
  npm run dev        # serves at http://localhost:5173
  # or any static server, e.g.:  python3 -m http.server 5173
  ```

## How it works

- **Learn, then drill.** Each level opens with a concept card explaining the idea and its shortcut(s), then a series of timed challenges.
- **Press the real keys.** You physically press `Ctrl-b` then the command key. The game captures the keystrokes and validates the full sequence.
- **Some combos are typed instead.** A handful of shortcuts are reserved by the browser (e.g. new-tab), and terminal-emulator shortcuts live outside tmux - those challenges ask you to type the answer instead.
- **Scoring.** Base points + a speed bonus for fast answers + a combo multiplier for streaks.
- **Lives.** Three hearts. Every mistake (wrong keys or a timeout) costs one. Zero hearts ends the run and you restart from level 1.
- **No persistence.** Progress lives only in memory - refreshing or leaving the page resets you to level 1, by design.

## A note on tmux and operating systems

tmux keybindings are **identical on macOS, Linux and Windows**, because tmux runs *inside* a terminal rather than as a native app.
The default prefix is always `Ctrl-b` - there is no `Cmd-b`.
The only place `Cmd` vs `Ctrl` genuinely differs is your **terminal emulator's** own shortcuts (copy/paste/new-tab), which is why the game asks for your OS only to adapt that one short track.

## Levels

1. The Prefix
2. Sessions
3. Windows: Basics
4. Windows: Navigation
5. Panes: Splitting
6. Panes: Navigation
7. Panes: Management
8. Resizing & Layouts
9. Copy Mode & Buffers
10. Config & Command Mode
11. Terminal Shortcuts & Expert Boss Round

All shortcuts are verified against **tmux 3.x** defaults. The canonical reference lives in [`js/keybindings.js`](js/keybindings.js) and a unit test asserts every challenge maps to it, so the content can never drift from real tmux.

## Project structure

```
index.html            Single entry point (served on GitHub Pages)
css/style.css         Terminal/retro styling + animations
js/
  main.js             Game controller and drill loop
  state.js            In-memory game state machine (no persistence)
  scoring.js          Pure scoring / lives / combo logic
  input.js            Keystroke capture, sequence matching, conflict fallback
  keybindings.js      Canonical tmux reference (source of truth)
  levels.js           All level and challenge content
  tmuxScreen.js       Animated mock tmux renderer
  ui.js               Screen and HUD rendering
tests/
  unit/               Vitest unit + content-validation tests
  e2e/                Playwright end-to-end tests
```

The shipped game has **zero runtime dependencies**. Everything under `tests/`, `package.json` and the configs is dev/CI-only and is never deployed.

## Development

```bash
npm install            # dev/test dependencies only
npm run dev            # serve the game locally
npm test               # unit tests (Vitest)
npm run test:e2e       # end-to-end tests (Playwright, Chromium + Firefox)
npm run test:all       # everything
```

First-time e2e run needs browsers: `npx playwright install chromium firefox`.

## Deploying

The included GitHub Actions workflow (`.github/workflows/ci-and-deploy.yml`) runs the unit and e2e tests on every push and pull request, and - on a green push to `main` - publishes the static files to GitHub Pages.

To turn it on: in the repo settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. No manual build step is required, and only the static app (`index.html`, `css/`, `js/`, `assets/`) is published.

## Contributing

Contributions are welcome - see [CONTRIBUTING.md](CONTRIBUTING.md). Please also read our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE).
