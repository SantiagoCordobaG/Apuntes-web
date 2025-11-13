// Configuración de la API
// Usa variables de entorno si están disponibles, sino usa valores por defecto
// Vue CLI usa process.env, no import.meta.env
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api';

export const API_URL = `${API_BASE_URL}${API_PREFIX}`;
export const API_BASE = API_BASE_URL;

// Endpoints específicos
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTRO: '/auth/registro',
    ME: '/auth/me'
  },
  DOCUMENTOS: {
    BASE: '/Documentos',
    UPLOAD: '/Documentos/upload',
    DOWNLOAD: (id) => `/Documentos/download/${id}`,
    RATE: (id) => `/Documentos/${id}/rate`,
    MY_RATING: (id) => `/Documentos/${id}/my-rating`,
    BY_ID: (id) => `/Documentos/${id}`
  },
  USUARIOS: {
    BASE: '/usuarios',
    BY_ID: (id) => `/usuarios/${id}`
  }
};

