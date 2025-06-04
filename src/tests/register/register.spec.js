import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/register.page.js';
import { testUser } from '../../utils/testData.utils.js';

/**
 * @file register.spec.js
 * @description
 * Suite de pruebas de registro de usuario para el formulario de registro
 * del sitio web demowebshop.tricentis.com usando Playwright.
 * 
 * Se valida el comportamiento correcto ante distintos escenarios de registro:
 * - Registro exitoso con email único
 * - Manejo de email duplicado
 * - Validación de campos obligatorios y formato de email
 * - Validación de coincidencia de contraseña
 * - Prevención de inyección de código malicioso
 * - Evitar registros duplicados en la misma sesión
 * 
 * @see {@link https://playwright.dev/docs/test-intro}
 * @module tests/authentication/register
 */

const timestamp = Date.now();
const email = `testuser${timestamp}@example.com`;

test.describe('Autenticación - Pruebas del formulario de Registro', () => {

  /**
   * @test Registro exitoso con email único generado aleatoriamente.
   * Verifica que se muestre un mensaje de éxito luego del registro.
   */
  test('should register a new user with a random email', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    
    console.log('🚀 Navegando a la página de registro');
    await registerPage.navigate();

    console.log('📝 Completando formulario de registro con email aleatorio');
    await registerPage.register({
      firstName: 'Juan',
      lastName: 'Pérez',
      email,
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!',
    });

    console.log('✅ Verificando mensaje de registro exitoso');
    await expect(registerPage.successMessage).toBeVisible();
  });

  /**
   * @test Error si el email ya existe en el sistema.
   * El sistema debe mostrar un mensaje de error correspondiente.
   */
  test('should show error if email already exists', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    console.log('🚀 Navegando a la página de registro');
    await registerPage.navigate();

    console.log('📝 Intentando registrar con email ya existente');
    await registerPage.register({
      ...testUser,
      confirmPassword: testUser.password,
    });

    console.log('❌ Verificando mensaje de email duplicado');
    await expect(registerPage.emailExistsError).toBeVisible();
    await expect(registerPage.emailExistsError).toContainText('The specified email already exists');
  });

  /**
   * @test Error cuando las contraseñas no coinciden.
   * Verifica que el sistema muestre un error si password y confirmPassword difieren.
   */
  test('should show error if passwords do not match', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    console.log('🚀 Navegando a la página de registro');
    await registerPage.navigate();

    console.log('📝 Registrando con contraseñas que no coinciden');
    await registerPage.register({
      firstName: 'Ana',
      lastName: 'Gómez',
      email,
      password: '12345678',
      confirmPassword: '87654321',
    });

    console.log('❌ Verificando error por contraseñas no coincidentes');
    await expect(registerPage.passwordMismatchError).toBeVisible();
    await expect(registerPage.passwordMismatchError).toHaveText('The password and confirmation password do not match.');
  });

  /**
   * @test Error de formato en email con TLD inválido.
   * Se espera mensaje de error por email inválido (ej: .c en lugar de .com).
   */
  test('should show error with wrong invalid email (TLD invalid <Top-Level Domain> )', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    console.log('📝 Registrando con email de TLD inválido');
    await registerPage.register({
      firstName: 'Julian',
      lastName: 'Cardona',
      email: `testuser${timestamp}@example.c`,
      password: '12345678',
      confirmPassword: '12345678',
    });

    console.log('❌ Verificando error por email inválido');
    await expect(registerPage.emailInvalidError).toBeVisible();
    await expect(registerPage.emailInvalidError).toHaveText('Please enter a valid email address.');
  });

  /**
   * @test Validación de campos obligatorios.
   * El sistema debe mostrar mensajes de error si alguno de los campos requeridos está vacío.
   */
  test('should show required field errors if fields are empty', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    console.log('📝 Registrando con campos vacíos');
    await registerPage.register({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    console.log('❌ Verificando mensajes de error para campos requeridos');
    await expect(registerPage.firstNameError).toBeVisible();
    await expect(registerPage.firstNameError).toHaveText('First name is required.');

    await expect(registerPage.lastNameError).toBeVisible();
    await expect(registerPage.lastNameError).toHaveText('Last name is required.');

    await expect(registerPage.emailInvalidError).toBeVisible();
    await expect(registerPage.emailInvalidError).toHaveText('Email is required.');

    await expect(registerPage.passwordError).toBeVisible();
    await expect(registerPage.passwordError).toHaveText('Password is required.');

    await expect(registerPage.confirmPasswordError).toBeVisible();
    await expect(registerPage.confirmPasswordError).toHaveText('Password is required.');
  });

  /**
   * @test Prevención de inyección de código malicioso en campos de texto.
   * El sistema no debe permitir ejecución o registro con código HTML/JS.
   */
  test('should not allow HTML or JS code in input fields', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    const scriptInjection = `<script>alert("hack")</script>`;

    console.log('📝 Intentando inyección de script en campo firstName');
    await registerPage.register({
      firstName: scriptInjection,
      lastName: 'Hacker',
      email: `hacker${Date.now()}@example.com`,
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
    });

    console.log('❌ Verificando que no haya ejecución o redirección no autorizada');
    await expect(page).not.toHaveURL(/.*alert.*/);
    await expect(registerPage.successMessage).not.toBeVisible();
  });

  /**
   * @test Evita registro duplicado en la misma sesión con el mismo email.
   * El sistema debe bloquear intentos repetidos con el mismo email sin recargar.
   */
  test('should prevent duplicate registration in same session', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    const email = `duplicate${Date.now()}@example.com`;

    console.log('📝 Primer registro con email único');
    await registerPage.register({
      firstName: 'Maria',
      lastName: 'Dup',
      email,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    console.log('✅ Verificando mensaje de registro exitoso');
    await expect(registerPage.successMessage).toBeVisible();

    console.log('🔄 Intentando registrar de nuevo con el mismo email sin recargar');
    await registerPage.navigate();
    await registerPage.register({
      firstName: 'Maria',
      lastName: 'Dup',
      email,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });

    console.log('❌ Verificando mensaje de error por email duplicado');
    await expect(registerPage.emailExistsError).toBeVisible();
  });

});
