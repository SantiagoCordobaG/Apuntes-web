/**
 * ============================================
 * SERVIDOR PRINCIPAL (Backend)
 * ============================================
 * 
 * Este archivo configura y arranca el servidor Express.
 * 
 * FUNCIONES:
 * 1. Carga variables de entorno (.env)
 * 2. Configura Express y middlewares
 * 3. Define todas las rutas de la API
 * 4. Conecta a MongoDB
 * 5. Inicia el servidor en puerto 3000
 */

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import DocumentosRoutes from "./routes/Documentos.js";
import UsuariosRoutes from "./routes/usuarios.js";
import AuthRoutes from "./routes/auth.js";

// ===== 1. CARGAR VARIABLES DE ENTORNO =====
// Carga las variables del archivo .env (MONGO_URI, JWT_SECRET, etc.)
dotenv.config({ path: "./.env" });

// ===== 2. CREAR APLICACIÓN EXPRESS =====
const app = express();
const PORT = 3000;

// ===== 3. CONFIGURAR MIDDLEWARES =====
// Middlewares son funciones que se ejecutan en cada petición

// CORS: Permite que el frontend (localhost:8080) haga peticiones al backend
app.use(cors());

// express.json(): Convierte el body de las peticiones JSON a objeto JavaScript
app.use(express.json());

// ===== 4. DEFINIR RUTAS =====
// Todas las peticiones que empiecen con /api/Documentos van a DocumentosRoutes
app.use("/api/Documentos", DocumentosRoutes);

// Todas las peticiones que empiecen con /api/usuarios van a UsuariosRoutes
app.use("/api/usuarios", UsuariosRoutes);

// Todas las peticiones que empiecen con /api/auth van a AuthRoutes
app.use("/api/auth", AuthRoutes);

// ===== 5. RUTA DE PRUEBA =====
// Ruta simple para verificar que el servidor está funcionando
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando");
});

// ===== 6. CONECTAR A MONGODB =====
// Conecta a la base de datos usando la URL del .env
mongoose
  .connect(process.env.MONGO_URI, {
    authSource: "admin" // Configuración específica de MongoDB
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// ===== 7. INICIAR SERVIDOR =====
// El servidor escucha en el puerto 3000
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
