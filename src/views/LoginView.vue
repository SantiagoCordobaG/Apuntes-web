<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6 text-purple-700">
        Iniciar Sesión
      </h2>

      <form @submit.prevent="handleLogin">
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

        <div class="mb-6">
          <label class="font-semibold">Contraseña</label>
          <input
            v-model="password"
            type="password"
            class="w-full border border-gray-300 rounded-md p-2 mt-1"
            placeholder="••••••••"
            required
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
          <span v-if="loading">Ingresando...</span>
          <span v-else>Ingresar</span>
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 mt-4">
        ¿No tienes cuenta?
        <router-link to="/registro" class="text-purple-600 hover:underline">Regístrate aquí</router-link>
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

const correo = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';
  
  if (!correo.value || !password.value) {
    errorMessage.value = 'Por favor, completa todos los campos.';
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
