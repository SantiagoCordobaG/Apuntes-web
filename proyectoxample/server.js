const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar directorio para archivos subidos
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Configuración de Multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB límite
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/octet-stream'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se permiten PDF, DOC, DOCX y TXT.'));
    }
  }
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/documentos_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
})
.catch((error) => {
  console.error('❌ Error conectando a MongoDB:', error);
});

// Esquema de Documento
const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  fileName: {
    type: String,
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'doc', 'docx', 'txt']
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  tags: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de búsquedas
documentSchema.index({ title: 'text', description: 'text', author: 'text' });
documentSchema.index({ tags: 1 });
documentSchema.index({ fileType: 1 });
documentSchema.index({ uploadDate: -1 });
documentSchema.index({ rating: -1 });
documentSchema.index({ downloadCount: -1 });

const Document = mongoose.model('Document', documentSchema);

// Rutas de la API

// Obtener todos los documentos
app.get('/api/documents', async (req, res) => {
  try {
    const { 
      search, 
      tags, 
      fileType, 
      sortBy = 'uploadDate', 
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      author,
      minRating,
      minDownloads,
      dateFrom,
      dateTo
    } = req.query;

    let query = {};

    // Filtro de búsqueda por texto
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtro por etiquetas
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }

    // Filtro por tipo de archivo
    if (fileType && fileType !== 'all') {
      query.fileType = fileType;
    }

    // Filtro por autor
    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }

    // Filtro por valoración mínima
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Filtro por descargas mínimas
    if (minDownloads) {
      query.downloadCount = { $gte: parseInt(minDownloads) };
    }

    // Filtro por rango de fechas
    if (dateFrom || dateTo) {
      query.uploadDate = {};
      if (dateFrom) query.uploadDate.$gte = new Date(dateFrom);
      if (dateTo) query.uploadDate.$lte = new Date(dateTo);
    }

    // Configuración de ordenamiento
    const sortOptions = {};
    const order = sortOrder === 'asc' ? 1 : -1;
    
    switch (sortBy) {
      case 'title':
        sortOptions.title = order;
        break;
      case 'rating':
        sortOptions.rating = order;
        break;
      case 'downloadCount':
        sortOptions.downloadCount = order;
        break;
      case 'uploadDate':
      default:
        sortOptions.uploadDate = order;
        break;
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const documents = await Document.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-filePath'); // No incluir la ruta del archivo por seguridad

    const total = await Document.countDocuments(query);

    res.json({
      success: true,
      data: documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener documentos',
      error: error.message
    });
  }
});

// Obtener un documento por ID
app.get('/api/documents/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).select('-filePath');
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el documento',
      error: error.message
    });
  }
});

// Crear nuevo documento
app.post('/api/documents', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha subido ningún archivo'
      });
    }

    const { title, description, author, tags, visibility = 'public' } = req.body;

    // Validar campos requeridos
    if (!title || !description || !author) {
      return res.status(400).json({
        success: false,
        message: 'Título, descripción y autor son campos obligatorios'
      });
    }

    // Procesar etiquetas
    let tagsArray = [];
    if (tags) {
      tagsArray = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
    }

    // Generar etiquetas automáticas basadas en el nombre del archivo
    const fileName = req.file.originalname.toLowerCase();
    const autoTags = generateAutoTags(fileName);
    tagsArray = [...new Set([...tagsArray, ...autoTags])]; // Eliminar duplicados

    // Determinar tipo de archivo
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let fileType = 'txt'; // Default para archivos de texto
    if (fileExtension === '.pdf') fileType = 'pdf';
    else if (['.doc', '.docx'].includes(fileExtension)) fileType = 'docx';
    else if (fileExtension === '.txt') fileType = 'txt';

    const document = new Document({
      title,
      description,
      author,
      fileName: req.file.filename,
      originalFileName: req.file.originalname,
      fileType,
      filePath: req.file.path,
      fileSize: req.file.size,
      tags: tagsArray,
      visibility
    });

    await document.save();

    res.status(201).json({
      success: true,
      message: 'Documento creado exitosamente',
      data: {
        id: document._id,
        title: document.title,
        description: document.description,
        author: document.author,
        fileName: document.originalFileName,
        fileType: document.fileType,
        fileSize: formatFileSize(document.fileSize),
        tags: document.tags,
        uploadDate: document.uploadDate,
        rating: document.rating,
        ratingCount: document.ratingCount,
        downloadCount: document.downloadCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el documento',
      error: error.message
    });
  }
});

// Actualizar documento
app.put('/api/documents/:id', async (req, res) => {
  try {
    const { title, description, author, tags, visibility } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (author) updateData.author = author;
    if (tags) {
      const tagsArray = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
      updateData.tags = tagsArray;
    }
    if (visibility) updateData.visibility = visibility;
    
    updateData.lastModified = new Date();

    const document = await Document.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-filePath');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Documento actualizado exitosamente',
      data: document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el documento',
      error: error.message
    });
  }
});

// Eliminar documento
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    // Eliminar archivo del sistema de archivos
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Documento eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el documento',
      error: error.message
    });
  }
});

// Descargar documento
app.get('/api/documents/:id/download', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    // Verificar si el archivo existe
    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado en el servidor'
      });
    }

    // Incrementar contador de descargas
    document.downloadCount += 1;
    await document.save();

    // Enviar archivo
    res.download(document.filePath, document.originalFileName);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al descargar el documento',
      error: error.message
    });
  }
});

// Actualizar valoración
app.post('/api/documents/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'La valoración debe ser un número entre 1 y 5'
      });
    }

    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Documento no encontrado'
      });
    }

    // Calcular nueva valoración promedio
    const totalRating = document.rating * document.ratingCount;
    document.ratingCount += 1;
    document.rating = (totalRating + rating) / document.ratingCount;
    await document.save();

    res.json({
      success: true,
      message: 'Valoración actualizada exitosamente',
      data: {
        rating: document.rating,
        ratingCount: document.ratingCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la valoración',
      error: error.message
    });
  }
});

// Obtener estadísticas
app.get('/api/statistics', async (req, res) => {
  try {
    const totalDocuments = await Document.countDocuments();
    const totalDownloads = await Document.aggregate([
      { $group: { _id: null, total: { $sum: '$downloadCount' } } }
    ]);
    
    const avgRating = await Document.aggregate([
      { $match: { ratingCount: { $gt: 0 } } },
      { $group: { _id: null, average: { $avg: '$rating' } } }
    ]);

    const documentsByType = await Document.aggregate([
      { $group: { _id: '$fileType', count: { $sum: 1 } } }
    ]);

    const topAuthors = await Document.aggregate([
      { $group: { _id: '$author', count: { $sum: 1 }, totalDownloads: { $sum: '$downloadCount' } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const allTags = await Document.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalDocuments,
        totalDownloads: totalDownloads[0]?.total || 0,
        averageRating: avgRating[0]?.average ? avgRating[0].average.toFixed(2) : 0,
        documentsByType,
        topAuthors,
        totalTags: allTags.length,
        popularTags: allTags.slice(0, 10)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

// Función para generar etiquetas automáticas
function generateAutoTags(fileName) {
  const tags = [];
  const fileNameLower = fileName.toLowerCase();
  
  const keywordMap = {
    'matematicas': ['matemáticas', 'cálculo'],
    'fisica': ['física', 'ciencia'],
    'historia': ['historia', 'sociales'],
    'arte': ['arte', 'cultura'],
    'programacion': ['programación', 'informática'],
    'quimica': ['química', 'ciencia'],
    'biologia': ['biología', 'ciencia'],
    'literatura': ['literatura', 'humanidades'],
    'economia': ['economía', 'sociales'],
    'filosofia': ['filosofía', 'humanidades'],
    'geografia': ['geografía', 'sociales'],
    'ingles': ['inglés', 'idiomas'],
    'español': ['español', 'idiomas'],
    'frances': ['francés', 'idiomas']
  };

  Object.keys(keywordMap).forEach(keyword => {
    if (fileNameLower.includes(keyword)) {
      tags.push(...keywordMap[keyword]);
    }
  });

  // Etiquetas por tipo de contenido
  if (fileNameLower.includes('ejercicios') || fileNameLower.includes('practica')) {
    tags.push('ejercicios', 'práctica');
  }
  if (fileNameLower.includes('examen') || fileNameLower.includes('test')) {
    tags.push('examen', 'evaluación');
  }
  if (fileNameLower.includes('resumen') || fileNameLower.includes('summary')) {
    tags.push('resumen', 'síntesis');
  }
  if (fileNameLower.includes('apuntes') || fileNameLower.includes('notas')) {
    tags.push('apuntes', 'notas');
  }

  return [...new Set(tags)]; // Eliminar duplicados
}

// Función para formatear tamaño de archivo
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Middleware de manejo de errores
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. El límite es de 10MB.'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: error.message
  });
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📁 Archivos estáticos en http://localhost:${PORT}/uploads`);
});

module.exports = app;
