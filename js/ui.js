// ui.js
//
// DOM rendering for each screen and the HUD. Pure-ish: given game state and a
// set of callbacks, it draws the current screen. It does not own game state;
// main.js does.

import { Screen } from './state.js';
import { STARTING_LIVES } from './scoring.js';
import { translate, t } from './translations.js';

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
  const comboText = translate(game.lang, 'comboLabel');
  const comboLabel = streak >= 2 ? `<span class="combo">x${Math.min(streak, 4)} ${comboText}</span>` : '';
  const levelLabel = translate(game.lang, 'levelLabel');
  const scoreLabel = translate(game.lang, 'scoreLabel');
  const title = level ? t(level.title, game.lang) : '';
  return `
    <div class="hud">
      <span class="hud-level">${levelLabel} ${game.levelIndex + 1}/${game.levels.length} · ${escapeHtml(title)}</span>
      <span class="hud-score">${scoreLabel} <b>${score}</b> ${comboLabel}</span>
      <span class="hud-lives">${renderHearts(lives)}</span>
    </div>`;
}

export const UI = {
  /** @param {HTMLElement} root */
  init(root) {
    this.root = root;
  },

  start(game, { onStart, onSelectOs, onSelectLang }) {
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
        <p class="tagline">${escapeHtml(translate(game.lang, 'tagline'))}</p>
        <div class="os-select">
          <span>${escapeHtml(translate(game.lang, 'osSelect'))}</span>
          <div class="os-buttons">
            ${['mac', 'linux', 'windows']
              .map(
                (os) =>
                  `<button class="os-btn ${game.os === os ? 'selected' : ''}" data-os="${os}">${os}</button>`
              )
              .join('')}
          </div>
        </div>
        <div class="lang-select">
          <span>${escapeHtml(translate(game.lang, 'langSelect'))}</span>
          <div class="lang-buttons">
            ${['en', 'es']
              .map(
                (lang) =>
                  `<button class="lang-btn ${game.lang === lang ? 'selected' : ''}" data-lang="${lang}">${lang === 'en' ? 'English' : 'Español'}</button>`
              )
              .join('')}
          </div>
        </div>
        <p class="notice">${translate(game.lang, 'tip')}</p>
        <button class="btn-primary start-btn">${escapeHtml(translate(game.lang, 'startBtn'))}</button>
      </section>`;

    this.root.querySelectorAll('.os-btn').forEach((b) =>
      b.addEventListener('click', () => onSelectOs(b.dataset.os))
    );
    this.root.querySelectorAll('.lang-btn').forEach((b) =>
      b.addEventListener('click', () => onSelectLang(b.dataset.lang))
    );
    this.root.querySelector('.start-btn').addEventListener('click', onStart);
  },

  concept(game, { onBeginDrill }) {
    const level = game.levels[game.levelIndex];
    const levelLabel = translate(game.lang, 'levelConceptHeader');
    const startDrillBtn = translate(game.lang, 'startDrillBtn');
    this.root.innerHTML = `
      ${renderHud(game)}
      <section class="screen concept">
        <h2>${levelLabel} ${game.levelIndex + 1}: ${escapeHtml(t(level.title, game.lang))}</h2>
        <div class="concept-body">${mdInline(t(level.concept, game.lang))}</div>
        <pre class="diagram">${escapeHtml(t(level.diagram, game.lang))}</pre>
        <button class="btn-primary begin-btn">${escapeHtml(startDrillBtn)}</button>
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
    const challengeLabel = translate(game.lang, 'challengeLabel');
    const fallbackText = translate(game.lang, 'fallbackLabel', { expected: expectedDisplay });
    const submitText = translate(game.lang, 'submit');
    const captureHint = translate(game.lang, 'captureHint');

    this.root.innerHTML = `
      ${renderHud(game)}
      <section class="screen drill">
        <div class="tmux-mount"></div>
        <div class="challenge">
          <div class="challenge-step">${challengeLabel} ${stepNum}/${stepTotal}</div>
          <div class="challenge-prompt">${escapeHtml(t(challenge.prompt, game.lang))}</div>
          <div class="timer-bar"><div class="timer-fill"></div></div>
          ${
            fallback
              ? `<div class="fallback">
                   <label>${fallbackText}</label>
                   <input class="fallback-input" type="text" autocomplete="off" spellcheck="false" autofocus>
                   <button class="fallback-submit btn-secondary">${escapeHtml(submitText)}</button>
                 </div>`
              : `<div class="capture-hint">${escapeHtml(captureHint)}</div>`
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
    const clearedText = translate(game.lang, 'levelCleared');
    const scoreText = translate(game.lang, 'score');
    const livesRemainingText = translate(game.lang, 'livesRemaining');
    const nextBtnText = isLast ? translate(game.lang, 'faceBossBtn') : translate(game.lang, 'nextLevelBtn');

    this.root.innerHTML = `
      ${renderHud(game)}
      <section class="screen level-complete">
        <h2>✓ ${escapeHtml(t(level.title, game.lang))} ${escapeHtml(clearedText)}</h2>
        <p class="big-score">${escapeHtml(scoreText)}: ${game.run.score}</p>
        <p>${escapeHtml(renderHearts(game.run.lives).replace(/<[^>]+>/g, ''))} ${escapeHtml(livesRemainingText)}</p>
        <button class="btn-primary next-btn">${escapeHtml(nextBtnText)}</button>
      </section>`;
    this.root.querySelector('.next-btn').addEventListener('click', onNext);
  },

  gameOver(game, { onRestart }) {
    const gameOverTitle = translate(game.lang, 'gameOver');
    const gameOverText = translate(game.lang, 'gameOverText', { level: game.levelIndex + 1 });
    const gameOverFinalScore = translate(game.lang, 'gameOverFinalScore', { score: game.run.score });
    const gameOverNotice = translate(game.lang, 'gameOverNotice');
    const restartBtn = translate(game.lang, 'restartBtn');

    this.root.innerHTML = `
      <section class="screen game-over">
        <h2 class="danger">${escapeHtml(gameOverTitle)}</h2>
        <p>${escapeHtml(gameOverText)}</p>
        <p class="big-score">${escapeHtml(gameOverFinalScore)}</p>
        <p class="notice">${escapeHtml(gameOverNotice)}</p>
        <button class="btn-primary restart-btn">${escapeHtml(restartBtn)}</button>
      </section>`;
    this.root.querySelector('.restart-btn').addEventListener('click', onRestart);
  },

  victory(game, { onRestart }) {
    const victoryTitle = translate(game.lang, 'victoryTitle');
    const victoryText = translate(game.lang, 'victoryText', { levels: game.levels.length });
    const victoryFinalScore = translate(game.lang, 'victoryFinalScore', { score: game.run.score });
    const victoryNotice = translate(game.lang, 'victoryNotice');
    const playAgainBtn = translate(game.lang, 'playAgainBtn');

    this.root.innerHTML = `
      <section class="screen victory">
        <pre class="logo small">${escapeHtml(victoryTitle)}</pre>
        <h2>${escapeHtml(victoryText)}</h2>
        <p class="big-score">${escapeHtml(victoryFinalScore)}</p>
        <p>${victoryNotice}</p>
        <button class="btn-primary restart-btn">${escapeHtml(playAgainBtn)}</button>
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
