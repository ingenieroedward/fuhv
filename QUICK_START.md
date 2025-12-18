# Inicio Rápido - Generador FUHV

## 3 Pasos para Empezar

### 1. Instalar Dependencias
```bash
npm install
```

Este comando instalará:
- Express (servidor web)
- Puppeteer (generación de PDFs)

**Nota:** La primera instalación puede tardar unos minutos porque Puppeteer descarga Chromium (~170MB).

### 2. Iniciar el Servidor
```bash
npm start
```

Verás este mensaje:
```
==============================================
  FUHV Generator - Servidor iniciado
  URL: http://localhost:3000
==============================================
```

### 3. Abrir en el Navegador

Abre tu navegador en: **http://localhost:3000**

¡Listo! Ya puedes comenzar a llenar tu Hoja de Vida.

---

## Guía Visual Rápida

### Paso 1: Datos Personales
- Completa nombre, documento, datos de nacimiento y residencia
- Todos los campos con asterisco (*) son obligatorios

### Paso 2: Formación Académica
- Ya hay un formulario de formación agregado
- Usa "+ Agregar Formación Académica" para más estudios
- Incluye desde primaria hasta posgrados

### Paso 3: Experiencia Laboral
- Haz clic en "+ Agregar Experiencia Laboral"
- Llena empresa, cargo, fechas y funciones
- Opcional si no tienes experiencia

### Paso 4: Idiomas
- Haz clic en "+ Agregar Idioma" si conoces otros idiomas
- Marca habilidades (habla, lee, escribe) y nivel
- Opcional

### Paso 5: Referencias
- Ya hay 2 referencias agregadas (mínimo requerido)
- Agrega más si lo deseas
- No puedes eliminar las primeras 2

### Paso 6: Declaración
- Lee la declaración juramentada
- Completa lugar y fecha de diligenciamiento
- Marca el checkbox de aceptación
- Haz clic en "Generar Hoja de Vida"

### Resultado
- Verás un mensaje de "Generando su Hoja de Vida..."
- El PDF se descargará automáticamente
- El nombre del archivo será: `FUHV_TuApellido_TuNombre.pdf`

---

## Consejos Útiles

### Fechas
- Usa el selector de calendario para fechas
- Formato automático: DD/MM/AAAA en el PDF

### Navegación
- Usa los botones "Anterior" y "Siguiente"
- No puedes avanzar si hay campos obligatorios vacíos
- Puedes volver atrás en cualquier momento

### Agregar/Eliminar Secciones
- Haz clic en "+ Agregar..." para nuevas secciones
- Usa el botón "Eliminar" en cada tarjeta para borrar
- Las referencias 1 y 2 no se pueden eliminar

### Si algo sale mal
- Revisa que todos los campos obligatorios estén llenos
- Verifica tu conexión a internet (primera vez)
- Mira la consola del navegador (F12) para errores
- Revisa los logs del servidor en la terminal

---

## Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm start

# Iniciar servidor (alternativa)
node server/index.js
```

---

## Estructura de Archivos

```
FUHV/
├── server/
│   ├── index.js           → Servidor Express
│   └── pdf-template.js    → Plantilla del FUHV
├── public/
│   ├── index.html         → Interfaz del formulario
│   ├── styles.css         → Estilos
│   └── script.js          → Lógica del wizard
├── package.json           → Dependencias
├── README.md              → Documentación completa
├── ARQUITECTURA.md        → Diseño técnico detallado
└── QUICK_START.md         → Este archivo
```

---

## Preguntas Frecuentes

### ¿Necesito internet?
Solo la primera vez para descargar Chromium. Después funciona offline.

### ¿Se guardan mis datos?
No. Todo es temporal. Nada se guarda en servidores.

### ¿Puedo editar el PDF después?
No, el PDF es final. Si necesitas cambios, llena el formulario nuevamente.

### ¿Funciona en móviles?
Sí, pero es más cómodo en computador o tablet.

### ¿Puedo cambiar el puerto?
Sí:
```bash
PORT=8080 npm start
```

### ¿Cómo detengo el servidor?
Presiona `Ctrl + C` en la terminal.

---

## Solución de Problemas

### Error: "Cannot find module 'express'"
**Solución:** Ejecuta `npm install`

### Error: "Port 3000 is already in use"
**Solución:**
- Opción 1: Detén la aplicación que usa el puerto 3000
- Opción 2: Usa otro puerto: `PORT=8080 npm start`

### Error: "Failed to launch chrome"
**Solución:**
- Asegúrate de tener espacio en disco
- En Linux: `sudo apt-get install -y libgbm-dev`
- En Mac/Windows: reinstala Puppeteer: `npm install puppeteer`

### El PDF no se descarga
**Solución:**
- Verifica que tu navegador permita descargas
- Revisa la carpeta de Descargas
- Prueba con otro navegador (Chrome, Firefox, Edge)

---

## Próximos Pasos

1. **Llena el formulario** con tus datos reales
2. **Genera el PDF** y revísalo cuidadosamente
3. **Guarda el PDF** en un lugar seguro
4. **Imprime** si lo necesitas para trámites

---

## Soporte

Para más información, consulta:
- **README.md:** Documentación completa
- **ARQUITECTURA.md:** Detalles técnicos del sistema

---

**¡Éxito con tu Hoja de Vida!**
