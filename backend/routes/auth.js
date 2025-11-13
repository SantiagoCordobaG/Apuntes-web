/**
 * ============================================
 * RUTAS DE AUTENTICACIÓN
 * ============================================
 * 
 * Define las rutas relacionadas con autenticación de usuarios.
 * 
 * RUTAS:
 * - POST /api/auth/registro → Crea un nuevo usuario
 * - POST /api/auth/login → Inicia sesión
 * - GET /api/auth/me → Obtiene datos del usuario actual (requiere token)
 */

import express from "express";
import {
  registrarUsuario,
  loginUsuario,
  obtenerUsuarioActual
} from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/registro
// Crea un nuevo usuario en la base de datos
router.post("/registro", registrarUsuario);

// POST /api/auth/login
// Verifica credenciales y devuelve token JWT
router.post("/login", loginUsuario);

// GET /api/auth/me
// Obtiene los datos del usuario actual usando el token
// (No requiere middleware porque el controller verifica el token)
router.get("/me", obtenerUsuarioActual);

export default router;

