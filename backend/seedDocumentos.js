import mongoose from "mongoose";
import dotenv from "dotenv";
import Documento from "./models/Documento.js"; // asegúrate que la ruta es correcta

dotenv.config();

// Conectarse a MongoDB (usa la misma variable del server.js)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB (seeder)"))
  .catch((err) => console.error("❌ Error al conectar:", err));

const documentos = [
  {
    id: 1,
    title: "Historia del Arte Moderno",
    description: "Movimientos artísticos del siglo XX",
    fileName: "historia_arte_moderno.docx",
    fileType: "docx",
    uploadDate: "2024-01-14",
    author: "Dra. Martínez",
    tags: ["arte", "historia", "modernismo"],
    rating: 4.2,
    ratingCount: 18,
    fileSize: "1.8 MB",
    downloadCount: 89
  },
  {
    id: 2,
    title: "Introducción a la Psicología",
    description: "Conceptos fundamentales del comportamiento humano",
    fileName: "psicologia_intro.pdf",
    fileType: "pdf",
    uploadDate: "2024-02-20",
    author: "Dr. Gómez",
    tags: ["psicología", "comportamiento"],
    rating: 4.8,
    ratingCount: 24,
    fileSize: "2.1 MB",
    downloadCount: 132
  },
  {
    id: 3,
    title: "Bases de Datos NoSQL",
    description: "Introducción a MongoDB, Cassandra y Redis",
    fileName: "nosql_intro.pdf",
    fileType: "pdf",
    uploadDate: "2024-03-01",
    author: "Ing. López",
    tags: ["bases de datos", "tecnología"],
    rating: 4.5,
    ratingCount: 15,
    fileSize: "3.0 MB",
    downloadCount: 67
  },
  {
    id: 4,
    title: "Programación en Python",
    description: "Guía práctica para principiantes",
    fileName: "python_basico.docx",
    fileType: "docx",
    uploadDate: "2024-04-10",
    author: "Prof. Rodríguez",
    tags: ["programación", "python", "desarrollo"],
    rating: 4.9,
    ratingCount: 40,
    fileSize: "2.8 MB",
    downloadCount: 210
  }
];

// Eliminar documentos anteriores y agregar los nuevos
const seedDB = async () => {
  await Documento.deleteMany({});
  await Documento.insertMany(documentos);
  console.log("✅ Documentos insertados correctamente!");
  mongoose.connection.close();
};

seedDB();
