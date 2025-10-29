import mongoose from "mongoose";

const DocumentoSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  fileName: String,
  fileType: String,
  
  // Campos para almacenamiento en Cloudinary
  fileUrl: String,      // URL completa del archivo en Cloudinary
  fileKey: String,      // ID del archivo en Cloudinary (para poder eliminarlo)
  
  uploadDate: String,
  author: String,
  tags: [String],
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  fileSize: String,
  downloadCount: { type: Number, default: 0 }
});

const Documento = mongoose.model("Documento", DocumentoSchema);

export default Documento;
