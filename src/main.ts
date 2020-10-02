import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import interceptorSetup from "./api/interceptors";
import { SpotifyWebApi } from "spotify-web-api-ts";

interceptorSetup();

createApp(App)
  .use(store)
  .use(router)
  .provide("spotify", new SpotifyWebApi())
  .mount("#app");
