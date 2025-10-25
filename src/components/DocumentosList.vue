<template>
  <div class="documents-section">
    <el-card class="documents-card">
      <template #header>
        <div class="card-header">
          <h2>📚 Documentos Disponibles</h2>
        </div>
      </template>

      <div v-if="documentos.length === 0" class="empty-state">
        <el-empty description="No se encontraron documentos" />
      </div>

      <div v-else class="documents-grid">
        <el-card v-for="doc in documentos" :key="doc._id" class="document-card" shadow="hover">
          <div class="document-header">
            <div class="document-icon">
              <el-icon v-if="doc.fileType === 'pdf'" class="file-icon pdf"><Document /></el-icon>
              <el-icon v-else class="file-icon word"><Document /></el-icon>
            </div>

            <div class="document-info">
              <h3 class="document-title">{{ doc.title }}</h3>
              <p class="document-description">{{ doc.description }}</p>
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
          </div>
        </el-card>
      </div>
    </el-card>

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
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Document, Download, View } from '@element-plus/icons-vue';

const documentos = ref([]);
const dialogVisible = ref(false);
const documentoSeleccionado = ref(null);

const cargarDocumentos = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/documentos");
    documentos.value = await res.json();
  } catch (err) {
    ElMessage.error("Error al cargar documentos");
  }
};

const verDetalles = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/documentos/${id}`);
    documentoSeleccionado.value = await res.json();
    dialogVisible.value = true;
  } catch (err) {
    ElMessage.error("Error al cargar detalles");
  }
};

const descargarDocumento = (doc) => {
  ElMessage.success(`Descargando ${doc.title}`);
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString("es-ES");
};

onMounted(() => {
  cargarDocumentos();
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

.file-icon {
  font-size: 32px;
}

.file-icon.pdf {
  color: #e74c3c;
}

.file-icon.word {
  color: #2b579a;
}

.document-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.document-description {
  color: #606266;
  font-size: 14px;
}

.document-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #909399;
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

.document-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}
</style>
