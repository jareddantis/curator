import { timeout, useTask } from "vue-concurrency";
import spotify from "../spotify-web-api";

export default function search() {
  return useTask(function*(signal, token, query) {
    yield timeout(500);
    spotify.setAccessToken(token);
    const { artists, albums, tracks } = yield spotify.search.search(
      query,
      ["artist", "album", "track"],
      {
        market: "from_token",
        limit: 10
      }
    );
    return {
      artists: artists.items,
      albums: albums.items,
      tracks: tracks.items
    };
  }).restartable();
}
