import { useTask } from "vue-concurrency";
import spotify from "../spotify-web-api";
import { PlaylistItem } from "spotify-web-api-ts/types/types/SpotifyObjects";

const unpaginate = async (currentOffset: number, id: string) => {
  const limit = 100;
  let allItems: PlaylistItem[] = [];
  await spotify.playlists
    .getPlaylistItems(id, {
      market: "from_token",
      fields:
        "items(track(album,artists,explicit,duration_ms,name,id,preview_url)),next,offset",
      limit,
      offset: currentOffset
    })
    .then(({ items, next, offset }) => {
      allItems = allItems.concat(items);
      if (next !== null) {
        return unpaginate(offset + limit, id);
      }
    });
  return allItems;
};

export default function getPlaylistItems() {
  return useTask(function*(signal, token, id) {
    spotify.setAccessToken(token);
    const tracks = yield unpaginate(0, id);
    return tracks.map((track: PlaylistItem) => track.track);
  });
}
