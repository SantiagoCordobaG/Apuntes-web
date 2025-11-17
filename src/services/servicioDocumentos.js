/**
 * ============================================
 * SERVICIO DE DOCUMENTOS
 * ============================================
 * 
 * DESCRIPCIÓN:
 * Centraliza todas las operaciones relacionadas con documentos. Todas estas funciones
 * hacen peticiones HTTP al backend para gestionar documentos.
 * 
 * QUÉ HACE:
 * - Obtiene todos los documentos o un documento específico por ID
 * - Sube nuevos documentos al servidor
 * - Descarga documentos del servidor
 * - Permite valorar documentos con estrellas y comentarios
 * - Permite eliminar documentos (solo el propietario)
 * 
 * NOTA: El token JWT se agrega automáticamente en todas las peticiones gracias al
 * interceptor de axios configurado en @/utils/axios.js
 */

import apiClient from '@/utils/axios';
import { ENDPOINTS } from '@/config/api';

// Obtiene todos los documentos disponibles en el sistema
export async function obtenerDocumentos() {
  try {
    const response = await apiClient.get(ENDPOINTS.DOCUMENTOS.BASE);
    return response.data;
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    throw error;
  }
}

// Obtiene un documento específico por su ID
export async function obtenerDocumentoPorId(id) {
  try {
    const response = await apiClient.get(ENDPOINTS.DOCUMENTOS.BY_ID(id));
    return response.data;
  } catch (error) {
    console.error('Error al obtener documento:', error);
    throw error;
  }
}

// Sube un nuevo documento al servidor
// formData: contiene el archivo y toda la información del documento
export async function subirDocumento(formData) {
  try {
    const response = await apiClient.post(ENDPOINTS.DOCUMENTOS.UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error al subir documento:', error);
    throw error;
  }
}

// Descarga un documento del servidor
// Retorna el archivo como Blob (para poder descargarlo)
export async function descargarDocumento(id) {
  try {
    const response = await apiClient.get(ENDPOINTS.DOCUMENTOS.DOWNLOAD(id), {
      responseType: 'blob' // Importante: permite descargar archivos
    });
    return response.data;
  } catch (error) {
    console.error('Error al descargar documento:', error);
    throw error;
  }
}

// Valora un documento (rating de 1 a 5 estrellas)
// documentId: ID del documento a valorar
// rating: número de estrellas (1-5)
// comentario: comentario opcional
export async function valorarDocumento(documentId, rating, comentario = '') {
  try {
    const response = await apiClient.post(ENDPOINTS.DOCUMENTOS.RATE(documentId), {
      rating,
      comentario
    });
    return response.data;
  } catch (error) {
    console.error('Error al valorar documento:', error);
    throw error;
  }
}

// Obtiene la valoración que el usuario actual hizo de un documento
// Si el usuario no ha valorado, retorna { hasRated: false }
export async function obtenerMiValoracion(documentId) {
  try {
    const response = await apiClient.get(ENDPOINTS.DOCUMENTOS.MY_RATING(documentId));
    return response.data;
  } catch (error) {
    // Si el error es 404, el usuario no ha valorado aún
    if (error.response?.status === 404) {
      return { hasRated: false };
    }
    console.error('Error al obtener valoración:', error);
    throw error;
  }
}

// Elimina un documento (solo el propietario puede eliminarlo)
export async function eliminarDocumento(id) {
  try {
    const response = await apiClient.delete(ENDPOINTS.DOCUMENTOS.BY_ID(id));
    return response.data;
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    throw error;
  }
}

