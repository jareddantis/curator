import { refreshAccessToken } from "@/api/spotify-auth";
import { inject } from "vue";
import Axios from "axios";
import store from "../store";
import { SpotifyWebApi } from "spotify-web-api-ts";

export default function setup() {
  // Auto refresh OAuth2 tokens
  // https://thedutchlab.com/blog/using-axios-interceptors-for-refreshing-your-api-token
  Axios.interceptors.response.use(
    response => {
      return response;
    },
    async function(error) {
      const originalRequest = error.config;
      if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        const { access_token, refresh_token } = (
          await refreshAccessToken(store.getters.refresh)
        ).data;
        const spotify: SpotifyWebApi | undefined = inject("spotify");
        console.log(spotify);
        spotify?.setAccessToken(access_token);
        store.commit("setAccessToken", access_token);
        store.commit("setRefreshToken", refresh_token);
        return Axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );
}
