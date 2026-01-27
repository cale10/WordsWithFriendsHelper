import { test, expect } from '@playwright/test';

test('verify tile type changes update point calculation system', async ({ page }) => {
  await page.goto('http://127.0.0.1:5000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  BONUS CALCULATION SYSTEM UPDATE TEST                 ║');
  console.log('║  Verifies tile changes affect scoring algorithm       ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Step 1: Check initial bonus configuration
  console.log('STEP 1: Checking initial bonus configuration');
  console.log('──────────────────────────────────────────────');

  const initialBonusAt_7_7 = await page.evaluate(() => {
    // Access the GameBoard instance from window
    const gameBoard = (window as any).gameBoardInstance;
    if (!gameBoard) return null;
    return gameBoard._boardConfig.bonuses[7][7];
  });

  console.log(`  Initial bonus at [7,7]: "${initialBonusAt_7_7}"`);

  // Step 2: Change tile type from default to Triple Word
  console.log('\nSTEP 2: Changing [7,7] to Triple Word');
  console.log('───────────────────────────────────────');

  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);

  const cell_7_7 = page.locator('.game-board-cell').nth(7 * 15 + 7);
  await cell_7_7.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.triple-word').click();
  await page.waitForTimeout(500);

  console.log('  ✓ Clicked Triple Word button');

  // Step 3: Verify the bonus configuration was updated
  console.log('\nSTEP 3: Verifying bonus configuration updated');
  console.log('───────────────────────────────────────────────');

  const updatedBonusAt_7_7 = await page.evaluate(() => {
    const gameBoard = (window as any).gameBoardInstance;
    if (!gameBoard) return null;
    return gameBoard._boardConfig.bonuses[7][7];
  });

  console.log(`  Bonus at [7,7] after change: "${updatedBonusAt_7_7}"`);
  console.log(`  Expected: "TW" (Triple Word)`);
  console.log(`  Match: ${updatedBonusAt_7_7 === 'TW' ? '✅' : '❌'}`);

  // Step 4: Change another cell to Double Letter
  console.log('\nSTEP 4: Changing [5,5] to Double Letter');
  console.log('─────────────────────────────────────────');

  const cell_5_5 = page.locator('.game-board-cell').nth(5 * 15 + 5);
  await cell_5_5.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.double-letter').click();
  await page.waitForTimeout(500);

  const updatedBonusAt_5_5 = await page.evaluate(() => {
    const gameBoard = (window as any).gameBoardInstance;
    if (!gameBoard) return null;
    return gameBoard._boardConfig.bonuses[5][5];
  });

  console.log(`  Bonus at [5,5] after change: "${updatedBonusAt_5_5}"`);
  console.log(`  Expected: "DL" (Double Letter)`);
  console.log(`  Match: ${updatedBonusAt_5_5 === 'DL' ? '✅' : '❌'}`);

  // Step 5: Change a cell to Plain (no bonus)
  console.log('\nSTEP 5: Changing [10,10] to Plain (no bonus)');
  console.log('──────────────────────────────────────────────');

  const cell_10_10 = page.locator('.game-board-cell').nth(10 * 15 + 10);
  await cell_10_10.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.plain').click();
  await page.waitForTimeout(500);

  const updatedBonusAt_10_10 = await page.evaluate(() => {
    const gameBoard = (window as any).gameBoardInstance;
    if (!gameBoard) return null;
    return gameBoard._boardConfig.bonuses[10][10];
  });

  console.log(`  Bonus at [10,10] after change: "${updatedBonusAt_10_10}"`);
  console.log(`  Expected: "  " (two spaces = plain)`);
  console.log(`  Match: ${updatedBonusAt_10_10 === '  ' ? '✅' : '❌'}`);

  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);

  // Step 6: Verify the bonus board that would be sent to backend
  console.log('\nSTEP 6: Checking bonus board sent to algorithm');
  console.log('────────────────────────────────────────────────');

  const bonusBoardSample = await page.evaluate(() => {
    const gameBoard = (window as any).gameBoardInstance;
    if (!gameBoard) return null;

    // Get the full bonus board
    const bonuses = gameBoard._boardConfig.bonuses;

    return {
      size: bonuses.length,
      cell_7_7: bonuses[7][7],
      cell_5_5: bonuses[5][5],
      cell_10_10: bonuses[10][10],
      cell_0_0: bonuses[0][0],
      cell_14_14: bonuses[14][14],
    };
  });

  console.log('  Bonus board sample:');
  console.log(`    Board size: ${bonusBoardSample?.size}×${bonusBoardSample?.size}`);
  console.log(`    [7,7]: "${bonusBoardSample?.cell_7_7}" (should be "TW")`);
  console.log(`    [5,5]: "${bonusBoardSample?.cell_5_5}" (should be "DL")`);
  console.log(`    [10,10]: "${bonusBoardSample?.cell_10_10}" (should be "  ")`);
  console.log(`    [0,0]: "${bonusBoardSample?.cell_0_0}" (corner)`);
  console.log(`    [14,14]: "${bonusBoardSample?.cell_14_14}" (corner)`);

  await page.screenshot({ path: 'test-bonus-calculation.png', fullPage: true });

  // Results
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                    TEST RESULTS                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  const allCorrect =
    updatedBonusAt_7_7 === 'TW' &&
    updatedBonusAt_5_5 === 'DL' &&
    updatedBonusAt_10_10 === '  ';

  console.log(`  Tile type changes update config: ${allCorrect ? '✅ YES' : '❌ NO'}`);
  console.log(`  Bonus board ready for algorithm: ${bonusBoardSample ? '✅ YES' : '❌ NO'}`);
  console.log(`\n  Overall: ${allCorrect ? '✅ WORKING CORRECTLY' : '❌ NOT WORKING'}`);
  console.log('  Screenshot: test-bonus-calculation.png');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  expect(updatedBonusAt_7_7).toBe('TW');
  expect(updatedBonusAt_5_5).toBe('DL');
  expect(updatedBonusAt_10_10).toBe('  ');
});
