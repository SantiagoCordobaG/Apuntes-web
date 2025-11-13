# 📚 Guía Completa del Proyecto - Repositorio de Apuntes

## 🎯 ¿Qué es este proyecto?

Es una aplicación web para compartir y gestionar documentos académicos (apuntes, ejercicios, exámenes, etc.) donde los usuarios pueden:
- Subir documentos
- Buscar y filtrar documentos
- Descargar documentos
- Valorar documentos
- Gestionar sus propios documentos

---

## 🏗️ Arquitectura General

```
Frontend (Vue.js)  ←→  Backend (Node.js/Express)  ←→  Base de Datos (MongoDB)
     ↓                        ↓                            ↓
  Usuario              API REST                    Almacenamiento
```

---

## 📁 Estructura del Proyecto

### **Frontend** (`src/`)
```
src/
├── main.js              # Punto de entrada - Inicializa Vue
├── App.vue              # Componente raíz
├── router/              # Configuración de rutas
├── stores/              # Estado global (Pinia)
├── services/            # Llamadas a la API
├── components/          # Componentes reutilizables
├── views/               # Vistas principales
└── layouts/             # Layouts de la aplicación
```

### **Backend** (`backend/`)
```
backend/
├── server.js            # Servidor Express
├── routes/              # Definición de rutas
├── controllers/         # Lógica de negocio
├── models/              # Modelos de base de datos
├── middleware/          # Middlewares (auth, etc.)
└── utils/               # Utilidades (etiquetado automático)
```

---

## 🔄 Flujo de la Aplicación

### **1. Usuario entra a la aplicación**
```
Usuario → localhost:8080 → Router verifica autenticación
```

### **2. Si NO está autenticado**
```
Router → Redirige a /login → AuthView → LoginSection
```

### **3. Si SÍ está autenticado**
```
Router → Redirige a / → MainLayout → HomeView → Componente según tab
```

### **4. Usuario hace login**
```
LoginSection → authStore.login() → API /auth/login → Backend valida → Devuelve token
→ Token se guarda → Usuario redirigido a HomeView
```

---

## 📝 Explicación Detallada de Cada Archivo

### **FRONTEND**

#### **1. main.js** - Punto de Entrada
```javascript
// Este archivo es el PRIMERO que se ejecuta cuando la app se carga
// Su función es:
// 1. Crear la aplicación Vue
// 2. Configurar plugins (Pinia, Router, Element Plus)
// 3. Verificar si hay un usuario autenticado
// 4. Montar la app en el DOM
```

#### **2. App.vue** - Componente Raíz
```javascript
// Es el componente PADRE de toda la aplicación
// Solo renderiza <router-view /> que muestra la vista actual
// Muy simple porque toda la lógica está en las vistas
```

#### **3. router/index.js** - Sistema de Rutas
```javascript
// Define TODAS las rutas de la aplicación:
// - /login, /registro → AuthView (públicas)
// - / → HomeView (protegida, requiere login)
// 
// También tiene un "guard" que:
// - Verifica si el usuario está autenticado
// - Redirige a login si no lo está
// - Redirige a home si ya está autenticado y trata de ir a login
```

#### **4. stores/auth.js** - Estado de Autenticación
```javascript
// Almacena información del usuario autenticado:
// - usuario: datos del usuario
// - token: token JWT para autenticación
// - isAuthenticated: si está autenticado o no
//
// Funciones principales:
// - login(): inicia sesión
// - registro(): registra nuevo usuario
// - logout(): cierra sesión
// - getUsuarioActual(): obtiene info del usuario desde el backend
```

#### **5. services/documentService.js** - Servicio de Documentos
```javascript
// Centraliza TODAS las llamadas a la API relacionadas con documentos:
// - obtenerDocumentos(): obtiene lista de documentos
// - subirDocumento(): sube un nuevo documento
// - descargarDocumento(): descarga un documento
// - valorarDocumento(): valora un documento
// 
// Usa axios con interceptores para agregar el token automáticamente
```

---

### **BACKEND**

#### **1. server.js** - Servidor Principal
```javascript
// Configura el servidor Express:
// 1. Carga variables de entorno
// 2. Configura middlewares (CORS, JSON parser)
// 3. Define rutas (/api/auth, /api/Documentos, /api/usuarios)
// 4. Conecta a MongoDB
// 5. Inicia el servidor en puerto 3000
```

#### **2. routes/auth.js** - Rutas de Autenticación
```javascript
// Define las rutas de autenticación:
// POST /api/auth/registro → registrarUsuario()
// POST /api/auth/login → loginUsuario()
// GET /api/auth/me → obtenerUsuarioActual() (requiere token)
```

#### **3. controllers/authController.js** - Lógica de Autenticación
```javascript
// Contiene la lógica de negocio:
// 
// registrarUsuario():
//  1. Valida datos
//  2. Verifica si el correo ya existe
//  3. Hashea la contraseña (bcrypt)
//  4. Crea el usuario en la BD
//  5. Genera token JWT
//  6. Devuelve usuario y token
//
// loginUsuario():
//  1. Valida datos
//  2. Busca usuario por correo
//  3. Compara contraseña (bcrypt)
//  4. Genera token JWT
//  5. Devuelve usuario y token
//
// obtenerUsuarioActual():
//  1. Verifica token JWT
//  2. Busca usuario en BD
//  3. Devuelve información del usuario
```

#### **4. models/Usuario.js** - Modelo de Usuario
```javascript
// Define la estructura de un usuario en MongoDB:
// - nombre, correo, password (hasheado)
// - rol, carrera, universidad
// - avatar (opcional)
//
// El password tiene select: false para que no se devuelva en consultas
```

---

## 🔐 Sistema de Autenticación

### **Flujo Completo:**

1. **Usuario se registra:**
   ```
   Frontend → POST /api/auth/registro → Backend hashea password → Guarda en MongoDB → Devuelve token
   ```

2. **Usuario hace login:**
   ```
   Frontend → POST /api/auth/login → Backend verifica password → Devuelve token
   ```

3. **Token se guarda:**
   ```
   Token se guarda en localStorage → Se agrega automáticamente a todas las peticiones
   ```

4. **Peticiones protegidas:**
   ```
   Frontend hace petición → Axios interceptor agrega token → Backend verifica token → Responde
   ```

---

## 📄 Sistema de Documentos

### **Flujo de Subida:**

1. **Usuario selecciona archivo:**
   ```
   UploadSection → Valida archivo (tipo, tamaño) → Genera etiquetas automáticas
   ```

2. **Usuario completa formulario:**
   ```
   Título, descripción, etiquetas → Se combinan con etiquetas automáticas
   ```

3. **Se sube el documento:**
   ```
   Frontend → POST /api/Documentos/upload (FormData) → Backend:
     - Sube archivo a Cloudinary
     - Genera etiquetas automáticas si faltan
     - Guarda en MongoDB
     - Devuelve documento creado
   ```

### **Flujo de Búsqueda:**

1. **Usuario busca documentos:**
   ```
   DocumentosList → GET /api/Documentos → Backend devuelve todos → Frontend filtra
   ```

2. **Filtros aplicados:**
   ```
   Frontend filtra por: título, autor, etiquetas, tipo, valoración, descargas
   ```

---

## 🏷️ Sistema de Etiquetado Automático

### **Cómo Funciona:**

1. **Análisis de texto:**
   ```
   Toma: nombre archivo + título + descripción
   ```

2. **Busca palabras clave:**
   ```
   Compara con diccionarios de:
   - Áreas de conocimiento (matemáticas, física, etc.)
   - Tipos de documento (ejercicios, examen, resumen)
   - Niveles académicos (básico, intermedio, avanzado)
   ```

3. **Genera etiquetas:**
   ```
   Si encuentra "matematicas" → agrega: ["matemáticas", "cálculo", "álgebra"]
   Si encuentra "ejercicios" → agrega: ["ejercicios", "práctica", "taller"]
   ```

4. **Combina con etiquetas manuales:**
   ```
   Etiquetas manuales + automáticas (sin duplicados)
   ```

---

## 🔄 Flujo de Datos Completo

### **Ejemplo: Usuario sube un documento**

```
1. Usuario completa formulario en UploadSection
   ↓
2. UploadSection llama a documentService.subirDocumento(formData)
   ↓
3. documentService usa axios → agrega token automáticamente
   ↓
4. Backend recibe POST /api/Documentos/upload
   ↓
5. Middleware verifica token → extrae userId
   ↓
6. Controller procesa:
   - Sube archivo a Cloudinary
   - Genera etiquetas automáticas
   - Crea documento en MongoDB
   ↓
7. Devuelve documento creado
   ↓
8. Frontend muestra mensaje de éxito
   ↓
9. Redirige a "Mis Documentos"
```

---

## 🛠️ Tecnologías Utilizadas

### **Frontend:**
- **Vue 3**: Framework principal
- **Vue Router**: Navegación
- **Pinia**: Gestión de estado
- **Element Plus**: Componentes UI
- **Axios**: Peticiones HTTP

### **Backend:**
- **Node.js**: Runtime
- **Express**: Framework web
- **MongoDB**: Base de datos
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticación
- **bcrypt**: Hash de contraseñas
- **Cloudinary**: Almacenamiento de archivos
- **Multer**: Manejo de archivos

---

## 📊 Base de Datos

### **Colecciones:**

1. **usuarios:**
   ```javascript
   {
     _id: ObjectId,
     nombre: String,
     correo: String (único),
     password: String (hasheado),
     rol: String,
     carrera: String,
     universidad: String,
     avatar: String (opcional)
   }
   ```

2. **documentos:**
   ```javascript
   {
     _id: ObjectId,
     title: String,
     description: String,
     fileName: String,
     fileType: String,
     fileUrl: String (Cloudinary),
     fileKey: String (Cloudinary ID),
     tags: [String],
     uploadedBy: ObjectId (ref: Usuario),
     usuario: String (nombre),
     author: String,
     rating: Number,
     ratingCount: Number,
     downloadCount: Number,
     uploadDate: String
   }
   ```

3. **valoraciones:**
   ```javascript
   {
     _id: ObjectId,
     documento: ObjectId (ref: Documento),
     usuario: ObjectId (ref: Usuario),
     rating: Number (1-5),
     comentario: String (opcional)
   }
   ```

---

## 🚀 Cómo Funciona Todo Junto

1. **Usuario abre la app** → `main.js` se ejecuta
2. **Router verifica autenticación** → Si no hay token → `/login`
3. **Usuario hace login** → Token se guarda → Redirige a `/`
4. **HomeView carga** → Muestra componente según `?tab=`
5. **Usuario navega** → Router cambia componente dinámicamente
6. **Usuario sube documento** → Se sube a Cloudinary → Se guarda en MongoDB
7. **Otros usuarios buscan** → Filtran documentos → Descargan

---

## 💡 Conceptos Clave

### **1. Estado Global (Pinia)**
- Almacena datos que se usan en toda la app
- `auth.js`: información del usuario
- `documents.js`: lista de documentos (opcional, se puede obtener de API)

### **2. Servicios**
- Centralizan llamadas a la API
- Evitan repetir código
- Manejan errores de forma consistente

### **3. Interceptores de Axios**
- Agregan token automáticamente a todas las peticiones
- Manejan errores globalmente (401 → redirige a login)

### **4. Guards de Router**
- Protegen rutas que requieren autenticación
- Verifican token antes de permitir acceso

### **5. Componentes Dinámicos**
- `HomeView` renderiza diferentes componentes según el `tab` en la URL
- No necesita múltiples rutas, solo cambia el componente

---

## 🎯 Resumen Ejecutivo

**Frontend:**
- Vue 3 maneja la UI
- Router maneja la navegación
- Pinia maneja el estado
- Axios maneja las peticiones

**Backend:**
- Express maneja las rutas
- Controllers manejan la lógica
- Models definen la estructura de datos
- MongoDB almacena todo

**Flujo:**
- Usuario interactúa → Frontend hace petición → Backend procesa → Devuelve respuesta → Frontend actualiza UI

---

Esta es la estructura general. Cada archivo tiene su propósito específico y todos trabajan juntos para crear la aplicación completa.

