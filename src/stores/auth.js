import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/utils/axios';
import { ENDPOINTS } from '@/config/api';

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const usuario = ref(
    localStorage.getItem('usuario') 
      ? JSON.parse(localStorage.getItem('usuario')) 
      : null
  );
  const token = ref(localStorage.getItem('token') || null);
  const isAuthenticated = ref(!!token.value);

  // Inicializar usuario si hay token
  const initAuth = async () => {
    if (token.value) {
      try {
        const response = await apiClient.get(ENDPOINTS.AUTH.ME);
        usuario.value = response.data.usuario;
        isAuthenticated.value = true;
        // Actualizar localStorage con la información actualizada
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        // Si hay error de conexión, mantener el usuario del localStorage
        // pero marcar como no autenticado si es necesario
        if (usuario.value && error.response?.status !== 401) {
          isAuthenticated.value = true;
        } else {
          logout();
        }
      }
    }
    // Retornar para que la promesa se resuelva
    return Promise.resolve();
  };

  // Login
  const login = async (correo, password) => {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
        correo,
        password
      });

      usuario.value = response.data.usuario;
      token.value = response.data.token;
      isAuthenticated.value = true;
      
      // Guardar token en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      
      return { success: true, message: response.data.message || 'Login exitoso' };
    } catch (error) {
      console.error('Error al hacer login:', error);
      const errorMessage = error.response?.data?.error || 'Error al hacer login';
      return { success: false, message: errorMessage };
    }
  };

  // Registro
  const registro = async (usuarioData) => {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.REGISTRO, usuarioData);

      usuario.value = response.data.usuario;
      token.value = response.data.token;
      isAuthenticated.value = true;
      
      // Guardar token en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      
      return { success: true, message: response.data.message || 'Registro exitoso' };
    } catch (error) {
      console.error('Error al registrar:', error);
      const errorMessage = error.response?.data?.error || 'Error al registrar usuario';
      return { success: false, message: errorMessage };
    }
  };

  // Logout
  const logout = () => {
    usuario.value = null;
    token.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  // Obtener usuario actual
  const getUsuarioActual = async () => {
    if (!token.value) {
      return null;
    }

    try {
      const response = await apiClient.get(ENDPOINTS.AUTH.ME);
      usuario.value = response.data.usuario;
      return response.data.usuario;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      if (error.response?.status === 401) {
        logout();
      }
      return null;
    }
  };

  return {
    usuario,
    token,
    isAuthenticated,
    login,
    registro,
    logout,
    getUsuarioActual,
    initAuth
  };
});

