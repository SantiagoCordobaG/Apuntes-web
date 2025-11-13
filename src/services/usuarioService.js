import apiClient from '@/utils/axios';
import { ENDPOINTS } from '@/config/api';

// Helper para manejar errores
const handleError = (error, operation) => {
  console.error(`Error al ${operation}:`, error);
  throw error;
};

export async function obtenerUsuario(id) {
  try {
    return (await apiClient.get(ENDPOINTS.USUARIOS.BY_ID(id))).data;
  } catch (error) {
    handleError(error, 'obtener usuario');
  }
}

export async function obtenerUsuarios() {
  try {
    return (await apiClient.get(ENDPOINTS.USUARIOS.BASE)).data;
  } catch (error) {
    handleError(error, 'obtener usuarios');
  }
}

export async function crearUsuario(usuario) {
  try {
    return (await apiClient.post(ENDPOINTS.USUARIOS.BASE, usuario)).data;
  } catch (error) {
    handleError(error, 'crear usuario');
  }
}

export async function actualizarUsuario(id, usuario) {
  try {
    return (await apiClient.put(ENDPOINTS.USUARIOS.BY_ID(id), usuario)).data;
  } catch (error) {
    handleError(error, 'actualizar usuario');
  }
}

export async function eliminarUsuario(id) {
  try {
    return (await apiClient.delete(ENDPOINTS.USUARIOS.BY_ID(id))).data;
  } catch (error) {
    handleError(error, 'eliminar usuario');
  }
}

