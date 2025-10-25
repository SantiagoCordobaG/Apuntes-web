import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  rol: {
    type: String,
    default: "Estudiante"
  },
  carrera: String,
  universidad: String,
  avatar: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
}, {
  timestamps: true
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

export default Usuario;

