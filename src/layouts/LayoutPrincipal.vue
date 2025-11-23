<template>
  <div class="app-layout">
    <el-header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <el-icon class="logo-icon"><Document /></el-icon>
          <h1 class="app-title">Repositorio de Apuntes</h1>
        </div>
        <el-menu :default-active="activeIndex" class="nav-menu" mode="horizontal" @select="handleSelect">
          <el-menu-item index="/?tab=documents"><el-icon><Document /></el-icon><span>Documentos</span></el-menu-item>
          <el-menu-item index="/?tab=upload"><el-icon><Upload /></el-icon><span>Subir</span></el-menu-item>
        </el-menu>
        <div class="user-section">
          <el-dropdown trigger="click" placement="bottom-end">
            <el-button type="text" class="user-button">
              <el-avatar :size="32" :src="authStore.usuario?.avatar" class="user-avatar">{{ authStore.usuario?.nombre?.charAt(0).toUpperCase() }}</el-avatar>
              <span class="user-name">{{ authStore.usuario?.nombre || 'Usuario' }}</span>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu class="user-dropdown-menu">
                <el-dropdown-item @click="goTo('/?tab=profile')" class="dropdown-item">
                  <el-icon class="dropdown-item-icon"><User /></el-icon><span>Mi Perfil</span>
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout" class="dropdown-item logout-item">
                  <el-icon class="dropdown-item-icon"><Switch /></el-icon><span>Cerrar Sesión</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-main class="app-main"><router-view /></el-main>
    <el-footer class="app-footer">
      <div class="footer-content">
        <p>&copy; 2025 Repositorio de Apuntes. Todos los derechos reservados.</p>
      </div>
    </el-footer>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/autenticacion';
import { Document, User, ArrowDown, Switch, Upload } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const activeIndex = computed(() => {
  const tab = route.query.tab || 'documents';
  return `/?tab=${tab === 'search' ? 'documents' : tab}`;
});

const handleSelect = (key) => router.push(key);
const goTo = (path) => router.push(path);

const handleLogout = () => {
  ElMessageBox.confirm('¿Estás seguro de que quieres cerrar sesión?', 'Confirmar cierre de sesión', {
    confirmButtonText: 'Sí, salir',
    cancelButtonText: 'Cancelar',
    type: 'warning',
  })
    .then(() => {
      authStore.logout();
      ElMessage.success('Sesión cerrada correctamente');
      router.push('/login');
    })
    .catch(() => ElMessage.info('Cierre de sesión cancelado'));
};
</script>
