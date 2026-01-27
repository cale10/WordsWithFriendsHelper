import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test('check actual HTML served', async ({ page }) => {
  await page.goto('http://127.0.0.1:5000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Get the full HTML content
  const htmlContent = await page.content();

  // Save to file for inspection
  fs.writeFileSync('served-html.html', htmlContent);
  console.log('Saved served HTML to served-html.html');

  // Check if buttons exist in the HTML
  const hasMirrorButton = htmlContent.includes('id="mirror-toggle"');
  const hasSaveButton = htmlContent.includes('id="save-board"');

  console.log('\n=== HTML CHECK ===');
  console.log('Mirror toggle button in HTML:', hasMirrorButton);
  console.log('Save board button in HTML:', hasSaveButton);

  // Try to find the buttons with JavaScript
  const buttonCheck = await page.evaluate(() => {
    return {
      mirrorToggle: !!document.getElementById('mirror-toggle'),
      saveBoard: !!document.getElementById('save-board'),
      editorToggle: !!document.getElementById('editor-toggle'),
    };
  });

  console.log('\n=== DOM ELEMENT CHECK ===');
  console.log('Mirror toggle in DOM:', buttonCheck.mirrorToggle);
  console.log('Save board in DOM:', buttonCheck.saveBoard);
  console.log('Editor toggle in DOM:', buttonCheck.editorToggle);
});
