# Estructura del Proyecto - Repositorio de Apuntes

## 📁 Estructura General

```
Apuntes-web/
├── backend/                 # Servidor backend (Node.js/Express)
├── public/                  # Archivos estáticos públicos
├── src/                     # Código fuente del frontend
│   ├── assets/             # Recursos estáticos (vacía - no se usan recursos locales)
│   ├── components/         # Componentes Vue reutilizables (11 componentes)
│   ├── config/             # Configuración (api.js - endpoints centralizados)
│   ├── layouts/            # Layouts de la aplicación (1 layout)
│   ├── router/             # Configuración de rutas
│   ├── services/           # Servicios para llamadas a API (3 servicios)
│   ├── stores/             # Stores de Pinia (gestión de estado) (2 stores)
│   ├── utils/              # Utilidades (axios.js - cliente HTTP configurado)
│   ├── views/              # Vistas principales de la aplicación (2 vistas)
│   ├── App.vue             # Componente raíz de la aplicación
│   └── main.js             # Punto de entrada de la aplicación
├── babel.config.js         # Configuración de Babel
├── jsconfig.json           # Configuración de JavaScript/TypeScript
├── package.json            # Dependencias del proyecto
├── vue.config.js           # Configuración de Vue CLI
├── ESTRUCTURA.md           # Documentación de la estructura (este archivo)
└── README.md               # Documentación básica del proyecto
```

---

## 🎯 Arquitectura del Frontend

### **Estructura: 1 Layout, 2 Vistas, 11 Componentes**

La aplicación sigue una arquitectura modular y organizada:

#### **1 Layout (Layout Principal)**
- **`src/layouts/MainLayout.vue`**
  - Layout principal de la aplicación
  - Contiene el header con navegación y menú de usuario
  - Incluye el footer con enlaces legales
  - Gestiona la autenticación y navegación general
  - **Navegación principal:** Documentos, Subir
  - **Menú de usuario:** Perfil, Mis Documentos, Cerrar Sesión
  - **Footer:** Términos de Uso, Política de Privacidad, Contacto

#### **2 Vistas (Vistas Principales)**
- **`src/views/HomeView.vue`**
  - Vista principal para usuarios autenticados
  - Gestiona la navegación por tabs usando query parameters
  - Renderiza dinámicamente diferentes componentes según el tab activo
  - Tabs disponibles: `documents`, `upload`, `profile`, `mydocuments`, `contact`, `terms`, `privacy`
  - Redirige automáticamente `search` a `documents`

- **`src/views/AuthView.vue`**
  - Vista de autenticación (login/registro)
  - Contiene tabs para alternar entre login y registro
  - Gestiona la navegación entre formularios de autenticación
  - Diseño centrado con fondo degradado

#### **11 Componentes (Componentes Funcionales)**

##### **Componentes de Autenticación:**
1. **`src/components/LoginSection.vue`**
   - Formulario de inicio de sesión
   - Valida credenciales y gestiona autenticación
   - Emite eventos para cambiar de tab

2. **`src/components/RegisterSection.vue`**
   - Formulario de registro de nuevos usuarios
   - Campos: nombre, correo, contraseña, rol, carrera, universidad
   - Valida y registra nuevos usuarios

##### **Componentes de Documentos:**
3. **`src/components/DocumentosList.vue`**
   - Lista principal de documentos disponibles
   - Incluye búsqueda y filtros avanzados
   - Muestra grid de documentos con cards
   - Funcionalidades: búsqueda, filtrado, ordenamiento, descarga, valoración
   - Integra `RatingDialog` para valoraciones

4. **`src/components/UploadSection.vue`**
   - Formulario para subir nuevos documentos
   - Campos: título, descripción, autor, etiquetas, visibilidad
   - Validación de archivos (PDF, DOC, DOCX, máximo 10MB)
   - Generación automática de etiquetas
   - Emite evento cuando se sube un documento exitosamente

5. **`src/components/MyDocumentsSection.vue`**
   - Lista de documentos del usuario actual
   - Muestra solo los documentos subidos por el usuario autenticado
   - Permite descargar y eliminar documentos propios
   - Estado vacío cuando no hay documentos

6. **`src/components/RatingDialog.vue`**
   - Dialog modal para valorar documentos
   - Permite ver y modificar valoraciones
   - Muestra valoración actual del usuario
   - Sistema de estrellas para calificación (1-5)

##### **Componentes de Usuario:**
7. **`src/components/ProfileSection.vue`**
   - Perfil del usuario autenticado
   - Muestra y permite editar información del usuario
   - Campos: nombre, correo, rol, carrera, universidad
   - Actualiza información mediante servicio de usuarios

##### **Componentes Legales/Informativos:**
8. **`src/components/ContactSection.vue`**
   - Sección de contacto
   - Información de contacto y formulario (si aplica)

9. **`src/components/TermsSection.vue`**
   - Términos de uso completos
   - 10 secciones detalladas sobre uso del servicio
   - Fecha de última actualización dinámica
   - Diseño legible y estructurado

10. **`src/components/PrivacySection.vue`**
    - Política de privacidad completa
    - 12 secciones sobre manejo de datos personales
    - Información sobre recopilación, uso y protección de datos
    - Fecha de última actualización dinámica

---

## 🔄 Flujo de Navegación

### **Rutas Públicas (Sin Autenticación):**
- `/login` → `AuthView` (tab: login)
- `/registro` → `AuthView` (tab: register)

### **Rutas Protegidas (Con Autenticación):**
- `/` → `HomeView` con `MainLayout`
  - `/?tab=documents` → `DocumentosList` (por defecto)
  - `/?tab=upload` → `UploadSection`
  - `/?tab=profile` → `ProfileSection`
  - `/?tab=mydocuments` → `MyDocumentsSection`
  - `/?tab=contact` → `ContactSection`
  - `/?tab=terms` → `TermsSection`
  - `/?tab=privacy` → `PrivacySection`

### **Guards de Navegación:**
- Las rutas protegidas requieren autenticación
- Redirección automática a `/login` si no hay token
- Redirección a `/` si el usuario autenticado intenta acceder a login/registro

---

## 🗄️ Gestión de Estado (Pinia Stores)

### **`src/stores/auth.js`**
- **Estado:**
  - `usuario`: Información del usuario autenticado
  - `token`: Token de autenticación JWT
  - `isAuthenticated`: Estado de autenticación

- **Acciones:**
  - `initAuth()`: Inicializa autenticación al cargar la app
  - `login(correo, password)`: Inicia sesión
  - `registro(usuarioData)`: Registra nuevo usuario
  - `logout()`: Cierra sesión
  - `getUsuarioActual()`: Obtiene información del usuario actual

### **`src/stores/documents.js`**
- **Estado:**
  - `documents`: Lista de documentos (cargados desde el backend)
  - `searchQuery`: Texto de búsqueda
  - `selectedTags`: Etiquetas seleccionadas para filtrar
  - `sortBy`: Campo de ordenamiento
  - `sortOrder`: Orden (asc/desc)
  - `fileTypeFilter`: Filtro por tipo de archivo

- **Getters:**
  - `filteredDocuments`: Documentos filtrados y ordenados
  - `allTags`: Todas las etiquetas disponibles
  - `statistics`: Estadísticas de documentos

- **Acciones:**
  - `setDocuments(docs)`: Establece la lista de documentos
  - `addDocument(document)`: Agrega un documento
  - `updateDocumentRating(id, rating)`: Actualiza valoración
  - `incrementDownloadCount(id)`: Incrementa contador de descargas
  - `generateAutoTags(fileName, title, description)`: Genera etiquetas automáticas

---

## 🔌 Servicios (API Calls)

### **`src/services/documentService.js`**
- `obtenerDocumentos()`: Obtiene todos los documentos
- `obtenerDocumentoPorId(id)`: Obtiene un documento específico
- `subirDocumento(formData)`: Sube un nuevo documento
- `descargarDocumento(id)`: Descarga un documento
- `valorarDocumento(id, rating, comentario)`: Valora un documento
- `obtenerMiValoracion(id)`: Obtiene la valoración del usuario actual
- `eliminarDocumento(id)`: Elimina un documento

### **`src/services/usuarioService.js`**
- `obtenerUsuario(id)`: Obtiene un usuario por ID
- `obtenerUsuarios()`: Obtiene lista de usuarios
- `crearUsuario(usuario)`: Crea un nuevo usuario
- `actualizarUsuario(id, usuario)`: Actualiza información de usuario
- `eliminarUsuario(id)`: Elimina un usuario

### **`src/services/autoTaggingService.js`**
- `generarEtiquetasAutomaticas({ fileName, title, description })`: Genera etiquetas automáticas basadas en el contenido
- Analiza áreas de conocimiento, tipos de documento y niveles académicos
- Detecta idioma y material de estudio

## 🛠️ Utilidades y Configuración

### **`src/utils/axios.js`**
- Cliente HTTP configurado con interceptores
- Agrega token JWT automáticamente a las peticiones
- Manejo global de errores con mensajes al usuario
- Redirección automática a login si el token expira

### **`src/config/api.js`**
- Configuración centralizada de endpoints
- URL base de la API desde variables de entorno
- Todos los endpoints organizados por categoría (AUTH, DOCUMENTOS, USUARIOS)

---

## 🎨 Estilos y Diseño

### **Framework UI:**
- **Element Plus**: Componentes UI principales
- **Element Plus Icons**: Iconos de la aplicación

### **Características de Diseño:**
- Diseño responsive (mobile-first)
- Animaciones suaves y transiciones
- Tema claro con colores modernos
- Cards con sombras y efectos hover
- Navegación intuitiva y clara

### **Colores Principales:**
- Fondo: `#fafafa`
- Texto principal: `#1a1a1a`
- Texto secundario: `#666666`
- Acentos: `#1a1a1a` (negro)
- Bordes: `rgba(0, 0, 0, 0.06)`

---

## 🔐 Autenticación

### **Flujo de Autenticación:**
1. Usuario ingresa credenciales en `LoginSection`
2. Se envía petición a `/api/auth/login`
3. Se recibe token JWT y datos del usuario
4. Token y usuario se almacenan en localStorage
5. Estado de Pinia se actualiza
6. Usuario es redirigido a la vista principal

### **Protección de Rutas:**
- Navigation guard en `router/index.js`
- Verifica token antes de acceder a rutas protegidas
- Valida usuario actual si hay token pero no usuario en estado
- Redirige a login si la autenticación falla

---

## 📦 Dependencias Principales

### **Producción:**
- `vue`: ^3.2.13 - Framework principal
- `vue-router`: ^4.5.0 - Enrutamiento
- `pinia`: ^3.0.3 - Gestión de estado
- `element-plus`: ^2.11.4 - Componentes UI
- `@element-plus/icons-vue`: ^2.3.2 - Iconos

### **Desarrollo:**
- `@vue/cli-service`: ~5.0.0 - Servidor de desarrollo
- `@vue/cli-plugin-babel`: ~5.0.0 - Transpilación Babel
- `@vue/cli-plugin-eslint`: ~5.0.0 - Linter ESLint
- `eslint`: ^7.32.0 - Linting
- `eslint-plugin-vue`: ^8.0.3 - Reglas Vue para ESLint

---

## 🚀 Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run serve

# Compilar para producción
npm run build

# Linter y corrección
npm run lint
```

---

## 📝 Notas Importantes

### **Archivos y Carpetas Eliminados (No Usados):**
- ✅ `src/components/SearchSection.vue` - Funcionalidad integrada en DocumentosList
- ✅ `src/assets/logo.png` - No se estaba utilizando
- ✅ `src/services/documentServices.js` - No se estaba utilizando
- ✅ `src/composables/` - Carpeta vacía eliminada (no se estaban usando composables personalizados)

### **Nota sobre `src/assets/`:**
- **Estado actual:** Carpeta vacía
- **Uso actual:** No se utilizan recursos estáticos locales (imágenes, fuentes, etc.)
- **Recomendación:** Se puede mantener vacía por convención de Vue, o eliminar si no se planea usar
- **Alternativa:** Si se necesita agregar un logo o imágenes, esta es la carpeta adecuada

### **Estructura de Tabs:**
- La aplicación usa query parameters (`?tab=nombre`) para navegación
- `HomeView` renderiza componentes dinámicamente según el tab
- Redirección automática de `search` a `documents`

### **Backend:**
- API backend en `backend/` (Node.js/Express)
- Endpoints principales:
  - `/api/auth/*` - Autenticación
  - `/api/Documentos/*` - Gestión de documentos
  - `/api/usuarios/*` - Gestión de usuarios
- Puerto: `3000`

---

## 🔄 Flujo de Datos

1. **Usuario interactúa** con un componente
2. **Componente** llama a un servicio (`documentService.js`, `usuarioService.js`)
3. **Servicio** usa `apiClient` (axios configurado) que agrega token automáticamente
4. **Backend** procesa la solicitud y devuelve respuesta
5. **Interceptor de axios** maneja errores globalmente
6. **Servicio** devuelve datos al componente
7. **Componente** actualiza estado local o store de Pinia
8. **UI se re-renderiza** automáticamente (reactividad de Vue)

---

## 📚 Convenciones de Código

### **Nomenclatura:**
- Componentes: PascalCase (`DocumentosList.vue`)
- Stores: camelCase (`auth.js`, `documents.js`)
- Servicios: camelCase (`usuarioService.js`)
- Vistas: PascalCase (`HomeView.vue`, `AuthView.vue`)

### **Estructura de Componentes:**
```vue
<template>
  <!-- HTML -->
</template>

<script setup>
  // Lógica
</script>

<style scoped>
  /* Estilos */
</style>
```

### **Imports:**
- Rutas absolutas usando `@/` (alias configurado en `jsconfig.json`)
- Imports de componentes relativos cuando sea necesario

---

## 🎯 Funcionalidades Principales

1. **Autenticación:** Login y registro de usuarios
2. **Gestión de Documentos:** Subir, listar, buscar, filtrar, descargar
3. **Valoraciones:** Sistema de calificación por estrellas
4. **Perfil de Usuario:** Ver y editar información personal
5. **Mis Documentos:** Gestión de documentos propios
6. **Búsqueda Avanzada:** Filtros por tipo, fecha, autor, etiquetas, etc.
7. **Información Legal:** Términos de uso y política de privacidad

---

## 🔧 Configuración

### **`vue.config.js`:**
- Proxy configurado para `/api` → `http://localhost:3000`
- Transpilación de dependencias habilitada
- Feature flags de Vue 3 configurados (DefinePlugin)

### **`jsconfig.json`:**
- Alias `@/*` → `src/*`
- Configuración de módulos ES
- Paths para resolución de imports

### **`babel.config.js`:**
- Configuración estándar de Babel para Vue CLI

---

## 📞 Contacto y Soporte

Para preguntas o problemas, consultar la sección de Contacto en la aplicación o revisar la documentación del proyecto.

---

**Última actualización:** Enero 2025
**Versión:** 0.2.0

### **Mejoras Recientes:**
- ✅ Servicios centralizados para documentos y usuarios
- ✅ Configuración centralizada de API y endpoints
- ✅ Axios con interceptores para manejo automático de tokens y errores
- ✅ Etiquetado automático de documentos (frontend y backend)
- ✅ Código simplificado y optimizado (menos líneas, misma funcionalidad)
- ✅ Documentación mejorada y actualizada

