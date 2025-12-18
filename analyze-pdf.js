const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;

async function analizarPDF() {
  try {
    console.log('\n==============================================');
    console.log('  Analizando estructura del PDF original');
    console.log('==============================================\n');

    // Cargar PDF original
    const pdfBytes = await fs.readFile('formato-unico-de-hoja-de-vida-persona-natural.pdf');
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();

    console.log(`Total de páginas: ${pages.length}\n`);

    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      console.log(`Página ${index + 1}:`);
      console.log(`  Ancho: ${width.toFixed(2)} puntos`);
      console.log(`  Alto: ${height.toFixed(2)} puntos`);
      console.log(`  Formato: ${(width / 72).toFixed(2)}" x ${(height / 72).toFixed(2)}"`);
      console.log('');
    });

    // Verificar si tiene campos de formulario
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    console.log(`Campos de formulario: ${fields.length}`);

    if (fields.length > 0) {
      console.log('\nPrimeros 20 campos encontrados:');
      fields.slice(0, 20).forEach((field, index) => {
        const name = field.getName();
        console.log(`  ${index + 1}. ${name}`);
      });
    } else {
      console.log('\n⚠ El PDF no tiene campos de formulario predefinidos.');
      console.log('  Necesitamos colocar el texto manualmente usando coordenadas.');
    }

    console.log('\n==============================================');
    console.log('INFORMACIÓN IMPORTANTE PARA COORDENADAS:');
    console.log('==============================================');
    console.log('En PDF, el sistema de coordenadas:');
    console.log('  - Origen (0,0) está en la esquina INFERIOR IZQUIERDA');
    console.log('  - X aumenta hacia la DERECHA');
    console.log('  - Y aumenta hacia ARRIBA');
    console.log('');
    console.log('Para un PDF tamaño carta (8.5" x 11"):');
    console.log('  - Ancho: 612 puntos (8.5 x 72)');
    console.log('  - Alto: 792 puntos (11 x 72)');
    console.log('');
    console.log('Zonas aproximadas (Y):');
    console.log('  - Superior: 700-792');
    console.log('  - Media-Alta: 500-700');
    console.log('  - Media: 300-500');
    console.log('  - Media-Baja: 100-300');
    console.log('  - Inferior: 0-100');
    console.log('==============================================\n');

  } catch (error) {
    console.error('Error:', error);
  }
}

analizarPDF();
