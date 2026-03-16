/**
 * Tests E2E de Navegador — flujo completo del wizard FUHV
 * Usa Puppeteer para simular un usuario real navegando por los 7 pasos.
 */
const puppeteer = require('puppeteer');
const http = require('http');
const app = require('../../server/index');

// ── Configuración ──────────────────────────────────────────────────────────────
const TEST_PORT = 3099;
const BASE_URL = `http://localhost:${TEST_PORT}`;
const TIMEOUT_NAV = 8000;

let server;
let browser;
let page;

// ── Setup / Teardown ───────────────────────────────────────────────────────────
beforeAll(async () => {
  server = http.createServer(app);
  await new Promise(resolve => server.listen(TEST_PORT, resolve));

  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
}, 20000);

afterAll(async () => {
  if (browser) await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
});

beforeEach(async () => {
  page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Descartar todos los diálogos (confirm de borrador, alerts de validación)
  page.on('dialog', async dialog => { await dialog.dismiss(); });

  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: TIMEOUT_NAV });
});

afterEach(async () => {
  if (page && !page.isClosed()) await page.close();
});

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Reemplaza page.waitForTimeout (eliminado en Puppeteer v22+) */
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/** Lee el paso activo desde el DOM (let no se expone en window) */
async function pasoActual(p) {
  return p.$eval('.form-step.active', el => parseInt(el.getAttribute('data-step'), 10));
}

/** Hace scroll al elemento y lo clickea de forma segura */
async function scrollAndClick(p, selector) {
  await p.$eval(selector, el => el.scrollIntoView({ block: 'center' }));
  await wait(150);
  await p.click(selector);
}

async function llenarPaso1(p) {
  await p.type('#primerApellido', 'Garcia');
  await p.type('#segundoApellido', 'Lopez');
  await p.type('#primerNombre', 'Maria');
  await p.type('#segundoNombre', 'Jose');
  await p.select('#tipoDocumento', 'CC');
  await p.type('#numeroDocumento', '52345678');
  await p.select('#sexo', 'F');
  await p.type('#fechaNacimiento', '15/08/1990');
  await p.type('#departamentoNacimiento', 'Cundinamarca');
  await p.type('#municipioNacimiento', 'Bogota DC');
  await p.type('#departamentoResidencia', 'Cundinamarca');
  await p.type('#municipioResidencia', 'Bogota DC');
  await p.type('#direccion', 'Calle 100 15-20 Apto 301');
  await p.type('#email', 'maria.garcia@example.com');
}

/** Llena los campos requeridos de la formación #1 (necesario para avanzar desde paso 3) */
async function llenarFormacion1(p) {
  await p.select('[name="formacion_modalidad_1"]', 'UN');
  await p.type('[name="formacion_semestres_1"]', '10');
  await p.select('[name="formacion_graduado_1"]', 'SI');
  await p.type('[name="formacion_titulo_1"]', 'Ingenieria de Sistemas');
}

async function avanzarPaso(p) {
  await scrollAndClick(p, '#nextBtn');
  await wait(400);
}

/** Navega desde paso 1 hasta paso 7 llenando todos los campos requeridos */
async function navegarHastaPaso7(p) {
  // Paso 1 — Datos personales
  await llenarPaso1(p);
  await avanzarPaso(p); // → paso 2

  // Paso 2 — Educación básica
  await p.select('#gradoAprobado', '11');
  await avanzarPaso(p); // → paso 3

  // Paso 3 — Formación académica (4 campos required)
  await llenarFormacion1(p);
  await avanzarPaso(p); // → paso 4

  // Paso 4 — Idiomas (4 campos required en el bloque auto-añadido)
  await p.type('[name="idioma_nombre_1"]', 'Ingles');
  await p.select('[name="idioma_habla_1"]', 'MB');
  await p.select('[name="idioma_lee_1"]', 'MB');
  await p.select('[name="idioma_escribe_1"]', 'B');
  await avanzarPaso(p); // → paso 5

  // Paso 5 — Experiencia laboral (8 campos required en el bloque auto-añadido)
  await p.type('[name="experiencia_empresa_1"]', 'Tech Solutions SAS');
  await p.select('[name="experiencia_tipo_1"]', 'Privada');
  // experiencia_pais_1 ya tiene 'Colombia' por defecto
  await p.type('[name="experiencia_depto_1"]', 'Cundinamarca');
  await p.type('[name="experiencia_municipio_1"]', 'Bogota DC');
  await p.type('[name="experiencia_cargo_1"]', 'Desarrolladora');
  await p.type('[name="experiencia_ingreso_1"]', '01/2020');
  await p.type('[name="experiencia_retiro_1"]', '12/2023');
  await avanzarPaso(p); // → paso 6

  // Paso 6 — Tiempo de experiencia (tiempoTotalAnos/Meses son required)
  await p.$eval('#tiempoTotalAnos', el => { el.value = '3'; });
  await p.$eval('#tiempoTotalMeses', el => { el.value = '0'; });
  await avanzarPaso(p); // → paso 7
}

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('🌐 Browser E2E — FUHV Wizard', () => {

  describe('Carga inicial', () => {
    test('la página carga con el título correcto', async () => {
      const title = await page.title();
      expect(title).toContain('FUHV');
    });

    test('el paso 1 está activo al inicio', async () => {
      const step = await pasoActual(page);
      expect(step).toBe(1);
    });

    test('el botón Anterior está oculto en paso 1', async () => {
      const display = await page.$eval('#prevBtn', el => el.style.display);
      expect(display).toBe('none');
    });

    test('el botón Siguiente está visible en paso 1', async () => {
      const display = await page.$eval('#nextBtn', el => el.style.display);
      expect(display).not.toBe('none');
    });

    test('el botón Generar está oculto hasta el paso 7', async () => {
      const display = await page.$eval('#submitBtn', el => el.style.display);
      expect(display).toBe('none');
    });

    test('se crea automáticamente un bloque de formación académica', async () => {
      const cards = await page.$$('#formacionContainer .section-card');
      expect(cards.length).toBeGreaterThanOrEqual(1);
    });

    test('el indicador de borrador existe en el DOM', async () => {
      const el = await page.$('#draftStatus');
      expect(el).not.toBeNull();
    });
  });

  describe('Navegación entre pasos', () => {
    test('no avanza al paso 2 si faltan campos requeridos del paso 1', async () => {
      await scrollAndClick(page, '#nextBtn');
      await wait(400);
      const step = await pasoActual(page);
      expect(step).toBe(1);
    });

    test('avanza al paso 2 tras llenar correctamente el paso 1', async () => {
      await llenarPaso1(page);
      await avanzarPaso(page);
      expect(await pasoActual(page)).toBe(2);
    });

    test('el botón Anterior aparece desde el paso 2', async () => {
      await llenarPaso1(page);
      await avanzarPaso(page);
      const display = await page.$eval('#prevBtn', el => el.style.display);
      expect(display).not.toBe('none');
    });

    test('retrocede al paso 1 con el botón Anterior', async () => {
      await llenarPaso1(page);
      await avanzarPaso(page);
      await scrollAndClick(page, '#prevBtn');
      await wait(400);
      expect(await pasoActual(page)).toBe(1);
    });

    test('la barra de progreso tiene valor positivo al avanzar', async () => {
      // Nota: updateProgress() solo se llama al cambiar de paso, no en la carga inicial
      await llenarPaso1(page);
      await avanzarPaso(page);
      const width = await page.$eval('#progressBar', el => el.style.width);
      expect(parseFloat(width)).toBeGreaterThan(0);
    });

    test('la barra de progreso crece al avanzar más pasos', async () => {
      await llenarPaso1(page);
      await avanzarPaso(page); // paso 2
      const width2 = parseFloat(await page.$eval('#progressBar', el => el.style.width));

      await page.select('#gradoAprobado', '11');
      await avanzarPaso(page); // paso 3
      const width3 = parseFloat(await page.$eval('#progressBar', el => el.style.width));

      expect(width3).toBeGreaterThan(width2);
    });
  });

  describe('Paso 1 — Datos Personales', () => {
    test('campos requeridos están marcados con *', async () => {
      const labels = await page.$$eval(
        '.form-step[data-step="1"] label',
        els => els.map(el => el.textContent).filter(t => t.includes('*'))
      );
      expect(labels.length).toBeGreaterThan(0);
    });

    test('nextBtn es type=button (no activa validación HTML5 de email)', async () => {
      // El botón "Siguiente" es type="button", por lo que la validación
      // HTML5 del input type="email" no se activa. El validador JS solo
      // verifica campos vacíos (required). Un email con texto pero formato
      // inválido pasa la validación del wizard (se valida en el servidor).
      const type = await page.$eval('#nextBtn', el => el.type);
      expect(type).toBe('button');
    });

    test('los campos vacíos se marcan con borde rojo al intentar avanzar', async () => {
      await scrollAndClick(page, '#nextBtn');
      await wait(400);
      const borderColor = await page.$eval('#primerApellido', el => el.style.borderColor);
      expect(borderColor).toBe('rgb(244, 67, 54)'); // #f44336
    });
  });

  describe('Paso 3 — Formación Académica', () => {
    test('el botón Agregar Formación añade un nuevo bloque', async () => {
      await llenarPaso1(page);
      await avanzarPaso(page);
      await page.select('#gradoAprobado', '11');
      await avanzarPaso(page);

      const antes = await page.$$eval('#formacionContainer .section-card', els => els.length);
      await scrollAndClick(page, 'button[onclick="addFormacion()"]');
      await wait(200);
      const despues = await page.$$eval('#formacionContainer .section-card', els => els.length);

      expect(despues).toBe(antes + 1);
    });

    test('no avanza si la formación tiene campos requeridos vacíos', async () => {
      await llenarPaso1(page);
      await avanzarPaso(page);
      await page.select('#gradoAprobado', '11');
      await avanzarPaso(page); // ahora en paso 3

      // NO llenamos la formación — intentar avanzar
      await avanzarPaso(page);
      expect(await pasoActual(page)).toBe(3);
    });

    test('avanza al paso 4 tras llenar correctamente la formación', async () => {
      await llenarPaso1(page);
      await avanzarPaso(page);
      await page.select('#gradoAprobado', '11');
      await avanzarPaso(page);

      await llenarFormacion1(page);
      await avanzarPaso(page);
      expect(await pasoActual(page)).toBe(4);
    });
  });

  describe('Paso 4 — Idiomas', () => {
    test('el botón Agregar Idioma añade un nuevo bloque', async () => {
      await llenarPaso1(page);
      await avanzarPaso(page);
      await page.select('#gradoAprobado', '11');
      await avanzarPaso(page);
      await llenarFormacion1(page);
      await avanzarPaso(page); // → paso 4

      const antes = await page.$$eval('#idiomasContainer .section-card', els => els.length);
      await scrollAndClick(page, 'button[onclick="addIdioma()"]');
      await wait(200);
      const despues = await page.$$eval('#idiomasContainer .section-card', els => els.length);

      expect(despues).toBe(antes + 1);
    });
  });

  describe('Paso 7 — Declaración y Envío', () => {
    test('llega al paso 7 correctamente', async () => {
      await navegarHastaPaso7(page);
      expect(await pasoActual(page)).toBe(7);
    });

    test('el botón Generar aparece en el paso 7', async () => {
      await navegarHastaPaso7(page);
      const display = await page.$eval('#submitBtn', el => el.style.display);
      expect(display).not.toBe('none');
    });

    test('el botón Siguiente desaparece en el paso 7', async () => {
      await navegarHastaPaso7(page);
      const display = await page.$eval('#nextBtn', el => el.style.display);
      expect(display).toBe('none');
    });

    test('no envía si no se acepta la declaración juramentada', async () => {
      await navegarHastaPaso7(page);
      await page.type('#lugarDiligenciamiento', 'Bogota DC');
      // No marcar #aceptaDeclaracion — checkbox required
      await scrollAndClick(page, '#submitBtn');
      await wait(500);
      const loaderVisible = await page.$eval('#loadingOverlay', el => el.style.display !== 'none');
      expect(loaderVisible).toBe(false);
    });
  });

  describe('🗄️ LocalStorage — Borrador', () => {
    test('guarda borrador en localStorage al escribir', async () => {
      await page.type('#primerApellido', 'Prueba');
      await wait(2000); // debounce = 1.5s
      const raw = await page.evaluate(() => localStorage.getItem('fuhv_borrador'));
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw);
      expect(parsed.primerApellido).toBe('Prueba');
    });
  });
});
