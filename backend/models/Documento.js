import mongoose from "mongoose";

const DocumentoSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  fileName: String,
  fileType: String,
  uploadDate: String,
  author: String,
  tags: [String],
  rating: Number,
  ratingCount: Number,
  fileSize: String,
  downloadCount: Number
});

const Documento = mongoose.model("Documento", DocumentoSchema);

export default Documento;
