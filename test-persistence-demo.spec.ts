import { test, expect } from '@playwright/test';

test('complete persistence feature demo', async ({ page }) => {
  await page.goto('http://127.0.0.1:5000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║     BOARD CONFIGURATION PERSISTENCE DEMO              ║');
  console.log('║     Shows: Changes persist when switching sizes       ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log('📝 SCENARIO: User customizes both 15x15 and 11x11 boards');
  console.log('          Then switches between them multiple times\n');

  // === 15x15 Board Customization ===
  console.log('┌─────────────────────────────────────┐');
  console.log('│  STEP 1: Customize 15x15 Board     │');
  console.log('└─────────────────────────────────────┘');

  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);

  // Create a distinct pattern on 15x15
  const changes15 = [
    { row: 7, col: 7, type: 'triple-word', name: 'Triple Word' },
    { row: 0, col: 0, type: 'double-letter', name: 'Double Letter' },
    { row: 14, col: 14, type: 'double-word', name: 'Double Word' },
  ];

  for (const change of changes15) {
    const cell = page.locator('.game-board-cell').nth(change.row * 15 + change.col);
    await cell.click();
    await page.waitForTimeout(500);
    await page.locator(`.tile-type-button.${change.type}`).click();
    await page.waitForTimeout(500);
    console.log(`  ✓ Set [${change.row},${change.col}] to ${change.name}`);
  }

  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);
  console.log('  ✓ Saved 15x15 configuration\n');

  // === Switch to 11x11 ===
  console.log('┌─────────────────────────────────────┐');
  console.log('│  STEP 2: Switch to 11x11 Board     │');
  console.log('└─────────────────────────────────────┘');

  await page.locator('#board-size-selector').selectOption('11');
  await page.waitForTimeout(1000);
  const count11 = await page.locator('.game-board-cell').count();
  console.log(`  ✓ Switched to 11x11 (${count11} cells)\n`);

  // === 11x11 Board Customization ===
  console.log('┌─────────────────────────────────────┐');
  console.log('│  STEP 3: Customize 11x11 Board     │');
  console.log('└─────────────────────────────────────┘');

  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);

  // Create a different pattern on 11x11
  const changes11 = [
    { row: 5, col: 5, type: 'triple-letter', name: 'Triple Letter' },
    { row: 0, col: 0, type: 'double-word', name: 'Double Word' },
    { row: 10, col: 10, type: 'double-letter', name: 'Double Letter' },
  ];

  for (const change of changes11) {
    const cell = page.locator('.game-board-cell').nth(change.row * 11 + change.col);
    await cell.click();
    await page.waitForTimeout(500);
    await page.locator(`.tile-type-button.${change.type}`).click();
    await page.waitForTimeout(500);
    console.log(`  ✓ Set [${change.row},${change.col}] to ${change.name}`);
  }

  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);
  console.log('  ✓ Saved 11x11 configuration\n');

  // === Verification Round 1: Back to 15x15 ===
  console.log('┌─────────────────────────────────────┐');
  console.log('│  STEP 4: Verify 15x15 Persistence  │');
  console.log('└─────────────────────────────────────┘');

  await page.locator('#board-size-selector').selectOption('15');
  await page.waitForTimeout(1000);
  console.log('  → Switched back to 15x15\n');

  console.log('  Checking saved changes:');
  let pass15 = true;
  for (const change of changes15) {
    const cell = page.locator('.game-board-cell').nth(change.row * 15 + change.col);
    const classes = await cell.evaluate(el => el.className);
    const persisted = classes.includes(change.type);
    console.log(`    ${persisted ? '✅' : '❌'} [${change.row},${change.col}] is ${change.name}`);
    if (!persisted) pass15 = false;
  }
  console.log();

  // === Verification Round 2: Back to 11x11 ===
  console.log('┌─────────────────────────────────────┐');
  console.log('│  STEP 5: Verify 11x11 Persistence  │');
  console.log('└─────────────────────────────────────┘');

  await page.locator('#board-size-selector').selectOption('11');
  await page.waitForTimeout(1000);
  console.log('  → Switched back to 11x11\n');

  console.log('  Checking saved changes:');
  let pass11 = true;
  for (const change of changes11) {
    const cell = page.locator('.game-board-cell').nth(change.row * 11 + change.col);
    const classes = await cell.evaluate(el => el.className);
    const persisted = classes.includes(change.type);
    console.log(`    ${persisted ? '✅' : '❌'} [${change.row},${change.col}] is ${change.name}`);
    if (!persisted) pass11 = false;
  }
  console.log();

  // === Final Verification: 15x15 again ===
  console.log('┌─────────────────────────────────────┐');
  console.log('│  STEP 6: Final 15x15 Verification  │');
  console.log('└─────────────────────────────────────┘');

  await page.locator('#board-size-selector').selectOption('15');
  await page.waitForTimeout(1000);
  console.log('  → Switched to 15x15 one more time\n');

  console.log('  Checking changes still persist:');
  let finalPass15 = true;
  for (const change of changes15) {
    const cell = page.locator('.game-board-cell').nth(change.row * 15 + change.col);
    const classes = await cell.evaluate(el => el.className);
    const persisted = classes.includes(change.type);
    console.log(`    ${persisted ? '✅' : '❌'} [${change.row},${change.col}] is ${change.name}`);
    if (!persisted) finalPass15 = false;
  }

  await page.screenshot({ path: 'test-persistence-demo.png', fullPage: true });

  // === Results ===
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                    TEST RESULTS                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`  15x15 First Switch:  ${pass15 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  11x11 Second Switch: ${pass11 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  15x15 Third Switch:  ${finalPass15 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`\n  Overall Result: ${pass15 && pass11 && finalPass15 ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  console.log('  Screenshot: test-persistence-demo.png');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  expect(pass15 && pass11 && finalPass15).toBe(true);
});
