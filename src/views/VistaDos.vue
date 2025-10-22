<template>
    <h1>Esta es mi vista Dos</h1>
    <HelloWorldVue :mensajes="mensajes" />
  </template>
  
  <script setup>
  import HelloWorldVue from "@/components/HelloWorld.vue";
  
  const mensajes = [
<<<<<<< HEAD
    "Hola, soy la vista Dos, y soy maya la  el mejor",
=======
    "Hola, soy la vista Dos, y soy maya y jhosep y amtoniiii",
>>>>>>> a3345e3a5a3134a02d2f1675d82a59872cdfdba8
    "Este es un Ejemplo de mensajes"
  ];
  </script>
