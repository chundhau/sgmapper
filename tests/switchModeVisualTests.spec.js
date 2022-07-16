const { test, expect } = require('@playwright/test');

test.describe("switch mode visual tests",() => {
  test.beforeEach(async({ page }) => {
    await page.goto(''); //goes to base URL set in config file
  });

  test('switch to rounds', async ({ page }) => { 
    await page.locator('#roundsMode').click();
    await expect(page.locator('#roundsModeTab')).toBeVisible();
    await expect(page.locator('#feedModeTab')).not.toBeVisible();
    await expect(page.locator('#coursesModeTab')).not.toBeVisible();
    await expect(page.locator('#buddiesModeTab')).not.toBeVisible();
  });

  //TO DO: Insert tests for switching to other modes

});