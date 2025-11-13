/**
 * ============================================
 * STORE DE AUTENTICACIÓN (Pinia)
 * ============================================
 * 
 * Almacena y gestiona el estado de autenticación del usuario.
 * 
 * DATOS QUE GUARDA:
 * - usuario: Información del usuario logueado (nombre, correo, rol, etc.)
 * - token: Token JWT para autenticación en peticiones
 * - isAuthenticated: Boolean que indica si hay un usuario logueado
 * 
 * FUNCIONES PRINCIPALES:
 * - login(): Inicia sesión
 * - registro(): Registra nuevo usuario
 * - logout(): Cierra sesión
 * - getUsuarioActual(): Obtiene datos del usuario desde el backend
 * - initAuth(): Verifica si hay un usuario logueado al cargar la app
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/utils/axios';
import { ENDPOINTS } from '@/config/api';

export const useAuthStore = defineStore('auth', () => {
  // ===== ESTADO =====
  // Datos reactivos que se pueden usar en toda la aplicación
  
  // Usuario actual (se carga del localStorage si existe)
  const usuario = ref(
    localStorage.getItem('usuario') 
      ? JSON.parse(localStorage.getItem('usuario')) 
      : null
  );
  
  // Token JWT (se carga del localStorage si existe)
  const token = ref(localStorage.getItem('token') || null);
  
  // Indica si hay un usuario autenticado (true si hay token)
  const isAuthenticated = ref(!!token.value);

  /**
   * ===== FUNCIONES =====
   */
  
  /**
   * Inicializa la autenticación al cargar la app
   * Verifica si hay un token guardado y obtiene los datos del usuario
   */
  const initAuth = async () => {
    // Si hay un token guardado
    if (token.value) {
      try {
        // Pide los datos del usuario al backend usando el token
        const response = await apiClient.get(ENDPOINTS.AUTH.ME);
        
        // Actualiza el estado con los datos recibidos
        usuario.value = response.data.usuario;
        isAuthenticated.value = true;
        
        // Actualiza el localStorage con la información actualizada
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        
        // Si hay error de conexión (no es 401), mantener el usuario del localStorage
        // Si es 401 (token inválido), hacer logout
        if (usuario.value && error.response?.status !== 401) {
          isAuthenticated.value = true;
        } else {
          logout(); // Limpia todo si el token es inválido
        }
      }
    }
    return Promise.resolve();
  };

  /**
   * Inicia sesión con correo y contraseña
   * @param {string} correo - Correo del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Object} { success: boolean, message: string }
   */
  const login = async (correo, password) => {
    try {
      // Envía credenciales al backend
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
        correo,
        password
      });

      // Actualiza el estado con los datos recibidos
      usuario.value = response.data.usuario;
      token.value = response.data.token;
      isAuthenticated.value = true;
      
      // Guarda el token y usuario en localStorage (persistencia)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      
      return { success: true, message: response.data.message || 'Login exitoso' };
    } catch (error) {
      console.error('Error al hacer login:', error);
      const errorMessage = error.response?.data?.error || 'Error al hacer login';
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Registra un nuevo usuario
   * @param {Object} usuarioData - Datos del usuario (nombre, correo, password, etc.)
   * @returns {Object} { success: boolean, message: string }
   */
  const registro = async (usuarioData) => {
    try {
      // Envía datos al backend para crear el usuario
      const response = await apiClient.post(ENDPOINTS.AUTH.REGISTRO, usuarioData);

      // Actualiza el estado con los datos recibidos
      usuario.value = response.data.usuario;
      token.value = response.data.token;
      isAuthenticated.value = true;
      
      // Guarda el token y usuario en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      
      return { success: true, message: response.data.message || 'Registro exitoso' };
    } catch (error) {
      console.error('Error al registrar:', error);
      const errorMessage = error.response?.data?.error || 'Error al registrar usuario';
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Cierra la sesión del usuario
   * Limpia el estado y elimina datos del localStorage
   */
  const logout = () => {
    usuario.value = null;
    token.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  /**
   * Obtiene los datos actuales del usuario desde el backend
   * @returns {Object|null} Datos del usuario o null si hay error
   */
  const getUsuarioActual = async () => {
    // Si no hay token, no se puede obtener el usuario
    if (!token.value) {
      return null;
    }

    try {
      // Pide los datos al backend usando el token
      const response = await apiClient.get(ENDPOINTS.AUTH.ME);
      
      // Actualiza el estado
      usuario.value = response.data.usuario;
      return response.data.usuario;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      
      // Si el token es inválido (401), hacer logout
      if (error.response?.status === 401) {
        logout();
      }
      return null;
    }
  };

  // ===== EXPORTAR =====
  // Retorna todo lo que se puede usar desde otros componentes
  return {
    // Estado (datos reactivos)
    usuario,
    token,
    isAuthenticated,
    
    // Funciones (acciones)
    login,
    registro,
    logout,
    getUsuarioActual,
    initAuth
  };
});

