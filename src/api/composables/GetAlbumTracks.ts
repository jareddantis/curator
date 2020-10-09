import { useTask } from "vue-concurrency";
import spotify from "../spotify-web-api";
import { SimplifiedTrack } from "spotify-web-api-ts/types/types/SpotifyObjects";

const unpaginate = async (currentOffset: number, id: string) => {
  const limit = 50;
  let allItems: SimplifiedTrack[] = [];
  await spotify.albums
    .getAlbumTracks(id, {
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

export default function getAlbumTracks() {
  return useTask(function*(signal, token, id) {
    spotify.setAccessToken(token);
    return yield unpaginate(0, id);
  });
}
