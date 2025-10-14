import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import apuntesRoutes from "./routes/apuntesRoutes.js";



// Crear la app
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/apuntes", apuntesRoutes);

// Rutas de prueba
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando 🚀");
});

// Conexión a la base de datos (puedes dejarlo comentado si aún no usas MongoDB)
mongoose
  .connect("mongodb://localhost:27017/apuntesdb")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar:", err));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
