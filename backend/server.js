import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import DocumentosRoutes from "./routes/Documentos.js";
import UsuariosRoutes from "./routes/usuarios.js";


// ✅ Cargar variables de entorno ANTES de usarlas
dotenv.config({ path: "./.env" });

// Crear la app
const app = express();
const PORT = 3000;

// ✅ Verifica que la variable esté cargando
console.log("🧠 MONGO_URI:", process.env.MONGO_URI);

// Middlewares
app.use(cors());  
app.use(express.json());

// Rutas
app.use("/api/Documentos", DocumentosRoutes);
app.use("/api/usuarios", UsuariosRoutes);

// Rutas de prueba
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando ");
});

// ✅ Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    authSource: "admin"
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));


app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
