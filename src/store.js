import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: ""
  },
  mutations: {
    setAccessToken(state, payload) {
      state.accessToken = payload;
    }
  },
  actions: {}
});
