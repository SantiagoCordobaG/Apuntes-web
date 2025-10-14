<template>
  <div class="documents-section">
    <!-- Lista de documentos -->
    <el-card class="documents-card">
      <template #header>
        <div class="card-header">
          <h2>Documentos Disponibles</h2>
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
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useDocumentsStore } from '@/stores/documents';
import { ElMessage } from 'element-plus';
import { Document, Download, View } from '@element-plus/icons-vue';

const documentsStore = useDocumentsStore();
const { filteredDocuments } = documentsStore;

const downloadDocument = (document) => {
  documentsStore.incrementDownloadCount(document.id);
  ElMessage.success(`Descargando ${document.title}`);
};

const viewDocument = (document) => {
  ElMessage.info(`Viendo detalles de ${document.title}`);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
};

onMounted(() => {
  // Aquí podrías cargar los documentos si no están ya en el store
});
</script>

<style scoped>
.documents-section {
  max-width: 1200px;
  margin: 0 auto;
}

.documents-card {
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
</style>
