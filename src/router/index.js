import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import VistaUser from "@/views/VistaUser.vue";
import UploadView from "@/views/UploadView.vue";
import SearchView from "@/views/SearchView.vue";
import PerfilView from "@/views/PerfilView.vue";
import MisDocumentosView from "@/views/MisDocumentosView.vue";
import LoginView from "@/views/LoginView.vue";
import RegistroView from "@/views/RegistroView.vue";
import ContactoView from "@/views/ContactoView.vue";
import TerminosView from "@/views/TerminosView.vue";
import PrivacidadView from "@/views/PrivacidadView.vue";
import { useAuthStore } from "@/stores/auth";

const routes = [
  // Rutas públicas (sin autenticación)
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: "/registro",
    name: "Registro",
    component: RegistroView,
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
        name: "Dashboard",
        component: VistaUser,
      },
      {
        path: "upload",
        name: "Upload",
        component: UploadView,
      },
      {
        path: "search",
        name: "Search",
        component: SearchView,
      },
      {
        path: "perfil",
        name: "Perfil",
        component: PerfilView,
      },
      {
        path: "mis-documentos",
        name: "MisDocumentos",
        component: MisDocumentosView,
      },
      {
        path: "contacto",
        name: "Contacto",
        component: ContactoView,
      },
      {
        path: "terminos",
        name: "Terminos",
        component: TerminosView,
      },
      {
        path: "privacidad",
        name: "Privacidad",
        component: PrivacidadView,
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
      next({ name: "Dashboard" });
      return;
    }
  }

  next();
});

export default router;
