import mongoose from "mongoose";
import dotenv from "dotenv";
import Documento from "./models/Documento.js";

dotenv.config({ path: "./.env" });

const documentos = [
  {
    id: 1,
    title: "Matemáticas Discretas",
    description: "Apuntes completos del curso",
    fileName: "matematicas.pdf",
    fileType: "pdf",
    uploadDate: "2024-01-15",
    author: "Juan Pérez",
    tags: ["matemáticas", "apuntes"],
    rating: 4.5,
    ratingCount: 10,
    fileSize: "2.5 MB",
    downloadCount: 45
  },
  {
    id: 2,
    title: "Historia del Arte",
    description: "Resumen de los movimientos artísticos",
    fileName: "historia_arte.pdf",
    fileType: "pdf",
    uploadDate: "2024-01-14",
    author: "María García",
    tags: ["historia", "arte"],
    rating: 4.8,
    ratingCount: 15,
    fileSize: "3.2 MB",
    downloadCount: 67
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    await Documento.deleteMany();
    console.log("🗑️  Documentos eliminados");

    await Documento.insertMany(documentos);
    console.log("✅ Documentos de ejemplo creados");

    mongoose.connection.close();
    console.log("✨ Seeding completado");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

seedDB();
