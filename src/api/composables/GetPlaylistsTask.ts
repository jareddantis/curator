import { useTask } from "vue-concurrency";
import spotify from "../spotify-web-api";
import { SimplifiedPlaylist } from "spotify-web-api-ts/types/types/SpotifyObjects";
import { withCommas } from "../helpers";

const unpaginate = async (currentOffset: number, userID: string) => {
  const limit = 50;
  let allItems: SimplifiedPlaylist[] = [];
  await spotify.playlists
    .getMyPlaylists({
      limit,
      offset: currentOffset
    })
    .then(({ items, next, offset }) => {
      allItems = allItems.concat(items.filter(item => item.owner.id == userID));
      if (next !== null) {
        return unpaginate(offset + limit, userID);
      }
    });
  return allItems;
};

export default function getPlaylistsTask() {
  return useTask(function*(signal, token, userID) {
    spotify.setAccessToken(token);
    const items = yield unpaginate(0, userID);
    const tracks = items
      .map((item: SimplifiedPlaylist) => item.tracks.total)
      .reduce((a: number, b: number) => a + b);
    return {
      playlists: items,
      numPlaylists: withCommas(items.length),
      totalTracks: withCommas(tracks)
    };
  }).restartable();
}
