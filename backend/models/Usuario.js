import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
    match: [/^[a-zA-ZÀ-ÿ\s]+$/, "El nombre solo puede contener letras"]
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Por favor ingresa un correo válido"]
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
    minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    select: false // No devolver la contraseña en las consultas por defecto, pero se puede seleccionar con +password
  },
  rol: {
    type: String,
    enum: ["Estudiante", "Profesor", "Administrador"],
    default: "Estudiante"
  },
  carrera: {
    type: String,
    trim: true
  },
  universidad: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
}, {
  timestamps: true
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

export default Usuario;
