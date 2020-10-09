import { useTask } from "vue-concurrency";
import spotify from "../spotify-web-api";
import { uploadArt } from "@/api/helpers";

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
      yield uploadArt(token, id, art);
    }

    return id;
  });
}
