const { test, expect } = require('@playwright/test');

test('open menu', async ({ page }) => { 
  await page.goto(''); //goes to base URL set in config file
  await page.locator('#menuBtn').click();
  await expect(page.locator('#sideMenu')).toBeVisible();
});