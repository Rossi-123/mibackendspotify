const API_URL = '/api/spotify';

const state = {
  registros: [],
  editandoId: null
};

const elements = {};

document.addEventListener('DOMContentLoaded', () => {
  elements.form = document.getElementById('spotifyForm');
  elements.registroId = document.getElementById('registroId');
  elements.formTitle = document.getElementById('formTitle');
  elements.formSubtitle = document.getElementById('formSubtitle');
  elements.formModeBadge = document.getElementById('formModeBadge');
  elements.submitButton = document.getElementById('submitButton');
  elements.resetButton = document.getElementById('resetButton');
  elements.cancelButton = document.getElementById('cancelButton');
  elements.reloadButton = document.getElementById('reloadButton');
  elements.tableBody = document.getElementById('recordsTableBody');
  elements.messageContainer = document.getElementById('messageContainer');
  elements.loadingIndicator = document.getElementById('loadingIndicator');
  elements.recordCounter = document.getElementById('recordCounter');
  elements.connectionBadge = document.getElementById('connectionBadge');
  elements.connectionText = document.getElementById('connectionText');

  elements.form.addEventListener('submit', enviarFormulario);
  elements.resetButton.addEventListener('click', limpiarFormulario);
  elements.cancelButton.addEventListener('click', limpiarFormulario);
  elements.reloadButton.addEventListener('click', cargarRegistros);
  elements.tableBody.addEventListener('click', manejarAccionesTabla);

  cargarRegistros();
});

async function cargarRegistros() {
  setLoading(true);
  actualizarEstadoConexion('Sincronizando', 'Consultando el directorio corporativo...', 'secondary');

  try {
    const respuesta = await fetch(API_URL);
    const resultado = await procesarRespuesta(respuesta);
    state.registros = Array.isArray(resultado.data) ? resultado.data : [];
    renderizarRegistros();
    actualizarEstadoConexion('Conectado', 'El directorio se actualizó desde la API.', 'success');
  } catch (error) {
    state.registros = [];
    renderizarRegistros();
    actualizarEstadoConexion('Sin conexión', 'Error al comunicarse con la API.', 'danger');
    mostrarMensaje(error.message || 'Error al comunicarse con la API.', 'danger');
  } finally {
    setLoading(false);
  }
}

async function enviarFormulario(event) {
  event.preventDefault();

  if (!elements.form.checkValidity()) {
    elements.form.reportValidity();
    mostrarMensaje('Completa los campos obligatorios antes de guardar la ficha.', 'warning');
    return;
  }

  const datos = obtenerDatosFormulario();
  const esEdicion = Boolean(state.editandoId);
  const url = esEdicion ? `${API_URL}/${state.editandoId}` : API_URL;
  const metodo = esEdicion ? 'PUT' : 'POST';

  setLoading(true);

  try {
    const respuesta = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });
    const resultado = await procesarRespuesta(respuesta);

    if (esEdicion) {
      state.registros = state.registros.map((registro) =>
        registro._id === resultado.data._id ? resultado.data : registro
      );
      mostrarMensaje('Ficha actualizada sin errores.', 'success');
    } else {
      state.registros = [resultado.data, ...state.registros];
      mostrarMensaje('Ficha corporativa guardada correctamente.', 'success');
    }

    renderizarRegistros();
    limpiarFormulario(false);
  } catch (error) {
    mostrarMensaje(error.message || 'No fue posible guardar la ficha corporativa.', 'danger');
  } finally {
    setLoading(false);
  }
}

async function cargarRegistroParaEditar(id) {
  setLoading(true);

  try {
    const respuesta = await fetch(`${API_URL}/${id}`);
    const resultado = await procesarRespuesta(respuesta);
    llenarFormulario(resultado.data);
    mostrarMensaje('Ficha lista para edición.', 'info');
  } catch (error) {
    mostrarMensaje(error.message || 'No se pudo abrir la ficha seleccionada.', 'danger');
  } finally {
    setLoading(false);
  }
}

async function eliminarRegistro(id) {
  const registro = state.registros.find((item) => item._id === id);
  const nombre = registro ? registro.nombreEmpresa : 'esta ficha';
  const confirmar = window.confirm(`¿Deseas quitar ${nombre} del directorio?`);

  if (!confirmar) {
    return;
  }

  setLoading(true);

  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    await procesarRespuesta(respuesta);
    state.registros = state.registros.filter((item) => item._id !== id);
    renderizarRegistros();
    mostrarMensaje('Registro eliminado de la base de datos.', 'success');

    if (state.editandoId === id) {
      limpiarFormulario(false);
    }
  } catch (error) {
    mostrarMensaje(error.message || 'No fue posible quitar el registro.', 'danger');
  } finally {
    setLoading(false);
  }
}

function manejarAccionesTabla(event) {
  const boton = event.target.closest('button[data-action]');

  if (!boton) {
    return;
  }

  const { action, id } = boton.dataset;

  if (action === 'edit') {
    cargarRegistroParaEditar(id);
  }

  if (action === 'delete') {
    eliminarRegistro(id);
  }
}

function obtenerDatosFormulario() {
  const formData = new FormData(elements.form);
  const datos = {};

  for (const [campo, valor] of formData.entries()) {
    const valorLimpio = typeof valor === 'string' ? valor.trim() : valor;

    if (valorLimpio !== '') {
      datos[campo] = valorLimpio;
    }
  }

  datos.numeroEmpleados = Number.parseInt(datos.numeroEmpleados, 10);
  datos.ingresosAnuales = Number.parseFloat(datos.ingresosAnuales);

  return datos;
}

function llenarFormulario(registro) {
  state.editandoId = registro._id;
  elements.registroId.value = registro._id;

  setCampo('nombreEmpresa', registro.nombreEmpresa);
  setCampo('industria', registro.industria);
  setCampo('sede', registro.sede);
  setCampo('pais', registro.pais);
  setCampo('descripcion', registro.descripcion);
  setCampo('sitioWeb', registro.sitioWeb);
  setCampo('numeroEmpleados', registro.numeroEmpleados);
  setCampo('ingresosAnuales', registro.ingresosAnuales);
  setCampo('estado', registro.estado || 'Activa');
  setCampo('fechaFundacion', formatearFechaInput(registro.fechaFundacion));

  elements.formTitle.textContent = 'Editar ficha corporativa';
  elements.formSubtitle.textContent = 'Ajusta los datos de operación, presencia o métricas antes de actualizar MongoDB.';
  elements.formModeBadge.textContent = 'Modo edición';
  elements.formModeBadge.className = 'badge rounded-pill text-bg-primary';
  elements.submitButton.textContent = 'Actualizar ficha';
  elements.cancelButton.classList.remove('d-none');
  elements.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function limpiarFormulario(mostrarAviso = true) {
  elements.form.reset();
  state.editandoId = null;
  elements.registroId.value = '';
  elements.formTitle.textContent = 'Ficha corporativa Spotify';
  elements.formSubtitle.textContent = 'Registra una nueva ficha con datos de operación, ubicación y métricas empresariales.';
  elements.formModeBadge.textContent = 'Nueva ficha';
  elements.formModeBadge.className = 'badge rounded-pill text-bg-success';
  elements.submitButton.textContent = 'Guardar ficha';
  elements.cancelButton.classList.add('d-none');

  if (mostrarAviso) {
    mostrarMensaje('Formulario reiniciado y listo para una nueva ficha.', 'info');
  }
}

function renderizarRegistros() {
  if (state.registros.length === 0) {
    elements.tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-cell">No se encontraron registros para mostrar.</td>
      </tr>
    `;
    elements.recordCounter.textContent = '0 fichas disponibles en el directorio.';
    return;
  }

  elements.tableBody.innerHTML = state.registros.map((registro) => `
    <tr>
      <td>
        <span class="company-name">${escaparHtml(registro.nombreEmpresa)}</span>
        <span class="company-meta">${escaparHtml(registro.sede)} · ${escaparHtml(registro.sitioWeb)}</span>
      </td>
      <td class="category-cell">${escaparHtml(registro.industria)}</td>
      <td>${escaparHtml(registro.pais)}</td>
      <td><span class="badge badge-state ${claseEstado(registro.estado)}">${escaparHtml(registro.estado)}</span></td>
      <td>${formatearNumero(registro.numeroEmpleados)}</td>
      <td>
        <div class="action-group">
          <button class="btn btn-sm btn-outline-primary" type="button" data-action="edit" data-id="${registro._id}">Ver / Editar</button>
          <button class="btn btn-sm btn-outline-danger" type="button" data-action="delete" data-id="${registro._id}">Quitar</button>
        </div>
      </td>
    </tr>
  `).join('');

  elements.recordCounter.textContent = `${state.registros.length} ficha${state.registros.length === 1 ? '' : 's'} disponible${state.registros.length === 1 ? '' : 's'} en MongoDB.`;
}

function mostrarMensaje(mensaje, tipo = 'success') {
  elements.messageContainer.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${escaparHtml(mensaje)}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;
}

async function procesarRespuesta(respuesta) {
  const contentType = respuesta.headers.get('content-type') || '';
  const resultado = contentType.includes('application/json') ? await respuesta.json() : {};

  if (!respuesta.ok) {
    const detalles = Array.isArray(resultado.errors) ? ` ${resultado.errors.join(' ')}` : '';
    throw new Error(`${resultado.message || 'La solicitud no fue exitosa.'}${detalles}`);
  }

  return resultado;
}

function setCampo(id, valor) {
  document.getElementById(id).value = valor ?? '';
}

function setLoading(estaCargando) {
  elements.loadingIndicator.classList.toggle('d-none', !estaCargando);
  elements.submitButton.disabled = estaCargando;
  elements.resetButton.disabled = estaCargando;
  elements.reloadButton.disabled = estaCargando;
}

function actualizarEstadoConexion(etiqueta, texto, tipo) {
  elements.connectionBadge.textContent = etiqueta;
  elements.connectionBadge.className = `badge rounded-pill text-bg-${tipo}`;
  elements.connectionText.textContent = texto;
}

function formatearFechaInput(fecha) {
  if (!fecha) {
    return '';
  }

  return new Date(fecha).toISOString().slice(0, 10);
}

function formatearNumero(valor) {
  return Number(valor || 0).toLocaleString('es-CO');
}

function claseEstado(estado) {
  if (estado === 'Inactiva') {
    return 'inactive';
  }

  if (estado === 'En expansión') {
    return 'expanding';
  }

  return '';
}

function escaparHtml(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
