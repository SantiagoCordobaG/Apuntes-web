<!--
  ============================================
  VISTA: VistaInicio
  ============================================
  
  DESCRIPCIÓN:
  Es la vista principal de la aplicación. Muestra diferentes componentes según la pestaña
  seleccionada en la URL (ej: ?tab=documents, ?tab=upload, etc.).
  
  QUÉ HACE:
  - Renderiza dinámicamente diferentes componentes según el parámetro ?tab= en la URL
  - Permite navegar entre: documentos, subir, perfil y mis documentos
  - Maneja eventos cuando se sube un documento (redirige a "mis documentos")
-->
<template>
  <div class="home-view">
    <component :is="currentComponent" @document-uploaded="handleDocumentUploaded" />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ListaDocumentos from '@/components/ListaDocumentos.vue';
import SeccionSubir from '@/components/SeccionSubir.vue';
import SeccionPerfil from '@/components/SeccionPerfil.vue';
import SeccionMisDocumentos from '@/components/SeccionMisDocumentos.vue';

const route = useRoute();
const router = useRouter();

// Redirigir si alguien intenta acceder a search
watch(() => route.query.tab, (tab) => {
  if (tab === 'search') {
    router.replace({ query: { tab: 'documents' } });
  }
}, { immediate: true });

const currentComponent = computed(() => {
  const tab = route.query.tab || 'documents';
  
  // Si la pestaña es search, mostrar documents
  const activeTab = tab === 'search' ? 'documents' : tab;
  
  const components = {
    documents: ListaDocumentos,
    upload: SeccionSubir,
    profile: SeccionPerfil,
    mydocuments: SeccionMisDocumentos
  };
  return components[activeTab] || ListaDocumentos;
});

const handleDocumentUploaded = () => {
  router.replace({ query: { tab: 'mydocuments' } });
};
</script>

<style scoped>
.home-view {
  width: 100%;
  min-height: calc(100vh - 200px);
}
</style>

