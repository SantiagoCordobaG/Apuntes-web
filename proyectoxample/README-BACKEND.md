# Sistema de Gestión de Documentos - Backend

Este es el backend del sistema de gestión de documentos desarrollado con Node.js, Express.js y MongoDB.

## 🚀 Características

- **API RESTful** completa para gestión de documentos
- **Base de datos MongoDB** con esquemas optimizados
- **Subida de archivos** con validación de tipos y tamaños
- **Sistema de búsqueda** avanzada con filtros múltiples
- **Valoración y descarga** de documentos
- **Estadísticas** en tiempo real
- **Middleware de seguridad** (CORS, rate limiting, helmet)
- **Manejo de errores** robusto

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- MongoDB (versión 4.4 o superior)
- npm o yarn

## 🛠️ Instalación

### 1. Instalar dependencias del backend

```bash
# Renombrar el archivo package-backend.json a package.json
mv package-backend.json package.json

# Instalar dependencias
npm install
```

### 2. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Configuración de MongoDB
MONGODB_URI=mongodb://localhost:27017/documentos_db

# Puerto del servidor
PORT=3001

# Configuración de desarrollo
NODE_ENV=development

# Configuración de archivos
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 3. Instalar y configurar MongoDB

#### Opción A: MongoDB Local

```bash
# En Windows (usando Chocolatey)
choco install mongodb

# En macOS (usando Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# En Ubuntu/Debian
sudo apt-get install mongodb

# Iniciar MongoDB
mongod
```

#### Opción B: MongoDB Atlas (Cloud)

1. Crear una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crear un cluster gratuito
3. Obtener la cadena de conexión
4. Actualizar `MONGODB_URI` en el archivo `.env`

### 4. Inicializar la base de datos

```bash
# Ejecutar el script de inicialización
npm run seed
```

Este comando:
- Conecta a MongoDB
- Crea la base de datos `documentos_db`
- Inserta documentos de ejemplo
- Configura índices para optimizar búsquedas

## 🚀 Ejecutar el Servidor

### Desarrollo

```bash
# Ejecutar con nodemon (reinicio automático)
npm run dev
```

### Producción

```bash
# Ejecutar servidor
npm start
```

El servidor estará disponible en `http://localhost:3001`

## 📚 API Endpoints

### Documentos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/documents` | Obtener todos los documentos (con filtros) |
| GET | `/api/documents/:id` | Obtener documento por ID |
| POST | `/api/documents` | Crear nuevo documento |
| PUT | `/api/documents/:id` | Actualizar documento |
| DELETE | `/api/documents/:id` | Eliminar documento |
| GET | `/api/documents/:id/download` | Descargar documento |

### Valoraciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/documents/:id/rate` | Valorar documento |

### Estadísticas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/statistics` | Obtener estadísticas generales |

### Salud del Sistema

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Verificar estado del servidor |

## 🔍 Parámetros de Búsqueda

### GET /api/documents

- `search`: Búsqueda por texto en título, descripción y autor
- `tags`: Filtro por etiquetas (separadas por comas)
- `fileType`: Tipo de archivo (pdf, docx, all)
- `author`: Filtro por autor
- `minRating`: Valoración mínima (0-5)
- `minDownloads`: Descargas mínimas
- `dateFrom` / `dateTo`: Rango de fechas
- `sortBy`: Campo de ordenamiento (title, rating, uploadDate, downloadCount)
- `sortOrder`: Orden (asc, desc)
- `page`: Número de página
- `limit`: Elementos por página

### Ejemplo de búsqueda

```
GET /api/documents?search=matemáticas&tags=cálculo,ejercicios&fileType=pdf&sortBy=rating&sortOrder=desc&page=1&limit=10
```

## 📁 Estructura de Archivos

```
proyectoxample/
├── server.js                 # Servidor principal
├── config/
│   └── database.js          # Configuración de MongoDB
├── scripts/
│   └── seed.js              # Script de inicialización
├── uploads/                 # Directorio de archivos subidos
├── package.json             # Dependencias del backend
└── README-BACKEND.md        # Este archivo
```

## 🔧 Configuración del Frontend

Para conectar el frontend Vue.js con este backend:

1. **Actualizar la configuración de la API** en `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

2. **Configurar variables de entorno** en el frontend:

Crear archivo `.env` en la raíz del proyecto Vue:

```env
VUE_APP_API_URL=http://localhost:3001/api
```

3. **Instalar dependencias adicionales** en el frontend:

```bash
cd src
npm install axios
```

## 🧪 Pruebas

```bash
# Ejecutar pruebas
npm test

# Ejecutar pruebas con coverage
npm run test:coverage
```

## 📊 Monitoreo y Logs

El servidor incluye:

- **Morgan** para logging de requests HTTP
- **Helmet** para headers de seguridad
- **Rate limiting** para prevenir abuso
- **Compresión** para optimizar respuestas

## 🚨 Solución de Problemas

### Error de conexión a MongoDB

```
❌ Error conectando a MongoDB: connect ECONNREFUSED 127.0.0.1:27017
```

**Solución:**
1. Verificar que MongoDB esté ejecutándose
2. Comprobar la URI de conexión en `.env`
3. Verificar permisos de acceso

### Error de permisos en uploads/

```
❌ Error: EACCES: permission denied, open 'uploads/file.pdf'
```

**Solución:**
```bash
# Crear directorio y dar permisos
mkdir uploads
chmod 755 uploads
```

### Puerto en uso

```
❌ Error: listen EADDRINUSE: address already in use :::3001
```

**Solución:**
1. Cambiar el puerto en `.env`
2. O terminar el proceso que usa el puerto:
```bash
# En Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# En macOS/Linux
lsof -ti:3001 | xargs kill -9
```

## 🔒 Seguridad

- Validación de tipos de archivo
- Límite de tamaño de archivos (10MB)
- Sanitización de entrada
- Headers de seguridad con Helmet
- Rate limiting para prevenir ataques

## 📈 Rendimiento

- Índices optimizados en MongoDB
- Paginación en consultas
- Compresión de respuestas
- Cache de headers HTTP

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisar la sección de solución de problemas
2. Verificar los logs del servidor
3. Comprobar la configuración de MongoDB
4. Abrir un issue en el repositorio

---

**¡Disfruta desarrollando con este sistema de gestión de documentos! 🎉**
