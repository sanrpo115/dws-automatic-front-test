// pages/registerPage.js
export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.genderMale = page.locator('#gender-male');
    this.firstName = page.locator('#FirstName');
    this.lastName = page.locator('#LastName');
    this.email = page.locator('#Email');
    this.password = page.locator('#Password');
    this.confirmPassword = page.locator('#ConfirmPassword');
    this.registerButton = page.locator('input#register-button[type="submit"]');
    this.successMessage = page.getByText('Your registration completed');
    this.emailExistsError = page.locator('.message-error');
    this.passwordMismatchError = page.locator('[data-valmsg-for="ConfirmPassword"] span');
  }

  async navigate() {
    await this.page.goto('/register');
  }

  async register(user) {
    await this.genderMale.click();
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.confirmPassword.fill(user.confirmPassword);
    await this.registerButton.click();
  }
}
