/**
 * ============================================
 * PUNTO DE ENTRADA DE LA APLICACIÓN
 * ============================================
 * 
 * Este archivo es el PRIMERO que se ejecuta cuando la app se carga.
 * Su función es inicializar Vue y todos sus plugins.
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';

// 1. Crear la aplicación Vue
const app = createApp(App);

// 2. Crear y configurar Pinia (gestión de estado global)
const pinia = createPinia();
app.use(pinia);

// 3. Configurar Router (navegación)
app.use(router);

// 4. Configurar Element Plus (componentes UI)
app.use(ElementPlus);

// 5. Verificar si hay un usuario autenticado antes de montar la app
// Esto evita que se muestre contenido antes de verificar el token
const authStore = useAuthStore();
authStore.initAuth().then(() => {
  // 6. Montar la aplicación en el DOM (div#app en index.html)
  app.mount('#app');
});
