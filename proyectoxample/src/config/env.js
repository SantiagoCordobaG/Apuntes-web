// Configuración de entorno
const config = {
  development: {
    API_BASE_URL: 'http://localhost:3001/api',
    APP_TITLE: 'Sistema de Gestión de Documentos',
    APP_VERSION: '1.0.0',
    UPLOAD_MAX_SIZE: 10485760, // 10MB
    ALLOWED_FILE_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  production: {
    API_BASE_URL: process.env.VUE_APP_API_URL || '/api',
    APP_TITLE: 'Sistema de Gestión de Documentos',
    APP_VERSION: '1.0.0',
    UPLOAD_MAX_SIZE: 10485760, // 10MB
    ALLOWED_FILE_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }
};

// Obtener configuración según el entorno
const env = process.env.NODE_ENV || 'development';
export default config[env];
