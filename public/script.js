// Estado del formulario
let currentStep = 1;
const totalSteps = 7; // Actualizado a 7 pasos

// Contadores para secciones dinámicas
let formacionCount = 0;
let experienciaCount = 0;
let idiomaCount = 0;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  // Agregar una formación académica por defecto
  addFormacion();

  // Agregar una experiencia laboral por defecto
  addExperiencia();

  // Agregar un idioma por defecto
  addIdioma();

  // Establecer fecha de diligenciamiento como hoy
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('fechaDiligenciamiento').value = today;

  // Event listener para el submit
  document.getElementById('fuhvForm').addEventListener('submit', handleSubmit);

  updateNavigation();
});

// Cambiar de paso
function changeStep(direction) {
  // Validar paso actual antes de avanzar
  if (direction === 1 && !validateCurrentStep()) {
    return;
  }

  // Cambiar paso
  currentStep += direction;

  // Actualizar interfaz
  showStep(currentStep);
  updateProgress();
  updateNavigation();

  // Scroll al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mostrar paso específico
function showStep(step) {
  document.querySelectorAll('.form-step').forEach(s => {
    s.classList.remove('active');
  });

  document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');

  document.querySelectorAll('.step').forEach((s, index) => {
    s.classList.remove('active', 'completed');
    if (index + 1 < step) {
      s.classList.add('completed');
    } else if (index + 1 === step) {
      s.classList.add('active');
    }
  });
}

// Actualizar barra de progreso
function updateProgress() {
  const progress = (currentStep / totalSteps) * 100;
  document.getElementById('progressBar').style.width = `${progress}%`;
}

// Actualizar botones de navegación
function updateNavigation() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');

  prevBtn.style.display = currentStep === 1 ? 'none' : 'block';

  if (currentStep === totalSteps) {
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'block';
  } else {
    nextBtn.style.display = 'block';
    submitBtn.style.display = 'none';
  }
}

// Validar paso actual
function validateCurrentStep() {
  const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  const requiredFields = currentStepElement.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach(field => {
    if (!field.value.trim() && !field.checked) {
      isValid = false;
      field.style.borderColor = '#f44336';

      field.addEventListener('input', () => {
        field.style.borderColor = '';
      }, { once: true });
    }
  });

  if (!isValid) {
    alert('Por favor complete todos los campos obligatorios (*)');
  }

  return isValid;
}

// Agregar formación académica
function addFormacion() {
  formacionCount++;
  const container = document.getElementById('formacionContainer');

  const card = document.createElement('div');
  card.className = 'section-card';
  card.id = `formacion-${formacionCount}`;
  card.innerHTML = `
    <div class="section-header">
      <span class="section-title">Formación #${formacionCount}</span>
      <button type="button" class="btn-remove" onclick="removeSection('formacion-${formacionCount}')">Eliminar</button>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Modalidad Académica *</label>
        <select name="formacion_modalidad_${formacionCount}" required>
          <option value="">Seleccione...</option>
          <option value="TC">TC - Técnica</option>
          <option value="TL">TL - Tecnológica</option>
          <option value="TE">TE - Tecnológica Especializada</option>
          <option value="UN">UN - Universitaria</option>
          <option value="ES">ES - Especialización</option>
          <option value="MG">MG - Maestría o Magister</option>
          <option value="DOC">DOC - Doctorado o PHD</option>
        </select>
      </div>
      <div class="form-group">
        <label>No. Semestres Aprobados *</label>
        <input type="number" name="formacion_semestres_${formacionCount}" min="1" max="20" required>
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>¿Graduado? *</label>
        <select name="formacion_graduado_${formacionCount}" required>
          <option value="">Seleccione...</option>
          <option value="SI">SI</option>
          <option value="NO">NO</option>
        </select>
      </div>
      <div class="form-group">
        <label>Título Obtenido *</label>
        <input type="text" name="formacion_titulo_${formacionCount}" required>
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Mes de Terminación (01-12)</label>
        <input type="text" name="formacion_mes_${formacionCount}" maxlength="2" placeholder="06">
      </div>
      <div class="form-group">
        <label>Año de Terminación (AAAA)</label>
        <input type="text" name="formacion_ano_${formacionCount}" maxlength="4" placeholder="2020">
      </div>
    </div>

    <div class="form-group">
      <label>No. Tarjeta Profesional (si aplica)</label>
      <input type="text" name="formacion_tarjeta_${formacionCount}">
    </div>
  `;

  container.appendChild(card);
}

// Agregar trabajo actual (primera experiencia - campos opcionales)
function addExperiencia() {
  experienciaCount++;
  const container = document.getElementById('experienciaContainer');

  const card = document.createElement('div');
  card.className = 'section-card';
  card.id = `experiencia-${experienciaCount}`;
  card.style.borderLeft = '4px solid #2196F3';
  card.innerHTML = `
    <div class="section-header">
      <span class="section-title">TRABAJO ACTUAL (Dejar vacío si no está empleado)</span>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Empresa o Entidad</label>
        <input type="text" name="experiencia_empresa_${experienciaCount}">
      </div>
      <div class="form-group">
        <label>Tipo</label>
        <select name="experiencia_tipo_${experienciaCount}">
          <option value="">Seleccione...</option>
          <option value="Publica">Pública</option>
          <option value="Privada">Privada</option>
        </select>
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>País</label>
        <input type="text" name="experiencia_pais_${experienciaCount}" value="Colombia">
      </div>
      <div class="form-group">
        <label>Departamento</label>
        <input type="text" name="experiencia_depto_${experienciaCount}">
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Municipio</label>
        <input type="text" name="experiencia_municipio_${experienciaCount}">
      </div>
      <div class="form-group">
        <label>Email de la Entidad</label>
        <input type="email" name="experiencia_email_${experienciaCount}">
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Teléfonos</label>
        <input type="tel" name="experiencia_telefono_${experienciaCount}">
      </div>
      <div class="form-group">
        <label>Cargo</label>
        <input type="text" name="experiencia_cargo_${experienciaCount}">
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Dependencia</label>
        <input type="text" name="experiencia_dependencia_${experienciaCount}">
      </div>
      <div class="form-group">
        <label>Dirección</label>
        <input type="text" name="experiencia_direccion_${experienciaCount}">
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Fecha de Ingreso (DD/MM/AAAA)</label>
        <input type="text" name="experiencia_ingreso_${experienciaCount}" placeholder="15/01/2020">
      </div>
      <div class="form-group">
        <label>Fecha de Retiro (DD/MM/AAAA)</label>
        <input type="text" name="experiencia_retiro_${experienciaCount}" placeholder="Dejar vacío - es empleo actual">
      </div>
    </div>
  `;

  container.appendChild(card);
}

// Agregar experiencia laboral anterior (campos requeridos)
function addExperienciaAnterior() {
  experienciaCount++;
  const container = document.getElementById('experienciaContainer');

  const card = document.createElement('div');
  card.className = 'section-card';
  card.id = `experiencia-${experienciaCount}`;
  card.innerHTML = `
    <div class="section-header">
      <span class="section-title">Experiencia Anterior #${experienciaCount - 1}</span>
      <button type="button" class="btn-remove" onclick="removeSection('experiencia-${experienciaCount}')">Eliminar</button>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Empresa o Entidad *</label>
        <input type="text" name="experiencia_empresa_${experienciaCount}" required>
      </div>
      <div class="form-group">
        <label>Tipo *</label>
        <select name="experiencia_tipo_${experienciaCount}" required>
          <option value="">Seleccione...</option>
          <option value="Publica">Pública</option>
          <option value="Privada">Privada</option>
        </select>
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>País *</label>
        <input type="text" name="experiencia_pais_${experienciaCount}" value="Colombia" required>
      </div>
      <div class="form-group">
        <label>Departamento *</label>
        <input type="text" name="experiencia_depto_${experienciaCount}" required>
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Municipio *</label>
        <input type="text" name="experiencia_municipio_${experienciaCount}" required>
      </div>
      <div class="form-group">
        <label>Email de la Entidad</label>
        <input type="email" name="experiencia_email_${experienciaCount}">
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Teléfonos</label>
        <input type="tel" name="experiencia_telefono_${experienciaCount}">
      </div>
      <div class="form-group">
        <label>Cargo *</label>
        <input type="text" name="experiencia_cargo_${experienciaCount}" required>
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Dependencia</label>
        <input type="text" name="experiencia_dependencia_${experienciaCount}">
      </div>
      <div class="form-group">
        <label>Dirección</label>
        <input type="text" name="experiencia_direccion_${experienciaCount}">
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Fecha de Ingreso (DD/MM/AAAA) *</label>
        <input type="text" name="experiencia_ingreso_${experienciaCount}" placeholder="15/01/2020" required>
      </div>
      <div class="form-group">
        <label>Fecha de Retiro (DD/MM/AAAA) *</label>
        <input type="text" name="experiencia_retiro_${experienciaCount}" placeholder="31/12/2022" required>
      </div>
    </div>
  `;

  container.appendChild(card);
}

// Agregar idioma
function addIdioma() {
  idiomaCount++;
  const container = document.getElementById('idiomasContainer');

  const card = document.createElement('div');
  card.className = 'section-card';
  card.id = `idioma-${idiomaCount}`;
  card.innerHTML = `
    <div class="section-header">
      <span class="section-title">Idioma #${idiomaCount}</span>
      <button type="button" class="btn-remove" onclick="removeSection('idioma-${idiomaCount}')">Eliminar</button>
    </div>

    <div class="form-group">
      <label>Idioma *</label>
      <input type="text" name="idioma_nombre_${idiomaCount}" placeholder="Ej: Inglés, Francés, Portugués" required>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Lo Habla *</label>
        <select name="idioma_habla_${idiomaCount}" required>
          <option value="">Seleccione...</option>
          <option value="R">R - Regular</option>
          <option value="B">B - Bien</option>
          <option value="MB">MB - Muy Bien</option>
        </select>
      </div>
      <div class="form-group">
        <label>Lo Lee *</label>
        <select name="idioma_lee_${idiomaCount}" required>
          <option value="">Seleccione...</option>
          <option value="R">R - Regular</option>
          <option value="B">B - Bien</option>
          <option value="MB">MB - Muy Bien</option>
        </select>
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Lo Escribe *</label>
        <select name="idioma_escribe_${idiomaCount}" required>
          <option value="">Seleccione...</option>
          <option value="R">R - Regular</option>
          <option value="B">B - Bien</option>
          <option value="MB">MB - Muy Bien</option>
        </select>
      </div>
    </div>
  `;

  container.appendChild(card);
}

// Remover sección
function removeSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.remove();
  }
}

// Recolectar datos del formulario
function collectFormData() {
  const formData = new FormData(document.getElementById('fuhvForm'));
  const data = {
    // Datos personales
    primerApellido: formData.get('primerApellido'),
    segundoApellido: formData.get('segundoApellido'),
    primerNombre: formData.get('primerNombre'),
    segundoNombre: formData.get('segundoNombre'),
    tipoDocumento: formData.get('tipoDocumento'),
    numeroDocumento: formData.get('numeroDocumento'),
    sexo: formData.get('sexo'),
    nacionalidad: formData.get('nacionalidad'),
    libretaMilitar: formData.get('libretaMilitar'),
    numeroLibreta: formData.get('numeroLibreta'),
    paisNacimiento: formData.get('paisNacimiento'),
    departamentoNacimiento: formData.get('departamentoNacimiento'),
    municipioNacimiento: formData.get('municipioNacimiento'),
    fechaNacimiento: formData.get('fechaNacimiento'),
    paisResidencia: formData.get('paisResidencia'),
    departamentoResidencia: formData.get('departamentoResidencia'),
    municipioResidencia: formData.get('municipioResidencia'),
    direccion: formData.get('direccion'),
    telefono: formData.get('telefono'),
    email: formData.get('email'),

    // Educación básica
    gradoAprobado: formData.get('gradoAprobado'),
    tituloBasico: formData.get('tituloBasico'),
    fechaDeGrado: formData.get('fechaDeGrado'),

    // Formación académica
    formacionAcademica: [],

    // Idiomas
    idiomas: [],

    // Experiencia laboral
    experienciaLaboral: [],

    // Tiempo de experiencia
    tiempoExperiencia: {
      servidorPublico: {
        anos: formData.get('tiempoServidorAnos') || '0',
        meses: formData.get('tiempoServidorMeses') || '0'
      },
      sectorPrivado: {
        anos: formData.get('tiempoPrivadoAnos') || '0',
        meses: formData.get('tiempoPrivadoMeses') || '0'
      },
      independiente: {
        anos: formData.get('tiempoIndependienteAnos') || '0',
        meses: formData.get('tiempoIndependienteMeses') || '0'
      },
      total: {
        anos: formData.get('tiempoTotalAnos') || '0',
        meses: formData.get('tiempoTotalMeses') || '0'
      }
    },

    // Declaración
    lugarDiligenciamiento: formData.get('lugarDiligenciamiento'),
    fechaDiligenciamiento: formData.get('fechaDiligenciamiento'),
    aceptaDeclaracion: formData.get('aceptaDeclaracion') === 'on'
  };

  // Recolectar formación académica
  for (let i = 1; i <= formacionCount; i++) {
    const modalidad = formData.get(`formacion_modalidad_${i}`);
    if (modalidad) {
      data.formacionAcademica.push({
        modalidad: modalidad,
        semestres: formData.get(`formacion_semestres_${i}`),
        graduado: formData.get(`formacion_graduado_${i}`),
        titulo: formData.get(`formacion_titulo_${i}`),
        mesTerminacion: formData.get(`formacion_mes_${i}`),
        anoTerminacion: formData.get(`formacion_ano_${i}`),
        tarjetaProfesional: formData.get(`formacion_tarjeta_${i}`)
      });
    }
  }

  // Recolectar idiomas
  for (let i = 1; i <= idiomaCount; i++) {
    const idioma = formData.get(`idioma_nombre_${i}`);
    if (idioma) {
      data.idiomas.push({
        idioma: idioma,
        habla: formData.get(`idioma_habla_${i}`),
        lee: formData.get(`idioma_lee_${i}`),
        escribe: formData.get(`idioma_escribe_${i}`)
      });
    }
  }

  // Recolectar experiencia laboral
  for (let i = 1; i <= experienciaCount; i++) {
    const empresa = formData.get(`experiencia_empresa_${i}`);
    if (empresa) {
      data.experienciaLaboral.push({
        empresa: empresa,
        tipo: formData.get(`experiencia_tipo_${i}`),
        pais: formData.get(`experiencia_pais_${i}`),
        departamento: formData.get(`experiencia_depto_${i}`),
        municipio: formData.get(`experiencia_municipio_${i}`),
        emailEntidad: formData.get(`experiencia_email_${i}`),
        telefonos: formData.get(`experiencia_telefono_${i}`),
        cargo: formData.get(`experiencia_cargo_${i}`),
        dependencia: formData.get(`experiencia_dependencia_${i}`),
        direccion: formData.get(`experiencia_direccion_${i}`),
        fechaIngreso: formData.get(`experiencia_ingreso_${i}`),
        fechaRetiro: formData.get(`experiencia_retiro_${i}`)
      });
    }
  }

  return data;
}

// Manejar envío del formulario
async function handleSubmit(e) {
  e.preventDefault();

  if (!validateCurrentStep()) {
    return;
  }

  // Recolectar datos
  const formData = collectFormData();

  // Mostrar loader
  document.getElementById('loadingOverlay').style.display = 'flex';

  try {
    const response = await fetch('/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error('Error al generar el PDF');
    }

    // Descargar PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FUHV_${formData.primerApellido}_${formData.primerNombre}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    // Ocultar loader
    document.getElementById('loadingOverlay').style.display = 'none';

    // Mensaje de éxito
    alert('¡Hoja de Vida generada exitosamente! El archivo se ha descargado.');

  } catch (error) {
    console.error('Error:', error);
    document.getElementById('loadingOverlay').style.display = 'none';
    alert('Ocurrió un error al generar la Hoja de Vida. Por favor intente nuevamente.');
  }
}
