<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-wrapper">
          <el-icon class="logo-icon"><Document /></el-icon>
        </div>
        <h1 class="login-title">Bienvenido de nuevo</h1>
        <p class="login-subtitle">Inicia sesión para continuar</p>
      </div> 

      <el-form @submit.prevent="handleLogin" class="login-form">
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
            placeholder="Contraseña"
            size="large"
            :prefix-icon="Lock"
            show-password
            :disabled="loading"
            class="custom-input"
            @keyup.enter="handleLogin"
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
          @click="handleLogin"
          class="login-button"
        >
          <span v-if="!loading">Iniciar Sesión</span>
          <span v-else>Ingresando...</span>
        </el-button>
      </el-form>

      <div class="login-footer">
        <p class="footer-text">
          ¿No tienes cuenta?
          <a href="#" @click.prevent="$emit('switch-tab', 'register')" class="register-link">
            Regístrate aquí
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
import { Document, Message, Lock } from '@element-plus/icons-vue';

// eslint-disable-next-line no-undef
defineEmits(['switch-tab']);

const router = useRouter();
const authStore = useAuthStore();

const correo = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';
  
  if (!correo.value || !password.value) {
    errorMessage.value = 'Por favor, completa todos los campos obligatorios';
    return;
  }

  loading.value = true;

  try {
    const result = await authStore.login(correo.value, password.value);

    if (result.success) {
      ElMessage.success(`¡Bienvenido, ${authStore.usuario?.nombre}! 👋`);
      // Redirigir a la ruta que se intentó acceder antes del login, o al dashboard
      const redirect = router.currentRoute.value.query.redirect || '/';
      router.push(redirect);
    } else {
      errorMessage.value = result.message;
    }
  } catch (error) {
    errorMessage.value = 'Error al iniciar sesión. Por favor, intenta de nuevo.';
    console.error('Error en login:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
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

.login-background {
  display: none;
}

.login-card {
  background: transparent;
  border-radius: 0;
  padding: 0;
  width: 100%;
  max-width: 100%;
  box-shadow: none;
  border: none;
  position: relative;
  z-index: 1;
  animation: cardSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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

.login-header {
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

.login-title {
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

.login-subtitle {
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

.login-form {
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

.login-form :deep(.el-form-item) {
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

.login-button {
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

.login-button::before {
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

.login-button:hover::before {
  width: 400px;
  height: 400px;
}

.login-button:hover {
  background: #333333;
  border-color: #333333;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.login-button:active {
  transform: translateY(0) scale(0.98);
}

.login-footer {
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

.register-link {
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.register-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #1a1a1a;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.register-link:hover::after {
  width: 100%;
}

.register-link:hover {
  color: #1a1a1a;
}

@media (max-width: 480px) {
  .login-card {
    padding: 40px 32px;
    border-radius: 20px;
  }

  .login-title {
    font-size: 28px;
  }

  .logo-wrapper {
    width: 52px;
    height: 52px;
  }

  .logo-icon {
    font-size: 24px;
  }
}
</style>
