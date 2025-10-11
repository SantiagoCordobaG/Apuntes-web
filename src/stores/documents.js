import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useDocumentsStore = defineStore('documents', () => {
  // Estado
  const documents = ref([
    {
      id: 2,
      title: 'Historia del Arte Moderno',
      description: 'Movimientos artísticos del siglo XX',
      fileName: 'historia_arte_moderno.docx',
      fileType: 'docx',
      uploadDate: '2024-01-14',
      author: 'Dra. Martínez',
      tags: ['arte', 'historia', 'modernismo'],
      rating: 4.2,
      ratingCount: 18,
      fileSize: '1.8 MB',
      downloadCount: 89
    },
    {
      id: 3,
      title: 'Física Cuántica Básica',
      description: 'Introducción a la mecánica cuántica',
      fileName: 'fisica_cuantica.pdf',
      fileType: 'pdf',
      uploadDate: '2024-01-13',
      author: 'Dr. López',
      tags: ['física', 'cuántica', 'ciencia'],
      rating: 4.8,
      ratingCount: 31,
      fileSize: '3.1 MB',
      downloadCount: 203
    }
  ]);

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
    const totalDownloads = documents.value.reduce((sum, doc) => sum + doc.downloadCount, 0);
    const avgRating = documents.value.reduce((sum, doc) => sum + doc.rating, 0) / totalDocs;
    
    return {
      totalDocuments: totalDocs,
      totalDownloads,
      averageRating: avgRating.toFixed(1),
      totalTags: allTags.value.length
    };
  });

  // Acciones
  const addDocument = (document) => {
    const newDoc = {
      id: Date.now(),
      ...document,
      uploadDate: new Date().toISOString().split('T')[0],
      rating: 0,
      ratingCount: 0,
      downloadCount: 0
    };
    documents.value.unshift(newDoc);
    return newDoc;
  };

  const updateDocumentRating = (documentId, rating) => {
    const doc = documents.value.find(d => d.id === documentId);
    if (doc) {
      const totalRating = doc.rating * doc.ratingCount;
      doc.ratingCount += 1;
      doc.rating = (totalRating + rating) / doc.ratingCount;
    }
  };

  const incrementDownloadCount = (documentId) => {
    const doc = documents.value.find(d => d.id === documentId);
    if (doc) {
      doc.downloadCount += 1;
    }
  };

  const setSearchQuery = (query) => {
    searchQuery.value = query;
  };

  const setSelectedTags = (tags) => {
    selectedTags.value = tags;
  };

  const setSortBy = (sort) => {
    sortBy.value = sort;
  };

  const setSortOrder = (order) => {
    sortOrder.value = order;
  };

  const setFileTypeFilter = (type) => {
    fileTypeFilter.value = type;
  };

  const generateAutoTags = (fileName) => {
    // Simulación de etiquetado automático basado en el nombre del archivo
    const tags = [];
    const fileNameLower = fileName.toLowerCase();
    
    // Etiquetas basadas en palabras clave del nombre
    const keywordMap = {
      'matematicas': ['matemáticas', 'cálculo'],
      'fisica': ['física', 'ciencia'],
      'historia': ['historia', 'sociales'],
      'arte': ['arte', 'cultura'],
      'programacion': ['programación', 'informática'],
      'quimica': ['química', 'ciencia'],
      'biologia': ['biología', 'ciencia'],
      'literatura': ['literatura', 'humanidades'],
      'economia': ['economía', 'sociales'],
      'filosofia': ['filosofía', 'humanidades']
    };

    Object.keys(keywordMap).forEach(keyword => {
      if (fileNameLower.includes(keyword)) {
        tags.push(...keywordMap[keyword]);
      }
    });

    // Etiquetas por tipo de archivo
    if (fileNameLower.includes('ejercicios') || fileNameLower.includes('practica')) {
      tags.push('ejercicios', 'práctica');
    }
    if (fileNameLower.includes('examen') || fileNameLower.includes('test')) {
      tags.push('examen', 'evaluación');
    }
    if (fileNameLower.includes('resumen') || fileNameLower.includes('summary')) {
      tags.push('resumen', 'síntesis');
    }

    return [...new Set(tags)]; // Eliminar duplicados
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
    addDocument,
    updateDocumentRating,
    incrementDownloadCount,
    setSearchQuery,
    setSelectedTags,
    setSortBy,
    setSortOrder,
    setFileTypeFilter,
    generateAutoTags
  };
});
