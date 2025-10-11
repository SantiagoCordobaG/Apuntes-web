import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import VistaUser from "@/views/VistaUser.vue";
import UploadView from "@/views/UploadView.vue";
import SearchView from "@/views/SearchView.vue";

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
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
