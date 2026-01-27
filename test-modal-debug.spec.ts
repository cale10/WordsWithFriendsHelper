import { test, expect } from '@playwright/test';

test('debug modal issues', async ({ page }) => {
  // Capture all console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const message = `[${msg.type()}] ${msg.text()}`;
    console.log(message);
    consoleMessages.push(message);
  });

  // Capture all errors
  const pageErrors: string[] = [];
  page.on('pageerror', err => {
    const error = `ERROR: ${err.message}\nStack: ${err.stack}`;
    console.log(error);
    pageErrors.push(error);
  });

  // Navigate to the app
  await page.goto('http://127.0.0.1:5000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('\n=== PAGE LOADED ===');
  console.log('Console messages so far:', consoleMessages.length);
  console.log('Errors so far:', pageErrors.length);

  // Check if GameBoard was initialized
  const gameBoardExists = await page.evaluate(() => {
    return 'GameBoard' in window || document.querySelectorAll('.game-board-cell').length > 0;
  });
  console.log('GameBoard appears initialized:', gameBoardExists);

  // Try clicking a cell
  console.log('\n=== CLICKING CELL ===');
  const firstCell = page.locator('.game-board-cell').first();
  await firstCell.click();
  await page.waitForTimeout(1000);

  console.log('Console messages after click:', consoleMessages.length);
  console.log('Errors after click:', pageErrors.length);

  // Check modal state
  const modalState = await page.evaluate(() => {
    const letterModal = document.getElementById('letter-picker-modal');
    const tileModal = document.getElementById('tile-picker-modal');
    return {
      letterModalExists: !!letterModal,
      letterModalHidden: letterModal?.classList.contains('hidden'),
      letterModalDisplay: letterModal ? window.getComputedStyle(letterModal).display : null,
      tileModalExists: !!tileModal,
      tileModalHidden: tileModal?.classList.contains('hidden'),
    };
  });
  console.log('Modal state:', JSON.stringify(modalState, null, 2));

  console.log('\n=== ALL CONSOLE MESSAGES ===');
  consoleMessages.forEach(msg => console.log(msg));

  console.log('\n=== ALL ERRORS ===');
  pageErrors.forEach(err => console.log(err));

  await page.screenshot({ path: 'test-debug.png', fullPage: true });
});
