<!--
  ============================================
  COMPONENTE: LoginSection
  ============================================
  
  Formulario de inicio de sesión para usuarios existentes.
  
  FUNCIONALIDAD:
  - Valida credenciales (correo y contraseña)
  - Inicia sesión usando el store de autenticación
  - Muestra mensajes de error si falla
  - Redirige al usuario después de login exitoso
  - Permite cambiar a la vista de registro
  
  EVENTOS:
  - @switch-tab: Emite evento para cambiar al tab de registro
-->
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
/**
 * ============================================
 * COMPONENTE: LoginSection
 * ============================================
 * 
 * Formulario de inicio de sesión.
 * 
 * ESTADO:
 * - correo: Correo electrónico del usuario
 * - password: Contraseña del usuario
 * - loading: Indica si se está procesando el login
 * - errorMessage: Mensaje de error a mostrar
 * 
 * FUNCIONES:
 * - handleLogin(): Valida y procesa el inicio de sesión
 */

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';
import { Document, Message, Lock } from '@element-plus/icons-vue';

// ===== EMITIR EVENTOS =====
// Permite comunicarse con el componente padre (AuthView)
// eslint-disable-next-line no-undef
defineEmits(['switch-tab']);

// ===== INICIALIZACIÓN =====
const router = useRouter();
const authStore = useAuthStore();

// ===== ESTADO REACTIVO =====
const correo = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

/**
 * Maneja el proceso de inicio de sesión
 * 
 * PROCESO:
 * 1. Valida que los campos no estén vacíos
 * 2. Llama al store de autenticación para hacer login
 * 3. Si es exitoso → muestra mensaje y redirige
 * 4. Si falla → muestra mensaje de error
 */
const handleLogin = async () => {
  errorMessage.value = '';
  
  // Validar campos obligatorios
  if (!correo.value || !password.value) {
    errorMessage.value = 'Por favor, completa todos los campos obligatorios';
    return;
  }
  
  loading.value = true;
  try {
    // Intentar iniciar sesión
    const result = await authStore.login(correo.value, password.value);
    
    if (result.success) {
      // Login exitoso → mostrar mensaje y redirigir
      ElMessage.success(`¡Bienvenido, ${authStore.usuario?.nombre}! 👋`);
      // Redirigir a la ruta que se intentó acceder antes, o al home
      router.push(router.currentRoute.value.query.redirect || '/');
    } else {
      // Login fallido → mostrar error
      errorMessage.value = result.message;
    }
  } catch (error) {
    // Error inesperado
    errorMessage.value = 'Error al iniciar sesión. Por favor, intenta de nuevo.';
    console.error('Error en login:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container { width: 100%; }
.login-card { background: transparent; padding: 0; width: 100%; }
.login-header { text-align: center; margin-bottom: 32px; }
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
.login-title {
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
}
.login-subtitle { font-size: 15px; color: #666666; margin: 0; }
.login-form { margin-top: 40px; }
.login-form :deep(.el-form-item) { margin-bottom: 20px; }
.custom-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}
.custom-input :deep(.el-input__wrapper:hover) {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.custom-input :deep(.el-input__wrapper.is-focus) {
  border-color: #1a1a1a;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}
.error-alert { margin-bottom: 20px; border-radius: 12px; }
.login-button {
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
.login-button:hover {
  background: #333333;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
.login-footer { margin-top: 32px; text-align: center; }
.footer-text { font-size: 14px; color: #666666; margin: 0; }
.register-link {
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
  transition: all 0.3s;
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
  transition: width 0.3s;
}
.register-link:hover::after { width: 100%; }
@media (max-width: 480px) {
  .login-title { font-size: 28px; }
  .logo-wrapper { width: 52px; height: 52px; }
  .logo-icon { font-size: 24px; }
}
</style>
