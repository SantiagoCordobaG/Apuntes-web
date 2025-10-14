<template>
<router-view />
</template>

<script>
export default {
  name: "App",
  mounted() {
    // Aquí probamos la conexión con el backend
    fetch('/api')
      .then(res => res.text())
      .then(data => console.log('✅ Respuesta del backend:', data))
      .catch(err => console.error('❌ Error:', err));
  }
};
</script>
<style>

</style>
    