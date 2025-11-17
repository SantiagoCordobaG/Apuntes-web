<!--
  ============================================
  COMPONENTE: App (Componente Raíz)
  ============================================
  
  DESCRIPCIÓN:
  Este es el componente PADRE de toda la aplicación Vue. Es el punto de entrada
  principal que envuelve toda la aplicación.
  
  QUÉ HACE:
  - Renderiza la vista actual según la ruta activa usando <router-view />
  - No tiene lógica compleja, solo delega el renderizado al router
  - <router-view /> muestra:
    - VistaAutenticacion si la ruta es /login o /registro
    - LayoutPrincipal (con VistaInicio dentro) si la ruta es /
-->

<template>
  <!-- router-view renderiza la vista correspondiente a la ruta actual -->
  <router-view />
</template>

<script>
export default {
  name: "App",
};
</script>
