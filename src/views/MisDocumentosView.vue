<template>
  <div class="p-8">
    <h2 class="text-2xl font-bold mb-6 text-purple-700">Mis Documentos</h2>

    <div v-if="documentos.length > 0" class="grid md:grid-cols-2 gap-6">
      <div
        v-for="doc in documentos"
        :key="doc.id"
        class="border border-gray-200 shadow-sm p-4 rounded-xl bg-white"
      >
        <h3 class="font-semibold text-lg mb-1">{{ doc.titulo }}</h3>
        <p class="text-gray-600 text-sm mb-2">Subido el {{ doc.fecha }}</p>
        <p class="text-sm mb-3">{{ doc.descripcion }}</p>
        <button
          class="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
        >
          Descargar
        </button>
      </div>
    </div>

    <div v-else class="text-gray-600 italic">
      Aún no has subido documentos.
    </div>
  </div>
</template>

<script>
export default {
  name: "MisDocumentosView",
  data() {
    return {
      documentos: [
        {
          id: 1,
          titulo: "Historia del Arte Moderno",
          fecha: "13/01/2024",
          descripcion: "Resumen de los movimientos artísticos del siglo XX.",
        },
        {
          id: 2,
          titulo: "Física Cuántica Básica",
          fecha: "12/01/2024",
          descripcion: "Introducción a la mecánica cuántica.",
        },
      ],
    };
  },
};
</script>
