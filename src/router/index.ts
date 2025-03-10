import { useAuthStore } from "@/stores/auth";
import LoggedInTemplate from "@/templates/LoggedInTemplate.vue";
import LoggedOutTemplate from "@/templates/LoggedOutTemplate.vue";
import HomeView from "@/views/HomeView.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: LoggedOutTemplate,
      children: [
        {
          path: "log-in",
          name: "log-in",
          component: () => import("@/modules/auth/views/LogIn.vue"),
        },
        {
          path: "sign-up",
          name: "sign-up",
          component: () => import("@/modules/auth/views/SignUp.vue"),
        },
      ],
    },
    {
      path: "/",
      component: LoggedInTemplate,
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,
        },
        {
          path: "list",
          children: [
            {
              path: ":userId",
              name: "list-list",
              component: () => import("@/modules/list/views/ListList.vue"),
            },
            {
              path: ":id",
              name: "list-page",
              component: () => import("@/modules/list/views/ListPage.vue"),
            },
          ],
        },
        {
          path: "todo",
          children: [
            {
              path: ":id",
              name: "todo-page",
              component: () => import("@/modules/todo/views/TodoPage.vue"),
            },
          ],
        },
        {
          path: "user",
          children: [
            {
              path: ":id",
              name: "user-page",
              component: () => import("@/modules/user/views/UserPage.vue"),
            },
            {
              path: ":id/change-password",
              name: "change-password",
              component: () => import("@/modules/user/views/ChangePassword.vue"),
            },
          ],
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.checkAuth();
  const publicPages = ["log-in", "sign-up"];
  const requiresAuth = !publicPages.includes(to.name as string);
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: "log-in" });
  } else if (authStore.isAuthenticated && publicPages.includes(to.name as string)) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
