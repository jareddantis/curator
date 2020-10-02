import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
  key: "Curator",
  storage: window.localStorage
});

function getInitialState(): CuratorState {
  return {
    // User auth
    isLoggedIn: false,
    stateToken: "",
    codeVerifier: "",
    accessToken: "",
    refreshToken: "",

    // User info
    country: "",
    id: ""
  };
}

export default createStore({
  state() {
    return getInitialState();
  },
  getters: {
    access: state => state.accessToken,
    refresh: state => state.refreshToken
  },
  mutations: {
    setLogin: (state: CuratorState, payload: boolean) =>
      (state.isLoggedIn = payload),
    reset: (state: CuratorState) => {
      const initialState = getInitialState();
      Object.keys(initialState).forEach(key => {
        state[key] = initialState[key];
      });
    },
    setAccessToken: (state: CuratorState, payload: string) =>
      (state.accessToken = payload),
    setCountry: (state: CuratorState, payload: string) =>
      (state.country = payload),
    setID: (state: CuratorState, payload: string) => (state.id = payload),
    setRefreshToken: (state: CuratorState, payload: string) =>
      (state.refreshToken = payload),
    setStateToken: (state: CuratorState, payload: string) =>
      (state.stateToken = payload),
    setVerifier: (state: CuratorState, payload: string) =>
      (state.codeVerifier = payload)
  },
  plugins: [vuexLocal.plugin]
});
