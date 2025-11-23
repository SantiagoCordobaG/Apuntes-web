<template>
  <div class="home-view">
    <component :is="currentComponent" />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ListaDocumentos from '@/components/ListaDocumentos.vue';
import SeccionSubir from '@/components/SeccionSubir.vue';
import SeccionPerfil from '@/components/SeccionPerfil.vue';

const route = useRoute();
const router = useRouter();

watch(() => route.query.tab, (tab) => {
  if (tab === 'search') router.replace({ query: { tab: 'documents' } });
}, { immediate: true });

const currentComponent = computed(() => {
  const tab = route.query.tab || 'documents';
  const activeTab = tab === 'search' ? 'documents' : tab;
  const components = { documents: ListaDocumentos, upload: SeccionSubir, profile: SeccionPerfil };
  return components[activeTab] || ListaDocumentos;
});
</script>
