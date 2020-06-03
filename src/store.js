import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentTrackId: ""
  },
  mutations: {
    setCurrentTrackId(state, payload) {
      state.currentTrackId = payload;
    }
  },
  actions: {}
});
