import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Función para generar token JWT
const generarToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "mi_secreto_super_seguro", {
    expiresIn: "7d" // El token expira en 7 días
  });
};

// 🔐 REGISTRO de nuevo usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, rol, carrera, universidad } = req.body;

    // Validar campos obligatorios
    if (!nombre || !correo || !password) {
      return res.status(400).json({
        error: "Por favor completa todos los campos obligatorios (nombre, correo, contraseña)"
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({
        error: "Este correo electrónico ya está registrado, intenta con otro correo."
      });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      password: passwordHash,
      rol: rol || "Estudiante",
      carrera: carrera || "",
      universidad: universidad || ""
    });

    await nuevoUsuario.save();

    // Generar token
    const token = generarToken(nuevoUsuario._id);

    // Devolver usuario (sin contraseña) y token
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      usuario: {
        _id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
        carrera: nuevoUsuario.carrera,
        universidad: nuevoUsuario.universidad,
        avatar: nuevoUsuario.avatar
      },
      token
    });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({
      error: "Error al registrar usuario: " + error.message
    });
  }
};

// 🔑 LOGIN de usuario
export const loginUsuario = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Validar campos
    if (!correo || !password) {
      return res.status(400).json({
        error: "Por favor ingresa correo y contraseña"
      });
    }

    // Buscar usuario y incluir la contraseña (porque está en select: false)
    const usuario = await Usuario.findOne({ correo }).select("+password");
    
    if (!usuario) {
      return res.status(401).json({
        error: "Credenciales inválidas"
      });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValida) {
      return res.status(401).json({
        error: "Credenciales inválidas"
      });
    }

    // Generar token
    const token = generarToken(usuario._id);

    // Devolver usuario (sin contraseña) y token
    res.json({
      message: "Login exitoso",
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        carrera: usuario.carrera,
        universidad: usuario.universidad,
        avatar: usuario.avatar
      },
      token
    });
  } catch (error) {
    console.error("❌ Error al hacer login:", error);
    res.status(500).json({
      error: "Error al hacer login: " + error.message
    });
  }
};

// 👤 Obtener información del usuario actual (requiere autenticación)
export const obtenerUsuarioActual = async (req, res) => {
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

      // Buscar el usuario
      const usuario = await Usuario.findById(userId);
      
      if (!usuario) {
        return res.status(404).json({
          error: "Usuario no encontrado"
        });
      }

      res.json({
        usuario: {
          _id: usuario._id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol,
          carrera: usuario.carrera,
          universidad: usuario.universidad,
          avatar: usuario.avatar
        }
      });
    } catch (tokenError) {
      return res.status(401).json({
        error: "Token inválido o expirado"
      });
    }
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    res.status(500).json({
      error: "Error al obtener usuario"
    });
  }
};

