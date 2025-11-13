import axios from 'axios';
import { API_URL } from '@/config/api';
import { ElMessage } from 'element-plus';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de solicitudes: agregar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas: manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, devolverla tal cual
    return response;
  },
  (error) => {
    // Manejar errores de respuesta
    if (error.response) {
      const { status, data } = error.response;
      
      // Token expirado o inválido
      if (status === 401) {
        // Limpiar token y redirigir al login
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        
        // Solo mostrar mensaje si no estamos en la página de login
        if (!window.location.pathname.includes('/login')) {
          ElMessage.warning('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          // Redirigir al login
          window.location.href = '/login';
        }
      } else if (status === 403) {
        ElMessage.error('No tienes permisos para realizar esta acción');
      } else if (status === 404) {
        ElMessage.error('Recurso no encontrado');
      } else if (status >= 500) {
        ElMessage.error('Error del servidor. Por favor intenta más tarde');
      } else if (data && data.error) {
        // Mostrar mensaje de error del servidor
        ElMessage.error(data.error);
      } else {
        ElMessage.error('Ocurrió un error inesperado');
      }
    } else if (error.request) {
      // Error de red (sin respuesta del servidor)
      ElMessage.error('No se pudo conectar con el servidor. Verifica tu conexión o que el backend esté corriendo.');
    } else {
      // Error al configurar la solicitud
      ElMessage.error('Error al procesar la solicitud');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

