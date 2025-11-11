import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import HomeView from "@/views/HomeView.vue";
import AuthView from "@/views/AuthView.vue";
import { useAuthStore } from "@/stores/auth";

const routes = [
  // Rutas públicas (sin autenticación)
  {
    path: "/login",
    name: "Login",
    component: AuthView,
    meta: { requiresAuth: false }
  },
  {
    path: "/registro",
    name: "Registro",
    component: AuthView,
    meta: { requiresAuth: false }
  },
  // Rutas protegidas (requieren autenticación)
  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Home",
        component: HomeView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard: proteger rutas que requieren autenticación
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    // Si no hay token, redirigir al login
    if (!authStore.token) {
      next({ name: "Login", query: { redirect: to.fullPath } });
      return;
    }

    // Si hay token pero no hay usuario, intentar obtenerlo
    if (!authStore.usuario && authStore.token) {
      try {
        await authStore.getUsuarioActual();
        // Si no se pudo obtener el usuario (token inválido), redirigir al login
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
  } else {
    // Si el usuario ya está autenticado y trata de ir a login/registro, redirigir al home
    if ((to.name === "Login" || to.name === "Registro") && authStore.isAuthenticated) {
      next({ name: "Home" });
      return;
    }
  }

  next();
});

export default router;
