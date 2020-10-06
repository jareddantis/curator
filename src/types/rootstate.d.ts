interface CuratorState {
  [key: string]: any;
  accessToken: string;
  codeVerifier: string;
  country: string;
  expiry: number;
  id: string;
  refreshToken: string;
  stateToken: string;
  target: string[];
}
