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
    path: "/create",
    name: "Create playlist",
    component: () =>
      import(
        /* webpackChunkName: "CreatePlaylist" */ "../views/CreatePlaylist.vue"
      )
  },
  {
    path: "/add-tracks",
    name: "Add tracks",
    component: () =>
      import(/* webpackChunkName: "AddTracks" */ "../views/AddTracks.vue")
  },
  {
    path: "/edit",
    name: "Edit playlist details",
    component: () =>
      import(
        /* webpackChunkName: "EditPlaylistDetails" */ "../views/EditPlaylistDetails.vue"
      )
  },
  {
    path: "/randomize",
    name: "Randomize playlist",
    component: () =>
      import(/* webpackChunkName: "Randomize" */ "../views/Randomize.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ top: 0, behavior: "smooth" });
      });
    });
  }
});

export default router;
