import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue")
  },
  {
    path: "/callback",
    name: "Callback",
    component: () =>
      import(/* webpackChunkName: "Callback" */ "../views/Callback.vue")
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
  },
  {
    path: "/add",
    name: "Add tracks",
    component: () =>
      import(/* webpackChunkName: "AddTracks" */ "../views/AddTracks.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
