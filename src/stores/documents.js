import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { generarEtiquetasAutomaticas } from '@/services/autoTaggingService';

export const useDocumentsStore = defineStore('documents', () => {
  // Estado (los documentos se cargan desde el backend)
  const documents = ref([]);
  const searchQuery = ref('');
  const selectedTags = ref([]);
  const sortBy = ref('uploadDate');
  const sortOrder = ref('desc');
  const fileTypeFilter = ref('all');

  // Getters computados
  const filteredDocuments = computed(() => {
    let filtered = documents.value;

    // Filtro por texto de búsqueda
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query) ||
        doc.author.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filtro por etiquetas
    if (selectedTags.value.length > 0) {
      filtered = filtered.filter(doc =>
        selectedTags.value.some(tag => doc.tags.includes(tag))
      );
    }

    // Filtro por tipo de archivo
    if (fileTypeFilter.value !== 'all') {
      filtered = filtered.filter(doc => doc.fileType === fileTypeFilter.value);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy.value) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'uploadDate':
          aValue = new Date(a.uploadDate);
          bValue = new Date(b.uploadDate);
          break;
        case 'downloadCount':
          aValue = a.downloadCount;
          bValue = b.downloadCount;
          break;
        default:
          aValue = a.uploadDate;
          bValue = b.uploadDate;
      }

      if (sortOrder.value === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  });

  const allTags = computed(() => {
    const tags = new Set();
    documents.value.forEach(doc => {
      doc.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  });

  const statistics = computed(() => {
    const totalDocs = documents.value.length;
    if (totalDocs === 0) return { totalDocuments: 0, totalDownloads: 0, averageRating: '0.0', totalTags: 0 };
    const totalDownloads = documents.value.reduce((sum, doc) => sum + (doc.downloadCount || 0), 0);
    const avgRating = documents.value.reduce((sum, doc) => sum + (doc.rating || 0), 0) / totalDocs;
    return {
      totalDocuments: totalDocs,
      totalDownloads,
      averageRating: avgRating.toFixed(1),
      totalTags: allTags.value.length
    };
  });

  // Acciones
  const setDocuments = (docs) => {
    documents.value = docs;
  };

  const addDocument = (document) => {
    documents.value.unshift(document);
  };

  const updateDocumentRating = (documentId, rating) => {
    const doc = documents.value.find(d => d._id === documentId || d.id === documentId);
    if (doc) {
      const totalRating = (doc.rating || 0) * (doc.ratingCount || 0);
      doc.ratingCount = (doc.ratingCount || 0) + 1;
      doc.rating = (totalRating + rating) / doc.ratingCount;
    }
  };

  const incrementDownloadCount = (documentId) => {
    const doc = documents.value.find(d => d._id === documentId || d.id === documentId);
    if (doc) {
      doc.downloadCount = (doc.downloadCount || 0) + 1;
    }
  };

  const generateAutoTags = (fileName, title = '', description = '') => {
    // Usar el servicio mejorado de etiquetado automático
    return generarEtiquetasAutomaticas({
      fileName,
      title,
      description,
      includeKeywords: false // No incluir palabras clave extraídas por defecto
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
