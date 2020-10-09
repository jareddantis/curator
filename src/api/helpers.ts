import Axios from "axios";

export function withCommas(n: number) {
  // Comma delimited digits https://stackoverflow.com/a/2901298
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export async function uploadArt(token: string, id: string, art: string) {
  return Axios.put(
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
