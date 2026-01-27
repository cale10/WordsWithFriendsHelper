import { test, expect } from '@playwright/test';

test('debug localStorage saving and loading', async ({ page, context }) => {
  await page.goto('http://127.0.0.1:5000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  console.log('\n=== DEBUGGING localStorage ===\n');

  // Check initial localStorage
  let localStorageData = await page.evaluate(() => {
    return {
      config11: localStorage.getItem('boardConfig11'),
      config15: localStorage.getItem('boardConfig15'),
    };
  });

  console.log('Initial localStorage:');
  console.log('  config11:', localStorageData.config11 ? 'exists' : 'null');
  console.log('  config15:', localStorageData.config15 ? 'exists' : 'null');

  // Make a change
  console.log('\nMaking a change to [7,7]...');
  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);

  const cell = page.locator('.game-board-cell').nth(7 * 15 + 7);
  await cell.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.triple-word').click();
  await page.waitForTimeout(500);

  const cellClasses = await cell.evaluate(el => el.className);
  console.log('Cell classes after change:', cellClasses);

  // Exit editor mode to trigger save
  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(1000);

  // Check localStorage after save
  localStorageData = await page.evaluate(() => {
    const config15Data = localStorage.getItem('boardConfig15');
    return {
      config11: localStorage.getItem('boardConfig11'),
      config15: config15Data,
      config15Preview: config15Data ? config15Data.substring(0, 200) : null,
    };
  });

  console.log('\nAfter saving:');
  console.log('  config11:', localStorageData.config11 ? 'exists' : 'null');
  console.log('  config15:', localStorageData.config15 ? 'exists' : 'null');
  if (localStorageData.config15Preview) {
    console.log('  config15 preview:', localStorageData.config15Preview + '...');
  }

  // Check if [7,7] has TW in the saved config
  const savedConfig = await page.evaluate(() => {
    const data = localStorage.getItem('boardConfig15');
    if (!data) return null;
    const config = JSON.parse(data);
    return config.bonuses?.[7]?.[7];
  });

  console.log('  [7,7] bonus code in saved config:', savedConfig);

  console.log('\n===============================\n');
});
