const mongoose = require('mongoose');

// Configuración directa
const MONGODB_URI = 'mongodb+srv://anthony:2426@cluster0.n8vgiuc.mongodb.net/documentos_db?retryWrites=true&w=majority&appName=Cluster0';

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
    enum: ['pdf', 'doc', 'docx']
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

const Document = mongoose.model('Document', documentSchema);

// Datos de ejemplo
const sampleDocuments = [
  {
    title: 'Apuntes de Matemáticas Avanzadas',
    description: 'Cálculo diferencial e integral - Conceptos fundamentales y ejercicios resueltos',
    fileName: 'matematicas_avanzadas.pdf',
    originalFileName: 'matematicas_avanzadas.pdf',
    fileType: 'pdf',
    filePath: '/uploads/sample-matematicas.pdf',
    fileSize: 2400000,
    author: 'Prof. García',
    tags: ['matemáticas', 'cálculo', 'universidad', 'ejercicios'],
    rating: 4.5,
    ratingCount: 23,
    downloadCount: 156,
    visibility: 'public',
    uploadDate: new Date('2024-01-15')
  },
  {
    title: 'Historia del Arte Moderno',
    description: 'Movimientos artísticos del siglo XX - Desde el impresionismo hasta el arte contemporáneo',
    fileName: 'historia_arte_moderno.docx',
    originalFileName: 'historia_arte_moderno.docx',
    fileType: 'docx',
    filePath: '/uploads/sample-arte.docx',
    fileSize: 1800000,
    author: 'Dra. Martínez',
    tags: ['arte', 'historia', 'modernismo', 'cultura'],
    rating: 4.2,
    ratingCount: 18,
    downloadCount: 89,
    visibility: 'public',
    uploadDate: new Date('2024-01-14')
  },
  {
    title: 'Física Cuántica Básica',
    description: 'Introducción a la mecánica cuántica - Principios fundamentales y aplicaciones',
    fileName: 'fisica_cuantica.pdf',
    originalFileName: 'fisica_cuantica.pdf',
    fileType: 'pdf',
    filePath: '/uploads/sample-fisica.pdf',
    fileSize: 3100000,
    author: 'Dr. López',
    tags: ['física', 'cuántica', 'ciencia', 'teoría'],
    rating: 4.8,
    ratingCount: 31,
    downloadCount: 203,
    visibility: 'public',
    uploadDate: new Date('2024-01-13')
  }
];

async function initializeDatabase() {
  try {
    console.log('🔌 Conectando a MongoDB Atlas...');
    
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB Atlas');

    // Limpiar la colección existente
    await Document.deleteMany({});
    console.log('🗑️ Colección de documentos limpiada');

    // Insertar documentos de ejemplo
    const insertedDocuments = await Document.insertMany(sampleDocuments);
    console.log(`✅ ${insertedDocuments.length} documentos insertados exitosamente`);

    // Mostrar estadísticas
    const totalDocuments = await Document.countDocuments();
    const totalDownloads = await Document.aggregate([
      { $group: { _id: null, total: { $sum: '$downloadCount' } } }
    ]);

    console.log('\n📊 Estadísticas de la base de datos:');
    console.log(`   Total de documentos: ${totalDocuments}`);
    console.log(`   Total de descargas: ${totalDownloads[0]?.total || 0}`);
    console.log(`   Tipos de archivo: ${[...new Set(insertedDocuments.map(doc => doc.fileType))].join(', ')}`);
    console.log(`   Autores: ${[...new Set(insertedDocuments.map(doc => doc.author))].join(', ')}`);

    console.log('\n🎉 Base de datos inicializada exitosamente!');

  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  }
}

// Ejecutar
initializeDatabase();
