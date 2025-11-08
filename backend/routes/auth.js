import express from "express";
import {
  registrarUsuario,
  loginUsuario,
  obtenerUsuarioActual
} from "../controllers/authController.js";

const router = express.Router();

// Ruta de registro
router.post("/registro", registrarUsuario);

// Ruta de login
router.post("/login", loginUsuario);

// Ruta para obtener usuario actual (requiere autenticación)
router.get("/me", obtenerUsuarioActual);

export default router;

