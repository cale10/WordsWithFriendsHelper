import { test, expect } from '@playwright/test';

test('verify bonus board sent to backend for scoring', async ({ page }) => {
  // Intercept the API call to the backend
  let capturedPostData: any = null;

  await page.route('**/bestGameMove', async (route) => {
    const request = route.request();
    const postData = request.postDataJSON();
    capturedPostData = postData;

    console.log('\n📡 API CALL INTERCEPTED!');
    console.log('─────────────────────────');
    console.log('Bonus board sample from request:');
    if (postData.bonusBoard) {
      console.log(`  [7,7]: "${postData.bonusBoard[7][7]}"`);
      console.log(`  [5,5]: "${postData.bonusBoard[5][5]}"`);
      console.log(`  [0,0]: "${postData.bonusBoard[0][0]}"`);
    }

    // Pass the request through to the actual backend
    route.continue();
  });

  await page.goto('http://127.0.0.1:5000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  BACKEND INTEGRATION TEST                             ║');
  console.log('║  Verify custom bonuses sent to scoring algorithm      ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // Step 1: Customize the board
  console.log('STEP 1: Customizing board with specific bonuses');
  console.log('─────────────────────────────────────────────────');

  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);

  // Change [7,7] to Triple Word
  const cell_7_7 = page.locator('.game-board-cell').nth(7 * 15 + 7);
  await cell_7_7.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.triple-word').click();
  await page.waitForTimeout(500);
  console.log('  ✓ Set [7,7] to Triple Word (TW)');

  // Change [5,5] to Double Letter
  const cell_5_5 = page.locator('.game-board-cell').nth(5 * 15 + 5);
  await cell_5_5.click();
  await page.waitForTimeout(500);
  await page.locator('.tile-type-button.double-letter').click();
  await page.waitForTimeout(500);
  console.log('  ✓ Set [5,5] to Double Letter (DL)');

  await page.locator('#editor-toggle').click();
  await page.waitForTimeout(500);
  console.log('  ✓ Exited editor mode\n');

  // Step 2: Add some letters to the rack
  console.log('STEP 2: Adding letters to rack');
  console.log('────────────────────────────────');

  // Click first rack cell and add a letter
  const rackCell1 = page.locator('.letter.user-letter').first();
  await rackCell1.click();
  await page.waitForTimeout(500);

  // Click 'A' in the letter picker
  const letterA = page.locator('.letter-button').filter({ hasText: 'A' }).first();
  await letterA.click();
  await page.waitForTimeout(500);
  console.log('  ✓ Added letter "A" to rack\n');

  // Step 3: Place a letter on the board
  console.log('STEP 3: Placing letter on board');
  console.log('─────────────────────────────────');

  const boardCell = page.locator('.game-board-cell').nth(7 * 15 + 6); // Next to [7,7]
  await boardCell.click();
  await page.waitForTimeout(500);

  const letterB = page.locator('.letter-button').filter({ hasText: 'B' }).first();
  await letterB.click();
  await page.waitForTimeout(500);
  console.log('  ✓ Placed letter "B" on board at [7,6]\n');

  // Step 4: Add more letters to rack for valid move
  console.log('STEP 4: Adding more letters to rack');
  console.log('─────────────────────────────────────');

  const letters = ['C', 'D', 'E', 'F', 'G'];
  for (let i = 0; i < letters.length; i++) {
    const rackCell = page.locator('.letter.user-letter').nth(i + 1);
    await rackCell.click();
    await page.waitForTimeout(300);
    const letterBtn = page.locator('.letter-button').filter({ hasText: letters[i] }).first();
    await letterBtn.click();
    await page.waitForTimeout(300);
  }
  console.log('  ✓ Added letters C, D, E, F, G to rack\n');

  // Step 5: Click "Go" to trigger API call
  console.log('STEP 5: Computing best move (triggers API call)');
  console.log('──────────────────────────────────────────────────');

  const goButton = page.locator('#go');
  await goButton.click();

  // Wait for API call to complete
  await page.waitForTimeout(3000);

  // Step 6: Verify the captured data
  console.log('\nSTEP 6: Verifying bonus board in API request');
  console.log('──────────────────────────────────────────────');

  if (capturedPostData) {
    console.log('  ✓ API call was made');
    console.log(`  Board size: ${capturedPostData.boardSize}×${capturedPostData.boardSize}`);

    if (capturedPostData.bonusBoard) {
      const bonus_7_7 = capturedPostData.bonusBoard[7][7];
      const bonus_5_5 = capturedPostData.bonusBoard[5][5];

      console.log(`  Bonus at [7,7]: "${bonus_7_7}" (expected "TW")`);
      console.log(`  Bonus at [5,5]: "${bonus_5_5}" (expected "DL")`);

      const correctBonuses = bonus_7_7 === 'TW' && bonus_5_5 === 'DL';
      console.log(`  Custom bonuses sent correctly: ${correctBonuses ? '✅' : '❌'}`);
    } else {
      console.log('  ❌ No bonusBoard in request!');
    }
  } else {
    console.log('  ❌ No API call was captured');
  }

  await page.screenshot({ path: 'test-bonus-backend-integration.png', fullPage: true });

  // Results
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                    TEST RESULTS                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  const success = capturedPostData &&
                  capturedPostData.bonusBoard &&
                  capturedPostData.bonusBoard[7][7] === 'TW' &&
                  capturedPostData.bonusBoard[5][5] === 'DL';

  console.log(`  Custom bonus board sent to backend: ${success ? '✅ YES' : '❌ NO'}`);
  console.log(`  Algorithm will use custom bonuses: ${success ? '✅ YES' : '❌ NO'}`);
  console.log(`\n  Overall: ${success ? '✅ FULLY INTEGRATED' : '❌ NOT WORKING'}`);
  console.log('  Screenshot: test-bonus-backend-integration.png');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  expect(success).toBe(true);
});
