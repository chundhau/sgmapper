const { test, expect } = require('@playwright/test');

test.describe("switch mode keyboard tests",() => {
  test.beforeEach(async({ page }) => {
    await page.goto(''); //goes to base URL set in config file
    await page.keyboard.press('Tab'); //Focus skip link
    await page.keyboard.press('Tab'); //Focus menu
    await page.keyboard.press('Tab'); //Focus search icon
    await page.keyboard.press('Tab'); //Focus profile pic
    await page.keyboard.press('Tab'); //Focus first tab
  });

  test('switch to rounds', async ({ page }) => { 
    await page.keyboard.press('ArrowRight'); //Select next tab
    await page.keyboard.press('Enter'); //Focus Rounds Tab
    await expect(page.locator('#roundsModeTab')).toBeVisible();
    await expect(page.locator('#feedModeTab')).not.toBeVisible();
    await expect(page.locator('#coursesModeTab')).not.toBeVisible();
    await expect(page.locator('#buddiesModeTab')).not.toBeVisible();
  });

  //TO DO: Insert tests for switching to other modes

});