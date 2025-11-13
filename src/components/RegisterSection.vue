<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <div class="logo-wrapper">
          <el-icon class="logo-icon"><UserFilled /></el-icon>
        </div>
        <h1 class="register-title">Crea tu cuenta</h1>
        <p class="register-subtitle">Únete a nuestra comunidad</p>
      </div>

      <el-form @submit.prevent="handleRegistro" class="register-form">
        <el-form-item>
          <el-input
            v-model="nombre"
            type="text"
            placeholder="Nombre completo"
            size="large"
            :prefix-icon="User"
            :disabled="loading"
            class="custom-input"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="correo"
            type="email"
            placeholder="Correo electrónico"
            size="large"
            :prefix-icon="Message"
            :disabled="loading"
            class="custom-input"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="password"
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            size="large"
            :prefix-icon="Lock"
            show-password
            :disabled="loading"
            class="custom-input"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirmar contraseña"
            size="large"
            :prefix-icon="Lock"
            show-password
            :disabled="loading"
            class="custom-input"
            @keyup.enter="handleRegistro"
          />
        </el-form-item>

        <el-form-item>
          <el-select
            v-model="rol"
            placeholder="Selecciona tu rol"
            size="large"
            class="custom-select"
            :disabled="loading"
          >
            <el-option label="Estudiante" value="Estudiante" />
            <el-option label="Profesor" value="Profesor" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="carrera"
            type="text"
            placeholder="Carrera (opcional)"
            size="large"
            :prefix-icon="School"
            :disabled="loading"
            class="custom-input"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="universidad"
            type="text"
            placeholder="Universidad (opcional)"
            size="large"
            :prefix-icon="OfficeBuilding"
            :disabled="loading"
            class="custom-input"
          />
        </el-form-item>

        <el-alert
          v-if="errorMessage"
          :title="errorMessage"
          type="error"
          :closable="false"
          show-icon
          class="error-alert"
        />

        <el-button
          type="primary"
          size="large"
          :loading="loading"
          @click="handleRegistro"
          class="register-button"
        >
          <span v-if="!loading">Crear Cuenta</span>
          <span v-else>Creando cuenta...</span>
        </el-button>
      </el-form>

      <div class="register-footer">
        <p class="footer-text">
          ¿Ya tienes cuenta?
          <a href="#" @click.prevent="$emit('switch-tab', 'login')" class="login-link">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';
import { UserFilled, User, Message, Lock, School, OfficeBuilding } from '@element-plus/icons-vue';

// eslint-disable-next-line no-undef
defineEmits(['switch-tab']);

const router = useRouter();
const authStore = useAuthStore();
const nombre = ref('');
const correo = ref('');
const password = ref('');
const confirmPassword = ref('');
const rol = ref('Estudiante');
const carrera = ref('');
const universidad = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleRegistro = async () => {
  errorMessage.value = '';
  if (!nombre.value || !correo.value || !password.value) {
    errorMessage.value = 'Por favor, completa los campos obligatorios.';
    return;
  }
  if (password.value.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden.';
    return;
  }
  loading.value = true;
  try {
    const result = await authStore.registro({
      nombre: nombre.value,
      correo: correo.value,
      password: password.value,
      rol: rol.value,
      carrera: carrera.value,
      universidad: universidad.value
    });
    if (result.success) {
      ElMessage.success(`¡Bienvenido, ${authStore.usuario?.nombre}! Tu cuenta ha sido creada exitosamente. 🎉`);
      router.push('/');
    } else {
      errorMessage.value = result.message;
    }
  } catch (error) {
    errorMessage.value = 'Error al registrar. Por favor, intenta de nuevo.';
    console.error('Error en registro:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container { width: 100%; }
.register-card { background: transparent; padding: 0; width: 100%; }
.register-header { text-align: center; margin-bottom: 32px; }
.logo-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: #1a1a1a;
  border-radius: 14px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}
.logo-wrapper:hover { transform: scale(1.05); }
.logo-icon { font-size: 28px; color: white; }
.register-title {
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
}
.register-subtitle { font-size: 15px; color: #666666; margin: 0; }
.register-form { margin-top: 40px; }
.register-form :deep(.el-form-item) { margin-bottom: 20px; }
.custom-input :deep(.el-input__wrapper),
.custom-select :deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}
.custom-input :deep(.el-input__wrapper:hover),
.custom-select :deep(.el-input__wrapper:hover) {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.custom-input :deep(.el-input__wrapper.is-focus),
.custom-select :deep(.el-input__wrapper.is-focus) {
  border-color: #1a1a1a;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}
.custom-select { width: 100%; }
.error-alert { margin-bottom: 20px; border-radius: 12px; }
.register-button {
  width: 100%;
  height: 52px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  background: #1a1a1a;
  border: 1px solid #1a1a1a;
  color: #ffffff;
  transition: all 0.3s;
  margin-top: 8px;
}
.register-button:hover {
  background: #333333;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
.register-footer { margin-top: 32px; text-align: center; }
.footer-text { font-size: 14px; color: #666666; margin: 0; }
.login-link {
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
  transition: all 0.3s;
  position: relative;
}
.login-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #1a1a1a;
  transition: width 0.3s;
}
.login-link:hover::after { width: 100%; }
@media (max-width: 480px) {
  .register-title { font-size: 28px; }
  .logo-wrapper { width: 52px; height: 52px; }
  .logo-icon { font-size: 24px; }
  .register-form :deep(.el-form-item) { margin-bottom: 16px; }
}
</style>
