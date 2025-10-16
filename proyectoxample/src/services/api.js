import axios from 'axios';
import config from '@/config/env';

// Configuración base de la API
const API_BASE_URL = config.API_BASE_URL;

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Agregar timestamp para evitar cache
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // El servidor respondió con un código de estado de error
      const message = error.response.data?.message || 'Error del servidor';
      throw new Error(message);
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      throw new Error('No se pudo conectar con el servidor');
    } else {
      // Algo más causó el error
      throw new Error('Error de configuración de la solicitud');
    }
  }
);

// Servicio de documentos
export const documentsService = {
  // Obtener todos los documentos con filtros
  async getDocuments(params = {}) {
    try {
      const response = await api.get('/documents', { params });
      return response;
    } catch (error) {
      console.error('Error obteniendo documentos:', error);
      throw error;
    }
  },

  // Obtener un documento por ID
  async getDocument(id) {
    try {
      const response = await api.get(`/documents/${id}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo documento:', error);
      throw error;
    }
  },

  // Crear nuevo documento
  async createDocument(formData) {
    try {
      const response = await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Error creando documento:', error);
      throw error;
    }
  },

  // Actualizar documento
  async updateDocument(id, data) {
    try {
      const response = await api.put(`/documents/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error actualizando documento:', error);
      throw error;
    }
  },

  // Eliminar documento
  async deleteDocument(id) {
    try {
      const response = await api.delete(`/documents/${id}`);
      return response;
    } catch (error) {
      console.error('Error eliminando documento:', error);
      throw error;
    }
  },

  // Descargar documento
  async downloadDocument(id) {
    try {
      const response = await api.get(`/documents/${id}/download`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      console.error('Error descargando documento:', error);
      throw error;
    }
  },

  // Valorar documento
  async rateDocument(id, rating) {
    try {
      const response = await api.post(`/documents/${id}/rate`, { rating });
      return response;
    } catch (error) {
      console.error('Error valorando documento:', error);
      throw error;
    }
  },

  // Obtener estadísticas
  async getStatistics() {
    try {
      const response = await api.get('/statistics');
      return response;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  },

  // Buscar documentos
  async searchDocuments(searchParams) {
    try {
      const response = await api.get('/documents', { params: searchParams });
      return response;
    } catch (error) {
      console.error('Error buscando documentos:', error);
      throw error;
    }
  }
};

// Servicio de utilidades
export const utilsService = {
  // Formatear tamaño de archivo
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Formatear fecha
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Generar etiquetas automáticas
  generateAutoTags(fileName) {
    const tags = [];
    const fileNameLower = fileName.toLowerCase();
    
    const keywordMap = {
      'matematicas': ['matemáticas', 'cálculo'],
      'fisica': ['física', 'ciencia'],
      'historia': ['historia', 'sociales'],
      'arte': ['arte', 'cultura'],
      'programacion': ['programación', 'informática'],
      'quimica': ['química', 'ciencia'],
      'biologia': ['biología', 'ciencia'],
      'literatura': ['literatura', 'humanidades'],
      'economia': ['economía', 'sociales'],
      'filosofia': ['filosofía', 'humanidades'],
      'geografia': ['geografía', 'sociales'],
      'ingles': ['inglés', 'idiomas'],
      'español': ['español', 'idiomas'],
      'frances': ['francés', 'idiomas']
    };

    Object.keys(keywordMap).forEach(keyword => {
      if (fileNameLower.includes(keyword)) {
        tags.push(...keywordMap[keyword]);
      }
    });

    // Etiquetas por tipo de contenido
    if (fileNameLower.includes('ejercicios') || fileNameLower.includes('practica')) {
      tags.push('ejercicios', 'práctica');
    }
    if (fileNameLower.includes('examen') || fileNameLower.includes('test')) {
      tags.push('examen', 'evaluación');
    }
    if (fileNameLower.includes('resumen') || fileNameLower.includes('summary')) {
      tags.push('resumen', 'síntesis');
    }
    if (fileNameLower.includes('apuntes') || fileNameLower.includes('notas')) {
      tags.push('apuntes', 'notas');
    }

    return [...new Set(tags)]; // Eliminar duplicados
  },

  // Crear FormData para subida de archivos
  createFormData(documentData, file) {
    const formData = new FormData();
    
    // Agregar datos del documento
    formData.append('title', documentData.title);
    formData.append('description', documentData.description);
    formData.append('author', documentData.author);
    formData.append('visibility', documentData.visibility || 'public');
    
    // Agregar etiquetas
    if (documentData.tags && documentData.tags.length > 0) {
      formData.append('tags', documentData.tags.join(','));
    }
    
    // Agregar archivo
    if (file) {
      formData.append('file', file);
    }
    
    return formData;
  },

  // Descargar archivo desde blob
  downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

// Verificar estado de la API
export const healthService = {
  async checkHealth() {
    try {
      const response = await api.get('/health');
      return response;
    } catch (error) {
      console.error('Error verificando estado de la API:', error);
      throw error;
    }
  }
};

export default api;
