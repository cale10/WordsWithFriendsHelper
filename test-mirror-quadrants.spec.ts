import { test, expect } from '@playwright/test';

test('mirror quadrants feature in edit mode', async ({ page }) => {
  await page.goto('http://127.0.0.1:5000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  console.log('\n=== ENTERING EDITOR MODE ===');

  // Enter editor mode
  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);

  // Check that mirror toggle button is now visible
  const mirrorButton = page.locator('#mirror-toggle');
  const mirrorVisible = await mirrorButton.isVisible();
  console.log('Mirror button visible in editor mode:', mirrorVisible);

  // Activate mirror mode
  console.log('\n=== ACTIVATING MIRROR MODE ===');
  await mirrorButton.click();
  await page.waitForTimeout(500);

  const mirrorButtonText = await mirrorButton.textContent();
  console.log('Mirror button text after click:', mirrorButtonText);

  // For 15x15 board, test position [5, 5] and its mirrors
  // Position [5, 5] should mirror to:
  // - [5, 9] (horizontal flip: col = 14 - 5 = 9)
  // - [9, 5] (vertical flip: row = 14 - 5 = 9)
  // - [9, 9] (both flips)

  const targetIndex = 5 * 15 + 5; // [5, 5] = 80
  const hFlipIndex = 5 * 15 + 9; // [5, 9] = 84
  const vFlipIndex = 9 * 15 + 5; // [9, 5] = 140
  const bothFlipIndex = 9 * 15 + 9; // [9, 9] = 144

  console.log('\n=== TESTING CELL [5, 5] ===');
  console.log('Target cell index:', targetIndex);
  console.log('Horizontal flip [5, 9]:', hFlipIndex);
  console.log('Vertical flip [9, 5]:', vFlipIndex);
  console.log('Both flips [9, 9]:', bothFlipIndex);

  // Click the cell at [5, 5]
  const targetCell = page.locator('.game-board-cell').nth(targetIndex);
  await targetCell.click();
  await page.waitForTimeout(500);

  // Select "Triple Word" type
  await page.locator('.tile-type-button.triple-word').click();
  await page.waitForTimeout(500);

  console.log('\n=== CHECKING MIRRORED CELLS ===');

  // Check original cell
  const targetClasses = await targetCell.evaluate(el => el.className);
  console.log('Original cell [5, 5] classes:', targetClasses);
  console.log('Has triple-word:', targetClasses.includes('triple-word'));

  // Check horizontal flip [5, 9]
  const hFlipCell = page.locator('.game-board-cell').nth(hFlipIndex);
  const hFlipClasses = await hFlipCell.evaluate(el => el.className);
  console.log('H-flip cell [5, 9] classes:', hFlipClasses);
  console.log('Has triple-word:', hFlipClasses.includes('triple-word'));

  // Check vertical flip [9, 5]
  const vFlipCell = page.locator('.game-board-cell').nth(vFlipIndex);
  const vFlipClasses = await vFlipCell.evaluate(el => el.className);
  console.log('V-flip cell [9, 5] classes:', vFlipClasses);
  console.log('Has triple-word:', vFlipClasses.includes('triple-word'));

  // Check both flips [9, 9]
  const bothFlipCell = page.locator('.game-board-cell').nth(bothFlipIndex);
  const bothFlipClasses = await bothFlipCell.evaluate(el => el.className);
  console.log('Both-flip cell [9, 9] classes:', bothFlipClasses);
  console.log('Has triple-word:', bothFlipClasses.includes('triple-word'));

  // Verify all cells have the triple-word class
  const allHaveClass =
    targetClasses.includes('triple-word') &&
    hFlipClasses.includes('triple-word') &&
    vFlipClasses.includes('triple-word') &&
    bothFlipClasses.includes('triple-word');

  console.log('\n=== RESULT ===');
  console.log('All four quadrant cells updated:', allHaveClass);

  if (allHaveClass) {
    console.log('✅ SUCCESS: Mirror quadrants feature working correctly!');
  } else {
    console.log('❌ FAIL: Not all mirrored cells were updated');
  }

  await page.screenshot({ path: 'test-mirror-quadrants.png', fullPage: true });
  console.log('\nScreenshot saved to test-mirror-quadrants.png');
});
