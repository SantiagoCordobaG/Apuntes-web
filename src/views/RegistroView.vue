<template>
  <div class="register-container">
    <div class="register-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  bottom: -150px;
  right: -150px;
  animation-delay: 5s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.register-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 48px 40px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
  animation: slideUp 0.5s ease-out;
  max-height: 90vh;
  overflow-y: auto;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  margin-bottom: 20px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.logo-icon {
  font-size: 32px;
  color: white;
}

.register-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-subtitle {
  font-size: 16px;
  color: #718096;
  margin: 0;
}

.register-form {
  margin-top: 32px;
}

.register-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.custom-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.custom-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.custom-select {
  width: 100%;
}

.custom-select :deep(.el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.custom-select :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.error-alert {
  margin-bottom: 20px;
  border-radius: 12px;
}

.register-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  margin-top: 8px;
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.register-button:active {
  transform: translateY(0);
}

.register-footer {
  margin-top: 32px;
  text-align: center;
}

.footer-text {
  font-size: 14px;
  color: #718096;
  margin: 0;
}

.login-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
  transition: all 0.3s ease;
}

.login-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Scrollbar personalizado */
.register-card::-webkit-scrollbar {
  width: 8px;
}

.register-card::-webkit-scrollbar-track {
  background: transparent;
}

.register-card::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 4px;
}

.register-card::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}

@media (max-width: 480px) {
  .register-card {
    padding: 32px 24px;
    border-radius: 20px;
    max-height: 95vh;
  }

  .register-title {
    font-size: 24px;
  }

  .logo-wrapper {
    width: 56px;
    height: 56px;
  }

  .logo-icon {
    font-size: 28px;
  }

  .register-form :deep(.el-form-item) {
    margin-bottom: 16px;
  }
}
</style>
