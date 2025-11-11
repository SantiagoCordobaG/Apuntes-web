<template>
  <div class="documents-section">
    <!-- Card de búsqueda y filtros -->
    <el-card class="search-card">
      <template #header>
        <div class="card-header">
          <h2>🔍 Búsqueda y Filtros</h2>
        </div>
      </template>

      <el-form :model="searchForm" class="search-form">
        <!-- Búsqueda principal -->
        <el-row :gutter="20">
          <el-col :xs="24" :sm="16" :md="16">
            <el-form-item label="Buscar">
              <el-input
                v-model="searchForm.query"
                placeholder="Buscar por título, descripción, autor o etiquetas..."
                clearable
                @input="aplicarFiltros"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
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
              <!-- Tipo de archivo -->
              <el-col :xs="24" :sm="8" :md="8">
                <el-form-item label="Tipo de archivo">
                  <el-select v-model="searchForm.fileType" @change="aplicarFiltros" style="width: 100%">
                    <el-option label="Todos" value="all" />
                    <el-option label="PDF" value="pdf" />
                    <el-option label="Word" value="docx" />
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- Autor -->
              <el-col :xs="24" :sm="8" :md="8">
                <el-form-item label="Autor">
                  <el-select
                    v-model="searchForm.authors"
                    multiple
                    filterable
                    placeholder="Seleccionar autores"
                    @change="aplicarFiltros"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="author in availableAuthors"
                      :key="author"
                      :label="author"
                      :value="author"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- Etiquetas -->
              <el-col :xs="24" :sm="8" :md="8">
                <el-form-item label="Etiquetas">
                  <el-select
                    v-model="searchForm.selectedTags"
                    multiple
                    filterable
                    placeholder="Seleccionar etiquetas"
                    @change="aplicarFiltros"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="tag in availableTags"
                      :key="tag"
                      :label="tag"
                      :value="tag"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <!-- Valoración mínima -->
              <el-col :xs="24" :sm="8" :md="8">
                <el-form-item label="Valoración mínima">
                  <el-rate
                    v-model="searchForm.minRating"
                    @change="aplicarFiltros"
                    :max="5"
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                  />
                </el-form-item>
              </el-col>

              <!-- Descargas mínimas -->
              <el-col :xs="24" :sm="8" :md="8">
                <el-form-item label="Mínimo de descargas">
                  <el-input-number
                    v-model="searchForm.minDownloads"
                    :min="0"
                    @change="aplicarFiltros"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>

              <!-- Botón limpiar filtros -->
              <el-col :xs="24" :sm="8" :md="8">
                <el-form-item label=" ">
                  <el-button @click="limpiarFiltros" style="width: 100%">
                    <el-icon><Refresh /></el-icon>
                    Limpiar Filtros
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-card>

    <!-- Card de documentos -->
    <el-card class="documents-card">
      <template #header>
        <div class="card-header">
          <h2>📚 Documentos Disponibles</h2>
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

      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="3" animated />
      </div>

      <div v-else-if="documentosFiltrados.length === 0" class="empty-state">
        <el-empty description="No se encontraron documentos">
          <el-button type="primary" @click="limpiarFiltros" v-if="documentos.length > 0">
            Limpiar filtros
          </el-button>
        </el-empty>
      </div>

      <div v-else class="documents-grid">
        <el-card v-for="doc in documentosFiltrados" :key="doc._id" class="document-card" shadow="hover">
          <div class="document-header">
            <div class="document-icon">
              <el-icon v-if="doc.fileType === 'pdf'" class="file-icon pdf"><Document /></el-icon>
              <el-icon v-else class="file-icon word"><Document /></el-icon>
            </div>

            <div class="document-info">
              <h3 class="document-title">{{ doc.title }}</h3>
              <p class="document-description">{{ doc.description }}</p>
              
              <!-- Etiquetas -->
              <div class="document-tags" v-if="doc.tags && doc.tags.length > 0">
                <el-tag
                  v-for="tag in doc.tags.slice(0, 3)"
                  :key="tag"
                  size="small"
                  type="info"
                  class="tag-item"
                >
                  {{ tag }}
                </el-tag>
                <el-tag v-if="doc.tags.length > 3" size="small" type="info">
                  +{{ doc.tags.length - 3 }}
                </el-tag>
              </div>

              <div class="document-meta">
                <span class="author">Por: {{ doc.author }}</span>
                <span class="date">{{ formatearFecha(doc.uploadDate) }}</span>
                <span class="size">{{ doc.fileSize }}</span>
              </div>
            </div>
          </div>

          <div class="document-stats">
            <div class="rating-section">
              <el-rate v-model="doc.rating" disabled show-score text-color="#ff9900" score-template="{value}" />
              <span class="rating-count">({{ doc.ratingCount || 0 }} valoraciones)</span>
            </div>
            <div class="download-count">
              <el-icon><Download /></el-icon>
              {{ doc.downloadCount || 0 }} descargas
            </div>
          </div>

          <div class="document-actions">
            <el-button type="primary" @click="descargarDocumento(doc)">
              <el-icon><Download /></el-icon>
              Descargar
            </el-button>
            <el-button @click="verDetalles(doc._id)">
              <el-icon><View /></el-icon>
              Ver Detalles
            </el-button>
            <el-button type="warning" @click="abrirDialogoValoracion(doc)">
              <el-icon><Star /></el-icon>
              Valorar
            </el-button>
          </div>
        </el-card>
      </div>
    </el-card>

    <!-- Diálogo de valoración -->
    <RatingDialog
      v-model="ratingDialogVisible"
      :document="documentoParaValorar"
      @rated="handleRatingSubmitted"
    />

    <!-- Diálogo de detalles -->
    <el-dialog v-model="dialogVisible" title="Detalles del Documento" width="600px">
      <div v-if="documentoSeleccionado" class="detalles">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="Título">{{ documentoSeleccionado.title }}</el-descriptions-item>
          <el-descriptions-item label="Descripción">{{ documentoSeleccionado.description }}</el-descriptions-item>
          <el-descriptions-item label="Autor">{{ documentoSeleccionado.author }}</el-descriptions-item>
          <el-descriptions-item label="Tipo">{{ documentoSeleccionado.fileType?.toUpperCase() }}</el-descriptions-item>
          <el-descriptions-item label="Tamaño">{{ documentoSeleccionado.fileSize }}</el-descriptions-item>
          <el-descriptions-item label="Fecha de subida">{{ formatearFecha(documentoSeleccionado.uploadDate) }}</el-descriptions-item>
          <el-descriptions-item label="Valoración">
            <el-rate v-model="documentoSeleccionado.rating" disabled show-score />
          </el-descriptions-item>
          <el-descriptions-item label="Descargas">{{ documentoSeleccionado.downloadCount || 0 }}</el-descriptions-item>
          <el-descriptions-item label="Etiquetas">
            <el-tag v-for="tag in documentoSeleccionado.tags" :key="tag" size="small" style="margin-right: 5px">{{ tag }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Document, Download, View, Search, Refresh, Star } from '@element-plus/icons-vue';
import RatingDialog from './RatingDialog.vue';

const documentos = ref([]);
const documentosFiltrados = ref([]);
const dialogVisible = ref(false);
const documentoSeleccionado = ref(null);
const loading = ref(false);
const activeCollapse = ref([]);
const ratingDialogVisible = ref(false);
const documentoParaValorar = ref(null);

// Formulario de búsqueda
const searchForm = ref({
  query: '',
  sortBy: 'uploadDate',
  fileType: 'all',
  authors: [],
  selectedTags: [],
  minRating: 0,
  minDownloads: 0
});

// Cargar documentos desde el backend
const cargarDocumentos = async () => {
  loading.value = true;
  try {
    const res = await fetch("http://localhost:3000/api/Documentos");
    if (res.ok) {
      documentos.value = await res.json();
      aplicarFiltros();
    } else {
      ElMessage.error("Error al cargar documentos");
    }
  } catch (err) {
    console.error("Error al cargar documentos:", err);
    ElMessage.error("Error al cargar documentos. Verifica que el backend esté corriendo.");
  } finally {
    loading.value = false;
  }
};

// Autores disponibles (extraídos de los documentos)
const availableAuthors = computed(() => {
  const authors = new Set();
  documentos.value.forEach(doc => {
    if (doc.author) {
      authors.add(doc.author);
    }
  });
  return Array.from(authors).sort();
});

// Etiquetas disponibles (extraídas de los documentos)
const availableTags = computed(() => {
  const tags = new Set();
  documentos.value.forEach(doc => {
    if (doc.tags && Array.isArray(doc.tags)) {
      doc.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
});

// Aplicar filtros y búsqueda
const aplicarFiltros = () => {
  let filtrados = [...documentos.value];

  // Filtro por búsqueda de texto
  if (searchForm.value.query) {
    const query = searchForm.value.query.toLowerCase();
    filtrados = filtrados.filter(doc => 
      doc.title?.toLowerCase().includes(query) ||
      doc.description?.toLowerCase().includes(query) ||
      doc.author?.toLowerCase().includes(query) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }

  // Filtro por tipo de archivo
  if (searchForm.value.fileType !== 'all') {
    filtrados = filtrados.filter(doc => doc.fileType === searchForm.value.fileType);
  }

  // Filtro por autores
  if (searchForm.value.authors.length > 0) {
    filtrados = filtrados.filter(doc => 
      searchForm.value.authors.includes(doc.author)
    );
  }

  // Filtro por etiquetas
  if (searchForm.value.selectedTags.length > 0) {
    filtrados = filtrados.filter(doc => 
      doc.tags && doc.tags.some(tag => searchForm.value.selectedTags.includes(tag))
    );
  }

  // Filtro por valoración mínima
  if (searchForm.value.minRating > 0) {
    filtrados = filtrados.filter(doc => 
      (doc.rating || 0) >= searchForm.value.minRating
    );
  }

  // Filtro por descargas mínimas
  if (searchForm.value.minDownloads > 0) {
    filtrados = filtrados.filter(doc => 
      (doc.downloadCount || 0) >= searchForm.value.minDownloads
    );
  }

  // Ordenamiento
  filtrados.sort((a, b) => {
    switch (searchForm.value.sortBy) {
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'downloadCount':
        return (b.downloadCount || 0) - (a.downloadCount || 0);
      case 'uploadDateAsc':
        return new Date(a.uploadDate) - new Date(b.uploadDate);
      case 'uploadDate':
      default:
        return new Date(b.uploadDate) - new Date(a.uploadDate);
    }
  });

  documentosFiltrados.value = filtrados;
};

// Limpiar todos los filtros
const limpiarFiltros = () => {
  searchForm.value = {
    query: '',
    sortBy: 'uploadDate',
    fileType: 'all',
    authors: [],
    selectedTags: [],
    minRating: 0,
    minDownloads: 0
  };
  aplicarFiltros();
};

const verDetalles = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/Documentos/${id}`);
    if (res.ok) {
      documentoSeleccionado.value = await res.json();
      dialogVisible.value = true;
    } else {
      ElMessage.error("Error al cargar detalles");
    }
  } catch (err) {
    ElMessage.error("Error al cargar detalles");
  }
};

const descargarDocumento = async (doc) => {
  try {
    // Llamar al endpoint de descarga
    const res = await fetch(`http://localhost:3000/api/Documentos/download/${doc._id}`);
    
    if (!res.ok) {
      try {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al obtener el archivo');
      } catch (e) {
        throw new Error('Error al obtener el archivo');
      }
    }

    // Verificar si la respuesta es un archivo (binary) o JSON (fallback)
    const contentType = res.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      // Fallback: si el backend devuelve JSON
      const data = await res.json();
      const link = document.createElement('a');
      link.href = data.fileUrl;
      link.target = '_blank';
      link.download = data.fileName || doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Descargar el archivo directamente desde el backend
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Obtener el nombre del archivo del header Content-Disposition o usar el nombre del documento
      let fileName = doc.fileName || `documento.${doc.fileType || 'pdf'}`;
      const contentDisposition = res.headers.get('content-disposition');
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, '');
          try {
            fileName = decodeURIComponent(fileName);
          } catch (e) {
            // Si falla la decodificación, usar el nombre tal cual
          }
        }
      }
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    }
    
    ElMessage.success(`Descargando ${doc.title}`);
    
    // Actualizar contador localmente y recargar documentos
    doc.downloadCount = (doc.downloadCount || 0) + 1;
    // Opcional: recargar documentos para obtener datos actualizados
    // cargarDocumentos();
  } catch (error) {
    console.error('Error al descargar:', error);
    ElMessage.error('Error al descargar el documento: ' + error.message);
  }
};

const formatearFecha = (fecha) => {
  if (!fecha) return 'Fecha no disponible';
  try {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return fecha;
  }
};

const abrirDialogoValoracion = (doc) => {
  documentoParaValorar.value = doc;
  ratingDialogVisible.value = true;
};

const handleRatingSubmitted = (data) => {
  // Actualizar el documento en la lista con la nueva valoración
  const docIndex = documentos.value.findIndex(d => d._id === data.documentId);
  if (docIndex !== -1 && data.documento) {
    documentos.value[docIndex].rating = data.documento.rating;
    documentos.value[docIndex].ratingCount = data.documento.ratingCount;
    // Actualizar también en documentosFiltrados si existe
    const filteredIndex = documentosFiltrados.value.findIndex(d => d._id === data.documentId);
    if (filteredIndex !== -1) {
      documentosFiltrados.value[filteredIndex].rating = data.documento.rating;
      documentosFiltrados.value[filteredIndex].ratingCount = data.documento.ratingCount;
    }
  }
};

onMounted(() => {
  cargarDocumentos();
});
</script>

<style scoped>
.documents-section {
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-card, .documents-card {
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cardSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.search-card {
  animation-delay: 0.1s;
}

.documents-card {
  animation-delay: 0.2s;
}

.search-card:hover, .documents-card:hover {
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.card-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
}

.results-info {
  display: flex;
  align-items: center;
}

.results-count {
  font-size: 14px;
  color: #909399;
}

.search-form {
  margin-top: 10px;
}

.filters-collapse {
  margin-top: 20px;
}

.loading-state {
  padding: 20px;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;
  padding: 0;
  background: transparent;
}

.document-card {
  border-radius: 12px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  animation: cardFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.01) 100%);
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.document-card:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px) scale(1.01);
}

.document-card:hover::before {
  opacity: 1;
}

.document-card:active {
  transform: translateY(-2px) scale(0.99);
  transition: all 0.1s ease;
}

.document-header {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.file-icon {
  font-size: 32px;
}

.file-icon.pdf {
  color: #e74c3c;
}

.file-icon.word {
  color: #2b579a;
}

.document-info {
  flex: 1;
}

.document-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.5;
  letter-spacing: -0.2px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
}

.document-description {
  color: #666666;
  font-size: 14px;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.6;
  font-weight: 400;
}

.document-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.tag-item {
  margin: 0;
}

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

.document-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

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

.rating-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-count {
  font-size: 12px;
  color: #909399;
}

.download-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.document-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.document-actions :deep(.el-button) {
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.document-actions :deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.document-actions :deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  font-size: 13px;
  padding: 8px 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  color: #1a1a1a;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

.document-actions :deep(.el-button:hover::before) {
  width: 200px;
  height: 200px;
}

.document-actions :deep(.el-button:hover) {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.document-actions :deep(.el-button:active) {
  transform: translateY(0) scale(0.98);
}

.document-actions :deep(.el-button--primary) {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #ffffff;
}

.document-actions :deep(.el-button--primary::before) {
  background: rgba(255, 255, 255, 0.2);
}

.document-actions :deep(.el-button--primary:hover) {
  background: #333333;
  border-color: #333333;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.document-actions :deep(.el-button--warning) {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(0, 0, 0, 0.1);
  color: #1a1a1a;
}

.document-actions :deep(.el-button--warning:hover) {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.15);
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

@media (max-width: 768px) {
  .documents-grid {
    grid-template-columns: 1fr;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .document-actions {
    flex-direction: column;
  }

  .document-actions .el-button {
    width: 100%;
  }
}
</style>
