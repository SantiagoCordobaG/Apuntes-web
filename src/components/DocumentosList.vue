<template>
  <div class="documentos-container">
    <h1 class="titulo">📚 Documentos Disponibles</h1>

    <!-- Si aún no hay documentos -->
    <div v-if="documentos.length === 0" class="mensaje-vacio">
      <p>No hay documentos disponibles.</p>
    </div>

    <!-- Lista de documentos -->
    <div v-else class="cards-container">
      <div v-for="doc in documentos" :key="doc._id" class="card">
        <h2>{{ doc.title }}</h2>
        <p class="descripcion">{{ doc.description }}</p>
        <p><strong>Autor:</strong> {{ doc.author }}</p>
        <p><strong>Tipo:</strong> {{ doc.fileType.toUpperCase() }}</p>
        <p><strong>Fecha:</strong> {{ formatearFecha(doc.uploadDate) }}</p>
        <p><strong>Descargas:</strong> {{ doc.downloadCount }}</p>

        <button class="btn-descargar">
          📥 Descargar ({{ doc.fileSize }})
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DocumentosList",

  data() {
    return {
      documentos: []
    };
  },

  methods: {
    async cargarDocumentos() {
      try {
        const res = await fetch("http://localhost:3000/api/documentos");
        this.documentos = await res.json();
        console.log("✅ Documentos cargados:", this.documentos);
      } catch (err) {
        console.error("❌ Error al cargar documentos:", err);
      }
    },
    formatearFecha(fecha) {
      return new Date(fecha).toLocaleDateString("es-ES");
    }
  },

  mounted() {
    this.cargarDocumentos();
  }
};
</script>

<style scoped>
.documentos-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
}

.titulo {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.card {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1.2rem;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.descripcion {
  color: #555;
  font-size: 0.95rem;
}

.btn-descargar {
  margin-top: 0.8rem;
  background-color: #ff6f61;
  border: none;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-descargar:hover {
  background-color: #ff4d4d;
}

.mensaje-vacio {
  text-align: center;
  color: #888;
}
</style>
