<template>
  <div class="perfil-container">
    <el-card class="perfil-card" shadow="hover">
      <div class="perfil-header">
        <el-avatar
          :size="100"
          :src="modoEdicion ? userEdit.avatar : user.avatar"
        />
        <div class="perfil-info">
          <h2 v-if="!modoEdicion">{{ user.nombre }}</h2>
          <el-input 
            v-else 
            v-model="userEdit.nombre" 
            placeholder="Nombre completo"
            size="large"
          />
          <p class="perfil-correo">{{ user.correo }}</p>
        </div>
      </div>

      <el-divider />

      <!-- Modo Vista -->
      <el-descriptions v-if="!modoEdicion" title="Detalles del Usuario" :column="1" border>
        <el-descriptions-item label="Rol">{{ user.rol }}</el-descriptions-item>
        <el-descriptions-item label="Carrera">{{ user.carrera }}</el-descriptions-item>
        <el-descriptions-item label="Universidad">{{ user.universidad }}</el-descriptions-item>
      </el-descriptions>

      <!-- Modo Edición -->
      <el-form v-else :model="userEdit" label-width="120px" label-position="left">
        <el-form-item label="Rol">
          <el-select v-model="userEdit.rol" placeholder="Selecciona un rol" style="width: 100%">
            <el-option label="Estudiante" value="Estudiante" />
            <el-option label="Profesor" value="Profesor" />
            <el-option label="Administrador" value="Administrador" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Carrera">
          <el-input v-model="userEdit.carrera" placeholder="Tu carrera" />
        </el-form-item>
        
        <el-form-item label="Universidad">
          <el-input v-model="userEdit.universidad" placeholder="Tu universidad" />
        </el-form-item>
      </el-form>

      <el-divider />

      <div class="perfil-actions">
        <el-button 
          v-if="!modoEdicion" 
          type="primary" 
          @click="editarPerfil"
          :icon="Edit"
          :loading="cargando"
        >
          Editar Perfil
        </el-button>
        
        <template v-else>
          <el-button @click="cancelarEdicion" :disabled="cargando">
            Cancelar
          </el-button>
          <el-button 
            type="success" 
            @click="guardarCambios"
            :icon="Check"
            :loading="cargando"
          >
            Guardar Cambios
          </el-button>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElCard, ElButton, ElDivider, ElDescriptions, ElDescriptionsItem, ElAvatar, ElMessage, ElForm, ElFormItem, ElInput, ElSelect, ElOption } from "element-plus";
import { Edit, Check } from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/auth";
import { actualizarUsuario } from "@/services/usuarioService";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const user = ref({});
const userEdit = ref({});
const modoEdicion = ref(false);
const cargando = ref(false);

onMounted(async () => {
  try {
    cargando.value = true;
    
    // Verificar si hay un usuario autenticado
    if (!authStore.isAuthenticated || !authStore.token) {
      ElMessage.warning("Debes iniciar sesión para ver tu perfil");
      router.push("/login");
      return;
    }

    // Obtener el usuario actual del servidor
    const usuarioActual = await authStore.getUsuarioActual();
    
    if (usuarioActual) {
      user.value = usuarioActual;
    } else {
      // Si no se puede obtener, usar el del store (localStorage)
      if (authStore.usuario) {
        user.value = authStore.usuario;
      } else {
        ElMessage.error("No se pudo cargar el perfil");
        router.push("/login");
      }
    }
  } catch (error) {
    console.error("Error al cargar el perfil:", error);
    ElMessage.error("Error al cargar el perfil");
    // Intentar usar el usuario del store como respaldo
    if (authStore.usuario) {
      user.value = authStore.usuario;
    }
  } finally {
    cargando.value = false;
  }
});

const editarPerfil = () => {
  userEdit.value = { ...user.value };
  modoEdicion.value = true;
};

const cancelarEdicion = () => {
  modoEdicion.value = false;
  userEdit.value = {};
};

const guardarCambios = async () => {
  if (!userEdit.value.nombre || !userEdit.value.carrera || !userEdit.value.universidad) {
    ElMessage.warning("Por favor completa todos los campos");
    return;
  }

  try {
    cargando.value = true;
    const resultado = await actualizarUsuario(user.value._id, userEdit.value);
    user.value = resultado.usuario;
    
    // Actualizar el store de autenticación con los nuevos datos
    authStore.usuario = resultado.usuario;
    localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
    
    modoEdicion.value = false;
    ElMessage.success("Cambios guardados ✅");
  } catch (error) {
    console.error("Error al guardar:", error);
    ElMessage.error("Error al guardar los cambios");
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
.perfil-container {
  display: flex;
  justify-content: center;
  padding: 40px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 160px); /* Resta header y footer */
}

.perfil-card {
  width: 600px;
  padding: 30px;
}

.perfil-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.perfil-info h2 {
  margin: 0;
  font-weight: 600;
}

.perfil-correo {
  color: #606266;
  margin: 5px 0 0;
}

.perfil-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
