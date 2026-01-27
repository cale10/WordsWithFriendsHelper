import { test, expect } from '@playwright/test';

test('mirror quadrants feature demo', async ({ page }) => {
  await page.goto('http://127.0.0.1:5000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  console.log('\n========================================');
  console.log('  MIRROR QUADRANTS FEATURE DEMO');
  console.log('========================================\n');

  // Enter editor mode
  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);
  console.log('✓ Entered editor mode');

  // Activate mirror mode
  const mirrorButton = page.locator('#mirror-toggle');
  await mirrorButton.click();
  await page.waitForTimeout(500);
  console.log('✓ Activated mirror mode (button shows: 🪞 Mirror On)');

  console.log('\n--- Testing Multiple Tile Types ---\n');

  // Test 1: Position [3, 3] - Double Letter
  console.log('1. Setting [3,3] to DOUBLE LETTER');
  const cell1 = page.locator('.game-board-cell').nth(3 * 15 + 3);
  await cell1.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.double-letter').click();
  await page.waitForTimeout(500);

  // Check mirrors for [3, 3]
  const mirrors1 = [
    { pos: '[3,3]', idx: 3 * 15 + 3 },
    { pos: '[3,11]', idx: 3 * 15 + 11 },
    { pos: '[11,3]', idx: 11 * 15 + 3 },
    { pos: '[11,11]', idx: 11 * 15 + 11 },
  ];

  let allMatch = true;
  for (const mirror of mirrors1) {
    const cell = page.locator('.game-board-cell').nth(mirror.idx);
    const classes = await cell.evaluate(el => el.className);
    const hasClass = classes.includes('double-letter');
    console.log(`   ${mirror.pos}: ${hasClass ? '✓' : '✗'} double-letter`);
    if (!hasClass) allMatch = false;
  }

  // Test 2: Position [6, 6] - Triple Word
  console.log('\n2. Setting [6,6] to TRIPLE WORD');
  const cell2 = page.locator('.game-board-cell').nth(6 * 15 + 6);
  await cell2.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.triple-word').click();
  await page.waitForTimeout(500);

  const mirrors2 = [
    { pos: '[6,6]', idx: 6 * 15 + 6 },
    { pos: '[6,8]', idx: 6 * 15 + 8 },
    { pos: '[8,6]', idx: 8 * 15 + 6 },
    { pos: '[8,8]', idx: 8 * 15 + 8 },
  ];

  for (const mirror of mirrors2) {
    const cell = page.locator('.game-board-cell').nth(mirror.idx);
    const classes = await cell.evaluate(el => el.className);
    const hasClass = classes.includes('triple-word');
    console.log(`   ${mirror.pos}: ${hasClass ? '✓' : '✗'} triple-word`);
    if (!hasClass) allMatch = false;
  }

  // Test 3: Position [2, 2] - Double Word
  console.log('\n3. Setting [2,2] to DOUBLE WORD');
  const cell3 = page.locator('.game-board-cell').nth(2 * 15 + 2);
  await cell3.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.double-word').click();
  await page.waitForTimeout(500);

  const mirrors3 = [
    { pos: '[2,2]', idx: 2 * 15 + 2 },
    { pos: '[2,12]', idx: 2 * 15 + 12 },
    { pos: '[12,2]', idx: 12 * 15 + 2 },
    { pos: '[12,12]', idx: 12 * 15 + 12 },
  ];

  for (const mirror of mirrors3) {
    const cell = page.locator('.game-board-cell').nth(mirror.idx);
    const classes = await cell.evaluate(el => el.className);
    const hasClass = classes.includes('double-word');
    console.log(`   ${mirror.pos}: ${hasClass ? '✓' : '✗'} double-word`);
    if (!hasClass) allMatch = false;
  }

  // Test 4: Turn off mirror mode and change a cell
  console.log('\n--- Testing Mirror Mode OFF ---\n');
  await mirrorButton.click();
  await page.waitForTimeout(500);
  console.log('✓ Deactivated mirror mode (button shows: 🪞 Mirror Off)');

  console.log('\n4. Setting [4,4] to TRIPLE LETTER (mirror OFF)');
  const cell4 = page.locator('.game-board-cell').nth(4 * 15 + 4);
  await cell4.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.triple-letter').click();
  await page.waitForTimeout(500);

  // Check that mirrors were NOT updated
  const mirrors4 = [
    { pos: '[4,4]', idx: 4 * 15 + 4 },
    { pos: '[4,10]', idx: 4 * 15 + 10 },
    { pos: '[10,4]', idx: 10 * 15 + 4 },
    { pos: '[10,10]', idx: 10 * 15 + 10 },
  ];

  let onlyOriginalChanged = true;
  for (const mirror of mirrors4) {
    const cell = page.locator('.game-board-cell').nth(mirror.idx);
    const classes = await cell.evaluate(el => el.className);
    const hasClass = classes.includes('triple-letter');
    const shouldHave = mirror.pos === '[4,4]';
    const correct = hasClass === shouldHave;
    console.log(`   ${mirror.pos}: ${hasClass ? '✓' : '✗'} triple-letter ${correct ? '(correct)' : '(WRONG)'}`);
    if (!correct) onlyOriginalChanged = false;
  }

  await page.screenshot({ path: 'test-mirror-demo.png', fullPage: true });

  console.log('\n========================================');
  console.log('  DEMO RESULTS');
  console.log('========================================');
  console.log(`Mirror mode ON - All quadrants updated: ${allMatch ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Mirror mode OFF - Only original updated: ${onlyOriginalChanged ? '✅ PASS' : '❌ FAIL'}`);
  console.log('Screenshot saved: test-mirror-demo.png');
  console.log('========================================\n');
});
