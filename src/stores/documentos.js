/**
 * ============================================
 * STORE DE DOCUMENTOS (Pinia)
 * ============================================
 * 
 * DESCRIPCIÓN:
 * Almacena y gestiona los documentos en la aplicación. Permite filtrar, ordenar y
 * calcular estadísticas de los documentos.
 * 
 * QUÉ HACE:
 * - Guarda la lista de todos los documentos
 * - Filtra documentos por texto, etiquetas y tipo de archivo
 * - Ordena documentos por diferentes criterios
 * - Calcula estadísticas (total de documentos, descargas, valoración promedio)
 * - Genera etiquetas automáticas para documentos
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { generarEtiquetasAutomaticas } from '@/services/servicioEtiquetadoAutomatico';

export const useDocumentsStore = defineStore('documents', () => {
  // ===== ESTADO =====
  const documents = ref([]); // Lista de todos los documentos
  const searchQuery = ref(''); // Texto de búsqueda
  const selectedTags = ref([]); // Etiquetas seleccionadas para filtrar
  const sortBy = ref('uploadDate'); // Criterio de ordenamiento
  const sortOrder = ref('desc'); // Orden ascendente o descendente
  const fileTypeFilter = ref('all'); // Filtro por tipo de archivo

  // ===== GETTERS (valores calculados automáticamente) =====
  
  /**
   * Documentos filtrados según los filtros aplicados
   */
  const filteredDocuments = computed(() => {
    let filtered = [...documents.value];

    // Filtro por texto de búsqueda
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title?.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query) ||
        doc.author?.toLowerCase().includes(query) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filtro por etiquetas seleccionadas
    if (selectedTags.value.length > 0) {
      filtered = filtered.filter(doc =>
        selectedTags.value.some(tag => doc.tags?.includes(tag))
      );
    }

    // Filtro por tipo de archivo
    if (fileTypeFilter.value !== 'all') {
      filtered = filtered.filter(doc => doc.fileType === fileTypeFilter.value);
    }

    // Ordenar los resultados
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy.value) {
        case 'title':
          aValue = (a.title || '').toLowerCase();
          bValue = (b.title || '').toLowerCase();
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'uploadDate':
          aValue = new Date(a.uploadDate);
          bValue = new Date(b.uploadDate);
          break;
        case 'downloadCount':
          aValue = a.downloadCount || 0;
          bValue = b.downloadCount || 0;
          break;
        default:
          aValue = a.uploadDate;
          bValue = b.uploadDate;
      }
      return sortOrder.value === 'asc' 
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    });

    return filtered;
  });

  /**
   * Lista de todas las etiquetas únicas de todos los documentos
   */
  const allTags = computed(() => {
    const tags = new Set();
    documents.value.forEach(doc => {
      doc.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  });

  /**
   * Estadísticas generales de los documentos
   */
  const statistics = computed(() => {
    const totalDocs = documents.value.length;
    if (totalDocs === 0) {
      return { totalDocuments: 0, totalDownloads: 0, averageRating: '0.0', totalTags: 0 };
    }
    const totalDownloads = documents.value.reduce((sum, doc) => sum + (doc.downloadCount || 0), 0);
    const avgRating = documents.value.reduce((sum, doc) => sum + (doc.rating || 0), 0) / totalDocs;
    return {
      totalDocuments: totalDocs,
      totalDownloads,
      averageRating: avgRating.toFixed(1),
      totalTags: allTags.value.length
    };
  });

  // ===== ACCIONES (funciones para modificar el estado) =====
  
  /**
   * Establece la lista de documentos
   */
  const setDocuments = (docs) => {
    documents.value = docs;
  };

  /**
   * Agrega un nuevo documento al principio de la lista
   */
  const addDocument = (document) => {
    documents.value.unshift(document);
  };

  /**
   * Actualiza la valoración de un documento
   */
  const updateDocumentRating = (documentId, rating) => {
    const doc = documents.value.find(d => d._id === documentId || d.id === documentId);
    if (doc) {
      const totalRating = (doc.rating || 0) * (doc.ratingCount || 0);
      doc.ratingCount = (doc.ratingCount || 0) + 1;
      doc.rating = (totalRating + rating) / doc.ratingCount;
    }
  };

  /**
   * Incrementa el contador de descargas de un documento
   */
  const incrementDownloadCount = (documentId) => {
    const doc = documents.value.find(d => d._id === documentId || d.id === documentId);
    if (doc) {
      doc.downloadCount = (doc.downloadCount || 0) + 1;
    }
  };

  /**
   * Genera etiquetas automáticas para un documento
   */
  const generateAutoTags = (fileName, title = '', description = '') => {
    return generarEtiquetasAutomaticas({
      fileName,
      title,
      description,
      includeKeywords: false
    });
  };

  return {
    // Estado
    documents,
    searchQuery,
    selectedTags,
    sortBy,
    sortOrder,
    fileTypeFilter,
    // Getters
    filteredDocuments,
    allTags,
    statistics,
    // Acciones
    setDocuments,
    addDocument,
    updateDocumentRating,
    incrementDownloadCount,
    generateAutoTags
  };
});
