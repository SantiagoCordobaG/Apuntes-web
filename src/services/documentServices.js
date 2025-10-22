// src/services/documentService.js
const API_URL = '/api/apuntes';

export async function getApuntes() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener los apuntes');
  }
  return await response.json();
}
