const { test, expect } = require('@playwright/test');

test.describe("menu visual tests",() => {
  test.beforeEach(async({ page }) => {
    await page.goto(''); //goes to base URL set in config file
    await page.locator('#menuBtn').click();
  });

  test('open menu', async ({ page }) => { 
    await expect(page.locator('#sideMenu')).toBeVisible();
  });

  test('close menu', async ({ page }) => {
    await page.locator('#menuBtn').click();
    await expect(page.locator('#sideMenu')).not.toBeVisible();
  });

  test('click Settings menu item', async ({ page }) => {
    await page.locator('li',{hasText: "Settings"}).click();
    await expect(page.locator('#sideMenu')).not.toBeVisible();
  });

});