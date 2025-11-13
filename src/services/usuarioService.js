// Servicio para manejar las operaciones de usuarios
import apiClient from '@/utils/axios';
import { ENDPOINTS } from '@/config/api';

/**
 * Obtener un usuario por ID
 * @param {string} id - ID del usuario
 * @returns {Promise<Object>} Usuario
 */
export async function obtenerUsuario(id) {
  try {
    const response = await apiClient.get(ENDPOINTS.USUARIOS.BY_ID(id));
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
}

/**
 * Obtener todos los usuarios
 * @returns {Promise<Array>} Lista de usuarios
 */
export async function obtenerUsuarios() {
  try {
    const response = await apiClient.get(ENDPOINTS.USUARIOS.BASE);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

/**
 * Crear un nuevo usuario
 * @param {Object} usuario - Datos del usuario
 * @returns {Promise<Object>} Usuario creado
 */
export async function crearUsuario(usuario) {
  try {
    const response = await apiClient.post(ENDPOINTS.USUARIOS.BASE, usuario);
    return response.data;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

/**
 * Actualizar un usuario
 * @param {string} id - ID del usuario
 * @param {Object} usuario - Datos actualizados
 * @returns {Promise<Object>} Usuario actualizado
 */
export async function actualizarUsuario(id, usuario) {
  try {
    const response = await apiClient.put(ENDPOINTS.USUARIOS.BY_ID(id), usuario);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
}

/**
 * Eliminar un usuario
 * @param {string} id - ID del usuario
 * @returns {Promise<Object>} Respuesta de confirmación
 */
export async function eliminarUsuario(id) {
  try {
    const response = await apiClient.delete(ENDPOINTS.USUARIOS.BY_ID(id));
    return response.data;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
}

