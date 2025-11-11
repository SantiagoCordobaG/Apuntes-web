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

<script setup>
import { ref, onMounted } from "vue";
import { ElButton, ElAvatar, ElMessage, ElInput, ElSelect, ElOption } from "element-plus";
import { Edit, Check, User, Message, UserFilled, School, OfficeBuilding, InfoFilled } from "@element-plus/icons-vue";
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
  padding: 40px 20px;
  min-height: calc(100vh - 160px);
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

.perfil-card {
  width: 100%;
  max-width: 680px;
  padding: 48px;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: profileCardIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes profileCardIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.perfil-card:hover {
  border-color: rgba(0, 0, 0, 0.12);
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
  animation: headerSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

@keyframes headerSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar {
  border: 4px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: avatarFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

@keyframes avatarFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8) rotate(-10deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.avatar-wrapper:hover .profile-avatar {
  transform: scale(1.08) rotate(5deg);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
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
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.perfil-info {
  flex: 1;
  min-width: 0;
}

.info-content {
  animation: infoFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
}

@keyframes infoFadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.perfil-nombre {
  margin: 0 0 12px 0;
  font-weight: 700;
  font-size: 36px;
  color: #1a1a1a;
  letter-spacing: -1px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
  line-height: 1.2;
}

.perfil-correo {
  color: #666666;
  margin: 0 0 16px 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
}

.perfil-correo .el-icon {
  font-size: 18px;
  color: #999999;
}

.rol-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.rol-text {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: 0.3px;
}

.edit-input {
  animation: inputFadeIn 0.4s ease;
}

@keyframes inputFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.perfil-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  animation: actionsFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both;
}

@keyframes actionsFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.action-button {
  min-width: 140px;
  height: 48px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.5s ease, height 0.5s ease;
}

.action-button:hover::before {
  width: 300px;
  height: 300px;
}

.action-button.primary {
  background: #1a1a1a;
  border: 1px solid #1a1a1a;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-button.primary::before {
  background: rgba(255, 255, 255, 0.2);
}

.action-button.primary:hover {
  background: #333333;
  border-color: #333333;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.action-button.secondary {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #1a1a1a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.action-button.secondary::before {
  background: rgba(0, 0, 0, 0.1);
}

.action-button.secondary:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.action-button:active {
  transform: translateY(0) scale(0.98);
}

.perfil-details {
  margin-bottom: 40px;
  animation: detailsFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.5s both;
}

@keyframes detailsFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.details-grid {
  display: grid;
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: detailItemIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.detail-item:nth-child(1) { animation-delay: 0.1s; }
.detail-item:nth-child(2) { animation-delay: 0.2s; }
.detail-item:nth-child(3) { animation-delay: 0.3s; }

@keyframes detailItemIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-item:hover .detail-icon {
  background: #1a1a1a;
  color: white;
  transform: scale(1.1) rotate(5deg);
}

.detail-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: #999999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
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

.empty-icon {
  font-size: 48px;
  color: #999999;
  margin-bottom: 16px;
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.empty-text {
  margin: 0;
  font-size: 14px;
  color: #666666;
  font-weight: 400;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-label .el-icon {
  font-size: 16px;
  color: #999999;
}

.form-input :deep(.el-input__wrapper),
.form-select :deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-input :deep(.el-input__wrapper:hover),
.form-select :deep(.el-input__wrapper:hover) {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.form-input :deep(.el-input__wrapper.is-focus),
.form-select :deep(.el-input__wrapper.is-focus) {
  border-color: #1a1a1a;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.95);
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
