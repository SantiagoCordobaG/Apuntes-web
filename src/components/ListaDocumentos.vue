<template>
  <div class="documents-section fade-in-up">
    <el-card class="search-card glass-card glass-card--soft card-slide-in">
      <template #header>
        <div class="card-header">
          <h2 class="card-title">🔍 Búsqueda y Filtros</h2>
        </div>
      </template>
      <el-form :model="searchForm" class="search-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="16" :md="16">
            <el-form-item label="Buscar">
              <el-input v-model="searchForm.query" placeholder="Buscar..." clearable @input="aplicarFiltros">
                <template #prefix><el-icon><Search /></el-icon></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8">
            <el-form-item label="Ordenar por">
              <el-select v-model="searchForm.sortBy" @change="aplicarFiltros" class="w-full">
                <el-option label="Fecha (más reciente)" value="uploadDate" />
                <el-option label="Fecha (más antiguo)" value="uploadDateAsc" />
                <el-option label="Título A-Z" value="title" />
                <el-option label="Valoración" value="rating" />
                <el-option label="Descargas" value="downloadCount" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-collapse v-model="activeCollapse" class="filters-collapse">
          <el-collapse-item title="Filtros Avanzados" name="filters">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="8" :md="8">
                <el-form-item label="Tipo de archivo">
                  <el-select v-model="searchForm.fileType" @change="aplicarFiltros" class="w-full">
                    <el-option label="Todos" value="all" />
                    <el-option label="PDF" value="pdf" />
                    <el-option label="Word" value="docx" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8">
                <el-form-item label="Autor">
                  <el-select v-model="searchForm.authors" multiple filterable placeholder="Seleccionar autores" @change="aplicarFiltros" class="w-full">
                    <el-option v-for="author in availableAuthors" :key="author" :label="author" :value="author" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8">
                <el-form-item label="Etiquetas">
                  <el-select v-model="searchForm.selectedTags" multiple filterable placeholder="Seleccionar etiquetas" @change="aplicarFiltros" class="w-full">
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
                  <el-input-number v-model="searchForm.minDownloads" :min="0" @change="aplicarFiltros" class="w-full" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8">
                <el-form-item label=" ">
                  <el-button @click="limpiarFiltros" class="w-full"><el-icon><Refresh /></el-icon> Limpiar</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-card>

    <el-card class="documents-card glass-card glass-card--soft card-slide-in">
      <template #header>
        <div class="card-header">
          <h2 class="card-title">📚 Documentos Disponibles</h2>
          <div class="results-info">
            <span class="results-count">
              {{ documentosFiltrados.length !== documentos.length 
                ? `Mostrando ${documentosFiltrados.length} de ${documentos.length}` 
                : `${documentos.length} documentos disponibles` }}
            </span>
          </div>
        </div>
      </template>
      <el-skeleton v-if="loading" :rows="3" animated class="loading-state" />
      <el-empty v-else-if="documentosFiltrados.length === 0" description="No se encontraron documentos">
        <el-button v-if="documentos.length > 0" type="primary" @click="limpiarFiltros">Limpiar filtros</el-button>
      </el-empty>
      <div v-else class="documents-grid">
        <el-card v-for="doc in documentosFiltrados" :key="doc._id" class="document-card glass-card card-fade-in card-hover">
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
            <el-button type="warning" @click="abrirDialogoValoracion(doc)"><el-icon><Star /></el-icon> Valorar</el-button>
          </div>
        </el-card>
      </div>
    </el-card>
    <DialogoValoracion v-model="ratingDialogVisible" :document="documentoParaValorar" @rated="handleRatingSubmitted" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Document, Download, Search, Refresh, Star } from '@element-plus/icons-vue';
import DialogoValoracion from './DialogoValoracion.vue';
import { obtenerDocumentos, descargarDocumento } from '@/services/servicioDocumentos';

const documentos = ref([]);
const documentosFiltrados = ref([]);
const loading = ref(false);
const activeCollapse = ref([]);
const ratingDialogVisible = ref(false);
const documentoParaValorar = ref(null);

const searchForm = ref({
  query: '',
  sortBy: 'uploadDate',
  fileType: 'all',
  authors: [],
  selectedTags: [],
  minRating: 0,
  minDownloads: 0
});

const availableAuthors = computed(() => {
  const authors = new Set();
  documentos.value.forEach(doc => doc.author && authors.add(doc.author));
  return Array.from(authors).sort();
});

const availableTags = computed(() => {
  const tags = new Set();
  documentos.value.forEach(doc => doc.tags?.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
});

const cargarDocumentos = async () => {
  loading.value = true;
  try {
    documentos.value = await obtenerDocumentos();
    aplicarFiltros();
  } catch (err) {
    console.error("Error al cargar documentos:", err);
  } finally {
    loading.value = false;
  }
};

const aplicarFiltros = () => {
  let filtrados = [...documentos.value];
  const { query, fileType, authors, selectedTags, minRating, minDownloads, sortBy } = searchForm.value;

  if (query) {
    const q = query.toLowerCase();
    filtrados = filtrados.filter(doc => 
      doc.title?.toLowerCase().includes(q) ||
      doc.description?.toLowerCase().includes(q) ||
      doc.author?.toLowerCase().includes(q) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(q))
    );
  }

  if (fileType !== 'all') filtrados = filtrados.filter(doc => doc.fileType === fileType);
  if (authors.length) filtrados = filtrados.filter(doc => authors.includes(doc.author));
  if (selectedTags.length) filtrados = filtrados.filter(doc => doc.tags?.some(tag => selectedTags.includes(tag)));
  if (minRating > 0) filtrados = filtrados.filter(doc => (doc.rating || 0) >= minRating);
  if (minDownloads > 0) filtrados = filtrados.filter(doc => (doc.downloadCount || 0) >= minDownloads);

  filtrados.sort((a, b) => {
    const sortFunc = {
      title: () => (a.title || '').localeCompare(b.title || ''),
      rating: () => (b.rating || 0) - (a.rating || 0),
      downloadCount: () => (b.downloadCount || 0) - (a.downloadCount || 0),
      uploadDateAsc: () => new Date(a.uploadDate) - new Date(b.uploadDate),
      uploadDate: () => new Date(b.uploadDate) - new Date(a.uploadDate)
    };
    return (sortFunc[sortBy] || sortFunc.uploadDate)();
  });
  documentosFiltrados.value = filtrados;
};

const limpiarFiltros = () => {
  Object.assign(searchForm.value, { query: '', sortBy: 'uploadDate', fileType: 'all', authors: [], selectedTags: [], minRating: 0, minDownloads: 0 });
  aplicarFiltros();
};

const descargarDocumentoHandler = async (doc) => {
  try {
    const blob = await descargarDocumento(doc._id);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName || `documento.${doc.fileType || 'pdf'}`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    ElMessage.success(`Descargando ${doc.title}`);
    doc.downloadCount = (doc.downloadCount || 0) + 1;
  } catch (error) {
    console.error('Error al descargar:', error);
  }
};

const formatearFecha = (fecha) => {
  if (!fecha) return 'Fecha no disponible';
  try {
    return new Date(fecha).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return fecha;
  }
};

const abrirDialogoValoracion = (doc) => {
  documentoParaValorar.value = doc;
  ratingDialogVisible.value = true;
};

const handleRatingSubmitted = (data) => {
  const docIndex = documentos.value.findIndex(d => d._id === data.documentId);
  if (docIndex !== -1 && data.documento) {
    documentos.value[docIndex].rating = data.documento.rating;
    documentos.value[docIndex].ratingCount = data.documento.ratingCount;
    const filteredIndex = documentosFiltrados.value.findIndex(d => d._id === data.documentId);
    if (filteredIndex !== -1) {
      documentosFiltrados.value[filteredIndex].rating = data.documento.rating;
      documentosFiltrados.value[filteredIndex].ratingCount = data.documento.ratingCount;
    }
  }
};

onMounted(() => cargarDocumentos());
</script>
