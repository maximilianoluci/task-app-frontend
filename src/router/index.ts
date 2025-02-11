import HomeView from "@/views/HomeView.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/log-in",
      name: "log-in",
      component: () => import("@/modules/user/views/LogIn.vue"),
    },
    {
      path: "/sign-up",
      name: "sign-up",
      component: () => import("@/modules/user/views/SignUp.vue"),
    },
  ],
});

export default router;
