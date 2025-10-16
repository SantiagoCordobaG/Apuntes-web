<template>
  <div class="app-layout">
    <!-- Header -->
    <el-header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <el-icon class="logo-icon"><Document /></el-icon>
          <h1 class="app-title">Repositorio de Apuntes</h1>
        </div>
        
        <el-menu
          :default-active="activeIndex"
          class="nav-menu"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span>Inicio</span>
          </el-menu-item>
          <el-menu-item index="/upload">
            <el-icon><Upload /></el-icon>
            <span>Subir Documento</span>
          </el-menu-item>
          <el-menu-item index="/search">
            <el-icon><Search /></el-icon>
            <span>Búsqueda Avanzada</span>
          </el-menu-item>
        </el-menu>

        <div class="user-section">
          <el-dropdown>
            <el-button type="text" class="user-button">
              <el-icon><User /></el-icon>
              <span>Usuario</span>
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>Mi Perfil</el-dropdown-item>
                <el-dropdown-item>Mis Documentos</el-dropdown-item>
                <el-dropdown-item divided>Cerrar Sesión</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <!-- Main Content -->
    <el-main class="app-main">
      <router-view />
    </el-main>

    <!-- Footer -->
    <el-footer class="app-footer">
      <div class="footer-content">
        <p>&copy; 2024 Repositorio de Apuntes. Todos los derechos reservados.</p>
        <div class="footer-links">
          <el-link type="primary">Términos de Uso</el-link>
          <el-link type="primary">Política de Privacidad</el-link>
          <el-link type="primary">Contacto</el-link>
        </div>
      </div>
    </el-footer>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  Document, 
  House, 
  Upload, 
  Search, 
  User, 
  ArrowDown 
} from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();

const activeIndex = computed(() => route.path);

const handleSelect = (key) => {
  router.push(key);
};
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
}

.app-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.nav-menu {
  background: transparent;
  border: none;
  flex: 1;
  justify-content: center;
}

.nav-menu .el-menu-item {
  color: white;
  border-bottom: 2px solid transparent;
}

.nav-menu .el-menu-item:hover,
.nav-menu .el-menu-item.is-active {
  background: rgba(255, 255, 255, 0.1);
  border-bottom-color: white;
}

.user-section {
  display: flex;
  align-items: center;
}

.user-button {
  color: white;
  font-size: 14px;
}

.app-main {
  flex: 1;
  background-color: #f5f7fa;
  padding: 20px;
}

.app-footer {
  background-color: #2c3e50;
  color: white;
  padding: 20px 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links .el-link {
  color: #bdc3c7;
}

.footer-links .el-link:hover {
  color: white;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 10px;
    padding: 10px;
  }
  
  .nav-menu {
    width: 100%;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style>
