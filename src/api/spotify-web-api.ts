import { SpotifyWebApi } from "spotify-web-api-ts";

export default new SpotifyWebApi({
  clientId: process.env.VUE_APP_CLIENT_ID
});
