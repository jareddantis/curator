import { createStore } from "vuex";
import VuexPersistence from "vuex-persist";
import { getRefreshedAccessToken, getUserInfo } from "@/api/spotify-auth";

const vuexLocal = new VuexPersistence({
  key: "curator",
  storage: window.localStorage,
  reducer(state: CuratorState) {
    return {
      accessToken: state.accessToken,
      expiry: state.expiry,
      refreshToken: state.refreshToken,
      stateToken: state.stateToken,
      codeVerifier: state.codeVerifier
    };
  }
});

function getInitialState(): CuratorState {
  return {
    // User auth
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
      let accessToken = getters.access;

      if (getters.expired || !getters.access) {
        accessToken = await getRefreshedAccessToken(getters.refresh).then(
          ({ accessToken, refreshToken, expiry }) => {
            commit("setAccessToken", accessToken);
            commit("setExpiry", expiry);
            commit("setRefreshToken", refreshToken);
            return accessToken;
          }
        );
      }

      if (!getters.id || !getters.country) {
        const { country, id } = await getUserInfo(accessToken);
        commit("setCountry", country);
        commit("setID", id);
      }

      return new Promise(resolve => {
        resolve(accessToken);
      });
    }
  },
  getters: {
    access: state => state.accessToken,
    country: state => state.country,
    expired: state => new Date().getTime() >= state.expiry - 3 * 60 * 1000,
    id: state => state.id,
    isLoggedIn: state => !!state.refreshToken,
    refresh: state => state.refreshToken
  },
  mutations: {
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
