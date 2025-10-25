import express from "express";
import {
  obtenerUsuario,
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from "../controllers/usuariosController.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", obtenerUsuarios);

// Obtener un usuario por ID
router.get("/:id", obtenerUsuario);

// Crear un usuario
router.post("/", crearUsuario);

// Actualizar un usuario
router.put("/:id", actualizarUsuario);

// Eliminar un usuario
router.delete("/:id", eliminarUsuario);

export default router;

