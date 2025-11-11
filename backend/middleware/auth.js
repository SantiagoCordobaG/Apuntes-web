import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

// Middleware para verificar el token JWT y obtener el usuario
export const verificarToken = async (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: "No se proporcionó un token de autenticación"
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "mi_secreto_super_seguro");
      const userId = decoded.userId;

      // Buscar el usuario y agregarlo al request
      const usuario = await Usuario.findById(userId);
      
      if (!usuario) {
        return res.status(404).json({
          error: "Usuario no encontrado"
        });
      }

      // Agregar el usuario al request para que las rutas puedan usarlo
      req.usuario = usuario;
      req.userId = userId;
      
      next();
    } catch (tokenError) {
      return res.status(401).json({
        error: "Token inválido o expirado"
      });
    }
  } catch (error) {
    console.error("❌ Error en middleware de autenticación:", error);
    res.status(500).json({
      error: "Error al verificar autenticación"
    });
  }
};

