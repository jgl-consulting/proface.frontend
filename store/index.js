import { SET_CURRENT_TITLE } from "../util/mutatitons-types";

export default {
  state: () => {
    return {
      currentTitle: 'Inicio'
    }
  },
  mutations: {
    [SET_CURRENT_TITLE](state, title){
      state.currentTitle = title;
    }
  },
  actions: {
    loadCurrentTitle({ commit }, title) {
      commit(SET_CURRENT_TITLE, title);
    }
  }
}