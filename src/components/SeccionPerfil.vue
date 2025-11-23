<template>
  <div class="perfil-container">
    <div class="perfil-card glass-card">
      <div class="perfil-header">
        <div class="avatar-wrapper">
          <el-avatar :size="120" :src="modoEdicion ? userEdit.avatar : user.avatar" class="profile-avatar">{{ user.nombre?.charAt(0).toUpperCase() }}</el-avatar>
          <div v-if="!modoEdicion" class="avatar-badge"><el-icon><User /></el-icon></div>
        </div>
        <div class="perfil-info">
          <div v-if="!modoEdicion" class="info-content">
            <h1 class="perfil-nombre">{{ user.nombre }}</h1>
            <p class="perfil-correo"><el-icon><Message /></el-icon>{{ user.correo }}</p>
            <div v-if="user.rol" class="rol-badge"><span class="rol-text">{{ user.rol }}</span></div>
          </div>
          <el-input v-else v-model="userEdit.nombre" placeholder="Nombre completo" size="large" class="edit-input" />
        </div>
      </div>
      <div class="perfil-details">
        <div v-if="!modoEdicion" class="details-grid">
          <div v-if="user.rol" class="detail-item">
            <div class="detail-icon"><el-icon><UserFilled /></el-icon></div>
            <div class="detail-content"><span class="detail-label">Rol</span><span class="detail-value">{{ user.rol }}</span></div>
          </div>
          <div v-if="user.carrera" class="detail-item">
            <div class="detail-icon"><el-icon><School /></el-icon></div>
            <div class="detail-content"><span class="detail-label">Carrera</span><span class="detail-value">{{ user.carrera }}</span></div>
          </div>
          <div v-if="user.universidad" class="detail-item">
            <div class="detail-icon"><el-icon><OfficeBuilding /></el-icon></div>
            <div class="detail-content"><span class="detail-label">Universidad</span><span class="detail-value">{{ user.universidad }}</span></div>
          </div>
          <div v-if="!user.rol && !user.carrera && !user.universidad" class="empty-details">
            <el-icon class="empty-icon"><InfoFilled /></el-icon>
            <p class="empty-text">Completa tu perfil para mostrar más información</p>
          </div>
        </div>
        <div v-else class="edit-form">
          <div class="form-section">
            <label class="form-label"><el-icon><UserFilled /></el-icon>Rol</label>
            <el-select v-model="userEdit.rol" placeholder="Selecciona un rol" class="form-select">
              <el-option label="Estudiante" value="Estudiante" />
              <el-option label="Profesor" value="Profesor" />
              <el-option label="Administrador" value="Administrador" />
            </el-select>
          </div>
          <div class="form-section">
            <label class="form-label"><el-icon><School /></el-icon>Carrera</label>
            <el-input v-model="userEdit.carrera" placeholder="Tu carrera" class="form-input" />
          </div>
          <div class="form-section">
            <label class="form-label"><el-icon><OfficeBuilding /></el-icon>Universidad</label>
            <el-input v-model="userEdit.universidad" placeholder="Tu universidad" class="form-input" />
          </div>
        </div>
      </div>
      <div class="perfil-actions">
        <el-button v-if="!modoEdicion" type="primary" @click="editarPerfil" :icon="Edit" :loading="cargando" class="action-button primary">Editar Perfil</el-button>
        <template v-else>
          <el-button @click="cancelarEdicion" :disabled="cargando" class="action-button secondary">Cancelar</el-button>
          <el-button type="primary" @click="guardarCambios" :icon="Check" :loading="cargando" class="action-button primary">Guardar Cambios</el-button>
        </template>
      </div>
    </div>
  </div>
</template>

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

const editarPerfil = () => { userEdit.value = { ...user.value }; modoEdicion.value = true; };
const cancelarEdicion = () => { modoEdicion.value = false; userEdit.value = {}; };

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
