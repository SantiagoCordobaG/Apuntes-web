import express from "express";
import Documento from "../models/Documento.js";
import { upload } from "../config/cloudinary.js";

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

// 🆕 NUEVO: Subir documento con archivo a Cloudinary
router.post("/upload", upload.single('file'), async (req, res) => {
  try {
    // Validar que se subió un archivo
    if (!req.file) {
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
});

// 🆕 NUEVO: Descargar documento (incrementa contador y devuelve URL)
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

    // Devolver la URL de Cloudinary para que el frontend descargue
    res.json({ 
      fileUrl: documento.fileUrl,
      fileName: documento.fileName 
    });
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
