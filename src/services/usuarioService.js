// Servicio para manejar las operaciones de usuarios
const API_URL = 'http://localhost:3000/api/usuarios';

export async function obtenerUsuario(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Error al obtener el usuario');
  }
  return await response.json();
}

export async function obtenerUsuarios() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener los usuarios');
  }
  return await response.json();
}

export async function crearUsuario(usuario) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuario),
  });
  if (!response.ok) {
    throw new Error('Error al crear el usuario');
  }
  return await response.json();
}

export async function actualizarUsuario(id, usuario) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuario),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar el usuario');
  }
  return await response.json();
}

export async function eliminarUsuario(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el usuario');
  }
  return await response.json();
}

