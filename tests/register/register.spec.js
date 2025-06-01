import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/register.page.js';
import { testUser } from '../../utils/testData.utils';

test.describe('Register Test', () => {

  test('should register a new user with a random email', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    const timestamp = Date.now();
    const email = `testuser${timestamp}@example.com`;

    await registerPage.register({
      firstName: 'Juan',
      lastName: 'Pérez',
      email,
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
    });

    await expect(registerPage.successMessage).toBeVisible();
  });

  test('should show error if email already exists', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    await registerPage.register({
      ...testUser,
      confirmPassword: testUser.password,
    });

    await expect(registerPage.emailExistsError).toBeVisible();
    await expect(registerPage.emailExistsError).toContainText('The specified email already exists');
  });

  test('should show error if passwords do not match', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    await registerPage.register({
      firstName: 'Ana',
      lastName: 'Gómez',
      email: 'anita@example.com',
      password: '12345678',
      confirmPassword: '87654321',
    });

    await expect(registerPage.passwordMismatchError).toBeVisible();
    await expect(registerPage.passwordMismatchError).toHaveText('The password and confirmation password do not match.');
  });

});
