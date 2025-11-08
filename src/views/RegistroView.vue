<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6 text-purple-700">
        Crear Cuenta
      </h2>

      <form @submit.prevent="handleRegistro">
        <div class="mb-4">
          <label class="font-semibold">Nombre completo</label>
          <input
            v-model="nombre"
            type="text"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
            placeholder="Juan Pérez"
            required
            :disabled="loading"
          />
        </div>

        <div class="mb-4">
          <label class="font-semibold">Correo electrónico</label>
          <input
            v-model="correo"
            type="email"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
            placeholder="tu@correo.com"
            required
            :disabled="loading"
          />
        </div>

        <div class="mb-4">
          <label class="font-semibold">Contraseña</label>
          <input
            v-model="password"
            type="password"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
            placeholder="Mínimo 6 caracteres"
            required
            minlength="6"
            :disabled="loading"
          />
          <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
        </div>

        <div class="mb-4">
          <label class="font-semibold">Confirmar contraseña</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
            placeholder="Repite tu contraseña"
            required
            :disabled="loading"
          />
        </div>

        <div class="mb-4">
          <label class="font-semibold">Rol</label>
          <select
            v-model="rol"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
            :disabled="loading"
          >
            <option value="Estudiante">Estudiante</option>
            <option value="Profesor">Profesor</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="font-semibold">Carrera (opcional)</label>
          <input
            v-model="carrera"
            type="text"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
            placeholder="Ingeniería, Medicina, etc."
            :disabled="loading"
          />
        </div>

        <div class="mb-6">
          <label class="font-semibold">Universidad (opcional)</label>
          <input
            v-model="universidad"
            type="text"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
            placeholder="Nombre de tu universidad"
            :disabled="loading"
          />
        </div>

        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="bg-purple-600 w-full text-white py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          :disabled="loading"
        >
          <span v-if="loading">Creando cuenta...</span>
          <span v-else>Registrarse</span>
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 mt-4">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="text-purple-600 hover:underline">Inicia sesión aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';

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

