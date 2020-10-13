import { useTask } from "vue-concurrency";
import spotify from "../spotify-web-api";

export default function getTrack() {
  return useTask(function*(signal, token, id) {
    spotify.setAccessToken(token);
    return yield spotify.tracks.getTrack(id, { market: "from_token" });
  });
}
