const { fillFUHVPDF } = require('./server/pdf-filler');
const fs = require('fs').promises;

// Datos de prueba completos
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
  fechaDeGrado:"03/2000",

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
    },
    {
      modalidad: 'UN',
      semestres: '10',
      graduado: 'SI',
      titulo: 'Ingeniero de Sistemas',
      mesTerminacion: '12',
      anoTerminacion: '2012',
      tarjetaProfesional: 'IS-12345'
    },
    {
      modalidad: 'UN',
      semestres: '10',
      graduado: 'SI',
      titulo: 'Ingeniero de Sistemas',
      mesTerminacion: '12',
      anoTerminacion: '2012',
      tarjetaProfesional: 'IS-12345'
    },
    {
      modalidad: 'ES',
      semestres: '4',
      graduado: 'SI',
      titulo: 'Especialista en Gerencia de Proyectos',
      mesTerminacion: '06',
      anoTerminacion: '2015',
      tarjetaProfesional: ''
    }
  ],

  // Idiomas
  idiomas: [
    {
      idioma: 'Inglés',
      habla: 'R',
      lee: 'R',
      escribe: 'B'
    },
    {
      idioma: 'Francés',
      habla: 'B',
      lee: 'MB',
      escribe: 'MB'
    }
  ],

  // Experiencia laboral
  // IMPORTANTE: La primera experiencia es SOLO para trabajo actual
  // Si no está empleado, dejar la primera entrada vacía o con campos en blanco
  experienciaLaboral: [
    // ===== TRABAJO ACTUAL (primera posición) =====
    // Para probar SIN trabajo actual, cambiar a: { empresa: '', cargo: '', fechaIngreso: '' }
    {
      empresa: 'Ministerio de las TIC',
      tipo: 'Publica',
      pais: 'Colombia',
      departamento: 'Cundinamarca',
      municipio: 'Bogotá D.C.',
      emailEntidad: 'contacto@mintic.gov.co',
      telefono: '6012345678',
      fechaIngreso: '15/01/2020',
      fechaRetiro: '', // Vacío porque es empleo actual
      cargo: 'Desarrollador Senior',
      dependencia: 'Sistemas',
      direccion: 'Cra 7 # 12-34'
    },

    // ===== EXPERIENCIAS ANTERIORES (en orden cronológico inverso) =====
    {
      empresa: 'Empresa Privada ABC S.A.S.',
      tipo: 'Privada',
      pais: 'Colombia',
      departamento: 'Cundinamarca',
      municipio: 'Bogotá D.C.',
      emailEntidad: 'info@abc.com.co',
      telefono: '6019876543',
      fechaIngreso: '01/06/2017',
      fechaRetiro: '31/12/2019',
      cargo: 'Líder Técnico',
      dependencia: 'Desarrollo',
      direccion: 'Calle 100 # 20-30'
    },
    {
      empresa: 'Tech Solutions Ltda',
      tipo: 'Privada',
      pais: 'Colombia',
      departamento: 'Cundinamarca',
      municipio: 'Bogotá D.C.',
      emailEntidad: 'rrhh@techsolutions.com',
      telefono: '6015551234',
      fechaIngreso: '10/03/2015',
      fechaRetiro: '30/05/2017',
      cargo: 'Desarrollador Junior',
      dependencia: 'TI',
      direccion: 'Av 68 # 45-23'
    },
    {
      empresa: 'Tech Solutions Ltda',
      tipo: 'Privada',
      pais: 'Colombia',
      departamento: 'Cundinamarca',
      municipio: 'Bogotá D.C.',
      emailEntidad: 'rrhh@techsolutions.com',
      telefono: '6015551234',
      fechaIngreso: '10/03/2015',
      fechaRetiro: '30/05/2017',
      cargo: 'Desarrollador Junior',
      dependencia: 'TI',
      direccion: 'Av 68 # 45-23'
    },
    {
      empresa: 'Tech Solutions Ltda',
      tipo: 'Privada',
      pais: 'Colombia',
      departamento: 'Cundinamarca',
      municipio: 'Bogotá D.C.',
      emailEntidad: 'rrhh@techsolutions.com',
      telefono: '6015551234',
      fechaIngreso: '10/03/2015',
      fechaRetiro: '30/05/2017',
      cargo: 'Desarrollador Junior',
      dependencia: 'TI',
      direccion: 'Av 68 # 45-23'
    }
  ],

  // Tiempo de experiencia
  tiempoExperiencia: {
    servidorPublico: {
      anos: '3',
      meses: '11'
    },
    sectorPrivado: {
      anos: '8',
      meses: '0'
    },
    independiente: {
      anos: '0',
      meses: '0'
    },
    total: {
      anos: '11',
      meses: '11'
    }
  },

  // Declaración
  aceptaDeclaracion: false,
};

async function generarPDFPrueba() {
  try {
    console.log('\n==============================================');
    console.log('  Generando PDF de prueba con datos completos');
    console.log('==============================================\n');

    const pdfBuffer = await fillFUHVPDF(testData);

    await fs.writeFile('FUHV_PRUEBA_NUEVO.pdf', pdfBuffer);

    console.log('\n✓ PDF generado exitosamente: FUHV_PRUEBA_NUEVO.pdf');
    console.log('\nRevisa el archivo para verificar:');
    console.log('  1. Posicionamiento correcto de nombres y apellidos');
    console.log('  2. Checkboxes alineados (tipo documento, sexo, nacionalidad)');
    console.log('  3. Fecha de nacimiento en cuadrículas individuales');
    console.log('  4. Grados de educación marcados correctamente');
    console.log('  5. Tabla de formación académica alineada');
    console.log('  6. Idiomas con niveles R/B/MB correctos');
    console.log('  7. Experiencia laboral en página 2');
    console.log('  8. Tiempo de experiencia en página 3');
    console.log('==============================================\n');

  } catch (error) {
    console.error('\n✗ Error generando PDF:', error);
    process.exit(1);
  }
}

generarPDFPrueba();
