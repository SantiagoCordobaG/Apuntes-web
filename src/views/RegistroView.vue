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
          <router-link to="/login" class="login-link">
            Inicia sesión aquí
          </router-link>
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
  
  // Validaciones
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
    const usuarioData = {
      nombre: nombre.value,
      correo: correo.value,
      password: password.value,
      rol: rol.value,
      carrera: carrera.value,
      universidad: universidad.value
    };

    const result = await authStore.registro(usuarioData);

    if (result.success) {
      ElMessage.success(`¡Bienvenido, ${authStore.usuario?.nombre}! Tu cuenta ha sido creada exitosamente. 🎉`);
      // Redirigir al dashboard después del registro
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
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #fafafa;
  padding: 20px;
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.register-background {
  display: none;
}

.register-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-radius: 24px;
  padding: 56px 48px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 1;
  animation: cardSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 90vh;
  overflow-y: auto;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: logoFadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

@keyframes logoFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8) rotate(-10deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.logo-wrapper:hover {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.logo-icon {
  font-size: 28px;
  color: white;
}

.register-title {
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  letter-spacing: -0.8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
  animation: titleFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

@keyframes titleFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-subtitle {
  font-size: 15px;
  color: #666666;
  margin: 0;
  font-weight: 400;
  animation: subtitleFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
}

@keyframes subtitleFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-form {
  margin-top: 40px;
  animation: formFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.5s both;
}

@keyframes formFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.custom-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-input :deep(.el-input__wrapper:hover) {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  border-color: #1a1a1a;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.95);
}

.custom-select {
  width: 100%;
}

.custom-select :deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-select :deep(.el-input__wrapper:hover) {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.custom-select :deep(.el-input__wrapper.is-focus) {
  border-color: #1a1a1a;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.95);
}

.error-alert {
  margin-bottom: 20px;
  border-radius: 12px;
  animation: shake 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

.register-button {
  width: 100%;
  height: 52px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  background: #1a1a1a;
  border: 1px solid #1a1a1a;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 8px;
  position: relative;
  overflow: hidden;
}

.register-button::before {
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

.register-button:hover::before {
  width: 400px;
  height: 400px;
}

.register-button:hover {
  background: #333333;
  border-color: #333333;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.register-button:active {
  transform: translateY(0) scale(0.98);
}

.register-footer {
  margin-top: 32px;
  text-align: center;
  animation: footerFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.7s both;
}

@keyframes footerFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.footer-text {
  font-size: 14px;
  color: #666666;
  margin: 0;
  font-weight: 400;
}

.login-link {
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-link:hover::after {
  width: 100%;
}

.login-link:hover {
  color: #1a1a1a;
}

/* Scrollbar personalizado */
.register-card::-webkit-scrollbar {
  width: 6px;
}

.register-card::-webkit-scrollbar-track {
  background: transparent;
}

.register-card::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.register-card::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

@media (max-width: 480px) {
  .register-card {
    padding: 40px 32px;
    border-radius: 20px;
    max-height: 95vh;
  }

  .register-title {
    font-size: 28px;
  }

  .logo-wrapper {
    width: 52px;
    height: 52px;
  }

  .logo-icon {
    font-size: 24px;
  }

  .register-form :deep(.el-form-item) {
    margin-bottom: 16px;
  }
}
</style>
