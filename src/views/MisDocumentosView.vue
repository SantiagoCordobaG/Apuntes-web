<template>
  <div class="p-8">
    <h2 class="text-2xl font-bold mb-6 text-purple-700">Mis Documentos</h2>

    <div v-if="cargando" class="text-center py-8">
      <p class="text-gray-600">Cargando documentos...</p>
    </div>

    <div v-else-if="documentos.length > 0" class="grid md:grid-cols-2 gap-6">
      <div
        v-for="doc in documentos"
        :key="doc._id"
        class="border border-gray-200 shadow-sm p-4 rounded-xl bg-white"
      >
        <h3 class="font-semibold text-lg mb-1">{{ doc.title }}</h3>
        <p class="text-gray-600 text-sm mb-2">Subido el {{ formatearFecha(doc.uploadDate) }}</p>
        <p class="text-sm mb-3">{{ doc.description }}</p>
        <div class="flex items-center gap-2 mb-3">
          <span class="text-xs text-gray-500">{{ doc.fileType?.toUpperCase() }}</span>
          <span class="text-xs text-gray-500">•</span>
          <span class="text-xs text-gray-500">{{ doc.fileSize }}</span>
        </div>
        <button
          @click="descargarDocumento(doc._id)"
          class="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition-colors"
        >
          Descargar
        </button>
      </div>
    </div>

    <div v-else class="text-gray-600 italic text-center py-8">
      Aún no has subido documentos.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

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

    // Obtener todos los documentos del backend
    const response = await fetch("http://localhost:3000/api/Documentos");
    
    if (!response.ok) {
      throw new Error("Error al cargar documentos");
    }

    const todosLosDocumentos = await response.json();
    
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

const descargarDocumento = async (documentoId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/Documentos/download/${documentoId}`);
    
    if (!response.ok) {
      throw new Error("Error al descargar el documento");
    }

    // Obtener el nombre del archivo del header o del response
    const contentDisposition = response.headers.get("Content-Disposition");
    let fileName = "documento.pdf";
    
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (fileNameMatch) {
        fileName = decodeURIComponent(fileNameMatch[1]);
      }
    }

    // Crear un blob y descargarlo
    const blob = await response.blob();
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
    ElMessage.error("Error al descargar el documento");
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
