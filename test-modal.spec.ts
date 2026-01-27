import { test, expect } from '@playwright/test';

test('test modals appearing', async ({ page }) => {
  // Navigate to the app
  await page.goto('http://127.0.0.1:5000');

  // Wait for page to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  console.log('Page loaded');

  // Check if modals exist in DOM
  const letterModal = await page.locator('#letter-picker-modal');
  const tileModal = await page.locator('#tile-picker-modal');

  console.log('Letter modal exists:', await letterModal.count() > 0);
  console.log('Tile modal exists:', await tileModal.count() > 0);

  // Check initial state
  console.log('Letter modal has hidden class:', await letterModal.evaluate(el => el.classList.contains('hidden')));
  console.log('Tile modal has hidden class:', await tileModal.evaluate(el => el.classList.contains('hidden')));

  // Try clicking on a game board cell in normal mode
  const firstCell = page.locator('.game-board-cell').first();
  console.log('Number of game board cells:', await page.locator('.game-board-cell').count());

  if (await firstCell.count() > 0) {
    console.log('Clicking first game board cell...');
    await firstCell.click();
    await page.waitForTimeout(500);

    // Check if letter modal appears
    const letterModalVisible = await letterModal.evaluate(el => !el.classList.contains('hidden'));
    console.log('Letter modal visible after click:', letterModalVisible);

    if (letterModalVisible) {
      console.log('SUCCESS: Letter modal appeared!');
      // Close the modal
      await page.locator('.modal-close').first().click();
      await page.waitForTimeout(300);
    } else {
      console.log('FAIL: Letter modal did not appear');

      // Check for JavaScript errors
      page.on('console', msg => console.log('Browser console:', msg.text()));
      page.on('pageerror', err => console.log('Browser error:', err.message));
    }
  }

  // Test editor mode
  const editorButton = page.locator('#editor-toggle');
  if (await editorButton.count() > 0) {
    console.log('Clicking editor toggle...');
    await editorButton.click();
    await page.waitForTimeout(500);

    console.log('Editor mode activated');

    // Click a cell in editor mode
    await firstCell.click();
    await page.waitForTimeout(500);

    const tileModalVisible = await tileModal.evaluate(el => !el.classList.contains('hidden'));
    console.log('Tile modal visible in editor mode:', tileModalVisible);

    if (tileModalVisible) {
      console.log('SUCCESS: Tile modal appeared in editor mode!');
    } else {
      console.log('FAIL: Tile modal did not appear in editor mode');
    }
  }

  // Take a screenshot for debugging
  await page.screenshot({ path: 'test-screenshot.png', fullPage: true });
  console.log('Screenshot saved to test-screenshot.png');
});
