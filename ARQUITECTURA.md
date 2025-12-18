# Arquitectura del Sistema - Generador FUHV

## Visión General

El Generador de FUHV es una aplicación web cliente-servidor simple que sigue el patrón arquitectónico **Request-Response** con generación de documentos bajo demanda.

```
┌─────────────┐         HTTP          ┌─────────────┐         ┌──────────────┐
│             │  POST /generate-pdf   │             │         │              │
│   Cliente   │ ───────────────────>  │   Express   │ ─────>  │  Puppeteer   │
│  (Browser)  │                       │   Server    │         │  (Chromium)  │
│             │  <───────────────────  │             │  <─────  │              │
└─────────────┘    PDF Download       └─────────────┘         └──────────────┘
     │                                       │
     │                                       │
     v                                       v
  Descarga                               Template
  automática                              Renderer
```

## Componentes Principales

### 1. Frontend (Cliente)

**Ubicación:** `/public`

**Tecnologías:**
- HTML5 (estructura)
- CSS3 (presentación)
- JavaScript Vanilla (lógica)

**Módulos:**

#### 1.1. Interfaz de Usuario (`index.html`)
```
Formulario Multi-Paso (Wizard)
├── Paso 1: Datos Personales (18 campos)
├── Paso 2: Formación Académica (dinámico, mínimo 1)
├── Paso 3: Experiencia Laboral (dinámico, opcional)
├── Paso 4: Idiomas (dinámico, opcional)
├── Paso 5: Referencias (dinámico, mínimo 2)
└── Paso 6: Declaración Juramentada
```

**Características:**
- Formulario HTML semántico
- Campos obligatorios marcados con atributo `required`
- Secciones dinámicas generadas por JavaScript
- Overlay de carga durante generación

#### 1.2. Presentación (`styles.css`)
```
Diseño Responsive
├── Layout: Contenedor centrado (max-width: 900px)
├── Header: Gradiente púrpura corporativo
├── Progress Bar: Indicador visual de progreso
├── Steps Indicator: 6 pasos numerados
├── Forms: Grid de 2 columnas (responsive)
├── Cards: Secciones dinámicas con fondo gris
├── Buttons: Navegación y acciones principales
└── Loading: Overlay con spinner animado
```

**Decisiones de diseño:**
- Grid CSS para layouts responsivos
- Gradientes para elementos visuales atractivos
- Transiciones suaves (0.3s ease)
- Mobile-first (breakpoint: 768px)
- Accesibilidad: labels asociados, contraste adecuado

#### 1.3. Lógica del Cliente (`script.js`)

**Gestión de Estado:**
```javascript
Estado Global
├── currentStep: número (1-6)
├── totalSteps: 6 (constante)
├── formacionCount: contador de formaciones agregadas
├── experienciaCount: contador de experiencias agregadas
├── idiomaCount: contador de idiomas agregados
└── referenciaCount: contador de referencias agregadas
```

**Funciones Principales:**

1. **Navegación del Wizard**
   ```javascript
   changeStep(direction)
   └── Valida paso actual
       └── Cambia currentStep
           └── Actualiza UI (paso visible, progreso, botones)
   ```

2. **Validación de Formularios**
   ```javascript
   validateCurrentStep()
   └── Selecciona campos required del paso actual
       └── Verifica que todos tengan valor
           └── Marca visualmente campos vacíos (borde rojo)
   ```

3. **Gestión de Secciones Dinámicas**
   ```javascript
   addFormacion() / addExperiencia() / addIdioma() / addReferencia()
   └── Incrementa contador
       └── Crea elemento card con campos
           └── Inserta en contenedor respectivo

   removeSection(id)
   └── Remueve elemento del DOM
   ```

4. **Recolección de Datos**
   ```javascript
   collectFormData()
   └── Crea FormData del formulario
       └── Itera contadores de secciones dinámicas
           └── Construye arrays de objetos
               └── Retorna objeto JSON estructurado
   ```

5. **Generación y Descarga**
   ```javascript
   handleSubmit(e)
   └── Previene submit default
       └── Valida paso final
           └── Recolecta datos
               └── Muestra loader
                   └── POST /generate-pdf
                       └── Recibe blob
                           └── Descarga automática
   ```

**Flujo de Interacción del Usuario:**
```
Carga página → Inicialización
    ↓
Completa Paso 1 → Validación → Siguiente
    ↓
Completa Paso 2 → Agrega formaciones → Validación → Siguiente
    ↓
Completa Paso 3 → Agrega experiencias (opcional) → Siguiente
    ↓
Completa Paso 4 → Agrega idiomas (opcional) → Siguiente
    ↓
Completa Paso 5 → Agrega referencias (mínimo 2) → Validación → Siguiente
    ↓
Completa Paso 6 → Acepta declaración → Generar PDF
    ↓
Loader → Envío JSON → Espera respuesta
    ↓
Descarga automática → Mensaje éxito
```

### 2. Backend (Servidor)

**Ubicación:** `/server`

**Tecnologías:**
- Node.js 14+
- Express 4.18+
- Puppeteer 21.6+

**Módulos:**

#### 2.1. Servidor HTTP (`server/index.js`)

**Configuración:**
```javascript
Puerto: 3000 (configurable vía PORT env)
Middlewares:
  └── express.json({ limit: '10mb' })  // Parser de JSON
  └── express.static('../public')      // Archivos estáticos
```

**Endpoints:**

1. **GET /**
   - Descripción: Sirve index.html
   - Método: GET
   - Respuesta: HTML estático
   - Código: 200

2. **POST /generate-pdf**
   - Descripción: Genera PDF del FUHV
   - Método: POST
   - Content-Type: application/json
   - Body: Datos del formulario
   - Respuesta: PDF binario
   - Headers:
     ```
     Content-Type: application/pdf
     Content-Disposition: attachment; filename=FUHV.pdf
     ```
   - Códigos de estado:
     - 200: PDF generado exitosamente
     - 500: Error en generación

3. **GET /health**
   - Descripción: Verificación de estado del servidor
   - Método: GET
   - Respuesta: JSON { status, message }
   - Código: 200

**Manejo de Errores:**
```javascript
try {
  // Generación de PDF
} catch (error) {
  console.error('Error generando PDF:', error);

  // Cerrar browser si está abierto
  if (browser) await browser.close();

  // Respuesta de error al cliente
  res.status(500).json({
    error: 'Error al generar el PDF',
    message: error.message
  });
}
```

#### 2.2. Generador de Plantilla (`server/pdf-template.js`)

**Función Principal:**
```javascript
generateFUHVTemplate(data)
  └── Recibe: objeto JSON con datos del formulario
  └── Retorna: string HTML completo con estilos inline
```

**Estructura de Datos de Entrada:**
```javascript
{
  // Datos personales (18 campos string)
  primerApellido, segundoApellido, primerNombre, segundoNombre,
  tipoDocumento, numeroDocumento, sexo, nacionalidad,
  paisNacimiento, departamentoNacimiento, municipioNacimiento, fechaNacimiento,
  paisResidencia, departamentoResidencia, municipioResidencia,
  direccion, telefono, celular, email,

  // Arrays de objetos
  formacionAcademica: [
    { nivel, programa, institucion, graduado, fechaTerminacion }
  ],
  experienciaLaboral: [
    { empresa, cargo, fechaIngreso, fechaRetiro, funciones }
  ],
  idiomas: [
    { idioma, habla, lee, escribe, nivel }
  ],
  referencias: [
    { nombre, cargo, telefono, empresa }
  ],

  // Declaración
  lugarDiligenciamiento, fechaDiligenciamiento, aceptaDeclaracion
}
```

**Diseño del Template HTML:**

```
HTML Document
├── <head>
│   └── <style> (CSS inline para PDF)
├── <body>
    └── <div class="page">
        ├── Header (Título oficial FUHV)
        ├── Sección 1: Datos Personales (grid de campos)
        ├── Sección 2: Formación Académica (tabla)
        ├── Sección 3: Experiencia Laboral (tabla)
        ├── Sección 4: Idiomas (tabla)
        ├── Sección 5: Referencias (tabla)
        ├── Declaración Juramentada (texto oficial)
        ├── Sección de Firma (grid con lugar y fecha)
        └── Nota Legal (footer)
```

**Estilos CSS del PDF:**
- Tamaño de página: Letter (21.59cm)
- Márgenes: 0.5cm
- Fuentes: Arial, sans-serif
- Tamaños de texto:
  - Título principal: 14pt
  - Títulos de sección: 10pt
  - Etiquetas de campo: 7pt
  - Contenido: 9pt
  - Tablas: 8pt
- Colores:
  - Bordes: #000
  - Fondos de sección: #d9d9d9
  - Texto: #000
- Layout:
  - Grid de 2 columnas para campos
  - Tablas con bordes completos
  - Espaciado consistente

**Renderizado de Arrays:**
```javascript
// Si hay datos
${array.length > 0 ? array.map(item => `
  <tr>
    <td>${item.campo1}</td>
    <td>${item.campo2}</td>
  </tr>
`).join('') :
// Si no hay datos
'<tr><td colspan="N">No se registraron datos</td></tr>'}
```

#### 2.3. Generación de PDF con Puppeteer

**Flujo de Generación:**
```
1. Recepción de datos JSON
   ↓
2. generateFUHVTemplate(data) → HTML string
   ↓
3. puppeteer.launch({ headless: 'new' })
   ↓
4. browser.newPage()
   ↓
5. page.setContent(html, { waitUntil: 'networkidle0' })
   ↓
6. page.pdf({
     format: 'Letter',
     printBackground: true,
     margin: { top: '0.5cm', right: '0.5cm', bottom: '0.5cm', left: '0.5cm' }
   })
   ↓
7. browser.close()
   ↓
8. Retorno de buffer PDF
```

**Configuración de Puppeteer:**
```javascript
{
  headless: 'new',           // Modo headless nuevo
  args: [
    '--no-sandbox',          // Seguridad en entornos containerizados
    '--disable-setuid-sandbox'
  ]
}
```

**Configuración de PDF:**
```javascript
{
  format: 'Letter',          // 8.5" × 11" (tamaño oficial)
  printBackground: true,     // Incluir colores de fondo
  margin: {
    top: '0.5cm',
    right: '0.5cm',
    bottom: '0.5cm',
    left: '0.5cm'
  }
}
```

## Patrones de Diseño Utilizados

### 1. MVC Simplificado
```
Model:       Datos del formulario (objeto JSON)
View:        HTML + CSS (cliente y template PDF)
Controller:  JavaScript del cliente + Express routes
```

### 2. Template Method
```javascript
generateFUHVTemplate(data)
  └── Define estructura HTML base
      └── Inserta datos específicos del usuario
          └── Renderiza secciones dinámicas
```

### 3. Factory Pattern
```javascript
// Funciones de creación de elementos
addFormacion() → Crea card de formación
addExperiencia() → Crea card de experiencia
addIdioma() → Crea card de idioma
addReferencia() → Crea card de referencia
```

### 4. Middleware Chain (Express)
```javascript
request
  └── express.json()           // Parsear JSON
      └── Ruta específica      // /generate-pdf
          └── Handler          // Lógica de negocio
              └── response     // PDF o error
```

## Decisiones Arquitectónicas

### ¿Por qué no usar base de datos?
- **Simplicidad:** Reduce complejidad operacional
- **Privacidad:** No se almacena información sensible
- **Stateless:** Cada solicitud es independiente
- **Uso personal:** No requiere múltiples usuarios
- **Costo:** Sin gastos de hosting de BD

### ¿Por qué Puppeteer en lugar de otras librerías?
- **Fidelidad:** Renderiza HTML/CSS como Chrome real
- **Flexibilidad:** Control total sobre el diseño
- **Mantenibilidad:** Separación clara entre template y lógica
- **Debugging:** Fácil visualizar HTML antes de convertir a PDF
- **Features:** Soporte completo de CSS moderno

### ¿Por qué Wizard en lugar de formulario largo?
- **UX:** Reduce carga cognitiva del usuario
- **Validación progresiva:** Errores detectados temprano
- **Progreso visible:** Barra de progreso motiva completitud
- **Organización:** Refleja estructura del FUHV oficial
- **Mobile-friendly:** Menos scroll en dispositivos móviles

### ¿Por qué JavaScript Vanilla?
- **Sin dependencias:** Carga más rápida
- **Compatibilidad:** Funciona en todos los navegadores
- **Simplicidad:** No requiere build process
- **Aprendizaje:** Código fácil de entender y modificar
- **Tamaño:** Bundle mínimo

## Consideraciones de Rendimiento

### Frontend
- **Lazy rendering:** Secciones dinámicas creadas bajo demanda
- **Event delegation:** Manejo eficiente de eventos
- **Validación incremental:** Solo valida paso actual
- **CSS optimizado:** Uso de Grid/Flexbox nativo

### Backend
- **Memoria:** Puppeteer cierra browser después de cada uso
- **Timeout implícito:** Previene procesos colgados
- **JSON limit:** 10MB máximo (más que suficiente)
- **Static serving:** Express sirve archivos directamente

### Puppeteer
- **Headless:** Sin GUI, menor uso de recursos
- **Single page:** Una sola página por PDF
- **networkidle0:** Espera a que no haya requests pendientes
- **Cierre automático:** Browser se cierra en cada request

## Seguridad

### Validaciones
- **Cliente:** Previene errores de usuario
- **Servidor:** No confía en datos del cliente
- **Sanitización:** No hay inyección SQL (sin BD)
- **XSS:** Template escapa HTML automáticamente

### Limitaciones
- **Rate limiting:** No implementado (uso personal)
- **CORS:** No configurado (misma origen)
- **HTTPS:** No incluido (desarrollo local)
- **Authentication:** No requerido (sin usuarios)

### Mejoras Futuras de Seguridad
- Rate limiting con express-rate-limit
- Helmet.js para headers de seguridad
- HTTPS en producción
- Validación de esquema con Joi/Yup

## Escalabilidad

### Actual
- Uso personal: 1 usuario simultáneo
- Generación síncrona: 1 PDF a la vez
- Sin persistencia: Stateless

### Para Producción (fuera del alcance)
- **Cola de trabajos:** Bull + Redis para PDFs
- **Caché:** Redis para templates frecuentes
- **CDN:** Archivos estáticos
- **Load balancer:** Nginx para múltiples instancias
- **Containerización:** Docker para deployment
- **Monitoreo:** PM2 o similar

## Testing (No Implementado)

### Recomendaciones para Testing

**Frontend:**
```javascript
// Jest + Testing Library
- Navegación entre pasos
- Validación de campos
- Agregado/eliminado de secciones dinámicas
- Recolección de datos
- Manejo de errores
```

**Backend:**
```javascript
// Jest + Supertest
- Endpoint /generate-pdf responde 200
- PDF generado es válido
- Manejo de datos incompletos
- Manejo de errores de Puppeteer
```

**E2E:**
```javascript
// Playwright o Cypress
- Flujo completo de usuario
- Generación y descarga de PDF
- Validaciones visuales
```

## Deployment (No Implementado)

### Local (Actual)
```bash
npm install
npm start
```

### Producción (Recomendaciones)
```
Plataformas sugeridas:
- Heroku (fácil, incluye Puppeteer)
- Railway (moderno, simple)
- Render (gratuito para proyectos pequeños)
- VPS (DigitalOcean, Linode) con PM2

Variables de entorno:
- PORT: Puerto del servidor
- NODE_ENV: production

Build:
- No requiere build (JavaScript vanilla)
- npm install --production

Run:
- npm start
- O: pm2 start server/index.js
```

## Mantenimiento

### Actualizaciones de Dependencias
```bash
npm outdated
npm update
```

### Monitoreo de Seguridad
```bash
npm audit
npm audit fix
```

### Logs
- Actualmente: console.log
- Producción: Winston o Bunyan

## Conclusión

Esta arquitectura prioriza:
1. **Simplicidad:** Código fácil de entender y modificar
2. **Funcionalidad:** Cumple 100% el objetivo planteado
3. **Privacidad:** Sin almacenamiento de datos sensibles
4. **Mantenibilidad:** Estructura clara y documentada
5. **Extensibilidad:** Fácil agregar nuevas características

El diseño es deliberadamente simple para uso personal, pero la estructura permite escalar si fuera necesario en el futuro.
