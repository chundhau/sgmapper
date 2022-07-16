const { test, expect } = require('@playwright/test');

test.describe("menu keyboard tests",() => {
  test.beforeEach(async({ page }) => {
    await page.goto(''); //goes to base URL set in config file
    await page.keyboard.press('Tab'); //Focus skip link
    await page.keyboard.press('Tab'); //Focus menu
    await page.keyboard.press('Enter'); //Select menu
  });

  test('open menu via keyboard', async ({ page }) => { 
    await expect(page.locator('#sideMenu')).toBeVisible();
  });

  test('close menu via keyboard', async ({ page }) => {
    await page.keyboard.press('Escape'); //Close menu
    await expect(page.locator('#sideMenu')).not.toBeVisible();
    await expect(page.locator('#menuBtn')).toBeFocused();
  });

  test('open Settings menu item via keyboard', async ({ page }) => {
    await page.keyboard.press('Enter'); //Select first menu item
    await expect(page.locator('#sideMenu')).not.toBeVisible();
    await expect(page.locator('#menuBtn')).toBeFocused();
  });

});