import { test, expect } from '@playwright/test';
import { testUser } from '../../utils/testData.utils.js';
import { ErrorMessages } from '../../utils/messages.constants.js';
import { LoginPage } from '../../pages/login.page.js';

/**
 * @file login.spec.js
 * @description
 * Suite de pruebas de autenticación para el formulario de inicio de sesión
 * del sitio web demowebshop.tricentis.com usando Playwright.
 * 
 * Se valida el comportamiento correcto ante distintos escenarios de ingreso:
 * - Credenciales válidas
 * - Credenciales inválidas (formato, vacío, TLD incorrecto, etc.)
 * - Ataques comunes (XSS, SQL Injection)
 * - Acceso indebido a rutas protegidas
 * 
 * @see {@link https://playwright.dev/docs/test-intro}
 * @module tests/authentication/login
 */
test.describe('Autenticación - Pruebas del formulario de Login', () => {

  /**
   * @test Ingreso exitoso con credenciales válidas.
   * Verifica que se muestre la opción de "Log out" tras un login exitoso.
   */
  test('should log in with valid credentials', async ({ page }) => {
    // Instancia clase de LoginPage y navega a la ruta /login
    const loginPage = new LoginPage(page);
    console.log('🚀 Navegando a la ruta de login');
    await loginPage.navigate();

    // Ingresar credenciales y envía formulario
    console.log('📝 Ingresando credenciales válidas');
    await loginPage.login(testUser.email, testUser.password);

    // Verifica opción Log out en menú
    console.log('✅ Verificando que se muestra el botón de cerrar sesión');
    await expect(loginPage.logoutText).toBeVisible();
  });

  /**
   * @test Error con credenciales inválidas.
   * Debe mostrar mensajes de error si el login falla por usuario/contraseña incorrectos.
   */
  test('should show error with wrong credentials', async ({ page }) => {
    // Instancia clase de LoginPage y navega a la ruta /login
    const loginPage = new LoginPage(page);
    console.log('🚀 Navegando a la ruta de login');
    await loginPage.navigate();

    // Ingresar credenciales y envía formulario
    console.log('📝 Ingresando credenciales incorrectas');
    await loginPage.login('correo_invalido@example.com', 'claveIncorrecta!');

    // Verifica mensaje de error en formulario
    console.log('❌ Verificando mensaje de intento de login inválido')
    await expect(loginPage.unsuccessfulLoginMessage).toBeVisible();
    await expect(loginPage.noCustomerFoundMessage).toBeVisible();
  });

  /**
   * @test Error con campos vacíos.
   * El sistema debe mostrar error si el usuario intenta loguearse sin ingresar email y contraseña.
   */
  test('should show error with empty email and password', async ({ page }) => {
    // Instancia clase de LoginPage y navega a la ruta /login
    const loginPage = new LoginPage(page);
    console.log('🚀 Navegando a la ruta de login');
    await loginPage.navigate();

    // Ingresar credenciales inválidas y envía formulario
    console.log('📝 Ingresando credenciales incorrectas');
    await loginPage.login('', '');

    // Verifica mensaje de error en formulario
    console.log('❌ Verificando mensaje de intento de login inválido')
    await expect(loginPage.unsuccessfulLoginMessage).toBeVisible();
  });

  /**
   * @test Email inválido (sin "@").
   * Valida que se muestre un mensaje de error por formato incorrecto de email.
   */
  test('should show error with invalid email format (missing @)', async ({ page }) => {
    // Instancia clase de LoginPage y navega a la ruta /login
    const loginPage = new LoginPage(page);
    console.log('🚀 Navegando a la ruta de login');
    await loginPage.navigate();

    // Ingresar credenciales inválidas y envía formulario
    console.log('📝 Ingresando credenciales incorrectas');
    await loginPage.login('correoInvalido.com', 'TestPassword123');

    // Verifica mensaje de error en formulario
    console.log('❌ Verificando mensaje de intento de login inválido')
    await expect(loginPage.emailLoginInvalidError).toBeVisible();
    await expect(loginPage.emailLoginInvalidError).toHaveText(ErrorMessages.invalidEmail);
  });

  /**
   * @test TLD inválido en email (ej: .c en lugar de .com).
   */
  test('should show error with invalid TLD in email', async ({ page }) => {
    // Instancia clase de LoginPage y navega a la ruta /login
    const loginPage = new LoginPage(page);
    console.log('🚀 Navegando a la ruta de login');
    await loginPage.navigate();

    // Ingresar credenciales inválidas y envía formulario
    console.log('📝 Ingresando credenciales incorrectas');
    await loginPage.login('usuario@example.c', 'TestPassword123');

    // Verifica mensaje de error en formulario
    console.log('❌ Verificando mensaje de intento de login inválido')
    await expect(loginPage.emailLoginInvalidError).toBeVisible();
    await expect(loginPage.emailLoginInvalidError).toHaveText(ErrorMessages.invalidEmail);
  });

  /**
   * @test Email con espacios.
   * Valida que el sistema no permita espacios en blanco en los extremos del email.
   */
  test('should show error with spaces in email', async ({ page }) => {
    // Instancia clase de LoginPage y navega a la ruta /login
    const loginPage = new LoginPage(page);
    console.log('🚀 Navegando a la ruta de login');
    await loginPage.navigate();

    // Ingresar credenciales inválidas y envía formulario
    console.log('📝 Ingresando credenciales incorrectas');
    await loginPage.login(' usuario@example.com ', 'TestPassword123');

    // Verifica mensaje de error en formulario
    console.log('❌ Verificando mensaje de intento de login inválido')
    await expect(loginPage.emailLoginInvalidError).toBeVisible();
    await expect(loginPage.emailLoginInvalidError).toHaveText(ErrorMessages.invalidEmail);
  });

  /**
   * @test Inyección de scripts (XSS) en el campo email.
   * El sistema no debe permitir ejecución de scripts maliciosos.
   */
  test('should not allow script injection in email field', async ({ page }) => {
    // Instancia clase de LoginPage y navega a la ruta /login
    const loginPage = new LoginPage(page);
    console.log('🚀 Navegando a la ruta de login');
    await loginPage.navigate();

    // Ingresar credenciales inválidas y envía formulario
    console.log('📝 Ingresando credenciales incorrectas');
    await loginPage.login('<script>alert("xss")</script>', 'fakePassword');

    // Verifica mensaje de error en formulario
    console.log('❌ Verificando mensaje de intento de login inválido')
    await expect(loginPage.emailLoginInvalidError).toBeVisible();
    await expect(loginPage.emailLoginInvalidError).toHaveText(ErrorMessages.invalidEmail);
  });

  /**
   * @test Inyección SQL en el campo email.
   * Se espera que el backend o frontend bloquee intentos de manipulación por SQL Injection.
   */
  test('should not allow SQL injection in email field', async ({ page }) => {
    // Instancia clase de LoginPage y navega a la ruta /login
    const loginPage = new LoginPage(page);
    console.log('🚀 Navegando a la ruta de login');
    await loginPage.navigate();

    // Ingresar credenciales inválidas y envía formulario
    console.log('📝 Ingresando credenciales incorrectas');
    await loginPage.login(`' OR 1=1 --`, 'fakePassword');

    // Verifica mensaje de error en formulario
    console.log('❌ Verificando mensaje de intento de login inválido')
    await expect(loginPage.emailLoginInvalidError).toBeVisible();
    await expect(loginPage.emailLoginInvalidError).toHaveText(ErrorMessages.invalidEmail);
  });

  /**
   * @test Evita acceder a /login si ya hay sesión iniciada.
   * Se espera redirección o mensaje indicando sesión activa.
   */
  test('should not allow navigating to /login when already authenticated', async ({ page }) => {
    // Instancia clase de LoginPage y navega a la ruta /login
    const loginPage = new LoginPage(page);
    console.log('🚀 Navegando a la ruta de login e iniciando sesión');
    await loginPage.navigate();

    // Login con credenciales válidas
    await loginPage.login(testUser.email, testUser.password);

    // Verifica que el login fue exitoso
    await expect(loginPage.logoutText).toBeVisible();

    // Intenta acceder directamente a la ruta /login
    console.log('🔄 Intentando navegar nuevamente a /login con sesión activa');
    await loginPage.navigate();

    // Espera que sea redirigido a home, dashboard o que el formulario esté oculto
    // Puedes ajustar esta parte según el comportamiento esperado

    // Opción 1: Redirección a home (verifica que no esté el formulario de login)
    console.log('✅ Verificando que el formulario de login no esté visible o haya redirección');
    await expect(loginPage.submitButton).not.toBeVisible();

    // Opción 2: Mensaje que indica que ya hay sesión iniciada
    console.log('✅ Verificando mensaje informativo de sesión activa');
    const alreadyLoggedInMessage = page.getByText('You are already logged in');
    await expect(alreadyLoggedInMessage).toBeVisible();
  });


});
