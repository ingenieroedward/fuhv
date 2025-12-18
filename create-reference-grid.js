const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;

async function crearReferenciaGrid() {
  try {
    console.log('\n==============================================');
    console.log('  Creando PDF de referencia con grid');
    console.log('==============================================\n');

    // Cargar PDF original
    const pdfBytes = await fs.readFile('formato-unico-de-hoja-de-vida-persona-natural.pdf');
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const page1 = pages[0];

    const { width, height } = page1.getSize();

    // Colores semi-transparentes
    const gridColor = rgb(1, 0, 0); // Rojo para líneas de grid
    const labelColor = rgb(0, 0, 1); // Azul para etiquetas

    // Dibujar líneas horizontales cada 50 puntos
    console.log('Dibujando líneas horizontales...');
    for (let y = 0; y <= height; y += 50) {
      // Línea
      page1.drawLine({
        start: { x: 0, y },
        end: { x: width, y },
        thickness: 0.5,
        color: gridColor,
        opacity: 0.3
      });

      // Etiqueta Y
      if (y % 100 === 0) {
        page1.drawText(`Y:${y}`, {
          x: 5,
          y: y + 2,
          size: 8,
          font,
          color: labelColor,
          opacity: 0.7
        });
      }
    }

    // Dibujar líneas verticales cada 50 puntos
    console.log('Dibujando líneas verticales...');
    for (let x = 0; x <= width; x += 50) {
      // Línea
      page1.drawLine({
        start: { x, y: 0 },
        end: { x, y: height },
        thickness: 0.5,
        color: gridColor,
        opacity: 0.3
      });

      // Etiqueta X
      if (x % 100 === 0) {
        page1.drawText(`X:${x}`, {
          x: x + 2,
          y: height - 15,
          size: 8,
          font,
          color: labelColor,
          opacity: 0.7
        });
      }
    }

    // Marcar puntos clave de nuestras coordenadas
    const puntosImportantes = [
      // Página 1 - Apellidos y nombres
      { x: 90, y: 688, label: 'Apellido1' },
      { x: 265, y: 688, label: 'Apellido2' },
      { x: 450, y: 688, label: 'Nombres' },

      // Checkboxes documento
      { x: 108, y: 652, label: 'CC' },
      { x: 143, y: 652, label: 'CE' },
      { x: 178, y: 652, label: 'PA' },

      // Fecha de nacimiento
      { x: 118, y: 585, label: 'Día1' },
      { x: 132, y: 585, label: 'Día2' },

      // Educación - primer grado
      { x: 95, y: 420, label: '1o' },

      // Formación académica - primera fila
      { x: 95, y: 330, label: 'Modal' },
      { x: 160, y: 330, label: 'Sem' },

      // Idiomas - primera fila
      { x: 165, y: 200, label: 'Idioma' },
      { x: 370, y: 200, label: 'R' }
    ];

    console.log('Marcando puntos clave...');
    puntosImportantes.forEach(punto => {
      // Círculo pequeño
      page1.drawCircle({
        x: punto.x,
        y: punto.y,
        size: 3,
        color: rgb(0, 1, 0),
        opacity: 0.8
      });

      // Etiqueta
      page1.drawText(punto.label, {
        x: punto.x + 5,
        y: punto.y + 5,
        size: 6,
        font,
        color: rgb(0, 0.5, 0),
        opacity: 0.8
      });
    });

    const pdfBytesOut = await pdfDoc.save();
    await fs.writeFile('FUHV_GRID_REFERENCE.pdf', pdfBytesOut);

    console.log('\n✓ PDF de referencia creado: FUHV_GRID_REFERENCE.pdf');
    console.log('\nEste PDF muestra:');
    console.log('  - Grid rojo cada 50 puntos');
    console.log('  - Etiquetas de coordenadas en azul');
    console.log('  - Puntos verdes en coordenadas clave');
    console.log('\nÚsalo para verificar que las coordenadas sean correctas.');
    console.log('==============================================\n');

  } catch (error) {
    console.error('Error:', error);
  }
}

crearReferenciaGrid();
