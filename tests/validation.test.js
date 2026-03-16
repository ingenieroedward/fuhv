/**
 * Tests de validación del esquema Joi para el endpoint /generate-pdf
 */
const Joi = require('joi');

// ── Esquema (copia del servidor para tests unitarios) ──────────────────────────
const formacionSchema = Joi.object({
  modalidad: Joi.string().valid('TC', 'TL', 'TE', 'UN', 'ES', 'MG', 'DOC').required(),
  semestres: Joi.string().allow('', null),
  graduado: Joi.string().valid('SI', 'NO').allow('', null),
  titulo: Joi.string().max(200).allow('', null),
  mesTerminacion: Joi.string().allow('', null),
  anoTerminacion: Joi.string().pattern(/^\d{0,4}$/).allow('', null),
  tarjetaProfesional: Joi.string().max(50).allow('', null)
});

const fuhvSchema = Joi.object({
  primerApellido: Joi.string().max(50).required(),
  segundoApellido: Joi.string().max(50).allow('', null),
  primerNombre: Joi.string().max(50).required(),
  segundoNombre: Joi.string().max(50).allow('', null),
  tipoDocumento: Joi.string().valid('CC', 'CE', 'PA').required(),
  numeroDocumento: Joi.string().max(20).required(),
  sexo: Joi.string().valid('F', 'M').required(),
  nacionalidad: Joi.string().max(50).allow('', null),
  libretaMilitar: Joi.string().allow('', null),
  numeroLibreta: Joi.string().max(30).allow('', null),
  paisNacimiento: Joi.string().max(100).allow('', null),
  departamentoNacimiento: Joi.string().max(100).allow('', null),
  municipioNacimiento: Joi.string().max(100).allow('', null),
  fechaNacimiento: Joi.string().allow('', null),
  paisResidencia: Joi.string().max(100).allow('', null),
  departamentoResidencia: Joi.string().max(100).allow('', null),
  municipioResidencia: Joi.string().max(100).allow('', null),
  direccion: Joi.string().max(200).allow('', null),
  telefono: Joi.string().max(30).allow('', null),
  email: Joi.string().email({ tlds: { allow: false } }).allow('', null),
  gradoAprobado: Joi.string().allow('', null),
  tituloBasico: Joi.string().max(200).allow('', null),
  fechaDeGrado: Joi.string().allow('', null),
  formacionAcademica: Joi.array().items(formacionSchema).max(10),
  idiomas: Joi.array().items(Joi.object({
    idioma: Joi.string().max(50).required(),
    habla: Joi.string().valid('R', 'B', 'MB').allow('', null),
    lee: Joi.string().valid('R', 'B', 'MB').allow('', null),
    escribe: Joi.string().valid('R', 'B', 'MB').allow('', null)
  })).max(10),
  experienciaLaboral: Joi.array().items(Joi.object({
    empresa: Joi.string().max(200).required(),
    tipo: Joi.string().allow('', null),
    pais: Joi.string().max(100).allow('', null),
    departamento: Joi.string().max(100).allow('', null),
    municipio: Joi.string().max(100).allow('', null),
    emailEntidad: Joi.string().email({ tlds: { allow: false } }).allow('', null),
    telefonos: Joi.string().max(50).allow('', null),
    cargo: Joi.string().max(200).allow('', null),
    dependencia: Joi.string().max(200).allow('', null),
    direccion: Joi.string().max(200).allow('', null),
    fechaIngreso: Joi.string().allow('', null),
    fechaRetiro: Joi.string().allow('', null)
  })).max(20),
  tiempoExperiencia: Joi.object().allow(null),
  lugarDiligenciamiento: Joi.string().max(100).allow('', null),
  fechaDiligenciamiento: Joi.string().allow('', null),
  aceptaDeclaracion: Joi.boolean()
});

// ── Datos de prueba ────────────────────────────────────────────────────────────
const datosValidos = {
  primerApellido: 'Pérez',
  primerNombre: 'Juan',
  tipoDocumento: 'CC',
  numeroDocumento: '1234567890',
  sexo: 'M',
  email: 'juan@example.com',
  formacionAcademica: [],
  idiomas: [],
  experienciaLaboral: []
};

// ── Tests ──────────────────────────────────────────────────────────────────────
describe('Validación del esquema FUHV', () => {
  describe('Campos requeridos', () => {
    test('acepta datos mínimos válidos', () => {
      const { error } = fuhvSchema.validate(datosValidos);
      expect(error).toBeUndefined();
    });

    test('rechaza sin primerApellido', () => {
      const { primerApellido, ...sinApellido } = datosValidos;
      const { error } = fuhvSchema.validate(sinApellido);
      expect(error).toBeDefined();
      expect(error.message).toContain('primerApellido');
    });

    test('rechaza sin primerNombre', () => {
      const { primerNombre, ...sinNombre } = datosValidos;
      const { error } = fuhvSchema.validate(sinNombre);
      expect(error).toBeDefined();
    });

    test('rechaza tipoDocumento inválido', () => {
      const { error } = fuhvSchema.validate({ ...datosValidos, tipoDocumento: 'XX' });
      expect(error).toBeDefined();
      expect(error.message).toContain('tipoDocumento');
    });

    test('rechaza sexo inválido', () => {
      const { error } = fuhvSchema.validate({ ...datosValidos, sexo: 'X' });
      expect(error).toBeDefined();
    });
  });

  describe('Email', () => {
    test('acepta email válido', () => {
      const { error } = fuhvSchema.validate({ ...datosValidos, email: 'test@correo.com' });
      expect(error).toBeUndefined();
    });

    test('rechaza email malformado', () => {
      const { error } = fuhvSchema.validate({ ...datosValidos, email: 'no-es-email' });
      expect(error).toBeDefined();
    });

    test('acepta email vacío', () => {
      const { error } = fuhvSchema.validate({ ...datosValidos, email: '' });
      expect(error).toBeUndefined();
    });
  });

  describe('Formación Académica', () => {
    test('acepta formación válida con código corto (UN, ES, MG...)', () => {
      const { error } = fuhvSchema.validate({
        ...datosValidos,
        formacionAcademica: [{ modalidad: 'UN', titulo: 'Ingeniería de Sistemas', graduado: 'SI' }]
      });
      expect(error).toBeUndefined();
    });

    test('acepta todas las modalidades válidas', () => {
      for (const mod of ['TC', 'TL', 'TE', 'UN', 'ES', 'MG', 'DOC']) {
        const { error } = fuhvSchema.validate({
          ...datosValidos,
          formacionAcademica: [{ modalidad: mod }]
        });
        expect(error).toBeUndefined();
      }
    });

    test('rechaza modalidad inválida (nombre largo o desconocido)', () => {
      for (const mod of ['Profesional', 'Otro', 'UNIVERSITARIA']) {
        const { error } = fuhvSchema.validate({
          ...datosValidos,
          formacionAcademica: [{ modalidad: mod }]
        });
        expect(error).toBeDefined();
      }
    });

    test('rechaza más de 10 formaciones', () => {
      const muchasFormaciones = Array(11).fill({ modalidad: 'UN' });
      const { error } = fuhvSchema.validate({ ...datosValidos, formacionAcademica: muchasFormaciones });
      expect(error).toBeDefined();
    });
  });

  describe('Experiencia Laboral', () => {
    test('acepta experiencia válida', () => {
      const { error } = fuhvSchema.validate({
        ...datosValidos,
        experienciaLaboral: [{ empresa: 'ACME S.A.S', cargo: 'Desarrollador' }]
      });
      expect(error).toBeUndefined();
    });

    test('rechaza experiencia sin empresa', () => {
      const { error } = fuhvSchema.validate({
        ...datosValidos,
        experienciaLaboral: [{ cargo: 'Desarrollador' }]
      });
      expect(error).toBeDefined();
    });
  });

  describe('Idiomas', () => {
    test('acepta idioma válido', () => {
      const { error } = fuhvSchema.validate({
        ...datosValidos,
        idiomas: [{ idioma: 'Inglés', habla: 'MB', lee: 'B', escribe: 'R' }]
      });
      expect(error).toBeUndefined();
    });

    test('rechaza nivel de idioma inválido', () => {
      const { error } = fuhvSchema.validate({
        ...datosValidos,
        idiomas: [{ idioma: 'Inglés', habla: 'Excelente' }]
      });
      expect(error).toBeDefined();
    });
  });
});
