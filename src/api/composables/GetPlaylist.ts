import { useTask } from "vue-concurrency";
import spotify from "../spotify-web-api";

export default function getPlaylist() {
  return useTask(function*(signal, token, id) {
    spotify.setAccessToken(token);
    return yield spotify.playlists.getPlaylist(id);
  });
}
