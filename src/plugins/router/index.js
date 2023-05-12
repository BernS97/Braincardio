import { useUserStore } from "@/plugins/pinia/users";
import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import { createRouter, createWebHistory } from "@ionic/vue-router";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
    meta: {
      requiresAuth: true,
    },
  },
];

export default function (pinia) {
  const userStore = useUserStore(pinia);
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  });

  router.beforeEach(async (to) => {
    // routes with `meta: { requiresAuth: true }` will check for the users, others won't
    //TODO: Add Logic
    if (to.meta.requiresAuth) {
      let currentUser = userStore.getUser;
      if (!currentUser.loggedIn) currentUser = await userStore.fetchUser();
      // if the user is not logged in, redirect to the login page
      if (!currentUser.loggedIn) router.push("/login");
    }
  });

  return router;
}
