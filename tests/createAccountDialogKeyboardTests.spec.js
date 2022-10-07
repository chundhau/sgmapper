const { test, expect } = require('@playwright/test');

test.describe("create account keyboard tests",() => {
    test.beforeEach(async({ page }) => {
      await page.goto(''); //goes to base URL set in config file
      await page.keyboard.press('Tab'); //Focus skip link
      await expect(page.locator('#sLink')).toBeFocused();
      await page.keyboard.press('Tab'); //Focus "email" field
      await expect(page.locator('#email')).toBeFocused();
      await page.keyboard.press('Tab'); //Focus "email" field
      await expect(page.locator('#password')).toBeFocused();
      await page.keyboard.press('Tab'); //Focus "Log In" btton
      await expect(page.locator('#loginBtn')).toBeFocused();
      await page.keyboard.press('Tab'); //Focus "Create Account" btton
      await expect(page.locator('#CreateAcctBtn')).toBeFocused();
      await page.keyboard.press('Enter'); //Activate 'Create Account' link
      await expect(page.locator('#createAcctDialog')).toBeVisible(); //'Create Account' dialog visible
      await expect(page.locator('#loginPage')).not.toBeVisible(); //'Login' page hidden
      await expect(page.locator('#acctEmail')).toBeFocused(); //Email field has focus
    });

    test('invalid email and repeated password via kb interface', async ({ page }) => { 
        await page.keyboard.type('chris.h'); //Invalid email
        await page.keyboard.type('Tab'); //Focus on 'Password' field
        await expect(page.locator('#acctPassword')).toBeFocused();
        await page.keyboard.type('Speedgolf123'); //Valid password
        await page.keyboard.type('Tab'); //Focus on 'Password' field
        await expect(page.locator('#acctPasswordRepeat')).toBeFocused();
        await page.keyboard.type('Speedgolf1234'); //Password does not match.
        await page.keyboard.type('Tab'); //Focus on 'Display Name' field
        await page.keyboard.type('Tab'); //Focus on 'Security Q' field 
        await page.keyboard.type('Tab'); //Focus on 'Security A' field
        await page.keyboard.type('Tab'); //Focus on 'Create Account' Button
        await page.keyboard.type('Enter'); //Activate 'Create Account' Button
        await expect(page.locator('#acctEmailError')).toBeVisible(); //Email error visible
        await expect(page.locator('#acctEmailError')).toBeFocused(); //top-most error should have focus 
        await expect(page.locator('#acctPasswordError')).not.toBeVisible(); //No password error
        await expect(page.locator('#acctPasswordRepeatError')).toBeVisible(); //No password error
        await expect(page.locator('#acctDisplayNameError')).toBeVisible(); //No password error
        await expect(page.locator('#acctSecurityQuestionError')).toBeVisible(); //No password error
        await expect(page.locator('#acctSecurityAnswerError')).toBeVisible(); //No password error
        await page.keyboard.press('Enter'); //Activate "Enter a valid email address"
        await expect(page.locator('#acctEmail')).toBeFocused(); //Email field should be focused
      });
    });
