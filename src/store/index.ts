import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      isLoggedIn: false
    };
  },
  mutations: {
    login: (state: any) => (state.isLoggedIn = true),
    logout: (state: any) => (state.isLoggedIn = false)
  }
});
