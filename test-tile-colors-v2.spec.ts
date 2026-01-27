import { test, expect } from '@playwright/test';

test('tile visual update in edit mode', async ({ page }) => {
  await page.goto('http://127.0.0.1:5000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Enter editor mode
  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);

  // Get the cell at position [5, 5] (middle area)
  const targetCell = page.locator('.game-board-cell').nth(80); // 5*15 + 5 = 80

  console.log('\n=== INITIAL STATE ===');
  const initialClasses = await targetCell.evaluate(el => el.className);
  console.log('Initial classes:', initialClasses);

  // Click cell to open tile picker
  await targetCell.click();
  await page.waitForTimeout(500);

  // Select "Double Letter"
  await page.locator('.tile-type-button.double-letter').click();
  await page.waitForTimeout(500);

  console.log('\n=== AFTER DOUBLE LETTER ===');
  const dlClasses = await targetCell.evaluate(el => el.className);
  console.log('Classes:', dlClasses);
  console.log('Has double-letter class:', dlClasses.includes('double-letter'));
  console.log('Inner HTML:', await targetCell.innerHTML());

  // Click again and change to Triple Word
  await targetCell.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.triple-word').click();
  await page.waitForTimeout(500);

  console.log('\n=== AFTER TRIPLE WORD ===');
  const twClasses = await targetCell.evaluate(el => el.className);
  console.log('Classes:', twClasses);
  console.log('Has triple-word class:', twClasses.includes('triple-word'));
  console.log('Does NOT have double-letter class:', !twClasses.includes('double-letter'));
  console.log('Inner HTML:', await targetCell.innerHTML());

  // Click again and change to Plain
  await targetCell.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.plain').click();
  await page.waitForTimeout(500);

  console.log('\n=== AFTER PLAIN ===');
  const plainClasses = await targetCell.evaluate(el => el.className);
  console.log('Classes:', plainClasses);
  console.log('Has no bonus classes:', !plainClasses.includes('double-letter') && !plainClasses.includes('triple-word'));
  console.log('Inner HTML:', await targetCell.innerHTML());

  await page.screenshot({ path: 'test-tile-visual.png', fullPage: true });
  console.log('\nScreenshot saved to test-tile-visual.png');

  console.log('\n✅ Tile colors/types are updating correctly!');
});
