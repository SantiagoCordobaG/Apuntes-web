<template>
  <div class="search-view">
    <el-card class="search-card">
      <template #header>
        <div class="card-header">
          <h2>Búsqueda Avanzada</h2>
          <el-button @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            Volver
          </el-button>
        </div>
      </template>

      <el-form :model="searchForm" class="search-form">
        <!-- Búsqueda principal -->
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="Buscar">
              <el-input
                v-model="searchForm.query"
                placeholder="Ingresa palabras clave, título, autor o descripción..."
                @input="performSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Ordenar por">
              <el-select v-model="searchForm.sortBy" @change="performSearch" style="width: 100%">
                <el-option label="Relevancia" value="relevance" />
                <el-option label="Fecha (más reciente)" value="uploadDate" />
                <el-option label="Fecha (más antiguo)" value="uploadDateAsc" />
                <el-option label="Título A-Z" value="title" />
                <el-option label="Valoración" value="rating" />
                <el-option label="Descargas" value="downloadCount" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Filtros avanzados -->
        <el-collapse v-model="activeCollapse" class="filters-collapse">
          <el-collapse-item title="Filtros Avanzados" name="filters">
            <el-row :gutter="20">
              <!-- Tipo de archivo -->
              <el-col :span="8">
                <el-form-item label="Tipo de archivo">
                  <el-select v-model="searchForm.fileType" @change="performSearch" style="width: 100%">
                    <el-option label="Todos" value="all" />
                    <el-option label="PDF" value="pdf" />
                    <el-option label="Word" value="docx" />
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- Rango de fechas -->
              <el-col :span="8">
                <el-form-item label="Fecha de subida">
                  <el-date-picker
                    v-model="searchForm.dateRange"
                    type="daterange"
                    range-separator="a"
                    start-placeholder="Fecha inicio"
                    end-placeholder="Fecha fin"
                    format="DD/MM/YYYY"
                    value-format="YYYY-MM-DD"
                    @change="performSearch"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>

              <!-- Autor -->
              <el-col :span="8">
                <el-form-item label="Autor">
                  <el-select
                    v-model="searchForm.authors"
                    multiple
                    filterable
                    placeholder="Seleccionar autores"
                    @change="performSearch"
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
            </el-row>

            <el-row :gutter="20">
              <!-- Rango de valoraciones -->
              <el-col :span="8">
                <el-form-item label="Valoración mínima">
                  <el-slider
                    v-model="searchForm.minRating"
                    :min="0"
                    :max="5"
                    :step="0.5"
                    show-stops
                    show-input
                    @change="performSearch"
                  />
                </el-form-item>
              </el-col>

              <!-- Rango de descargas -->
              <el-col :span="8">
                <el-form-item label="Mín. descargas">
                  <el-input-number
                    v-model="searchForm.minDownloads"
                    :min="0"
                    :max="1000"
                    @change="performSearch"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>

              <!-- Tamaño de archivo -->
              <el-col :span="8">
                <el-form-item label="Tamaño máximo">
                  <el-select v-model="searchForm.maxFileSize" @change="performSearch" style="width: 100%">
                    <el-option label="Sin límite" value="unlimited" />
                    <el-option label="1 MB" value="1" />
                    <el-option label="5 MB" value="5" />
                    <el-option label="10 MB" value="10" />
                    <el-option label="25 MB" value="25" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- Etiquetas -->
            <el-form-item label="Etiquetas">
              <div class="tags-filter">
                <el-tag
                  v-for="tag in searchForm.selectedTags"
                  :key="tag"
                  closable
                  @close="removeSearchTag(tag)"
                  class="tag-item"
                >
                  {{ tag }}
                </el-tag>
                <el-select
                  v-model="newTag"
                  placeholder="Agregar etiqueta"
                  filterable
                  @change="addSearchTag"
                  style="width: 200px"
                >
                  <el-option
                    v-for="tag in availableTags"
                    :key="tag"
                    :label="tag"
                    :value="tag"
                  />
                </el-select>
              </div>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>

        <!-- Botones de acción -->
        <el-form-item>
          <div class="search-actions">
            <el-button @click="clearFilters">Limpiar Filtros</el-button>
            <el-button type="primary" @click="performSearch">
              <el-icon><Search /></el-icon>
              Buscar
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Resultados de búsqueda -->
    <el-card class="results-card">
      <template #header>
        <div class="results-header">
          <h3>Resultados de la búsqueda</h3>
          <div class="results-info">
            <el-text type="info">
              {{ searchResults.length }} documento(s) encontrado(s)
            </el-text>
          </div>
        </div>
      </template>

      <div v-if="searchResults.length === 0" class="empty-results">
        <el-empty description="No se encontraron documentos con los criterios especificados">
          <el-button type="primary" @click="clearFilters">Limpiar filtros</el-button>
        </el-empty>
      </div>

      <div v-else class="results-list">
        <el-card
          v-for="document in searchResults"
          :key="document.id"
          class="result-card"
          shadow="hover"
        >
          <div class="result-content">
            <div class="result-header">
              <div class="document-icon">
                <el-icon v-if="document.fileType === 'pdf'" class="file-icon pdf"><Document /></el-icon>
                <el-icon v-else class="file-icon word"><Document /></el-icon>
              </div>
              <div class="document-info">
                <h4 class="document-title">{{ highlightText(document.title) }}</h4>
                <p class="document-description">{{ highlightText(document.description) }}</p>
                <div class="document-meta">
                  <span class="author">Por: {{ document.author }}</span>
                  <span class="date">{{ formatDate(document.uploadDate) }}</span>
                  <span class="size">{{ document.fileSize }}</span>
                </div>
              </div>
            </div>

            <div class="document-tags">
              <el-tag
                v-for="tag in document.tags"
                :key="tag"
                size="small"
                class="tag"
              >
                {{ tag }}
              </el-tag>
            </div>

            <div class="document-stats">
              <div class="rating-section">
                <el-rate
                  v-model="document.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}"
                />
                <span class="rating-count">({{ document.ratingCount }} valoraciones)</span>
              </div>
              <div class="download-count">
                <el-icon><Download /></el-icon>
                {{ document.downloadCount }} descargas
              </div>
            </div>

            <div class="document-actions">
              <el-button type="primary" @click="downloadDocument(document)">
                <el-icon><Download /></el-icon>
                Descargar
              </el-button>
              <el-button @click="viewDocument(document)">
                <el-icon><View /></el-icon>
                Ver Detalles
              </el-button>
              <el-button @click="rateDocument(document)">
                <el-icon><Star /></el-icon>
                Valorar
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDocumentsStore } from '@/stores/documents';
import { ElMessage } from 'element-plus';
import {
  Search,
  ArrowLeft,
  Document,
  Download,
  View,
  Star
} from '@element-plus/icons-vue';

const router = useRouter();
const documentsStore = useDocumentsStore();

// Estado reactivo
const activeCollapse = ref(['filters']);
const newTag = ref('');

const searchForm = reactive({
  query: '',
  sortBy: 'relevance',
  fileType: 'all',
  dateRange: null,
  authors: [],
  minRating: 0,
  minDownloads: 0,
  maxFileSize: 'unlimited',
  selectedTags: []
});

// Getters del store
const { documents, allTags } = documentsStore;

// Computed properties
const availableAuthors = computed(() => {
  const authors = new Set();
  documents.forEach(doc => authors.add(doc.author));
  return Array.from(authors).sort();
});

const availableTags = computed(() => {
  return allTags.filter(tag => !searchForm.selectedTags.includes(tag));
});

const searchResults = computed(() => {
  let results = [...documents];

  // Filtro por texto de búsqueda
  if (searchForm.query) {
    const query = searchForm.query.toLowerCase();
    results = results.filter(doc =>
      doc.title.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query) ||
      doc.author.toLowerCase().includes(query) ||
      doc.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Filtro por tipo de archivo
  if (searchForm.fileType !== 'all') {
    results = results.filter(doc => doc.fileType === searchForm.fileType);
  }

  // Filtro por rango de fechas
  if (searchForm.dateRange && searchForm.dateRange.length === 2) {
    const [startDate, endDate] = searchForm.dateRange;
    results = results.filter(doc => {
      const docDate = new Date(doc.uploadDate);
      return docDate >= new Date(startDate) && docDate <= new Date(endDate);
    });
  }

  // Filtro por autores
  if (searchForm.authors.length > 0) {
    results = results.filter(doc => searchForm.authors.includes(doc.author));
  }

  // Filtro por valoración mínima
  if (searchForm.minRating > 0) {
    results = results.filter(doc => doc.rating >= searchForm.minRating);
  }

  // Filtro por descargas mínimas
  if (searchForm.minDownloads > 0) {
    results = results.filter(doc => doc.downloadCount >= searchForm.minDownloads);
  }

  // Filtro por tamaño de archivo
  if (searchForm.maxFileSize !== 'unlimited') {
    const maxSizeMB = parseInt(searchForm.maxFileSize);
    results = results.filter(doc => {
      const docSizeMB = parseFloat(doc.fileSize);
      return docSizeMB <= maxSizeMB;
    });
  }

  // Filtro por etiquetas
  if (searchForm.selectedTags.length > 0) {
    results = results.filter(doc =>
      searchForm.selectedTags.some(tag => doc.tags.includes(tag))
    );
  }

  // Ordenamiento
  results.sort((a, b) => {
    switch (searchForm.sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'rating':
        return b.rating - a.rating;
      case 'uploadDate':
        return new Date(b.uploadDate) - new Date(a.uploadDate);
      case 'uploadDateAsc':
        return new Date(a.uploadDate) - new Date(b.uploadDate);
      case 'downloadCount':
        return b.downloadCount - a.downloadCount;
      case 'relevance':
      default:
        // Ordenar por relevancia (simplificado)
        if (searchForm.query) {
          const query = searchForm.query.toLowerCase();
          const aRelevance = calculateRelevance(a, query);
          const bRelevance = calculateRelevance(b, query);
          return bRelevance - aRelevance;
        }
        return new Date(b.uploadDate) - new Date(a.uploadDate);
    }
  });

  return results;
});

// Métodos
const goBack = () => {
  router.push('/');
};

const performSearch = () => {
  // La búsqueda se ejecuta automáticamente a través de computed properties
  console.log('Búsqueda realizada:', searchForm);
};

const clearFilters = () => {
  searchForm.query = '';
  searchForm.sortBy = 'relevance';
  searchForm.fileType = 'all';
  searchForm.dateRange = null;
  searchForm.authors = [];
  searchForm.minRating = 0;
  searchForm.minDownloads = 0;
  searchForm.maxFileSize = 'unlimited';
  searchForm.selectedTags = [];
};

const addSearchTag = (tag) => {
  if (tag && !searchForm.selectedTags.includes(tag)) {
    searchForm.selectedTags.push(tag);
    newTag.value = '';
  }
};

const removeSearchTag = (tag) => {
  const index = searchForm.selectedTags.indexOf(tag);
  if (index > -1) {
    searchForm.selectedTags.splice(index, 1);
  }
};

const calculateRelevance = (document, query) => {
  let score = 0;
  const queryLower = query.toLowerCase();
  
  // Puntuación por título
  if (document.title.toLowerCase().includes(queryLower)) {
    score += 10;
  }
  
  // Puntuación por descripción
  if (document.description.toLowerCase().includes(queryLower)) {
    score += 5;
  }
  
  // Puntuación por autor
  if (document.author.toLowerCase().includes(queryLower)) {
    score += 3;
  }
  
  // Puntuación por etiquetas
  document.tags.forEach(tag => {
    if (tag.toLowerCase().includes(queryLower)) {
      score += 2;
    }
  });
  
  return score;
};

const highlightText = (text) => {
  if (!searchForm.query) return text;
  
  const query = searchForm.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

const downloadDocument = async (doc) => {
  try {
    // Si el documento tiene _id (viene del backend), descargar desde allí
    if (doc._id) {
      const res = await fetch(`http://localhost:3000/api/Documentos/download/${doc._id}`);
      
      if (!res.ok) {
        throw new Error('Error al obtener el archivo');
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
      documentsStore.incrementDownloadCount(doc.id);
    } else {
      // Si es un documento del store local, solo incrementar contador
      documentsStore.incrementDownloadCount(doc.id);
      ElMessage.success(`Descargando ${doc.title}`);
    }
  } catch (error) {
    console.error('Error al descargar:', error);
    ElMessage.error('Error al descargar el documento: ' + error.message);
  }
};

const viewDocument = (document) => {
  ElMessage.info(`Viendo detalles de ${document.title}`);
};

const rateDocument = (document) => {
  ElMessage.info(`Abriendo valoración para ${document.title}`);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
};

onMounted(() => {
  // Inicializar con búsqueda vacía
  performSearch();
});
</script>

<style scoped>
.search-view {
  max-width: 1200px;
  margin: 0 auto;
}

.search-card, .results-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  color: #303133;
}

.search-form {
  padding: 20px 0;
}

.filters-collapse {
  margin: 20px 0;
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag-item {
  margin: 0;
}

.search-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-header h3 {
  margin: 0;
  color: #303133;
}

.results-info {
  display: flex;
  align-items: center;
}

.empty-results {
  text-align: center;
  padding: 40px 0;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-card {
  border-radius: 12px;
  transition: all 0.3s;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.result-content {
  padding: 20px 0;
}

.result-header {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.document-icon {
  flex-shrink: 0;
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
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
}

.document-title :deep(mark) {
  background-color: #fff2cc;
  padding: 2px 4px;
  border-radius: 3px;
}

.document-description {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.4;
}

.document-description :deep(mark) {
  background-color: #fff2cc;
  padding: 2px 4px;
  border-radius: 3px;
}

.document-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.document-tags {
  margin-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  border-radius: 16px;
}

.document-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px 0;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
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
  gap: 8px;
  flex-wrap: wrap;
}

.document-actions .el-button {
  flex: 1;
  min-width: 100px;
}

@media (max-width: 768px) {
  .search-view {
    padding: 0 10px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .search-actions {
    flex-direction: column;
  }
  
  .results-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .result-header {
    flex-direction: column;
    text-align: center;
  }
  
  .document-stats {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .document-actions {
    flex-direction: column;
  }
}
</style>
