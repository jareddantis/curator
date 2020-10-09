import {
  SimplifiedAlbum,
  SimplifiedTrack
} from "spotify-web-api-ts/types/types/SpotifyObjects";

interface AugmentedTrack extends SimplifiedTrack {
  album: SimplifiedAlbum;
  available_markets?: string[];
  preview_url: string | null;
}
