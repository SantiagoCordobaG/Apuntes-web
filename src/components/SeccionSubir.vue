<template>
  <div class="upload-view fade-in-up-sm">
    <el-card class="upload-card glass-card card-slide-in">
      <template #header>
        <div class="card-header">
          <h2 class="card-title">Subir Nuevo Documento</h2>
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
    <el-card v-if="form.file" class="preview-card glass-card card-slide-in">
      <template #header>
        <h3 class="card-title">Vista Previa</h3>
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

<!--
  ============================================
  COMPONENTE: SeccionSubir
  ============================================
  
  DESCRIPCIÓN:
  Formulario completo para que los usuarios suban documentos al sistema. Permite configurar
  toda la información del documento, etiquetas y visibilidad antes de subirlo.
  
  QUÉ HACE:
  - Permite seleccionar y subir archivos PDF, DOC o DOCX (máx. 10MB)
  - Permite agregar título, descripción, autor y etiquetas al documento
  - Genera etiquetas automáticas basándose en el nombre del archivo
  - Permite configurar la visibilidad (público o privado)
  - Valida el archivo antes de subirlo (tipo y tamaño)
  - Sube el documento al servidor y muestra confirmación
  - Notifica al componente padre cuando se sube un documento exitosamente
-->
<script setup>
import { ref, reactive, nextTick, onMounted, watch } from 'vue';
import { useDocumentsStore } from '@/stores/documentos';
import { useAuthStore } from '@/stores/autenticacion';
import { ElMessage } from 'element-plus';
import { Upload, UploadFilled, Document } from '@element-plus/icons-vue';
import { subirDocumento } from '@/services/servicioDocumentos';
import { generarEtiquetasAutomaticas } from '@/services/servicioEtiquetadoAutomatico';

// Emitir evento cuando se sube un documento (para notificar al componente padre)
// eslint-disable-next-line no-undef
const emit = defineEmits(['document-uploaded']);

// Stores para acceder a datos globales
const documentsStore = useDocumentsStore();
const authStore = useAuthStore();

// Referencias a elementos del DOM
const formRef = ref(); // Referencia al formulario para validación
const uploadRef = ref(); // Referencia al componente de subida
const inputRef = ref(); // Referencia al input de etiquetas

// Datos del formulario (reactive = se actualizan automáticamente en la vista)
const form = reactive({
  title: '', // Título del documento
  description: '', // Descripción del documento
  usuario: '', // Usuario que sube (se llena automáticamente)
  author: '', // Autor del documento/libro
  tags: [], // Lista de etiquetas
  autoTagging: true, // Activar/desactivar etiquetas automáticas
  visibility: 'public', // 'public' o 'private'
  file: null, // Archivo seleccionado
  fileType: '' // Tipo: 'pdf' o 'docx'
});

// Estados de la interfaz
const fileList = ref([]); // Lista de archivos en el componente de subida
const uploading = ref(false); // Muestra spinner mientras se sube
const inputVisible = ref(false); // Muestra/oculta input para nueva etiqueta
const inputValue = ref(''); // Texto del input de etiqueta
const autoGeneratedTags = ref([]); // Etiquetas generadas automáticamente

// Al cargar el componente, llenar el campo usuario con el nombre del usuario logueado
onMounted(() => {
  if (authStore.usuario?.nombre) {
    form.usuario = authStore.usuario.nombre;
  }
});

// Reglas de validación del formulario (Element Plus)
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
    { required: true, message: 'El usuario es obligatorio', trigger: 'blur' }
  ],
  author: [
    { max: 50, message: 'El autor no puede tener más de 50 caracteres', trigger: 'blur' }
  ]
};

// ============================================
// FUNCIONES
// ============================================

// Se ejecuta cuando el usuario selecciona un archivo
const handleFileChange = (file, fileList) => {
  const rawFile = file.raw || file;
  if (!rawFile || file.status === 'fail' || fileList.length === 0) {
    form.file = null;
    form.fileType = '';
    autoGeneratedTags.value = [];
    return;
  }
  
  form.file = rawFile;
  form.fileType = getFileType(file.name);
  
  // Si el etiquetado automático está activado, generar etiquetas
  if (form.autoTagging) generarEtiquetas();
};

// Genera etiquetas automáticas basándose en el nombre del archivo, título y descripción
const generarEtiquetas = () => {
  if (!form.file) return;
  
  // Llama al servicio que genera etiquetas inteligentes
  autoGeneratedTags.value = generarEtiquetasAutomaticas({
    fileName: form.file.name,
    title: form.title,
    description: form.description,
    includeKeywords: false
  });
  
  // Agrega las etiquetas generadas al formulario (sin duplicados)
  autoGeneratedTags.value.forEach(tag => {
    if (!form.tags.includes(tag)) form.tags.push(tag);
  });
};

// Regenera etiquetas cuando cambian título o descripción (espera 500ms para no hacerlo muy seguido)
let timeoutId = null;
watch([() => form.title, () => form.description], () => {
  if (form.autoTagging && form.file) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => generarEtiquetas(), 500);
  }
});

// Valida que el archivo sea válido (tipo y tamaño)
const validateFile = (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  const validTypes = ['pdf', 'doc', 'docx'];
  const isValidType = validTypes.includes(extension) && file.size / 1024 / 1024 < 10;
  
  if (!isValidType) {
    ElMessage.error(extension && validTypes.includes(extension) 
      ? 'El archivo debe ser menor a 10MB!' 
      : 'Solo se permiten archivos PDF, DOC y DOCX!');
    return false;
  }
  return true;
};

const beforeUpload = (file) => validateFile(file);

// Obtiene el tipo de archivo ('pdf' o 'docx')
const getFileType = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  return ext === 'pdf' ? 'pdf' : (['doc', 'docx'].includes(ext) ? 'docx' : 'unknown');
};

// Formatea el tamaño del archivo (bytes a KB, MB, GB)
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Elimina una etiqueta de la lista
const removeTag = (tag) => {
  const index = form.tags.indexOf(tag);
  if (index > -1) form.tags.splice(index, 1);
};

// Muestra el input para agregar nueva etiqueta
const showInput = () => {
  inputVisible.value = true;
  nextTick(() => inputRef.value?.focus());
};

// Confirma y agrega la nueva etiqueta
const handleInputConfirm = () => {
  if (inputValue.value && !form.tags.includes(inputValue.value)) {
    form.tags.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = '';
};

// Limpia todos los campos del formulario
const resetForm = () => {
  formRef.value?.resetFields();
  Object.assign(form, {
    title: '',
    description: '',
    usuario: authStore.usuario?.nombre || '',
    author: '',
    tags: [],
    autoTagging: true,
    visibility: 'public',
    file: null,
    fileType: ''
  });
  fileList.value = [];
  autoGeneratedTags.value = [];
  uploadRef.value?.clearFiles();
};

// Envía el formulario y sube el documento al servidor
const submitForm = async () => {
  // Validaciones básicas
  if (!form.file) {
    ElMessage.error('Por favor selecciona un archivo');
    return;
  }

  try {
    await formRef.value?.validate();
  } catch {
    ElMessage.error('Por favor completa todos los campos requeridos');
    return;
  }

  uploading.value = true;
  
  try {
    // Crear FormData con todos los datos del documento
    const formData = new FormData();
    formData.append('file', form.file);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('usuario', form.usuario);
    formData.append('author', form.author || 'Anónimo');
    formData.append('tags', JSON.stringify(form.tags));
    formData.append('visibility', form.visibility);
    
    // Subir el documento al servidor
    const data = await subirDocumento(formData);
    
    // Si se subió correctamente, agregarlo al store local
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
    
    ElMessage.success('Documento subido exitosamente');
    resetForm();
    emit('document-uploaded'); // Notifica al componente padre
  } catch (error) {
    console.error('Error al subir documento:', error);
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped>
.upload-view { width: 100%; }
.upload-card, .preview-card { margin-bottom: 24px; }
.upload-form { padding: 20px 0; }
.upload-dragger { width: 100%; }
.tag-input { width: 90px; }
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.preview-content { padding: 20px 0; }
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
.auto-tags { margin-top: 20px; }
.auto-tags h5 {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 14px;
}
.auto-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>

