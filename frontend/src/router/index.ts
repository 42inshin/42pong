import { createRouter, createWebHistory } from "vue-router";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
      children: [
        {
          path: "/",
          name: "main",
          component: () => import("@/components/game/GameMain.vue"),
        },
        {
          path: "/info",
          name: "info",
          component: () => import("@/views/InfoView.vue"),
        },
        {
          path: "/rank",
          name: "rank",
          component: () => import("@/views/RankingView.vue"),
        },
        {
          path: "/battle",
          name: "battle",
          component: () => import("@/views/BattleView.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/auth",
      name: "auth",
      component: () => import("@/views/AuthView.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("@/views/SignUpView.vue"),
    },
    {
      path: "/twoFactor",
      name: "twoFactor",
      component: () => import("@/views/TwoFactorView.vue"),
    },
  ],
});

router.beforeEach(async (to, from) => {
  if (to.name !== "login") {
    if (
      cookies.get("jwt") == null &&
      to.name != "auth" &&
      to.name != "twoFactor"
    ) {
      return { name: "login" };
    }
  }
});

export default router;
