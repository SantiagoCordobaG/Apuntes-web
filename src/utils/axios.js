/**
 * ============================================
 * CONFIGURACIÓN DE AXIOS (Cliente HTTP)
 * ============================================
 * 
 * DESCRIPCIÓN:
 * Crea una instancia de axios configurada específicamente para esta aplicación.
 * Incluye interceptores que agregan automáticamente el token JWT y manejan errores
 * de forma centralizada.
 * 
 * QUÉ HACE:
 * - Configura la URL base de la API (http://localhost:3000/api)
 * - Agrega el token JWT automáticamente en el header Authorization de cada petición
 * - Maneja errores globalmente (401, 403, 404, 500, etc.)
 * - Redirige a login si el token expira o es inválido
 * - Muestra mensajes de error amigables al usuario
 * - Maneja errores de conexión (servidor no disponible, sin internet, etc.)
 * 
 * VENTAJAS:
 * - No necesitas agregar el token manualmente en cada petición
 * - Los errores se manejan automáticamente y de forma consistente
 * - Si el token expira, redirige automáticamente a login
 */

import axios from 'axios';
import { API_URL } from '@/config/api';
import { ElMessage } from 'element-plus';

// ===== CREAR INSTANCIA DE AXIOS =====
// Esta instancia se usa para todas las peticiones HTTP
const apiClient = axios.create({
  baseURL: API_URL,        // URL base: http://localhost:3000/api
  timeout: 30000,          // Timeout de 30 segundos
  headers: {
    'Content-Type': 'application/json' // Por defecto envía JSON
  }
});

/**
 * ===== INTERCEPTOR DE SOLICITUDES =====
 * Se ejecuta ANTES de cada petición HTTP
 * 
 * FUNCIÓN: Agrega el token JWT automáticamente al header Authorization
 */
apiClient.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    // Si hay token, agregarlo al header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // Continuar con la petición
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * ===== INTERCEPTOR DE RESPUESTAS =====
 * Se ejecuta DESPUÉS de cada respuesta HTTP
 * 
 * FUNCIÓN: Maneja errores globalmente y muestra mensajes al usuario
 */
apiClient.interceptors.response.use(
  // Si la respuesta es exitosa → devolverla tal cual
  (response) => response,

  // Si hay un error → manejarlo
  (error) => {
    if (error.response) {
      // El servidor respondió con un error
      const { status, data } = error.response;

      // ===== ERROR 401: Token inválido o expirado =====
      if (status === 401) {
        // Limpiar datos de autenticación
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        // Solo mostrar mensaje si no estamos en login
        if (!window.location.pathname.includes('/login')) {
          ElMessage.warning('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          window.location.href = '/login'; // Redirigir a login
        }
      }
      // ===== ERROR 403: Sin permisos =====
      else if (status === 403) {
        ElMessage.error('No tienes permisos para realizar esta acción');
      }
      // ===== ERROR 404: No encontrado =====
      else if (status === 404) {
        ElMessage.error('Recurso no encontrado');
      }
      // ===== ERROR 500+: Error del servidor =====
      else if (status >= 500) {
        ElMessage.error('Error del servidor. Por favor intenta más tarde');
      }
      // ===== OTROS ERRORES =====
      else if (data && (data.error || data.message)) {
        ElMessage.error(data.error || data.message); // Mostrar mensaje del servidor
      } else {
        ElMessage.error('Ocurrió un error inesperado: ' + status);
      }
    }
    // ===== ERROR DE RED =====
    // El servidor no respondió (no está corriendo, sin internet, etc.)
    else if (error.request) {
      ElMessage.error('No se pudo conectar con el servidor. Verifica tu conexión o que el backend esté corriendo.');
    }
    // ===== ERROR AL CONFIGURAR LA PETICIÓN =====
    else {
      ElMessage.error('Error al procesar la solicitud');
    }

    return Promise.reject(error);
  }
);

export default apiClient;

