import { useTask } from "vue-concurrency";
import spotify from "../spotify-web-api";
import Axios from "axios";

export default function createPlaylist() {
  return useTask(function*(signal, userID, token, playlistData) {
    spotify.setAccessToken(token);
    const { name, collaborative, isPublic, description, art } = playlistData;
    const { id } = yield spotify.playlists.createPlaylist(userID, name, {
      collaborative,
      public: isPublic,
      description
    });

    if (art.length > 0) {
      yield Axios.put(
        `https://api.spotify.com/v1/playlists/${id}/images`,
        art.split(",")[1],
        {
          headers: {
            "Content-Type": "image/jpeg",
            Authorization: `Bearer ${token}`
          }
        }
      );
    }

    return id;
  });
}
