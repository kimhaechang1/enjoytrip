import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import SearchView from "../views/SearchView.vue";
import UserLogin from "../components/UserLogin.vue";
import UserRegister from "../components/UserRegister.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/user",
      name: "",
      component: LoginView,
      children: [
        {
          path: "login",
          name: "login",
          component: UserLogin,
          beforeEnter: (to, from) => {
            if (from.name === "login") return false;
          },
        },
        {
          path: "join",
          name: "join",
          component: UserRegister,
        },
      ],
    },
    {
      path: "/search",
      name: "search",
      component: SearchView,
    },
  ],
});

export default router;
