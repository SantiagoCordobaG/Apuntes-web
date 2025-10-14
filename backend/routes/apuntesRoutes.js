import express from "express";
const router = express.Router();

// Rutas
router.get("/", (req, res) => {
  res.json([
    { id: 1, titulo: "Apunte de Redes", autor: "Santiago" },
    { id: 2, titulo: "Apunte de Programación", autor: "María" }
  ]);
});

export default router;
