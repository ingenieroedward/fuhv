function generateFUHVTemplate(data) {
  const {
    // Datos personales
    primerApellido = '',
    segundoApellido = '',
    primerNombre = '',
    segundoNombre = '',
    tipoDocumento = '',
    numeroDocumento = '',
    sexo = '',
    nacionalidad = '',
    libretaMilitar = '',
    numeroLibreta = '',
    paisNacimiento = '',
    departamentoNacimiento = '',
    municipioNacimiento = '',
    fechaNacimiento = '',
    paisResidencia = '',
    departamentoResidencia = '',
    municipioResidencia = '',
    direccion = '',
    telefono = '',
    email = '',

    // Educación básica
    gradoAprobado = '',
    tituloBasico = '',
    fechaGradoBasico = '',

    // Formación académica superior
    formacionAcademica = [],

    // Idiomas
    idiomas = [],

    // Experiencia laboral
    experienciaLaboral = [],

    // Tiempo total experiencia
    tiempoExperiencia = {
      servidorPublico: { anos: '', meses: '' },
      sectorPrivado: { anos: '', meses: '' },
      independiente: { anos: '', meses: '' },
      total: { anos: '', meses: '' }
    },

    // Declaración
    lugarDiligenciamiento = '',
    fechaDiligenciamiento = '',
    aceptaDeclaracion = false
  } = data;

  // Función para crear checkboxes visuales
  const checkbox = (checked) => checked ? '☑' : '☐';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>FORMATO ÚNICO DE HOJA DE VIDA</title>
  <style>
    @page {
      size: Letter;
      margin: 1cm 1.5cm;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      line-height: 1.1;
      color: #000;
    }

    .page {
      width: 100%;
      page-break-after: always;
    }

    .page:last-child {
      page-break-after: auto;
    }

    /* ENCABEZADO */
    .header {
      border: 3px solid #000;
      border-radius: 20px;
      padding: 15px;
      margin-bottom: 15px;
      position: relative;
      min-height: 100px;
    }

    .escudo {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      width: 80px;
      text-align: center;
      font-size: 10pt;
      font-weight: bold;
    }

    .header-center {
      text-align: center;
      padding: 0 100px;
    }

    .header-center h1 {
      font-size: 16pt;
      font-weight: bold;
      margin-bottom: 3px;
    }

    .header-center h2 {
      font-size: 20pt;
      font-weight: bold;
      margin-bottom: 3px;
    }

    .header-center p {
      font-size: 9pt;
      margin-bottom: 2px;
    }

    .entidad-receptora {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 200px;
    }

    .entidad-receptora label {
      font-size: 7pt;
      font-style: italic;
      display: block;
      margin-bottom: 3px;
    }

    .entidad-receptora .box {
      border: 1px solid #000;
      height: 50px;
      background: white;
    }

    /* SECCIONES */
    .section {
      margin-bottom: 15px;
      page-break-inside: avoid;
    }

    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }

    .section-number {
      width: 24px;
      height: 24px;
      background: #000;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12pt;
      margin-right: 10px;
    }

    .section-title {
      background: #000;
      color: white;
      padding: 5px 15px;
      font-weight: bold;
      font-size: 9pt;
      border-radius: 15px;
      flex: 1;
    }

    /* TABLAS */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
    }

    table td, table th {
      border: 1px solid #000;
      padding: 3px 5px;
      vertical-align: middle;
    }

    table th {
      font-weight: bold;
      text-align: left;
      font-size: 7pt;
    }

    .label {
      font-size: 6.5pt;
      font-weight: bold;
      text-transform: uppercase;
    }

    .input-line {
      border-bottom: 1px solid #000;
      min-height: 16px;
      display: inline-block;
    }

    .small-box {
      display: inline-block;
      width: 15px;
      height: 15px;
      border: 1px solid #000;
      text-align: center;
      line-height: 15px;
      margin: 0 2px;
      font-size: 10pt;
    }

    .field-value {
      min-height: 18px;
      font-size: 8pt;
      padding: 2px;
    }

    /* EDUCACIÓN BÁSICA */
    .grados-container {
      display: flex;
      gap: 3px;
      margin: 5px 0;
    }

    .grado-box {
      flex: 1;
      border: 1px solid #000;
      text-align: center;
      padding: 8px 2px;
      font-size: 7pt;
      min-height: 35px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .grado-box.active {
      background: #000;
      color: white;
      font-weight: bold;
    }

    /* IDIOMAS */
    .idiomas-table {
      margin-top: 10px;
    }

    .idiomas-table td {
      text-align: center;
      font-size: 7pt;
    }

    .checkbox-group {
      display: inline-flex;
      gap: 5px;
      align-items: center;
    }

    /* FIRMA */
    .firma-section {
      margin-top: 30px;
      min-height: 80px;
    }

    .firma-line {
      border-top: 1px solid #000;
      margin-top: 50px;
      padding-top: 5px;
      text-align: center;
      font-size: 7pt;
      font-weight: bold;
    }

    /* FOOTER */
    .footer {
      text-align: center;
      font-size: 7pt;
      margin-top: 20px;
      font-weight: bold;
    }

    .instrucciones {
      font-size: 7pt;
      margin-bottom: 5px;
      line-height: 1.3;
    }

    .nota {
      font-size: 7pt;
      margin-top: 10px;
      font-weight: bold;
    }

    .page-number {
      position: fixed;
      bottom: 0.5cm;
      right: 1cm;
      font-size: 10pt;
      font-weight: bold;
    }
  </style>
</head>
<body>

  <!-- PÁGINA 1 -->
  <div class="page">
    <!-- ENCABEZADO -->
    <div class="header">
      <div class="escudo">
        <div style="font-size: 24pt;">🇨🇴</div>
        <div style="font-size: 7pt;">Libertad y Orden</div>
      </div>

      <div class="header-center">
        <h1>FORMATO ÚNICO</h1>
        <h2>HOJA DE VIDA</h2>
        <p><strong>Persona Natural</strong></p>
        <p style="font-size: 7pt;">(Leyes 190 de 1995, 489 y 443 de 1998)</p>
      </div>

      <div class="entidad-receptora">
        <label>ENTIDAD RECEPTORA</label>
        <div class="box"></div>
      </div>
    </div>

    <!-- SECCIÓN 1: DATOS PERSONALES -->
    <div class="section">
      <div class="section-header">
        <div class="section-number">1</div>
        <div class="section-title">DATOS PERSONALES</div>
      </div>

      <table>
        <tr>
          <td style="width: 33%;"><span class="label">PRIMER APELLIDO</span><div class="field-value">${primerApellido}</div></td>
          <td style="width: 33%;"><span class="label">SEGUNDO APELLIDO ( O DE CASADA )</span><div class="field-value">${segundoApellido}</div></td>
          <td style="width: 34%;"><span class="label">NOMBRES</span><div class="field-value">${primerNombre} ${segundoNombre}</div></td>
        </tr>
      </table>

      <table>
        <tr>
          <td colspan="2">
            <span class="label">DOCUMENTO DE IDENTIFICACIÓN</span><br>
            <div class="checkbox-group">
              C.C ${checkbox(tipoDocumento === 'CC')}
              C.E ${checkbox(tipoDocumento === 'CE')}
              PAS ${checkbox(tipoDocumento === 'PA')}
              No. <span style="border-bottom: 1px solid #000; display: inline-block; min-width: 150px; padding: 2px;">${numeroDocumento}</span>
            </div>
          </td>
          <td>
            <span class="label">SEXO</span><br>
            F ${checkbox(sexo === 'F')} M ${checkbox(sexo === 'M')}
          </td>
          <td colspan="2">
            <span class="label">NACIONALIDAD</span><br>
            COL. ${checkbox(nacionalidad === 'Colombiana')} EXTRANJERO ${checkbox(nacionalidad !== 'Colombiana')}
          </td>
          <td>
            <span class="label">PAÍS</span><br>
            <div class="field-value">${paisNacimiento}</div>
          </td>
        </tr>
      </table>

      <table>
        <tr>
          <td colspan="6">
            <span class="label">LIBRETA MILITAR</span><br>
            <div class="checkbox-group">
              PRIMERA CLASE ${checkbox(libretaMilitar === 'Primera')}
              SEGUNDA CLASE ${checkbox(libretaMilitar === 'Segunda')}
              NÚMERO <span style="border-bottom: 1px solid #000; display: inline-block; min-width: 100px; padding: 2px;">${numeroLibreta}</span>
              D.M <span style="border-bottom: 1px solid #000; display: inline-block; min-width: 80px; padding: 2px;"></span>
            </div>
          </td>
        </tr>
      </table>

      <table>
        <tr>
          <td style="width: 50%;" rowspan="4">
            <span class="label">FECHA Y LUGAR DE NACIMIENTO</span><br>
            <table style="margin-top: 5px;">
              <tr>
                <td style="width: 25%;"><span class="label">FECHA</span></td>
                <td>
                  DÍA <span class="small-box">${fechaNacimiento.split('/')[0] || ''}</span>
                  <span class="small-box">${fechaNacimiento.split('/')[0]?.[1] || ''}</span>
                  MES <span class="small-box">${fechaNacimiento.split('/')[1]?.[0] || ''}</span>
                  <span class="small-box">${fechaNacimiento.split('/')[1]?.[1] || ''}</span>
                  AÑO <span class="small-box">${fechaNacimiento.split('/')[2]?.[0] || ''}</span>
                  <span class="small-box">${fechaNacimiento.split('/')[2]?.[1] || ''}</span>
                  <span class="small-box">${fechaNacimiento.split('/')[2]?.[2] || ''}</span>
                  <span class="small-box">${fechaNacimiento.split('/')[2]?.[3] || ''}</span>
                </td>
              </tr>
              <tr>
                <td><span class="label">PAÍS</span></td>
                <td><div class="field-value">${paisNacimiento}</div></td>
              </tr>
              <tr>
                <td><span class="label">DEPTO</span></td>
                <td><div class="field-value">${departamentoNacimiento}</div></td>
              </tr>
              <tr>
                <td><span class="label">MUNICIPIO</span></td>
                <td><div class="field-value">${municipioNacimiento}</div></td>
              </tr>
            </table>
          </td>
          <td colspan="5">
            <span class="label">DIRECCIÓN DE CORRESPONDENCIA</span>
          </td>
        </tr>
        <tr>
          <td style="width: 25%;"><span class="label">PAÍS</span><div class="field-value">${paisResidencia}</div></td>
          <td colspan="4"><span class="label">DEPTO</span><div class="field-value">${departamentoResidencia}</div></td>
        </tr>
        <tr>
          <td colspan="5"><span class="label">MUNICIPIO</span><div class="field-value">${municipioResidencia}</div></td>
        </tr>
        <tr>
          <td colspan="5"><span class="label">DIRECCIÓN</span><div class="field-value">${direccion}</div></td>
        </tr>
      </table>

      <table>
        <tr>
          <td style="width: 40%;"><span class="label">TELÉFONO</span><div class="field-value">${telefono}</div></td>
          <td><span class="label">EMAIL</span><div class="field-value">${email}</div></td>
        </tr>
      </table>
    </div>

    <!-- SECCIÓN 2: FORMACIÓN ACADÉMICA -->
    <div class="section">
      <div class="section-header">
        <div class="section-number">2</div>
        <div class="section-title">FORMACIÓN ACADÉMICA</div>
      </div>

      <div class="instrucciones">
        <strong>EDUCACIÓN BÁSICA Y MEDIA</strong><br>
        MARQUE CON UNA X EL ÚLTIMO GRADO APROBADO ( LOS GRADOS DE 1o. A 6o. DE BACHILLERATO EQUIVALEN A LOS GRADOS 6o. A 11o. DE EDUCACIÓN BÁSICA SECUNDARIA Y MEDIA )
      </div>

      <div class="grados-container">
        ${[1,2,3,4,5,6,7,8,9,10,11].map(grado => `
          <div class="grado-box ${gradoAprobado == grado ? 'active' : ''}">
            ${grado}${grado === 10 ? 'o.' : grado === 11 ? '' : 'o.'}
          </div>
        `).join('')}
      </div>

      <table>
        <tr>
          <td colspan="3" style="background: #e0e0e0;"><span class="label">EDUCACIÓN BÁSICA</span></td>
          <td colspan="2"><span class="label">TÍTULO OBTENIDO:</span></td>
        </tr>
        <tr>
          <td style="text-align: center;"><span class="label">PRIMARIA</span></td>
          <td style="text-align: center;"><span class="label">SECUNDARIA</span></td>
          <td style="text-align: center;"><span class="label">MEDIA</span></td>
          <td colspan="2" rowspan="2">
            <div class="field-value">${tituloBasico}</div>
            <span class="label">FECHA DE GRADO</span><br>
            MES <span class="small-box"></span><span class="small-box"></span>
            AÑO <span class="small-box"></span><span class="small-box"></span><span class="small-box"></span><span class="small-box"></span>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">${checkbox(gradoAprobado <= 5)}</td>
          <td style="text-align: center;">${checkbox(gradoAprobado >= 6 && gradoAprobado <= 9)}</td>
          <td style="text-align: center;">${checkbox(gradoAprobado >= 10)}</td>
        </tr>
      </table>

      <div class="instrucciones" style="margin-top: 10px;">
        <strong>EDUCACION SUPERIOR (PREGRADO Y POSTGRADO)</strong><br>
        DILIGENCIE ESTE PUNTO EN ESTRICTO ORDEN CRONOLÓGICO, EN MODALIDAD ACADÉMICA ESCRIBA:<br>
        <strong>TC</strong> (TÉCNICA), <strong>TL</strong> (TECNOLÓGICA), <strong>TE</strong> (TECNOLÓGICA ESPECIALIZADA), <strong>UN</strong> (UNIVERSITARIA),<br>
        <strong>ES</strong> (ESPECIALIZACIÓN), <strong>MG</strong> (MAESTRÍA O MAGISTER), <strong>DOC</strong> (DOCTORADO O PHD),<br>
        RELACIONE AL FRENTE EL NÚMERO DE LA TARJETA PROFESIONAL (SI ÉSTA HA SIDO PREVISTA EN UNA LEY).
      </div>

      <table style="margin-top: 5px;">
        <tr>
          <th style="width: 8%;">MODALIDAD<br>ACADÉMICA</th>
          <th style="width: 10%;">No.SEMESTRES<br>APROBADOS</th>
          <th style="width: 8%;">GRADUADO<br>SI / NO</th>
          <th style="width: 40%;">NOMBRE DE LOS ESTUDIOS<br>O TÍTULO OBTENIDO</th>
          <th colspan="2" style="width: 15%;">TERMINACIÓN</th>
          <th style="width: 19%;">No. DE TARJETA<br>PROFESIONAL</th>
        </tr>
        <tr>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th>MES</th>
          <th>AÑO</th>
          <th></th>
        </tr>
        ${formacionAcademica.slice(0, 4).map(f => `
          <tr>
            <td style="text-align: center;">${f.modalidad || ''}</td>
            <td style="text-align: center;">${f.semestres || ''}</td>
            <td style="text-align: center;">${f.graduado || ''}</td>
            <td>${f.titulo || f.programa || ''}</td>
            <td style="text-align: center;">${f.mesTerminacion || ''}</td>
            <td style="text-align: center;">${f.anoTerminacion || ''}</td>
            <td style="text-align: center;">${f.tarjetaProfesional || ''}</td>
          </tr>
        `).join('')}
        ${Array(Math.max(0, 4 - formacionAcademica.length)).fill(0).map(() => `
          <tr>
            <td style="height: 25px;"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        `).join('')}
      </table>

      <div class="instrucciones" style="margin-top: 10px;">
        ESPECÍFIQUE LOS IDIOMAS DIFERENTES AL ESPAÑOL QUE: HABLA, LEE, ESCRIBE DE FORMA, REGULAR (R), BIEN (B) O MUY BIEN (MB)
      </div>

      <table class="idiomas-table">
        <tr>
          <th rowspan="2" style="width: 30%;">IDIOMA</th>
          <th colspan="3">LO HABLA</th>
          <th colspan="3">LO LEE</th>
          <th colspan="3">LO ESCRIBE</th>
        </tr>
        <tr>
          <th>R</th><th>B</th><th>MB</th>
          <th>R</th><th>B</th><th>MB</th>
          <th>R</th><th>B</th><th>MB</th>
        </tr>
        ${idiomas.slice(0, 3).map(i => `
          <tr>
            <td>${i.idioma || ''}</td>
            <td>${checkbox(i.habla === 'R')}</td>
            <td>${checkbox(i.habla === 'B')}</td>
            <td>${checkbox(i.habla === 'MB')}</td>
            <td>${checkbox(i.lee === 'R')}</td>
            <td>${checkbox(i.lee === 'B')}</td>
            <td>${checkbox(i.lee === 'MB')}</td>
            <td>${checkbox(i.escribe === 'R')}</td>
            <td>${checkbox(i.escribe === 'B')}</td>
            <td>${checkbox(i.escribe === 'MB')}</td>
          </tr>
        `).join('')}
        ${Array(Math.max(0, 3 - idiomas.length)).fill(0).map(() => `
          <tr>
            <td style="height: 25px;"></td>
            <td></td><td></td><td></td>
            <td></td><td></td><td></td>
            <td></td><td></td><td></td>
          </tr>
        `).join('')}
      </table>
    </div>

    <div class="page-number">1</div>
  </div>

  <!-- PÁGINA 2 -->
  <div class="page">
    <div style="text-align: center; margin-bottom: 15px;">
      <h1 style="font-size: 16pt;">FORMATO ÚNICO</h1>
      <h2 style="font-size: 20pt; margin: 0;">HOJA DE VIDA</h2>
      <p style="font-size: 9pt;"><strong>Persona Natural</strong></p>
      <p style="font-size: 7pt;">(Leyes 190 de 1995, 489 y 443 de 1998)</p>
    </div>

    <!-- SECCIÓN 3: EXPERIENCIA LABORAL -->
    <div class="section">
      <div class="section-header">
        <div class="section-number">3</div>
        <div class="section-title">EXPERIENCIA LABORAL</div>
      </div>

      <div class="instrucciones">
        RELACIONE SU EXPERIENCIA LABORAL O DE PRESTACIÓN DE SERVICIOS EN ESTRICTO ORDEN CRONOLÓGICO COMENZANDO POR EL ACTUAL.
      </div>

      ${experienciaLaboral.slice(0, 4).map((exp, index) => `
        <div style="margin-top: 10px;">
          <div style="background: #e0e0e0; padding: 3px 8px; font-weight: bold; font-size: 8pt; margin-bottom: 5px;">
            ${index === 0 ? 'EMPLEO ACTUAL O CONTRATO VIGENTE' : 'EMPLEO O CONTRATO ANTERIOR'}
          </div>

          <table>
            <tr>
              <td style="width: 40%;">
                <span class="label">EMPRESA O ENTIDAD</span>
                <div class="field-value">${exp.empresa || ''}</div>
              </td>
              <td style="width: 15%;">
                <span class="label">PÚBLICA</span><br>
                ${checkbox(exp.tipo === 'Publica')}
              </td>
              <td style="width: 15%;">
                <span class="label">PRIVADA</span><br>
                ${checkbox(exp.tipo === 'Privada')}
              </td>
              <td style="width: 30%;">
                <span class="label">PAÍS</span>
                <div class="field-value">${exp.pais || 'Colombia'}</div>
              </td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 33%;">
                <span class="label">DEPARTAMENTO</span>
                <div class="field-value">${exp.departamento || ''}</div>
              </td>
              <td style="width: 33%;">
                <span class="label">MUNICIPIO</span>
                <div class="field-value">${exp.municipio || ''}</div>
              </td>
              <td style="width: 34%;">
                <span class="label">CORREO ELECTRÓNICO ENTIDAD</span>
                <div class="field-value">${exp.emailEntidad || ''}</div>
              </td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 33%;">
                <span class="label">TELÉFONOS</span>
                <div class="field-value">${exp.telefonos || ''}</div>
              </td>
              <td style="width: 33%;">
                <span class="label">FECHA DE INGRESO</span><br>
                DÍA <span class="small-box"></span><span class="small-box"></span>
                MES <span class="small-box"></span><span class="small-box"></span>
                AÑO <span class="small-box"></span><span class="small-box"></span><span class="small-box"></span><span class="small-box"></span>
                <div class="field-value">${exp.fechaIngreso || ''}</div>
              </td>
              <td style="width: 34%;">
                <span class="label">FECHA DE RETIRO</span><br>
                DÍA <span class="small-box"></span><span class="small-box"></span>
                MES <span class="small-box"></span><span class="small-box"></span>
                AÑO <span class="small-box"></span><span class="small-box"></span><span class="small-box"></span><span class="small-box"></span>
                <div class="field-value">${exp.fechaRetiro || ''}</div>
              </td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 40%;">
                <span class="label">CARGO O CONTRATO${index === 0 ? ' ACTUAL' : ''}</span>
                <div class="field-value">${exp.cargo || ''}</div>
              </td>
              <td style="width: 30%;">
                <span class="label">DEPENDENCIA</span>
                <div class="field-value">${exp.dependencia || ''}</div>
              </td>
              <td style="width: 30%;">
                <span class="label">DIRECCIÓN</span>
                <div class="field-value">${exp.direccion || ''}</div>
              </td>
            </tr>
          </table>
        </div>
      `).join('')}

      ${Array(Math.max(0, 4 - experienciaLaboral.length)).fill(0).map((_, index) => `
        <div style="margin-top: 10px;">
          <div style="background: #e0e0e0; padding: 3px 8px; font-weight: bold; font-size: 8pt; margin-bottom: 5px;">
            EMPLEO O CONTRATO ANTERIOR
          </div>
          <table><tr><td style="height: 80px;"></td></tr></table>
        </div>
      `).join('')}

      <div class="nota">
        NOTA: SI REQUIERE ADICIONAR MAS EXPERIENCIA LABORAL, IMPRIMA NUEVAMENTE ESTA HOJA.
      </div>
    </div>

    <div class="page-number">2</div>
  </div>

  <!-- PÁGINA 3 -->
  <div class="page">
    <div style="text-align: center; margin-bottom: 15px;">
      <h1 style="font-size: 16pt;">FORMATO ÚNICO</h1>
      <h2 style="font-size: 20pt; margin: 0;">HOJA DE VIDA</h2>
      <p style="font-size: 9pt;"><strong>Persona Natural</strong></p>
      <p style="font-size: 7pt;">(Leyes 190 de 1995, 489 y 443 de 1998)</p>
    </div>

    <!-- SECCIÓN 4: TIEMPO TOTAL DE EXPERIENCIA -->
    <div class="section">
      <div class="section-header">
        <div class="section-number">4</div>
        <div class="section-title">TIEMPO TOTAL DE EXPERIENCIA</div>
      </div>

      <div class="instrucciones">
        INDIQUE EL TIEMPO TOTAL DE SU EXPERIENCIA LABORAL EN NÚMERO DE AÑOS Y MESES.
      </div>

      <table style="margin-top: 10px;">
        <tr>
          <th style="width: 60%;">OCUPACIÓN</th>
          <th colspan="2" style="text-align: center;">TIEMPO DE EXPERIENCIA</th>
        </tr>
        <tr>
          <th></th>
          <th style="width: 20%; text-align: center;">AÑOS</th>
          <th style="width: 20%; text-align: center;">MESES</th>
        </tr>
        <tr>
          <td>SERVIDOR PÚBLICO</td>
          <td style="text-align: center;"><div class="field-value">${tiempoExperiencia.servidorPublico?.anos || ''}</div></td>
          <td style="text-align: center;"><div class="field-value">${tiempoExperiencia.servidorPublico?.meses || ''}</div></td>
        </tr>
        <tr>
          <td>EMPLEADO DEL SECTOR PRIVADO</td>
          <td style="text-align: center;"><div class="field-value">${tiempoExperiencia.sectorPrivado?.anos || ''}</div></td>
          <td style="text-align: center;"><div class="field-value">${tiempoExperiencia.sectorPrivado?.meses || ''}</div></td>
        </tr>
        <tr>
          <td>TRABAJADOR INDEPENDIENTE</td>
          <td style="text-align: center;"><div class="field-value">${tiempoExperiencia.independiente?.anos || ''}</div></td>
          <td style="text-align: center;"><div class="field-value">${tiempoExperiencia.independiente?.meses || ''}</div></td>
        </tr>
        <tr>
          <td><strong>TOTAL TIEMPO EXPERIENCIA</strong></td>
          <td style="text-align: center;"><div class="field-value"><strong>${tiempoExperiencia.total?.anos || ''}</strong></div></td>
          <td style="text-align: center;"><div class="field-value"><strong>${tiempoExperiencia.total?.meses || ''}</strong></div></td>
        </tr>
      </table>
    </div>

    <!-- SECCIÓN 5: FIRMA DEL SERVIDOR PÚBLICO O CONTRATISTA -->
    <div class="section">
      <div class="section-header">
        <div class="section-number">5</div>
        <div class="section-title">FIRMA DEL SERVIDOR PÚBLICO O CONTRATISTA</div>
      </div>

      <div style="border: 1px solid #000; padding: 15px; margin-top: 10px; min-height: 150px;">
        <p style="margin-bottom: 10px; line-height: 1.4;">
          MANIFIESTO BAJO LA GRAVEDAD DEL JURAMENTO QUE
          ${checkbox(aceptaDeclaracion)} SI ${checkbox(!aceptaDeclaracion)} NO
          ME ENCUENTRO DENTRO DE LAS CAUSALES DE INHABILIDAD E INCOMPATIBILIDAD DEL ORDEN CONSTITUCIONAL O LEGAL,
          PARA EJERCER CARGOS EMPLEOS PÚBLICOS O PARA CELEBRAR CONTRATOS DE PRESTACIÓN DE SERVICIOS CON LA ADMINISTRACIÓN PÚBLICA.
        </p>

        <p style="margin-bottom: 15px; line-height: 1.4;">
          PARA TODOS LOS EFECTOS LEGALES, CERTIFICO QUE LOS DATOS POR MI ANOTADOS EN EL PRESENTE FORMATO ÚNICO DE HOJA DE VIDA, SON VERACES, (ARTÍCULO 5o. DE LA LEY 190/95).
        </p>

        <div style="margin-top: 10px;">
          <span class="label">Ciudad y fecha de diligenciamiento</span>
          <span style="border-bottom: 1px solid #000; display: inline-block; min-width: 400px; padding: 2px;">
            ${lugarDiligenciamiento}, ${fechaDiligenciamiento}
          </span>
        </div>

        <div class="firma-line">
          FIRMA DEL SERVIDOR PÚBLICO O CONTRATISTA
        </div>
      </div>
    </div>

    <!-- SECCIÓN 6: OBSERVACIONES DEL JEFE -->
    <div class="section">
      <div class="section-header">
        <div class="section-number">6</div>
        <div class="section-title">OBSERVACIONES DEL JEFE DE RECURSOS HUMANOS Y/O CONTRATOS</div>
      </div>

      <div style="border: 1px solid #000; padding: 10px; min-height: 100px; margin-top: 10px;">
        <!-- Espacio para observaciones -->
      </div>

      <p style="font-size: 7pt; margin-top: 10px; line-height: 1.4;">
        CERTIFICO QUE LA INFORMACIÓN AQUÍ SUMINISTRADA HA SIDO CONSTATADA FRENTE A LOS DOCUMENTOS QUE HAN SIDO PRESENTADOS COMO SOPORTE.
      </p>

      <table style="margin-top: 15px; border: none;">
        <tr>
          <td style="width: 50%; border: none; border-bottom: 1px solid #000; padding-bottom: 5px;">
            <span class="label">Ciudad y fecha</span>
          </td>
          <td style="width: 50%; border: none; border-bottom: 1px solid #000; padding-bottom: 5px;">
            <span class="label">NOMBRE Y FIRMA DEL JEFE DE PERSONAL O DE CONTRATOS</span>
          </td>
        </tr>
      </table>
    </div>

    <div class="footer">
      LINEA GRATUITA NACIONAL 01800917770 PÁGINA WEB: www.funcionpublica.gov.co
    </div>

    <div class="page-number">3</div>
  </div>

</body>
</html>
  `;
}

module.exports = { generateFUHVTemplate };
