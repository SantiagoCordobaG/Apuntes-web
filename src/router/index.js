/**
 * ============================================
 * CONFIGURACIÓN DE RUTAS (ROUTER)
 * ============================================
 * 
 * Define TODAS las rutas de la aplicación y protege las que requieren autenticación.
 * 
 * RUTAS PÚBLICAS (cualquiera puede acceder):
 * - /login → AuthView (pantalla de login)
 * - /registro → AuthView (pantalla de registro)
 * 
 * RUTAS PROTEGIDAS (requieren estar logueado):
 * - / → MainLayout + HomeView (área principal de la app)
 */

import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import HomeView from "@/views/HomeView.vue";
import AuthView from "@/views/AuthView.vue";
import { useAuthStore } from "@/stores/auth";

// Definir todas las rutas de la aplicación
const routes = [
  // ===== RUTAS PÚBLICAS =====
  // Estas rutas NO requieren autenticación
  {
    path: "/login",
    name: "Login",
    component: AuthView, // Muestra AuthView con tab de login
    meta: { requiresAuth: false } // No requiere autenticación
  },
  {
    path: "/registro",
    name: "Registro",
    component: AuthView, // Muestra AuthView con tab de registro
    meta: { requiresAuth: false } // No requiere autenticación
  },
  
  // ===== RUTAS PROTEGIDAS =====
  // Estas rutas SÍ requieren autenticación
  {
    path: "/",
    component: MainLayout, // Layout con header y footer
    meta: { requiresAuth: true }, // REQUIERE autenticación
    children: [
      {
        path: "", // Ruta vacía = ruta raíz
        name: "Home",
        component: HomeView, // Vista principal (muestra componentes según ?tab=)
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
