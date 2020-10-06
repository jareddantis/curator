import { timeout, useTask } from "vue-concurrency";
import spotify from "../spotify-web-api";

export default function search() {
  return useTask(function*(signal, token, query) {
    yield timeout(500);
    spotify.setAccessToken(token);
    const { albums, tracks } = yield spotify.search.search(
      query,
      ["album", "track"],
      {
        market: "from_token",
        limit: 10
      }
    );
    return {
      albums: albums.items,
      tracks: tracks.items
    };
  }).restartable();
}
