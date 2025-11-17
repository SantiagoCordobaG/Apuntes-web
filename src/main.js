/**
 * ============================================
 * PUNTO DE ENTRADA DE LA APLICACIÓN
 * ============================================
 * 
 * DESCRIPCIÓN:
 * Este archivo es el PRIMERO que se ejecuta cuando la aplicación se carga en el navegador.
 * Es el punto de entrada principal que inicializa Vue y todos sus plugins.
 * 
 * QUÉ HACE:
 * - Crea la aplicación Vue
 * - Configura Pinia (gestión de estado global)
 * - Configura Vue Router (navegación entre vistas)
 * - Configura Element Plus (componentes UI)
 * - Verifica autenticación antes de montar la app
 * - Monta la aplicación en el DOM (div#app en index.html)
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './assets/styles/global.css';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/autenticacion';

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
