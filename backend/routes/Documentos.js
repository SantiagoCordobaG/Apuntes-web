import express from "express";
import Documento from "../models/Documento.js";

const router = express.Router();

// Obtener todos los documentos
router.get("/", async (req, res) => {
  try {
    const documentos = await Documento.find();
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener documentos" });
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

// Crear un documento
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
