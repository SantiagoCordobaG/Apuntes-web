<template>
  <div class="perfil-container">
    <el-card class="perfil-card" shadow="hover">
      <div class="perfil-header">
        <el-avatar
          :size="100"
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
        />
        <div class="perfil-info">
          <h2>{{ user.nombre }}</h2>
          <p class="perfil-correo">{{ user.correo }}</p>
        </div>
      </div>

      <el-divider />

      <el-descriptions title="Detalles del Usuario" :column="1" border>
        <el-descriptions-item label="Rol">{{ user.rol }}</el-descriptions-item>
        <el-descriptions-item label="Carrera">{{ user.carrera }}</el-descriptions-item>
        <el-descriptions-item label="Universidad">{{ user.universidad }}</el-descriptions-item>
      </el-descriptions>

      <el-divider />

      <div class="perfil-actions">
        <el-button type="primary" @click="editarPerfil">Editar Perfil</el-button>
        <el-button type="success" @click="guardarCambios">Guardar Cambios</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  ElCard,
  ElButton,
  ElDivider,
  ElDescriptions,
  ElDescriptionsItem,
  ElAvatar,
  ElMessage,
} from "element-plus";

const user = ref({
  nombre: "Alexander Mayiman",
  correo: "alexander@example.com",
  rol: "Estudiante",
  carrera: "Ingeniería de Sistemas",
  universidad: "Universidad del Valle",
});

const editarPerfil = () => {
  ElMessage.info("Función de edición en desarrollo...");
};

const guardarCambios = () => {
  ElMessage.success("Cambios guardados correctamente ✅");
};
</script>

<style scoped>
.perfil-container {
  display: flex;
  justify-content: center;
  padding: 40px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 160px); /* Resta header y footer */
}

.perfil-card {
  width: 600px;
  padding: 30px;
}

.perfil-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.perfil-info h2 {
  margin: 0;
  font-weight: 600;
}

.perfil-correo {
  color: #606266;
  margin: 5px 0 0;
}

.perfil-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
