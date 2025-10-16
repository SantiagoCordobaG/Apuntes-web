import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { documentsService, utilsService } from '@/services/api';
import { ElMessage } from 'element-plus';

export const useDocumentsStore = defineStore('documents', () => {
  // Estado
  const documents = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

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
  const fetchDocuments = async (params = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const searchParams = {
        search: searchQuery.value || undefined,
        tags: selectedTags.value.length > 0 ? selectedTags.value.join(',') : undefined,
        fileType: fileTypeFilter.value !== 'all' ? fileTypeFilter.value : undefined,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...params
      };

      // Eliminar parámetros undefined
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] === undefined) {
          delete searchParams[key];
        }
      });

      const response = await documentsService.getDocuments(searchParams);
      
      documents.value = response.data;
      pagination.value = response.pagination;
      
      return response;
    } catch (err) {
      error.value = err.message;
      ElMessage.error(`Error cargando documentos: ${err.message}`);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addDocument = async (documentData, file) => {
    loading.value = true;
    error.value = null;
    
    try {
      const formData = utilsService.createFormData(documentData, file);
      const response = await documentsService.createDocument(formData);
      
      // Agregar el nuevo documento al inicio de la lista
      documents.value.unshift(response.data);
      
      ElMessage.success('Documento subido exitosamente');
      return response.data;
    } catch (err) {
      error.value = err.message;
      ElMessage.error(`Error subiendo documento: ${err.message}`);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateDocument = async (documentId, updateData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await documentsService.updateDocument(documentId, updateData);
      
      // Actualizar el documento en la lista local
      const index = documents.value.findIndex(doc => doc._id === documentId);
      if (index !== -1) {
        documents.value[index] = response.data;
      }
      
      ElMessage.success('Documento actualizado exitosamente');
      return response.data;
    } catch (err) {
      error.value = err.message;
      ElMessage.error(`Error actualizando documento: ${err.message}`);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteDocument = async (documentId) => {
    loading.value = true;
    error.value = null;
    
    try {
      await documentsService.deleteDocument(documentId);
      
      // Eliminar el documento de la lista local
      const index = documents.value.findIndex(doc => doc._id === documentId);
      if (index !== -1) {
        documents.value.splice(index, 1);
      }
      
      ElMessage.success('Documento eliminado exitosamente');
    } catch (err) {
      error.value = err.message;
      ElMessage.error(`Error eliminando documento: ${err.message}`);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateDocumentRating = async (documentId, rating) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await documentsService.rateDocument(documentId, rating);
      
      // Actualizar el documento en la lista local
      const doc = documents.value.find(d => d._id === documentId);
      if (doc) {
        doc.rating = response.data.rating;
        doc.ratingCount = response.data.ratingCount;
      }
      
      ElMessage.success('Valoración actualizada exitosamente');
      return response.data;
    } catch (err) {
      error.value = err.message;
      ElMessage.error(`Error actualizando valoración: ${err.message}`);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const downloadDocument = async (document) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await documentsService.downloadDocument(document._id);
      
      // Descargar el archivo
      utilsService.downloadFile(response, document.originalFileName || document.fileName);
      
      // Incrementar contador local
      const doc = documents.value.find(d => d._id === document._id);
      if (doc) {
        doc.downloadCount += 1;
      }
      
      ElMessage.success(`Descargando ${document.title}`);
    } catch (err) {
      error.value = err.message;
      ElMessage.error(`Error descargando documento: ${err.message}`);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const incrementDownloadCount = (documentId) => {
    const doc = documents.value.find(d => d._id === documentId);
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
    return utilsService.generateAutoTags(fileName);
  };

  return {
    // Estado
    documents,
    loading,
    error,
    pagination,
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
    fetchDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    updateDocumentRating,
    downloadDocument,
    incrementDownloadCount,
    setSearchQuery,
    setSelectedTags,
    setSortBy,
    setSortOrder,
    setFileTypeFilter,
    generateAutoTags
  };
});
