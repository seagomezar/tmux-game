// ui.js
//
// DOM rendering for each screen and the HUD. Pure-ish: given game state and a
// set of callbacks, it draws the current screen. It does not own game state;
// main.js does.

import { Screen } from './state.js';
import { STARTING_LIVES } from './scoring.js';

/** Minimal markdown: **bold** and line breaks. Escapes HTML first. */
function mdInline(text) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Render the hearts row. */
export function renderHearts(lives) {
  let s = '';
  for (let i = 0; i < STARTING_LIVES; i++) {
    s += `<span class="heart ${i < lives ? 'full' : 'empty'}">${i < lives ? '♥' : '♡'}</span>`;
  }
  return s;
}

/** Render the persistent HUD (level, score, combo, hearts). */
export function renderHud(game) {
  const level = game.levels[game.levelIndex];
  const { score, streak, lives } = game.run;
  const comboLabel = streak >= 2 ? `<span class="combo">x${Math.min(streak, 4)} combo</span>` : '';
  return `
    <div class="hud">
      <span class="hud-level">LVL ${game.levelIndex + 1}/${game.levels.length} · ${escapeHtml(
    level ? level.title : ''
  )}</span>
      <span class="hud-score">score <b>${score}</b> ${comboLabel}</span>
      <span class="hud-lives">${renderHearts(lives)}</span>
    </div>`;
}

export const UI = {
  /** @param {HTMLElement} root */
  init(root) {
    this.root = root;
  },

  start(game, { onStart, onSelectOs }) {
    this.root.innerHTML = `
      <section class="screen start">
        <pre class="logo">
 _
| |_ _ __ ___  _   ___  __   __ _  __ _ _ __ ___   ___
| __| '_ \` _ \\| | | \\ \\/ /  / _\` |/ _\` | '_ \` _ \\ / _ \\
| |_| | | | | | |_| |>  <  | (_| | (_| | | | | | |  __/
 \\__|_| |_| |_|\\__,_/_/\\_\\  \\__, |\\__,_|_| |_| |_|\\___|
                            |___/
        </pre>
        <p class="tagline">Master tmux by muscle memory. 11 levels. 3 lives. No mercy.</p>
        <div class="os-select">
          <span>Your OS (only affects terminal shortcuts):</span>
          <div class="os-buttons">
            ${['mac', 'linux', 'windows']
              .map(
                (os) =>
                  `<button class="os-btn ${game.os === os ? 'selected' : ''}" data-os="${os}">${os}</button>`
              )
              .join('')}
          </div>
        </div>
        <p class="notice">Tip: tmux keys are the same on every OS - the prefix is always <b>Ctrl-b</b>. You'll press the real keys; a few browser-reserved combos fall back to typing.</p>
        <button class="btn-primary start-btn">Start ▸</button>
      </section>`;

    this.root.querySelectorAll('.os-btn').forEach((b) =>
      b.addEventListener('click', () => onSelectOs(b.dataset.os))
    );
    this.root.querySelector('.start-btn').addEventListener('click', onStart);
  },

  concept(game, { onBeginDrill }) {
    const level = game.levels[game.levelIndex];
    this.root.innerHTML = `
      ${renderHud(game)}
      <section class="screen concept">
        <h2>Level ${game.levelIndex + 1}: ${escapeHtml(level.title)}</h2>
        <div class="concept-body">${mdInline(level.concept)}</div>
        <pre class="diagram">${escapeHtml(level.diagram)}</pre>
        <button class="btn-primary begin-btn">Start drill ▸</button>
      </section>`;
    this.root.querySelector('.begin-btn').addEventListener('click', onBeginDrill);
  },

  /**
   * Render the drill screen shell. The mock tmux screen and live feedback are
   * updated separately by main.js via the returned element refs.
   */
  drill(game, challenge, expectedDisplay, { fallback }) {
    const level = game.levels[game.levelIndex];
    const stepNum = game.challengeIndex + 1;
    const stepTotal = level.challenges.length;

    this.root.innerHTML = `
      ${renderHud(game)}
      <section class="screen drill">
        <div class="tmux-mount"></div>
        <div class="challenge">
          <div class="challenge-step">Challenge ${stepNum}/${stepTotal}</div>
          <div class="challenge-prompt">${escapeHtml(challenge.prompt)}</div>
          <div class="timer-bar"><div class="timer-fill"></div></div>
          ${
            fallback
              ? `<div class="fallback">
                   <label>This combo is browser-reserved - type it instead (e.g. <code>${escapeHtml(
                     expectedDisplay
                   )}</code>):</label>
                   <input class="fallback-input" type="text" autocomplete="off" spellcheck="false" autofocus>
                   <button class="fallback-submit btn-secondary">Submit</button>
                 </div>`
              : `<div class="capture-hint">Press the keys now…</div>`
          }
          <div class="feedback" aria-live="polite"></div>
        </div>
      </section>`;

    return {
      tmuxMount: this.root.querySelector('.tmux-mount'),
      timerFill: this.root.querySelector('.timer-fill'),
      feedback: this.root.querySelector('.feedback'),
      fallbackInput: this.root.querySelector('.fallback-input'),
      fallbackSubmit: this.root.querySelector('.fallback-submit'),
    };
  },

  levelComplete(game, { onNext }) {
    const level = game.levels[game.levelIndex];
    const isLast = game.levelIndex >= game.levels.length - 1;
    this.root.innerHTML = `
      ${renderHud(game)}
      <section class="screen level-complete">
        <h2>✓ ${escapeHtml(level.title)} cleared</h2>
        <p class="big-score">Score: ${game.run.score}</p>
        <p>${escapeHtml(renderHearts(game.run.lives).replace(/<[^>]+>/g, ''))} lives remaining</p>
        <button class="btn-primary next-btn">${isLast ? 'Face the boss ▸' : 'Next level ▸'}</button>
      </section>`;
    this.root.querySelector('.next-btn').addEventListener('click', onNext);
  },

  gameOver(game, { onRestart }) {
    this.root.innerHTML = `
      <section class="screen game-over">
        <h2 class="danger">GAME OVER</h2>
        <p>You ran out of lives on level ${game.levelIndex + 1}.</p>
        <p class="big-score">Final score: ${game.run.score}</p>
        <p class="notice">No save points - tmux mastery starts over from level 1.</p>
        <button class="btn-primary restart-btn">Restart from Level 1 ▸</button>
      </section>`;
    this.root.querySelector('.restart-btn').addEventListener('click', onRestart);
  },

  victory(game, { onRestart }) {
    this.root.innerHTML = `
      <section class="screen victory">
        <pre class="logo small">★  T M U X   E X P E R T  ★</pre>
        <h2>You cleared all ${game.levels.length} levels.</h2>
        <p class="big-score">Final score: ${game.run.score}</p>
        <p>You now know sessions, windows, panes, copy mode, layouts, config and the boss-round reflexes. Go run <code>tmux</code> for real.</p>
        <button class="btn-primary restart-btn">Play again ▸</button>
      </section>`;
    this.root.querySelector('.restart-btn').addEventListener('click', onRestart);
  },

  /** Route to the correct screen renderer. */
  render(game, handlers) {
    switch (game.screen) {
      case Screen.START:
        return this.start(game, handlers);
      case Screen.CONCEPT:
        return this.concept(game, handlers);
      case Screen.LEVEL_COMPLETE:
        return this.levelComplete(game, handlers);
      case Screen.GAME_OVER:
        return this.gameOver(game, handlers);
      case Screen.VICTORY:
        return this.victory(game, handlers);
      // DRILL is rendered by main.js (it needs per-challenge wiring).
      default:
        return null;
    }
  },
};
