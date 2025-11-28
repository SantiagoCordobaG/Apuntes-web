<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo-wrapper"><el-icon class="logo-icon"><Document /></el-icon></div>
        <h1 class="auth-title">Bienvenido de nuevo</h1>
        <p class="auth-subtitle">Inicia sesión para continuar</p>
      </div>
      <el-form @submit.prevent="handleLogin" class="auth-form">
        <el-form-item>
          <el-input v-model="correo" type="email" placeholder="Correo electrónico" size="large" :prefix-icon="Message" :disabled="loading" class="custom-input" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" type="password" placeholder="Contraseña" size="large" :prefix-icon="Lock" show-password :disabled="loading" class="custom-input" @keyup.enter="handleLogin" />
        </el-form-item>
      
        <el-alert v-if="errorMessage" :title="errorMessage" type="error" :closable="false" show-icon class="error-alert" />
        <el-button type="primary" size="large" :loading="loading"  @click="handleLogin" class="auth-button">{{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}</el-button>
      </el-form>
      <div class="auth-footer">
        <p class="footer-text">¿No tienes cuenta? <a href="#" @click.prevent="$emit('switch-tab', 'register')" class="auth-link">Regístrate aquí</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/autenticacion';
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
  if (!correo.value || !password.value) {
    errorMessage.value = 'Por favor completa todos los campos';
    return;
  }
  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await authStore.login(correo.value, password.value);
    
    if (response.success) {
      ElMessage.success('¡Bienvenido!');
      router.push('/');
    } else {
      errorMessage.value = response.message;
    }
  } catch (error) {
    errorMessage.value = 'Error inesperado al iniciar sesión';
  } finally {
    loading.value = false;
  }
};
</script>
