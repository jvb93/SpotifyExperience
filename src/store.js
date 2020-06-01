import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: "",
    currentTrackId: ""
  },
  mutations: {
    setAccessToken(state, payload) {
      state.accessToken = payload;
    },
    setCurrentTrackId(state, payload) {
      state.currentTrackId = payload;
    }
  },
  actions: {}
});
