<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo-wrapper"><el-icon class="logo-icon"><UserFilled /></el-icon></div>
        <h1 class="auth-title">Crea tu cuenta</h1>
        <p class="auth-subtitle">Únete a nuestra comunidad</p>
      </div>
      <el-form @submit.prevent="handleRegistro" class="auth-form">
        <el-form-item><el-input v-model="nombre" type="text" placeholder="Nombre completo" size="large" :prefix-icon="User" :disabled="loading" class="custom-input" /></el-form-item>
        <el-form-item><el-input v-model="correo" type="email" placeholder="Correo electrónico" size="large" :prefix-icon="Message" :disabled="loading" class="custom-input" /></el-form-item>
        <el-form-item><el-input v-model="password" type="password" placeholder="Contraseña (mínimo 6 caracteres)" size="large" :prefix-icon="Lock" show-password :disabled="loading" class="custom-input" /></el-form-item>
        <el-form-item><el-input v-model="confirmPassword" type="password" placeholder="Confirmar contraseña" size="large" :prefix-icon="Lock" show-password :disabled="loading" class="custom-input" @keyup.enter="handleRegistro" /></el-form-item>
        <el-form-item><el-select v-model="rol" placeholder="Selecciona tu rol" size="large" class="custom-select" :disabled="loading"><el-option label="Estudiante" value="Estudiante" /><el-option label="Profesor" value="Profesor" /></el-select></el-form-item>
        <el-form-item><el-input v-model="carrera" type="text" placeholder="Carrera (opcional)" size="large" :prefix-icon="School" :disabled="loading" class="custom-input" /></el-form-item>
        <el-form-item><el-input v-model="universidad" type="text" placeholder="Universidad (opcional)" size="large" :prefix-icon="OfficeBuilding" :disabled="loading" class="custom-input" /></el-form-item>
        <el-alert v-if="errorMessage" :title="errorMessage" type="error" :closable="false" show-icon class="error-alert" />
        <el-button type="primary" size="large" :loading="loading" @click="handleRegistro" class="auth-button">{{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}</el-button>
      </el-form>
      <div class="auth-footer">
        <p class="footer-text">¿Ya tienes cuenta? <a href="#" @click.prevent="$emit('switch-tab', 'login')" class="auth-link">Inicia sesión aquí</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/autenticacion';
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
const rol = ref('');
const carrera = ref('');
const universidad = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleRegistro = async () => {
  if (!nombre.value || !correo.value || !password.value || !rol.value) {
    errorMessage.value = 'Por favor completa todos los campos obligatorios';
    return;
  }
  
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
  if (!nameRegex.test(nombre.value)) {
    errorMessage.value = 'El nombre solo debe contener letras';
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres';
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden';
    return;
  }
  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await authStore.registro({
      nombre: nombre.value,
      correo: correo.value,
      password: password.value,
      rol: rol.value,
      carrera: carrera.value,
      universidad: universidad.value
    });
    
    if (response.success) {
      ElMessage.success('¡Cuenta creada exitosamente!');
      router.push('/');
    } else {
      errorMessage.value = response.message;
    }
  } catch (error) {
    errorMessage.value = 'Error inesperado al crear la cuenta';
  } finally {
    loading.value = false;
  }
};
</script>
