<template>
  <div class="upload-view">
    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <h2>Subir Nuevo Documento</h2>
          <el-button @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            Volver
          </el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="upload-form"
      >
        <!-- Zona de subida de archivos -->
        <el-form-item label="Archivo" required>
          <el-upload
            ref="uploadRef"
            class="upload-dragger"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
            :before-upload="beforeUpload"
            :file-list="fileList"
            accept=".pdf,.doc,.docx"
            :limit="1"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              Arrastra el archivo aquí o <em>haz clic para seleccionar</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                Solo archivos PDF, DOC, DOCX. Tamaño máximo: 10MB
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <!-- Información del documento -->
        <el-form-item label="Título" prop="title">
          <el-input
            v-model="form.title"
            placeholder="Ingresa el título del documento"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="Descripción" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="Describe el contenido del documento"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="Usuario" prop="usuario">
          <el-input
            v-model="form.usuario"
            placeholder="Usuario que sube el documento"
            maxlength="50"
            :disabled="true"
          />
          <div class="usuario-help">
            <el-text type="info" size="small">
              Se usa automáticamente tu nombre de usuario
            </el-text>
          </div>
        </el-form-item>

        <el-form-item label="Autor del Documento" prop="author">
          <el-input
            v-model="form.author"
            placeholder="Nombre del autor del libro/documento (opcional)"
            maxlength="50"
          />
          <div class="author-help">
            <el-text type="info" size="small">
              Autor del documento/libro. Si lo dejas vacío, se guardará como "Anónimo"
            </el-text>
          </div>
        </el-form-item>

        <!-- Etiquetas -->
        <el-form-item label="Etiquetas">
          <div class="tags-section">
            <el-tag
              v-for="tag in form.tags"
              :key="tag"
              closable
              @close="removeTag(tag)"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="inputRef"
              v-model="inputValue"
              class="tag-input"
              size="small"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput"
            >
              + Nueva etiqueta
            </el-button>
          </div>
          <div class="tags-help">
            <el-text type="info" size="small">
              Las etiquetas ayudan a otros usuarios a encontrar tu documento
            </el-text>
          </div>
        </el-form-item>

        <!-- Etiquetado automático -->
        <el-form-item label="Etiquetado Automático">
          <el-switch
            v-model="form.autoTagging"
            active-text="Activar"
            inactive-text="Desactivar"
          />
          <div class="auto-tagging-help">
            <el-text type="info" size="small">
              El sistema generará etiquetas automáticamente basándose en el nombre del archivo
            </el-text>
          </div>
        </el-form-item>

        <!-- Privacidad -->
        <el-form-item label="Visibilidad">
          <el-radio-group v-model="form.visibility">
            <el-radio value="public">Público</el-radio>
            <el-radio value="private">Privado</el-radio>
          </el-radio-group>
          <div class="visibility-help">
            <el-text type="info" size="small">
              Los documentos privados solo serán visibles para ti
            </el-text>
          </div>
        </el-form-item>

        <!-- Botones de acción -->
        <el-form-item>
          <div class="form-actions">
            <el-button @click="resetForm">Limpiar</el-button>
            <el-button type="primary" @click="submitForm" :loading="uploading">
              <el-icon><Upload /></el-icon>
              Subir Documento
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Vista previa del documento -->
    <el-card v-if="form.file" class="preview-card">
      <template #header>
        <h3>Vista Previa</h3>
      </template>
      
      <div class="preview-content">
        <div class="file-info">
          <el-icon class="file-icon">
            <Document v-if="form.fileType === 'pdf'" />
            <Document v-else />
          </el-icon>
          <div class="file-details">
            <h4>{{ form.file.name }}</h4>
            <p>Tipo: {{ form.fileType.toUpperCase() }}</p>
            <p>Tamaño: {{ formatFileSize(form.file.size) }}</p>
          </div>
        </div>
        
        <div class="auto-tags" v-if="form.autoTagging && autoGeneratedTags.length > 0">
          <h5>Etiquetas generadas automáticamente:</h5>
          <el-tag
            v-for="tag in autoGeneratedTags"
            :key="tag"
            size="small"
            type="info"
            class="auto-tag"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDocumentsStore } from '@/stores/documents';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';
import {
  Upload,
  UploadFilled,
  ArrowLeft,
  Document
} from '@element-plus/icons-vue';

const router = useRouter();
const documentsStore = useDocumentsStore();
const authStore = useAuthStore();

// Referencias
const formRef = ref();
const uploadRef = ref();
const inputRef = ref();

// Estado del formulario
const form = reactive({
  title: '',
  description: '',
  usuario: '',  // Usuario que sube el documento (obligatorio)
  author: '',   // Autor del documento/libro (opcional)
  tags: [],
  autoTagging: true,
  visibility: 'public',
  file: null,
  fileType: ''
});

// Estado de la interfaz
const fileList = ref([]);
const uploading = ref(false);
const inputVisible = ref(false);
const inputValue = ref('');

// Etiquetas generadas automáticamente
const autoGeneratedTags = ref([]);

// Inicializar el formulario
onMounted(() => {
  // Auto-completar el campo usuario con el nombre del usuario autenticado
  if (authStore.usuario && authStore.usuario.nombre) {
    form.usuario = authStore.usuario.nombre;
  }
});

// Reglas de validación
const rules = {
  title: [
    { required: true, message: 'El título es obligatorio', trigger: 'blur' },
    { min: 3, max: 100, message: 'El título debe tener entre 3 y 100 caracteres', trigger: 'blur' }
  ],
  description: [
    { required: true, message: 'La descripción es obligatoria', trigger: 'blur' },
    { min: 10, max: 500, message: 'La descripción debe tener entre 10 y 500 caracteres', trigger: 'blur' }
  ],
  usuario: [
    { required: true, message: 'El usuario es obligatorio', trigger: 'blur' },
    { min: 2, max: 50, message: 'El usuario debe tener entre 2 y 50 caracteres', trigger: 'blur' }
  ],
  author: [
    { max: 50, message: 'El autor no puede tener más de 50 caracteres', trigger: 'blur' }
  ]
};

// Métodos
const goBack = () => {
  router.push('/');
};

const handleFileChange = (file, fileList) => {
  // Asegurar que tenemos el archivo raw
  const rawFile = file.raw || file;
  if (!rawFile) {
    ElMessage.error('Error al procesar el archivo');
    return;
  }
  
  // Si el archivo no está en la lista (fue rechazado), no procesarlo
  if (file.status === 'fail' || fileList.length === 0) {
    form.file = null;
    form.fileType = '';
    autoGeneratedTags.value = [];
    return;
  }
  
  // Actualizar el fileList
  form.file = rawFile;
  form.fileType = getFileType(file.name);
  
  // Generar etiquetas automáticas si está activado
  if (form.autoTagging) {
    autoGeneratedTags.value = documentsStore.generateAutoTags(file.name);
    // Agregar etiquetas automáticas si no existen
    autoGeneratedTags.value.forEach(tag => {
      if (!form.tags.includes(tag)) {
        form.tags.push(tag);
      }
    });
  }
};

const validateFile = (file) => {
  // Validar por extensión (más confiable que tipo MIME)
  const extension = file.name.split('.').pop().toLowerCase();
  const validExtensions = ['pdf', 'doc', 'docx'];
  const isValidExtension = validExtensions.includes(extension);
  
  // Validar por tipo MIME (cuando esté disponible)
  const validMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  // Si tiene tipo MIME, debe ser válido. Si no tiene tipo MIME, confiar en la extensión.
  const hasMimeType = file.type && file.type !== '';
  const isValidMimeType = !hasMimeType || validMimeTypes.includes(file.type);
  
  // El archivo es válido si tiene una extensión válida Y (no tiene tipo MIME o el tipo MIME es válido)
  const isValidType = isValidExtension && isValidMimeType;
  
  // Validar tamaño (10MB)
  const isLt10M = file.size / 1024 / 1024 < 10;

  if (!isValidType) {
    ElMessage.error('Solo se permiten archivos PDF, DOC y DOCX!');
    return false;
  }
  if (!isLt10M) {
    ElMessage.error('El archivo debe ser menor a 10MB!');
    return false;
  }
  return true;
};

const beforeUpload = (file) => {
  return validateFile(file);
};

const getFileType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  if (extension === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(extension)) return 'docx';
  return 'unknown';
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const removeTag = (tag) => {
  const index = form.tags.indexOf(tag);
  if (index > -1) {
    form.tags.splice(index, 1);
  }
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value && !form.tags.includes(inputValue.value)) {
    form.tags.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = '';
};

const resetForm = () => {
  formRef.value?.resetFields();
  form.title = '';
  form.description = '';
  form.usuario = authStore.usuario?.nombre || '';
  form.author = '';
  form.tags = [];
  form.autoTagging = true;
  form.visibility = 'public';
  form.file = null;
  form.fileType = '';
  fileList.value = [];
  autoGeneratedTags.value = [];
  uploadRef.value?.clearFiles();
};

const submitForm = async () => {
  if (!form.file) {
    ElMessage.error('Por favor selecciona un archivo');
    return;
  }

  // Validar el formulario
  try {
    await formRef.value?.validate();
  } catch (validationError) {
    ElMessage.error('Por favor completa todos los campos requeridos');
    return;
  }

  uploading.value = true;
  
  try {
    // Crear FormData para enviar archivo + datos
    const formData = new FormData();
    formData.append('file', form.file);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('usuario', form.usuario);  // Usuario que sube (obligatorio)
    formData.append('author', form.author);     // Autor del documento (opcional)
    formData.append('tags', JSON.stringify(form.tags));
    formData.append('visibility', form.visibility);
    
    // Obtener el token de autenticación
    const token = authStore.token;
    if (!token) {
      ElMessage.error('Debes iniciar sesión para subir documentos');
      router.push('/login');
      return;
    }

    // Usar URL directa al backend (mismo patrón que otros componentes)
    const res = await fetch('http://localhost:3000/api/Documentos/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData  // NO pongas Content-Type, se pone automáticamente
    });

    if (!res.ok) {
      let errorMessage = 'Error al subir el documento';
      let errorDetails = '';
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        errorDetails = JSON.stringify(errorData);
      } catch (e) {
        // Si no se puede parsear el error, usar el status text
        const text = await res.text();
        errorMessage = `Error ${res.status}: ${res.statusText}`;
        errorDetails = text || 'No se pudo obtener detalles del error';
      }
      console.error('Error del servidor:', {
        status: res.status,
        statusText: res.statusText,
        details: errorDetails,
        url: res.url
      });
      throw new Error(errorMessage);
    }
    
    const data = await res.json();
    console.log('✅ Documento subido:', data);
    
    // Agregar el documento al store local si es necesario
    if (data.document) {
      documentsStore.addDocument({
        title: form.title,
        description: form.description,
        author: form.author,
        fileName: form.file.name,
        fileType: form.fileType,
        tags: form.tags,
        fileSize: formatFileSize(form.file.size)
      });
    }
    
    ElMessage.success('Documento subido exitosamente y guardado permanentemente');
    resetForm();
    
    // Redirigir a Mis Documentos para que vea su documento guardado
    router.push('/mis-documentos');
  } catch (error) {
    console.error('Error al subir documento:', error);
    
    // Mensajes de error más específicos
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      ElMessage.error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000');
    } else {
      ElMessage.error('Error al subir el documento: ' + error.message);
    }
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped>
.upload-view {
  max-width: 900px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.upload-card, .preview-card {
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: uploadCardIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes uploadCardIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.upload-card:hover, .preview-card:hover {
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.card-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
}

.upload-form {
  padding: 20px 0;
}

.upload-dragger {
  width: 100%;
}

.upload-dragger .el-upload-dragger {
  width: 100%;
  height: 200px;
  border: 2px dashed rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(250, 250, 250, 0.6);
  backdrop-filter: blur(10px);
  animation: draggerPulse 3s ease-in-out infinite;
}

@keyframes draggerPulse {
  0%, 100% {
    border-color: rgba(0, 0, 0, 0.2);
  }
  50% {
    border-color: rgba(0, 0, 0, 0.3);
  }
}

.upload-dragger .el-upload-dragger:hover {
  border-color: #1a1a1a;
  background: rgba(245, 245, 245, 0.8);
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.upload-dragger .el-upload-dragger:active {
  transform: scale(0.98);
}

.el-icon--upload {
  font-size: 67px;
  color: #c0c4cc;
  margin: 40px 0 16px;
  line-height: 50px;
}

.el-upload__text {
  color: #606266;
  font-size: 14px;
  text-align: center;
}

.el-upload__text em {
  color: #409eff;
  font-style: normal;
}

.el-upload__tip {
  color: #909399;
  font-size: 12px;
  margin-top: 7px;
}

.tags-section {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag-item {
  margin: 0;
}

.tag-input {
  width: 90px;
}

.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.tags-help, .auto-tagging-help, .visibility-help, .author-help, .usuario-help {
  margin-top: 8px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 2px solid #f1f5f9;
  margin-top: 24px;
}

.form-actions :deep(.el-button) {
  border-radius: 12px;
  font-weight: 600;
  padding: 12px 28px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.form-actions :deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.form-actions :deep(.el-button) {
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  padding: 10px 20px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  color: #1a1a1a;
  transition: all 0.2s ease;
}

.form-actions :deep(.el-button:hover) {
  background: #f5f5f5;
  border-color: #d5d5d5;
  transform: none;
  box-shadow: none;
}

.form-actions :deep(.el-button--primary) {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #ffffff;
}

.form-actions :deep(.el-button--primary:hover) {
  background: #333333;
  border-color: #333333;
}

.preview-content {
  padding: 20px 0;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.file-icon {
  font-size: 48px;
  color: #409eff;
}

.file-details h4 {
  margin: 0 0 8px 0;
  color: #303133;
}

.file-details p {
  margin: 4px 0;
  color: #606266;
  font-size: 14px;
}

.auto-tags {
  margin-top: 20px;
}

.auto-tags h5 {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 14px;
}

.auto-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .upload-view {
    padding: 0 10px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .file-info {
    flex-direction: column;
    text-align: center;
  }
}
</style>
