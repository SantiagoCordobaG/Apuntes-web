<template>
  <div class="documents-section fade-in-up">
    <!-- Card de búsqueda y filtros -->
    <el-card class="search-card glass-card glass-card--soft card-slide-in">
      <template #header>
        <div class="card-header">
          <h2 class="card-title">🔍 Búsqueda y Filtros</h2>
        </div>
      </template>

      <el-form :model="searchForm" class="search-form">
        <!-- Búsqueda y ordenamiento principal -->
        <el-row :gutter="20">
          <el-col :xs="24" :sm="16" :md="16">
            <el-form-item label="Buscar">
              <el-input v-model="searchForm.query" placeholder="Buscar por título, descripción, autor o etiquetas..." clearable @input="aplicarFiltros">
                <template #prefix><el-icon><Search /></el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8">
            <el-form-item label="Ordenar por">
              <el-select v-model="searchForm.sortBy" @change="aplicarFiltros" style="width: 100%">
                <el-option label="Fecha (más reciente)" value="uploadDate" />
                <el-option label="Fecha (más antiguo)" value="uploadDateAsc" />
                <el-option label="Título A-Z" value="title" />
                <el-option label="Valoración" value="rating" />
                <el-option label="Descargas" value="downloadCount" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Filtros avanzados (colapsable) -->
        <el-collapse v-model="activeCollapse" class="filters-collapse">
          <el-collapse-item title="Filtros Avanzados" name="filters">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="8" :md="8">
                <el-form-item label="Tipo de archivo">
                  <el-select v-model="searchForm.fileType" @change="aplicarFiltros" style="width: 100%">
                    <el-option label="Todos" value="all" /><el-option label="PDF" value="pdf" /><el-option label="Word" value="docx" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8">
                <el-form-item label="Autor">
                  <el-select v-model="searchForm.authors" multiple filterable placeholder="Seleccionar autores" @change="aplicarFiltros" style="width: 100%">
                    <el-option v-for="author in availableAuthors" :key="author" :label="author" :value="author" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8">
                <el-form-item label="Etiquetas">
                  <el-select v-model="searchForm.selectedTags" multiple filterable placeholder="Seleccionar etiquetas" @change="aplicarFiltros" style="width: 100%">
                    <el-option v-for="tag in availableTags" :key="tag" :label="tag" :value="tag" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="8" :md="8">
                <el-form-item label="Valoración mínima">
                  <el-rate v-model="searchForm.minRating" @change="aplicarFiltros" :max="5" show-score text-color="#ff9900" score-template="{value}" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8">
                <el-form-item label="Mínimo de descargas">
                  <el-input-number v-model="searchForm.minDownloads" :min="0" @change="aplicarFiltros" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8">
                <el-form-item label=" ">
                  <el-button @click="limpiarFiltros" style="width: 100%"><el-icon><Refresh /></el-icon> Limpiar Filtros</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-card>

    <!-- Card de documentos -->
    <el-card class="documents-card glass-card glass-card--soft card-slide-in">
      <template #header>
        <div class="card-header">
          <h2 class="card-title">📚 Documentos Disponibles</h2>
          <div class="results-info">
            <span v-if="documentosFiltrados.length !== documentos.length" class="results-count">
              Mostrando {{ documentosFiltrados.length }} de {{ documentos.length }} documentos
            </span>
            <span v-else class="results-count">
              {{ documentos.length }} documentos disponibles
            </span>
          </div>
        </div>
      </template>

      <el-skeleton v-if="loading" :rows="3" animated class="loading-state" />
      <el-empty v-else-if="documentosFiltrados.length === 0" description="No se encontraron documentos">
        <el-button v-if="documentos.length > 0" type="primary" @click="limpiarFiltros">Limpiar filtros</el-button>
      </el-empty>
      <div v-else class="documents-grid">
        <el-card v-for="doc in documentosFiltrados" :key="doc._id" class="document-card glass-card card-fade-in" shadow="hover">
          <div class="document-header">
            <el-icon :class="['file-icon', doc.fileType === 'pdf' ? 'pdf' : 'word']"><Document /></el-icon>
            <div class="document-info">
              <h3 class="document-title">{{ doc.title }}</h3>
              <p class="document-description">{{ doc.description }}</p>
              <div v-if="doc.tags?.length" class="document-tags">
                <el-tag v-for="tag in doc.tags.slice(0, 3)" :key="tag" size="small" type="info" class="tag-item">{{ tag }}</el-tag>
                <el-tag v-if="doc.tags.length > 3" size="small" type="info">+{{ doc.tags.length - 3 }}</el-tag>
              </div>
              <div class="document-meta">
                <span>Por: {{ doc.author }}</span>
                <span>{{ formatearFecha(doc.uploadDate) }}</span>
                <span>{{ doc.fileSize }}</span>
              </div>
            </div>
          </div>
          <div class="document-stats">
            <div class="rating-section">
              <el-rate v-model="doc.rating" disabled show-score text-color="#ff9900" score-template="{value}" />
              <span class="rating-count">({{ doc.ratingCount || 0 }} valoraciones)</span>
            </div>
            <div class="download-count"><el-icon><Download /></el-icon> {{ doc.downloadCount || 0 }} descargas</div>
          </div>
          <div class="document-actions">
            <el-button type="primary" @click="descargarDocumentoHandler(doc)"><el-icon><Download /></el-icon> Descargar</el-button>
            <el-button @click="verDetalles(doc._id)"><el-icon><View /></el-icon> Ver Detalles</el-button>
            <el-button type="warning" @click="abrirDialogoValoracion(doc)"><el-icon><Star /></el-icon> Valorar</el-button>
          </div>
        </el-card>
      </div>
    </el-card>

    <!-- Diálogo de valoración -->
    <DialogoValoracion
      v-model="ratingDialogVisible"
      :document="documentoParaValorar"
      @rated="handleRatingSubmitted"
    />

    <!-- Diálogo de detalles del documento -->
    <el-dialog v-model="dialogVisible" title="Detalles del Documento" width="600px">
      <el-descriptions v-if="documentoSeleccionado" :column="1" border>
        <el-descriptions-item label="Título">{{ documentoSeleccionado.title }}</el-descriptions-item>
        <el-descriptions-item label="Descripción">{{ documentoSeleccionado.description }}</el-descriptions-item>
        <el-descriptions-item label="Autor">{{ documentoSeleccionado.author }}</el-descriptions-item>
        <el-descriptions-item label="Tipo">{{ documentoSeleccionado.fileType?.toUpperCase() }}</el-descriptions-item>
        <el-descriptions-item label="Tamaño">{{ documentoSeleccionado.fileSize }}</el-descriptions-item>
        <el-descriptions-item label="Fecha de subida">{{ formatearFecha(documentoSeleccionado.uploadDate) }}</el-descriptions-item>
        <el-descriptions-item label="Valoración"><el-rate v-model="documentoSeleccionado.rating" disabled show-score /></el-descriptions-item>
        <el-descriptions-item label="Descargas">{{ documentoSeleccionado.downloadCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="Etiquetas">
          <el-tag v-for="tag in documentoSeleccionado.tags" :key="tag" size="small" style="margin-right: 5px">{{ tag }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<!--
  ============================================
  COMPONENTE: ListaDocumentos
  ============================================
  
  DESCRIPCIÓN:
  Muestra todos los documentos disponibles en el sistema con funcionalidades avanzadas de
  búsqueda, filtrado y ordenamiento. Es el componente principal para explorar documentos.
  
  QUÉ HACE:
  - Carga y muestra todos los documentos del servidor
  - Permite buscar documentos por texto (título, descripción, autor, etiquetas)
  - Filtra por tipo de archivo, autor, etiquetas, valoración y número de descargas
  - Ordena por fecha, título, valoración o número de descargas
  - Permite descargar documentos
  - Permite valorar documentos con estrellas y comentarios
  - Muestra detalles completos de cada documento
-->
<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Document, Download, View, Search, Refresh, Star } from '@element-plus/icons-vue';
import DialogoValoracion from './DialogoValoracion.vue';
import { obtenerDocumentos, obtenerDocumentoPorId, descargarDocumento } from '@/services/servicioDocumentos';

// ===== ESTADOS (datos reactivos que cambian y actualizan la vista) =====
const documentos = ref([]); // Lista completa de documentos del servidor
const documentosFiltrados = ref([]); // Documentos después de aplicar filtros y búsqueda
const loading = ref(false); // true = muestra spinner de carga
const dialogVisible = ref(false); // true = muestra diálogo de detalles
const documentoSeleccionado = ref(null); // Documento seleccionado para ver detalles
const activeCollapse = ref([]); // Controla qué secciones de filtros están abiertas
const ratingDialogVisible = ref(false); // true = muestra diálogo de valoración
const documentoParaValorar = ref(null); // Documento que el usuario quiere valorar

// Formulario con todos los filtros y búsqueda
const searchForm = ref({
  query: '', // Texto de búsqueda (busca en título, descripción, autor, etiquetas)
  sortBy: 'uploadDate', // Criterio de ordenamiento (uploadDate, title, rating, downloadCount)
  fileType: 'all', // Tipo de archivo (all, pdf, docx)
  authors: [], // Autores seleccionados para filtrar
  selectedTags: [], // Etiquetas seleccionadas para filtrar
  minRating: 0, // Valoración mínima (0-5 estrellas)
  minDownloads: 0 // Número mínimo de descargas
});

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

// Carga todos los documentos desde el servidor
const cargarDocumentos = async () => {
  loading.value = true;
  try {
    documentos.value = await obtenerDocumentos(); // Pide documentos al backend
    aplicarFiltros(); // Aplica los filtros actuales
  } catch (err) {
    console.error("Error al cargar documentos:", err);
  } finally {
    loading.value = false;
  }
};

// Lista de autores únicos extraídos de todos los documentos (para el selector de filtros)
// Se calcula automáticamente cuando cambian los documentos
const availableAuthors = computed(() => {
  const authors = new Set();
  documentos.value.forEach(doc => doc.author && authors.add(doc.author));
  return Array.from(authors).sort();
});

// Lista de etiquetas únicas extraídas de todos los documentos (para el selector de filtros)
// Se calcula automáticamente cuando cambian los documentos
const availableTags = computed(() => {
  const tags = new Set();
  documentos.value.forEach(doc => doc.tags?.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
});

// Aplica todos los filtros y ordena los documentos
// Se ejecuta cada vez que cambia algún filtro o la búsqueda
const aplicarFiltros = () => {
  let filtrados = [...documentos.value];
  const { query, fileType, authors, selectedTags, minRating, minDownloads, sortBy } = searchForm.value;

  // 1. Filtro por texto de búsqueda (busca en título, descripción, autor y etiquetas)
  if (query) {
    const q = query.toLowerCase();
    filtrados = filtrados.filter(doc => 
      doc.title?.toLowerCase().includes(q) ||
      doc.description?.toLowerCase().includes(q) ||
      doc.author?.toLowerCase().includes(q) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(q))
    );
  }

  // 2. Aplicar todos los demás filtros
  if (fileType !== 'all') filtrados = filtrados.filter(doc => doc.fileType === fileType);
  if (authors.length) filtrados = filtrados.filter(doc => authors.includes(doc.author));
  if (selectedTags.length) filtrados = filtrados.filter(doc => doc.tags?.some(tag => selectedTags.includes(tag)));
  if (minRating > 0) filtrados = filtrados.filter(doc => (doc.rating || 0) >= minRating);
  if (minDownloads > 0) filtrados = filtrados.filter(doc => (doc.downloadCount || 0) >= minDownloads);

  // 3. Ordenar los resultados según el criterio seleccionado
  filtrados.sort((a, b) => {
    const sortFunc = {
      title: () => (a.title || '').localeCompare(b.title || ''),
      rating: () => (b.rating || 0) - (a.rating || 0),
      downloadCount: () => (b.downloadCount || 0) - (a.downloadCount || 0),
      uploadDateAsc: () => new Date(a.uploadDate) - new Date(b.uploadDate),
      uploadDate: () => new Date(b.uploadDate) - new Date(a.uploadDate) // Más reciente primero (por defecto)
    };
    return (sortFunc[sortBy] || sortFunc.uploadDate)();
  });

  documentosFiltrados.value = filtrados;
};

// Limpia todos los filtros y muestra todos los documentos nuevamente
const limpiarFiltros = () => {
  Object.assign(searchForm.value, { query: '', sortBy: 'uploadDate', fileType: 'all', authors: [], selectedTags: [], minRating: 0, minDownloads: 0 });
  aplicarFiltros();
};

// Muestra el diálogo con todos los detalles del documento seleccionado
const verDetalles = async (id) => {
  try {
    documentoSeleccionado.value = await obtenerDocumentoPorId(id);
    dialogVisible.value = true;
  } catch (err) {
    console.error("Error al cargar detalles:", err);
  }
};

// Descarga un documento del servidor y lo guarda en el dispositivo del usuario
const descargarDocumentoHandler = async (doc) => {
  try {
    const blob = await descargarDocumento(doc._id); // Obtener archivo como Blob
    const url = window.URL.createObjectURL(blob); // Crear URL temporal
    const fileName = doc.fileName || `documento.${doc.fileType || 'pdf'}`;
    
    // Crear enlace temporal y simular click para descargar
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Limpiar después de 100ms
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    
    ElMessage.success(`Descargando ${doc.title}`);
    doc.downloadCount = (doc.downloadCount || 0) + 1; // Actualizar contador local
  } catch (error) {
    console.error('Error al descargar:', error);
  }
};

// Formatea una fecha a formato legible en español (ej: "15 de marzo de 2024")
const formatearFecha = (fecha) => {
  if (!fecha) return 'Fecha no disponible';
  try {
    return new Date(fecha).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return fecha;
  }
};

// Abre el diálogo para que el usuario valore un documento
const abrirDialogoValoracion = (doc) => {
  documentoParaValorar.value = doc;
  ratingDialogVisible.value = true;
};

// Se ejecuta cuando el usuario completa una valoración (llamado desde DialogoValoracion)
// Actualiza la valoración del documento tanto en la lista completa como en la filtrada
const handleRatingSubmitted = (data) => {
  const docIndex = documentos.value.findIndex(d => d._id === data.documentId);
  if (docIndex !== -1 && data.documento) {
    // Actualizar en lista completa
    documentos.value[docIndex].rating = data.documento.rating;
    documentos.value[docIndex].ratingCount = data.documento.ratingCount;
    // Actualizar en lista filtrada si existe
    const filteredIndex = documentosFiltrados.value.findIndex(d => d._id === data.documentId);
    if (filteredIndex !== -1) {
      documentosFiltrados.value[filteredIndex].rating = data.documento.rating;
      documentosFiltrados.value[filteredIndex].ratingCount = data.documento.ratingCount;
    }
  }
};

// Al cargar el componente, cargar los documentos
onMounted(() => cargarDocumentos());
</script>

<style scoped>
/* ===== CONTENEDOR PRINCIPAL ===== */
.documents-section { max-width: 1200px; margin: 0 auto; }

/* ===== TARJETAS DE BÚSQUEDA Y DOCUMENTOS ===== */
.search-card, .documents-card {
  margin-bottom: 24px;
  overflow: hidden;
  transition: var(--transition-base);
}
.search-card { animation-delay: 0.1s; }
.documents-card { animation-delay: 0.2s; }
.search-card:hover, .documents-card:hover {
  border-color: var(--border-color-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* ===== INFORMACIÓN DE RESULTADOS ===== */
.results-info { display: flex; align-items: center; }
.results-count { font-size: 14px; color: #909399; }

/* ===== FORMULARIO Y FILTROS ===== */
.search-form { margin-top: 10px; }
.filters-collapse { margin-top: 20px; }
.loading-state { padding: 20px; }

/* ===== GRID DE DOCUMENTOS ===== */
.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;
  padding: 0;
}

/* ===== TARJETA INDIVIDUAL DE DOCUMENTO ===== */
.document-card {
  border-radius: 12px;
  transition: var(--transition-base);
  overflow: hidden;
  position: relative;
}
.document-card:nth-child(1) { animation-delay: 0.1s; }
.document-card:nth-child(2) { animation-delay: 0.15s; }
.document-card:nth-child(3) { animation-delay: 0.2s; }
.document-card:nth-child(4) { animation-delay: 0.25s; }
.document-card:nth-child(5) { animation-delay: 0.3s; }
.document-card:nth-child(6) { animation-delay: 0.35s; }
.document-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%);
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
.document-card:hover {
  background: var(--surface-strong);
  border-color: var(--border-color-strong);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px) scale(1.01);
}
.document-card:hover::before { opacity: 1; }
.document-card:active { transform: translateY(-2px) scale(0.99); transition: all 0.1s ease; }

/* ===== HEADER DEL DOCUMENTO (icono e información) ===== */
.document-header { display: flex; gap: 15px; margin-bottom: 15px; }
.file-icon { font-size: 32px; }
.file-icon.pdf { color: #e74c3c; }
.file-icon.word { color: #2b579a; }
.document-info { flex: 1; }

/* ===== TÍTULO Y DESCRIPCIÓN ===== */
.document-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.5;
  letter-spacing: -0.2px;
  font-family: var(--font-family-base);
}
.document-description {
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.6;
}

/* ===== ETIQUETAS Y META INFORMACIÓN ===== */
.document-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.tag-item { margin: 0; }
.document-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 12px;
}
.document-meta span { display: flex; align-items: center; gap: 6px; }

/* ===== ESTADÍSTICAS (valoración y descargas) ===== */
.document-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 14px 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(90deg, transparent, #f8fafc, transparent);
}
.rating-section { display: flex; align-items: center; gap: 8px; }
.rating-count { font-size: 12px; color: #909399; }
.download-count { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #909399; }

/* ===== BOTONES DE ACCIÓN ===== */
.document-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.document-actions :deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  font-size: 13px;
  padding: 8px 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: var(--surface);
  backdrop-filter: blur(10px);
  color: var(--text-primary);
  transition: var(--transition-base);
  position: relative;
  overflow: hidden;
}
.document-actions :deep(.el-button::before) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}
.document-actions :deep(.el-button:hover::before) { width: 200px; height: 200px; }
.document-actions :deep(.el-button:hover) {
  background: var(--surface-strong);
  border-color: var(--border-color-strong);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.document-actions :deep(.el-button:active) { transform: translateY(0) scale(0.98); }
.document-actions :deep(.el-button--primary) {
  background: var(--text-primary);
  border-color: var(--text-primary);
  color: #ffffff;
}
.document-actions :deep(.el-button--primary::before) { background: rgba(255, 255, 255, 0.2); }
.document-actions :deep(.el-button--primary:hover) {
  background: #333333;
  border-color: #333333;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}
.document-actions :deep(.el-button--warning) {
  background: var(--surface);
  border-color: rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
}
.document-actions :deep(.el-button--warning:hover) {
  background: var(--surface-strong);
  border-color: var(--border-color-strong);
}

/* ===== RESPONSIVE (móviles) ===== */
@media (max-width: 768px) {
  .documents-grid { grid-template-columns: 1fr; }
  .card-header { flex-direction: column; align-items: flex-start; }
  .document-actions { flex-direction: column; }
  .document-actions .el-button { width: 100%; }
}
</style>
