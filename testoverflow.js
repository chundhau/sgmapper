//Menu closes when clicked
test('close menu', async ({ page }) => {
    await page.goto('http://localhost:5500/');
    await page.locator('#menuBtn').click();
    await page.locator('#menuBtn').click();
    await expect(page.locator('#sideMenu')).not.toBeVisible();
  });
  
  //Menu closes when 'Settings' item clicked
  test('click Settings menu item', async ({ page }) => {
    await page.goto('http://localhost:5500/');
    await page.locator('#menuBtn').click();
    await page.locator('li',{hasText: "Settings"}).click();
    await expect(page.locator('#sideMenu')).not.toBeVisible();
  });
  
  //Menu closes when 'Settings' item clicked
  test('click About menu item', async ({ page }) => {
    await page.goto('http://localhost:5500/');
    await page.locator('#menuBtn').click();
    await page.locator('li',{hasText: "About"}).click();
    await expect(page.locator('#sideMenu')).not.toBeVisible();
  });
  
  //Menu closes when 'Settings' item clicked
  test('click Log Out menu item', async ({ page }) => {
    await page.goto('http://localhost:5500/');
    await page.locator('#menuBtn').click();
    await page.locator('li',{hasText: "Log Out"}).click();
    await expect(page.locator('#sideMenu')).not.toBeVisible();
  });