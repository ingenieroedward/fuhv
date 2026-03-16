const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');
const { fillFUHVPDF } = require('./pdf-filler');

const app = express();
const PORT = process.env.PORT || 3002;

// ── Rate Limiting (deshabilitado en entorno de test) ───────────────────────────
const isTest = process.env.NODE_ENV === 'test';
const pdfLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isTest ? 1000 : 10,  // sin límite efectivo en tests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiadas solicitudes',
    message: 'Has superado el límite de generación de PDFs. Intenta de nuevo en 15 minutos.'
  }
});

// ── Esquema de Validación Joi ──────────────────────────────────────────────────
const formacionSchema = Joi.object({
  modalidad: Joi.string().valid('TC', 'TL', 'TE', 'UN', 'ES', 'MG', 'DOC').required(),
  semestres: Joi.string().allow('', null),
  graduado: Joi.string().valid('SI', 'NO').allow('', null),
  titulo: Joi.string().max(200).allow('', null),
  mesTerminacion: Joi.string().allow('', null),
  anoTerminacion: Joi.string().pattern(/^\d{0,4}$/).allow('', null),
  tarjetaProfesional: Joi.string().max(50).allow('', null)
});

const idiomaSchema = Joi.object({
  idioma: Joi.string().max(50).required(),
  habla: Joi.string().valid('R', 'B', 'MB').allow('', null),
  lee: Joi.string().valid('R', 'B', 'MB').allow('', null),
  escribe: Joi.string().valid('R', 'B', 'MB').allow('', null)
});

const experienciaSchema = Joi.object({
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
});

const fuhvSchema = Joi.object({
  // Datos personales
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
  // Educación básica
  gradoAprobado: Joi.string().allow('', null),
  tituloBasico: Joi.string().max(200).allow('', null),
  fechaDeGrado: Joi.string().allow('', null),
  // Secciones dinámicas
  formacionAcademica: Joi.array().items(formacionSchema).max(10),
  idiomas: Joi.array().items(idiomaSchema).max(10),
  experienciaLaboral: Joi.array().items(experienciaSchema).max(20),
  // Tiempo de experiencia
  tiempoExperiencia: Joi.object({
    servidorPublico: Joi.object({ anos: Joi.string().allow('', null), meses: Joi.string().allow('', null) }),
    sectorPrivado: Joi.object({ anos: Joi.string().allow('', null), meses: Joi.string().allow('', null) }),
    independiente: Joi.object({ anos: Joi.string().allow('', null), meses: Joi.string().allow('', null) }),
    total: Joi.object({ anos: Joi.string().allow('', null), meses: Joi.string().allow('', null) })
  }).allow(null),
  // Declaración
  lugarDiligenciamiento: Joi.string().max(100).allow('', null),
  fechaDiligenciamiento: Joi.string().allow('', null),
  aceptaDeclaracion: Joi.boolean()
});

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// ── Endpoint para generar PDF ──────────────────────────────────────────────────
app.post('/generate-pdf', pdfLimiter, async (req, res) => {
  try {
    // Validar esquema
    const { error, value: formData } = fuhvSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const detalles = error.details.map(d => d.message);
      console.warn('Validación fallida:', detalles);
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles
      });
    }

    console.log(`[${new Date().toISOString()}] Generando PDF para: ${formData.primerNombre} ${formData.primerApellido}`);

    const pdfBuffer = await fillFUHVPDF(formData);

    // Nombre ASCII-safe para header HTTP + versión UTF-8 para clientes modernos
    const nombreRaw = `FUHV_${formData.primerApellido}_${formData.primerNombre}.pdf`.replace(/\s+/g, '_');
    const nombreAscii = nombreRaw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const nombreEncoded = encodeURIComponent(nombreRaw);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreAscii}"; filename*=UTF-8''${nombreEncoded}`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer, 'binary');

    console.log(`[${new Date().toISOString()}] PDF generado exitosamente: ${nombreAscii}`);

  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({
      error: 'Error interno al generar el PDF',
      message: error.message
    });
  }
});

// ── Ruta de verificación ───────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente', timestamp: new Date().toISOString() });
});

// ── Exportar app (para tests) ──────────────────────────────────────────────────
module.exports = app;

// ── Iniciar servidor (solo si se ejecuta directamente) ─────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n==============================================`);
    console.log(`  FUHV Generator - Servidor iniciado`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log(`==============================================\n`);
  });
}
