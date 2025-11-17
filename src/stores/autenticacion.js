/**
 * ============================================
 * STORE DE AUTENTICACIÓN (Pinia)
 * ============================================
 * 
 * DESCRIPCIÓN:
 * Almacena y gestiona el estado de autenticación del usuario en toda la aplicación.
 * Es el store global que mantiene la información del usuario logueado y su token JWT.
 * 
 * QUÉ HACE:
 * - Guarda los datos del usuario logueado (nombre, correo, rol, etc.)
 * - Guarda el token JWT para autenticación en peticiones al backend
 * - Permite iniciar sesión, registrarse y cerrar sesión
 * - Verifica automáticamente si hay un usuario logueado al cargar la app
 * - Mantiene la sesión del usuario guardando datos en localStorage
 * - Obtiene los datos actualizados del usuario desde el backend
 * 
 * DATOS QUE GUARDA:
 * - usuario: Información del usuario (nombre, correo, rol, carrera, universidad, etc.)
 * - token: Token JWT para hacer peticiones autenticadas al backend
 * - isAuthenticated: true si hay un usuario logueado, false si no
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/utils/axios';
import { ENDPOINTS } from '@/config/api';

export const useAuthStore = defineStore('auth', () => {
  // ===== ESTADO (datos reactivos) =====
  
  // Usuario actual (se carga del localStorage si existe para mantener la sesión)
  const usuario = ref(
    localStorage.getItem('usuario') 
      ? JSON.parse(localStorage.getItem('usuario')) 
      : null
  );
  
  // Token JWT (se carga del localStorage si existe)
  const token = ref(localStorage.getItem('token') || null);
  
  // Indica si hay un usuario autenticado (true si hay token guardado)
  const isAuthenticated = ref(!!token.value);

  // ===== FUNCIONES =====
  
  /**
   * Inicializa la autenticación al cargar la app
   * Verifica si hay un token guardado y obtiene los datos del usuario
   */
  const initAuth = async () => {
    if (!token.value) return Promise.resolve();
    
    try {
      // Pide los datos del usuario al backend usando el token guardado
      const response = await apiClient.get(ENDPOINTS.AUTH.ME);
      usuario.value = response.data.usuario;
      isAuthenticated.value = true;
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      // Si el token es inválido (401), limpiar todo. Si es otro error, mantener el usuario del localStorage
      if (error.response?.status === 401 || !usuario.value) {
        logout();
      } else {
        isAuthenticated.value = true;
      }
    }
    return Promise.resolve();
  };

  /**
   * Inicia sesión con correo y contraseña
   * @param {string} correo - Correo electrónico del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Object} { success: boolean, message: string }
   */
  const login = async (correo, password) => {
    try {
      // Envía credenciales al backend
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, { correo, password });

      // Guarda los datos recibidos
      usuario.value = response.data.usuario;
      token.value = response.data.token;
      isAuthenticated.value = true;
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      
      return { success: true, message: response.data.message || 'Login exitoso' };
    } catch (error) {
      console.error('Error al hacer login:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Error al hacer login' 
      };
    }
  };

  /**
   * Registra un nuevo usuario en el sistema
   * @param {Object} usuarioData - Datos del usuario (nombre, correo, password, rol, etc.)
   * @returns {Object} { success: boolean, message: string }
   */
  const registro = async (usuarioData) => {
    try {
      // Envía datos al backend para crear el nuevo usuario
      const response = await apiClient.post(ENDPOINTS.AUTH.REGISTRO, usuarioData);

      // Guarda los datos recibidos
      usuario.value = response.data.usuario;
      token.value = response.data.token;
      isAuthenticated.value = true;
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      
      return { success: true, message: response.data.message || 'Registro exitoso' };
    } catch (error) {
      console.error('Error al registrar:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Error al registrar usuario' 
      };
    }
  };

  /**
   * Cierra la sesión del usuario
   * Limpia todos los datos de autenticación
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
    if (!token.value) return null;

    try {
      // Pide los datos actualizados al backend
      const response = await apiClient.get(ENDPOINTS.AUTH.ME);
      usuario.value = response.data.usuario;
      return response.data.usuario;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      // Si el token es inválido, cerrar sesión
      if (error.response?.status === 401) logout();
      return null;
    }
  };

  // ===== EXPORTAR =====
  // Retorna todo lo que otros componentes pueden usar
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

