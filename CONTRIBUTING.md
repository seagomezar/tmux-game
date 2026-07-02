# Contributing to tmux Trainer

Thanks for your interest in improving tmux Trainer.
This guide covers how to set up, the conventions to follow, and what we look for in a pull request.

## Getting started

```bash
git clone <your-fork-url>
cd tmux-game
npm install
npm run dev        # play the game locally at http://localhost:5173
```

Run the tests before you push:

```bash
npm test           # unit + content-validation tests (Vitest)
npm run test:e2e   # end-to-end tests (Playwright)
```

First-time e2e run: `npx playwright install chromium firefox`.

## The golden rule: tmux accuracy

Every shortcut the game teaches must be a real **tmux 3.x** default.

- The single source of truth is [`js/keybindings.js`](js/keybindings.js).
- Level content in [`js/levels.js`](js/levels.js) references bindings **by id** - never hard-code a key in a challenge.
- A unit test (`tests/unit/content.test.js`) fails if any challenge references an unknown binding, so add the binding to `keybindings.js` first.
- Never introduce a shortcut you have not verified. When in doubt, check `man tmux` or the official key table. Do not present OS differences as if tmux keybindings change per OS - they do not.

## Project conventions

- **No runtime dependencies in the shipped game.** No frameworks, no CDN scripts, no build step. Dev/test dependencies in `package.json` are fine; they are never deployed.
- **No persistence.** The game must reset to level 1 on refresh - do not add localStorage, cookies, or any server calls.
- **Small, single-responsibility modules.** Keep game logic, content data, and DOM rendering separate.
- **Pure functions where practical** (scoring, matching, state transitions) so they stay easy to unit-test.
- **Comments explain _why_**, especially browser key-conflict workarounds - not _what_.
- Use plain dashes, not em dashes, in prose.

## Adding or changing content

1. If you need a new shortcut, add it to `js/keybindings.js` with an `id`, `category`, `keys`, `display`, and `description`.
2. Reference it from a challenge in `js/levels.js`.
3. Run `npm test` - the content-validation suite will confirm everything lines up.

## Pull requests

Before opening a PR, please confirm:

- [ ] `npm test` passes (unit + content validation).
- [ ] `npm run test:e2e` passes.
- [ ] Any new/changed shortcut is verified against real tmux and lives in `keybindings.js`.
- [ ] No new runtime dependency, build step, or persistence was added to the shipped game.
- [ ] Docs updated if behavior changed.

Keep PRs focused. A clear description of the change and its motivation helps a lot.

## Reporting bugs and ideas

Use the issue templates for [bug reports](.github/ISSUE_TEMPLATE/bug_report.md) and [feature requests](.github/ISSUE_TEMPLATE/feature_request.md). For gameplay bugs, tell us your browser and OS and the exact level/challenge.

## Code of Conduct

By participating you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).
