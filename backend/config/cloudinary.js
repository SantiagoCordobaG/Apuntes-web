import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" });

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("🔧 Cloudinary configurado para:", process.env.CLOUDINARY_CLOUD_NAME);

// Configurar almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'apuntes-web', // Carpeta en Cloudinary donde se guardarán los archivos
    resource_type: 'raw', // Para PDFs, DOC, DOCX (no imágenes)
    allowed_formats: ['pdf', 'doc', 'docx'],
    public_id: (req, file) => {
      // Generar nombre único para el archivo
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0].replace(/\s+/g, '_');
      return `${originalName}_${timestamp}`;
    },
  },
});

// Configurar multer con el storage de Cloudinary
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024 // Límite de 10MB por archivo
  },
  fileFilter: (req, file, cb) => {
    // Validar tipo de archivo
    const allowedTypes = ['application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF, DOC y DOCX'), false);
    }
  }
});

export { cloudinary, upload };

