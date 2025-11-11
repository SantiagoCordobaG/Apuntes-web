<template>
  <div class="home-view">
    <component :is="currentComponent" @document-uploaded="handleDocumentUploaded" />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DocumentosList from '@/components/DocumentosList.vue';
import UploadSection from '@/components/UploadSection.vue';
import ProfileSection from '@/components/ProfileSection.vue';
import MyDocumentsSection from '@/components/MyDocumentsSection.vue';
import ContactSection from '@/components/ContactSection.vue';
import TermsSection from '@/components/TermsSection.vue';
import PrivacySection from '@/components/PrivacySection.vue';

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
    documents: DocumentosList,
    upload: UploadSection,
    profile: ProfileSection,
    mydocuments: MyDocumentsSection,
    contact: ContactSection,
    terms: TermsSection,
    privacy: PrivacySection
  };
  return components[activeTab] || DocumentosList;
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

