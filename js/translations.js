// translations.js
//
// Shared dictionaries and translate function for en and es support.

export const TRANSLATIONS = {
  en: {
    tagline: 'Master tmux by muscle memory. 11 levels. 3 lives. No mercy.',
    osSelect: 'Your OS (only affects terminal shortcuts):',
    langSelect: 'Language / Idioma:',
    tip: 'Tip: tmux keys are the same on every OS - the prefix is always <b>Ctrl-b</b>. You\'ll press the real keys; a few browser-reserved combos fall back to typing.',
    startBtn: 'Start ▸',
    startDrillBtn: 'Start drill ▸',
    nextLevelBtn: 'Next level ▸',
    faceBossBtn: 'Face the boss ▸',
    levelLabel: 'LVL',
    levelConceptHeader: 'Level',
    scoreLabel: 'score',
    comboLabel: 'combo',
    levelCleared: 'cleared',
    score: 'Score',
    livesRemaining: 'lives remaining',
    gameOver: 'GAME OVER',
    gameOverText: 'You ran out of lives on level {level}.',
    gameOverFinalScore: 'Final score: {score}',
    gameOverNotice: 'No save points - tmux mastery starts over from level 1.',
    restartBtn: 'Restart from Level 1 ▸',
    victoryTitle: '★  T M U X   E X P E R T  ★',
    victoryText: 'You cleared all {levels} levels.',
    victoryFinalScore: 'Final score: {score}',
    victoryNotice: 'You now know sessions, windows, panes, copy mode, layouts, config and the boss-round reflexes. Go run <code>tmux</code> for real.',
    playAgainBtn: 'Play again ▸',
    fallbackLabel: 'This combo is browser-reserved - type it instead (e.g. <code>{expected}</code>):',
    submit: 'Submit',
    captureHint: 'Press the keys now…',
    feedbackCorrect: '✓ nailed it',
    feedbackSlow: '✗ too slow',
    feedbackWrong: '✗ wrong keys',
    challengeLabel: 'Challenge',
  },
  es: {
    tagline: 'Domina tmux por memoria muscular. 11 niveles. 3 vidas. Sin piedad.',
    osSelect: 'Tu sistema operativo (solo afecta los atajos de terminal):',
    langSelect: 'Idioma / Language:',
    tip: 'Consejo: Las teclas de tmux son las mismas en todos los sistemas operativos - el prefijo siempre es <b>Ctrl-b</b>. Presionarás las teclas reales; algunas combinaciones reservadas del navegador se completan escribiendo.',
    startBtn: 'Comenzar ▸',
    startDrillBtn: 'Iniciar práctica ▸',
    nextLevelBtn: 'Siguiente nivel ▸',
    faceBossBtn: 'Enfréntate al jefe ▸',
    levelLabel: 'NIVEL',
    levelConceptHeader: 'Nivel',
    scoreLabel: 'puntuación',
    comboLabel: 'combo',
    levelCleared: 'superado',
    score: 'Puntuación',
    livesRemaining: 'vidas restantes',
    gameOver: 'FIN DEL JUEGO',
    gameOverText: 'Te quedaste sin vidas en el nivel {level}.',
    gameOverFinalScore: 'Puntuación final: {score}',
    gameOverNotice: 'Sin puntos de guardado - el dominio de tmux comienza de nuevo desde el nivel 1.',
    restartBtn: 'Reiniciar desde el Nivel 1 ▸',
    victoryTitle: '★  E X P E R T O   T M U X  ★',
    victoryText: 'Superaste los {levels} niveles.',
    victoryFinalScore: 'Puntuación final: {score}',
    victoryNotice: 'Ahora conoces sesiones, ventanas, paneles, modo de copia, diseños, configuración y los reflejos de la ronda de jefes. Ve a ejecutar <code>tmux</code> de verdad.',
    playAgainBtn: 'Jugar de nuevo ▸',
    fallbackLabel: 'Esta combinación está reservada por el navegador - escríbela en su lugar (ej. <code>{expected}</code>):',
    submit: 'Enviar',
    captureHint: 'Presiona las teclas ahora…',
    feedbackCorrect: '✓ ¡lo lograste!',
    feedbackSlow: '✗ demasiado lento',
    feedbackWrong: '✗ teclas incorrectas',
    challengeLabel: 'Desafío',
  }
};

/**
 * Get translated text for a key, optionally substituting placeholders.
 * @param {string} lang
 * @param {string} key
 * @param {Object} replacements
 */
export function translate(lang, key, replacements = {}) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  let text = dict[key] || TRANSLATIONS['en'][key] || '';
  for (const [k, v] of Object.entries(replacements)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

/**
 * Translate a localized object or string value.
 * @param {string|Object} val
 * @param {string} lang
 */
export function t(val, lang) {
  if (!val) return '';
  if (typeof val === 'string') return val;
  return val[lang] || val['en'] || '';
}
