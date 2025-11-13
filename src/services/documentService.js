/**
 * ============================================
 * SERVICIO DE DOCUMENTOS
 * ============================================
 * 
 * Centraliza TODAS las operaciones relacionadas con documentos.
 * 
 * VENTAJAS:
 * - Evita repetir código
 * - Maneja errores de forma consistente
 * - El token se agrega automáticamente (gracias a axios interceptor)
 * 
 * FUNCIONES:
 * - obtenerDocumentos(): Obtiene todos los documentos
 * - obtenerDocumentoPorId(): Obtiene un documento específico
 * - subirDocumento(): Sube un nuevo documento
 * - descargarDocumento(): Descarga un documento
 * - valorarDocumento(): Valora un documento
 * - obtenerMiValoracion(): Obtiene la valoración del usuario actual
 * - eliminarDocumento(): Elimina un documento
 */

import apiClient from '@/utils/axios';
import { ENDPOINTS } from '@/config/api';

/**
 * Obtiene todos los documentos disponibles
 * @returns {Promise<Array>} Lista de documentos
 */
export async function obtenerDocumentos() {
  try {
    const response = await apiClient.get(ENDPOINTS.DOCUMENTOS.BASE);
    return response.data;
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    throw error; // El interceptor de axios ya mostró el mensaje de error
  }
}

/**
 * Obtener un documento por ID
 * @param {string} id - ID del documento
 * @returns {Promise<Object>} Documento
 */
export async function obtenerDocumentoPorId(id) {
  try {
    const response = await apiClient.get(ENDPOINTS.DOCUMENTOS.BY_ID(id));
    return response.data;
  } catch (error) {
    console.error('Error al obtener documento:', error);
    throw error;
  }
}

/**
 * Subir un nuevo documento
 * @param {FormData} formData - FormData con el archivo y datos del documento
 * @returns {Promise<Object>} Documento subido
 */
export async function subirDocumento(formData) {
  try {
    const response = await apiClient.post(ENDPOINTS.DOCUMENTOS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al subir documento:', error);
    throw error;
  }
}

/**
 * Descargar un documento
 * @param {string} id - ID del documento
 * @returns {Promise<Blob>} Archivo como Blob
 */
export async function descargarDocumento(id) {
  try {
    const response = await apiClient.get(ENDPOINTS.DOCUMENTOS.DOWNLOAD(id), {
      responseType: 'blob' // Importante para descargar archivos
    });
    return response.data;
  } catch (error) {
    console.error('Error al descargar documento:', error);
    throw error;
  }
}

/**
 * Valorar un documento
 * @param {string} documentId - ID del documento
 * @param {number} rating - Valoración (1-5)
 * @param {string} comentario - Comentario opcional
 * @returns {Promise<Object>} Respuesta con el documento actualizado
 */
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

/**
 * Obtener la valoración del usuario actual para un documento
 * @param {string} documentId - ID del documento
 * @returns {Promise<Object>} Valoración del usuario o null si no ha valorado
 */
export async function obtenerMiValoracion(documentId) {
  try {
    const response = await apiClient.get(ENDPOINTS.DOCUMENTOS.MY_RATING(documentId));
    return response.data;
  } catch (error) {
    // Si el error es 404, significa que el usuario no ha valorado aún
    if (error.response && error.response.status === 404) {
      return { hasRated: false };
    }
    console.error('Error al obtener valoración:', error);
    throw error;
  }
}

/**
 * Eliminar un documento (solo el propietario)
 * @param {string} id - ID del documento
 * @returns {Promise<Object>} Respuesta de confirmación
 */
export async function eliminarDocumento(id) {
  try {
    const response = await apiClient.delete(ENDPOINTS.DOCUMENTOS.BY_ID(id));
    return response.data;
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    throw error;
  }
}

