interface RefreshedTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiry: number;
}

interface UserInfoResponse {
  country: string;
  id: string;
}
