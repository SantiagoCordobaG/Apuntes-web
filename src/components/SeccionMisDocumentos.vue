<template>
  <div class="mis-documentos-container fade-in-up">
    <div class="header-section">
      <h2 class="page-title">Mis Documentos</h2>
      <p class="page-subtitle">Gestiona todos tus documentos subidos</p>
    </div>

    <div v-if="cargando" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Cargando tus documentos...</p>
    </div>

    <div v-else-if="documentos.length > 0" class="documentos-grid">
      <div v-for="doc in documentos" :key="doc._id" class="documento-card glass-card card-fade-in">
        <div class="documento-header">
          <div class="file-icon-wrapper">
            <span class="file-icon" :class="doc.fileType">{{ doc.fileType?.toUpperCase() || 'DOC' }}</span>
          </div>
          <div class="documento-info">
            <h3 class="documento-title">{{ doc.title }}</h3>
            <p class="documento-fecha">📅 Subido el {{ formatearFecha(doc.uploadDate) }}</p>
            <p class="documento-descripcion">{{ doc.description }}</p>
            <div class="documento-meta-info">
              <span class="meta-badge">{{ doc.fileType?.toUpperCase() }}</span>
              <span class="meta-separator">•</span>
              <span class="meta-badge">{{ doc.fileSize }}</span>
            </div>
          </div>
        </div>
        <div class="documento-actions">
          <button @click="descargarDocumentoHandler(doc._id)" class="download-button btn-primary btn-ripple">
            <span class="button-icon">⬇️</span>
            Descargar
          </button>
        </div>
      </div>
    </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📄</div>
        <h3 class="empty-title">Aún no has subido documentos</h3>
        <p class="empty-text">Comienza compartiendo tus apuntes con la comunidad</p>
        <el-button type="primary" @click="router.push('/?tab=upload')" size="large">
          <el-icon><Upload /></el-icon>
          Subir mi primer documento
        </el-button>
      </div>
  </div>
</template>

<!--
  ============================================
  COMPONENTE: SeccionMisDocumentos
  ============================================
  
  DESCRIPCIÓN:
  Muestra todos los documentos que el usuario actual ha subido al sistema. Solo muestra
  los documentos del usuario autenticado.
  
  QUÉ HACE:
  - Carga y muestra solo los documentos del usuario actual
  - Filtra los documentos por el ID o nombre del usuario
  - Permite descargar los documentos propios
  - Muestra un mensaje si el usuario no ha subido documentos
  - Se actualiza automáticamente cuando cambia el usuario logueado
-->
<script setup>
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/autenticacion";
import { useRouter } from "vue-router";
import { ElMessage, ElButton } from "element-plus";
import { Upload } from "@element-plus/icons-vue";
import { obtenerDocumentos, descargarDocumento } from "@/services/servicioDocumentos";

const authStore = useAuthStore();
const router = useRouter();
const documentos = ref([]);
const cargando = ref(false);

const formatearFecha = (fecha) => {
  if (!fecha) return "Fecha no disponible";
  try {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return fecha;
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return fecha;
  }
};

const cargarDocumentos = async () => {
  try {
    cargando.value = true;

    // Verificar si hay un usuario autenticado
    if (!authStore.isAuthenticated || !authStore.usuario) {
      ElMessage.warning("Debes iniciar sesión para ver tus documentos");
      router.push("/login");
      return;
    }

    const todosLosDocumentos = await obtenerDocumentos();
    const userId = authStore.usuario._id;
    const nombreUsuario = authStore.usuario.nombre;
    
    documentos.value = todosLosDocumentos.filter((doc) => {
      const coincidePorId = doc.uploadedBy && String(doc.uploadedBy) === String(userId);
      const coincidePorNombre = doc.usuario && doc.usuario.trim() === nombreUsuario.trim();
      return coincidePorId || coincidePorNombre;
    });
  } catch (error) {
    console.error("Error al cargar documentos:", error);
    ElMessage.error("Error al cargar tus documentos");
  } finally {
    cargando.value = false;
  }
};

const descargarDocumentoHandler = async (documentoId) => {
  try {
    const documento = documentos.value.find(d => d._id === documentoId);
    const blob = await descargarDocumento(documentoId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = documento?.fileName || "documento.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    ElMessage.success("Descarga iniciada");
    await cargarDocumentos();
  } catch (error) {
    console.error("Error al descargar:", error);
  }
};

onMounted(() => cargarDocumentos());
watch(() => authStore.usuario?._id, () => cargarDocumentos());
</script>

<style scoped>
.mis-documentos-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

.header-section {
  margin-bottom: 32px;
  text-align: center;
  padding: 24px 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 20px;
}
.loading-text {
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
}

.documentos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  padding: 8px 0;
}

.documento-card {
  padding: 24px;
  transition: var(--transition-base);
}

.documento-card:nth-child(1) { animation-delay: 0.1s; }
.documento-card:nth-child(2) { animation-delay: 0.15s; }
.documento-card:nth-child(3) { animation-delay: 0.2s; }
.documento-card:nth-child(4) { animation-delay: 0.25s; }

.documento-card:hover {
  background: var(--surface-strong);
  border-color: var(--border-color-strong);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px) scale(1.01);
}

.documento-card:active {
  transform: translateY(-2px) scale(0.99);
}

.documento-header {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.file-icon-wrapper {
  flex-shrink: 0;
}

.file-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  transition: all 0.2s ease;
}

.documento-card:hover .file-icon {
  background: #e5e5e5;
  border-color: #d5d5d5;
}

.file-icon.pdf {
  background: #fef2f2;
  border-color: #fee2e2;
  color: #dc2626;
}

.file-icon.docx {
  background: #eff6ff;
  border-color: #dbeafe;
  color: #2563eb;
}

.documento-info {
  flex: 1;
  min-width: 0;
}

.documento-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

.documento-fecha {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.documento-descripcion {
  font-size: 14px;
  color: #475569;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.documento-meta-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.meta-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.meta-separator {
  color: #cbd5e1;
  font-weight: 300;
}

.documento-actions {
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.download-button {
  width: 100%;
}
.button-icon {
  font-size: 18px;
}
.empty-state :deep(.el-button) {
  border-radius: 12px;
  padding: 14px 28px;
  font-weight: 600;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
}

.empty-state :deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }

  .documentos-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .documento-card {
    padding: 20px;
  }

  .documento-header {
    flex-direction: column;
    text-align: center;
  }

  .file-icon-wrapper {
    align-self: center;
  }
}
</style>
