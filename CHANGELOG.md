# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial release of tmux Trainer.
- 11 levels covering the prefix, sessions, windows, panes (splitting, navigation,
  management), resizing and layouts, copy mode and buffers, config and command
  mode, and a terminal-shortcut plus expert boss round.
- Learn-then-drill format with a concept card and animated mock tmux screen per level.
- Physical keystroke capture with a typed fallback for browser-reserved and
  terminal-emulator shortcuts.
- Scoring with speed bonus and combo multiplier; three lives; restart from
  level 1 on game over.
- Canonical tmux keybinding reference with a content-validation test.
- Vitest unit tests and Playwright end-to-end tests (Chromium + Firefox).
- GitHub Actions pipeline that tests on every push/PR and deploys to GitHub Pages.
