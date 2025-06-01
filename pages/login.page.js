export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('#Email');
    this.passwordInput = page.locator('#Password');
    this.submitButton = page.locator('input.login-button[type="submit"]');
    this.logoutText = page.getByText('Log out');
    this.unsuccessfulLoginMessage = page.getByText('Login was unsuccessful. Please correct the errors and try again.');
    this.noCustomerFoundMessage = page.getByText('No customer account found');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async fillCredentials(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.click();
  }

  async login(email, password) {
    await this.fillCredentials(email, password);
    await this.submit();
  }
}
