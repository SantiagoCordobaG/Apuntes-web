
ERROR  Failed to compile with 1 error                                                               12:35:56 PM

[eslint]
C:\Users\Administrator\Documents\webanthonydev\Apuntes-web\src\views\PerfilView.vue
  148:10   error  'ElCard' is defined but never used              no-unused-vars
  148:28   error  'ElDivider' is defined but never used           no-unused-vars
  148:39   error  'ElDescriptions' is defined but never used      no-unused-vars
  148:55   error  'ElDescriptionsItem' is defined but never used  no-unused-vars
  148:96   error  'ElForm' is defined but never used              no-unused-vars
  148:104  error  'ElFormItem' is defined but never used          no-unused-vars

✖ 6 problems (6 errors, 0 warnings)


You may use special comments to disable some warnings.
Use // eslint-disable-next-line to ignore the next line.
Use /* eslint-disable */ to ignore all warnings in a file.
ERROR in [eslint]
C:\Users\Administrator\Documents\webanthonydev\Apuntes-web\src\views\PerfilView.vue
  148:10   error  'ElCard' is defined but never used              no-unused-vars
  148:28   error  'ElDivider' is defined but never used           no-unused-vars
  148:39   error  'ElDescriptions' is defined but never used      no-unused-vars
  148:55   error  'ElDescriptionsItem' is defined but never used  no-unused-vars
  148:96   error  'ElForm' is defined but never used              no-unused-vars
  148:104  error  'ElFormItem' is defined but never used          no-unused-vars

✖ 6 problems (6 errors, 0 warnings)


webpack compiled with 1 error<template>
  <div class="app-layout">
    <!-- Header -->
    <el-header class="app-header">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo-section">
          <el-icon class="logo-icon"><Document /></el-icon>
          <h1 class="app-title">Repositorio de Apuntes</h1>
        </div>

        <!-- Menú de navegación principal -->
        <el-menu
          :default-active="activeIndex"
          class="nav-menu"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="/?tab=documents">
            <el-icon><Document /></el-icon>
            <span>Documentos</span>
          </el-menu-item>
          <el-menu-item index="/?tab=upload">
            <el-icon><Upload /></el-icon>
            <span>Subir</span>
          </el-menu-item>
        </el-menu>

        <!-- Usuario -->
        <div class="user-section">
          <el-dropdown trigger="click" placement="bottom-end">
            <el-button type="text" class="user-button">
              <el-avatar :size="32" :src="authStore.usuario?.avatar" class="user-avatar">
                {{ authStore.usuario?.nombre?.charAt(0).toUpperCase() }}
              </el-avatar>
              <span class="user-name">{{ authStore.usuario?.nombre || 'Usuario' }}</span>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu class="user-dropdown-menu">
                <el-dropdown-item @click="goTo('/?tab=profile')" class="dropdown-item">
                  <el-icon class="dropdown-item-icon"><User /></el-icon>
                  <span>Mi Perfil</span>
                </el-dropdown-item>
                <el-dropdown-item @click="goTo('/?tab=mydocuments')" class="dropdown-item">
                  <el-icon class="dropdown-item-icon"><Document /></el-icon>
                  <span>Mis Documentos</span>
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout" class="dropdown-item logout-item">
                  <el-icon class="dropdown-item-icon"><Switch /></el-icon>
                  <span>Cerrar Sesión</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <!-- Contenido principal -->
    <el-main class="app-main">
      <router-view />
    </el-main>

    <!-- Footer -->
    <el-footer class="app-footer">
      <div class="footer-content">
        <p>&copy; 2025 Repositorio de Apuntes. Todos los derechos reservados.</p>
      </div>
    </el-footer>
  </div>
</template>

<!--
  ============================================
  LAYOUT: LayoutPrincipal
  ============================================
  
  DESCRIPCIÓN:
  Layout principal de la aplicación que contiene el header con navegación, el contenido
  principal (router-view) y el footer. Es el diseño base para todas las vistas protegidas.
  
  QUÉ HACE:
  - Muestra el header con logo, menú de navegación y menú de usuario
  - Renderiza el contenido principal (router-view) según la ruta activa
  - Muestra el footer con información de copyright
  - Permite navegar entre secciones (documentos, subir, perfil, mis documentos)
  - Permite cerrar sesión desde el menú de usuario
-->
<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/autenticacion';
import {
  Document,
  User,
  ArrowDown,
  Switch,
  Upload
} from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const activeIndex = computed(() => {
  const tab = route.query.tab || 'documents';
  // Si la pestaña es search, mostrar documents como activo
  const activeTab = tab === 'search' ? 'documents' : tab;
  return `/?tab=${activeTab}`;
});

const handleSelect = (key) => {
  router.push(key);
};

// Navegación a rutas del usuario
const goTo = (path) => {
  router.push(path);
};

// Cerrar sesión
const handleLogout = () => {
  ElMessageBox.confirm(
    '¿Estás seguro de que quieres cerrar sesión?',
    'Confirmar cierre de sesión',
    {
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      type: 'warning',
    }
  )
    .then(() => {
      authStore.logout();
      ElMessage.success('Sesión cerrada correctamente');
      router.push('/login');
    })
    .catch(() => {
      ElMessage.info('Cierre de sesión cancelado');
    });
};
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--app-bg);
  position: relative;
  overflow-x: hidden;
  animation: fadeInUpBase 0.6s ease-out;
}
.app-header {
  background: var(--surface);
  color: var(--text-primary);
  padding: 0;
  box-shadow: 0 1px 0 0 var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition-base);
  animation: slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInScale 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
  position: relative;
  padding: 4px;
  border-radius: 12px;
}

.logo-section::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.logo-section:hover::before {
  width: 100px;
  height: 100px;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.logo-section:hover {
  transform: scale(1.05);
}

.logo-section:active {
  transform: scale(0.98);
}

.logo-icon {
  font-size: 24px;
  color: #1a1a1a;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.logo-section:hover .logo-icon {
  transform: rotate(5deg) scale(1.1);
}

.app-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: var(--text-primary);
  font-family: var(--font-family-base);
  position: relative;
  z-index: 1;
  transition: var(--transition-base);
}

.logo-section:hover .app-title {
  transform: translateX(2px);
}

.nav-menu {
  background: transparent;
  border: none;
  flex: 1;
  justify-content: center;
}

.nav-menu :deep(.el-menu-item) {
  color: var(--text-muted);
  border-bottom: 2px solid transparent;
  font-weight: 500;
  font-size: 14px;
  padding: 0 20px;
  transition: var(--transition-base);
  margin: 0 4px;
  border-radius: 8px;
  position: relative;
  height: 72px;
  line-height: 72px;
  animation: fadeInUpBaseSm 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.nav-menu :deep(.el-menu-item:nth-child(1)) {
  animation-delay: 0.1s;
}

.nav-menu :deep(.el-menu-item:nth-child(2)) {
  animation-delay: 0.15s;
}

.nav-menu :deep(.el-menu-item:nth-child(3)) {
  animation-delay: 0.2s;
}

.nav-menu :deep(.el-menu-item::after) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 4px;
  height: 4px;
  background: var(--text-primary);
  border-radius: 50%;
  transition: var(--transition-base);
}
.nav-menu :deep(.el-menu-item::before) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 2px;
  background: var(--text-primary);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.nav-menu :deep(.el-menu-item:hover) {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-primary);
}
.nav-menu :deep(.el-menu-item:hover::after) {
  transform: translateX(-50%) scaleX(1);
}
.nav-menu :deep(.el-menu-item.is-active) {
  background: rgba(0, 0, 0, 0.06);
  color: var(--text-primary);
  font-weight: 600;
}

.nav-menu :deep(.el-menu-item.is-active::before) {
  transform: scaleX(1);
}

.nav-menu :deep(.el-menu-item.is-active::after) {
  transform: translateX(-50%) scaleX(1);
}

.user-section {
  display: flex;
  align-items: center;
}

.user-button {
  color: #1a1a1a;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  border: 1px solid transparent;
  font-weight: 500;
  animation: fadeInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
  position: relative;
  overflow: hidden;
}

.user-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.user-button:hover::before {
  width: 200px;
  height: 200px;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.user-button:hover {
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.user-button:active {
  transform: translateY(0) scale(0.98);
}

.dropdown-icon {
  font-size: 12px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 4px;
}

.user-button:hover .dropdown-icon {
  transform: translateY(2px);
}

.user-avatar {
  margin-right: 0;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-button:hover .user-avatar {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.user-name {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

.user-dropdown-menu {
  margin-top: 8px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  padding: 8px;
  min-width: 200px;
  animation: dropdownSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.user-dropdown-menu :deep(.el-dropdown-menu__item) {
  padding: 12px 16px;
  border-radius: 8px;
  margin: 2px 0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.user-dropdown-menu :deep(.el-dropdown-menu__item::before) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
}

.user-dropdown-menu :deep(.el-dropdown-menu__item:hover::before) {
  width: 200px;
  height: 200px;
}

.user-dropdown-menu :deep(.el-dropdown-menu__item:hover) {
  background: rgba(0, 0, 0, 0.04);
  color: #1a1a1a;
  transform: translateX(4px);
}

.user-dropdown-menu :deep(.el-dropdown-menu__item.is-divided) {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  margin-top: 8px;
  padding-top: 12px;
}

.dropdown-item-icon {
  font-size: 16px;
  color: #666666;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.user-dropdown-menu :deep(.el-dropdown-menu__item:hover .dropdown-item-icon) {
  color: #1a1a1a;
  transform: scale(1.1);
}

.user-dropdown-menu :deep(.el-dropdown-menu__item.logout-item:hover) {
  background: rgba(220, 38, 38, 0.08);
  color: #dc2626;
}

.user-dropdown-menu :deep(.el-dropdown-menu__item.logout-item:hover .dropdown-item-icon) {
  color: #dc2626;
}

.app-main {
  flex: 1;
  background: #fafafa;
  padding: 48px 40px;
  min-height: calc(100vh - 140px);
  position: relative;
  z-index: 1;
  animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-footer {
  background: #ffffff;
  color: #666666;
  padding: 32px 0;
  margin-top: auto;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 1;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-content p {
  margin: 0;
  color: #999999;
  font-size: 13px;
  font-weight: 400;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
    height: auto;
    min-height: 70px;
  }

  .app-title {
    font-size: 20px;
  }

  .nav-menu {
    width: 100%;
  }

  .nav-menu :deep(.el-menu-item) {
    padding: 0 12px;
    font-size: 14px;
  }

  .app-main {
    padding: 20px 16px;
  }

  .footer-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

}
</style>
