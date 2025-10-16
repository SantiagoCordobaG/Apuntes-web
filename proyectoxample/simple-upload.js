const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function uploadDocument() {
  try {
    console.log('📤 Subiendo documento de prueba...');
    
    // Crear FormData
    const formData = new FormData();
    
    // Agregar el archivo
    formData.append('file', fs.createReadStream('test-document.txt'));
    
    // Agregar metadatos
    formData.append('title', 'Guía de Uso del Sistema');
    formData.append('description', 'Documento de prueba del sistema de gestión de documentos con funcionalidades completas');
    formData.append('author', 'Sistema de Pruebas');
    formData.append('tags', 'prueba,sistema,documentación,guía');
    formData.append('visibility', 'public');
    
    // Enviar request
    const response = await axios.post('http://localhost:3001/api/documents', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    
    console.log('✅ Documento subido exitosamente!');
    console.log('📄 ID del documento:', response.data.data.id);
    console.log('📝 Título:', response.data.data.title);
    console.log('👤 Autor:', response.data.data.author);
    console.log('🏷️ Etiquetas:', response.data.data.tags.join(', '));
    console.log('📊 Tamaño:', response.data.data.fileSize);
    
  } catch (error) {
    console.error('❌ Error subiendo documento:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

uploadDocument();
