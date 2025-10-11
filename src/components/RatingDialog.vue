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
          <span>Por: {{ document?.author }}</span>
          <span>{{ formatDate(document?.uploadDate) }}</span>
        </div>
      </div>

      <el-divider />

      <div class="rating-section">
        <h4>Tu Valoración</h4>
        <div class="rating-input">
          <el-rate
            v-model="rating"
            :max="5"
            show-text
            :texts="['Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente']"
            text-color="#ff9900"
          />
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
          <span class="rating-count">({{ document.ratingCount }} valoraciones)</span>
        </div>
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
import { ref, computed, watch } from 'vue';
import { useDocumentsStore } from '@/stores/documents';
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

const documentsStore = useDocumentsStore();

// Estado reactivo
const rating = ref(0);
const comment = ref('');
const submitting = ref(false);

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
};

const submitRating = async () => {
  if (rating.value === 0) {
    ElMessage.warning('Por favor selecciona una valoración');
    return;
  }

  if (!props.document) {
    ElMessage.error('Error: Documento no encontrado');
    return;
  }

  try {
    submitting.value = true;

    // Simular envío de valoración
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Actualizar valoración en el store
    documentsStore.updateDocumentRating(props.document.id, rating.value);

    ElMessage.success('¡Gracias por tu valoración!');
    
    // Emitir evento de valoración completada
    emit('rated', {
      documentId: props.document.id,
      rating: rating.value,
      comment: comment.value
    });

    handleClose();
  } catch (error) {
    ElMessage.error('Error al enviar la valoración');
    console.error('Error:', error);
  } finally {
    submitting.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
};

// Watchers
watch(visible, (newValue) => {
  if (newValue) {
    resetForm();
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

.rating-input {
  display: flex;
  justify-content: center;
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
