<template>
  <div class="auth-view">
    <el-tabs v-model="activeTab" class="auth-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="Iniciar Sesión" name="login"><SeccionLogin @switch-tab="handleSwitchTab" /></el-tab-pane>
      <el-tab-pane label="Registrarse" name="register"><SeccionRegistro @switch-tab="handleSwitchTab" /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SeccionLogin from '@/components/SeccionLogin.vue';
import SeccionRegistro from '@/components/SeccionRegistro.vue';

const route = useRoute();
const router = useRouter();
const activeTab = ref('login');

onMounted(() => {
  const tab = route.query.tab || 'login';
  if (['login', 'register'].includes(tab)) activeTab.value = tab;
});

const handleTabChange = (tabName) => router.replace({ query: { tab: tabName } });
const handleSwitchTab = (tabName) => { activeTab.value = tabName; router.replace({ query: { tab: tabName } }); };
</script>
