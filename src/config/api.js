/**
 * ============================================
 * CONFIGURACIÓN DE LA API
 * ============================================
 * 
 * DESCRIPCIÓN:
 * Define la URL base de la API y todos los endpoints del backend. Centraliza todas
 * las rutas de la API en un solo lugar para facilitar su mantenimiento.
 * 
 * QUÉ HACE:
 * - Define la URL base del backend (por defecto: http://localhost:3000/api)
 * - Define todos los endpoints organizados por categoría (AUTH, DOCUMENTOS, USUARIOS)
 * - Permite cambiar la URL del backend usando variables de entorno
 * 
 * NOTA IMPORTANTE: Vue CLI usa process.env, no import.meta.env
 * 
 * Para cambiar la URL del backend, crea un archivo .env en la raíz del proyecto con:
 * VUE_APP_API_URL=http://tu-servidor.com
 */

// URL base del backend (usa variable de entorno si existe, sino localhost:3000)
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api'; // Prefijo común para todas las rutas

// URL completa de la API
export const API_URL = `${API_BASE_URL}${API_PREFIX}`;
export const API_BASE = API_BASE_URL;

/**
 * ===== ENDPOINTS =====
 * Todas las rutas de la API organizadas por categoría
 */
export const ENDPOINTS = {
  // Rutas de autenticación
  AUTH: {
    LOGIN: '/auth/login',           // POST - Iniciar sesión
    REGISTRO: '/auth/registro',     // POST - Registrar usuario
    ME: '/auth/me'                  // GET - Obtener usuario actual
  },
  
  // Rutas de documentos
  DOCUMENTOS: {
    BASE: '/Documentos',                                    // GET - Obtener todos
    UPLOAD: '/Documentos/upload',                          // POST - Subir documento
    DOWNLOAD: (id) => `/Documentos/download/${id}`,       // GET - Descargar documento
    RATE: (id) => `/Documentos/${id}/rate`,                // POST - Valorar documento
    MY_RATING: (id) => `/Documentos/${id}/my-rating`,      // GET - Mi valoración
    BY_ID: (id) => `/Documentos/${id}`                    // GET - Obtener por ID
  },
  
  // Rutas de usuarios
  USUARIOS: {
    BASE: '/usuarios',                    // GET - Obtener todos
    BY_ID: (id) => `/usuarios/${id}`      // GET/PUT/DELETE - Operaciones por ID
  }
};

