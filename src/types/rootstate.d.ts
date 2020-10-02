interface CuratorState {
  [key: string]: string | boolean;
  accessToken: string;
  codeVerifier: string;
  country: string;
  id: string;
  isLoggedIn: boolean;
  refreshToken: string;
  stateToken: string;
}
