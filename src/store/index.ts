import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import { getRefreshedAccessToken } from "@/api/spotify-auth";

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
    expiry: 0,

    // User info
    country: "",
    id: ""
  };
}

export default createStore({
  state() {
    return getInitialState();
  },
  actions: {
    async getUpdatedToken({ getters, commit }) {
      if (getters.expired) {
        return await getRefreshedAccessToken(getters.refresh).then(result => {
          const { accessToken, refreshToken, expiry } = result;
          commit("setAccessToken", accessToken);
          commit("setExpiry", expiry);
          commit("setRefreshToken", refreshToken);
          return accessToken;
        });
      }
      return new Promise(resolve => {
        resolve(getters.access);
      });
    },
    reset({ state }) {
      const freshState = getInitialState();
      Object.keys(freshState).forEach(key => {
        state[key] = freshState[key];
      });
    }
  },
  getters: {
    access: state => state.accessToken,
    expired: state => new Date().getTime() >= state.expiry - 3 * 60 * 1000,
    id: state => state.id,
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
    setExpiry: (state: CuratorState, payload: number) =>
      (state.expiry = payload),
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
