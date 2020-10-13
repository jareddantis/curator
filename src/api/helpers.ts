import Axios from "axios";

export function formatDuration(inMs: number) {
  const secs = Math.ceil(inMs / 1000);
  let secRemainder: number | string = secs % 60;
  if (secRemainder < 10) {
    secRemainder = `0${secRemainder}`;
  }
  return `${Math.floor(secs / 60)}:${secRemainder}`;
}

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
