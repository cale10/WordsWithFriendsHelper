import { test, expect } from '@playwright/test';

test('board configuration persistence across size changes', async ({ page }) => {
  await page.goto('http://127.0.0.1:5000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  console.log('\n========================================');
  console.log('  BOARD CONFIG PERSISTENCE TEST');
  console.log('========================================\n');

  // Step 1: Modify 15x15 board
  console.log('Step 1: Modifying 15x15 board');
  console.log('------------------------------');

  // Enter editor mode
  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);
  console.log('✓ Entered editor mode');

  // Change cell [7, 7] to Triple Word (center cell)
  const cell15_1 = page.locator('.game-board-cell').nth(7 * 15 + 7);
  await cell15_1.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.triple-word').click();
  await page.waitForTimeout(500);

  // Verify it changed
  const cell15_1_classes = await cell15_1.evaluate(el => el.className);
  console.log('Changed [7,7] to Triple Word:', cell15_1_classes.includes('triple-word'));

  // Change cell [3, 3] to Double Letter
  const cell15_2 = page.locator('.game-board-cell').nth(3 * 15 + 3);
  await cell15_2.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.double-letter').click();
  await page.waitForTimeout(500);

  const cell15_2_classes = await cell15_2.evaluate(el => el.className);
  console.log('Changed [3,3] to Double Letter:', cell15_2_classes.includes('double-letter'));

  // Exit editor mode (this saves the config)
  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);
  console.log('✓ Exited editor mode (changes auto-saved)');

  // Step 2: Switch to 11x11
  console.log('\nStep 2: Switching to 11x11 board');
  console.log('----------------------------------');

  const sizeSelector = page.locator('#board-size-selector');
  await sizeSelector.selectOption('11');
  await page.waitForTimeout(1000);
  console.log('✓ Switched to 11x11 board');

  // Verify board size changed (should have 11*11 = 121 cells)
  const cellCount11 = await page.locator('.game-board-cell').count();
  console.log('Cell count after switch:', cellCount11, '(expected 121)');

  // Step 3: Modify 11x11 board
  console.log('\nStep 3: Modifying 11x11 board');
  console.log('------------------------------');

  // Enter editor mode
  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);

  // Change cell [5, 5] to Double Word (center area)
  const cell11_1 = page.locator('.game-board-cell').nth(5 * 11 + 5);
  await cell11_1.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.double-word').click();
  await page.waitForTimeout(500);

  const cell11_1_classes = await cell11_1.evaluate(el => el.className);
  console.log('Changed [5,5] to Double Word:', cell11_1_classes.includes('double-word'));

  // Change cell [2, 2] to Triple Letter
  const cell11_2 = page.locator('.game-board-cell').nth(2 * 11 + 2);
  await cell11_2.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.triple-letter').click();
  await page.waitForTimeout(500);

  const cell11_2_classes = await cell11_2.evaluate(el => el.className);
  console.log('Changed [2,2] to Triple Letter:', cell11_2_classes.includes('triple-letter'));

  // Exit editor mode
  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);
  console.log('✓ Exited editor mode (changes auto-saved)');

  // Step 4: Switch back to 15x15 and verify changes persisted
  console.log('\nStep 4: Switching back to 15x15');
  console.log('--------------------------------');

  await sizeSelector.selectOption('15');
  await page.waitForTimeout(1000);
  console.log('✓ Switched back to 15x15 board');

  const cellCount15 = await page.locator('.game-board-cell').count();
  console.log('Cell count after switch:', cellCount15, '(expected 225)');

  // Verify our earlier changes to 15x15 board are still there
  const cell15_1_after = page.locator('.game-board-cell').nth(7 * 15 + 7);
  const cell15_1_after_classes = await cell15_1_after.evaluate(el => el.className);
  const has_triple_word = cell15_1_after_classes.includes('triple-word');
  console.log('[7,7] still Triple Word:', has_triple_word);

  const cell15_2_after = page.locator('.game-board-cell').nth(3 * 15 + 3);
  const cell15_2_after_classes = await cell15_2_after.evaluate(el => el.className);
  const has_double_letter = cell15_2_after_classes.includes('double-letter');
  console.log('[3,3] still Double Letter:', has_double_letter);

  // Step 5: Switch back to 11x11 and verify those changes persisted
  console.log('\nStep 5: Switching back to 11x11');
  console.log('--------------------------------');

  await sizeSelector.selectOption('11');
  await page.waitForTimeout(1000);
  console.log('✓ Switched back to 11x11 board');

  // Verify our earlier changes to 11x11 board are still there
  const cell11_1_after = page.locator('.game-board-cell').nth(5 * 11 + 5);
  const cell11_1_after_classes = await cell11_1_after.evaluate(el => el.className);
  const has_double_word = cell11_1_after_classes.includes('double-word');
  console.log('[5,5] still Double Word:', has_double_word);

  const cell11_2_after = page.locator('.game-board-cell').nth(2 * 11 + 2);
  const cell11_2_after_classes = await cell11_2_after.evaluate(el => el.className);
  const has_triple_letter = cell11_2_after_classes.includes('triple-letter');
  console.log('[2,2] still Triple Letter:', has_triple_letter);

  await page.screenshot({ path: 'test-config-persistence.png', fullPage: true });

  // Final results
  console.log('\n========================================');
  console.log('  PERSISTENCE TEST RESULTS');
  console.log('========================================');
  const test15Pass = has_triple_word && has_double_letter;
  const test11Pass = has_double_word && has_triple_letter;
  console.log(`15x15 config persisted: ${test15Pass ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`11x11 config persisted: ${test11Pass ? '✅ PASS' : '❌ FAIL'}`);
  console.log('Screenshot saved: test-config-persistence.png');
  console.log('========================================\n');

  expect(test15Pass).toBe(true);
  expect(test11Pass).toBe(true);
});
