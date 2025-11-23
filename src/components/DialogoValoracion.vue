<template>
  <el-dialog v-model="visible" title="Valorar Documento" width="500px" :before-close="handleClose">
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
          <button v-for="star in 5" :key="star" @click="rating = star" :class="['star-button', { active: rating >= star, selected: rating === star }]" type="button">
            <span class="star-icon">⭐</span>
            <span class="star-label">{{ getStarLabel(star) }}</span>
          </button>
        </div>
        <div v-if="rating > 0" class="selected-rating">
          <p>Has seleccionado: <strong>{{ getStarLabel(rating) }}</strong> ({{ rating }} {{ rating === 1 ? 'estrella' : 'estrellas' }})</p>
        </div>
      </div>
      <div class="current-rating" v-if="document?.rating > 0">
        <h4>Valoración Actual</h4>
        <div class="rating-display">
          <el-rate :model-value="document.rating" disabled show-score text-color="#ff9900" score-template="{value} de 5" />
          <span class="rating-count">({{ document.ratingCount || 0 }} valoraciones)</span>
        </div>
      </div>
      <div class="user-rating-info" v-if="userRating">
        <el-text type="info" size="small">Ya valoraste este documento con {{ userRating.rating }} estrellas</el-text>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancelar</el-button>
        <el-button type="primary" @click="submitRating" :loading="submitting"><el-icon><Star /></el-icon> Enviar Valoración</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '@/stores/autenticacion';
import { ElMessage } from 'element-plus';
import { Star } from '@element-plus/icons-vue';
import { obtenerMiValoracion, valorarDocumento } from '@/services/servicioDocumentos';

// eslint-disable-next-line no-undef
const props = defineProps({ modelValue: { type: Boolean, default: false }, document: { type: Object, default: null } });
// eslint-disable-next-line no-undef
const emit = defineEmits(['update:modelValue', 'rated']);

const authStore = useAuthStore();
const rating = ref(0);
const submitting = ref(false);
const userRating = ref(null);

const visible = computed({ get: () => props.modelValue, set: (value) => emit('update:modelValue', value) });

const handleClose = () => { visible.value = false; resetForm(); };
const resetForm = () => { rating.value = 0; submitting.value = false; userRating.value = null; };

const cargarValoracionUsuario = async () => {
  if (!props.document || !authStore.token) { resetForm(); userRating.value = null; return; }
  const documentId = props.document._id || props.document.id;
  if (!documentId) { console.error('Documento sin ID:', props.document); resetForm(); return; }
  try {
    const data = await obtenerMiValoracion(documentId);
    if (data.hasRated) {
      userRating.value = data;
      rating.value = data.rating;
    } else {
      userRating.value = null;
      rating.value = 0;
    }
  } catch (error) {
    console.error('Error al cargar valoración:', error);
    resetForm();
  }
};

const submitRating = async () => {
  const ratingValue = Number(rating.value);
  if (!ratingValue || ratingValue < 1 || ratingValue > 5 || isNaN(ratingValue)) {
    ElMessage.warning('Por favor selecciona una valoración entre 1 y 5 estrellas');
    return;
  }
  if (!props.document) { ElMessage.error('Error: Documento no encontrado'); return; }
  const documentId = props.document._id || props.document.id;
  if (!documentId) { ElMessage.error('Error: El documento no tiene un ID válido'); return; }
  if (!authStore.token) { ElMessage.warning('Debes iniciar sesión para valorar documentos'); return; }
  try {
    submitting.value = true;
    const data = await valorarDocumento(documentId, ratingValue, '');
    ElMessage.success('¡Gracias por tu valoración!');
    userRating.value = { hasRated: true, rating: ratingValue };
    emit('rated', { documentId: documentId, rating: ratingValue, documento: data.documento });
    setTimeout(() => handleClose(), 1000);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    submitting.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-ES');
};

const getStarLabel = (value) => {
  const labels = { 1: 'Muy malo', 2: 'Malo', 3: 'Regular', 4: 'Bueno', 5: 'Excelente' };
  return labels[value] || '';
};

watch(visible, (newValue) => {
  if (newValue) {
    if (props.document) cargarValoracionUsuario();
    else resetForm();
  } else resetForm();
});

watch(() => props.document, (newDoc) => {
  if (newDoc && visible.value) cargarValoracionUsuario();
}, { deep: true });

onMounted(() => {
  if (props.modelValue && props.document) cargarValoracionUsuario();
});
</script>
