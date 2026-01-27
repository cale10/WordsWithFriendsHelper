import { test, expect } from '@playwright/test';

test('localStorage persistence across page refreshes', async ({ page }) => {
  await page.goto('http://127.0.0.1:5000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║   localStorage PERSISTENCE TEST (Page Refresh)       ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  // Step 1: Customize 15x15 board
  console.log('STEP 1: Customizing 15x15 board');
  console.log('────────────────────────────────');

  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);

  // Change center cell [7,7] to Triple Word
  const cell1 = page.locator('.game-board-cell').nth(7 * 15 + 7);
  await cell1.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.triple-word').click();
  await page.waitForTimeout(500);
  console.log('  ✓ Set [7,7] to Triple Word');

  // Change corner cell [0,0] to Double Letter
  const cell2 = page.locator('.game-board-cell').nth(0);
  await cell2.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.double-letter').click();
  await page.waitForTimeout(500);
  console.log('  ✓ Set [0,0] to Double Letter');

  // Exit editor mode (triggers save to localStorage)
  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);
  console.log('  ✓ Exited editor mode (auto-saved to localStorage)\n');

  // Step 2: Refresh the page
  console.log('STEP 2: Refreshing the page');
  console.log('───────────────────────────');
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  console.log('  ✓ Page reloaded\n');

  // Step 3: Verify changes persisted
  console.log('STEP 3: Verifying changes persisted');
  console.log('─────────────────────────────────');

  const cell1After = page.locator('.game-board-cell').nth(7 * 15 + 7);
  const cell1Classes = await cell1After.evaluate(el => el.className);
  const has_triple = cell1Classes.includes('triple-word');
  console.log(`  [7,7] has Triple Word: ${has_triple ? '✅' : '❌'}`);

  const cell2After = page.locator('.game-board-cell').nth(0);
  const cell2Classes = await cell2After.evaluate(el => el.className);
  const has_double = cell2Classes.includes('double-letter');
  console.log(`  [0,0] has Double Letter: ${has_double ? '✅' : '❌'}\n`);

  // Step 4: Switch to 11x11, customize, and refresh
  console.log('STEP 4: Testing 11x11 board persistence');
  console.log('────────────────────────────────────────');

  await page.locator('#board-size-selector').selectOption('11');
  await page.waitForTimeout(1000);
  console.log('  ✓ Switched to 11x11');

  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);

  // Change center cell [5,5] to Double Word
  const cell11 = page.locator('.game-board-cell').nth(5 * 11 + 5);
  await cell11.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.double-word').click();
  await page.waitForTimeout(500);
  console.log('  ✓ Set [5,5] to Double Word');

  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);
  console.log('  ✓ Auto-saved to localStorage\n');

  // Step 5: Refresh again
  console.log('STEP 5: Second page refresh');
  console.log('───────────────────────────');
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  console.log('  ✓ Page reloaded\n');

  // Step 6: Verify 15x15 changes still exist
  console.log('STEP 6: Verifying both boards persisted');
  console.log('────────────────────────────────────────');

  // Check 15x15 (should be default after refresh)
  const defaultBoardSize = await page.locator('#board-size-selector').inputValue();
  console.log(`  Default board size: ${defaultBoardSize}×${defaultBoardSize}`);

  const cell1Final = page.locator('.game-board-cell').nth(7 * 15 + 7);
  const cell1FinalClasses = await cell1Final.evaluate(el => el.className);
  const final_triple = cell1FinalClasses.includes('triple-word');
  console.log(`  15×15 [7,7] still Triple Word: ${final_triple ? '✅' : '❌'}`);

  const cell2Final = page.locator('.game-board-cell').nth(0);
  const cell2FinalClasses = await cell2Final.evaluate(el => el.className);
  const final_double_letter = cell2FinalClasses.includes('double-letter');
  console.log(`  15×15 [0,0] still Double Letter: ${final_double_letter ? '✅' : '❌'}`);

  // Switch back to 11x11 and verify
  await page.locator('#board-size-selector').selectOption('11');
  await page.waitForTimeout(1000);

  const cell11Final = page.locator('.game-board-cell').nth(5 * 11 + 5);
  const cell11FinalClasses = await cell11Final.evaluate(el => el.className);
  const final_double_word = cell11FinalClasses.includes('double-word');
  console.log(`  11×11 [5,5] still Double Word: ${final_double_word ? '✅' : '❌'}\n`);

  await page.screenshot({ path: 'test-localStorage-persistence.png', fullPage: true });

  // Results
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                    TEST RESULTS                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝');

  const allPassed = has_triple && has_double && final_triple && final_double_letter && final_double_word;

  console.log(`  After 1st refresh (15×15): ${has_triple && has_double ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  After 2nd refresh (15×15): ${final_triple && final_double_letter ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  After 2nd refresh (11×11): ${final_double_word ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`\n  Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  console.log('  Screenshot: test-localStorage-persistence.png');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  expect(allPassed).toBe(true);
});
