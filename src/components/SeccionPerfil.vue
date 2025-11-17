<template>
  <div class="perfil-container">
    <div class="perfil-card">
      <!-- Header Section -->
      <div class="perfil-header">
        <div class="avatar-wrapper">
          <el-avatar
            :size="120"
            :src="modoEdicion ? userEdit.avatar : user.avatar"
            class="profile-avatar"
          >
            {{ user.nombre?.charAt(0).toUpperCase() }}
          </el-avatar>
          <div v-if="!modoEdicion" class="avatar-badge">
            <el-icon><User /></el-icon>
          </div>
        </div>
        <div class="perfil-info">
          <div v-if="!modoEdicion" class="info-content">
            <h1 class="perfil-nombre">{{ user.nombre }}</h1>
            <p class="perfil-correo">
              <el-icon><Message /></el-icon>
              {{ user.correo }}
            </p>
            <div v-if="user.rol" class="rol-badge">
              <span class="rol-text">{{ user.rol }}</span>
            </div>
          </div>
          <el-input 
            v-else 
            v-model="userEdit.nombre" 
            placeholder="Nombre completo"
            size="large"
            class="edit-input"
          />
        </div>
      </div>

      <!-- Details Section -->
      <div class="perfil-details">
        <div v-if="!modoEdicion" class="details-grid">
          <div v-if="user.rol" class="detail-item">
            <div class="detail-icon">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="detail-content">
              <span class="detail-label">Rol</span>
              <span class="detail-value">{{ user.rol }}</span>
            </div>
          </div>
          
          <div v-if="user.carrera" class="detail-item">
            <div class="detail-icon">
              <el-icon><School /></el-icon>
            </div>
            <div class="detail-content">
              <span class="detail-label">Carrera</span>
              <span class="detail-value">{{ user.carrera }}</span>
            </div>
          </div>
          
          <div v-if="user.universidad" class="detail-item">
            <div class="detail-icon">
              <el-icon><OfficeBuilding /></el-icon>
            </div>
            <div class="detail-content">
              <span class="detail-label">Universidad</span>
              <span class="detail-value">{{ user.universidad }}</span>
            </div>
          </div>
          
          <div v-if="!user.rol && !user.carrera && !user.universidad" class="empty-details">
            <el-icon class="empty-icon"><InfoFilled /></el-icon>
            <p class="empty-text">Completa tu perfil para mostrar más información</p>
          </div>
        </div>

        <!-- Modo Edición -->
        <div v-else class="edit-form">
          <div class="form-section">
            <label class="form-label">
              <el-icon><UserFilled /></el-icon>
              Rol
            </label>
            <el-select v-model="userEdit.rol" placeholder="Selecciona un rol" class="form-select">
              <el-option label="Estudiante" value="Estudiante" />
              <el-option label="Profesor" value="Profesor" />
              <el-option label="Administrador" value="Administrador" />
            </el-select>
          </div>
          
          <div class="form-section">
            <label class="form-label">
              <el-icon><School /></el-icon>
              Carrera
            </label>
            <el-input v-model="userEdit.carrera" placeholder="Tu carrera" class="form-input" />
          </div>
          
          <div class="form-section">
            <label class="form-label">
              <el-icon><OfficeBuilding /></el-icon>
              Universidad
            </label>
            <el-input v-model="userEdit.universidad" placeholder="Tu universidad" class="form-input" />
          </div>
        </div>
      </div>

      <!-- Actions Section -->
      <div class="perfil-actions">
        <el-button 
          v-if="!modoEdicion" 
          type="primary" 
          @click="editarPerfil"
          :icon="Edit"
          :loading="cargando"
          class="action-button primary"
        >
          Editar Perfil
        </el-button>
        
        <template v-else>
          <el-button 
            @click="cancelarEdicion" 
            :disabled="cargando"
            class="action-button secondary"
          >
            Cancelar
          </el-button>
          <el-button 
            type="primary" 
            @click="guardarCambios"
            :icon="Check"
            :loading="cargando"
            class="action-button primary"
          >
            Guardar Cambios
          </el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<!--
  ============================================
  COMPONENTE: SeccionPerfil
  ============================================
  
  DESCRIPCIÓN:
  Muestra el perfil del usuario actual con toda su información personal y permite editarlo.
  
  QUÉ HACE:
  - Muestra la información del usuario: nombre, correo, rol, carrera, universidad
  - Permite editar el perfil (modo edición)
  - Permite actualizar la información personal
  - Guarda los cambios en el backend y actualiza el store
-->
<script setup>
import { ref, onMounted } from "vue";
import { ElButton, ElAvatar, ElMessage, ElInput, ElSelect, ElOption } from "element-plus";
import { Edit, Check, User, Message, UserFilled, School, OfficeBuilding, InfoFilled } from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores/autenticacion";
import { actualizarUsuario } from "@/services/servicioUsuarios";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const user = ref({});
const userEdit = ref({});
const modoEdicion = ref(false);
const cargando = ref(false);

onMounted(async () => {
  if (!authStore.isAuthenticated || !authStore.token) {
    ElMessage.warning("Debes iniciar sesión para ver tu perfil");
    router.push("/login");
    return;
  }
  try {
    cargando.value = true;
    const usuarioActual = await authStore.getUsuarioActual();
    user.value = usuarioActual || authStore.usuario;
    if (!user.value) {
      ElMessage.error("No se pudo cargar el perfil");
      router.push("/login");
    }
  } catch (error) {
    console.error("Error al cargar el perfil:", error);
    user.value = authStore.usuario || {};
    if (!user.value._id) {
      ElMessage.error("Error al cargar el perfil");
      router.push("/login");
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
  if (!userEdit.value.nombre) {
    ElMessage.warning("Por favor completa todos los campos");
    return;
  }
  try {
    cargando.value = true;
    const resultado = await actualizarUsuario(user.value._id, userEdit.value);
    user.value = resultado.usuario;
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
  padding: 40px 20px;
  min-height: calc(100vh - 160px);
}
.perfil-card {
  width: 100%;
  max-width: 680px;
  padding: 48px;
  border-radius: 20px;
  background: var(--surface);
  backdrop-filter: saturate(180%) blur(20px);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  transition: var(--transition-base);
}
.perfil-card:hover {
  border-color: var(--border-color-strong);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}
.perfil-header {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  padding: 0 0 40px 0;
  margin-bottom: 40px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}
.profile-avatar {
  border: 4px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s;
}
.avatar-wrapper:hover .profile-avatar {
  transform: scale(1.05);
}
.avatar-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 32px;
  height: 32px;
  background: #1a1a1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 3px solid white;
}
.perfil-info { flex: 1; min-width: 0; }

.perfil-nombre {
  margin: 0 0 12px 0;
  font-weight: 700;
  font-size: 36px;
  color: var(--text-primary);
  font-family: var(--font-family-base);
}
.perfil-correo {
  color: var(--text-muted);
  margin: 0 0 16px 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.perfil-correo .el-icon { font-size: 18px; color: #999999; }
.rol-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}
.rol-text { font-size: 13px; font-weight: 600; color: #1a1a1a; }
.perfil-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
.action-button {
  min-width: 140px;
  height: 48px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px;
  transition: var(--transition-base);
}
.action-button.primary {
  background: var(--text-primary);
  border: 1px solid var(--text-primary);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.action-button.primary:hover {
  background: #333333;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}
.action-button.secondary {
  background: var(--surface);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
}
.action-button.secondary:hover {
  background: var(--surface-strong);
  border-color: var(--border-color-strong);
  transform: translateY(-2px);
}
.perfil-details { margin-bottom: 40px; }
.details-grid { display: grid; gap: 16px; }
.detail-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
}
.detail-item:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.08);
  transform: translateX(4px);
}
.detail-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  color: #1a1a1a;
  font-size: 20px;
  flex-shrink: 0;
  transition: all 0.3s;
}
.detail-item:hover .detail-icon {
  background: #1a1a1a;
  color: white;
  transform: scale(1.1);
}
.detail-content { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: #999999;
  text-transform: uppercase;
}
.detail-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: var(--font-family-base);
}
.empty-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 16px;
  border: 2px dashed rgba(0, 0, 0, 0.08);
}
.empty-icon { font-size: 48px; color: #999999; margin-bottom: 16px; }
.empty-text { margin: 0; font-size: 14px; color: #666666; }
.edit-form { display: flex; flex-direction: column; gap: 24px; }
.form-section { display: flex; flex-direction: column; gap: 8px; }
.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;
}
.form-label .el-icon { font-size: 16px; color: #999999; }
.form-input :deep(.el-input__wrapper),
.form-select :deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: var(--surface);
  backdrop-filter: blur(10px);
  transition: var(--transition-base);
}
.form-input :deep(.el-input__wrapper:hover),
.form-select :deep(.el-input__wrapper:hover) {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.form-input :deep(.el-input__wrapper.is-focus),
.form-select :deep(.el-input__wrapper.is-focus) {
  border-color: var(--text-primary);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .perfil-container {
    padding: 20px 16px;
  }

  .perfil-card {
    padding: 24px;
  }

  .perfil-header {
    flex-direction: column;
    text-align: center;
  }

  .perfil-actions {
    flex-direction: column;
  }

  .perfil-actions :deep(.el-button) {
    width: 100%;
  }
}
</style>
