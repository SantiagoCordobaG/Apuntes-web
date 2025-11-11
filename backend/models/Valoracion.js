import mongoose from "mongoose";

const ValoracionSchema = new mongoose.Schema({
  documento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Documento',
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comentario: {
    type: String,
    maxlength: 500
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índice único para evitar que un usuario valore el mismo documento dos veces
ValoracionSchema.index({ documento: 1, usuario: 1 }, { unique: true });

const Valoracion = mongoose.model("Valoracion", ValoracionSchema);

export default Valoracion;

