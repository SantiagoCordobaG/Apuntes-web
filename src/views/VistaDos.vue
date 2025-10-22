<template>
    <h1>Esta es mi vista Dos</h1>
    <HelloWorldVue :mensajes="mensajes" />
  </template>
  
  <script setup>
  import HelloWorldVue from "@/components/HelloWorld.vue";
  
  const mensajes = [
    "Hola, soy la vista Dos, y soy maya y jhosep y anthony",
    "Este es un Ejemplo de mensajes"
  ];
  </script>
  