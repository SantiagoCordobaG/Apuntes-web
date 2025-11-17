<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo-wrapper">
          <el-icon class="logo-icon"><Document /></el-icon>
        </div>
        <h1 class="auth-title">Bienvenido de nuevo</h1>
        <p class="auth-subtitle">Inicia sesión para continuar</p>
      </div>

      <el-form @submit.prevent="handleLogin" class="auth-form">
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
          class="auth-button"
        >
          {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </el-button>
      </el-form>

      <div class="auth-footer">
        <p class="footer-text">
          ¿No tienes cuenta?
          <a href="#" @click.prevent="$emit('switch-tab', 'register')" class="auth-link">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<!--
  ============================================
  COMPONENTE: SeccionLogin
  ============================================
  
  DESCRIPCIÓN:
  Formulario para que los usuarios inicien sesión en el sistema usando su correo y contraseña.
  
  QUÉ HACE:
  - Muestra un formulario con campos de correo y contraseña
  - Valida que los campos estén completos
  - Autentica al usuario contra el backend
  - Redirige al área principal después de un login exitoso
  - Permite cambiar al formulario de registro
-->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/autenticacion';
import { ElMessage } from 'element-plus';
import { Document, Message, Lock } from '@element-plus/icons-vue';

// Emitir evento para cambiar al tab de registro
// eslint-disable-next-line no-undef
defineEmits(['switch-tab']);

const router = useRouter();
const authStore = useAuthStore();

// Estados del formulario
const correo = ref(''); // Correo electrónico del usuario
const password = ref(''); // Contraseña del usuario
const loading = ref(false); // Muestra spinner mientras se procesa el login
const errorMessage = ref(''); // Mensaje de error a mostrar

// Maneja el inicio de sesión
const handleLogin = async () => {
  errorMessage.value = '';
  
  // Validar que los campos estén llenos
  if (!correo.value || !password.value) {
    errorMessage.value = 'Por favor, completa todos los campos obligatorios';
    return;
  }
  
  loading.value = true;
  try {
    // Intentar iniciar sesión con el store
    const result = await authStore.login(correo.value, password.value);
    
    if (result.success) {
      // Si el login es exitoso, mostrar mensaje de bienvenida y redirigir
      ElMessage.success(`¡Bienvenido, ${authStore.usuario?.nombre}! 👋`);
      // Redirigir a la ruta original o a home
      router.push(router.currentRoute.value.query.redirect || '/');
    } else {
      // Si falla, mostrar el mensaje de error
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
