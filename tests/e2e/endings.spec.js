import { test, expect } from '@playwright/test';
import { LEVELS } from '../../js/levels.js';
import { getKeybinding, getCommand, getTerminalShortcut } from '../../js/keybindings.js';

const OS = 'linux';

async function startAt(page) {
  await page.goto('/');
  await page.locator(`.os-btn[data-os="${OS}"]`).click();
  await page.locator('.start-btn').click();
  await page.locator('.begin-btn').click();
}

async function prefixThen(page, chord) {
  await page.keyboard.down('Control');
  await page.keyboard.press('b');
  await page.keyboard.up('Control');
  // Press the final chord with any required modifiers.
  const mods = [];
  if (chord.ctrl) mods.push('Control');
  if (chord.alt) mods.push('Alt');
  for (const m of mods) await page.keyboard.down(m);
  await page.keyboard.press(playwrightKey(chord.key));
  for (const m of mods.reverse()) await page.keyboard.up(m);
}

// Map our normalized key to a Playwright key name.
function playwrightKey(key) {
  const map = {
    ArrowLeft: 'ArrowLeft',
    ArrowRight: 'ArrowRight',
    ArrowUp: 'ArrowUp',
    ArrowDown: 'ArrowDown',
    ' ': 'Space',
  };
  return map[key] || key;
}

// Solve one challenge by driving the correct input for its type.
async function solve(page, ch) {
  const fallback = await page.locator('.fallback-input').count();
  if (fallback > 0) {
    let answer;
    if (ch.type === 'command') answer = getCommand(ch.ref).display; // e.g. ":set -g mouse on"
    else if (ch.type === 'terminal') answer = getTerminalShortcut(ch.ref).keysByOs[OS].display;
    await page.locator('.fallback-input').fill(answer);
    await page.locator('.fallback-submit').click();
  } else {
    const kb = getKeybinding(ch.ref);
    const last = kb.keys[kb.keys.length - 1];
    await prefixThen(page, last);
  }
  await expect(page.locator('.feedback.correct')).toBeVisible();
}

test('game over after three mistakes, restart returns to level 1', async ({ page }) => {
  await startAt(page);
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('z'); // wrong: bare key, no prefix
    await page.waitForTimeout(650);
  }
  await expect(page.locator('.screen.game-over')).toBeVisible();
  await page.locator('.restart-btn').click();
  await expect(page.locator('.screen.start')).toBeVisible();
});

test('a full flawless run reaches the victory / expert screen', async ({ page }) => {
  test.slow(); // 11 levels of drills
  await startAt(page);

  for (let li = 0; li < LEVELS.length; li++) {
    const level = LEVELS[li];
    for (const ch of level.challenges) {
      await solve(page, ch);
      await page.waitForTimeout(500); // let the correct-feedback delay settle
    }
    // Level complete -> advance (last level -> victory).
    await expect(page.locator('.screen.level-complete, .screen.victory')).toBeVisible();
    if (li < LEVELS.length - 1) {
      await page.locator('.next-btn').click();
      await page.locator('.begin-btn').click(); // next level's concept -> drill
    } else {
      await page.locator('.next-btn').click();
    }
  }

  await expect(page.locator('.screen.victory')).toBeVisible();
  await expect(page.locator('.screen.victory')).toContainText('cleared all 11 levels');
});
