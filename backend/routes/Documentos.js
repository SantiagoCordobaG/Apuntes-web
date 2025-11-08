import express from "express";
import Documento from "../models/Documento.js";
import { upload, cloudinary } from "../config/cloudinary.js";
import multer from "multer";
import axios from "axios";

const router = express.Router();

// Obtener todos los documentos
router.get("/", async (req, res) => {
  try {
    const documentos = await Documento.find();
    res.json(documentos);
  } catch (error) {
    console.error("❌ Error al obtener documentos:", error);
    res.status(500).json({ error: "Error al obtener documentos: " + error.message });
  }
});

// 🆕 Ruta de prueba para verificar que la ruta está funcionando
router.post("/upload/test", (req, res) => {
  console.log("✅ Ruta de prueba /upload/test funcionando");
  res.json({ message: "Ruta de prueba funcionando", body: req.body });
});

// 🆕 NUEVO: Subir documento con archivo a Cloudinary
router.post("/upload", (req, res, next) => {
  console.log("📥 POST /upload recibido - antes de multer");
  console.log("📦 Headers:", req.headers['content-type']);
  next();
}, upload.single('file'), async (req, res) => {
  console.log("📥 POST /upload recibido - después de multer");
  console.log("📦 Body:", req.body);
  console.log("📁 File:", req.file ? "Archivo recibido" : "No hay archivo");
  
  try {
    // Validar que se subió un archivo
    if (!req.file) {
      console.log("❌ No se subió ningún archivo");
      return res.status(400).json({ error: "No se subió ningún archivo" });
    }

    // Validar campos requeridos
    if (!req.body.title || !req.body.description || !req.body.author) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    console.log("📤 Archivo subido a Cloudinary:", req.file.path);

    // Crear documento con la información del archivo
    const nuevoDocumento = new Documento({
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      fileName: req.file.originalname,
      fileType: req.file.originalname.split('.').pop().toLowerCase(),
      fileUrl: req.file.path,           // URL completa de Cloudinary
      fileKey: req.file.filename,       // ID único en Cloudinary
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      fileSize: (req.file.size / (1024 * 1024)).toFixed(2) + ' MB',
      uploadDate: new Date().toISOString().split('T')[0],
      rating: 0,
      ratingCount: 0,
      downloadCount: 0
    });

    await nuevoDocumento.save();
    console.log("✅ Documento guardado en MongoDB");
    
    res.status(201).json(nuevoDocumento);
  } catch (error) {
    console.error("❌ Error al subir documento:", error);
    res.status(500).json({ error: "Error al subir documento: " + error.message });
  }
}, (error, req, res, next) => {
  // Manejo de errores de multer
  console.error("❌ Error de multer:", error);
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: "El archivo es demasiado grande. Máximo 10MB" });
    }
    return res.status(400).json({ error: error.message });
  }
  res.status(400).json({ error: error.message || "Error al procesar el archivo" });
});

// 🆕 NUEVO: Descargar documento (incrementa contador y sirve el archivo con nombre correcto)
router.get("/download/:id", async (req, res) => {
  try {
    const documento = await Documento.findById(req.params.id);
    
    if (!documento) {
      return res.status(404).json({ error: "Documento no encontrado" });
    }

    if (!documento.fileUrl) {
      return res.status(404).json({ error: "Este documento no tiene archivo asociado" });
    }

    // Incrementar contador de descargas
    documento.downloadCount += 1;
    await documento.save();

    console.log(`📥 Descarga #${documento.downloadCount}: ${documento.title}`);

    // Obtener el archivo desde Cloudinary
    try {
      const response = await axios.get(documento.fileUrl, {
        responseType: 'arraybuffer'
      });

      // Determinar el tipo MIME basado en la extensión del archivo
      const fileExtension = documento.fileName.split('.').pop().toLowerCase();
      let contentType = 'application/octet-stream';
      
      switch (fileExtension) {
        case 'pdf':
          contentType = 'application/pdf';
          break;
        case 'doc':
          contentType = 'application/msword';
          break;
        case 'docx':
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
      }

      // Configurar headers para forzar la descarga con el nombre correcto
      const fileName = documento.fileName || `documento.${fileExtension}`;
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
      res.setHeader('Content-Length', response.data.length);

      // Enviar el archivo
      res.send(Buffer.from(response.data));
    } catch (cloudinaryError) {
      console.error("❌ Error al descargar desde Cloudinary:", cloudinaryError);
      // Si falla la descarga desde Cloudinary, devolver la URL como fallback
      res.json({ 
        fileUrl: documento.fileUrl,
        fileName: documento.fileName 
      });
    }
  } catch (error) {
    console.error("❌ Error al procesar descarga:", error);
    res.status(500).json({ error: "Error al obtener documento" });
  }
});

// Obtener un documento por ID
router.get("/:id", async (req, res) => {
  try {
    const documento = await Documento.findById(req.params.id);
    if (!documento) {
      return res.status(404).json({ error: "Documento no encontrado" });
    }
    res.json(documento);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener documento" });
  }
});

// Crear un documento (sin archivo - solo para compatibilidad)
router.post("/", async (req, res) => {
  try {
    const nuevoDocumento = new Documento(req.body);
    await nuevoDocumento.save();
    res.status(201).json(nuevoDocumento);
  } catch (error) {
    res.status(500).json({ error: "Error al crear documento" });
  }
});

export default router;
