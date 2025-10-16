<template>
  <div class="dashboard">
    <!-- Estadísticas principales -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon"><Document /></el-icon>
            <div class="stat-info">
              <h3>{{ statistics.totalDocuments }}</h3>
              <p>Documentos</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon"><Download /></el-icon>
            <div class="stat-info">
              <h3>{{ statistics.totalDownloads }}</h3>
              <p>Descargas</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon"><Star /></el-icon>
            <div class="stat-info">
              <h3>{{ statistics.averageRating }}</h3>
              <p>Valoración Promedio</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon"><Collection /></el-icon>
            <div class="stat-info">
              <h3>{{ statistics.totalTags }}</h3>
              <p>Etiquetas</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Barra de búsqueda rápida -->
    <el-card class="search-card">
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="Buscar documentos..."
          class="search-input"
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="goToAdvancedSearch">
          <el-icon><Filter /></el-icon>
          Búsqueda Avanzada
        </el-button>
      </div>
    </el-card>

    <!-- Filtros rápidos -->
    <el-card class="filters-card">
      <div class="filters-section">
        <div class="filter-group">
          <label>Ordenar por:</label>
          <el-select v-model="sortBy" @change="handleSortChange" style="width: 150px">
            <el-option label="Fecha" value="uploadDate" />
            <el-option label="Título" value="title" />
            <el-option label="Valoración" value="rating" />
            <el-option label="Descargas" value="downloadCount" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <label>Tipo de archivo:</label>
          <el-select v-model="fileTypeFilter" @change="handleFileTypeChange" style="width: 120px">
            <el-option label="Todos" value="all" />
            <el-option label="PDF" value="pdf" />
            <el-option label="Word" value="docx" />
          </el-select>
        </div>

        <div class="filter-group">
          <label>Etiquetas:</label>
          <el-select
            v-model="selectedTags"
            multiple
            placeholder="Seleccionar etiquetas"
            style="width: 200px"
            @change="handleTagsChange"
          >
            <el-option
              v-for="tag in allTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </div>
      </div>
    </el-card>

    <!-- Lista de documentos -->
    <el-card class="documents-card">
      <template #header>
        <div class="card-header">
          <h2>Documentos Disponibles</h2>
          <el-button type="primary" @click="goToUpload">
            <el-icon><Upload /></el-icon>
            Subir Documento
          </el-button>
        </div>
      </template>

      <div v-if="filteredDocuments.length === 0" class="empty-state">
        <el-empty description="No se encontraron documentos" />
      </div>

      <div v-else class="documents-grid">
        <el-card
          v-for="document in filteredDocuments"
          :key="document.id"
          class="document-card"
          shadow="hover"
        >
          <div class="document-header">
            <div class="document-icon">
              <el-icon v-if="document.fileType === 'pdf'" class="file-icon pdf"><Document /></el-icon>
              <el-icon v-else class="file-icon word"><Document /></el-icon>
            </div>
            <div class="document-info">
              <h3 class="document-title">{{ document.title }}</h3>
              <p class="document-description">{{ document.description }}</p>
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
        </el-card>
      </div>
    </el-card>

    <!-- Dialog de valoración -->
    <RatingDialog
      v-model="ratingDialogVisible"
      :document="selectedDocument"
      @rated="handleRatingComplete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDocumentsStore } from '@/stores/documents';
import { ElMessage } from 'element-plus';
import RatingDialog from '@/components/RatingDialog.vue';
import {
  Document,
  Download,
  Star,
  Collection,
  Search,
  Filter,
  Upload,
  View
} from '@element-plus/icons-vue';

const router = useRouter();
const documentsStore = useDocumentsStore();

// Estado reactivo
const searchQuery = ref('');
const sortBy = ref('uploadDate');
const fileTypeFilter = ref('all');
const selectedTags = ref([]);
const ratingDialogVisible = ref(false);
const selectedDocument = ref(null);

// Getters del store
const { filteredDocuments, allTags, statistics } = documentsStore;

// Métodos
const handleSearch = () => {
  documentsStore.setSearchQuery(searchQuery.value);
};

const handleSortChange = () => {
  documentsStore.setSortBy(sortBy.value);
};

const handleFileTypeChange = () => {
  documentsStore.setFileTypeFilter(fileTypeFilter.value);
};

const handleTagsChange = () => {
  documentsStore.setSelectedTags(selectedTags.value);
};

const goToAdvancedSearch = () => {
  router.push('/search');
};

const goToUpload = () => {
  router.push('/upload');
};

const downloadDocument = (document) => {
  documentsStore.incrementDownloadCount(document.id);
  ElMessage.success(`Descargando ${document.title}`);
  // Aquí iría la lógica real de descarga
};

const viewDocument = (document) => {
  ElMessage.info(`Viendo detalles de ${document.title}`);
  // Aquí iría la navegación a la vista de detalles
};

const rateDocument = (document) => {
  selectedDocument.value = document;
  ratingDialogVisible.value = true;
};

const handleRatingComplete = () => {
  ElMessage.success('Valoración enviada exitosamente');
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
};

onMounted(() => {
  // Inicializar filtros desde el store
  searchQuery.value = documentsStore.searchQuery;
  sortBy.value = documentsStore.sortBy;
  fileTypeFilter.value = documentsStore.fileTypeFilter;
  selectedTags.value = documentsStore.selectedTags;
});
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 32px;
  color: #409eff;
}

.stat-info h3 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-info p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.search-card, .filters-card, .documents-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.search-section {
  display: flex;
  gap: 15px;
  align-items: center;
}

.search-input {
  flex: 1;
}

.filters-section {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #606266;
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

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.document-card {
  border-radius: 12px;
  transition: all 0.3s;
}

.document-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.document-header {
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
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
}

.document-description {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.4;
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
  min-width: 80px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

@media (max-width: 768px) {
  .stats-row .el-col {
    margin-bottom: 10px;
  }
  
  .search-section {
    flex-direction: column;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: space-between;
  }
  
  .documents-grid {
    grid-template-columns: 1fr;
  }
  
  .document-actions {
    flex-direction: column;
  }
}
</style>
  