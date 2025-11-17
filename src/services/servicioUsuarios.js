/**
 * ============================================
 * SERVICIO DE USUARIOS
 * ============================================
 * 
 * DESCRIPCIÓN:
 * Centraliza todas las operaciones relacionadas con usuarios. Todas estas funciones
 * hacen peticiones HTTP al backend para gestionar usuarios.
 * 
 * QUÉ HACE:
 * - Obtiene todos los usuarios o un usuario específico por ID
 * - Crea nuevos usuarios en el sistema
 * - Actualiza información de usuarios existentes
 * - Elimina usuarios del sistema (solo administradores)
 * 
 * NOTA: El token JWT se agrega automáticamente en todas las peticiones gracias al
 * interceptor de axios configurado en @/utils/axios.js
 */

import apiClient from '@/utils/axios';
import { ENDPOINTS } from '@/config/api';

// Obtiene un usuario específico por su ID
export async function obtenerUsuario(id) {
  try {
    return (await apiClient.get(ENDPOINTS.USUARIOS.BY_ID(id))).data;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
}

// Obtiene todos los usuarios del sistema
export async function obtenerUsuarios() {
  try {
    return (await apiClient.get(ENDPOINTS.USUARIOS.BASE)).data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

// Crea un nuevo usuario
export async function crearUsuario(usuario) {
  try {
    return (await apiClient.post(ENDPOINTS.USUARIOS.BASE, usuario)).data;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

// Actualiza los datos de un usuario existente
// id: ID del usuario a actualizar
// usuario: objeto con los nuevos datos
export async function actualizarUsuario(id, usuario) {
  try {
    return (await apiClient.put(ENDPOINTS.USUARIOS.BY_ID(id), usuario)).data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
}

// Elimina un usuario del sistema
export async function eliminarUsuario(id) {
  try {
    return (await apiClient.delete(ENDPOINTS.USUARIOS.BY_ID(id))).data;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
}

