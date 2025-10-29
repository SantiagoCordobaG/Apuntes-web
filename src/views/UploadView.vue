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

        <el-form-item label="Autor" prop="author">
          <el-input
            v-model="form.author"
            placeholder="Nombre del autor"
            maxlength="50"
          />
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
import { ref, reactive, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useDocumentsStore } from '@/stores/documents';
import { ElMessage } from 'element-plus';
import {
  Upload,
  UploadFilled,
  ArrowLeft,
  Document
} from '@element-plus/icons-vue';

const router = useRouter();
const documentsStore = useDocumentsStore();

// Referencias
const formRef = ref();
const uploadRef = ref();
const inputRef = ref();

// Estado del formulario
const form = reactive({
  title: '',
  description: '',
  author: '',
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
  author: [
    { required: true, message: 'El autor es obligatorio', trigger: 'blur' },
    { min: 2, max: 50, message: 'El autor debe tener entre 2 y 50 caracteres', trigger: 'blur' }
  ]
};

// Métodos
const goBack = () => {
  router.push('/');
};

const handleFileChange = (file) => {
  form.file = file.raw;
  form.fileType = getFileType(file.name);
  
  // Generar etiquetas automáticas si está activado
  if (form.autoTagging) {
    autoGeneratedTags.value = documentsStore.generateAutoTags(file.name, '');
    // Agregar etiquetas automáticas si no existen
    autoGeneratedTags.value.forEach(tag => {
      if (!form.tags.includes(tag)) {
        form.tags.push(tag);
      }
    });
  }
};

const beforeUpload = (file) => {
  const isValidType = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type);
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

  try {
    await formRef.value?.validate();
    uploading.value = true;
    
    // Crear FormData para enviar archivo + datos
    const formData = new FormData();
    formData.append('file', form.file);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('author', form.author);
    formData.append('tags', JSON.stringify(form.tags));
    
    // Enviar al endpoint de upload
    const res = await fetch('http://localhost:3000/api/Documentos/upload', {
      method: 'POST',
      body: formData  // NO pongas Content-Type, se pone automáticamente
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Error al subir');
    }
    
    const data = await res.json();
    console.log('✅ Documento subido:', data);
    
    ElMessage.success('Documento subido exitosamente a Cloudinary');
    resetForm();
    router.push('/');
  } catch (error) {
    console.error('Error:', error);
    ElMessage.error('Error al subir el documento: ' + error.message);
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped>
.upload-view {
  max-width: 800px;
  margin: 0 auto;
}

.upload-card, .preview-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  color: #303133;
}

.upload-form {
  padding: 20px 0;
}

.upload-dragger {
  width: 100%;
}

.upload-dragger .el-upload-dragger {
  width: 100%;
  height: 180px;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s;
}

.upload-dragger .el-upload-dragger:hover {
  border-color: #409eff;
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

.tags-help, .auto-tagging-help, .visibility-help {
  margin-top: 8px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
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
