const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

async function fillFUHVPDF(data) {
  try {
    // Cargar el PDF original
    const pdfPath = path.join(__dirname, '../formato-unico-de-hoja-de-vida-persona-natural.pdf');
    const existingPdfBytes = await fs.readFile(pdfPath);

    // Cargar el documento PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Cargar fuentes
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Obtener las páginas iniciales
    const pages = pdfDoc.getPages();
    const page1 = pages[0];
    const page2 = pages[1];
    let page3 = pages[2]; // page3 puede cambiar si se agregan páginas de experiencia

    // Configuración de tamaños de fuente
    const fontSize = 10;
    const smallFontSize = 9;
    const checkboxSize = 9;

    // Color del texto
    const textColor = rgb(0, 0, 0);

    // ============================================
    // PÁGINA 1 - DATOS PERSONALES Y FORMACIÓN
    // ============================================

    // SECCIÓN 1: DATOS PERSONALES

    // Fila 1: Apellidos y Nombres (ajuste fino basado en grid)
    if (data.primerApellido) {
      page1.drawText(data.primerApellido.toUpperCase().substring(0, 30), {
        x: 70, y: 600, size: fontSize, font, color: textColor
      });
    }

    if (data.segundoApellido) {
      page1.drawText(data.segundoApellido.toUpperCase().substring(0, 30), {
        x: 230, y: 600, size: fontSize, font, color: textColor
      });
    }

    const nombres = `${data.primerNombre || ''} ${data.segundoNombre || ''}`.trim();
    if (nombres) {
      page1.drawText(nombres.toUpperCase().substring(0, 30), {
        x: 400, y: 600, size: fontSize, font, color: textColor
      });
    }

    // Fila 2: Documento de Identificación (y: 575)
    // Checkboxes para tipo de documento
    if (data.tipoDocumento === 'CC') {
      page1.drawText('X', { x: 83, y: 574, size: checkboxSize, font: fontBold, color: textColor });
    } else if (data.tipoDocumento === 'CE') {
      page1.drawText('X', { x: 114, y: 574, size: checkboxSize, font: fontBold, color: textColor });
    } else if (data.tipoDocumento === 'PA') {
      page1.drawText('X', { x: 148, y: 574, size: checkboxSize, font: fontBold, color: textColor });
    }

    // Número de documento
    if (data.numeroDocumento) {
      page1.drawText(data.numeroDocumento.substring(0, 20), {
        x: 182, y: 574, size: fontSize, font, color: textColor
      });
    }

    // Sexo
    if (data.sexo === 'F') {
      page1.drawText('X', { x: 317, y: 574, size: checkboxSize, font: fontBold, color: textColor });
    } else if (data.sexo === 'M') {
      page1.drawText('X', { x: 342, y: 574, size: checkboxSize, font: fontBold, color: textColor });
    }

    // Nacionalidad
    if (data.nacionalidad && data.nacionalidad.toLowerCase().includes('colombiana')) {
      page1.drawText('X', { x: 385, y: 574, size: checkboxSize, font: fontBold, color: textColor });
    } else if (data.nacionalidad) {
      page1.drawText('X', { x: 457, y: 574, size: checkboxSize, font: fontBold, color: textColor });
    }

    // País
    if (data.paisNacimiento) {
      page1.drawText(data.paisNacimiento.substring(0, 15), {
        x: 475, y: 574, size: smallFontSize, font, color: textColor
      });
    }

    // Fila 3: Libreta Militar (y: 550)
    if (data.libretaMilitar === 'Primera') {
      page1.drawText('X', { x: 146, y: 543, size: checkboxSize, font: fontBold, color: textColor });
    } else if (data.libretaMilitar === 'Segunda') {
      page1.drawText('X', { x: 262, y: 543, size: checkboxSize, font: fontBold, color: textColor });
    }

    if (data.numeroLibreta) {
      page1.drawText(data.numeroLibreta.substring(0, 15), {
        x: 335, y: 543, size: fontSize, font, color: textColor
      });
    }

    // Sección: Fecha y Lugar de Nacimiento (cuadro izquierdo)
    // Fecha de nacimiento con cuadrículas individuales (y: 508)
    if (data.fechaNacimiento) {
      const partes = data.fechaNacimiento.split('/');
      if (partes.length === 3) {
        const [dia, mes, ano] = partes;

        // Día (2 dígitos)
        if (dia && dia.length >= 1) page1.drawText(dia[0], { x: 138, y: 508, size: fontSize, font, color: textColor });
        if (dia && dia.length >= 2) page1.drawText(dia[1], { x: 148, y: 508, size: fontSize, font, color: textColor });

        // Mes (2 dígitos)
        if (mes && mes.length >= 1) page1.drawText(mes[0], { x: 187, y: 508, size: fontSize, font, color: textColor });
        if (mes && mes.length >= 2) page1.drawText(mes[1], { x: 197, y: 508, size: fontSize, font, color: textColor });

        // Año (4 dígitos)
        if (ano && ano.length >= 1) page1.drawText(ano[0], { x: 237, y: 508, size: fontSize, font, color: textColor });
        if (ano && ano.length >= 2) page1.drawText(ano[1], { x: 247, y: 508, size: fontSize, font, color: textColor });
        if (ano && ano.length >= 3) page1.drawText(ano[2], { x: 257, y: 508, size: fontSize, font, color: textColor });
        if (ano && ano.length >= 4) page1.drawText(ano[3], { x: 267, y: 508, size: fontSize, font, color: textColor });
      }
    }

    // País de nacimiento
    if (data.paisNacimiento) {
      page1.drawText(data.paisNacimiento.substring(0, 20), {
        x: 120, y: 490, size: smallFontSize, font, color: textColor
      });
    }

    // Departamento de nacimiento
    if (data.departamentoNacimiento) {
      page1.drawText(data.departamentoNacimiento.substring(0, 20), {
        x: 120, y: 473, size: smallFontSize, font, color: textColor
      });
    }

    // Municipio de nacimiento
    if (data.municipioNacimiento) {
      page1.drawText(data.municipioNacimiento.substring(0, 20), {
        x: 120, y: 455, size: smallFontSize, font, color: textColor
      });
    }

    // Sección: Dirección de Correspondencia (cuadro derecho)
    // País de residencia
    if (data.paisResidencia) {
      page1.drawText(data.paisResidencia.substring(0, 15), {
        x: 320, y: 490, size: smallFontSize, font, color: textColor
      });
    }

    // Departamento de residencia
    if (data.departamentoResidencia) {
      page1.drawText(data.departamentoResidencia.substring(0, 25), {
        x: 475, y: 490, size: smallFontSize, font, color: textColor
      });
    }

    // Municipio de residencia
    if (data.municipioResidencia) {
      page1.drawText(data.municipioResidencia.substring(0, 35), {
        x: 350, y: 474, size: smallFontSize, font, color: textColor
      });
    }

    // Dirección
    if (data.direccion) {
      page1.drawText(data.direccion.substring(0, 40), {
        x: 298, y: 508, size: smallFontSize, font, color: textColor
      });
    }

    // Teléfono y Email (última fila de datos personales, y: 408)
    if (data.telefono) {
      page1.drawText(data.telefono.substring(0, 20), {
        x: 350, y: 455, size: smallFontSize, font, color: textColor
      });
    }

    if (data.email) {
      page1.drawText(data.email.substring(0, 40), {
        x: 470, y: 455, size: smallFontSize, font, color: textColor
      });
    }

    // SECCIÓN 2: FORMACIÓN ACADÉMICA

    // Educación Básica y Media - Checkboxes grados 1-11 (y: 365)
    if (data.gradoAprobado) {
      const grado = parseInt(data.gradoAprobado);
      const gradoPositions = [
        { x: 102 },  // 1o
        { x: 120 }, // 2o
        { x: 138 }, // 3o
        { x: 156 }, // 4o
        { x: 170 }, // 5o
        { x: 187 }, // 6o
        { x: 205 }, // 7o
        { x: 219 }, // 8o
        { x: 237 }, // 9o
        { x: 255 }, // 10
        { x: 272 }  // 11
      ];

      if (grado >= 1 && grado <= 11) {
        const pos = gradoPositions[grado - 1];
        page1.drawText('X', { x: pos.x, y: 320, size: checkboxSize, font: fontBold, color: textColor });
      }
    }

    //Fecha de graduacion
    if (data.fechaDeGrado) {
      const partes = data.fechaDeGrado.split('/');
      if (partes.length === 2) {
        const [mes, ano] = partes;

        // Mes (2 dígitos)
        if (mes && mes.length >= 1) page1.drawText(mes[0], { x: 351, y: 320, size: fontSize, font, color: textColor });
        if (mes && mes.length >= 2) page1.drawText(mes[1], { x: 361, y: 320, size: fontSize, font, color: textColor });

        // Año (4 dígitos)
        if (ano && ano.length >= 1) page1.drawText(ano[0], { x: 412, y: 320, size: fontSize, font, color: textColor });
        if (ano && ano.length >= 2) page1.drawText(ano[1], { x: 422, y: 320, size: fontSize, font, color: textColor });
        if (ano && ano.length >= 3) page1.drawText(ano[2], { x: 432, y: 320, size: fontSize, font, color: textColor });
        if (ano && ano.length >= 4) page1.drawText(ano[3], { x: 442, y: 320, size: fontSize, font, color: textColor });
      }
    }


    // Título básico
    if (data.tituloBasico) {
      page1.drawText(data.tituloBasico.substring(0, 30), {
        x: 365, y: 350, size: smallFontSize, font, color: textColor
      });
    }

    // Educación Superior - Tabla (y inicial ≈ 280, espaciado ≈ 28px por fila según grid)
    if (data.formacionAcademica && data.formacionAcademica.length > 0) {
      let yPos = 198;
      const lineHeight = 17;

      data.formacionAcademica.slice(0, 4).forEach((formacion, index) => {
        const y = yPos - (index * lineHeight);

        // Modalidad Académica
        if (formacion.modalidad) {
          page1.drawText(formacion.modalidad, {
            x: 75, y, size: smallFontSize, font, color: textColor
          });
        }

        // No. Semestres
        if (formacion.semestres) {
          page1.drawText(formacion.semestres.toString(), {
            x: 125, y, size: smallFontSize, font, color: textColor
          });
        }

        // Graduado SI/NO
        if (formacion.graduado) {
          page1.drawText("X", {
            x: 185, y, size: checkboxSize, font, color: textColor
          });
        }

        // Título obtenido
        if (formacion.titulo || formacion.programa) {
          const titulo = (formacion.titulo || formacion.programa).substring(0, 38);
          page1.drawText(titulo, {
            x: 230, y, size: smallFontSize, font, color: textColor
          });
        }

        // Mes terminación
        if (formacion.mesTerminacion) {
          page1.drawText(formacion.mesTerminacion, {
            x: 425, y, size: smallFontSize, font, color: textColor
          });
        }

        // Año terminación (dígitos separados)
        if (formacion.anoTerminacion) {
          const ano = formacion.anoTerminacion.toString();
          // Escribir cada dígito del año por separado
          if (ano.length >= 1) page1.drawText(ano[0], { x: 452, y, size: smallFontSize, font, color: textColor });
          if (ano.length >= 2) page1.drawText(ano[1], { x: 466, y, size: smallFontSize, font, color: textColor });
          if (ano.length >= 3) page1.drawText(ano[2], { x: 479, y, size: smallFontSize, font, color: textColor });
          if (ano.length >= 4) page1.drawText(ano[3], { x: 491, y, size: smallFontSize, font, color: textColor });
        }

        // Tarjeta profesional
        if (formacion.tarjetaProfesional) {
          page1.drawText(formacion.tarjetaProfesional.substring(0, 15), {
            x: 505, y, size: smallFontSize, font, color: textColor
          });
        }
      });
    }

    // Idiomas - Tabla (ajustado según grid)
    if (data.idiomas && data.idiomas.length > 0) {
      let yPos = 73;
      const lineHeight = 17;

      data.idiomas.slice(0, 3).forEach((idioma, index) => {
        const y = yPos - (index * lineHeight);

        // Nombre del idioma
        if (idioma.idioma) {
          page1.drawText(idioma.idioma.substring(0, 20), {
            x: 175, y, size: smallFontSize, font, color: textColor
          });
        }

        // Habla - R/B/MB
        const hablaX = { R: 305, B: 322, MB: 338 };
        if (idioma.habla && hablaX[idioma.habla]) {
          page1.drawText('X', { x: hablaX[idioma.habla], y, size: 7, font: fontBold, color: textColor });
        }

        // Lee - R/B/MB
        const leeX = { R: 355, B: 372, MB: 389 };
        if (idioma.lee && leeX[idioma.lee]) {
          page1.drawText('X', { x: leeX[idioma.lee], y, size: 7, font: fontBold, color: textColor });
        }

        // Escribe - R/B/MB
        const escribeX = { R: 407, B: 423, MB: 440 };
        if (idioma.escribe && escribeX[idioma.escribe]) {
          page1.drawText('X', { x: escribeX[idioma.escribe], y, size: 7, font: fontBold, color: textColor });
        }
      });
    }

    // ============================================
    // PÁGINA 2 - EXPERIENCIA LABORAL
    // ============================================

    if (data.experienciaLaboral && data.experienciaLaboral.length > 0) {
      const yPositions = [550, 420, 290, 160]; // Posiciones Y base para cada experiencia
      const experienciasPorPagina = 4;
      const totalExperiencias = data.experienciaLaboral.length;
      const paginasNecesarias = Math.ceil(totalExperiencias / experienciasPorPagina);

      // Si necesitamos más de 1 página, agregar páginas adicionales
      const paginasExperiencia = [page2]; // Primera página (índice 1)

      for (let i = 1; i < paginasNecesarias; i++) {
        // Copiar la página 2 original (página en blanco de experiencia)
        const [copiedPage] = await pdfDoc.copyPages(await PDFDocument.load(existingPdfBytes), [1]);
        // Insertar ANTES de la página 3 (que está en el índice 2 inicialmente)
        // Cada nueva página se inserta en la posición 1 + i para mantenerlas juntas
        pdfDoc.insertPage(1 + i, copiedPage);
        paginasExperiencia.push(copiedPage);
      }

      // Actualizar referencias de páginas si se agregaron nuevas
      const todasLasPaginas = pdfDoc.getPages();
      page3 = todasLasPaginas[todasLasPaginas.length - 1]; // La página 3 se movió al final

      // Procesar todas las experiencias, distribuyéndolas en las páginas necesarias
      data.experienciaLaboral.forEach((exp, globalIndex) => {
        // Verificar si es la primera experiencia (trabajo actual) y está vacía
        const esPrimeraExperiencia = globalIndex === 0;
        const experienciaVacia = !exp.empresa && !exp.cargo && !exp.fechaIngreso;

        // Si es la primera experiencia y está vacía, saltarla (dejar en blanco)
        if (esPrimeraExperiencia && experienciaVacia) {
          return;
        }

        const paginaIndex = Math.floor(globalIndex / experienciasPorPagina);
        const indexEnPagina = globalIndex % experienciasPorPagina;
        const paginaActual = paginasExperiencia[paginaIndex];
        const baseY = yPositions[indexEnPagina];

        // Empresa o entidad
        if (exp.empresa) {
          paginaActual.drawText(exp.empresa.substring(0, 35), {
            x: 60, y: baseY, size: smallFontSize, font, color: textColor
          });
        }

        // Tipo: Pública/Privada
        if (exp.tipo === 'Publica') {
          paginaActual.drawText('X', { x: 340, y: baseY, size: checkboxSize, font: fontBold, color: textColor });
        } else if (exp.tipo === 'Privada') {
          paginaActual.drawText('X', { x: 390, y: baseY, size: checkboxSize, font: fontBold, color: textColor });
        }

        // País
        if (exp.pais) {
          paginaActual.drawText(exp.pais.substring(0, 15), {
            x: 425, y: baseY, size: smallFontSize, font, color: textColor
          });
        }

        // Departamento, Municipio, Email (y - 25)
        if (exp.departamento) {
          paginaActual.drawText(exp.departamento.substring(0, 20), {
            x: 60, y: baseY - 30, size: smallFontSize, font, color: textColor
          });
        }

        if (exp.municipio) {
          paginaActual.drawText(exp.municipio.substring(0, 20), {
            x: 238, y: baseY - 30, size: smallFontSize, font, color: textColor
          });
        }

        if (exp.emailEntidad) {
          paginaActual.drawText(exp.emailEntidad.substring(0, 30), {
            x: 415, y: baseY - 30, size: smallFontSize, font, color: textColor
          });
        }

        // Teléfonos
        if (exp.telefonos || exp.telefono) {
          paginaActual.drawText((exp.telefonos || exp.telefono).substring(0, 20), {
            x: 60, y: baseY - 60, size: smallFontSize, font, color: textColor
          });
        }

        // Fecha de Ingreso con dígitos separados (DD/MM/AAAA)
        if (exp.fechaIngreso) {
          const partes = exp.fechaIngreso.split('/');
          if (partes.length === 3) {
            const [dia, mes, ano] = partes;
            const yFecha = baseY - 59;

            // Día (2 dígitos)
            if (dia && dia.length >= 1) paginaActual.drawText(dia[0], { x: 262, y: yFecha, size: smallFontSize, font, color: textColor });
            if (dia && dia.length >= 2) paginaActual.drawText(dia[1], { x: 272, y: yFecha, size: smallFontSize, font, color: textColor });

            // Mes (2 dígitos)
            if (mes && mes.length >= 1) paginaActual.drawText(mes[0], { x: 312, y: yFecha, size: smallFontSize, font, color: textColor });
            if (mes && mes.length >= 2) paginaActual.drawText(mes[1], { x: 322, y: yFecha, size: smallFontSize, font, color: textColor });

            // Año (4 dígitos)
            if (ano && ano.length >= 1) paginaActual.drawText(ano[0], { x: 358, y: yFecha, size: smallFontSize, font, color: textColor });
            if (ano && ano.length >= 2) paginaActual.drawText(ano[1], { x: 368, y: yFecha, size: smallFontSize, font, color: textColor });
            if (ano && ano.length >= 3) paginaActual.drawText(ano[2], { x: 378, y: yFecha, size: smallFontSize, font, color: textColor });
            if (ano && ano.length >= 4) paginaActual.drawText(ano[3], { x: 388, y: yFecha, size: smallFontSize, font, color: textColor });
          }
        }

        // Fecha de Retiro con dígitos separados (DD/MM/AAAA)
        if (exp.fechaRetiro) {
          const partes = exp.fechaRetiro.split('/');
          if (partes.length === 3) {
            const [dia, mes, ano] = partes;
            const yFecha = baseY - 59;

            // Día (2 dígitos)
            if (dia && dia.length >= 1) paginaActual.drawText(dia[0], { x: 428, y: yFecha, size: smallFontSize, font, color: textColor });
            if (dia && dia.length >= 2) paginaActual.drawText(dia[1], { x: 438, y: yFecha, size: smallFontSize, font, color: textColor });

            // Mes (2 dígitos)
            if (mes && mes.length >= 1) paginaActual.drawText(mes[0], { x: 478, y: yFecha, size: smallFontSize, font, color: textColor });
            if (mes && mes.length >= 2) paginaActual.drawText(mes[1], { x: 488, y: yFecha, size: smallFontSize, font, color: textColor });

            // Año (4 dígitos)
            if (ano && ano.length >= 1) paginaActual.drawText(ano[0], { x: 525, y: yFecha, size: smallFontSize, font, color: textColor });
            if (ano && ano.length >= 2) paginaActual.drawText(ano[1], { x: 535, y: yFecha, size: smallFontSize, font, color: textColor });
            if (ano && ano.length >= 3) paginaActual.drawText(ano[2], { x: 545, y: yFecha, size: smallFontSize, font, color: textColor });
            if (ano && ano.length >= 4) paginaActual.drawText(ano[3], { x: 555, y: yFecha, size: smallFontSize, font, color: textColor });
          }
        } 

        // Cargo, Dependencia, Dirección (y - 75)
        if (exp.cargo) {
          paginaActual.drawText(exp.cargo.substring(0, 25), {
            x: 60, y: baseY - 89, size: smallFontSize, font, color: textColor
          });
        }

        if (exp.dependencia) {
          paginaActual.drawText(exp.dependencia.substring(0, 20), {
            x: 240, y: baseY - 89, size: smallFontSize, font, color: textColor
          });
        }

        if (exp.direccion) {
          paginaActual.drawText(exp.direccion.substring(0, 25), {
            x: 415, y: baseY - 89, size: smallFontSize, font, color: textColor
          });
        }
      });
    }

    // ============================================
    // PÁGINA 3 - TIEMPO DE EXPERIENCIA Y FIRMA
    // ============================================

    // Tiempo Total de Experiencia - Página 3 (coordenadas precisas basadas en grid)
    if (data.tiempoExperiencia) {
      // Servidor público - primera fila (y: 605)
      if (data.tiempoExperiencia.servidorPublico) {
        page3.drawText(data.tiempoExperiencia.servidorPublico.anos || '0', {
          x: 390, y: 598, size: fontSize, font, color: textColor
        });
        page3.drawText(data.tiempoExperiencia.servidorPublico.meses || '0', {
          x: 460, y: 598, size: fontSize, font, color: textColor
        });
      }

      // Sector privado - segunda fila (y: 579)
      if (data.tiempoExperiencia.sectorPrivado) {
        page3.drawText(data.tiempoExperiencia.sectorPrivado.anos || '0', {
          x: 390, y: 570, size: fontSize, font, color: textColor
        });
        page3.drawText(data.tiempoExperiencia.sectorPrivado.meses || '0', {
          x: 460, y: 570, size: fontSize, font, color: textColor
        });
      }

      // Independiente - tercera fila (y: 553)
      if (data.tiempoExperiencia.independiente) {
        page3.drawText(data.tiempoExperiencia.independiente.anos || '0', {
          x: 390, y: 543, size: fontSize, font, color: textColor
        });
        page3.drawText(data.tiempoExperiencia.independiente.meses || '0', {
          x: 460, y: 543, size: fontSize, font, color: textColor
        });
      }

      // Total - cuarta fila (y: 527)
      if (data.tiempoExperiencia.total) {
        page3.drawText(data.tiempoExperiencia.total.anos || '0', {
          x: 390, y: 520, size: fontSize, font: fontBold, color: textColor
        });
        page3.drawText(data.tiempoExperiencia.total.meses || '0', {
          x: 460, y: 520, size: fontSize, font: fontBold, color: textColor
        });
      }
    }

    // Declaración - Checkbox SI/NO (y ≈ 490)
    if (data.aceptaDeclaracion) {
      page3.drawText('X', { x: 270, y: 420, size: checkboxSize, font: fontBold, color: textColor });
    } else {
      page3.drawText('X', { x: 302, y: 420, size: checkboxSize, font: fontBold, color: textColor });
    }
   
    // Serializar el PDF modificado
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;

  } catch (error) {
    console.error('Error al llenar el PDF:', error);
    throw error;
  }
}

module.exports = { fillFUHVPDF };
