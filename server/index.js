const express = require('express');
const path = require('path');
const { fillFUHVPDF } = require('./pdf-filler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint para generar PDF
app.post('/generate-pdf', async (req, res) => {
  try {
    console.log('Generando PDF del FUHV usando plantilla original...');
    const formData = req.body;

    // Llenar el PDF original con los datos
    const pdfBuffer = await fillFUHVPDF(formData);

    // Enviar PDF como descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=FUHV.pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer, 'binary');

    console.log('PDF generado exitosamente usando plantilla original');

  } catch (error) {
    console.error('Error generando PDF:', error);

    res.status(500).json({
      error: 'Error al generar el PDF',
      message: error.message
    });
  }
});

// Ruta de verificación
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n==============================================`);
  console.log(`  FUHV Generator - Servidor iniciado`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`==============================================\n`);
});
