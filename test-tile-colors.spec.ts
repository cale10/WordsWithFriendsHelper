import { test, expect } from '@playwright/test';

test('tile colors change in edit mode', async ({ page }) => {
  // Navigate to the app
  await page.goto('http://127.0.0.1:5000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  console.log('Page loaded');

  // Enter editor mode
  const editorButton = page.locator('#editor-toggle');
  await editorButton.click();
  await page.waitForTimeout(500);
  console.log('Editor mode activated');

  // Get the first cell
  const firstCell = page.locator('.game-board-cell').first();

  // Get initial background color
  const initialBgColor = await firstCell.evaluate(el => {
    return window.getComputedStyle(el).backgroundColor;
  });
  console.log('Initial background color:', initialBgColor);

  // Click the cell to open tile picker
  await firstCell.click();
  await page.waitForTimeout(500);

  // Check if tile modal is visible
  const tileModal = page.locator('#tile-picker-modal');
  const modalVisible = await tileModal.evaluate(el => !el.classList.contains('hidden'));
  console.log('Tile modal visible:', modalVisible);

  if (modalVisible) {
    // Click on "Triple Word" button
    const tripleWordButton = page.locator('.tile-type-button.triple-word');
    await tripleWordButton.click();
    await page.waitForTimeout(500);

    // Check if the cell now has the triple-word class
    const hasTripleWordClass = await firstCell.evaluate(el => el.classList.contains('triple-word'));
    console.log('Cell has triple-word class:', hasTripleWordClass);

    // Get new background color
    const newBgColor = await firstCell.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    console.log('New background color:', newBgColor);

    // Verify color changed
    if (initialBgColor !== newBgColor) {
      console.log('SUCCESS: Background color changed from', initialBgColor, 'to', newBgColor);
    } else {
      console.log('FAIL: Background color did not change');
    }

    // Take screenshot
    await page.screenshot({ path: 'test-tile-colors.png', fullPage: true });
    console.log('Screenshot saved');
  }
});
