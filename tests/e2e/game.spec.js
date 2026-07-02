import { test, expect } from '@playwright/test';

// Press the tmux prefix (Ctrl-b) then a key. Uses low-level keyboard events so
// the game's capture layer sees real keydowns.
async function prefixThen(page, key) {
  await page.keyboard.down('Control');
  await page.keyboard.press('b');
  await page.keyboard.up('Control');
  await page.keyboard.press(key);
}

async function startGame(page, os = 'linux') {
  await page.goto('/');
  await page.locator(`.os-btn[data-os="${os}"]`).click();
  await page.locator('.start-btn').click();
  await expect(page.locator('.screen.concept')).toBeVisible();
}

test('start screen shows and lets you pick an OS', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.screen.start')).toBeVisible();
  await page.locator('.os-btn[data-os="mac"]').click();
  await expect(page.locator('.os-btn[data-os="mac"]')).toHaveClass(/selected/);
});

test('concept card precedes the drill and explains the level', async ({ page }) => {
  await startGame(page);
  await expect(page.locator('.screen.concept h2')).toContainText('Level 1');
  await expect(page.locator('.diagram')).toBeVisible();
  await page.locator('.begin-btn').click();
  await expect(page.locator('.screen.drill')).toBeVisible();
});

test('a correct keystroke advances the challenge and scores points', async ({ page }) => {
  await startGame(page);
  await page.locator('.begin-btn').click();
  await expect(page.locator('.challenge-step')).toContainText('1/');

  // Level 1 challenge 1 is `prefix ?` (list-keys).
  await prefixThen(page, '?');
  await expect(page.locator('.feedback.correct')).toBeVisible();
  // Score should be above zero after a correct answer.
  await expect(page.locator('.hud-score b')).not.toHaveText('0');
});

test('a wrong keystroke costs a life (heart lost)', async ({ page }) => {
  await startGame(page);
  await page.locator('.begin-btn').click();
  await expect(page.locator('.heart.full')).toHaveCount(3);

  // Wrong: press a bare key without the prefix.
  await page.keyboard.press('z');
  await expect(page.locator('.feedback.wrong')).toBeVisible();
  await expect(page.locator('.heart.full')).toHaveCount(2);
});

test('mock tmux screen renders panes and a status bar', async ({ page }) => {
  await startGame(page);
  await page.locator('.begin-btn').click();
  await expect(page.locator('.tmux .tmux-status')).toBeVisible();
  await expect(page.locator('.tmux .pane')).toHaveCount(1);
});

test('refresh resets progress to level 1 (no persistence)', async ({ page }) => {
  await startGame(page);
  await page.locator('.begin-btn').click();
  await prefixThen(page, '?'); // score some points
  await expect(page.locator('.feedback.correct')).toBeVisible();

  await page.reload();
  // Back to the very start screen, nothing remembered.
  await expect(page.locator('.screen.start')).toBeVisible();
});

test('completing all challenges in a level reaches the level-complete screen', async ({ page }) => {
  await startGame(page);
  await page.locator('.begin-btn').click();
  // Level 1 = [list-keys ?, command-prompt :, list-keys ?]
  await prefixThen(page, '?');
  await page.waitForTimeout(550);
  await prefixThen(page, ':');
  await page.waitForTimeout(550);
  await prefixThen(page, '?');
  await expect(page.locator('.screen.level-complete')).toBeVisible();
  await expect(page.locator('.screen.level-complete h2')).toContainText('cleared');
});
