/**
 * Tests E2E de API — endpoint /generate-pdf y /health
 * Usa supertest para hacer requests reales al servidor Express sin levantar un puerto.
 */
const request = require('supertest');
const app = require('../../server/index');

// ── Payload base válido ────────────────────────────────────────────────────────
const payloadValido = {
  primerApellido: 'García',
  segundoApellido: 'López',
  primerNombre: 'María',
  segundoNombre: 'José',
  tipoDocumento: 'CC',
  numeroDocumento: '52345678',
  sexo: 'F',
  nacionalidad: 'Colombiana',
  fechaNacimiento: '15/08/1990',
  paisNacimiento: 'Colombia',
  departamentoNacimiento: 'Cundinamarca',
  municipioNacimiento: 'Bogotá D.C.',
  paisResidencia: 'Colombia',
  departamentoResidencia: 'Cundinamarca',
  municipioResidencia: 'Bogotá D.C.',
  direccion: 'Calle 100 # 15-20 Apto 301',
  telefono: '6011234567',
  email: 'maria.garcia@example.com',
  gradoAprobado: '11',
  tituloBasico: 'Bachiller Académico',
  fechaDeGrado: '06/2008',
  formacionAcademica: [
    {
      modalidad: 'UN',
      titulo: 'Ingeniería de Sistemas',
      graduado: 'SI',
      mesTerminacion: '11',
      anoTerminacion: '2014',
      tarjetaProfesional: '12345-PRO'
    }
  ],
  idiomas: [
    { idioma: 'Inglés', habla: 'MB', lee: 'MB', escribe: 'B' }
  ],
  experienciaLaboral: [
    {
      empresa: 'Tech Solutions S.A.S',
      tipo: 'Privada',
      pais: 'Colombia',
      departamento: 'Cundinamarca',
      municipio: 'Bogotá D.C.',
      emailEntidad: 'rrhh@techsolutions.com',
      telefonos: '6019876543',
      cargo: 'Desarrolladora de Software',
      dependencia: 'Tecnología',
      direccion: 'Carrera 7 # 32-10',
      fechaIngreso: '01/2015',
      fechaRetiro: '12/2020'
    }
  ],
  tiempoExperiencia: {
    servidorPublico: { anos: '0', meses: '0' },
    sectorPrivado: { anos: '5', meses: '11' },
    independiente: { anos: '0', meses: '0' },
    total: { anos: '5', meses: '11' }
  },
  lugarDiligenciamiento: 'Bogotá D.C.',
  fechaDiligenciamiento: '2026-03-16',
  aceptaDeclaracion: true
};

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('GET /health', () => {
  test('retorna status OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('POST /generate-pdf', () => {
  describe('✅ Casos exitosos', () => {
    test('genera PDF con datos completos y retorna binario', async () => {
      const res = await request(app)
        .post('/generate-pdf')
        .send(payloadValido)
        .set('Content-Type', 'application/json');

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toMatch(/application\/pdf/);
      expect(res.headers['content-disposition']).toMatch(/attachment/);
      // Nombre ASCII en filename y UTF-8 en filename*
      expect(res.headers['content-disposition']).toContain('Garcia');
      expect(res.headers['content-disposition']).toContain('filename*=UTF-8');
      // Verificar que el buffer es un PDF real (magic bytes %PDF)
      expect(res.body.slice(0, 4).toString()).toBe('%PDF');
    }, 15000);

    test('el nombre del archivo incluye apellido y nombre', async () => {
      const res = await request(app)
        .post('/generate-pdf')
        .send(payloadValido);

      // filename ASCII + filename* con UTF-8 encoding
      expect(res.headers['content-disposition']).toContain('Garcia');
      expect(res.headers['content-disposition']).toContain('Maria');
      expect(res.headers['content-disposition']).toContain('filename*=UTF-8');
    }, 15000);

    test('genera PDF sin experiencia laboral (array vacío)', async () => {
      const payload = { ...payloadValido, experienciaLaboral: [] };
      const res = await request(app)
        .post('/generate-pdf')
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toMatch(/application\/pdf/);
    }, 15000);

    test('genera PDF sin idiomas', async () => {
      const payload = { ...payloadValido, idiomas: [] };
      const res = await request(app)
        .post('/generate-pdf')
        .send(payload);

      expect(res.statusCode).toBe(200);
    }, 15000);

    test('genera PDF con múltiple formación académica', async () => {
      const payload = {
        ...payloadValido,
        formacionAcademica: [
          { modalidad: 'UN', titulo: 'Ingeniería de Sistemas', graduado: 'SI' },
          { modalidad: 'ES', titulo: 'Gerencia de Proyectos', graduado: 'SI' },
          { modalidad: 'MG', titulo: 'MBA', graduado: 'NO' }
        ]
      };
      const res = await request(app)
        .post('/generate-pdf')
        .send(payload);

      expect(res.statusCode).toBe(200);
    }, 15000);

    test('strip de campos desconocidos (no falla con campos extra)', async () => {
      const payload = { ...payloadValido, campoDesconocido: 'valor', otroCampo: 123 };
      const res = await request(app)
        .post('/generate-pdf')
        .send(payload);

      expect(res.statusCode).toBe(200);
    }, 15000);
  });

  describe('❌ Validación — campos requeridos', () => {
    test('rechaza sin primerApellido', async () => {
      const { primerApellido, ...payload } = payloadValido;
      const res = await request(app).post('/generate-pdf').send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Datos inválidos');
      expect(res.body.detalles.some(d => d.includes('primerApellido'))).toBe(true);
    });

    test('rechaza sin primerNombre', async () => {
      const { primerNombre, ...payload } = payloadValido;
      const res = await request(app).post('/generate-pdf').send(payload);

      expect(res.statusCode).toBe(400);
    });

    test('rechaza sin numeroDocumento', async () => {
      const { numeroDocumento, ...payload } = payloadValido;
      const res = await request(app).post('/generate-pdf').send(payload);

      expect(res.statusCode).toBe(400);
    });

    test('rechaza tipoDocumento inválido (XX)', async () => {
      const res = await request(app)
        .post('/generate-pdf')
        .send({ ...payloadValido, tipoDocumento: 'XX' });

      expect(res.statusCode).toBe(400);
      expect(res.body.detalles.some(d => d.includes('tipoDocumento'))).toBe(true);
    });

    test('rechaza sexo inválido', async () => {
      const res = await request(app)
        .post('/generate-pdf')
        .send({ ...payloadValido, sexo: 'X' });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('❌ Validación — email', () => {
    test('rechaza email malformado', async () => {
      const res = await request(app)
        .post('/generate-pdf')
        .send({ ...payloadValido, email: 'no-es-email' });

      expect(res.statusCode).toBe(400);
    });

    test('acepta email vacío', async () => {
      const res = await request(app)
        .post('/generate-pdf')
        .send({ ...payloadValido, email: '' });

      expect(res.statusCode).toBe(200);
    }, 15000);
  });

  describe('❌ Validación — formación académica', () => {
    test('rechaza modalidad de formación inválida', async () => {
      const res = await request(app)
        .post('/generate-pdf')
        .send({
          ...payloadValido,
          formacionAcademica: [{ modalidad: 'Básica' }]
        });

      expect(res.statusCode).toBe(400);
    });

    test('rechaza más de 10 formaciones', async () => {
      const muchas = Array(11).fill({ modalidad: 'Profesional', titulo: 'Test' });
      const res = await request(app)
        .post('/generate-pdf')
        .send({ ...payloadValido, formacionAcademica: muchas });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('❌ Validación — body vacío / malformado', () => {
    test('rechaza body vacío', async () => {
      const res = await request(app)
        .post('/generate-pdf')
        .send({});

      expect(res.statusCode).toBe(400);
    });

    test('retorna JSON estructurado en errores', async () => {
      const res = await request(app)
        .post('/generate-pdf')
        .send({ tipoDocumento: 'INVALIDO' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body).toHaveProperty('detalles');
      expect(Array.isArray(res.body.detalles)).toBe(true);
    });
  });

  describe('🛡️ Rate Limiting', () => {
    test('headers de rate limit presentes en respuesta', async () => {
      const res = await request(app)
        .post('/generate-pdf')
        .send({});

      // Los headers RateLimit deben estar presentes (standardHeaders: true)
      expect(
        res.headers['ratelimit-limit'] || res.headers['x-ratelimit-limit']
      ).toBeDefined();
    });
  });
});
