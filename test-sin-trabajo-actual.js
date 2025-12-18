const { fillFUHVPDF } = require('./server/pdf-filler');
const fs = require('fs').promises;

// Test: Persona SIN trabajo actual (primera experiencia vacía)
const testData = {
  // Datos personales
  primerApellido: 'GARCÍA',
  segundoApellido: 'MARTÍNEZ',
  primerNombre: 'JUAN',
  segundoNombre: 'CARLOS',

  tipoDocumento: 'PA',
  numeroDocumento: '1234567890',
  sexo: 'F',
  nacionalidad: 'Venezuela',
  paisNacimiento: 'Venezuela',

  libretaMilitar: 'Segunda',
  numeroLibreta: '12345678',

  fechaNacimiento: '15/03/1990',
  departamentoNacimiento: 'Cundinamarca',
  municipioNacimiento: 'Bogotá D.C.',

  // Dirección de correspondencia
  paisResidencia: 'Colombia',
  departamentoResidencia: 'Cundinamarca',
  municipioResidencia: 'Bogotá D.C.',
  direccion: 'Calle 123 # 45-67 Apto 801',
  telefono: '3001234567',
  email: 'juan.garcia@email.com',

  // Educación básica
  gradoAprobado: '11',
  tituloBasico: 'Bachiller Académico',
  fechaDeGrado: '03/2000',

  // Formación académica superior
  formacionAcademica: [
    {
      modalidad: 'UN',
      semestres: '10',
      graduado: 'SI',
      titulo: 'Ingeniero de Sistemas',
      mesTerminacion: '12',
      anoTerminacion: '2012',
      tarjetaProfesional: 'IS-12345'
    }
  ],

  // Idiomas
  idiomas: [
    {
      idioma: 'Inglés',
      habla: 'R',
      lee: 'B',
      escribe: 'B'
    }
  ],

  // Experiencia laboral
  // PRIMERA EXPERIENCIA VACÍA = NO tiene trabajo actual
  experienciaLaboral: [
    // ===== TRABAJO ACTUAL = VACÍO (no tiene empleo actual) =====
    {
      empresa: '',
      tipo: '',
      pais: '',
      departamento: '',
      municipio: '',
      emailEntidad: '',
      telefono: '',
      fechaIngreso: '',
      fechaRetiro: '',
      cargo: '',
      dependencia: '',
      direccion: ''
    },

    // ===== EXPERIENCIAS ANTERIORES =====
    {
      empresa: 'Ministerio de Educación',
      tipo: 'Publica',
      pais: 'Colombia',
      departamento: 'Cundinamarca',
      municipio: 'Bogotá D.C.',
      emailEntidad: 'contacto@mineducacion.gov.co',
      telefono: '6013334455',
      fechaIngreso: '01/02/2018',
      fechaRetiro: '30/11/2022',
      cargo: 'Coordinador TI',
      dependencia: 'Tecnología',
      direccion: 'Calle 43 # 57-14'
    },
    {
      empresa: 'Empresa XYZ S.A.S.',
      tipo: 'Privada',
      pais: 'Colombia',
      departamento: 'Cundinamarca',
      municipio: 'Bogotá D.C.',
      emailEntidad: 'info@xyz.com',
      telefono: '6017778899',
      fechaIngreso: '15/06/2015',
      fechaRetiro: '31/01/2018',
      cargo: 'Desarrollador',
      dependencia: 'Desarrollo',
      direccion: 'Av 19 # 100-50'
    },
    {
      empresa: 'Empresa XYZ S.A.S.',
      tipo: 'Privada',
      pais: 'Colombia',
      departamento: 'Cundinamarca',
      municipio: 'Bogotá D.C.',
      emailEntidad: 'info@xyz.com',
      telefono: '6017778899',
      fechaIngreso: '15/06/2015',
      fechaRetiro: '31/01/2018',
      cargo: 'Desarrollador',
      dependencia: 'Desarrollo',
      direccion: 'Av 19 # 100-50'
    },
    {
      empresa: 'Empresa XYZ S.A.S.',
      tipo: 'Privada',
      pais: 'Colombia',
      departamento: 'Cundinamarca',
      municipio: 'Bogotá D.C.',
      emailEntidad: 'info@xyz.com',
      telefono: '6017778899',
      fechaIngreso: '15/06/2015',
      fechaRetiro: '31/01/2018',
      cargo: 'Desarrollador',
      dependencia: 'Desarrollo',
      direccion: 'Av 19 # 100-50'
    }
  ],

  // Tiempo de experiencia
  tiempoExperiencia: {
    servidorPublico: {
      anos: '4',
      meses: '10'
    },
    sectorPrivado: {
      anos: '2',
      meses: '8'
    },
    independiente: {
      anos: '0',
      meses: '0'
    },
    total: {
      anos: '7',
      meses: '6'
    }
  },

  // Declaración
  aceptaDeclaracion: false,
};

async function generarPDFPrueba() {
  try {
    console.log('\n==============================================');
    console.log('  TEST: SIN TRABAJO ACTUAL');
    console.log('  (Primera experiencia vacía - debe quedar en blanco)');
    console.log('==============================================\n');

    const pdfBuffer = await fillFUHVPDF(testData);

    await fs.writeFile('FUHV_SIN_TRABAJO_ACTUAL.pdf', pdfBuffer);

    console.log('\n✓ PDF generado exitosamente: FUHV_SIN_TRABAJO_ACTUAL.pdf');
    console.log('\nVerifica que:');
    console.log('  1. La primera sección de experiencia está VACÍA');
    console.log('  2. Las experiencias anteriores están en las posiciones 2 y 3');
    console.log('==============================================\n');

  } catch (error) {
    console.error('\n✗ Error generando PDF:', error);
    process.exit(1);
  }
}

generarPDFPrueba();
