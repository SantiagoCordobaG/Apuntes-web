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
import { obtenerMiValoracion, valorarDocumento } from '@/services/documentService';

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
    const data = await obtenerMiValoracion(documentId);
    
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

    const data = await valorarDocumento(documentId, ratingValue, comment.value || '');

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
    // El mensaje de error ya se maneja en el interceptor de axios
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
  padding: 0;
}

.rating-dialog :deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
  animation: dialogSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.rating-dialog :deep(.el-dialog__header) {
  padding: 24px 24px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
}

.rating-dialog :deep(.el-dialog__title) {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
}

.rating-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.rating-dialog :deep(.el-dialog__footer) {
  padding: 16px 24px 24px;
  border-top: 2px solid #f1f5f9;
  background: #f8fafc;
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
  margin: 0 0 16px 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.3px;
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
  margin: 0 0 16px 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.current-rating {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #c7d2fe;
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
  margin-top: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 10px;
  text-align: center;
  border: 1px solid #93c5fd;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-footer :deep(.el-button) {
  border-radius: 10px;
  font-weight: 600;
  padding: 10px 24px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.dialog-footer :deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dialog-footer :deep(.el-button) {
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  padding: 10px 20px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  color: #1a1a1a;
  transition: all 0.2s ease;
}

.dialog-footer :deep(.el-button:hover) {
  background: #f5f5f5;
  border-color: #d5d5d5;
  transform: none;
  box-shadow: none;
}

.dialog-footer :deep(.el-button--primary) {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #ffffff;
}

.dialog-footer :deep(.el-button--primary:hover) {
  background: #333333;
  border-color: #333333;
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
