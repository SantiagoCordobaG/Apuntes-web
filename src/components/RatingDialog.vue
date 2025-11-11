<template>
  <el-dialog
    v-model="visible"
    title="Valorar Documento"
    width="500px"
    :before-close="handleClose"
  >
    <div class="rating-dialog">
      <div class="document-info">
        <h3>{{ document?.title }}</h3>
        <p>{{ document?.description }}</p>
        <div class="document-meta">
          <span>Por: {{ document?.author || document?.usuario || 'Anónimo' }}</span>
          <span>{{ formatDate(document?.uploadDate) }}</span>
        </div>
      </div>

      <el-divider />

      <div class="rating-section">
        <h4>Tu Valoración</h4>
        <div class="rating-buttons">
          <button
            v-for="star in 5"
            :key="star"
            @click="rating = star"
            :class="['star-button', { active: rating >= star, selected: rating === star }]"
            type="button"
          >
            <span class="star-icon">⭐</span>
            <span class="star-label">{{ getStarLabel(star) }}</span>
          </button>
        </div>
        <div v-if="rating > 0" class="selected-rating">
          <p>Has seleccionado: <strong>{{ getStarLabel(rating) }}</strong> ({{ rating }} {{ rating === 1 ? 'estrella' : 'estrellas' }})</p>
        </div>
      </div>

      <div class="comment-section">
        <h4>Comentario (Opcional)</h4>
        <el-input
          v-model="comment"
          type="textarea"
          :rows="4"
          placeholder="Comparte tu opinión sobre este documento..."
          maxlength="500"
          show-word-limit
        />
      </div>

      <div class="current-rating" v-if="document?.rating > 0">
        <h4>Valoración Actual</h4>
        <div class="rating-display">
          <el-rate
            :model-value="document.rating"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value} de 5"
          />
          <span class="rating-count">({{ document.ratingCount || 0 }} valoraciones)</span>
        </div>
      </div>
      
      <div class="user-rating-info" v-if="userRating">
        <el-text type="info" size="small">
          Ya valoraste este documento con {{ userRating.rating }} estrellas
        </el-text>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancelar</el-button>
        <el-button type="primary" @click="submitRating" :loading="submitting">
          <el-icon><Star /></el-icon>
          Enviar Valoración
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';
import { Star } from '@element-plus/icons-vue';

// eslint-disable-next-line no-undef
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  document: {
    type: Object,
    default: null
  }
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['update:modelValue', 'rated']);

const authStore = useAuthStore();

// Estado reactivo
const rating = ref(0);
const comment = ref('');
const submitting = ref(false);
const userRating = ref(null);

// Computed
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Métodos
const handleClose = () => {
  visible.value = false;
  resetForm();
};

const resetForm = () => {
  rating.value = 0;
  comment.value = '';
  submitting.value = false;
  userRating.value = null;
};

// Cargar valoración del usuario si existe
const cargarValoracionUsuario = async () => {
  if (!props.document || !authStore.token) {
    // Resetear si no hay documento o token
    resetForm();
    userRating.value = null;
    return;
  }

  // Obtener el ID del documento (puede ser _id o id)
  const documentId = props.document._id || props.document.id;
  if (!documentId) {
    console.error('Documento sin ID:', props.document);
    resetForm();
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/Documentos/${documentId}/my-rating`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.hasRated) {
        userRating.value = data;
        rating.value = data.rating;
        comment.value = data.comentario || '';
      } else {
        // Si no hay valoración previa, resetear
        userRating.value = null;
        rating.value = 0;
        comment.value = '';
      }
    } else if (response.status === 401) {
      // Token inválido o expirado
      ElMessage.warning('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
      resetForm();
    }
  } catch (error) {
    console.error('Error al cargar valoración:', error);
    resetForm();
  }
};

const submitRating = async () => {
  // Convertir a número para asegurar que sea un número válido
  const ratingValue = Number(rating.value);
  
  // Validar que el rating esté entre 1 y 5
  if (!ratingValue || ratingValue < 1 || ratingValue > 5 || isNaN(ratingValue)) {
    ElMessage.warning('Por favor selecciona una valoración entre 1 y 5 estrellas');
    return;
  }

  if (!props.document) {
    ElMessage.error('Error: Documento no encontrado');
    return;
  }

  // Obtener el ID del documento (puede ser _id o id)
  const documentId = props.document._id || props.document.id;
  if (!documentId) {
    ElMessage.error('Error: El documento no tiene un ID válido');
    return;
  }

  if (!authStore.token) {
    ElMessage.warning('Debes iniciar sesión para valorar documentos');
    return;
  }

  try {
    submitting.value = true;

    const response = await fetch(`http://localhost:3000/api/Documentos/${documentId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        rating: ratingValue,  // Usar el valor convertido a número
        comentario: comment.value || ''
      })
    });

    if (!response.ok) {
      let errorMessage = 'Error al enviar la valoración';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // Si no se puede parsear el error
        if (response.status === 401) {
          errorMessage = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
        } else if (response.status === 404) {
          errorMessage = 'Documento no encontrado';
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    ElMessage.success('¡Gracias por tu valoración!');
    
    // Actualizar la valoración del usuario localmente
    userRating.value = {
      hasRated: true,
      rating: ratingValue,
      comentario: comment.value
    };
    
    // Emitir evento de valoración completada con los datos actualizados
    emit('rated', {
      documentId: documentId,
      rating: ratingValue,
      comment: comment.value,
      documento: data.documento
    });

    // Cerrar el diálogo después de un breve delay para que el usuario vea el mensaje
    setTimeout(() => {
      handleClose();
    }, 1000);
  } catch (error) {
    console.error('Error:', error);
    ElMessage.error(error.message || 'Error al enviar la valoración');
  } finally {
    submitting.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
};

const getStarLabel = (value) => {
  const labels = {
    1: 'Muy malo',
    2: 'Malo',
    3: 'Regular',
    4: 'Bueno',
    5: 'Excelente'
  };
  return labels[value] || '';
};

// Watchers
watch(visible, (newValue) => {
  if (newValue) {
    // Cuando se abre el diálogo, cargar la valoración del usuario
    if (props.document) {
      cargarValoracionUsuario();
    } else {
      resetForm();
    }
  } else {
    // Cuando se cierra, resetear todo
    resetForm();
  }
});

// Watch del documento para recargar cuando cambia
watch(() => props.document, (newDoc) => {
  if (newDoc && visible.value) {
    cargarValoracionUsuario();
  }
}, { deep: true });

// Cargar valoración cuando se monta el componente
onMounted(() => {
  if (props.modelValue && props.document) {
    cargarValoracionUsuario();
  }
});
</script>

<style scoped>
.rating-dialog {
  padding: 10px 0;
}

.document-info {
  text-align: center;
  margin-bottom: 20px;
}

.document-info h3 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 18px;
}

.document-info p {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.4;
}

.document-meta {
  display: flex;
  justify-content: center;
  gap: 15px;
  font-size: 12px;
  color: #909399;
}

.rating-section {
  margin-bottom: 25px;
}

.rating-section h4 {
  margin: 0 0 15px 0;
  color: #303133;
  font-size: 16px;
}

.rating-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.star-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border: 2px solid #dcdfe6;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
}

.star-button:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
  transform: translateX(5px);
}

.star-button.active {
  border-color: #ff9900;
  background-color: #fff7e6;
}

.star-button.selected {
  border-color: #ff9900;
  background-color: #fff7e6;
  box-shadow: 0 2px 8px rgba(255, 153, 0, 0.3);
  font-weight: 600;
}

.star-icon {
  font-size: 24px;
  line-height: 1;
}

.star-label {
  font-size: 16px;
  color: #303133;
}

.star-button.selected .star-label {
  color: #ff9900;
}

.selected-rating {
  margin-top: 15px;
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 6px;
  text-align: center;
}

.selected-rating p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.selected-rating strong {
  color: #ff9900;
}

.comment-section {
  margin-bottom: 25px;
}

.comment-section h4 {
  margin: 0 0 15px 0;
  color: #303133;
  font-size: 16px;
}

.current-rating {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.current-rating h4 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 14px;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-count {
  font-size: 12px;
  color: #909399;
}

.user-rating-info {
  margin-top: 15px;
  padding: 10px;
  background-color: #f0f9ff;
  border-radius: 6px;
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 768px) {
  .rating-dialog {
    padding: 5px 0;
  }
  
  .document-meta {
    flex-direction: column;
    gap: 5px;
  }
  
  .rating-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>
