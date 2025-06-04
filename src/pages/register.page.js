/**
 * @typedef {Object} Page
 * @see {@link https://playwright.dev/docs/api/class-page}
 */

/**
 * Representa la página de registro del sitio web y sus elementos.
 *
 * Esta clase encapsula toda la lógica de interacción con la UI del registro,
 * permitiendo reutilizar los métodos en diferentes pruebas automatizadas.
 *
 * @class RegisterPage
 */
export class RegisterPage {
  /**
   * Constructor que instancia de la página de registro de usuarios.
   *
   * Inicializa todos los elementos de la interfaz necesarios para interactuar
   * con el formulario de registro, incluyendo campos de entrada, botones y mensajes de error.
   *
   * @param {Page} page - Instancia de la página de Playwright.
   */
  constructor(page) {
    /** @private */
    this.page = page;

    /** Selector para el radio button de género masculino */
    this.genderMale = page.locator('#gender-male');

    /** Selector para el campo de nombre */
    this.firstName = page.locator('#FirstName');

    /** Selector para el campo de apellido */
    this.lastName = page.locator('#LastName');

    /** Selector para el campo de email */
    this.email = page.locator('#Email');

    /** Selector para el campo de contraseña */
    this.password = page.locator('#Password');

    /** Selector para el campo de confirmación de contraseña */
    this.confirmPassword = page.locator('#ConfirmPassword');

    /** Selector para el botón de registro */
    this.registerButton = page.locator('input#register-button[type="submit"]');

    /** Selector para el mensaje de registro exitoso */
    this.successMessage = page.getByText('Your registration completed');

    /** Selector para el mensaje de error cuando el email ya existe */
    this.emailExistsError = page.locator('.message-error');

    /** Selector para el mensaje de error cuando la confirmación de contraseña no coincide */
    this.passwordMismatchError = page.locator('[data-valmsg-for="ConfirmPassword"] span');

    /** Selector para el mensaje de error cuando el email tiene formato inválido */
    this.emailInvalidError = page.locator('[data-valmsg-for="Email"] span');

    /** Selector para el mensaje de error cuando el campo nombre está vacío o inválido */
    this.firstNameError = page.locator('[data-valmsg-for="FirstName"] span');

    /** Selector para el mensaje de error cuando el campo apellido está vacío o inválido */
    this.lastNameError = page.locator('[data-valmsg-for="LastName"] span');

    /** Selector para el mensaje de error cuando la contraseña no cumple reglas */
    this.passwordError = page.locator('[data-valmsg-for="Password"] span');

    /** Selector para el mensaje de error de confirmación de contraseña */
    this.confirmPasswordError = page.locator('[data-valmsg-for="ConfirmPassword"] span');
  }

  /**
   * Navega a la página de registro.
   * @returns {Promise<void>}
   */
  async navigate() {
    await this.page.goto('/register');
  }

  /**
   * Completa el formulario de registro y envía los datos.
   * 
   * @param {Object} user - Objeto con los datos del usuario.
   * @param {string} user.firstName - Nombre del usuario.
   * @param {string} user.lastName - Apellido del usuario.
   * @param {string} user.email - Email del usuario.
   * @param {string} user.password - Contraseña del usuario.
   * @param {string} user.confirmPassword - Confirmación de la contraseña.
   * @returns {Promise<void>}
   */
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
