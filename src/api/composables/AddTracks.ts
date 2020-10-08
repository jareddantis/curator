import { useTask } from "vue-concurrency";
import spotify from "../spotify-web-api";
import { SimplifiedTrack } from "spotify-web-api-ts/types/types/SpotifyObjects";

export default function addTracks() {
  return useTask(function*(signal, token, target, tracks) {
    spotify.setAccessToken(token);
    const uris = tracks.map((track: SimplifiedTrack) => track.uri);
    let snapshot;

    while (uris.length) {
      const { snapshot_id } = yield spotify.playlists.addItemsToPlaylist(
        target,
        uris.splice(0, 100)
      );
      snapshot = snapshot_id;
    }

    return snapshot;
  });
}
