import PKCEChallenge from "pkce-challenge";
import Axios from "axios";
// @ts-ignore
import { v4 as uuid } from "uuid";

export function serialize(params: { [key: string]: string }): string {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&");
}

const baseURL = "https://accounts.spotify.com";

export function generatePKCE(): { [key: string]: string } {
  const challenge = PKCEChallenge(128);
  const state = uuid();
  const query = serialize({
    client_id: process.env.VUE_APP_CLIENT_ID,
    response_type: "code",
    redirect_uri: `${process.env.VUE_APP_URL}/callback`,
    code_challenge_method: "S256",
    code_challenge: challenge.code_challenge,
    state: state,
    scope: [
      "playlist-modify-private",
      "playlist-modify-public",
      "playlist-read-collaborative",
      "playlist-read-private",
      "ugc-image-upload",
      "user-read-private"
    ].join(" ")
  });

  return {
    authURL: `${baseURL}/authorize?${query}`,
    codeVerifier: challenge.code_verifier,
    state
  };
}

export async function getRefreshedAccessToken(
  refreshToken: string
): Promise<RefreshedTokenResponse> {
  const query = serialize({
    client_id: process.env.VUE_APP_CLIENT_ID,
    grant_type: "refresh_token",
    refresh_token: refreshToken
  });
  const { access_token, refresh_token, expires_in } = (
    await Axios.post("https://accounts.spotify.com/api/token", query, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  ).data;

  return {
    accessToken: access_token,
    refreshToken: refresh_token,
    expiry: parseInt(expires_in, 10) * 1000 + new Date().getTime()
  };
}
