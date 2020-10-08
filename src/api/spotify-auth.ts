import Axios from "axios";

/*
  PKCE (Proof Key Code Exchange) helper functions
  https://github.com/aaronpk/pkce-vanilla-js/blob/master/index.html
 */

// Generate a secure random string using the browser crypto functions
function generateRandomString(): string {
  const array = new Uint32Array(28);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ("0" + dec.toString(16)).substr(-2)).join("");
}

// Calculate the SHA256 hash of the input text.
function sha256(plain: string): PromiseLike<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

// Base64- then URL-encode a string.
function base64encode(str: ArrayBuffer) {
  let parsed = "";
  new Uint8Array(str).forEach(byte => {
    parsed += String.fromCharCode(byte);
  });
  return btoa(parsed)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Return the base64-urlencoded sha256 hash for the PKCE challenge
async function pkceChallengeFromVerifier(v: string) {
  return base64encode(await sha256(v));
}

export function serialize(params: { [key: string]: string }): string {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&");
}

export async function generatePKCE(): Promise<{ [key: string]: string }> {
  const verifier = generateRandomString();
  const challenge = await pkceChallengeFromVerifier(verifier);
  const state = generateRandomString();
  const query = serialize({
    client_id: process.env.VUE_APP_CLIENT_ID,
    response_type: "code",
    redirect_uri: `${process.env.VUE_APP_URL}/callback`,
    code_challenge_method: "S256",
    code_challenge: challenge,
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
    authURL: `https://accounts.spotify.com/authorize?${query}`,
    codeVerifier: verifier,
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

export async function getUserInfo(
  accessToken: string
): Promise<UserInfoResponse> {
  const { country, id } = (
    await Axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  ).data;
  return {
    country,
    id
  };
}
