import { test, expect } from '@playwright/test';

test('save board button persistence test', async ({ page }) => {
  await page.goto('http://127.0.0.1:5000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  console.log('\n========================================');
  console.log('  SAVE BOARD BUTTON PERSISTENCE TEST');
  console.log('========================================\n');

  // Step 1: Modify 15x15 board and click Save Board
  console.log('Step 1: Modifying 15x15 board');
  console.log('------------------------------');

  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);
  console.log('✓ Entered editor mode');

  // Activate mirror mode for symmetry
  await page.locator('#mirror-toggle').click();
  await page.waitForTimeout(500);
  console.log('✓ Activated mirror mode');

  // Change cell [4, 4] to Triple Word (will mirror to 3 other positions)
  const cell15_1 = page.locator('.game-board-cell').nth(4 * 15 + 4);
  await cell15_1.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.triple-word').click();
  await page.waitForTimeout(500);

  console.log('Changed [4,4] to Triple Word (mirrored to 4 positions)');

  // Click Save Board button
  const saveButton = page.locator('#save-board');
  await saveButton.click();
  await page.waitForTimeout(1500); // Wait for save feedback animation
  console.log('✓ Clicked Save Board button');

  // Verify we exited editor mode
  const bodyClasses = await page.evaluate(() => document.body.className);
  const exitedEditor = !bodyClasses.includes('editor-mode');
  console.log('Exited editor mode after save:', exitedEditor);

  // Step 2: Switch to 11x11 and back to 15x15
  console.log('\nStep 2: Testing persistence');
  console.log('----------------------------');

  await page.locator('#board-size-selector').selectOption('11');
  await page.waitForTimeout(1000);
  console.log('✓ Switched to 11x11');

  await page.locator('#board-size-selector').selectOption('15');
  await page.waitForTimeout(1000);
  console.log('✓ Switched back to 15x15');

  // Verify the saved changes are still there
  const cell15_1_after = page.locator('.game-board-cell').nth(4 * 15 + 4);
  const cell15_1_classes = await cell15_1_after.evaluate(el => el.className);
  const has_triple = cell15_1_classes.includes('triple-word');
  console.log('[4,4] still Triple Word:', has_triple);

  // Check mirrored positions
  const mirrors = [
    { pos: '[4,10]', idx: 4 * 15 + 10 },
    { pos: '[10,4]', idx: 10 * 15 + 4 },
    { pos: '[10,10]', idx: 10 * 15 + 10 },
  ];

  let allMirrorsPreserved = true;
  for (const mirror of mirrors) {
    const cell = page.locator('.game-board-cell').nth(mirror.idx);
    const classes = await cell.evaluate(el => el.className);
    const hasTriple = classes.includes('triple-word');
    console.log(`${mirror.pos} still Triple Word:`, hasTriple);
    if (!hasTriple) allMirrorsPreserved = false;
  }

  await page.screenshot({ path: 'test-save-button-persistence.png', fullPage: true });

  console.log('\n========================================');
  console.log('  SAVE BUTTON TEST RESULTS');
  console.log('========================================');
  const allPersisted = has_triple && allMirrorsPreserved;
  console.log(`Original cell persisted: ${has_triple ? '✅' : '❌'}`);
  console.log(`Mirrored cells persisted: ${allMirrorsPreserved ? '✅' : '❌'}`);
  console.log(`Overall: ${allPersisted ? '✅ PASS' : '❌ FAIL'}`);
  console.log('Screenshot saved: test-save-button-persistence.png');
  console.log('========================================\n');

  expect(allPersisted).toBe(true);
});
