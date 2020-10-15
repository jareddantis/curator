import { useTask } from "vue-concurrency";
import spotify from "../spotify-web-api";
import { uploadArt } from "@/api/helpers";

export default function editPlaylistDetails() {
  return useTask(function*(signal, token, id, details) {
    const { art, collaborative, description, isPublic, name } = details;
    spotify.setAccessToken(token);
    yield spotify.playlists.changePlaylistDetails(id, {
      collaborative,
      ...(description.length && { description }),
      name,
      public: isPublic
    });

    if (art.length > 0) {
      yield uploadArt(token, id, art);
    }

    return;
  });
}
