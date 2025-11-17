<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo-wrapper">
          <el-icon class="logo-icon"><UserFilled /></el-icon>
        </div>
        <h1 class="auth-title">Crea tu cuenta</h1>
        <p class="auth-subtitle">Únete a nuestra comunidad</p>
      </div>

      <el-form @submit.prevent="handleRegistro" class="auth-form">
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
          class="auth-button"
        >
          {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
        </el-button>
      </el-form>

      <div class="auth-footer">
        <p class="footer-text">
          ¿Ya tienes cuenta?
          <a href="#" @click.prevent="$emit('switch-tab', 'login')" class="auth-link">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<!--
  ============================================
  COMPONENTE: SeccionRegistro
  ============================================
  
  DESCRIPCIÓN:
  Formulario para que los usuarios creen una nueva cuenta en el sistema.
  Permite registrar estudiantes y profesores con información personal básica.
  
  QUÉ HACE:
  - Muestra un formulario con campos: nombre, correo, contraseña, rol, carrera, universidad
  - Valida que los campos obligatorios estén completos
  - Valida que la contraseña tenga al menos 6 caracteres
  - Valida que las contraseñas coincidan
  - Crea el nuevo usuario en el backend
  - Redirige al área principal después de un registro exitoso
  - Permite cambiar al formulario de login
-->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/autenticacion';
import { ElMessage } from 'element-plus';
import { UserFilled, User, Message, Lock, School, OfficeBuilding } from '@element-plus/icons-vue';

// Emitir evento para cambiar al tab de login
// eslint-disable-next-line no-undef
defineEmits(['switch-tab']);

const router = useRouter();
const authStore = useAuthStore();

// Estados del formulario
const nombre = ref(''); // Nombre completo del usuario
const correo = ref(''); // Correo electrónico
const password = ref(''); // Contraseña
const confirmPassword = ref(''); // Confirmación de contraseña
const rol = ref('Estudiante'); // Rol del usuario (Estudiante o Profesor)
const carrera = ref(''); // Carrera (opcional)
const universidad = ref(''); // Universidad (opcional)
const loading = ref(false); // Muestra spinner mientras se procesa el registro
const errorMessage = ref(''); // Mensaje de error a mostrar

// Maneja el registro de un nuevo usuario
const handleRegistro = async () => {
  errorMessage.value = '';
  
  // Validar campos obligatorios
  if (!nombre.value || !correo.value || !password.value) {
    errorMessage.value = 'Por favor, completa los campos obligatorios.';
    return;
  }
  
  // Validar longitud mínima de contraseña
  if (password.value.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }
  
  // Validar que las contraseñas coincidan
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden.';
    return;
  }
  
  loading.value = true;
  try {
    // Intentar crear el usuario con el store
    const result = await authStore.registro({
      nombre: nombre.value,
      correo: correo.value,
      password: password.value,
      rol: rol.value,
      carrera: carrera.value,
      universidad: universidad.value
    });
    
    if (result.success) {
      // Si el registro es exitoso, mostrar mensaje y redirigir a home
      ElMessage.success(`¡Bienvenido, ${authStore.usuario?.nombre}! Tu cuenta ha sido creada exitosamente. 🎉`);
      router.push('/');
    } else {
      // Si falla, mostrar el mensaje de error
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
