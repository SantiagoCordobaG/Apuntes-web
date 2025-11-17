<!--
  ============================================
  VISTA: VistaAutenticacion
  ============================================
  
  DESCRIPCIÓN:
  Vista que muestra el formulario de inicio de sesión y registro de usuarios.
  Tiene pestañas para alternar entre login y registro.
  
  QUÉ HACE:
  - Muestra el formulario de inicio de sesión (SeccionLogin)
  - Muestra el formulario de registro (SeccionRegistro)
  - Permite alternar entre ambos usando pestañas
  - Sincroniza la pestaña activa con el parámetro ?tab= en la URL
-->
<template>
  <div class="auth-view">
    <el-tabs v-model="activeTab" class="auth-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="Iniciar Sesión" name="login">
        <SeccionLogin @switch-tab="handleSwitchTab" />
      </el-tab-pane>
      <el-tab-pane label="Registrarse" name="register">
        <SeccionRegistro @switch-tab="handleSwitchTab" />
      </el-tab-pane>
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
  if (['login', 'register'].includes(tab)) {
    activeTab.value = tab;
  }
});

const handleTabChange = (tabName) => {
  router.replace({ query: { tab: tabName } });
};

const handleSwitchTab = (tabName) => {
  activeTab.value = tabName;
  router.replace({ query: { tab: tabName } });
};
</script>

<style scoped>
.auth-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.auth-tabs {
  width: 100%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: saturate(180%) blur(20px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.auth-tabs :deep(.el-tabs__header) {
  margin-bottom: 32px;
}

.auth-tabs :deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
  padding: 0 24px;
}

.auth-tabs :deep(.el-tabs__item.is-active) {
  color: #1a1a1a;
  font-weight: 600;
}
</style>

