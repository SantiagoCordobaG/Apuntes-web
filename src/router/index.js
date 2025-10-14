import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import VistaUser from "@/views/VistaUser.vue";
import UploadView from "@/views/UploadView.vue";
import SearchView from "@/views/SearchView.vue";
import PerfilView from "@/views/PerfilView.vue";
import MisDocumentosView from "@/views/MisDocumentosView.vue";
import LoginView from "@/views/LoginView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: MainLayout,
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
        path: "login",
        name: "Login",
        component: LoginView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
