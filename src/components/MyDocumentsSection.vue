<template>
  <div class="mis-documentos-container">
    <div class="header-section">
      <h2 class="page-title">Mis Documentos</h2>
      <p class="page-subtitle">Gestiona todos tus documentos subidos</p>
    </div>

    <div v-if="cargando" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Cargando tus documentos...</p>
    </div>

    <div v-else-if="documentos.length > 0" class="documentos-grid">
      <div
        v-for="doc in documentos"
        :key="doc._id"
        class="documento-card"
      >
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
          <button
            @click="descargarDocumentoHandler(doc._id)"
            class="download-button"
          >
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
      <el-button type="primary" @click="router.push('/upload')" size="large">
        <el-icon><Upload /></el-icon>
        Subir mi primer documento
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { ElMessage, ElButton } from "element-plus";
import { Upload } from "@element-plus/icons-vue";
import { obtenerDocumentos, descargarDocumento } from "@/services/documentService";

const authStore = useAuthStore();
const router = useRouter();
const documentos = ref([]);
const cargando = ref(false);

const formatearFecha = (fecha) => {
  if (!fecha) return "Fecha no disponible";
  
  try {
    // Si la fecha viene en formato ISO (YYYY-MM-DD)
    if (fecha.includes("-")) {
      const [year, month, day] = fecha.split("-");
      return `${day}/${month}/${year}`;
    }
    // Si viene en otro formato, intentar parsearla
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return fecha;
    
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
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
    
    // Filtrar documentos del usuario actual
    const userId = authStore.usuario._id;
    const nombreUsuario = authStore.usuario.nombre;
    
    console.log("🔍 Buscando documentos para:");
    console.log("  - Usuario ID:", userId);
    console.log("  - Nombre usuario:", nombreUsuario);
    console.log("📚 Total de documentos en BD:", todosLosDocumentos.length);
    
    // Mostrar información de los primeros documentos para debug
    if (todosLosDocumentos.length > 0) {
      console.log("📄 Primeros documentos:", todosLosDocumentos.slice(0, 3).map(doc => ({
        title: doc.title,
        uploadedBy: doc.uploadedBy,
        usuario: doc.usuario,
        _id: doc._id
      })));
    }
    
    documentos.value = todosLosDocumentos.filter((doc) => {
      // Primero intentar por uploadedBy (ID) - más confiable
      let coincidePorId = false;
      if (doc.uploadedBy) {
        coincidePorId = (
          doc.uploadedBy.toString() === userId.toString() || 
          doc.uploadedBy === userId ||
          String(doc.uploadedBy) === String(userId)
        );
      }
      
      // Si no coincide por ID, intentar por nombre de usuario (para documentos antiguos)
      let coincidePorNombre = false;
      if (!coincidePorId && doc.usuario) {
        coincidePorNombre = doc.usuario.trim() === nombreUsuario.trim();
      }
      
      const coincide = coincidePorId || coincidePorNombre;
      
      if (!coincide) {
        console.log(`❌ Documento "${doc.title}" no coincide:`, {
          uploadedBy: doc.uploadedBy,
          usuario: doc.usuario,
          esperadoId: userId,
          esperadoNombre: nombreUsuario
        });
      }
      
      return coincide;
    });
    
    console.log("✅ Documentos encontrados:", documentos.value.length);
    if (documentos.value.length > 0) {
      console.log("📋 Documentos del usuario:", documentos.value.map(d => d.title));
    }
  } catch (error) {
    console.error("Error al cargar documentos:", error);
    ElMessage.error("Error al cargar tus documentos");
  } finally {
    cargando.value = false;
  }
};

const descargarDocumentoHandler = async (documentoId) => {
  try {
    // Obtener el documento para el nombre del archivo
    const documento = documentos.value.find(d => d._id === documentoId);
    const fileName = documento?.fileName || "documento.pdf";
    
    // Descargar el archivo
    const blob = await descargarDocumento(documentoId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    ElMessage.success("Descarga iniciada");
    
    // Recargar la lista para actualizar el contador de descargas
    await cargarDocumentos();
  } catch (error) {
    console.error("Error al descargar:", error);
    // El mensaje de error ya se maneja en el interceptor de axios
  }
};

// Cargar documentos cuando el componente se monta
onMounted(() => {
  cargarDocumentos();
});

// Recargar documentos cuando el usuario se autentica
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated && authStore.usuario) {
    cargarDocumentos();
  }
});

// Recargar documentos cuando cambia el usuario (por si cambia de cuenta)
watch(() => authStore.usuario?._id, (newUserId, oldUserId) => {
  if (newUserId && newUserId !== oldUserId) {
    cargarDocumentos();
  }
});
</script>

<style scoped>
.mis-documentos-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-section {
  margin-bottom: 32px;
  text-align: center;
  padding: 24px 0;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1a1a1a;
  letter-spacing: -0.8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
}

.page-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: documentoCardIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes documentoCardIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.documento-card:nth-child(1) { animation-delay: 0.1s; }
.documento-card:nth-child(2) { animation-delay: 0.15s; }
.documento-card:nth-child(3) { animation-delay: 0.2s; }
.documento-card:nth-child(4) { animation-delay: 0.25s; }

.documento-card:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.12);
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
  padding: 12px 24px;
  background: #1a1a1a;
  color: #ffffff;
  border: 1px solid #1a1a1a;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.download-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.5s ease, height 0.5s ease;
}

.download-button:hover::before {
  width: 400px;
  height: 400px;
}

.download-button:hover {
  background: #333333;
  border-color: #333333;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.download-button:active {
  transform: translateY(0) scale(0.98);
}

.download-button:active {
  transform: translateY(0);
}

.button-icon {
  font-size: 18px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  border: 2px dashed #e2e8f0;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.empty-text {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 32px 0;
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
