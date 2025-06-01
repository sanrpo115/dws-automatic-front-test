import { test, expect } from '@playwright/test';
import { baseURL, testUser } from '../../utils/testData.utils';
import { LoginPage } from '../../pages/login.page.js';

test.describe('Login Test', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/login`);
  });

  test('should log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(testUser.email, testUser.password);

    await expect(loginPage.logoutText).toBeVisible();
  });

  test('should show error with wrong credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('correo_invalido@example.com', 'claveIncorrecta!');

    await expect(loginPage.unsuccessfulLoginMessage).toBeVisible();
    await expect(loginPage.noCustomerFoundMessage).toBeVisible();
  });

});
