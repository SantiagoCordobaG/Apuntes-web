/**
 * ============================================
 * COMPONENTE RAÍZ DE LA APLICACIÓN
 * ============================================
 * 
 * Este es el componente PADRE de toda la aplicación.
 * Su única función es renderizar la vista actual según la ruta.
 * 
 * <router-view /> muestra:
 * - AuthView si la ruta es /login o /registro
 * - MainLayout (con HomeView dentro) si la ruta es /
 */

<template>
  <!-- router-view renderiza la vista correspondiente a la ruta actual -->
  <router-view />
</template>

<script>
export default {
  name: "App",
};
</script>
