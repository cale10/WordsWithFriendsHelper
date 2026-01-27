import { test, expect } from '@playwright/test';

test('debug editor mode and mirror button', async ({ page }) => {
  // Capture console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    const message = `[${msg.type()}] ${msg.text()}`;
    console.log(message);
    consoleMessages.push(message);
  });

  // Capture errors
  const pageErrors: string[] = [];
  page.on('pageerror', err => {
    const error = `ERROR: ${err.message}`;
    console.log(error);
    pageErrors.push(error);
  });

  await page.goto('http://127.0.0.1:5000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  console.log('\n=== INITIAL STATE ===');

  // Check if editor toggle button exists
  const editorToggle = page.locator('#editor-toggle');
  const editorExists = await editorToggle.count();
  console.log('Editor toggle exists:', editorExists > 0);

  // Check mirror button initial state
  const mirrorToggle = page.locator('#mirror-toggle');
  const mirrorExists = await mirrorToggle.count();
  console.log('Mirror toggle exists:', mirrorExists > 0);

  if (mirrorExists > 0) {
    const mirrorVisible = await mirrorToggle.isVisible();
    const mirrorClasses = await mirrorToggle.evaluate(el => el.className);
    console.log('Mirror toggle visible:', mirrorVisible);
    console.log('Mirror toggle classes:', mirrorClasses);
  }

  console.log('\n=== CLICKING EDITOR TOGGLE ===');

  // Click editor toggle
  await editorToggle.click();
  await page.waitForTimeout(1000);

  // Check editor mode state
  const bodyClasses = await page.evaluate(() => document.body.className);
  console.log('Body classes after toggle:', bodyClasses);

  const editorButtonText = await editorToggle.textContent();
  console.log('Editor button text:', editorButtonText);

  // Check mirror button after editor mode activation
  if (mirrorExists > 0) {
    const mirrorVisibleAfter = await mirrorToggle.isVisible();
    const mirrorClassesAfter = await mirrorToggle.evaluate(el => el.className);
    const mirrorDisplay = await mirrorToggle.evaluate(el => window.getComputedStyle(el).display);
    console.log('Mirror toggle visible after editor activation:', mirrorVisibleAfter);
    console.log('Mirror toggle classes after:', mirrorClassesAfter);
    console.log('Mirror toggle computed display:', mirrorDisplay);
  }

  console.log('\n=== CONSOLE MESSAGES ===');
  consoleMessages.forEach(msg => console.log(msg));

  console.log('\n=== ERRORS ===');
  if (pageErrors.length > 0) {
    pageErrors.forEach(err => console.log(err));
  } else {
    console.log('No errors');
  }

  await page.screenshot({ path: 'test-editor-mode-debug.png', fullPage: true });
});
