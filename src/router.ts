import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { pinia } from "./stores";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/signin",
      component: () => import("@/layouts/AuthLayout.vue"),
      meta: {
        requiresNoAuth: true,
      },
      children: [
        {
          path: "/signin",
          name: "signIn",
          component: () => import("@/views/auth/SignIn.vue"),
        },
        {
          path: "/signup",
          name: "signUp",
          component: () => import("@/views/auth/SignUp.vue"),
        },
        {
          path: "/forgotpassword",
          name: "forgotPassword",
          component: () => import("@/views/auth/ForgotPassword.vue"),
        },
      ],
    },
    {
      path: "/resetpassword",
      component: () => import("@/layouts/AuthLayout.vue"),
      children: [
        {
          path: "/resetpassword",
          name: "resetPassword",
          component: () => import("@/views/auth/ResetPassword.vue"),
          beforeEnter: async (to) => {
            if (!to.hash.includes("type=recovery")) {
              const { supabase } = useAuthStore();
              const { data } = await supabase.auth.getUser();
              return data.user ? "/" : "/signin";
            }
          },
        },
        {
          path: "/callback",
          name: "callback",
          component: () => import("@/views/auth/AuthCallback.vue"),
          beforeEnter: (to) => {
            const hashDictionary = {} as any;
            const hash = to.hash.replace("#", "");
            hash.split("&").forEach((item) => {
              const [key, value] = item.split("=");
              hashDictionary[key] = value;
            });

            const requiredKeys = [
              "access_token",
              "expires_in",
              "provider_token",
              "refresh_token",
              "token_type",
            ];

            if (requiredKeys.some((key) => !(key in hashDictionary))) {
              return "/";
            }
          },
        },
        {
          path: "/:pathMatch(.*)*",
          name: "NotFound",
          component: () => import("@/views/NotFound.vue"),
        },
      ],
    },
    {
      path: "/",
      component: () => import("@/layouts/DashboardLayout.vue"),
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "/",
          name: "home",
          component: () => import("@/views/HomeView.vue"),
        },
        {
          path: "/profile",
          name: "profile",
          component: () => import("@/views/ProfileView.vue"),
        },
        {
          path: "/services/:id",
          name: "ServiceDetail",
          component: () => import("@/views/ServiceDetail.vue"),
        },
        {
          path: "/customers/:id",
          name: "CustomerDetail",
          component: () => import("@/views/CustomerDetail.vue"),
        },
        {
          path: "/services/new",
          name: "ServiceCreate",
          component: () => import("@/views/ServiceCreate.vue"),
        },
        {
          path: "/customers/new",
          name: "CustomerCreate",
          component: () => import("@/views/CustomerCreate.vue"),
        },
      ],
    },
  ],
});

/* ✅ Listen for auth state changes */
const { supabase } = useAuthStore(pinia);
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth event:", event);

  if (event === "SIGNED_OUT") {
    router.push("/signin"); // ← don't return
  }

  if (event === "SIGNED_IN") {
    const routeName = router.currentRoute.value.name;

    if (routeName === "callback") {
      setTimeout(() => {
        router.push({ name: "home" }); // ← don't return
      }, 0);
    }
  }
});


/* ✅ Async navigation guards to handle getUser */
router.beforeEach(async (to) => {
  const { supabase } = useAuthStore();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (to.meta.requiresAuth && !user) {
    return { path: "/signin" };
  }
  if (to.meta.requiresNoAuth && user) {
    return { path: "/" };
  }
});

export default router;
