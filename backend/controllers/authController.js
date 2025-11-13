/**
 * ============================================
 * CONTROLADOR DE AUTENTICACIÓN
 * ============================================
 * 
 * Contiene la lógica de negocio para autenticación.
 * 
 * FUNCIONES:
 * - registrarUsuario(): Crea un nuevo usuario
 * - loginUsuario(): Verifica credenciales e inicia sesión
 * - obtenerUsuarioActual(): Obtiene datos del usuario usando el token
 */

import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Genera un token JWT para el usuario
 * @param {string} userId - ID del usuario
 * @returns {string} Token JWT
 */
const generarToken = (userId) => {
  return jwt.sign(
    { userId }, // Datos que se guardan en el token
    process.env.JWT_SECRET || "mi_secreto_super_seguro", // Clave secreta
    { expiresIn: "7d" } // El token expira en 7 días
  );
};

/**
 * Registra un nuevo usuario en la base de datos
 * 
 * PROCESO:
 * 1. Valida que vengan los campos obligatorios
 * 2. Verifica que el correo no esté ya registrado
 * 3. Hashea la contraseña (nunca se guarda en texto plano)
 * 4. Crea el usuario en MongoDB
 * 5. Genera un token JWT
 * 6. Devuelve los datos del usuario (sin password) y el token
 */
export const registrarUsuario = async (req, res) => {
  try {
    // Extraer datos del body de la petición
    const { nombre, correo, password, rol, carrera, universidad } = req.body;

    // ===== VALIDACIÓN =====
    // Verificar que vengan los campos obligatorios
    if (!nombre || !correo || !password) {
      return res.status(400).json({
        error: "Por favor completa todos los campos obligatorios (nombre, correo, contraseña)"
      });
    }

    // ===== VERIFICAR SI EL CORREO YA EXISTE =====
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({
        error: "Este correo electrónico ya está registrado, intenta con otro correo."
      });
    }

    // ===== HASHEAR LA CONTRASEÑA =====
    // bcrypt convierte la contraseña en un hash (texto encriptado)
    // Nunca se guarda la contraseña en texto plano por seguridad
    const salt = await bcrypt.genSalt(10); // Genera "sal" para el hash
    const passwordHash = await bcrypt.hash(password, salt); // Hashea la contraseña

    // ===== CREAR NUEVO USUARIO =====
    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      password: passwordHash, // Guarda el hash, no la contraseña original
      rol: rol || "Estudiante", // Valor por defecto
      carrera: carrera || "",
      universidad: universidad || ""
    });

    // Guardar en MongoDB
    await nuevoUsuario.save();

    // ===== GENERAR TOKEN JWT =====
    // El token permite que el usuario no tenga que loguearse en cada petición
    const token = generarToken(nuevoUsuario._id);

    // ===== RESPONDER =====
    // Devuelve los datos del usuario (SIN la contraseña) y el token
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

/**
 * Inicia sesión de un usuario existente
 * 
 * PROCESO:
 * 1. Valida que vengan correo y password
 * 2. Busca el usuario por correo en MongoDB
 * 3. Compara la contraseña con bcrypt
 * 4. Si coincide → genera token JWT
 * 5. Devuelve los datos del usuario (sin password) y el token
 */
export const loginUsuario = async (req, res) => {
  try {
    // Extraer credenciales del body
    const { correo, password } = req.body;

    // ===== VALIDACIÓN =====
    if (!correo || !password) {
      return res.status(400).json({
        error: "Por favor ingresa correo y contraseña"
      });
    }

    // ===== BUSCAR USUARIO =====
    // .select("+password") incluye la contraseña (normalmente está oculta)
    const usuario = await Usuario.findOne({ correo }).select("+password");
    
    // Si no existe el usuario
    if (!usuario) {
      return res.status(401).json({
        error: "Credenciales inválidas"
      });
    }

    // ===== VERIFICAR CONTRASEÑA =====
    // bcrypt.compare() compara la contraseña ingresada con el hash guardado
    const passwordValida = await bcrypt.compare(password, usuario.password);
    
    // Si la contraseña no coincide
    if (!passwordValida) {
      return res.status(401).json({
        error: "Credenciales inválidas"
      });
    }

    // ===== GENERAR TOKEN =====
    const token = generarToken(usuario._id);

    // ===== RESPONDER =====
    // Devuelve los datos del usuario (SIN la contraseña) y el token
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

/**
 * Obtiene los datos del usuario actual usando el token JWT
 * 
 * PROCESO:
 * 1. Extrae el token del header Authorization
 * 2. Verifica que el token sea válido con JWT
 * 3. Obtiene el userId del token
 * 4. Busca el usuario en MongoDB
 * 5. Devuelve los datos del usuario (sin password)
 */
export const obtenerUsuarioActual = async (req, res) => {
  try {
    // ===== EXTRAER TOKEN =====
    // El token viene en el header: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
    const authHeader = req.headers.authorization;
    
    // Verificar que venga el header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: "No se proporcionó un token de autenticación"
      });
    }

    // Extraer solo el token (sin "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
      // ===== VERIFICAR TOKEN =====
      // jwt.verify() verifica que el token sea válido y no haya expirado
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || "mi_secreto_super_seguro"
      );
      const userId = decoded.userId; // Extrae el userId del token

      // ===== BUSCAR USUARIO =====
      const usuario = await Usuario.findById(userId);
      
      // Si no existe el usuario
      if (!usuario) {
        return res.status(404).json({
          error: "Usuario no encontrado"
        });
      }

      // ===== RESPONDER =====
      // Devuelve los datos del usuario (SIN la contraseña)
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
      // Si el token es inválido o expiró
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

