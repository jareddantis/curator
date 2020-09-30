import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue")
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "About" */ "../views/About.vue")
  },
  {
    path: "/create",
    name: "Create playlist",
    component: () =>
      import(
        /* webpackChunkName: "CreatePlaylist" */ "../views/CreatePlaylist.vue"
      )
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
