# Generador de Formato Único de Hoja de Vida (FUHV)

Aplicación web personal para facilitar el diligenciamiento del Formato Único de Hoja de Vida de Colombia, conforme al modelo oficial establecido por Función Pública.

## Descripción

Esta aplicación permite a los usuarios completar el FUHV de manera guiada mediante un formulario por pasos (wizard) y generar un PDF con el formato oficial ya diligenciado, listo para imprimir y entregar.

## Características

- **Formulario guiado por pasos**: Interfaz intuitiva dividida en 6 secciones
- **Validaciones en tiempo real**: Campos obligatorios según normativa oficial
- **Generación automática de PDF**: Formato oficial del FUHV listo para imprimir
- **Sin autenticación ni base de datos**: Aplicación completamente personal y privada
- **Descarga inmediata**: El PDF se genera y descarga directamente en su equipo
- **Responsive**: Funciona en computadores, tablets y móviles

## Estructura del Proyecto

```
FUHV/
├── server/
│   ├── index.js           # Servidor Express y endpoint de generación
│   └── pdf-template.js    # Plantilla HTML del FUHV para PDF
├── public/
│   ├── index.html         # Interfaz del formulario wizard
│   ├── styles.css         # Estilos de la aplicación
│   └── script.js          # Lógica del frontend
├── package.json           # Dependencias del proyecto
└── README.md             # Documentación
```

## Stack Tecnológico

### Backend
- **Node.js**: Entorno de ejecución
- **Express**: Framework web
- **Puppeteer**: Generación de PDFs desde HTML

### Frontend
- **HTML5**: Estructura del formulario
- **CSS3**: Diseño responsive y moderno
- **JavaScript Vanilla**: Lógica del wizard y validaciones

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm (viene incluido con Node.js)

## Instalación

1. Clone o descargue este repositorio
2. Navegue al directorio del proyecto:

```bash
cd FUHV
```

3. Instale las dependencias:

```bash
npm install
```

## Ejecución

1. Inicie el servidor:

```bash
npm start
```

2. Abra su navegador en:

```
http://localhost:3000
```

3. Complete el formulario siguiendo los pasos indicados

4. Genere y descargue su Hoja de Vida en PDF

## Uso de la Aplicación

### Paso 1: Datos Personales
Complete información básica como nombres, apellidos, documento de identidad, datos de nacimiento, residencia y contacto.

**Campos obligatorios:**
- Primer apellido y primer nombre
- Tipo y número de documento
- Sexo, nacionalidad
- Datos de nacimiento (país, departamento, municipio, fecha)
- Datos de residencia (país, departamento, municipio, dirección)
- Teléfono celular
- Correo electrónico

### Paso 2: Formación Académica
Agregue sus estudios académicos desde educación básica hasta posgrados.

**Por cada formación:**
- Nivel de estudio
- Programa académico
- Institución educativa
- Estado (Graduado/En curso/No graduado)
- Fecha de terminación

### Paso 3: Experiencia Laboral
Agregue su experiencia laboral (opcional si no tiene).

**Por cada experiencia:**
- Empresa o entidad
- Cargo desempeñado
- Fechas de ingreso y retiro
- Funciones principales

### Paso 4: Idiomas
Agregue los idiomas que conoce (opcional).

**Por cada idioma:**
- Nombre del idioma
- Habilidades (habla, lee, escribe)
- Nivel de dominio

### Paso 5: Referencias Personales
Agregue mínimo 2 referencias personales.

**Por cada referencia:**
- Nombre completo
- Cargo u ocupación
- Teléfono de contacto
- Empresa (opcional)

### Paso 6: Declaración Juramentada
- Lea la declaración juramentada
- Complete lugar y fecha de diligenciamiento
- Acepte la declaración de veracidad

## Arquitectura de la Aplicación

### Frontend (Cliente)

```
Usuario → Formulario Wizard → Validaciones → Recolección de datos → Envío JSON
```

**Componentes principales:**
- `index.html`: Estructura del formulario dividido en 6 pasos
- `styles.css`: Diseño visual con barra de progreso y cards
- `script.js`:
  - Navegación entre pasos
  - Validación de campos obligatorios
  - Gestión de secciones dinámicas (formación, experiencia, idiomas, referencias)
  - Recolección y formateo de datos
  - Comunicación con el backend

### Backend (Servidor)

```
Recepción JSON → Generación HTML → Puppeteer → PDF → Descarga
```

**Componentes principales:**
- `server/index.js`:
  - Servidor Express en puerto 3000
  - Endpoint POST `/generate-pdf`
  - Servir archivos estáticos desde `/public`
  - Manejo de errores

- `server/pdf-template.js`:
  - Función `generateFUHVTemplate(data)`
  - Genera HTML del FUHV con los datos recibidos
  - Replica el diseño oficial del formato
  - Estilos inline para correcta renderización en PDF

### Flujo de Generación del PDF

1. Usuario completa el formulario paso a paso
2. Al hacer clic en "Generar Hoja de Vida":
   - Se validan todos los campos obligatorios
   - Se recolectan todos los datos del formulario
   - Se formatea la información (fechas, arrays, etc.)
   - Se envía un JSON al backend vía POST
3. El servidor recibe los datos:
   - Genera HTML del FUHV con la plantilla
   - Inicia Puppeteer en modo headless
   - Carga el HTML en una página virtual
   - Genera PDF con formato Letter y márgenes oficiales
   - Envía el PDF como respuesta para descarga
4. El navegador recibe el PDF:
   - Se crea un blob con el contenido
   - Se genera un enlace temporal de descarga
   - Se descarga automáticamente con nombre personalizado
   - Se muestra mensaje de éxito

## Diseño del PDF

El PDF generado replica fielmente el formato oficial del FUHV establecido por Función Pública, incluyendo:

- Encabezado oficial con título y referencia normativa
- Secciones claramente diferenciadas con fondos grises
- Campos con bordes para información del usuario
- Tablas para formación, experiencia, idiomas y referencias
- Declaración juramentada oficial
- Espacio para firma del aspirante
- Nota legal sobre conformidad con el modelo oficial

**Características del PDF:**
- Tamaño: Letter (8.5" x 11")
- Márgenes: 0.5cm en todos los lados
- Fuente: Arial (tipografía estándar)
- Tamaños de texto: 7pt - 14pt según sección
- Imprimible en blanco y negro
- Compatible con sistemas de gestión documental

## Validaciones Implementadas

### Cliente (Frontend)
- Campos obligatorios marcados con asterisco (*)
- Validación antes de avanzar cada paso
- Mínimo 1 formación académica
- Mínimo 2 referencias personales
- Formato de email válido
- Formato de fecha válido
- Checkbox de aceptación de declaración

### Servidor (Backend)
- Validación de recepción de datos JSON
- Manejo de errores en generación de PDF
- Respuesta con código de estado apropiado
- Logs de operaciones

## Seguridad y Privacidad

- **Sin almacenamiento**: Los datos NO se guardan en ningún servidor
- **Sin autenticación**: No requiere crear cuentas ni iniciar sesión
- **Sin base de datos**: Toda la información es temporal
- **Procesamiento local**: El PDF se genera en el momento y se descarga
- **Sin tracking**: No se recopila información del usuario
- **Uso personal**: Diseñado para uso individual y privado

## Legal

Esta aplicación facilita el diligenciamiento del Formato Único de Hoja de Vida conforme al modelo oficial establecido por Función Pública (Decreto 1083 de 2015, art. 2.2.5.3.2).

**Notas importantes:**
- Esta es una herramienta de uso personal
- No tiene carácter oficial ni está afiliada a entidades gubernamentales
- El usuario es responsable de la veracidad de la información suministrada
- Se recomienda verificar la vigencia del formato con las entidades correspondientes

## Posibles Mejoras Futuras

Algunas ideas para expandir la funcionalidad (fuera del alcance actual):

- Guardar borrador en localStorage del navegador
- Exportar/importar datos en JSON
- Múltiples plantillas de FUHV (diferentes versiones)
- Previsualización del PDF antes de descargar
- Modo offline con Service Workers
- Generación en otros formatos (Word, HTML)
- Validación de números de identificación colombianos
- Autocompletado de ciudades y departamentos
- Temas oscuro/claro

## Solución de Problemas

### El servidor no inicia
- Verifique que Node.js esté instalado: `node --version`
- Asegúrese de haber ejecutado `npm install`
- Compruebe que el puerto 3000 no esté en uso

### El PDF no se genera
- Verifique su conexión a internet (Puppeteer descarga Chromium la primera vez)
- Revise la consola del navegador para errores
- Compruebe los logs del servidor en la terminal
- Asegúrese de tener espacio en disco suficiente

### Campos no se guardan
- Complete todos los campos obligatorios (marcados con *)
- Verifique el formato de fechas y emails
- Use navegadores modernos (Chrome, Firefox, Edge, Safari)

## Soporte

Este es un proyecto de uso personal. Para reportar problemas o sugerir mejoras, puede:

- Revisar el código fuente
- Modificar el proyecto según sus necesidades
- Compartir mejoras con la comunidad

## Licencia

MIT License - Uso libre para fines personales y educativos.

---

**Desarrollado con Node.js, Express y Puppeteer**

*Versión 1.0.0*
