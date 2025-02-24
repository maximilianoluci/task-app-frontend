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
      component: () => import("@/modules/auth/views/LogIn.vue"),
    },
    {
      path: "/sign-up",
      name: "sign-up",
      component: () => import("@/modules/auth/views/SignUp.vue"),
    },
    {
      path: "/todo",
      name: "todo",
      component: () => import("@/modules/todo/views/TodoList.vue"),
    },
    {
      path: "/user",
      children: [
        {
          path: "",
          name: "user-list",
          component: () => import("@/modules/user/views/UserList.vue"),
        },
        {
          path: ":id",
          name: "user-page",
          component: () => import("@/modules/user/views/UserPage.vue"),
        },
      ],
    },
  ],
});

export default router;
