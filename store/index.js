import { SET_CURRENT_TITLE } from "@/util/mutations-types";

export const state = () => ({
  currentTitle: 'Inicio'
})

export const mutations = {
  [SET_CURRENT_TITLE](state, title){
    state.currentTitle = title;
  }
}
export const actions =  {
  loadCurrentTitle({ commit }, title) {
    commit(SET_CURRENT_TITLE, title);
  }
}
