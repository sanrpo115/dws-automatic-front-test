import { ErrorMessages } from "../utils/messages.constants";

/**
 * @typedef {Object} Page
 * @see {@link https://playwright.dev/docs/api/class-page}
 */

/**
 * Representa la página de inicio de sesión del sitio web.
 *
 * Esta clase encapsula toda la lógica de interacción con la UI del login,
 * permitiendo reutilizar los métodos en diferentes pruebas automatizadas.
 *
 * @class LoginPage
 */
export class LoginPage {
  /**
   * Constructor que instancia de la página de inicio de sesión.
   *
   * Inicializa todos los elementos de la interfaz necesarios para interactuar
   * con el formulario de login, incluyendo campos de entrada, botones y mensajes de error.
   *
   * @param {Page} page - Instancia de la página proporcionada por Playwright.
   */
  constructor(page) {
    this.page = page;
    // Campos de entrada
    this.emailInput = page.locator('#Email');
    this.passwordInput = page.locator('#Password');
    // Botón de envío del formulario
    this.submitButton = page.locator('input.login-button[type="submit"]');
    // Texto visible solo cuando el usuario ha iniciado sesión exitosamente
    this.logoutText = page.getByText('Log out');
    // Mensajes de error relacionados con el email
    this.emailLoginInvalidError = page.locator('[data-valmsg-for="Email"] span');
    // Mensajes de error generales del login
    this.unsuccessfulLoginMessage = page.getByText(ErrorMessages.loginUnsuccessful);
    this.noCustomerFoundMessage = page.getByText(ErrorMessages.noCustomerFound);
  }

  /**
   * Navega a la página de inicio de sesión.
   *
   * Este método permite centralizar la navegación a la ruta '/login', lo cual es útil
   * para mantener consistencia en los tests y facilitar su mantenimiento.
   *
   * @returns {Promise<void>}
   */
  async navigate() {
    await this.page.goto('/login');
  }

  /**
   * Llena los campos del formulario de inicio de sesión con las credenciales proporcionadas.
   *
   * Este método es útil para reutilizar la lógica de ingreso de datos en el formulario,
   * permitiendo escribir pruebas más limpias y legibles.
   *
   * @param {string} email - Dirección de correo electrónico del usuario.
   * @param {string} password - Contraseña del usuario.
   * @returns {Promise<void>}
   */
  async fillCredentials(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Envía el formulario de inicio de sesión.
   *
   * Espera a que el botón de envío sea visible antes de hacer clic en él, lo cual
   * previene errores por elementos no cargados o renderizados aún.
   *
   * @returns {Promise<void>}
   */
  async submit() {
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.click();
  }

  /**
   * Realiza el proceso completo de inicio de sesión.
   *
   * Este método combina el llenado del formulario con las credenciales proporcionadas
   * y el envío del mismo. Es útil para simplificar los pasos del test y evitar duplicación de código.
   *
   * @param {string} email - Dirección de correo electrónico del usuario.
   * @param {string} password - Contraseña del usuario.
   * @returns {Promise<void>}
   */
  async login(email, password) {
    await this.fillCredentials(email, password);
    await this.submit();
  }
}
