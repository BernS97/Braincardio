import TabsPage from "@/components/Tabs/TabsPage.vue";
import { useUserStore } from "@/plugins/pinia/users";
import CreateEditDeckPage from "@/views/Decks/CreateEditDeckPage.vue";
import DeckDetailPage from "@/views/Decks/DeckDetailPage.vue";
import DecksPage from "@/views/DecksPage.vue";
import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import { createRouter, createWebHistory } from "@ionic/vue-router";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/",
    component: TabsPage,
    redirect: "/home",
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "home",
        name: "Home",
        component: HomePage,
      },
      {
        path: "decks",
        name: "Decks",
        component: DecksPage,
      },
      {
        path: "profile",
        name: "Profile",
        component: ProfilePage,
      },
    ],
  },
  {
    path: "/decks/:id",
    name: "DeckDetailPage",
    props: true,
    component: DeckDetailPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/decks/create",
    name: "CreateDeckPage",
    component: CreateEditDeckPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/decks/edit/:id",
    name: "EditDetailPage",
    props: true,
    component: CreateEditDeckPage,
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
