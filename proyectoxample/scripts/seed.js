const mongoose = require('mongoose');
require('dotenv').config({ path: '../config.env' });

// Esquema de Documento (mismo que en server.js)
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
  },
  {
    title: 'Programación en JavaScript',
    description: 'Guía completa de programación en JavaScript - Desde conceptos básicos hasta frameworks modernos',
    fileName: 'javascript_completo.pdf',
    originalFileName: 'javascript_completo.pdf',
    fileType: 'pdf',
    filePath: '/uploads/sample-javascript.pdf',
    fileSize: 4200000,
    author: 'Ing. Rodríguez',
    tags: ['programación', 'javascript', 'informática', 'desarrollo'],
    rating: 4.6,
    ratingCount: 45,
    downloadCount: 312,
    visibility: 'public',
    uploadDate: new Date('2024-01-12')
  },
  {
    title: 'Literatura Española Contemporánea',
    description: 'Análisis de las principales corrientes literarias del siglo XX en España',
    fileName: 'literatura_española.docx',
    originalFileName: 'literatura_española.docx',
    fileType: 'docx',
    filePath: '/uploads/sample-literatura.docx',
    fileSize: 2100000,
    author: 'Dra. Fernández',
    tags: ['literatura', 'español', 'humanidades', 'análisis'],
    rating: 4.3,
    ratingCount: 27,
    downloadCount: 134,
    visibility: 'public',
    uploadDate: new Date('2024-01-11')
  },
  {
    title: 'Química Orgánica - Ejercicios Resueltos',
    description: 'Colección de ejercicios resueltos de química orgánica con explicaciones detalladas',
    fileName: 'quimica_organica_ejercicios.pdf',
    originalFileName: 'quimica_organica_ejercicios.pdf',
    fileType: 'pdf',
    filePath: '/uploads/sample-quimica.pdf',
    fileSize: 2800000,
    author: 'Dr. Morales',
    tags: ['química', 'orgánica', 'ejercicios', 'ciencia'],
    rating: 4.7,
    ratingCount: 38,
    downloadCount: 267,
    visibility: 'public',
    uploadDate: new Date('2024-01-10')
  },
  {
    title: 'Economía Microeconómica',
    description: 'Fundamentos de microeconomía - Teoría del consumidor y del productor',
    fileName: 'economia_micro.pdf',
    originalFileName: 'economia_micro.pdf',
    fileType: 'pdf',
    filePath: '/uploads/sample-economia.pdf',
    fileSize: 3500000,
    author: 'Dr. Herrera',
    tags: ['economía', 'microeconomía', 'sociales', 'teoría'],
    rating: 4.4,
    ratingCount: 22,
    downloadCount: 178,
    visibility: 'public',
    uploadDate: new Date('2024-01-09')
  },
  {
    title: 'Biología Molecular - Conceptos Clave',
    description: 'Introducción a la biología molecular con enfoque en ADN, ARN y síntesis de proteínas',
    fileName: 'biologia_molecular.docx',
    originalFileName: 'biologia_molecular.docx',
    fileType: 'docx',
    filePath: '/uploads/sample-biologia.docx',
    fileSize: 1900000,
    author: 'Dra. Vega',
    tags: ['biología', 'molecular', 'ciencia', 'genética'],
    rating: 4.9,
    ratingCount: 52,
    downloadCount: 345,
    visibility: 'public',
    uploadDate: new Date('2024-01-08')
  }
];

async function seedDatabase() {
  try {
    // Conectar a MongoDB
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI no está configurada en el archivo config.env');
    }
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado a MongoDB');

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
    console.log(`   Total de descargas: ${totalDocuments > 0 ? totalDownloads[0]?.total || 0 : 0}`);
    console.log(`   Tipos de archivo: ${[...new Set(insertedDocuments.map(doc => doc.fileType))].join(', ')}`);
    console.log(`   Autores: ${[...new Set(insertedDocuments.map(doc => doc.author))].join(', ')}`);

    console.log('\n🎉 Base de datos inicializada exitosamente!');

  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleDocuments };
