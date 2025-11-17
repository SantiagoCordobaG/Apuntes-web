/**
 * ============================================
 * CONFIGURACIÓN DE RUTAS (ROUTER)
 * ============================================
 * 
 * DESCRIPCIÓN:
 * Define todas las rutas de la aplicación y protege las que requieren autenticación.
 * Gestiona la navegación entre diferentes vistas y verifica permisos de acceso.
 * 
 * QUÉ HACE:
 * - Define las rutas públicas (login, registro) y protegidas (área principal)
 * - Verifica si el usuario está autenticado antes de permitir acceso a rutas protegidas
 * - Redirige a login si el usuario intenta acceder a rutas protegidas sin estar autenticado
 * - Redirige a home si un usuario autenticado intenta acceder a login/registro
 * 
 * RUTAS PÚBLICAS (cualquiera puede acceder):
 * - /login → VistaAutenticacion (pantalla de login)
 * - /registro → VistaAutenticacion (pantalla de registro)
 * 
 * RUTAS PROTEGIDAS (requieren estar logueado):
 * - / → LayoutPrincipal + VistaInicio (área principal de la app)
 */

import { createRouter, createWebHistory } from "vue-router";
import LayoutPrincipal from "@/layouts/LayoutPrincipal.vue";
import VistaInicio from "@/views/VistaInicio.vue";
import VistaAutenticacion from "@/views/VistaAutenticacion.vue";
import { useAuthStore } from "@/stores/autenticacion";

// Definir todas las rutas de la aplicación
const routes = [
  // ===== RUTAS PÚBLICAS =====
  // Estas rutas NO requieren autenticación
  {
    path: "/login",
    name: "Login",
    component: VistaAutenticacion, // Muestra VistaAutenticacion con tab de login
    meta: { requiresAuth: false } // No requiere autenticación
  },
  {
    path: "/registro",
    name: "Registro",
    component: VistaAutenticacion, // Muestra VistaAutenticacion con tab de registro
    meta: { requiresAuth: false } // No requiere autenticación
  },
  
  // ===== RUTAS PROTEGIDAS =====
  // Estas rutas SÍ requieren autenticación
  {
    path: "/",
    component: LayoutPrincipal, // Layout con header y footer
    meta: { requiresAuth: true }, // REQUIERE autenticación
    children: [
      {
        path: "", // Ruta vacía = ruta raíz
        name: "Home",
        component: VistaInicio, // Vista principal (muestra componentes según ?tab=)
      },
    ],
  },
];

// Crear el router con historial HTML5 (URLs limpias sin #)
const router = createRouter({
  history: createWebHistory(), // Usa history mode (sin # en la URL)
  routes,
});

/**
 * ============================================
 * GUARD DE NAVEGACIÓN
 * ============================================
 * 
 * Se ejecuta ANTES de cada cambio de ruta.
 * Verifica si el usuario puede acceder a la ruta solicitada.
 */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // ===== CASO 1: La ruta REQUIERE autenticación =====
  if (to.meta.requiresAuth) {
    // Si NO hay token → redirigir a login
    if (!authStore.token) {
      next({ name: "Login", query: { redirect: to.fullPath } });
      return;
    }

    // Si hay token pero NO hay datos del usuario → intentar obtenerlos
    if (!authStore.usuario && authStore.token) {
      try {
        await authStore.getUsuarioActual(); // Pide datos al backend
        
        // Si no se pudo obtener (token inválido) → redirigir a login
        if (!authStore.usuario) {
          next({ name: "Login", query: { redirect: to.fullPath } });
          return;
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        next({ name: "Login", query: { redirect: to.fullPath } });
        return;
      }
    }
  } 
  // ===== CASO 2: La ruta NO requiere autenticación (login/registro) =====
  else {
    // Si el usuario YA está logueado y trata de ir a login/registro
    // → redirigir a home (no tiene sentido que un usuario logueado vea login)
    if ((to.name === "Login" || to.name === "Registro") && authStore.isAuthenticated) {
      next({ name: "Home" });
      return;
    }
  }

  // Si todo está bien → permitir la navegación
  next();
});

export default router;
