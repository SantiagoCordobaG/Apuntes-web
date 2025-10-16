# 🚀 Instalación del Sistema de Gestión de Documentos

Esta guía te ayudará a instalar y configurar tanto el frontend (Vue.js) como el backend (Node.js + MongoDB) del sistema de gestión de documentos.

## 📋 Requisitos Previos

- **Node.js** (versión 16 o superior)
- **MongoDB** (versión 4.4 o superior)
- **npm** o **yarn**
- **Git** (opcional)

## 🛠️ Instalación Paso a Paso

### 1. Configurar el Backend (MongoDB + Node.js)

#### 1.1 Instalar MongoDB

**Windows:**
```bash
# Usando Chocolatey
choco install mongodb

# O descargar desde: https://www.mongodb.com/try/download/community
```

**macOS:**
```bash
# Usando Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Iniciar MongoDB
brew services start mongodb/brew/mongodb-community
```

**Ubuntu/Debian:**
```bash
# Instalar MongoDB
sudo apt-get install mongodb

# Iniciar MongoDB
sudo systemctl start mongod
```

#### 1.2 Configurar el Backend

```bash
# 1. Renombrar el archivo de dependencias del backend
mv package-backend.json package.json

# 2. Instalar dependencias del backend
npm install

# 3. Crear archivo de configuración de entorno
echo "MONGODB_URI=mongodb://localhost:27017/documentos_db
PORT=3001
NODE_ENV=development
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads" > .env

# 4. Crear directorio para archivos subidos
mkdir uploads

# 5. Inicializar la base de datos con datos de ejemplo
npm run seed

# 6. Iniciar el servidor backend
npm run dev
```

El backend estará disponible en: `http://localhost:3001`

### 2. Configurar el Frontend (Vue.js)

#### 2.1 Instalar dependencias del frontend

```bash
# 1. Instalar dependencias (si no están instaladas)
npm install

# 2. Verificar que todas las dependencias estén instaladas
npm list
```

#### 2.2 Configurar el frontend

```bash
# 1. Crear archivo de configuración de entorno
echo "VUE_APP_API_URL=http://localhost:3001/api
VUE_APP_TITLE=Sistema de Gestión de Documentos
VUE_APP_VERSION=1.0.0" > .env.development

# 2. Iniciar el servidor de desarrollo
npm run serve
```

El frontend estará disponible en: `http://localhost:8080`

## 🎯 Verificación de la Instalación

### Verificar Backend

1. **Estado del servidor:**
   ```bash
   curl http://localhost:3001/api/health
   ```
   Debería devolver: `{"success":true,"message":"Servidor funcionando correctamente"}`

2. **Documentos de ejemplo:**
   ```bash
   curl http://localhost:3001/api/documents
   ```
   Debería devolver una lista de documentos JSON.

### Verificar Frontend

1. Abrir `http://localhost:8080` en el navegador
2. Verificar que la página carga correctamente
3. Probar la funcionalidad de búsqueda
4. Probar la subida de documentos

### Verificar Base de Datos

```bash
# Conectar a MongoDB
mongo documentos_db

# Verificar documentos
db.documents.find().pretty()

# Verificar estadísticas
db.documents.countDocuments()
```

## 🔧 Configuración Avanzada

### Variables de Entorno

**Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/documentos_db
PORT=3001
NODE_ENV=development
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

**Frontend (.env.development):**
```env
VUE_APP_API_URL=http://localhost:3001/api
VUE_APP_TITLE=Sistema de Gestión de Documentos
VUE_APP_VERSION=1.0.0
```

### Configuración de MongoDB Atlas (Cloud)

Si prefieres usar MongoDB Atlas en lugar de una instalación local:

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crear un cluster gratuito
3. Obtener la cadena de conexión
4. Actualizar `MONGODB_URI` en el archivo `.env` del backend

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/documentos_db
```

## 🚨 Solución de Problemas

### Error: Puerto en uso

```bash
# Encontrar proceso que usa el puerto 3001
lsof -ti:3001

# Terminar proceso (macOS/Linux)
kill -9 $(lsof -ti:3001)

# En Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Error: MongoDB no conecta

```bash
# Verificar que MongoDB esté ejecutándose
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS

# Reiniciar MongoDB
sudo systemctl restart mongod  # Linux
brew services restart mongodb/brew/mongodb-community  # macOS
```

### Error: Permisos en directorio uploads

```bash
# Dar permisos al directorio
chmod 755 uploads
chown $USER:$USER uploads
```

### Error: Dependencias no instaladas

```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 📊 Estructura del Proyecto

```
proyectoxample/
├── server.js                 # Servidor backend
├── package.json             # Dependencias backend
├── config/
│   └── database.js          # Configuración MongoDB
├── scripts/
│   └── seed.js              # Datos de ejemplo
├── uploads/                 # Archivos subidos
├── src/                     # Código frontend Vue.js
│   ├── components/
│   ├── views/
│   ├── stores/
│   ├── services/
│   └── config/
├── public/
└── README-BACKEND.md        # Documentación backend
```

## 🎉 ¡Listo!

Una vez completada la instalación, tendrás:

- ✅ Backend funcionando en `http://localhost:3001`
- ✅ Frontend funcionando en `http://localhost:8080`
- ✅ Base de datos MongoDB con datos de ejemplo
- ✅ Sistema completo de gestión de documentos

## 🚀 Próximos Pasos

1. **Personalizar la aplicación:**
   - Modificar estilos en `src/assets/`
   - Agregar nuevas funcionalidades
   - Personalizar la interfaz

2. **Despliegue en producción:**
   - Configurar variables de entorno de producción
   - Configurar base de datos de producción
   - Desplegar en servidor (Heroku, Vercel, etc.)

3. **Desarrollo adicional:**
   - Agregar autenticación de usuarios
   - Implementar roles y permisos
   - Agregar notificaciones
   - Optimizar rendimiento

## 📞 Soporte

Si encuentras problemas durante la instalación:

1. Revisar los logs del servidor
2. Verificar la configuración de MongoDB
3. Comprobar las variables de entorno
4. Consultar la documentación de cada tecnología

**¡Disfruta desarrollando con tu nuevo sistema de gestión de documentos! 🎉**
