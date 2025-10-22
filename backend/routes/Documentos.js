import express from "express";
import Documento from "../models/Documento.js";

const router = express.Router();

// Crear un documento
router.post("/", async (req, res) => {
  try {
    const nuevoDocumento = new Documento(req.body);
    await nuevoDocumento.save();
    res.status(201).json({ message: "Documento creado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear documento" });
  }
});

// Obtener todos los documentos
router.get("/", async (req, res) => {
  try {
    const documentos = await Documento.find();
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener documentos" });
  }
});

export default router;
