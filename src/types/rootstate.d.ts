interface CuratorState {
  [key: string]: any;
  accessToken: string;
  codeVerifier: string;
  country: string;
  expiry: number;
  id: string;
  isLoggedIn: boolean;
  refreshToken: string;
  stateToken: string;
}
