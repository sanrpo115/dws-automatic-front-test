# Proyecto de Automatización de Pruebas con Playwright (JavaScript)

Este proyecto demuestra la automatización de un flujo de "Añadir Producto al Carrito" en la tienda de demostración [Demo Web Shop](http://demowebshop.tricentis.com/). El objetivo principal es garantizar que un usuario pueda registrarse y logearse en la aplicación.

## 1. Estructura del Proyecto

La estructura del proyecto sigue un patrón Page Object Model (POM) para mejorar la reusabilidad del código, la legibilidad de las pruebas y la facilidad de mantenimiento.


├── pages/ # Clases POM para cada página (ej: RegisterPage)
├── tests/
│ └── login/ # Casos de prueba para registro e inicio de sesión
│ └── register/ # Casos de prueba para registro e inicio de sesión
├── utils/
│ ├── testData.utils.js # Datos de prueba usando variables de entorno
│ └── message.constants.js# Mensajes de error reutilizables
├── .env # Variables sensibles como usuario y contraseña
├── package.json # Scripts, dependencias y configuraciones
├── README.md # Documentación general del proyecto
└── playwright-report/ # Reportes generados automáticamente
└── docs/ # Documentación clases con JS Docs


## 2. Configuración del Entorno y Ejecución

### Requisitos Previos

Asegúrate de tener instalado:
- **Node.js**: Se recomienda la versión 21.x o superior.
- **npm** (Node Package Manager) o **yarn**.

1. Clona el repositorio:
   ```bash
   git clone https://github.com/sanrpo115/dws-automatic-front-test.git
   cd demo-web-shop
   ```
2. Instalar dependencias:
    ```bash
    npm install
    ```
3. Configura las variables de entorno en un archivo .env:
    ```bash
    #MAIN CONFIG
    BASE_URL=https://demowebshop.tricentis.com

    #USER CONFIG
    TEST_EMAIL=andres.alarcon@gmail.com
    TEST_PASSWORD=Cambiame1234
    TEST_USER_NAME=Andres
    TEST_USER_LASTNAME=Alarcon
    ```

## 3. Ejecución de Pruebas

Ejecutar todas las pruebas y generar el reporte:

```bash
npm test
```
Ver el reporte de las pruebas:

```bash
npm run report
```
Abrir la interfaz visual de Playwright:

```bash
npm run test:ui
```

Generación de documentación:
```bash
npm run docs
```
## 4. Escenarios

### 📌 Escenarios Cubiertos:
El archivo register.spec.js valida los siguientes casos del formulario de registro:

✅ Registro exitoso con email aleatorio

❌ Email duplicado

⚠️ Contraseñas no coinciden

✉️ Formato de email inválido (TLD incorrecto)

📭 Campos obligatorios vacíos

🔒 Prevención de inyección de código HTML/JS

🔁 Intento de registro duplicado en la misma sesión

##

### Buenas Prácticas Aplicadas:
✅ Page Object Model (POM) para reutilización de acciones

✅ Variables de entorno para datos sensibles

✅ Mensajes centralizados en message.constants.js

✅ Protección contra ataques XSS

✅ Pruebas con trazabilidad mediante console.log

✅ Mensajes y estructuras documentadas con JSDoc